import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, Image, ScrollView, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";
import { useProperty } from "@/src/contexts/PropertyContext";
import Calendar from "@/components/Calendar";
import Guests from "@/components/Guests";
import PriceModal from "@/components/PriceModal";
import TimeModal from "@/components/TimeModal";
import { tablesDB, DATABASE_ID, BOOKINGS_TABLE_ID, ID } from "@/lib/appwrite";
import { useUser } from "@/src/contexts/UserContext";
// also your auth context to get current userId
// also you probably have current user somewhere, e.g. useAuth()

type BookingTypeId = "3hours" | "6hours" | "12hours" | "daily";

type BookingType = {
  id: BookingTypeId;
  label: string;
  price: number;
};

const defaultSlots: Record<BookingTypeId, string> = {
  "3hours": "11 AM - 2 PM",
  "6hours": "11 AM - 5 PM",
  "12hours": "9 AM - 9 PM",
  daily: "", // not used for daily
};
// Convert "11 AM" / "2 PM" to 24h
const parseTimeLabelToHour = (label: string): number | null => {
  const [hourStr, suffixRaw] = label.trim().split(" ");
  const suffix = suffixRaw?.toUpperCase();
  let hour = parseInt(hourStr, 10);
  if (isNaN(hour) || !suffix) return null;

  const isPM = suffix === "PM";

  // 12 AM -> 0, 12 PM -> 12, 1–11 PM -> +12
  if (hour === 12) {
    hour = isPM ? 12 : 0;
  } else if (isPM) {
    hour += 12;
  }

  return hour;
};

type ParsedSlot = {
  startHour: number;
  endHour: number;
  overnight: boolean;
};

// "11 AM - 2 PM" -> { startHour: 11, endHour: 14, overnight: false }
const parseSlot = (slot: string): ParsedSlot | null => {
  const [startLabel, endLabel] = slot.split("-");
  if (!startLabel || !endLabel) return null;

  const startHour = parseTimeLabelToHour(startLabel);
  const endHour = parseTimeLabelToHour(endLabel);

  if (startHour == null || endHour == null) return null;

  const overnight = endHour <= startHour; // e.g. 11 PM -> 11 AM
  return { startHour, endHour, overnight };
};

