// Calendar.tsx
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";

export interface CalendarOnSavePayload {
  label: string;
  checkIn: Date;
  checkOut: Date | null;
  mode: "range" | "single";
}

interface CalendarProps {
  onSave: (payload: CalendarOnSavePayload) => void;
  onClose: () => void;
  mode?: "range" | "single";
  checkoutOnlyDates?: Date[]; // optional; parent can pass
  /**
   * onMount allows the parent to receive an object with actions, e.g. { save, getSelection }
   * so parent can programmatically call save() when needed (e.g. on Next button).
   */
  onMount?: (actions: {
    save: () => void;
    getSelection: () => CalendarOnSavePayload | null;
  }) => void;
}

const isSameDay = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
};

export default function Calendar({
  onSave,
  onClose,
  mode = "range",
  checkoutOnlyDates = [],
  onMount,
}: CalendarProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

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

  const isCheckoutOnlyDate = (date: Date) =>
    checkoutOnlyDates.some((d) => d.toDateString() === date.toDateString());

  const handleDateClick = (date: Date) => {
    const checkoutOnly = isCheckoutOnlyDate(date);

    // SINGLE DATE MODE -> cannot pick checkout-only as single
    if (mode === "single") {
      if (isBeforeMin(date) || isBlockedDate(date)) return;
      if (checkoutOnly) {
        showToast("This date is only available for checkout.");
        return;
      }
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // RANGE MODE
    const choosingCheckIn =
      !checkIn || (checkIn && checkOut) || date < checkIn!;

    if (choosingCheckIn) {
      // can't choose checkout-only as check-in
      if (checkoutOnly) {
        showToast("This date is only available for checkout.");
        return;
      }
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // choosing checkout
    const blockedInside = blockedDates.some((d) => d > checkIn! && d < date);
    if (blockedInside) {
      showToast("Selected range includes blocked dates.");
      return;
    }

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
              style={{ width: `${100 / 7}%` }}
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

            const checkoutOnly = isCheckoutOnlyDate(dateObj);
            const isStart = isSameDay(checkIn, dateObj);
            const isEnd = isSameDay(checkOut, dateObj);

            // background for the range (no pseudo-elements)
            const showRangeBg = inRange || isStart || isEnd;

            return (
              <View
                key={day}
                style={{ width: `${100 / 7}%` }}
                className="aspect-square items-center justify-center relative"
              >
                {showRangeBg && (
                  <View
                    className={[
                      "absolute inset-y-0 left-0 right-0 ",
                      isStart && !isEnd ? "rounded-l-full" : "",
                      isEnd && !isStart ? "rounded-r-full" : "",
                      isStart && isEnd ? "rounded-full" : "",
                      "bg-gray-100",
                    ].join(" ")}
                  />
                )}

                <Pressable
                  disabled={disabled}
                  onPress={() => handleDateClick(dateObj)}
                  className={[
                    "relative rounded-full items-center justify-center w-full h-full",
                    selected ? "bg-gray-900" : "",
                    disabled ? "opacity-40" : "",
                  ].join(" ")}
                  style={{ aspectRatio: 1 }}
                >
                  <Text
                    className={[
                      "text-sm",
                      selected
                        ? "text-white font-semibold"
                        : checkoutOnly
                          ? "text-indigo-500"
                          : "text-gray-800",
                      disabled ? "text-gray-400" : "",
                    ].join(" ")}
                  >
                    {day}
                  </Text>
                </Pressable>
              </View>
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

  const internalHandleSave = () => {
    if (!checkIn) {
      showToast("Pick a check-in date first.");
      return;
    }

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

    if (!checkOut) {
      showToast("Pick a check-out date.");
      return;
    }

    const label = `${checkIn.toLocaleDateString()} – ${checkOut.toLocaleDateString()}`;
    onSave({
      label,
      checkIn,
      checkOut,
      mode,
    });
  };

  useEffect(() => {
    if (onMount) {
      onMount({
        save: internalHandleSave,
        getSelection: () => {
          if (!checkIn) return null;
          return {
            label:
              mode === "single"
                ? checkIn.toLocaleDateString()
                : checkOut
                  ? `${checkIn.toLocaleDateString()} – ${checkOut.toLocaleDateString()}`
                  : checkIn.toLocaleDateString(),
            checkIn,
            checkOut,
            mode,
          } as CalendarOnSavePayload;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, mode, onMount]);

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center relative">
      <View className="bg-white w-full h-full px-6">
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
            onPress={internalHandleSave}
          >
            <Text className="text-white font-semibold">Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Toast */}
      {toastMessage && (
        <View className="absolute bottom-8 left-0 right-0 items-center">
          <View className="bg-black/80 px-4 py-2 rounded-full">
            <Text className="text-white text-xs">{toastMessage}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
