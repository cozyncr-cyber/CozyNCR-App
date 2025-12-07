import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";

import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { getFileUrl, tablesDB } from "../../lib/appwrite";

import { View, ScrollView, Pressable, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);

  async function init() {
    try {
      const response = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
        queries: [Query.orderDesc("$createdAt"), Query.limit(10)],
      });

      const listingsWithImages = response.rows.map((listing: any) => {
        const fileIds = Array.isArray(listing.imageIds)
          ? listing.imageIds
          : listing.imageId
            ? [listing.imageId]
            : [];

        const images = fileIds.map((id: any) => getFileUrl(id));

        return { ...listing, images };
      });

      setListings(listingsWithImages);
      console.log("Listings length:", listingsWithImages.length);
    } catch (e) {
      console.error("Error fetching listings", e);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <ScrollView className="bg-white">
        {/* Search pill */}
        <View className="items-center py-5">
          <Pressable onPress={() => setOpen(true)} style={{ width: "90%" }}>
            <View className="w-full h-20 bg-white rounded-full shadow-sm flex-row items-center px-4 justify-between">
              <View className="pl-2 flex-row items-center gap-3">
                <Feather name="search" size={24} color="black" />
                <View className="flex-col">
                  <Text className="font-medium">Where To?</Text>
                  <View className="mt-0.5 flex-row flex-wrap gap-0.5">
                    <Text className="text-sm text-zinc-500">Anytime </Text>
                    <Text className="text-sm text-zinc-500">• </Text>
                    <Text className="text-sm text-zinc-500">Add guests</Text>
                  </View>
                </View>
              </View>

              <View className="rounded-full px-4">
                <Ionicons name="options" size={24} color="black" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Listings */}
        <View className="items-center flex-col gap-8 pb-8">
          {listings.map((listing: any) => (
            <ListingCard key={listing.$id} data={listing} />
          ))}

          <View className="w-[90%]">
            <SkeletonCard />
          </View>
        </View>
      </ScrollView>

      {/* Sheet */}
      <View
        className="absolute left-0 right-0 bg-white z-50 px-5 pt-5 pb-2"
        style={{
          top: open ? 0 : -800, // slide off-screen when closed
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Text className="text-xl font-semibold mb-4">Filters</Text>

        <View>
          <View className="flex-row justify-between mb-3 border-b border-zinc-400 pb-3">
            <Text className="text-base text-gray-700">
              2 nights × ₹2,065.53
            </Text>
            <Text className="text-base font-semibold">₹4,131.06</Text>
          </View>
        </View>

        <Pressable
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4"
          onPress={() => setOpen(false)}
        />
      </View>

      {/* Backdrop */}
      {open && (
        <Pressable
          className="absolute inset-0 bg-black/40 z-40"
          onPress={() => setOpen(false)}
        />
      )}
    </>
  );
}
