import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";

import { useState } from "react";
import { View, Pressable, Text, FlatList } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import CityDestinationSelector from "@/components/Search";
import { FiltersModal } from "@/components/Filters";
import type { FiltersState } from "@/components/Filters";

import { useSearch } from "@/src/contexts/SearchContext";
import { useListings } from "@/src/contexts/ListingContext";

export default function HomeScreen() {
  const { searchState } = useSearch();

  const [openSearch, setOpenSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState | null>(null);

  const searchText = searchState.search?.trim() ?? "";
  const cityLat = searchState.city?.lat ?? null;
  const cityLong = searchState.city?.long ?? null;
  const guests = searchState.guests ?? null;

  const { listings, loading, hasMore, refresh, loadMore } = useListings({
    searchText,
    cityLat,
    cityLong,
    guests,
    filters,
  });

  const isSearchActive = !!searchText;

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
                  {searchState.search || "Where To?"}
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

      <CityDestinationSelector
        visible={openSearch}
        onClose={() => setOpenSearch(false)}
      />
    </>
  );
}
