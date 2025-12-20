import { UserProvider, useUser } from "@/src/contexts/UserContext";
import { Stack } from "expo-router";
import "../global.css";

import { SearchProvider } from "@/src/contexts/SearchContext";
import { SafeAreaView } from "react-native-safe-area-context";
import LaunchScreen from "./launch";

export function Router() {
  const user = useUser();
  // 🚀 App launch state
  if (user.isInitializing) {
    return <LaunchScreen />;
  }
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
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <Router />
        </SafeAreaView>
      </SearchProvider>
    </UserProvider>
  );
}
