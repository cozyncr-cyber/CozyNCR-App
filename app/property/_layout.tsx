import { Stack } from "expo-router";
import "react-native-reanimated";
import "../../src/global.css";
import { PropertyProvider } from "@/src/contexts/PropertyContext";

export default function RootLayout() {
  return (
    <PropertyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id].tsx" />
        <Stack.Screen name="reserve.tsx" />
      </Stack>
    </PropertyProvider>
  );
}
