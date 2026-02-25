import { PropertyProvider } from "@/src/contexts/PropertyContext";
import { Stack } from "expo-router";

export default function GuestPropertyLayout() {
  return (
    <PropertyProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PropertyProvider>
  );
}
