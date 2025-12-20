import Feather from "@expo/vector-icons/Feather";
import React, { useState, useMemo, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TimeModalProps {
  bookingType: "3hours" | "6hours" | "12hours";
  openMinutes: number;
  closeMinutes: number;
  bufferMinutes: number;
  onSave: (slot: string) => void;
  onClose: () => void;
  initialTime?: string | null;

  bookings?: {
    startTime: string;
    endTime: string;
    status: string;
  }[];

  // ✅ ADD THIS
  selectedDate: Date;
}
/* ---------------- SLOT GENERATION ---------------- */

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

  while (cursor + durationMinutes <= closeMinutes) {
    const start = cursor;
    const end = cursor + durationMinutes;
    slots.push(formatRangeMinutes(start, end));
    cursor = end + bufferMinutes;
  }

  return slots;
}

/* ---------------- COMPONENT ---------------- */

export default function TimeModal({
  bookingType,
  openMinutes,
  closeMinutes,
  bufferMinutes,
  onSave,
  onClose,
  initialTime,
  bookings = [],
  selectedDate,
}: TimeModalProps) {
  const slots = useMemo(
    () => generateSlots(bookingType, openMinutes, closeMinutes, bufferMinutes),
    [bookingType, openMinutes, closeMinutes, bufferMinutes]
  );

  /* ✅ Compute unavailable slots safely */
  const unavailableSlots = useMemo(() => {
    if (!bookings.length) return [];

    return slots.filter((slot) => {
      const { start, end } = parseSlotRange(slot);

      return bookings.some((b) => {
        if (b.status !== "confirmed") return false;

        const bookingStart = new Date(b.startTime);
        const bookingEnd = new Date(b.endTime);

        // ✅ CRITICAL FIX: only block slots for SAME DATE
        if (bookingStart.toDateString() !== selectedDate.toDateString()) {
          return false;
        }

        const bs = bookingStart.getHours() * 60 + bookingStart.getMinutes();
        const be = bookingEnd.getHours() * 60 + bookingEnd.getMinutes();

        return start < be && end > bs;
      });
    });
  }, [slots, bookings, selectedDate]);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /* ✅ Selection logic */
  useEffect(() => {
    if (!slots.length) {
      setSelectedTime(null);
      return;
    }

    if (
      initialTime &&
      slots.includes(initialTime) &&
      !unavailableSlots.includes(initialTime)
    ) {
      setSelectedTime(initialTime);
      return;
    }

    // ✅ AUTO-SELECT FIRST AVAILABLE SLOT
    const firstAvailable = slots.find((s) => !unavailableSlots.includes(s));

    setSelectedTime(firstAvailable || null);
  }, [slots, initialTime, unavailableSlots]);

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
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

            <Text className="text-sm text-gray-600 mb-3">
              Available slots ({bookingType})
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-6">
              {slots.map((slot) => {
                const active = selectedTime === slot;
                const disabled = unavailableSlots.includes(slot);

                return (
                  <Pressable
                    key={slot}
                    disabled={disabled}
                    onPress={() => !disabled && setSelectedTime(slot)}
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

            <Pressable
              disabled={!selectedTime}
              onPress={() => selectedTime && onSave(selectedTime)}
              className={`w-full py-4 rounded-xl ${
                selectedTime ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-base font-semibold text-center ${
                  selectedTime ? "text-white" : "text-gray-400"
                }`}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- HELPERS ---------------- */

const labelToMinutes = (label: string) => {
  const [time, suffix] = label.split(" ");
  let [h, m = "0"] = time.split(":").map(Number);

  if (suffix === "PM" && h !== 12) h += 12;
  if (suffix === "AM" && h === 12) h = 0;

  return h * 60 + Number(m);
};

const parseSlotRange = (slot: string) => {
  const [start, end] = slot.split(" - ");
  return {
    start: labelToMinutes(start),
    end: labelToMinutes(end),
  };
};

const minutesToLabel = (mins: number) => {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const h12 = ((h24 + 11) % 12) + 1;
  const suffix = h24 >= 12 ? "PM" : "AM";
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
};

const formatRangeMinutes = (start: number, end: number) =>
  `${minutesToLabel(start)} - ${minutesToLabel(end)}`;
