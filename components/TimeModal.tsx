import Feather from "@expo/vector-icons/Feather";
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface TimeModalProps {
  bookingType: "3hours" | "6hours" | "12hours" | string;
  onSave: (slot: string) => void;
  onClose: () => void;
  initialTime?: string | null;
  unavailableSlots?: string[];
}

function formatHour(hour24: number): string {
  const h = ((hour24 + 11) % 12) + 1; // 0–23 -> 1–12
  const suffix = hour24 >= 12 && hour24 < 24 ? "PM" : "AM";
  return `${h} ${suffix}`;
}

function formatRange(start: number, end: number): string {
  const startLabel = formatHour(start);
  const endLabel = formatHour(end % 24);
  return `${startLabel} - ${endLabel}`;
}

function generateSlots(bookingType: string): string[] {
  const START = 11; // 11 AM
  const END = 23; // 11 PM

  if (bookingType === "3hours") {
    const duration = 3;
    const slots: string[] = [];
    for (let s = START; s + duration <= END; s += duration) {
      slots.push(formatRange(s, s + duration));
    }
    return slots;
  }

  if (bookingType === "6hours") {
    const duration = 6;
    const slots: string[] = [];
    for (let s = START; s + duration <= END; s += duration) {
      slots.push(formatRange(s, s + duration));
    }
    return slots;
  }

  if (bookingType === "12hours") {
    // exactly two: 11 AM - 11 PM, 11 PM - 11 AM
    return [formatRange(11, 23), formatRange(23, 11 + 24)];
  }

  return [];
}

export default function TimeModal({
  bookingType,
  onSave,
  onClose,
  initialTime,
  unavailableSlots = [],
}: TimeModalProps) {
  const slots = useMemo(() => generateSlots(bookingType), [bookingType]);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // pick initial selection:
  // 1. use initialTime if valid & not disabled
  // 2. else first non-disabled slot
  useEffect(() => {
    if (slots.length === 0) {
      setSelectedTime(null);
      return;
    }

    const isUnavailable = (slot: string) => unavailableSlots.includes(slot);

    if (
      initialTime &&
      slots.includes(initialTime) &&
      !isUnavailable(initialTime)
    ) {
      setSelectedTime(initialTime);
      return;
    }

    const firstAvailable = slots.find((slot) => !isUnavailable(slot)) || null;
    setSelectedTime(firstAvailable);
  }, [slots, initialTime, unavailableSlots]);

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center pt-4">
      <ScrollView
        className="w-full h-full"
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-3xl h-full w-full p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Select time</Text>
            <Pressable onPress={onClose}>
              <Text className="text-xl">
                <Feather name="x" size={24} color="black" />
              </Text>
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-3">
              Available slots ({bookingType})
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {slots.map((slot) => {
                const active = selectedTime === slot;
                const disabled = unavailableSlots.includes(slot);

                return (
                  <Pressable
                    key={slot}
                    onPress={() => !disabled && setSelectedTime(slot)}
                    disabled={disabled}
                    className={`
                      px-4 py-2.5 rounded-xl
                      ${
                        disabled
                          ? "bg-gray-100 opacity-40"
                          : active
                            ? "bg-gray-900"
                            : "bg-gray-100"
                      }
                    `}
                  >
                    <Text
                      className={`
                        text-sm font-medium
                        ${
                          disabled
                            ? "text-gray-400"
                            : active
                              ? "text-white"
                              : "text-gray-700"
                        }
                      `}
                    >
                      {slot}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            disabled={!selectedTime}
            onPress={() => selectedTime && onSave(selectedTime)}
            className={`
              w-full py-4 rounded-xl
              ${selectedTime ? "bg-gray-900" : "bg-gray-200"}
            `}
          >
            <Text
              className={`
                text-base font-semibold text-center
                ${selectedTime ? "text-white" : "text-gray-400"}
              `}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
