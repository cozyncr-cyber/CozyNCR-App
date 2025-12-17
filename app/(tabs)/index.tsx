import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";

import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { getFileUrl, tablesDB } from "../../lib/appwrite";

import { View, ScrollView, Pressable, Text } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import CityDestinationSelector from "@/components/Search";
import { useSearch } from "@/src/contexts/SearchContext";

export default function HomeScreen() {
  const [openSearch, setOpenSearch] = useState(false);
  const { searchState } = useSearch();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  async function fetchListings(initial = false) {
    if (loading || (!hasMore && !initial)) return;

    setLoading(true);

    try {
      const queries = [Query.orderDesc("$createdAt"), Query.limit(PAGE_SIZE)];

      if (!initial && lastId) {
        queries.push(Query.cursorAfter(lastId));
      }

      const response = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
        queries,
      });

      const newListings = response.rows.map((listing: any) => {
        const fileIds = Array.isArray(listing.imageIds)
          ? listing.imageIds
          : listing.imageId
            ? [listing.imageId]
            : [];

        return {
          ...listing,
          images: fileIds.map((id: any) => getFileUrl(id)),
        };
      });

      setListings((prev) =>
        initial ? newListings : [...prev, ...newListings]
      );

      if (newListings.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (newListings.length > 0) {
        setLastId(newListings[newListings.length - 1].$id);
      }
    } catch (e) {
      console.error("Error fetching listings", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings(true);
  }, []);

  return (
    <>
      <ScrollView
        className="bg-white"
        onScroll={({ nativeEvent }) => {
          const paddingToBottom = 200;
          const isNearBottom =
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom;

          if (isNearBottom) {
            fetchListings();
          }
        }}
        scrollEventThrottle={16}
      >
        {/* Search pill */}
        <View className="items-center py-5">
          <Pressable
            onPress={() => setOpenSearch(true)}
            style={{ width: "90%" }}
          >
            <View className="w-full h-20 bg-white rounded-full shadow-sm flex-row items-center px-4 justify-between">
              <View className="pl-2 flex-row items-center gap-3">
                <Feather name="search" size={24} color="black" />

                {/* <-- WRAPS TEXT NOW --> */}
                <View className="flex-col flex flex-wrap max-w-[70%]">
                  <Text className="font-medium">
                    {searchState.search ? searchState.search : "Where To?"}
                  </Text>

                  <View className="mt-2 flex-row flex-wrap gap-0.5">
                    <Text className="text-sm text-zinc-500">
                      {searchState.calendar
                        ? searchState.calendar.label
                        : "Anytime"}
                    </Text>

                    <Text className="text-sm text-zinc-500">•</Text>

                    <Text className="text-sm text-zinc-500">
                      {searchState.guests
                        ? searchState.guests.label
                        : "Add Guests"}
                    </Text>
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

          {loading && (
            <View className="w-[90%]">
              <SkeletonCard />
              <SkeletonCard />
            </View>
          )}

          {!hasMore && (
            <Text className="text-zinc-400 text-sm py-4">No more listings</Text>
          )}
        </View>
      </ScrollView>

      <CityDestinationSelector
        visible={openSearch}
        onClose={() => setOpenSearch(false)}
      />
    </>
  );
}
