import { Image, ScrollView, View, Text } from "react-native";
import Star from "./SVGs/Star";
import { LinearGradient } from "expo-linear-gradient";
export default function ProfileCard(owner: any) {
  return (
    <ScrollView>
      <View className="flex-1 relative">
        <View className="bg-gray-900 rounded-3xl shadow-lg overflow-hidden">
          <View className="relative h-[500px]">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.95)"]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <View className="relative h-full flex flex-col justify-end p-6">
              {/* Name */}
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-xl font-semibold text-white">
                  {owner?.owner?.name}
                </Text>
              </View>

              <Text className="text-gray-200 text-center text-sm mb-6">
                I am a Brand Designer who focuses on clarity & emotional
                connection.
              </Text>

              {/* Stats */}
              <View className="flex flex-row w-full items-center text-center justify-around gap-3 sm:gap-6 mb-6 ">
                <View className="flex flex-row items-center gap-1 ">
                  <Star />
                  <Text className="font-semibold text-white">4.8</Text>
                </View>
                <View className="h-10 w-0.5 rounded-full bg-zinc-300"></View>

                <View>
                  <Text className="font-semibold text-white">
                    {timeSince(owner?.owner?.$createdAt)}
                  </Text>
                </View>

                <View className="h-10 w-0.5 rounded-full bg-zinc-300"></View>
                <View>
                  <Text className="font-semibold text-white">3</Text>
                  <Text className="text-sm text-gray-300">Property</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
function timeSince(dateString: string) {
  const created = new Date(dateString);
  const now = new Date();

  let diffMs = now.getTime() - created.getTime();

  // Handle future dates → treat as 1 month old minimum
  if (diffMs < 0) diffMs = 0;

  const months = diffMs / (1000 * 60 * 60 * 24 * 30.44); // avg month length
  const years = Math.floor(months / 12);

  if (years >= 1) {
    return years === 1 ? "1 Year" : `${years} Years`;
  }

  // Less than 1 year → show months
  const wholeMonths = Math.max(1, Math.floor(months));
  return wholeMonths === 1 ? "1 Month" : `${wholeMonths} Months`;
}
