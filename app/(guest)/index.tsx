import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "../(tabs)/index"; // adjust path if needed

export default function GuestHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* 🔹 Navbar */}
      <View className="flex-row justify-between items-center px-6 pt-6 pb-2">
        <Text className="text-2xl font-bold">CozyNCR</Text>

        <TouchableOpacity
          onPress={() => router.push("/signin")}
          className="bg-black px-4 py-2 rounded-xl"
        >
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Reuse Actual Home */}
      <View className="flex-1">
        <HomeScreen />
      </View>
    </View>
  );
}
