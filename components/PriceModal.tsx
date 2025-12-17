import React from "react";
import { Modal, View, Text, Pressable, Dimensions } from "react-native";

interface PriceModalProps {
  visible: boolean;
  onClose: () => void;

  nights: number;
  pricePerNight: number;
  subtotal: number;

  datesLabel: string;
  cancellationText: string;
  currencySymbol?: string;
}

const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  onClose,
  nights,
  pricePerNight,
  subtotal,
  currencySymbol = "₹",
}) => {
  const height = Dimensions.get("window").height;
  const taxes = 0.045;

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
        <Pressable
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"
          onPress={onClose}
        />

        <Text className="text-xl font-semibold mb-4">Price Details</Text>

        {/* Nights × price */}
        <View className="mb-3 pb-3 flex gap-2">
          <View className="flex-row justify-between ">
            <Text className="text-base text-gray-700">
              {nights} nights × {currencySymbol}
              {pricePerNight.toLocaleString("en-IN")}
            </Text>

            <Text className="text-base font-semibold">
              {currencySymbol}
              {subtotal?.toLocaleString("en-IN")}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700 text-base">Taxes</Text>
            <Text className="text-base font-semibold">
              ₹{(taxes * subtotal).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View className="flex-row justify-between pt-3 border-t border-zinc-400">
          <Text className="text-base font-semibold">Total</Text>
          <Text className="text-base font-semibold">
            {currencySymbol}
            {(subtotal + taxes * subtotal).toFixed(2)}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default PriceModal;
