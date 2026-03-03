import { PropertyProvider } from "@/src/contexts/PropertyContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PropertyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
        <Stack.Screen name="reserve" options={{ presentation: "modal" }} />
        {/* If you have a success page, add it here too */}
        <Stack.Screen name="success" />
      </Stack>
    </PropertyProvider>
  );
}
