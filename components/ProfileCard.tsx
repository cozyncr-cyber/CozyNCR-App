import { Image, ScrollView, View, Text } from "react-native";
import Star from "./SVGs/Star";
import { LinearGradient } from "expo-linear-gradient";
export default function ProfileCard(owner: any) {
  return (
    <ScrollView>
      <View className="flex-1 relative">
        <View className="bg-gray-900 rounded-3xl  overflow-hidden">
          {owner.owner.avatarUrl ? (
            <View className="relative h-[500px]">
              <Image
                source={{
                  uri: owner?.owner?.avatarUrl,
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

                {/* Stats */}
                <View className="flex flex-row w-full items-center text-center justify-around gap-3 sm:gap-6 mb-6 ">
                  <View>
                    <Text className="font-semibold text-white">
                      Hosting for {timeSince(owner?.owner?.$createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View className="flex-1 relative">
                <View className="bg-white rounded-3xl overflow-hidden pt-6">
                  {/* Image */}
                  <View className="relative w-32 h-32 rounded-full overflow-hidden mx-auto bg-orange-300">
                    <Image
                      source={{
                        uri: "https://images.unsplash.com/photo-1750535135696-4421c9a90746?w=400&h=400&fit=crop",
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Content */}
                  <View className="p-6">
                    <View className="flex-row items-center gap-2 mb-3">
                      <Text className="text-xl text-center w-full font-semibold text-gray-900">
                        {owner?.owner?.name}
                      </Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row items-center gap-6 justify-around mb-6 px-6">
                      {/* Years */}
                      <View className="items-center">
                        <Text className="font-semibold text-gray-900">
                          Hosting for {timeSince(owner?.owner?.$createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
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
