import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <>
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
            headerShown: false,
            headerTitle: "Account Settings",
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
    </>
  );
}
