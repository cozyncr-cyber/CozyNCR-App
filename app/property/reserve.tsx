import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";
import { useProperty } from "@/src/contexts/PropertyContext";
import Calendar from "@/components/Calendar";
import Guests from "@/components/Guests";
export default function Booking() {
  const { data, loading } = useProperty();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState("daily");
  const [dates, setDates] = useState("7–12 Dec 2025");
  const [guests, setGuests] = useState("1 adult");
  const router = useRouter();

  const bookingTypes = [
    { id: "hourly", label: "Hourly", price: 2500 },
    { id: "6hours", label: "6 Hours", price: 12000 },
    { id: "daily", label: "Daily", price: 10179.07 },
  ];

  const currentBooking =
    bookingTypes.find((b) => b.id === bookingType) || bookingTypes[0];

  const nights = 5;
  const subtotal =
    currentBooking.price * (bookingType === "daily" ? nights : 1);
  const taxes = Math.round(subtotal * 0.158);
  const total = subtotal + taxes;

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

              <View className="flex-row gap-2">
                {bookingTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => setBookingType(type.id)}
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
                <Text className="text-sm font-semibold mb-1">Dates</Text>
                <Text className="text-sm text-gray-700">{dates}</Text>
              </View>

              <Pressable
                className="px-4 py-2 rounded-lg bg-gray-100"
                onPress={() => setCalendarOpen(true)}
              >
                <Text className="text-sm font-semibold">Change</Text>
              </Pressable>
            </View>

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

              <Pressable className="px-4 py-2 rounded-lg bg-gray-100">
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

              <Pressable>
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
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGuestModalOpen(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setGuestModalOpen(false)}
        />

        {/* Bottom Sheet */}
        <ScrollView className="absolute bottom-0 w-full h-full bg-white rounded-t-3xl">
          <Guests
            onClose={() => setGuestModalOpen(false)}
            onSave={(guestString) => {
              setGuests(guestString);
              setGuestModalOpen(false);
            }}
          />
        </ScrollView>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={calendarOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarOpen(false)}
      >
        {/* Backdrop */}
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setCalendarOpen(false)}
        />

        {/* Calendar Panel */}
        <ScrollView className="absolute bottom-0 w-full h-full bg-white rounded-t-3xl">
          <Calendar
            onSave={(newDates: any) => {
              setDates(newDates); // update Booking UI
              setCalendarOpen(false); // close modal
            }}
            onClose={() => setCalendarOpen(false)}
          />
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}
