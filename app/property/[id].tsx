import { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

import ExpandableText from "@/components/Expandable";
import ReviewCarousel from "@/components/Reviews";
import Star from "@/components/SVGs/Star";
import ProfileCard from "@/components/ProfileCard";
import Map from "@/components/Map";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { amenityIcons } from "@/components/AmenityIcon";
import { useProperty } from "@/src/contexts/PropertyContext";
import PriceModal from "@/components/PriceModal";
import { useSearch } from "@/src/contexts/SearchContext";
import { isWishlisted, toggleWishlist } from "@/lib/services/wishlist";
import { useUser } from "@/src/contexts/UserContext";

export default function Details() {
  const { searchState } = useSearch();
  const user = useUser();
  let nights = 1;

  if (searchState.calendar?.checkIn && searchState.calendar?.checkOut) {
    const ms =
      searchState.calendar.checkOut.getTime() -
      searchState.calendar.checkIn.getTime();
    nights = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  }

  const { data, owner, loading } = useProperty();
  const width = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const router = useRouter();
  const [priceOpen, setPriceOpen] = useState(false);
  const userId = user?.current?.$id;
  const listingId = data?.$id;

  useEffect(() => {
    if (!userId || !listingId) return;

    let mounted = true;

    const checkWishlist = async () => {
      const exists = await isWishlisted(userId, listingId);
      if (mounted) setWishlisted(exists);
    };

    checkWishlist();

    return () => {
      mounted = false;
    };
  }, [userId, listingId]);
  const handleToggleWishlist = async () => {
    if (!user?.current?.$id) return;

    setLoadingWishlist(true);

    // Optimistic UI
    setWishlisted((prev) => !prev);

    try {
      await toggleWishlist(user.current.$id, data.$id);
    } catch (err) {
      // rollback on failure
      setWishlisted((prev) => !prev);
      console.error("Wishlist toggle failed", err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };
  const addOnsArray = Array.isArray(data?.addOns)
    ? data.addOns
    : data?.addOns
      ? [JSON.parse(data.addOns)]
      : [];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>
          <ActivityIndicator size="large" color="#2563eb" />
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No property found.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}
      >
        <View className="relative">
          {/* Back button */}
          <View className="w-12 h-12 absolute z-10 rounded-full top-6 left-4 bg-white shadow-lg items-center justify-center">
            <Pressable
              onPress={() => {
                router.back();
              }}
              className="w-full h-full rounded-full items-center justify-center"
            >
              <MaterialIcons name="arrow-back" size={22} />
            </Pressable>
          </View>
          <View className="w-12 h-12 absolute z-10 rounded-full top-6 right-4 shadow-lg items-center justify-center">
            <Pressable
              onPress={handleToggleWishlist}
              disabled={loadingWishlist}
              className="w-full h-full rounded-full items-center justify-center"
            >
              <Entypo
                name={wishlisted ? "heart" : "heart-outlined"}
                size={24}
                color={wishlisted ? "red" : "white"}
              />
            </Pressable>
          </View>

          {/* Image Carousel */}
          <View className="relative">
            <ScrollView
              horizontal
              pagingEnabled
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              style={{ width }}
            >
              {data?.images &&
                data.images.map((src: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: src }}
                    style={{
                      width,
                      height: width,
                      resizeMode: "cover",
                    }}
                  />
                ))}
            </ScrollView>

            {/* DOTS INDICATOR */}
            <View className="flex-row mt-3 absolute left-1/2 -translate-x-1/2 bottom-4 z-10">
              {data?.images &&
                data.images.map((_: any, index: number) => (
                  <View
                    key={index}
                    className={`h-2 w-2 mx-0.5 rounded-full ${
                      index === activeIndex
                        ? "bg-white"
                        : "bg-gray-200 opacity-80"
                    }`}
                  />
                ))}
            </View>
          </View>

          {/* MAIN CONTENT */}
          <View className="w-full mx-auto px-6 rounded-2xl">
            <View className="">
              {/* Property Details */}
              <View className="items-center">
                <Text className="text-xl font-semibold mb-2 mt-6">
                  {data?.title}
                </Text>
                <Text className="text-sm text-gray-600">
                  {data?.city}, {data?.state}
                </Text>
                <Text className="text-sm text-gray-600">
                  {data?.maxGuests} guest · 1 bed · 1 bathroom
                </Text>
              </View>

              {/* Stats */}
              <View className="flex-row w-full items-center justify-around gap-3 border-b border-zinc-300 py-6">
                <View className="flex-row items-center gap-1">
                  <Star />
                  <Text className="font-semibold text-gray-900">
                    {data.avg_rating ? data.avg_rating : "NA"}
                  </Text>
                  <Text className="text-sm text-gray-500 ml-1" />
                </View>

                <View className="h-10 w-0.5 rounded-full bg-zinc-300" />

                <View className="items-center">
                  <Text className="font-semibold text-gray-900">
                    {timeSinceMinOneMonth(data.$createdAt)}
                  </Text>
                </View>

                <View className="h-10 w-0.5 rounded-full bg-zinc-300" />

                <View className="items-center">
                  <Text className="font-semibold text-gray-900">
                    {data.review_count ? data.review_count : "0"}
                  </Text>
                  <Text className="text-sm text-gray-500">Reviews</Text>
                </View>
              </View>

              {/* Description */}
              <View className="py-8 border-b border-zinc-300">
                <ExpandableText limit={200} text={data?.description} />
              </View>

              {/* Amenities */}
              <View className="py-8 border-b border-zinc-300">
                <Text className="text-xl font-semibold mb-6">
                  What this place offers
                </Text>
                <View className="gap-4">
                  {data?.amenities &&
                    data.amenities.map((amenity: string) => {
                      const iconData =
                        amenityIcons[amenity] || amenityIcons["default"];
                      const Icon = iconData.component;
                      return (
                        <View
                          key={amenity}
                          className="flex-row items-center gap-4"
                        >
                          <Icon name={iconData.name} size={24} color="black" />
                          <Text>
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </Text>
                        </View>
                      );
                    })}
                </View>
              </View>
              {/* Add-ons */}
              {data?.addOns && data.addOns.length > 0 && (
                <View className="py-8 border-b border-zinc-300">
                  <Text className="text-xl font-semibold">
                    Add-ons available
                  </Text>
                  <Text className="text-sm text-gray-500 mb-6">
                    These can be added during checkout
                  </Text>
                  {addOnsArray[0].map(
                    (addOn: { name: string; price: string }, index: number) => (
                      <View
                        key={`${addOn.name}-${index}`}
                        className="flex-row items-center justify-between"
                      >
                        <View className="flex flex-row gap-2 items-center">
                          <Feather name="plus-circle" size={22} color="black" />
                          <Text className="text-base text-gray-900">
                            {addOn.name}
                          </Text>
                        </View>

                        <Text className="text-base font-medium text-gray-900">
                          ₹{Number(addOn.price).toLocaleString("en-IN")}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}

              {/* Map */}
              <View className="py-8 border-b border-zinc-300">
                <Text className="text-xl font-semibold mb-2">
                  Where you&apos;ll be
                </Text>
                <Text className="text-zinc-500 text-sm mb-6">
                  {data?.address}
                </Text>
                <Map />
              </View>

              {/* Host */}
              <View className="py-8">
                <Text className="text-xl text-center font-semibold mb-6">
                  Meet your host
                </Text>
                <ProfileCard owner={owner} />
              </View>

              {/* Reviews */}
              <View className="py-8 border-y border-zinc-300">
                <Text className="text-xl font-semibold mb-6">Reviews</Text>
                <View className="flex-row items-center gap-2 mb-4">
                  <Star />
                  <Text className="text-lg font-medium">
                    {data.avg_rating ? data.avg_rating + " • " : ""}
                    {data.review_count ? data.review_count : "0"} Reviews
                  </Text>
                </View>
                {data.review_count > 0 ? (
                  <ReviewCarousel listingId={data.$id} />
                ) : (
                  <View className="w-full flex items-center justify-center h-12">
                    <Text className="">No reviews yet.</Text>
                  </View>
                )}
              </View>

              {/* Highlights */}
              <View className="py-8 space-y-6 w-full">
                <View className="flex-row items-start gap-4">
                  <FontAwesome
                    name="calendar-times-o"
                    size={24}
                    color="black"
                  />
                  <View className="flex-1">
                    <Text className="font-medium mb-1">
                      Cancellation Policy
                    </Text>
                    <Text className="text-sm text-gray-600">
                      • 90% refund for cancellations made up to 24 hours before
                      check-in{"\n"}• 50% refund for cancellations made up to 4
                      hours before check-in{"\n"}• No refund if cancelled within
                      the last 4 hours before check-in.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start gap-4">
                  <FontAwesome6 name="key" size={24} color="black" />
                  <View className="flex-1">
                    <Text className="font-medium mb-1">
                      Seamless Check-in Experience
                    </Text>
                    <Text className="text-sm text-gray-600">
                      We prioritize a smooth arrival. Fast, hassle-free check-in
                      with clear instructions and support available if needed.
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-start gap-4">
                  <MaterialIcons name="money-off" size={24} color="black" />
                  <View className="flex-1">
                    <Text className="font-medium mb-1">
                      Transparent Pricing
                    </Text>
                    <Text className="text-sm text-gray-600">
                      No hidden charges. All prices are shown upfront, including
                      taxes and service fees.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="h-20 w-full"></View>
        </View>
        <PriceModal
          visible={priceOpen}
          onClose={() => setPriceOpen(false)}
          nights={nights}
          pricePerNight={2065.53}
          subtotal={nights * 2065.53}
          datesLabel={searchState.calendar?.label || ""}
          cancellationText="Free cancellation before 11 December"
          currencySymbol="₹"
        />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute left-0 right-0 bottom-0 h-20 flex-row items-center justify-between shadow-sm bg-white p-4 border-t border-gray-200 z-20">
        <Pressable onPress={() => setPriceOpen(true)}>
          <Text className="font-semibold underline">
            Rs {nights * 2065.53} /-
          </Text>
          <Text className="text-zinc-500 text-sm">
            For {nights} {nights > 1 ? "nights" : "night"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push(`/property/reserve`)}>
          <View className="bg-pink-600 rounded-full px-6 py-2 min-w-10">
            <Text className="text-white font-medium text-center">Reserve</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
}

function timeSinceMinOneMonth(createdAt: Date) {
  const start = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  // Adjust if current day is before the created day
  if (now.getDate() < start.getDate()) {
    months--;
  }

  const totalMonths = years * 12 + months;

  // Minimum is always 1 Month
  if (totalMonths <= 0) {
    return "1 Month";
  }

  if (totalMonths >= 12) {
    const y = Math.floor(totalMonths / 12);
    return `${y} Year${y > 1 ? "s" : ""}`;
  }

  return `${totalMonths} Month${totalMonths > 1 ? "s" : ""}`;
}
