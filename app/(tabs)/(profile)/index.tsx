/* eslint-disable eqeqeq */
import { useUser } from "@/src/contexts/UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
export default function Profile() {
  const user = useUser();
  return (
    <ScrollView className="bg-white">
      <View className="min-h-screen p-4 flex flex-col gap-6">
        <Text className="text-3xl font-semibold mt-8 mb-4 px-4">Profile</Text>
        {/* Cards */}
        <View className="flex flex-col gap-2">
          {/* CARD A */}
          <View className="flex-1 relative">
            <View className="bg-white rounded-3xl shadow-sm overflow-hidden py-4">
              {/* Image */}
              <View className="relative w-28 aspect-square rounded-full overflow-hidden mx-auto bg-orange-300">
                <Image
                  source={{
                    uri: user?.profileImage
                      ? user.profileImage
                      : "https://images.unsplash.com/photo-1750535135696-4421c9a90746?w=400&h=400&fit=crop",
                  }}
                  className="w-full h-full object-cover"
                />
              </View>

              {/* Content */}
              <View className="">
                <View className="flex flex-col items-center">
                  <Text className="text-xl font-semibold text-gray-900">
                    {user?.profile?.name || "Guest User"}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {user?.profile?.kycStatus == "verified" ? "Host" : "Guest"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => Linking.openURL("https://cozyncr.com")}
            className="bg-white rounded-3xl shadow-sm overflow-hidden py-6"
          >
            {/* Content */}
            <View className="">
              <View className="flex flex-col items-start px-10">
                <Text className="text-lg text-gray-900">Become a host</Text>
                <Text className="text-gray-600 text-xs">
                  List your property and start earning.
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
        <View className="w-full flex flex-col  border-b border-zinc-300">
          <Link href="/account">
            <View className="w-full h-14 flex flex-row items-center gap-4 px-2">
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#3f3f46"
              />
              <Text className="text-lg">Account Settings</Text>
            </View>
          </Link>
          <Link href="/notifications">
            <View className="w-full h-14 flex flex-row items-center gap-4 px-2">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#3f3f46"
              />
              <Text className="text-lg">Notification Settings</Text>
            </View>
          </Link>
          <Link href="/customer">
            <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2  border-b border-zinc-300">
              <FontAwesome6 name="circle-question" size={24} color="#3f3f46" />
              <Text className="text-lg">Customer Support</Text>
            </View>
          </Link>
          <Link href="/privacy">
            <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2">
              <MaterialIcons name="policy" size={24} color="#3f3f46" />
              <Text className="text-lg">Privacy Policy</Text>
            </View>
          </Link>
          <Link href="/terms">
            <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2 ">
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#3f3f46"
              />
              <Text className="text-lg">Terms & Conditions</Text>
            </View>
          </Link>
          <Pressable onPress={() => user.logout()}>
            <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2">
              <Ionicons name="exit-outline" size={24} color="#3f3f46" />
              <Text className="text-lg">Logout</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
