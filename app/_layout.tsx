import { UserProvider, useUser } from "@/src/contexts/UserContext";
import { Stack } from "expo-router";
import "../global.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaProvider>
        <Router />
      </SafeAreaProvider>
    </UserProvider>
  );
}
