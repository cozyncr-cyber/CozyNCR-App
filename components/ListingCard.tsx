import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  View,
  Text,
} from "react-native";

export default function ListingCard({ data }: { data?: any }) {
  const width = Dimensions.get("window").width * 0.9;
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const best = getBestPrice(data);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/property/[id]",
          params: { id: String(data.$id) },
        })
      }
      style={{ width: width, marginBottom: 16 }} // FIXES INVISIBLE CARD ISSUE
      className="rounded-2xl bg-white shadow-sm overflow-hidden"
    >
      {/* IMAGE CAROUSEL */}
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ width, height: width, borderRadius: 16 }}
        >
          {data.images.map((src: string, index: number) => (
            <Image
              key={index}
              source={{ uri: src }}
              style={{
                width,
                height: width,
              }}
              resizeMode="cover" // FIX
            />
          ))}
        </ScrollView>

        {/* DOTS */}
        {data.images.length > 1 && (
          <View className="flex-row absolute bottom-4 left-1/2 -translate-x-1/2">
            {data.images.map((_, index: number) => (
              <View
                key={index}
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 8,
                  marginHorizontal: 3,
                  backgroundColor:
                    index === activeIndex ? "white" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* CONTENT */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="font-semibold text-gray-900" numberOfLines={1}>
            {data.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <View style={{ transform: [{ scale: 0.75 }] }}>
              <Star />
            </View>
            <Text className="text-sm font-semibold">4.94</Text>
          </View>
        </View>

        <Text className="text-gray-600 text-sm">
          {data.category.charAt(0).toUpperCase() + data.category.slice(1)} in{" "}
          {data.city}
        </Text>
        <Text className="text-gray-600 text-sm mb-1">
          2 Beds • Upto {data.maxGuests} guests
        </Text>

        <Text className="text-gray-900">
          <Text className="font-semibold">₹{best?.price}</Text>
          <Text className="text-gray-600 text-sm"> per {best?.duration}</Text>
        </Text>
      </View>
    </Pressable>
  );
}

function getBestPrice(listing: any) {
  if (listing.price_24h != null) {
    return {
      duration: "night",
      price: listing.price_24h,
    };
  }

  const map = {
    "1 hour": listing.price_1h,
    "3 hours": listing.price_3h,
    "6 hours": listing.price_6h,
    "12 hours": listing.price_12h,
  };

  const entries = Object.entries(map)
    .filter(([_, value]) => value != null)
    .sort((a, b) => a[1] - b[1]);

  if (entries.length === 0) return null;

  return {
    duration: entries[0][0],
    price: entries[0][1],
  };
}
