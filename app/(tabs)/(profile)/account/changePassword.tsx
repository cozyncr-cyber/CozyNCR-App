import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { account } from "@/lib/appwrite";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {}
  );
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async () => {
    let newErrors: any = {};
    setSuccess(false);

    if (!oldPassword || !newPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (newPassword.length < 8) {
      newErrors.password = "Password must be 8+ characters";
    }

    if (newPassword && confirm && newPassword !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      await account.updatePassword(newPassword, oldPassword);
      setSuccess(true);

      Alert.alert("Success", "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 gap-y-4 bg-white">
      {success && (
        <View className="p-3 rounded-xl bg-green-50 border border-green-200">
          <Text className="text-green-700 font-semibold">
            Password changed successfully
          </Text>
        </View>
      )}

      <TextInput
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholderTextColor="#9CA3AF"
        placeholder="Current password"
        secureTextEntry
        className="border rounded-xl px-4 py-3"
      />
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#9CA3AF"
        placeholder="New password"
        secureTextEntry
        className="border rounded-xl px-4 py-3"
      />
      {errors.password && (
        <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
      )}

      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholderTextColor="#9CA3AF"
        placeholder="Confirm password"
        secureTextEntry
        className="border rounded-xl px-4 py-3"
      />
      {errors.confirm && (
        <Text className="text-red-500 text-sm mt-1">{errors.confirm}</Text>
      )}

      <TouchableOpacity
        disabled={loading}
        onPress={handleChangePassword}
        className="bg-gray-900 py-4 rounded-2xl mt-2"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Saving..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
