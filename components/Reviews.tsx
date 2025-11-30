import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import Star from "./SVGs/Star";

const { width } = Dimensions.get("window");

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "South Delhi",
    rating: 5,
    text: "The villa was absolutely stunning. The host was incredibly responsive, and the amenities were exactly as described. Perfect weekend getaway for our family.",
    date: "October 2024",
  },
  {
    id: 2,
    name: "Priya Kapoor",
    location: "Gurgaon",
    rating: 5,
    text: "I've used many rental platforms, but the transparency here is unmatched. I loved the pre-booking chat feature—it made me feel so much more secure.",
    date: "November 2024",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    location: "Noida",
    rating: 4,
    text: "Seamless check-in and the property was spotless. The liability protection gave me peace of mind. Highly recommend for short stays in NCR.",
    date: "September 2024",
  },
];

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % reviews.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // ⭐ FIX: reliable index tracking
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width);
    if (index !== current) setCurrent(index);
  };

  return (
    <View className="w-full bg-slate-100 rounded-2xl p-6 overflow-hidden">
      <FlatList
        ref={flatListRef}
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={onScroll} // ⭐ NEW
        scrollEventThrottle={16} // ⭐ IMPORTANT
        onMomentumScrollEnd={() => {}} // (keep if needed, does nothing now)
        renderItem={({ item }) => (
          <View className="mx-2" style={{ width: width - 104 }}>
            <View className="flex flex-col gap-2">
              <View className="flex-row">
                {[...Array(item.rating)].map((_, i) => (
                  <View key={i} style={{ transform: [{ scale: 0.75 }] }}>
                    <Star />
                  </View>
                ))}
              </View>

              <Text className="text-lg font-medium leading-relaxed text-slate-600">
                “{item.text}”
              </Text>

              <View className="mt-2">
                <Text className="font-bold text-slate-600">{item.name}</Text>
                <Text className="text-sm text-slate-400">
                  {item.location} • {item.date}
                </Text>
              </View>
            </View>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View className="flex-row gap-2 mt-8 justify-center">
        {reviews.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setCurrent(index);
              flatListRef.current?.scrollToIndex({ index, animated: true });
            }}
            className={`h-2 rounded-full ${
              current === index ? "w-8 bg-black" : "w-2 bg-slate-600"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
