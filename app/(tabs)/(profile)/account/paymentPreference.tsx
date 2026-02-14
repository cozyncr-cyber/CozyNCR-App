import {
  DATABASE_ID,
  databases,
  ID,
  PAYMENT_PREFERENCES_TABLE_ID,
} from "@/lib/appwrite";
import { useUser } from "@/src/contexts/UserContext";
import { Check, CreditCard, Edit2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";

type PaymentData = {
  $id: string;
  fullName: string;
  upiId: string;
};

const PaymentPreferences = () => {
  const user = useUser();
  const userId = user?.current?.$id ?? user?.$id;

  const [docId, setDocId] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<PaymentData | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    upiId: "",
  });

  // ===== FETCH PAYMENT PREFS =====
  const loadPaymentPreferences = async () => {
    if (!userId) return;

    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        PAYMENT_PREFERENCES_TABLE_ID,
        [Query.equal("user_id", userId)]
      );

      if (res.documents.length > 0) {
        const doc = res.documents[0];

        setDocId(doc.$id);
        setExistingData({
          $id: doc.$id,
          fullName: doc.full_name,
          upiId: doc.upi_id,
        });

        setFormData({
          fullName: doc.full_name,
          upiId: doc.upi_id,
        });

        setIsEditing(false);
      }
    } catch (e) {
      console.log("Failed to load payment preferences", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentPreferences();
  }, [userId]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleCancel = () => {
    if (!existingData) return;
    setFormData({
      fullName: existingData.fullName,
      upiId: existingData.upiId,
    });
    setIsEditing(false);
  };

  // ===== SAVE (CREATE / UPDATE) =====
  const handleSave = async () => {
    if (!userId) return;

    try {
      if (docId) {
        // UPDATE
        await databases.updateDocument(
          DATABASE_ID,
          PAYMENT_PREFERENCES_TABLE_ID,
          docId,
          {
            full_name: formData.fullName,
            upi_id: formData.upiId,
          }
        );
      } else {
        // CREATE
        const doc = await databases.createDocument(
          DATABASE_ID,
          PAYMENT_PREFERENCES_TABLE_ID,
          ID.unique(),
          {
            user_id: userId,
            full_name: formData.fullName,
            upi_id: formData.upiId,
          }
        );

        setDocId(doc.$id);
      }

      setExistingData({
        $id: docId ?? "",
        fullName: formData.fullName,
        upiId: formData.upiId,
      });

      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.log("Save payment preferences failed", e);
    }
  };

  const isFormValid = !!formData.fullName && !!formData.upiId;
  const hasChanges =
    formData.fullName !== existingData?.fullName ||
    formData.upiId !== existingData?.upiId;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-4 py-8 max-w-2xl mx-auto w-full">
          {/* Info Card */}
          <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex-row gap-3">
            <CreditCard size={20} color="#2563EB" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 mb-1">
                {existingData
                  ? "Your payout method"
                  : "Set up your payout method"}
              </Text>
              <Text className="text-sm text-gray-700">
                {existingData
                  ? "Your payment details are saved securely."
                  : "Add your bank details to receive payments securely."}
              </Text>
            </View>
          </View>

          {/* Card */}
          <View className="bg-white rounded-2xl border border-gray-200 p-6">
            {existingData && !isEditing ? (
              <View className="space-y-6">
                <Text className="font-medium">{existingData.fullName}</Text>
                <Text className="text-gray-600">{existingData.upiId}</Text>

                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="w-full py-4 bg-gray-900 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Edit2 size={20} color="#fff" />
                  <Text className="text-white font-semibold">
                    Edit Payment Details
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-6">
                <TextInput
                  value={formData.fullName}
                  onChangeText={(t) => handleChange("fullName", t)}
                  placeholder="Full Name"
                  className="border-2 border-gray-300 rounded-xl px-4 py-3"
                />

                <TextInput
                  value={formData.upiId}
                  onChangeText={(t) => handleChange("upiId", t)}
                  placeholder="UPI ID"
                  autoCapitalize="none"
                  className="border-2 border-gray-300 rounded-xl px-4 py-3"
                />

                <View className="flex-row gap-3">
                  {existingData && (
                    <TouchableOpacity
                      onPress={handleCancel}
                      className="flex-1 py-4 border-2 border-gray-300 rounded-xl items-center"
                    >
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={!isFormValid || !hasChanges}
                    className={`flex-1 py-4 rounded-xl items-center ${
                      isFormValid && hasChanges ? "bg-pink-500" : "bg-gray-200"
                    }`}
                  >
                    {saved ? (
                      <Check size={20} color="#fff" />
                    ) : (
                      <Text
                        className={`font-semibold ${
                          isFormValid ? "text-white" : "text-gray-400"
                        }`}
                      >
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentPreferences;
