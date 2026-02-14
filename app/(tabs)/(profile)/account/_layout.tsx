import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Account",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="editProfile"
        options={{ headerTitle: "Profile Information" }}
      />

      <Stack.Screen
        name="changePassword"
        options={{ headerTitle: "Change Password" }}
      />
      <Stack.Screen
        name="paymentPreference"
        options={{ headerTitle: "Refund Preference " }}
      />
      <Stack.Screen
        name="requestPersonalData"
        options={{ headerTitle: "Request Personal Data" }}
      />
      <Stack.Screen
        name="deleteAccount"
        options={{ headerTitle: "Delete Account" }}
      />
      <Stack.Screen
        name="changeEmail"
        options={{ headerTitle: "Change Email" }}
      />
    </Stack>
  );
}
