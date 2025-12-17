import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";

type Props = {
  data: any;
  onRemove?: () => void;
};

export default function WishlistListingCard({ data, onRemove }: Props) {
  const router = useRouter();

  const openProperty = () => {
    router.push({
      pathname: "/property/[id]",
      params: { id: String(data.$id) },
    });
  };

  return (
    <Pressable
      onPress={openProperty}
      className="bg-white border w-[96%] border-gray-200 rounded-2xl overflow-hidden"
    >
      <View className="flex-row items-center px-4 py-4">
        {/* IMAGE */}
        <View className="relative w-40 h-40 rounded-xl overflow-hidden">
          <Image
            source={{ uri: data.images?.[0] }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* HEART */}
          <Pressable
            onPress={onRemove}
            onPressIn={() => {
              /* prevents parent press */
            }}
            hitSlop={10}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-2"
          >
            <Entypo name="heart" size={20} color="red" />
          </Pressable>
        </View>

        {/* CONTENT */}
        <View className="flex-1 pl-4 justify-between">
          <View>
            <Text
              className="font-semibold text-base text-gray-900"
              numberOfLines={1}
            >
              {data.title}
            </Text>

            <Text className="text-sm text-gray-600 mt-1">
              {data.category.charAt(0).toUpperCase() + data.category.slice(1)}{" "}
              in {data.city}
            </Text>

            {/* GUESTS */}
            <View className="flex-row items-center gap-1 mt-2">
              <Feather name="users" size={14} color="#4b5563" />
              <Text className="text-xs text-gray-600">
                Upto {data.maxGuests} guests
              </Text>
            </View>

            {/* RATING */}
            <View className="flex-row items-center gap-1 mt-2">
              <View style={{ transform: [{ scale: 0.7 }] }}>
                <Star />
              </View>
              <Text className="text-sm font-semibold text-gray-600">
                {data.avg_rating ?? "NA"}
              </Text>
            </View>
          </View>

          {/* PRICE */}
          <View className="mt-2">
            <Text className="text-lg font-bold text-gray-900">
              ₹{data.price_24h ?? data.price_6h ?? data.price_3h}
            </Text>
            <Text className="text-xs text-gray-500">per night</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
