import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Modal } from "react-native";
import {
  Home,
  Building2,
  PartyPopper,
  TreePine,
  Music,
  Briefcase,
  X,
} from "lucide-react-native";
import { DualRangeSlider } from "@/components/SimpleSlider";
import { SafeAreaView } from "react-native-safe-area-context";

const MIN_PRICE = 100;
const MAX_PRICE = 50000;
const STEP = 100;
const MIN_GAP = 500;

export interface FiltersState {
  minPrice: number;
  maxPrice: number;
  placeTypes: string[];
  bookingOptions: string[];
  duration: "3h" | "6h" | "12h" | "24h" | null;
}

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FiltersState) => void;
  initialFilters: FiltersState | null;
}

export const FiltersModal = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FiltersModalProps) => {
  // 🔹 Draft state (local only)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [bookingOptions, setBookingOptions] = useState<string[]>([]);
  const [duration, setDuration] = useState<FiltersState["duration"]>(null);

  // 🔁 Restore committed filters when modal opens
  useEffect(() => {
    if (!visible) return;

    setSelectedTypes(initialFilters?.placeTypes ?? []);
    setMinPrice(initialFilters?.minPrice ?? MIN_PRICE);
    setMaxPrice(initialFilters?.maxPrice ?? MAX_PRICE);
    setBookingOptions(initialFilters?.bookingOptions ?? []);
    setDuration(initialFilters?.duration ?? null);
  }, [visible, initialFilters]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">Filters</Text>
            <Pressable
              onPress={onClose}
              className="p-2 rounded-full active:bg-gray-100"
            >
              <X size={24} color="#111" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* Type of place */}
            <Text className="text-lg font-semibold mt-6 mb-4">
              Type of place
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {[
                { id: "studio", label: "Studio", icon: Home },
                { id: "apartment", label: "Apartment", icon: Building2 },
                { id: "event-hall", label: "Event Hall", icon: PartyPopper },
                { id: "villa", label: "Villa", icon: TreePine },
                { id: "jam-room", label: "Jam Room", icon: Music },
                { id: "office-pod", label: "Office / Pod", icon: Briefcase },
              ].map((type) => {
                const Icon = type.icon;
                const active = selectedTypes.includes(type.id);

                return (
                  <Pressable
                    key={type.id}
                    onPress={() =>
                      setSelectedTypes((prev) =>
                        active
                          ? prev.filter((t) => t !== type.id)
                          : [...prev, type.id]
                      )
                    }
                    className={`w-[48%] p-4 rounded-xl border-2 ${
                      active ? "border-gray-900 bg-gray-50" : "border-gray-200"
                    }`}
                  >
                    <Icon size={22} color="#374151" />
                    <Text className="mt-2 text-sm font-medium text-gray-900">
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Price range */}
            <View className="px-4">
              <Text className="text-lg font-semibold mt-8 mb-1">
                Price range
              </Text>
              <Text className="text-sm text-gray-500 mb-6">
                Trip price, includes all fees
              </Text>
              <DualRangeSlider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                values={[minPrice, maxPrice]}
                onChange={([min, max]) => {
                  if (max - min < MIN_GAP) return;

                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Text className="text-sm font-medium">
                ₹{minPrice.toLocaleString("en-IN")}
              </Text>
              <Text className="text-sm font-medium">
                {maxPrice >= MAX_PRICE
                  ? "₹50,000+"
                  : `₹${maxPrice.toLocaleString("en-IN")}`}
              </Text>
            </View>

            {/* Booking options */}
            <Text className="text-lg font-semibold mt-8 mb-4">
              Booking options
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                { id: "pets", label: "Allow Pet" },
                { id: "infants", label: "Allow Infant" },
                { id: "children", label: "Allow Children" },
              ].map((option) => {
                const active = bookingOptions.includes(option.id);

                return (
                  <Pressable
                    key={option.id}
                    onPress={() =>
                      setBookingOptions((prev) =>
                        active
                          ? prev.filter((o) => o !== option.id)
                          : [...prev, option.id]
                      )
                    }
                    className={`px-4 py-2.5 rounded-full border-2 ${
                      active
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        active ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Booking duration */}
            <Text className="text-lg font-semibold mt-8 mb-4">
              Booking duration
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {[
                { id: "3h", label: "3 Hour" },
                { id: "6h", label: "6 Hour" },
                { id: "12h", label: "12 Hour" },
                { id: "24h", label: "Nightly" },
              ].map((item) => {
                const active = duration === item.id;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() =>
                      setDuration(active ? null : (item.id as any))
                    }
                    className={`px-4 py-2.5 rounded-full border-2 ${
                      active
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        active ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom actions */}
          <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 flex-row gap-3">
            {/* Clear all (UI only) */}
            <Pressable
              onPress={() => {
                setSelectedTypes([]);
                setMinPrice(MIN_PRICE);
                setMaxPrice(MAX_PRICE);
                setBookingOptions([]);
                setDuration(null);
              }}
              className="px-6 py-3 rounded-xl active:bg-gray-100"
            >
              <Text className="text-base font-semibold text-gray-900">
                Clear all
              </Text>
            </Pressable>

            {/* Apply */}
            <Pressable
              onPress={() => {
                onApply({
                  minPrice,
                  maxPrice,
                  placeTypes: selectedTypes,
                  bookingOptions,
                  duration,
                });
                onClose();
              }}
              className="flex-1 py-4 bg-gray-900 rounded-xl"
            >
              <Text className="text-center text-white font-semibold">
                Apply filters
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
