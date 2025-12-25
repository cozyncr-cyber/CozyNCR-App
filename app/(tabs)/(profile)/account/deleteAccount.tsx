import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { requestAccountDeletion } from "@/lib/services/auth";
import { useUser } from "@/src/contexts/UserContext";
import { useRouter } from "expo-router";

// Converted for: React Native + Expo + TypeScript + NativeWind
// Tailwind classes work using `className` prop

export default function DeleteAccount() {
  const { logout, current } = useUser();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };
  const handleConfirmDelete = async () => {
    try {
      // If somehow no user, just logout and exit
      if (!current?.$id) {
        logout();
        return;
      }

      const res = await requestAccountDeletion(current.$id);

      if (!res.success) {
        return alert(res.error);
      }

      setShowConfirmation(false);

      alert(
        "Your account deletion request has been submitted. You have been logged out."
      );

      logout();
      router.replace("/signin");
    } catch (e: any) {
      alert("You have been logged out.");
      try {
        logout();
      } catch {}
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      <View className="flex-1 items-center justify-center px-6 py-12">
        <View className="w-full max-w-md">
          <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} color="#dc2626" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
            Delete your account?
          </Text>

          <Text className="text-gray-600 text-center mb-2">
            This action is permanent and cannot be undone.
          </Text>

          <Text className="text-sm text-gray-500 text-center mb-8">
            All your data, bookings, and account information will be permanently
            deleted.
          </Text>

          <TouchableOpacity
            onPress={handleDeleteClick}
            activeOpacity={0.8}
            className="w-full py-4 bg-red-600 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Are you absolutely sure?
            </Text>

            <Text className="text-sm text-gray-600 mb-6">
              Once deleted, your account cannot be recovered. All your data will
              be permanently erased.
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleConfirmDelete}
                activeOpacity={0.8}
                className="w-full py-3 bg-red-600 rounded-xl"
              >
                <Text className="text-white text-center font-semibold">
                  Yes, Delete My Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancel}
                activeOpacity={0.8}
                className="w-full py-3 border-2 border-gray-900 rounded-xl"
              >
                <Text className="text-center font-semibold text-gray-900">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
