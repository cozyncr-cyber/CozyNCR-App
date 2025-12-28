import { Stack } from "expo-router";
import { View } from "react-native";

export default function ProfileLayout() {
  return (
    <>
      <View className="flex-1 -mt-10">
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Profile",
              headerTitleAlign: "center",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              headerTitle: "Privacy Policy",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="account"
            options={{
              headerTitle: "Account Settings",
              headerTitleAlign: "center",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="notifications"
            options={{
              headerTitle: "Notification Settings",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="terms"
            options={{
              headerTitle: "Terms & Conditions",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="customer"
            options={{
              headerTitle: "Customer Support",
              headerTitleAlign: "center",
            }}
          />
        </Stack>
      </View>
    </>
  );
}