// Helpers
const formatSingle = (d: Date) => d.toLocaleDateString();
const formatRange = (start: Date, end: Date) =>
  `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;

const isHourlyType = (t: BookingTypeId) =>
  t === "3hours" || t === "6hours" || t === "12hours";

export default function Booking() {
  const { data, loading } = useProperty();
  const user = useUser();
  const router = useRouter();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const [bookingType, setBookingType] = useState<BookingTypeId>("daily");
  const [hours, setHours] = useState("");
  const [guests, setGuests] = useState("1 adult");

  // Initial dates (example: 7–12 Dec 2025)
  const initialCheckIn = new Date(2025, 11, 7); // Dec is month 11 (0-based)
  const initialCheckOut = new Date(2025, 11, 12);

  const [checkInDate, setCheckInDate] = useState<Date | null>(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    initialCheckOut
  );
  const [dates, setDates] = useState<string>(
    formatRange(initialCheckIn, initialCheckOut)
  );

  const isHourly = isHourlyType(bookingType);

  // Build booking types dynamically based on data.price_* values
  const bookingTypes: BookingType[] = useMemo(() => {
    if (!data) return [];

    const types: BookingType[] = [];

    if (data.price_3h != null) {
      types.push({ id: "3hours", label: "3 Hours", price: data.price_3h });
    }
    if (data.price_6h != null) {
      types.push({ id: "6hours", label: "6 Hours", price: data.price_6h });
    }
    if (data.price_12h != null) {
      types.push({ id: "12hours", label: "12 Hours", price: data.price_12h });
    }
    if (data.price_24h != null) {
      types.push({ id: "daily", label: "Daily", price: data.price_24h });
    }

    return types;
  }, [data]);

  // Ensure bookingType is always one of the available bookingTypes
  useEffect(() => {
    if (bookingTypes.length === 0) return;

    setBookingType((prev) => {
      const exists = bookingTypes.some((b) => b.id === prev);
      return exists ? prev : (bookingTypes[0].id as BookingTypeId);
    });
  }, [bookingTypes]);

  const currentBooking = useMemo(() => {
    if (bookingTypes.length === 0) return undefined;
    return bookingTypes.find((b) => b.id === bookingType) || bookingTypes[0];
  }, [bookingTypes, bookingType]);

  // Nights (for daily bookings)
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;

    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [checkInDate, checkOutDate]);

  // Price calculations
  const subtotal = useMemo(() => {
    if (!currentBooking) return 0;
    const quantity = bookingType === "daily" ? nights : 1;
    return currentBooking.price * quantity;
  }, [currentBooking, bookingType, nights]);

  const taxes = useMemo(() => Math.round(subtotal * 0.158), [subtotal]);
  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  // Keep date label in sync with booking type + selected dates
  useEffect(() => {
    if (!checkInDate) return;

    if (isHourly) {
      setDates(formatSingle(checkInDate));
    } else {
      const end = checkOutDate || checkInDate;
      setDates(formatRange(checkInDate, end));
    }
  }, [bookingType, checkInDate, checkOutDate, isHourly]);

  // Auto-update hours when switching to an hourly type
  useEffect(() => {
    if (!isHourly || !checkInDate) return;

    const slot = defaultSlots[bookingType];
    setHours(slot);

    const parsed = parseSlot(slot);
    if (parsed) {
      const { startHour, endHour, overnight } = parsed;

      const start = new Date(checkInDate);
      start.setHours(startHour, 0, 0, 0);

      const end = new Date(checkInDate);
      if (overnight) {
        end.setDate(end.getDate() + 1);
      }
      end.setHours(endHour, 0, 0, 0);

      setStartTime(start);
      setEndTime(end);
    }
  }, [bookingType, isHourly, checkInDate]);
  useEffect(() => {
    if (isHourly) return;
    if (!checkInDate) return;

    const start = new Date(checkInDate);
    start.setHours(15, 0, 0, 0); // e.g. 3:00 PM check-in

    const endBase = checkOutDate || checkInDate;
    const end = new Date(endBase);
    end.setHours(11, 0, 0, 0); // e.g. 11:00 AM check-out

    setStartTime(start);
    setEndTime(end);
  }, [isHourly, checkInDate, checkOutDate]);

  const handleChangeBookingType = (newType: BookingTypeId) => {
    setBookingType((prevType) => {
      const wasHourly = isHourlyType(prevType);
      const isHourlyNow = isHourlyType(newType);

      if (checkInDate) {
        // daily → hourly: collapse to single date
        if (!wasHourly && isHourlyNow) {
          setCheckOutDate(null);
        }

        // hourly → daily: create a simple 1-night range
        if (wasHourly && !isHourlyNow) {
          const end = new Date(checkInDate);
          end.setDate(end.getDate() + 1);
          setCheckOutDate(end);
        }
      }

      return newType;
    });
  };

  const handleContinueToRazorpay = async () => {
    console.log("Continue to Razorpay clicked", { startTime, endTime });

    if (!startTime || !endTime) {
      console.warn("Missing start/end time");
      return;
    }

    try {
      setSubmitting(true);

      const customerName = "John Doe";
      const customerId = user.current.$id;

      const guestCount = guestCounts.adults + guestCounts.children;

      await tablesDB.createRow({
        rowId: ID.unique(),
        databaseId: DATABASE_ID,
        tableId: BOOKINGS_TABLE_ID,
        data: {
          listingId: data!.$id,
          customerName,
          customerId,
          startTime: startTime.toISOString(), // 👈 Date column
          endTime: endTime.toISOString(), // 👈 Date column
          status: "pending",
          totalPrice: total,
          serviceType: isHourly ? "hourly" : "daily",
          bookingType,
          guestCount,
          childrenCount: guestCounts.children,
          infantCount: guestCounts.infants,
          petCount: guestCounts.pets,
        },
      });

      router.push("/property/success");
    } catch (err) {
      console.error("Error creating booking:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !data) return null;

  return (
    <ScrollView className="bg-white">
      <View className="min-h-screen bg-white">
        {/* Header */}
        <View className="sticky z-[2] top-0 bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
          <Text className="text-base font-semibold">Request to book</Text>

          <Pressable onPress={() => router.back()} className="p-2 -mr-2">
            <Feather name="x" size={24} color="black" />
          </Pressable>
        </View>

        <View className="px-4 py-4">
          {/* Property Card */}
          <View className="border border-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row gap-3 mb-4">
              <Image
                source={{ uri: data.images?.[0] }}
                className="w-20 h-20 rounded-lg"
              />

              <View className="flex-1">
                <Text className="text-sm font-semibold leading-tight mb-1">
                  {data.title}
                </Text>

                <View className="flex-row items-center gap-2 text-xs">
                  <View className="flex-row items-center gap-1">
                    <Star />
                    <Text className="font-semibold">4.92</Text>
                    <Text className="text-gray-600">(12)</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Booking Type Selector */}
            {bookingTypes.length > 0 && (
              <View className="mb-4  min-h-10 ">
                <Text className="text-sm font-semibold mb-2">Booking type</Text>

                <View className="flex gap-2">
                  {bookingTypes.map((type) => (
                    <Pressable
                      key={type.id}
                      onPress={() => handleChangeBookingType(type.id)}
                      className={`
                        flex-1 py-2 px-3 rounded-lg text-sm font-medium
                        ${
                          bookingType === type.id
                            ? "bg-gray-900"
                            : "bg-gray-100"
                        }
                      `}
                    >
                      <Text
                        className={`text-center ${
                          bookingType === type.id
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Dates */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View>
                <Text className="text-sm font-semibold mb-1">Date</Text>
                <Text className="text-sm text-gray-700">{dates}</Text>
              </View>

              <Pressable
                className="px-4 py-2 rounded-lg bg-gray-100"
                onPress={() => setCalendarOpen(true)}
              >
                <Text className="text-sm font-semibold">Change</Text>
              </Pressable>
            </View>

            {/* Hours – only for hourly bookings */}
            {isHourly && (
              <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
                <View>
                  <Text className="text-sm font-semibold mb-1">Hours</Text>
                  <Text className="text-sm text-gray-700">{hours}</Text>
                </View>

                <Pressable
                  className="px-4 py-2 rounded-lg bg-gray-100"
                  onPress={() => setTimeModalOpen(true)}
                >
                  <Text className="text-sm font-semibold">Change</Text>
                </Pressable>
              </View>
            )}

            {/* Guests */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
              <View>
                <Text className="text-sm font-semibold mb-1">Guests</Text>
                <Text className="text-sm text-gray-700">{guests}</Text>
              </View>

              <Pressable
                className="px-4 py-2 rounded-lg bg-gray-100"
                onPress={() => setGuestModalOpen(true)}
              >
                <Text className="text-sm font-semibold">Change</Text>
              </Pressable>
            </View>

            {/* Total Price */}
            {currentBooking && (
              <View className="flex-row items-center justify-between py-3">
                <View>
                  <Text className="text-sm font-semibold mb-1">
                    Total price
                  </Text>

                  <Text className="text-sm text-gray-700">
                    ₹{total.toLocaleString("en-IN")} including taxes{" "}
                    <Text className="underline">INR</Text>
                  </Text>
                </View>

                <Pressable
                  onPress={() => setPriceOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gray-100"
                >
                  <Text className="text-sm font-semibold">Details</Text>
                </Pressable>
              </View>
            )}

            {/* Cancellation Policy */}
            <View className="pt-3 border-t border-gray-200">
              <Text className="text-sm font-semibold mb-1">
                Cancellation Policy
              </Text>

              <Text className="text-sm text-gray-700">
                90% refund for cancellations made up to 24 hours before check-in{" "}
                <Text className="underline font-semibold">Full policy</Text>
              </Text>
            </View>
          </View>

          {/* Price Details */}
          {currentBooking && (
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-3">Price details</Text>

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-700">
                    {bookingType === "daily" ? `${nights} nights` : "1 session"}{" "}
                    × ₹{currentBooking.price.toLocaleString("en-IN")}
                  </Text>

                  <Text className="text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-700">Taxes</Text>
                  <Text className="text-gray-900">
                    ₹{taxes.toLocaleString("en-IN")}
                  </Text>
                </View>

                <View className="flex-row justify-between pt-3 border-t border-gray-200 font-semibold">
                  <Text>
                    Total <Text className="font-normal">INR</Text>
                  </Text>
                  <Text>₹{total.toLocaleString("en-IN")}</Text>
                </View>

                <Pressable onPress={() => setPriceOpen(true)}>
                  <Text className="text-sm underline font-semibold">
                    Price breakdown
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Notice */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-sm text-gray-700">
              The host has 24 hours to accept your request. You&apos;ll pay now,
              but get a full refund if the booking isn&apos;t confirmed.
            </Text>
          </View>

          <Text className="text-center text-sm text-gray-600 mb-4">
            You&apos;ll be directed to Razorpay to complete payment.
          </Text>

          {/* Continue Button */}
          <Pressable
            className={`w-full py-4 rounded-xl flex-row items-center justify-center ${
              submitting ? "bg-gray-400" : "bg-gray-900"
            }`}
            disabled={submitting}
            onPress={handleContinueToRazorpay}
          >
            <Text className="text-white text-base font-semibold">
              {submitting ? "Processing..." : "Continue to Razorpay"}
            </Text>
          </Pressable>

          <Text className="text-center text-xs text-gray-600 mt-3">
            By selecting the button, I agree to the{" "}
            <Text className="underline font-semibold">booking terms</Text>.
          </Text>
        </View>
      </View>

      {/* Guests Modal */}
      <Modal
        visible={guestModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGuestModalOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setGuestModalOpen(false)}
        />
        <ScrollView className="absolute bottom-0 w-full h-full bg-white rounded-t-3xl">
          <Guests
            onClose={() => setGuestModalOpen(false)}
            onSave={(result) => {
              setGuests(result.label);
              setGuestCounts({
                adults: result.adults,
                children: result.children,
                infants: result.infants,
                pets: result.pets,
              });
              setGuestModalOpen(false);
            }}
          />
        </ScrollView>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={calendarOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setCalendarOpen(false)}
        />
        <ScrollView className="absolute bottom-0 w-full h-full bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between py-6 sticky top-0 bg-white z-10">
            <Text className="text-2xl font-semibold">
              {isHourly ? "Select date" : "Change dates"}
            </Text>
            <Pressable onPress={() => setCalendarOpen(false)} className="p-2">
              <Feather name="x" size={24} color="black" />
            </Pressable>
          </View>
          <Calendar
            mode={isHourly ? "single" : "range"}
            checkoutOnlyDates={[new Date(2025, 10, 25), new Date(2025, 10, 27)]}
            onSave={({ label, checkIn, checkOut }) => {
              setCheckInDate(checkIn);
              setCheckOutDate(checkOut);
              setDates(label);
              setCalendarOpen(false);
            }}
            onClose={() => setCalendarOpen(false)}
          />
        </ScrollView>
      </Modal>

      {/* Time Modal */}
      <Modal
        visible={timeModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setTimeModalOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setTimeModalOpen(false)}
        />
        <ScrollView className="absolute bottom-0 w-full h-full bg-white rounded-t-3xl">
          <TimeModal
            bookingType={bookingType}
            initialTime={hours}
            unavailableSlots={[]}
            onClose={() => setTimeModalOpen(false)}
            onSave={(slot: string) => {
              setHours(slot);

              if (checkInDate) {
                const parsed = parseSlot(slot);
                if (parsed) {
                  const { startHour, endHour, overnight } = parsed;

                  const start = new Date(checkInDate);
                  start.setHours(startHour, 0, 0, 0);

                  const end = new Date(checkInDate);
                  if (overnight) {
                    end.setDate(end.getDate() + 1);
                  }
                  end.setHours(endHour, 0, 0, 0);

                  setStartTime(start);
                  setEndTime(end);
                }
              }

              setTimeModalOpen(false);
            }}
          />
        </ScrollView>
      </Modal>

      {/* Price Modal */}
      {currentBooking && (
        <PriceModal
          visible={priceOpen}
          onClose={() => setPriceOpen(false)}
          nights={nights}
          pricePerNight={currentBooking.price}
          subtotal={subtotal}
          datesLabel={dates}
          cancellationText="Free cancellation before 11 December"
        />
      )}
    </ScrollView>
  );
}
