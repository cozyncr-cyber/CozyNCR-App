import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#e91e63", headerShown: false }}
    >
      <Tabs.Screen
        name="/index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="/explore"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
