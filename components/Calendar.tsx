"use dom";
import "../src/global.css";
import React, { useState } from "react";

const Calendar = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10)); // November 2025
  const minDate = new Date(2025, 10, 15); // Disable everything BEFORE Nov 15, 2025

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
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };
  const isBeforeMin = (date: Date) => {
    return date.getTime() < minDate.getTime();
  };

  const isBlockedDate = (date: Date) => {
    return blockedDates.some((d) => d.toDateString() === date.toDateString());
  };
  const handleDateClick = (date: Date) => {
    // If selecting check-in OR resetting
    if (!checkIn || (checkIn && checkOut) || date < checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }

    // If selecting check-out
    const isDisabledRange = blockedDates.some((d) => d > checkIn! && d < date);

    if (isDisabledRange) {
      // ❌ Prevent choosing this checkout
      return;
    }

    // Otherwise allow
    setCheckOut(date);
  };
  const isInRange = (date: any) => {
    if (!checkIn || !checkOut) return false;

    // If the date itself is disabled → remove range styling
    if (isBlockedDate(date) || isBeforeMin(date)) return false;

    // Range must NOT cross a blocked date
    const blockedInsideRange = blockedDates.some(
      (d) => d > checkIn && d < checkOut
    );

    if (blockedInsideRange) return false;

    return date > checkIn && date < checkOut;
  };
  const isInvalidCheckout = (date: Date) => {
    if (!checkIn) return false; // can't evaluate before selecting check-in

    // Date must be AFTER check-in for checkout
    if (date <= checkIn) return false;

    // If ANY blocked date is inside checkIn → date range
    const causesInvalidRange = blockedDates.some(
      (d) => d > checkIn && d < date
    );

    return causesInvalidRange;
  };
  const isSelected = (date: Date) => {
    if (!checkIn) return false;

    // Only check-in selected
    if (!checkOut) {
      return date.getTime() === checkIn.getTime();
    }

    // Both check-in & check-out exist → safe to access
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
      <div className="mb-8">
        <h3 className="text-base font-semibold mb-4">
          {months[date.getMonth()]} {date.getFullYear()}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} />
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
              <button
                key={day}
                onClick={() => !disabled && handleDateClick(dateObj)}
                disabled={disabled}
                className={`
                    relative aspect-square flex items-center justify-center text-sm
                    transition-colors rounded-full
                
                    ${
                      selected ? "bg-gray-900 text-white font-semibold z-2" : ""
                    }
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
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Change dates</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            X
          </button>
        </div>

        {renderCalendar(0)}
        {renderCalendar(1)}

        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={clearDates}
            className="text-base font-semibold underline hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
          >
            Clear dates
          </button>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Save
          </button>
        </div>

        {(checkIn || checkOut) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <p>
              <strong>Check-in:</strong>{" "}
              {checkIn ? checkIn.toLocaleDateString() : "Not selected"}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {checkOut ? checkOut.toLocaleDateString() : "Not selected"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

{
}
