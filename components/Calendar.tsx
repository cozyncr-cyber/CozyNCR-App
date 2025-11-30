import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

interface CalendarOnSavePayload {
  label: string;
  checkIn: Date;
  checkOut: Date | null;
  mode: "range" | "single";
}

interface CalendarProps {
  onSave: (payload: CalendarOnSavePayload) => void;
  onClose: () => void;
  mode?: "range" | "single"; // 🔥 NEW
}

export default function Calendar({
  onSave,
  onClose,
  mode = "range",
}: CalendarProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10));

  const minDate = new Date(2025, 10, 15);

  const blockedDates = [
    new Date(2025, 10, 20),
    new Date(2025, 10, 22),
    new Date(2025, 11, 5),
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: any) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const isBeforeMin = (date: Date) => date.getTime() < minDate.getTime();

  const isBlockedDate = (date: Date) =>
    blockedDates.some((d) => d.toDateString() === date.toDateString());

  const handleDateClick = (date: Date) => {
    // SINGLE DATE MODE (hourly)
    if (mode === "single") {
      if (isBeforeMin(date) || isBlockedDate(date)) return;
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // RANGE MODE
    if (!checkIn || (checkIn && checkOut) || date < checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    const blockedInside = blockedDates.some((d) => d > checkIn! && d < date);
    if (blockedInside) return;

    setCheckOut(date);
  };

  const isInRange = (date: Date) => {
    if (mode === "single") return false;
    if (!checkIn || !checkOut) return false;
    if (isBlockedDate(date) || isBeforeMin(date)) return false;

    const invalidInBetween = blockedDates.some(
      (d) => d > checkIn && d < checkOut
    );
    if (invalidInBetween) return false;

    return date > checkIn && date < checkOut;
  };

  const isInvalidCheckout = (date: Date) => {
    if (mode === "single") return false;
    if (!checkIn) return false;
    if (date <= checkIn) return false;

    return blockedDates.some((d) => d > checkIn && d < date);
  };

  const isSelected = (date: Date) => {
    if (!checkIn) return false;

    if (mode === "single") {
      return date.getTime() === checkIn.getTime();
    }

    if (!checkOut) {
      return date.getTime() === checkIn.getTime();
    }
    return (
      date.getTime() === checkIn.getTime() ||
      date.getTime() === checkOut.getTime()
    );
  };

  const renderCalendar = (monthOffset = 0) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset
    );

    const { firstDay, daysInMonth } = getDaysInMonth(date);

    const blanks = Array(firstDay).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">
          {months[date.getMonth()]} {date.getFullYear()}
        </Text>

        {/* Header row */}
        <View className="flex-row justify-between mb-2">
          {days.map((d, i) => (
            <Text
              key={i}
              className="w-8 text-center text-xs font-medium text-gray-500"
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Days grid */}
        <View className="flex-row flex-wrap">
          {/* blanks */}
          {blanks.map((_, i) => (
            <View
              key={`blank-${i}`}
              className="h-8 items-center justify-center"
              style={{ width: `${100 / 7}%` }} // 1/7 of the row
            />
          ))}

          {daysArray.map((day) => {
            const dateObj = new Date(date.getFullYear(), date.getMonth(), day);

            const selected = isSelected(dateObj);
            const inRange = isInRange(dateObj);
            const disabled =
              isBeforeMin(dateObj) ||
              isBlockedDate(dateObj) ||
              isInvalidCheckout(dateObj);

            return (
              <Pressable
                key={day}
                disabled={disabled}
                onPress={() => handleDateClick(dateObj)}
                className={`
                  relative aspect-square flex items-center justify-center text-sm
                  transition-colors rounded-full
              
                  ${selected ? "bg-gray-900 text-white font-semibold z-[2]" : ""}
                  ${inRange ? "bg-gray-100 rounded-none" : ""}
                  ${
                    inRange
                      ? "before:content-[''] z-1 before:absolute before:inset-y-0 before:-left-1/3 before:-right-1/3 before:bg-gray-100 before:z-[-1]"
                      : ""
                  }
              
                  ${
                    disabled
                      ? "opacity-40 cursor-not-allowed text-gray-400"
                      : "hover:border hover:border-gray-900"
                  }
                `}
                style={{ width: `${100 / 7}%` }} // 7 columns
              >
                <Text
                  className={`text-sm ${
                    selected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleSave = () => {
    if (!checkIn) return;

    if (mode === "single") {
      const label = checkIn.toLocaleDateString();
      onSave({
        label,
        checkIn,
        checkOut: null,
        mode,
      });
      return;
    }

    if (!checkOut) return;

    const label = `${checkIn.toLocaleDateString()} – ${checkOut.toLocaleDateString()}`;
    onSave({
      label,
      checkIn,
      checkOut,
      mode,
    });
  };

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center">
      <View className="bg-white  w-full h-full px-6">
        <View className="flex-row items-center justify-between py-6 sticky top-0 bg-white z-10">
          <Text className="text-2xl font-semibold">
            {mode === "single" ? "Select date" : "Change dates"}
          </Text>
          <Pressable onPress={onClose} className="p-2">
            <Feather name="x" size={24} color="black" />
          </Pressable>
        </View>

        {renderCalendar(0)}
        {renderCalendar(1)}

        {/* Footer */}
        <View className="flex-row items-center justify-between bg-white py-4 border-t sticky bottom-0">
          <Pressable onPress={clearDates} className="px-4 py-2 rounded-lg">
            <Text className="text-base font-semibold underline">
              Clear dates
            </Text>
          </Pressable>
          <Pressable
            className="bg-gray-900 px-6 py-3 rounded-lg"
            onPress={handleSave}
          >
            <Text className="text-white font-semibold">Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
