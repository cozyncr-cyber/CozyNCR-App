"use dom";
import "../../src/global.css";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";
import { Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProperty } from "@/src/contexts/PropertyContext";

const Booking = () => {
  const { data, loading } = useProperty();
  const [bookingType, setBookingType] = useState("daily");
  const [dates, setDates] = useState("7–12 Dec 2025");
  const [guests, setGuests] = useState("1 adult, 2 children, 1 infant");
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

  return (
    <ScrollView>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold">Request to book</h1>
          <Pressable
            onPress={() => router.back()}
            className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
          >
            <Feather name="x" size={24} color="black" />
          </Pressable>
        </div>

        <div className="px-4 py-4">
          {/* Property Card */}
          <div className="border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex gap-3 mb-4">
              <img
                src={data.images[0]}
                alt="Property"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-sm font-semibold leading-tight mb-1">
                  {data.title}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star />
                    <span className="font-semibold">4.92</span>
                    <span className="text-gray-600">(12)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Type Selector */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Booking type</h3>
              <div className="flex gap-2">
                {bookingTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBookingType(type.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                    ${
                      bookingType === type.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-semibold mb-1">Dates</h3>
                <p className="text-sm text-gray-700">{dates}</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition-colors">
                Change
              </button>
            </div>

            {/* Guests */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-semibold mb-1">Guests</h3>
                <p className="text-sm text-gray-700">{guests}</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition-colors">
                Change
              </button>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">Total price</h3>
                <p className="text-sm text-gray-700">
                  ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}{" "}
                  including taxes <span className="underline">INR</span>
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition-colors">
                Details
              </button>
            </div>

            {/* Cancellation Policy */}
            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-sm font-semibold mb-1">
                Cancellation Policy
              </h3>
              <p className="text-sm text-gray-700">
                90% refund for cancellations made up to 24 hours before check-in{" "}
                <button className="underline font-semibold">Full policy</button>
              </p>
            </div>
          </div>

          {/* Price Details */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Price details</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  {bookingType === "daily" ? `${nights} nights` : "1 session"} ×
                  ₹
                  {currentBooking.price.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-900">
                  ₹
                  {subtotal.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Taxes</span>
                <span className="text-gray-900">
                  ₹{taxes.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold">
                <span>
                  Total <span className="font-normal">INR</span>
                </span>
                <span>
                  ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>

              <button className="text-sm underline font-semibold">
                Price breakdown
              </button>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-700">
            <p>
              The host has 24 hours to accept your request. You&apos;ll pay now,
              but get a full refund if the booking isn&apos;t confirmed.
            </p>
          </div>

          <div className="text-center text-sm text-gray-600 mb-4">
            You&apos;ll be directed to Razorpay to complete payment.
          </div>

          {/* Continue Button */}
          <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Continue to <span className="italic">Razorpay</span>
          </button>

          <p className="text-center text-xs text-gray-600 mt-3">
            By selecting the button, I agree to the{" "}
            <button className="underline font-semibold">booking terms</button>.
          </p>
        </div>
      </div>
    </ScrollView>
  );
};

export default Booking;
