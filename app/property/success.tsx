import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Success() {
  const router = useRouter();
  const { bookingId, total, bookingType } = useLocalSearchParams<{
    bookingId?: string;
    total?: string;
    bookingType?: string;
  }>();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-bold mb-2">Booking successful 🎉</Text>

      {total && (
        <Text className="text-base text-gray-700 mb-1">
          Amount paid: ₹{Number(total).toLocaleString("en-IN")}
        </Text>
      )}

      {bookingType && (
        <Text className="text-sm text-gray-600 mb-1">
          Booking type: {bookingType}
        </Text>
      )}

      {bookingId && (
        <Text className="text-xs text-gray-500 mb-6">
          Booking ID: {bookingId}
        </Text>
      )}

      <Pressable
        onPress={() => router.push("/")}
        className="bg-gray-900 rounded-xl px-6 py-3"
      >
        <Text className="text-white font-semibold">Back to home</Text>
      </Pressable>
    </View>
  );
}
