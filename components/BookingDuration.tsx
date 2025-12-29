import React from "react";
import { View, Text, Pressable } from "react-native";

export type BookingDuration = "3h" | "6h" | "12h" | "24h" | null;

interface BookingDurationSelectorProps {
  value: BookingDuration;
  onChange: (value: BookingDuration) => void;
  title?: string;
}

const DURATIONS = [
  { id: "3h", label: "3 Hour" },
  { id: "6h", label: "6 Hour" },
  { id: "12h", label: "12 Hour" },
  { id: "24h", label: "Nightly" },
] as const;

export const BookingDurationSelector = ({
  value,
  onChange,
  title = "Booking duration",
}: BookingDurationSelectorProps) => {
  return (
    <View className="mb-2">
      <Text className="text-lg font-semibold mb-2">{title}</Text>

      <View className="flex-row flex-wrap gap-2">
        {DURATIONS.map((item) => {
          const active = value === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => onChange(active ? null : item.id)}
              className={`px-4 py-2.5 rounded-full border-2 ${
                active
                  ? "bg-gray-900 border-gray-900"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  active ? "text-white" : "text-gray-700"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
