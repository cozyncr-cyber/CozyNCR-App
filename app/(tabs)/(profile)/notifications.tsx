import { useState } from "react";
import { View, Text, Switch, Alert } from "react-native";
import { useUser } from "@/src/contexts/UserContext";
import { databases, DATABASE_ID, registerPush } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";

export default function SettingsScreen() {
  const { current: user, profile } = useUser();

  const [enabled, setEnabled] = useState(profile?.notificationsEnabled ?? true);
  const [loading, setLoading] = useState(false);

  async function toggleNotifications(value: boolean) {
    if (!user) return;

    try {
      setLoading(true);
      setEnabled(value);

      // TURN ON
      if (value) {
        await registerPush();
        Alert.alert("Notifications enabled");
      }

      // TURN OFF — list + delete all tokens for this user
      if (!value) {
        const result = await databases.listDocuments(
          DATABASE_ID,
          "push_tokens",
          [Query.equal("userId", user.$id)]
        );

        await Promise.all(
          result.documents.map((doc) =>
            databases.deleteDocument(DATABASE_ID, "push_tokens", doc.$id)
          )
        );

        Alert.alert("Notifications disabled");
      }
    } catch (err) {
      console.log("Toggle error:", err);
      setEnabled(!value);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-5 py-8 gap-4">
      <View className="flex-row items-center justify-between bg-gray-100 p-4 py-6  rounded-lg">
        <View className="flex-1 pr-3 flex flex-col ">
          <Text className="font-medium text-lg">Enable Notifications</Text>
          <Text className="text-gray-500 ">
            Turn app notifications on or off
          </Text>
        </View>
        <Switch
          value={enabled}
          disabled={loading}
          onValueChange={toggleNotifications}
        />
      </View>
      <Text className="text-gray-600 leading-6 px-4 mt-4">
        Stay updated with important alerts, booking reminders, payment updates,
        and app announcements. You can turn notifications off anytime — your
        account and data will continue to work normally.
      </Text>
    </View>
  );
}
