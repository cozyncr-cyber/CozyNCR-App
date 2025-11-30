import React from "react";
import { Modal, View, Text, Pressable, Dimensions } from "react-native";

interface PriceModalProps {
  visible: boolean;
  onClose: () => void;

  nights: number;
  pricePerNight: number;
  total: number;

  datesLabel: string; // e.g. "12–14 Dec"
  cancellationText: string; // e.g. "Free cancellation before 11 December"
  currencySymbol?: string; // default: ₹
}

const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  onClose,
  nights,
  pricePerNight,
  total,
  datesLabel,
  cancellationText,
  currencySymbol = "₹",
}) => {
  const height = Dimensions.get("window").height;

  const subtotal = nights * pricePerNight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

      {/* Bottom sheet */}
      <View
        className="absolute left-0 right-0 bg-white rounded-t-2xl z-30 p-5 max-h-[75vh]"
        style={{
          bottom: visible ? 0 : -height,
        }}
      >
        {/* Handle */}
        <Pressable
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"
          onPress={onClose}
        />

        <Text className="text-xl font-semibold mb-4">Price Details</Text>

        <View>
          {/* Nights × price */}
          <View className="flex-row justify-between mb-3 border-b border-zinc-400 pb-3">
            <Text className="text-base text-gray-700">
              {nights} nights × {currencySymbol}
              {pricePerNight.toLocaleString("en-IN")}
            </Text>
            <Text className="text-base font-semibold">
              {currencySymbol}
              {subtotal.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Dates + cancellation */}
          <View className="mt-4 mb-3">
            <Text className="text-lg mb-1 font-medium">Dates</Text>
            <Text className="text-gray-600">{datesLabel}</Text>
            <Text className="text-sm text-gray-500">{cancellationText}</Text>
          </View>

          {/* Total (optional extra row) */}
          <View className="flex-row justify-between pt-3 border-t border-zinc-400">
            <Text className="text-base font-semibold">Total</Text>
            <Text className="text-base font-semibold">
              {currencySymbol}
              {total.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PriceModal;
