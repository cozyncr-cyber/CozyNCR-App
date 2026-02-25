import { amenityIcons } from "@/components/AmenityIcon";
import ExpandableText from "@/components/Expandable";
import Map from "@/components/Map";
import ProfileCard from "@/components/ProfileCard";
import ReviewCarousel from "@/components/Reviews";
import Star from "@/components/SVGs/Star";
import { useProperty } from "@/src/contexts/PropertyContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function GuestPropertyDetails() {
  const { data, owner, loading } = useProperty();
  const { width } = Dimensions.get("window");
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  const minimumPrice = useMemo(() => getMinimumBookingPrice(data), [data]);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg font-semibold mb-2">
          This listing no longer exists
        </Text>
        <Text className="text-gray-500 text-center">
          The owner has removed this property.
        </Text>
      </View>
    );
  }

  const visibleAmenities = data?.amenities?.slice(0, 6) ?? [];
  const hasMore = (data?.amenities?.length ?? 0) > 6;

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* BACK + SHARE */}
        <View className="absolute z-10 top-6 left-4">
          <Pressable
            onPress={() => router.replace("/")}
            className="w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={22} />
          </Pressable>
        </View>

        {/* IMAGES */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {data.images?.map((src: string, index: number) => (
              <Image
                key={index}
                source={{ uri: src }}
                style={{ width, height: width }}
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

        {/* CONTENT */}
        <View className="px-6 pt-6">
          <Text className="text-xl font-semibold text-center mb-2">
            {data.title}
          </Text>

          <Text className="text-center text-gray-600">
            {data.city}, {data.state}
          </Text>

          <Text className="text-center text-gray-600 mb-6">
            Up to {data.maxGuests} guests
          </Text>

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
          {/* DESCRIPTION */}
          <ExpandableText limit={200} text={data.description} />

          {/* AMENITIES */}
          <View className="py-8 border-b border-zinc-300">
            <Text className="text-xl font-semibold mb-6">
              What this place offers
            </Text>

            {visibleAmenities.map((amenity: string) => {
              const iconData = amenityIcons[amenity] || amenityIcons["default"];
              const Icon = iconData.component;

              return (
                <View
                  key={amenity}
                  className="flex-row items-center gap-4 mb-3"
                >
                  <Icon size={22} color="black" />
                  <Text>
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                  </Text>
                </View>
              );
            })}

            {hasMore && (
              <TouchableOpacity onPress={() => setShowAmenitiesModal(true)}>
                <Text className="text-blue-600 font-semibold">
                  See all amenities
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* MAP */}
          <View className="py-8 border-b border-zinc-300">
            <Text className="text-xl font-semibold mb-2">Where you’ll be</Text>

            <Text className="text-zinc-500 text-sm mb-6">
              Exact location available after booking.
            </Text>

            <Map data={data} />
          </View>

          {/* HOST */}
          <View className="py-8">
            <Text className="text-xl text-center font-semibold mb-6">
              Meet your host
            </Text>
            <ProfileCard owner={owner} />
          </View>

          {/* REVIEWS */}
          <View className="py-8 border-y border-zinc-300">
            <Text className="text-xl font-semibold mb-6">Reviews</Text>

            {data.review_count > 0 ? (
              <ReviewCarousel listingId={data.$id} />
            ) : (
              <Text>No reviews yet.</Text>
            )}
          </View>

          <View className="h-64" />
        </View>
      </ScrollView>

      {/* GUEST STICKY BAR */}
      <View className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-gray-200">
        <Text className="font-semibold text-lg">
          {minimumPrice
            ? `₹${minimumPrice.toLocaleString("en-IN")}`
            : "Price unavailable"}
        </Text>

        <Text className="text-gray-600 mb-3 text-sm">
          Sign in to:
          {"\n"}• Secure your reservation instantly
          {"\n"}• Save this property to your wishlist
          {"\n"}• Contact the host
          {"\n"}• View exact address
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/signin")}
          className="bg-black py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-medium text-lg">
            Login to Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* AMENITIES MODAL */}
      <Modal visible={showAmenitiesModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white p-6 rounded-t-3xl max-h-[75%]">
            <Text className="text-xl font-semibold mb-4">All amenities</Text>

            <ScrollView>
              {data?.amenities?.map((amenity: string) => {
                const iconData =
                  amenityIcons[amenity] || amenityIcons["default"];
                const Icon = iconData.component;

                return (
                  <View
                    key={amenity}
                    className="flex-row items-center gap-4 mb-3"
                  >
                    <Icon size={22} color="black" />
                    <Text>
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowAmenitiesModal(false)}
              className="mt-4 items-center"
            >
              <Text className="text-blue-600 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

function getMinimumBookingPrice(data: any): number | null {
  if (!data) return null;

  if (data.price_24h && Number(data.price_24h) > 0) {
    return Number(data.price_24h);
  }

  const prices = [data.price_3h, data.price_6h, data.price_12h]
    .map(Number)
    .filter((p) => !isNaN(p) && p > 0);

  if (!prices.length) return null;

  return Math.min(...prices);
}
