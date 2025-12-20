import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

type BookingTermsModalProps = {
  visible: boolean;
  onClose: () => void;
  onAgree: () => void;
};

const BookingTermsModal: React.FC<BookingTermsModalProps> = ({
  visible,
  onClose,
  onAgree,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">
              Booking Terms
            </Text>
            <Pressable onPress={onClose}>
              <Entypo name="cross" size={24} color="#111827" />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView className="px-6 py-4">
            <Text className="text-sm text-gray-700 mb-4">
              Please read carefully before proceeding with payment.
            </Text>

            {/* Section */}
            <Text className="font-semibold text-gray-900 mb-2">
              Eligibility & Verification
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              • You confirm you are 18+ years old{"\n"}• Valid government ID
              verification is mandatory
            </Text>

            <Text className="font-semibold text-gray-900 mb-2">
              House Rules & Conduct
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              • House rules set by the Host must be followed{"\n"}• No parties,
              loud music, gatherings, or illegal activities{"\n"}• Violation may
              result in eviction without refund
            </Text>

            <Text className="font-semibold text-gray-900 mb-2">
              Property Responsibility
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              • Any damage caused must be paid directly to the Host{"\n"}•
              CozyNCR is not involved in damage settlements
            </Text>

            <Text className="font-semibold text-gray-900 mb-2">
              Payments & Refunds
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              • Payments must be completed within the app{"\n"}• Refunds depend
              solely on the Host’s cancellation policy
            </Text>

            <Text className="font-semibold text-gray-900 mb-2">
              Liability & Insurance
            </Text>
            <Text className="text-sm text-gray-700 mb-4">
              • Stay is at your own risk{"\n"}• CozyNCR is not liable for
              accidents, theft, or injuries{"\n"}• Maximum accidental death
              insurance: ₹10,000 only
            </Text>

            <Text className="font-semibold text-gray-900 mb-2">
              Illegal Activities
            </Text>
            <Text className="text-sm text-gray-700 mb-6">
              • Drugs, violence, prostitution, gambling, or weapons are strictly
              prohibited{"\n"}• Violations may lead to account suspension and
              police action
            </Text>
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-gray-200">
            <Pressable
              onPress={onAgree}
              className={`py-3 rounded-lg ${"bg-black"}`}
            >
              <Text className="text-white text-center font-semibold">
                Agree & Continue to Pay
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookingTermsModal;
