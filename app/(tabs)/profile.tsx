import { useUser } from "@/src/contexts/UserContext";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
export default function Profile() {
  const user = useUser();
  return (
    <ScrollView>
      <View className="min-h-screen p-4 flex flex-col gap-6">
        <Text className="text-2xl font-medium">Profile</Text>
        {/* Cards */}
        <View className="flex flex-col gap-2">
          {/* CARD A */}
          <View className="flex-1 relative">
            <View className="bg-white rounded-3xl shadow-sm overflow-hidden py-4">
              {/* Image */}
              <View className="relative w-28 aspect-square rounded-full overflow-hidden mx-auto bg-orange-300">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
                  }}
                  className="w-full h-full object-cover"
                />
              </View>

              {/* Content */}
              <View className="">
                <View className="flex flex-col items-center">
                  <Text className="text-xl font-semibold text-gray-900">
                    Natasha Romanoff
                  </Text>
                  <Text className="text-gray-600 text-sm">Guest</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="w-full flex flex-col  border-b border-zinc-300">
          <View className="w-full h-12 text-zinc-700 flex flex-row items-center gap-4 px-2">
            <Ionicons name="settings-outline" size={24} color="#3f3f46" />
            <Text className="w-full">Settings</Text>
            <Entypo name="chevron-thin-right" size={16} color="#3f3f46" />
          </View>
          <Pressable onPress={() => user.logout()}>
            <View className="w-full h-12 text-zinc-700 flex flex-row items-center gap-4 px-2">
              <Ionicons name="exit-outline" size={24} color="#3f3f46" />
              <Text>Logout</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
