import React from "react";
import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Success() {
  const router = useRouter();
  const { bookingId, total, bookingType } = useLocalSearchParams<{
    bookingId?: string;
    total?: string;
    bookingType?: string;
  }>();

  return (
    <View className="flex-1 bg-white items-center justify-between px-6">
      <View className="flex-1 items-center justify-center h-auto pt-10">
        <Feather name="check-circle" size={124} color="green" />
        <Text className="text-2xl font-semibold mb-2 text-green-600">
          Booking successful{" "}
        </Text>

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
      </View>
      <Pressable
        onPress={() => router.push("/")}
        className="rounded-md px-6 py-3 mb-10"
      >
        <Text className="font-medium text-lg underline">Return to home</Text>
      </Pressable>
    </View>
  );
}
