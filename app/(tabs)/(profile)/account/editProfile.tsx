import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Camera, User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@/src/contexts/UserContext";
import {
  databases,
  storage,
  ID,
  getFileUrl,
  DATABASE_ID,
  PROFILES_TABLE_ID,
  bucketId,
} from "@/lib/appwrite";

interface ProfileForm {
  fullName: string;
  city: string;
  dob: string;
  phone: string;
  avatar: string | null;
}

const EditProfile: React.FC = () => {
  const user = useUser();
  const userId = user?.current?.$id ?? user?.$id; // support both shapes

  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    city: "",
    dob: "",
    phone: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ===== FETCH PROFILE =====
  const loadProfile = async () => {
    if (!userId) return;

    try {
      const profile = await databases.getDocument(
        DATABASE_ID,
        PROFILES_TABLE_ID,
        userId
      );

      setProfileForm({
        fullName: profile.name ?? "",
        city: profile.location ?? "",
        dob: profile.dob ?? "",
        phone: profile.phone ?? "",
        avatar: profile.avatarUrl ?? null,
      });

      setAvatarPreview(profile.avatarUrl ?? null);
    } catch (e) {
      console.log("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  // ===== PICK AVATAR =====
  const handleAvatarChange = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      setAvatarPreview(asset.uri ?? null);

      // upload to Appwrite Storage
      if (asset.uri) {
        const file = {
          uri: asset.uri,
          name: `avatar-${userId}.jpg`,
          type: "image/jpeg",
        } as any;

        const uploaded = await storage.createFile(bucketId, ID.unique(), file);
        const url = getFileUrl(uploaded.$id);

        setProfileForm((prev) => ({ ...prev, avatar: url }));
      }
    } catch (e) {
      console.warn("Image picker error", e);
      Alert.alert("Error", "Could not open image picker.");
    }
  };

  // ===== SAVE PROFILE =====
  const handleSave = async () => {
    if (!userId) return;

    try {
      await databases.updateDocument(DATABASE_ID, PROFILES_TABLE_ID, userId, {
        name: profileForm.fullName,
        location: profileForm.city,
        dob: profileForm.dob,
        phone: profileForm.phone,
        avatarUrl: profileForm.avatar,
        lastImageUpdate: new Date().toISOString(),
      });

      setSuccess(true);
    } catch (e) {}
  };

  const isFormValid =
    !!profileForm.fullName &&
    !!profileForm.city &&
    !!profileForm.dob &&
    !!profileForm.phone;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        className="flex-1"
      >
        {success && (
          <View className="mx-4 mt-4 mb-2 p-4 rounded-2xl bg-green-50 border border-green-200">
            <Text className="text-green-700 font-semibold">
              Profile updated successfully
            </Text>
            <Text className="text-green-700 text-sm">
              Your changes have been saved.
            </Text>
          </View>
        )}
        <View className="px-4 py-8 items-center border-b border-gray-200">
          <View className="relative">
            <View className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-xl overflow-hidden">
              {avatarPreview ? (
                <Image
                  source={{ uri: avatarPreview }}
                  className="w-full h-full"
                />
              ) : (
                <View className="flex-1 items-center justify-center bg-gray-200">
                  <User size={64} color="#9ca3af" />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleAvatarChange}
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gray-900 items-center justify-center shadow-lg"
            >
              <Camera size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600 mt-4">
            Tap camera icon to change photo
          </Text>
        </View>

        <View className="px-4 py-6 space-y-5">
          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </Text>
            <TextInput
              value={profileForm.fullName}
              onChangeText={(text) => handleChange("fullName", text)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              City
            </Text>
            <TextInput
              value={profileForm.city}
              onChangeText={(text) => handleChange("city", text)}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Date of Birth
            </Text>
            <TextInput
              value={profileForm.dob}
              onChangeText={(text) => handleChange("dob", text)}
              placeholder="YYYY-MM-DD"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </Text>
            <TextInput
              keyboardType="phone-pad"
              value={profileForm.phone}
              onChangeText={(text) => handleChange("phone", text)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl"
            />
          </View>

          <View className="mt-2 p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <Text className="text-sm text-gray-700">
              <Text className="font-semibold">Note:</Text> Changes to your phone
              number may require verification. Your personal information is kept
              private and secure.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-4 py-4 border-t border-gray-200 bg-white">
        <TouchableOpacity
          disabled={!isFormValid}
          onPress={handleSave}
          activeOpacity={0.8}
          className={
            isFormValid
              ? "w-full py-4 rounded-2xl bg-gray-900"
              : "w-full py-4 rounded-2xl bg-gray-200"
          }
        >
          <Text
            className={
              isFormValid
                ? "text-center font-semibold text-white"
                : "text-center font-semibold text-gray-400"
            }
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
