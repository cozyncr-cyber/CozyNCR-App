import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ActivityIndicator,
} from "react-native";
import Star from "./SVGs/Star";
import { getReviewsByListingId, Review } from "@/lib/services/reviews";

const { width } = Dimensions.get("window");

type ReviewCarouselProps = {
  listingId: string;
};

export default function ReviewCarousel({ listingId }: ReviewCarouselProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList<Review>>(null);

  /* ────────────────────────────────────────
     Fetch reviews from Appwrite
  ──────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByListingId(listingId);

        if (mounted) {
          setReviews(data);
          setCurrent(0);
        }
      } catch (err) {
        console.error("Error loading reviews", err);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadReviews();

    return () => {
      mounted = false;
    };
  }, [listingId]);

  /* ────────────────────────────────────────
     Auto-scroll
  ──────────────────────────────────────── */
  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % reviews.length;
        flatListRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [reviews]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== current) setCurrent(index);
  };

  /* ────────────────────────────────────────
     States
  ──────────────────────────────────────── */
  if (loading) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!reviews.length) {
    return (
      <View className="py-10 items-center">
        <Text className="text-slate-400 text-sm">No reviews yet</Text>
      </View>
    );
  }

  return (
    <View className="w-full bg-slate-100 rounded-2xl p-6 overflow-hidden">
      <FlatList
        ref={flatListRef}
        data={reviews}
        keyExtractor={(item) => item.$id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View className="mx-2" style={{ width: width - 104 }}>
            <View className="gap-2">
              {/* Stars */}
              <View className="flex-row">
                {[...Array(item.rating)].map((_, i) => (
                  <View key={i} style={{ transform: [{ scale: 0.75 }] }}>
                    <Star />
                  </View>
                ))}
              </View>

              <Text className="text-lg font-medium text-slate-600">
                “{item.comment}”
              </Text>

              <View className="mt-2">
                <Text className="font-bold text-slate-600">
                  {item.reviewer_name}
                </Text>
                <Text className="text-sm text-slate-400">Guest</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Pagination */}
      <View className="flex-row gap-2 mt-8 justify-center">
        {reviews.map((_, index) => (
          <Pressable
            key={index}
            onPress={() =>
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
              })
            }
            className={`h-2 rounded-full ${
              current === index ? "w-8 bg-black" : "w-2 bg-slate-600"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
