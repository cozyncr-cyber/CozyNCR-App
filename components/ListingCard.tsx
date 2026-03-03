import Star from "@/components/SVGs/Star";
import { useUser } from "@/src/contexts/UserContext";
import { useWishlist } from "@/src/hooks/useWishlist";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
const ListingCard = memo(function ListingCard({
  data,
  duration,
}: {
  data: any;
  duration: "3h" | "6h" | "12h" | "24h" | null;
}) {
  const { width } = useWindowDimensions();
  const { isLoggedIn } = useUser();
  const widthDevice =
    width >= 768
      ? Dimensions.get("window").width * 0.48
      : Dimensions.get("window").width * 0.9;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const { wishlisted, toggle } = useWishlist(data?.$id);
  const router = useRouter();
  const best = getBestPrice(data, duration);
  const hasMultipleImages = data.images.length > 1;

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / widthDevice);
    setActiveIndex(slide);
  };
  // Inside ListingCard.tsx - Update both Pressables (the image and the text)
  const handlePress = () => {
    const id = String(data.$id);
    const targetPath = isLoggedIn
      ? "/property?id=[id]"
      : "/(guest)/property/[id]";

    console.log("--- Navigation Test ---");
    console.log("Logged In:", isLoggedIn);
    console.log("Target Pathname:", targetPath);
    console.log("ID Parameter:", id);
    console.log(
      "Full Constructed Route:",
      isLoggedIn ? `/property?id=${id}` : `/(guest)/property/${id}`
    );

    router.push({
      pathname: targetPath as any, // Cast to any if TS complains about the string
      params: { id: id },
    });
  };

  return (
    <View
      style={{ width: widthDevice, marginBottom: 16 }} // FIXES INVISIBLE CARD ISSUE
      className="rounded-2xl bg-white shadow-sm overflow-hidden mx-auto"
    >
      {/* IMAGE CAROUSEL */}
      <View>
        {isLoggedIn && (
          <View className="absolute top-3 right-3 z-10">
            <Pressable
              onPress={toggle}
              hitSlop={10}
              className="w-9 h-9 rounded-full bg-white/90 items-center justify-center"
            >
              <Entypo
                name={wishlisted ? "heart" : "heart-outlined"}
                size={18}
                color={wishlisted ? "red" : "black"}
              />
            </Pressable>
          </View>
        )}
        <ScrollView
          horizontal={hasMultipleImages}
          pagingEnabled={hasMultipleImages}
          scrollEnabled={hasMultipleImages}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => setIsSwiping(true)}
          onMomentumScrollEnd={() => setIsSwiping(false)}
          style={{ width: widthDevice, height: widthDevice, borderRadius: 16 }}
        >
          {data.images.map((src: string, index: number) => (
            <Pressable
              key={index}
              style={({ pressed }) => ({
                opacity: pressed ? 0.95 : 1,
              })}
              onPress={() => {
                if (isSwiping) return;

                handlePress();
              }}
            >
              <Image
                source={{ uri: src }}
                style={{ width: widthDevice, height: widthDevice }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </Pressable>
          ))}
        </ScrollView>

        {/* DOTS */}
        {data.images.length > 1 && (
          <View className="flex-row absolute bottom-4 left-1/2 -translate-x-1/2">
            {data.images.map((_: any, index: number) => (
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

      <Pressable className="p-4" onPress={handlePress}>
        <View className="flex-row justify-between items-start mb-1">
          <Text className="font-semibold text-gray-900" numberOfLines={1}>
            {data.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <View style={{ transform: [{ scale: 0.75 }] }}>
              <Star />
            </View>
            <Text className="text-sm font-semibold text-gray-400">
              {data.avg_rating ? data.avg_rating : "NA"}
            </Text>
          </View>
        </View>

        <Text className="text-gray-600 text-sm">
          {data.category.charAt(0).toUpperCase() + data.category.slice(1)} in{" "}
          {data.city}
        </Text>
        <Text className="text-gray-600 text-sm mb-1">
          Upto {data.maxGuests} guests
        </Text>

        <Text className="text-gray-900">
          <Text className="font-semibold">₹{best?.price}</Text>
          <Text className="text-gray-600 text-sm"> per {best?.duration}</Text>
        </Text>
      </Pressable>
    </View>
  );
});

export default ListingCard;

function getBestPrice(
  listing: any,
  duration: "3h" | "6h" | "12h" | "24h" | null
) {
  // If user selected a duration — show exactly that price (if exists)
  if (duration) {
    const map: any = {
      "3h": { label: "3 hours", price: listing.price_3h },
      "6h": { label: "6 hours", price: listing.price_6h },
      "12h": { label: "12 hours", price: listing.price_12h },
      "24h": { label: "night", price: listing.price_24h },
    };

    const entry = map[duration];

    if (entry?.price != null) {
      return {
        duration: entry.label,
        price: entry.price,
      };
    }
  }

  // otherwise — fallback to cheapest available
  if (listing.price_24h != null) {
    return { duration: "night", price: listing.price_24h };
  }

  const map = {
    "1 hour": listing.price_1h,
    "3 hours": listing.price_3h,
    "6 hours": listing.price_6h,
    "12 hours": listing.price_12h,
  };

  const entries = Object.entries(map)
    .filter(([_, v]) => v != null)
    .sort((a, b) => Number(a[1]) - Number(b[1]));

  if (!entries.length) return null;

  return {
    duration: entries[0][0],
    price: entries[0][1],
  };
}
