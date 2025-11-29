import { Stack } from "expo-router";
import "react-native-reanimated";
import "../src/global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "@/src/contexts/UserContext";

export function Router() {
  const user = useUser();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user.isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="property" />
      </Stack.Protected>
      <Stack.Protected guard={!user.isLoggedIn}>
        <Stack.Screen name="(auth)/signin" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Router /> {/* using context inside provider */}
      </SafeAreaView>
    </UserProvider>
  );
}
