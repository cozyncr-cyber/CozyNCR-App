import { UserProvider, useUser } from "@/src/contexts/UserContext";
import { Stack } from "expo-router";
import "../global.css";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { SearchProvider } from "@/src/contexts/SearchContext";

export function Router() {
  const user = useUser();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user.isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="property" />
        <Stack>
          <Stack.Screen
            name="property/reserve"
            options={{ presentation: "modal" }}
          />
        </Stack>
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
      <SearchProvider>
        <SafeAreaProvider>
          <Router />
        </SafeAreaProvider>
      </SearchProvider>
    </UserProvider>
  );
}
