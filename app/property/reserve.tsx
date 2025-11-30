import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";
import { useProperty } from "@/src/contexts/PropertyContext";
import Calendar from "@/components/Calendar";
import Guests from "@/components/Guests";
import PriceModal from "@/components/PriceModal";
import TimeModal from "@/components/TimeModal";

export default function Booking() {
  const { data, loading } = useProperty();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const [bookingType, setBookingType] = useState("daily");
  const [hours, setHours] = useState("11 AM - 2 PM");
  const [guests, setGuests] = useState("1 adult");
  const [priceOpen, setPriceOpen] = useState(false);

  // Helper formatters
  const formatSingle = (d: Date) => d.toLocaleDateString();
  const formatRange = (start: Date, end: Date) =>
    `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;

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

  const router = useRouter();

  const bookingTypes = [
    { id: "3hours", label: "3 Hours", price: 2500 },
    { id: "6hours", label: "6 Hours", price: 12000 },
    { id: "12hours", label: "12 Hours", price: 18000 },
    { id: "daily", label: "Daily", price: 30179.07 },
  ];

  const currentBooking =
    bookingTypes.find((b) => b.id === bookingType) || bookingTypes[0];

  const nights = 5;
  const subtotal =
    currentBooking.price * (bookingType === "daily" ? nights : 1);
  const taxes = Math.round(subtotal * 0.158);
  const total = subtotal + taxes;

  const isHourly =
    bookingType === "3hours" ||
    bookingType === "6hours" ||
    bookingType === "12hours";
  const isHourlyType = (t: string) =>
    t === "3hours" || t === "6hours" || t === "12hours";

  const handleChangeBookingType = (newType: string) => {
    setBookingType((prevType) => {
      const wasHourly = isHourlyType(prevType);
      const isHourlyNow = isHourlyType(newType);

      if (checkInDate) {
        // range → single
        if (!wasHourly && isHourlyNow) {
          setCheckOutDate(null);
          setDates(formatSingle(checkInDate));
        }

        // single → range
        if (wasHourly && !isHourlyNow) {
          const end = new Date(checkInDate);
          end.setDate(end.getDate() + 1);
          setCheckOutDate(end);
          setDates(formatRange(checkInDate, end));
        }
      }

      return newType;
    });
  };
  if (loading) return null;

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
                source={{ uri: data.images[0] }}
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
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2">Booking type</Text>

              <View className="grid grid-cols-3 gap-2">
                {bookingTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => handleChangeBookingType(type.id)}
                    className={`
      flex-1 py-2 px-3 rounded-lg text-sm font-medium
      ${bookingType === type.id ? "bg-gray-900" : "bg-gray-100"}
    `}
                  >
                    <Text
                      className={`text-center ${
                        bookingType === type.id ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
            <View className="flex-row items-center justify-between py-3">
              <View>
                <Text className="text-sm font-semibold mb-1">Total price</Text>

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
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-3">Price details</Text>

            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-700">
                  {bookingType === "daily" ? `${nights} nights` : "1 session"} ×
                  ₹{currentBooking.price.toLocaleString("en-IN")}
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
          <Pressable className="w-full bg-gray-900 py-4 rounded-xl flex-row items-center justify-center">
            <Text className="text-white text-base font-semibold">
              Continue to <Text className="italic">Razorpay</Text>
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
            onSave={(guestString: string) => {
              setGuests(guestString);
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
          <Calendar
            mode={isHourlyType(bookingType) ? "single" : "range"}
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
            initialTime={hours} // preselect previously chosen time
            unavailableSlots={
              [
                // example: mark some slots as unavailable
                // "11 AM - 2 PM",
                // "2 PM - 5 PM",
              ]
            }
            onClose={() => setTimeModalOpen(false)}
            onSave={(slot: string) => {
              setHours(slot);
              setTimeModalOpen(false);
            }}
          />
        </ScrollView>
      </Modal>

      <PriceModal
        visible={priceOpen}
        onClose={() => setPriceOpen(false)}
        nights={nights}
        pricePerNight={currentBooking.price}
        total={total}
        datesLabel={dates}
        cancellationText="Free cancellation before 11 December"
      />
    </ScrollView>
  );
}
