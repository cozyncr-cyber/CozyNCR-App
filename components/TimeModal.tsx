import Feather from "@expo/vector-icons/Feather";
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
interface TimeModalProps {
  bookingType: "3hours" | "6hours" | "12hours";
  openMinutes: number;
  closeMinutes: number;
  bufferMinutes: number;
  onSave: (slot: string) => void;
  onClose: () => void;
  initialTime?: string | null;
  unavailableSlots?: string[];
}
export function generateSlots(
  bookingType: "3hours" | "6hours" | "12hours",
  openMinutes: number,
  closeMinutes: number,
  bufferMinutes: number
): string[] {
  const durationMinutes =
    bookingType === "3hours" ? 180 : bookingType === "6hours" ? 360 : 720;

  const slots: string[] = [];
  let cursor = openMinutes;

  // 1️⃣ Normal forward slots
  while (cursor + durationMinutes <= closeMinutes) {
    const start = cursor;
    const end = cursor + durationMinutes;

    slots.push(formatRangeMinutes(start, end));

    cursor = end + bufferMinutes;
  }

  // 2️⃣ LAST SLOT SNAP (minute-accurate + buffer-safe)
  const lastStart = closeMinutes - durationMinutes;

  if (lastStart >= openMinutes) {
    const lastSlot = formatRangeMinutes(lastStart, closeMinutes);

    const overlapsExisting = slots.some((slot) => slot === lastSlot);

    // Ensure snapped slot does NOT violate buffer from previous slot
    const violatesBuffer =
      slots.length > 0 &&
      lastStart <
        openMinutes +
          slots.length * (durationMinutes + bufferMinutes) -
          bufferMinutes;

    if (!overlapsExisting && !violatesBuffer) {
      slots.push(lastSlot);
    }
  }
  return slots;
}
export default function TimeModal({
  bookingType,
  openMinutes,
  closeMinutes,
  bufferMinutes,
  onSave,
  onClose,
  initialTime,
  unavailableSlots = [],
}: TimeModalProps) {
  const slots = useMemo(
    () => generateSlots(bookingType, openMinutes, closeMinutes, bufferMinutes),
    [bookingType, openMinutes, closeMinutes, bufferMinutes]
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!slots.length) {
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

    setSelectedTime(slots.find((s) => !isUnavailable(s)) || null);
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
              <Feather name="x" size={24} color="black" />
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

const minutesToLabel = (mins: number) => {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  const suffix = h24 >= 12 ? "PM" : "AM";
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
};

const formatRangeMinutes = (start: number, end: number) =>
  `${minutesToLabel(start)} - ${minutesToLabel(end)}`;
