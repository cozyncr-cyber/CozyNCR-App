import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Shield, ChevronDown } from "lucide-react-native";
import { useUser } from "@/src/contexts/UserContext";

type FormData = {
  reason: string;
  additionalInfo: string;
};

const reasons = [
  { value: "", label: "Select a reason" },
  { value: "access", label: "I want to access my personal data" },
  { value: "portability", label: "I want a copy of my data for portability" },
  { value: "review", label: "I want to review what data you have about me" },
  { value: "correction", label: "I want to correct inaccurate data" },
  { value: "legal", label: "Legal or compliance requirement" },
  { value: "other", label: "Other reason" },
];

export default function RequestPersonalData() {
  const user = useUser();
  console.log(user);
  const [formData, setFormData] = useState<FormData>({
    reason: "",
    additionalInfo: "",
  });
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const subject = encodeURIComponent("Request My Personal Data");
    const body = encodeURIComponent(
      `Name: ${user.profile.name}\n` +
        `Email: ${user.profile.email}\n` +
        `Reason: ${
          reasons.find((r) => r.value === formData.reason)?.label ||
          "Not specified"
        }\n\n` +
        `Additional Information:\n${formData.additionalInfo || "None"}`
    );

    Linking.openURL(`mailto:cozyncr@gmail.com?subject=${subject}&body=${body}`);
  };

  const isFormValid = formData.reason;

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Info Banner */}
          <View className="px-4 py-6 bg-blue-50 border-b border-blue-100">
            <View className="flex-row gap-3">
              <Shield size={24} className="text-blue-600 mt-0.5" />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Your Data Rights
                </Text>
                <Text className="text-sm text-gray-700">
                  You have the right to request a copy of your personal data.
                  We&apos;ll process your request within 30 days and send the
                  data to your registered email address.
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className="px-4 py-6 space-y-5">
            {/* Reason Selector */}
            <View>
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Reason for Request *
              </Text>

              {/* Selected Value */}
              <Pressable
                onPress={() => setIsReasonOpen((prev) => !prev)}
                className="flex-row items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-xl"
              >
                <Text
                  className={`text-sm ${
                    formData.reason ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {reasons.find((r) => r.value === formData.reason)?.label ||
                    "Select a reason"}
                </Text>

                <ChevronDown
                  size={18}
                  className={`text-gray-600 ${
                    isReasonOpen ? "rotate-180" : ""
                  }`}
                />
              </Pressable>

              {/* Dropdown */}
              {isReasonOpen && (
                <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {reasons
                    .filter((r) => r.value)
                    .map((reason) => (
                      <Pressable
                        key={reason.value}
                        onPress={() => {
                          handleChange("reason", reason.value);
                          setIsReasonOpen(false);
                        }}
                        className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                      >
                        <Text
                          className={`text-sm ${
                            formData.reason === reason.value
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {reason.label}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              )}
            </View>

            {/* Additional Info */}
            <View>
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Additional Information (Optional)
              </Text>
              <TextInput
                value={formData.additionalInfo}
                onChangeText={(v) => handleChange("additionalInfo", v)}
                placeholder="Provide any additional details..."
                multiline
                numberOfLines={4}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl"
                textAlignVertical="top"
              />
            </View>

            {/* Info Text */}
            <View className="p-4 bg-gray-50 rounded-xl">
              <Text className="text-xs text-gray-600">
                By submitting this request, you confirm that you are the account
                holder or authorized to request this data. We&apos;ll verify
                your identity before processing the request.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <Pressable
            disabled={!isFormValid}
            onPress={handleSubmit}
            className={`py-4 rounded-xl ${
              isFormValid ? "bg-gray-900" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                isFormValid ? "text-white" : "text-gray-400"
              }`}
            >
              Request Data
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
