import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: "#6B7280",
        tabBarActiveTintColor: "black",
        headerShown: false,
        tabBarShowLabel: true, // Crucial for Android
        tabBarStyle: {
          height: 65,
          paddingBottom: 10, // Gives the label room at the bottom
          paddingTop: 5, // Gives the icon room at the top
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "System", // Forces a standard font
          // REMOVED flex: 1 and width: 100%
        },
        tabBarIconStyle: {
          // Avoid large margins here that might push the label out
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(trips)"
        options={{
          title: "Trips",
          tabBarIcon: ({ color }) => (
            <AntDesign name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
