import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";
import {
  BookingDurationSelector,
  type BookingDuration,
} from "@/components/BookingDuration";

import { useState, useEffect } from "react";
import { View, Pressable, Text, FlatList } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Component from "@/components/Search";
import { FiltersModal } from "@/components/Filters";
import type { FiltersState } from "@/components/Filters";

import { useSearch } from "@/src/contexts/SearchContext";
import { useListings } from "@/src/contexts/ListingContext";
import * as Location from "expo-location";

export default function HomeScreen() {
  const { searchState } = useSearch();
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLong, setUserLong] = useState<number | null>(null);
  const [locationReady, setLocationReady] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState | null>(null);

  const searchText = searchState.search?.trim() ?? "";
  const cityLat = searchState.city?.lat ?? userLat ?? null;
  const cityLong = searchState.city?.long ?? userLong ?? null;

  const guests = searchState.guests ?? null;
  useEffect(() => {
    async function getLocation() {
      // If user already chose something → skip
      if (searchState.city || searchState.search) {
        setLocationReady(true);
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationReady(true); // ➜ fallback to newest
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLat(loc.coords.latitude);
        setUserLong(loc.coords.longitude);
      } catch (err) {
        console.log("Location error:", err);
      } finally {
        setLocationReady(true); // important
      }
    }

    getLocation();
  }, [searchState.city, searchState.search]);

  const { listings, loading, hasMore, refresh, loadMore } = useListings(
    {
      searchText,
      cityLat,
      cityLong,
      guests,
      filters,
    },
    locationReady
  );
  const isSearchActive = !!searchText;

  const setDuration = (duration: BookingDuration) => {
    setFilters((prev) => ({
      minPrice: prev?.minPrice ?? 100,
      maxPrice: prev?.maxPrice ?? 50000,
      placeTypes: prev?.placeTypes ?? [],
      bookingOptions: prev?.bookingOptions ?? [],
      duration, // 👈 SAME NAME
    }));
  };

  return (
    <>
      {/* ---------------- SEARCH BAR ---------------- */}
      <View className="items-center py-5">
        <Pressable onPress={() => setOpenSearch(true)} style={{ width: "90%" }}>
          <View className="w-full h-20 bg-white rounded-full shadow-sm flex-row items-center px-4">
            {/* LEFT */}
            <View className="pl-2 flex-row items-center gap-3 flex-1">
              <Feather name="search" size={20} color="black" />

              <View
                className="flex-col"
                style={{ maxWidth: "100%", paddingRight: 80 }}
              >
                {/* Title */}
                <Text className="font-medium" numberOfLines={1}>
                  {searchState.city?.name === "Nearby"
                    ? "Nearby"
                    : searchState.search || "Search"}
                </Text>

                {/* Calendar + Guests */}
                <View className="flex-row flex-wrap items-center">
                  <Text
                    className="text-sm text-zinc-500"
                    numberOfLines={1}
                    style={{ flexShrink: 0 }}
                  >
                    {searchState.calendar?.label || "Anytime"}
                  </Text>

                  <Text
                    className="text-sm text-zinc-400 mx-1"
                    style={{ flexShrink: 0 }}
                  >
                    •
                  </Text>

                  <Text
                    className="text-sm text-zinc-500"
                    numberOfLines={1}
                    style={{ flexShrink: 0 }}
                  >
                    {searchState.guests?.label || "Guests"}
                  </Text>
                </View>
              </View>
            </View>

            {/* RIGHT */}
            <Pressable onPress={() => setShowFilters(true)}>
              <View className="rounded-full bg-white w-16 aspect-square shadow-sm flex items-center justify-center">
                <Ionicons name="options" size={24} color="black" />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </View>
      <View className="px-[5vw] mb-2">
        <BookingDurationSelector
          value={filters?.duration ?? null}
          onChange={setDuration}
        />
      </View>

      {/* ---------------- LIST ---------------- */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <ListingCard data={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && hasMore && !isSearchActive) {
            loadMore();
          }
        }}
        refreshing={loading}
        onRefresh={refresh}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        ListFooterComponent={
          loading ? (
            <View className="px-[5vw]">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : !hasMore ? (
            <Text className="text-zinc-400 text-sm py-4 text-center">
              No more listings
            </Text>
          ) : null
        }
      />

      {/* ---------------- MODALS ---------------- */}
      <FiltersModal
        visible={showFilters}
        initialFilters={filters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
      />

      <Component visible={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}
