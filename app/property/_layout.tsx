import { Stack } from "expo-router";
import { PropertyProvider } from "@/src/contexts/PropertyContext";

export default function RootLayout() {
  return (
    <PropertyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" />
        <Stack.Screen name="reserve" />
      </Stack>
    </PropertyProvider>
  );
}
