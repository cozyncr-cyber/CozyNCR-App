import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { account } from "@/lib/appwrite";

export default function ChangeEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setSuccess(false);

      await account.updateEmail({
        email,
        password,
      });

      setSuccess(true);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "Failed to update email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4 gap-y-4">
      <Text className="text-lg font-semibold">Change Email</Text>

      {success && (
        <View className="p-4 bg-green-50 border border-green-200 rounded-2xl">
          <Text className="text-green-700 font-semibold">
            Email updated successfully
          </Text>
          <Text className="text-green-700 text-sm">
            Please verify your new email if required.
          </Text>
        </View>
      )}

      <View>
        <Text className="font-medium mb-1">New Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter new email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border rounded-xl px-4 py-3"
        />
        {errors.email && (
          <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
        )}
      </View>

      <View>
        <Text className="font-medium mb-1 mt-2">Current Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter current password"
          secureTextEntry
          className="border rounded-xl px-4 py-3"
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
        )}
      </View>

      <TouchableOpacity
        disabled={loading}
        onPress={handleUpdate}
        className="bg-gray-900 py-4 rounded-2xl mt-4"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Updating..." : "Update Email"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
