import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";

import { Query } from "react-native-appwrite";
import { useEffect, useState, useCallback, useRef } from "react";
import { getFileUrl, tablesDB } from "../../lib/appwrite";

import { View, Pressable, Text, FlatList } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import CityDestinationSelector from "@/components/Search";
import { useSearch } from "@/src/contexts/SearchContext";
import { FiltersModal } from "@/components/Filters";
import type { FiltersState } from "@/components/Filters";

const PAGE_SIZE = 10;
const SEARCH_PAGE_SIZE = 50;

export default function HomeScreen() {
  const { searchState } = useSearch();

  const [openSearch, setOpenSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState | null>(null);

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const endReachedRef = useRef(false);

  const searchText = searchState.search?.trim() ?? "";
  const cityLat = searchState.city?.lat ?? null;
  const cityLong = searchState.city?.long ?? null;
  const guests = searchState.guests ?? null;

  const isSearchActive = !!searchText;
  const prevSearchRef = useRef(isSearchActive);

  /** ---------------- FETCH ---------------- */
  const fetchListings = useCallback(
    async (initial: boolean) => {
      if (isFetchingRef.current) return;
      if (!hasMore && !initial) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        let queries: any[] = [
          Query.orderDesc("$createdAt"),
          Query.limit(isSearchActive ? SEARCH_PAGE_SIZE : PAGE_SIZE),
        ];

        // ❗ cursor ONLY for non-search
        if (!isSearchActive && !initial && lastId) {
          queries.push(Query.cursorAfter(lastId));
        }

        if (!isSearchActive && filters) {
          if (filters.placeTypes.length)
            queries.push(Query.equal("category", filters.placeTypes));
          if (filters.bookingOptions.includes("pets"))
            queries.push(Query.greaterThan("maxPets", 0));
          if (filters.bookingOptions.includes("infants"))
            queries.push(Query.greaterThan("maxInfants", 0));
          if (filters.bookingOptions.includes("children"))
            queries.push(Query.equal("allowChildren", true));
        }

        let rows: any[] = [];

        if (isSearchActive) {
          const [byTitle, byCity, byAddress] = await Promise.all([
            tablesDB.listRows({
              databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
              tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
              queries: [...queries, Query.search("title", searchText)],
            }),
            tablesDB.listRows({
              databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
              tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
              queries: [...queries, Query.search("city", searchText)],
            }),
            tablesDB.listRows({
              databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
              tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
              queries: [...queries, Query.search("address", searchText)],
            }),
          ]);

          rows = mergeUniqueById([byTitle.rows, byCity.rows, byAddress.rows]);
        } else {
          const res = await tablesDB.listRows({
            databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
            queries,
          });
          rows = res.rows;
        }

        let processed = rows.map((l: any) => ({
          ...l,
          images: (Array.isArray(l.imageIds) ? l.imageIds : [l.imageId]).map(
            getFileUrl
          ),
        }));

        if (cityLat && cityLong && initial) {
          processed = processed
            .map((l) =>
              l.latitude && l.longitude
                ? {
                    ...l,
                    distance: getDistanceKm(
                      cityLat,
                      cityLong,
                      l.latitude,
                      l.longitude
                    ),
                  }
                : l
            )
            .filter((l) => l.distance !== undefined)
            .sort((a, b) => a.distance - b.distance);
        }

        if (guests) {
          const { adults, children, infants, pets } = guests;
          processed = processed.filter(
            (l) =>
              adults <= l.maxAdults &&
              children <= l.maxChildren &&
              infants <= l.maxInfants &&
              pets <= l.maxPets
          );
        }

        if (isSearchActive) {
          // 🔒 SEARCH MODE: no pagination state
          setListings(processed);
          setHasMore(false);
          setLastId(null);
        } else {
          // 📦 NORMAL MODE: cursor pagination
          setListings((prev) =>
            initial ? processed : [...prev, ...processed]
          );
          setLastId(processed.at(-1)?.$id ?? null);
          setHasMore(processed.length === PAGE_SIZE);
        }
      } finally {
        isFetchingRef.current = false;
        endReachedRef.current = false;
        setLoading(false);
      }
    },
    [
      filters,
      searchText,
      cityLat,
      cityLong,
      guests,
      lastId,
      hasMore,
      isSearchActive,
    ]
  );

  const fetchRef = useRef(fetchListings);
  useEffect(() => {
    fetchRef.current = fetchListings;
  }, [fetchListings]);

  useEffect(() => {
    if (prevSearchRef.current && !isSearchActive) {
      // 🔄 search → normal
      setListings([]);
      setLastId(null);
      setHasMore(true);

      fetchRef.current(true);
    }

    prevSearchRef.current = isSearchActive;
  }, [isSearchActive]);

  /** ---------------- RESET ON INPUT CHANGE ---------------- */
  useEffect(() => {
    isFetchingRef.current = false;
    endReachedRef.current = false;

    setListings([]);
    setLastId(null);
    setHasMore(true);

    fetchRef.current(true);
  }, [filters, searchText, cityLat, cityLong, guests]);

  return (
    <>
      <View className="items-center py-5">
        <Pressable onPress={() => setOpenSearch(true)} style={{ width: "90%" }}>
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

            <Pressable onPress={() => setShowFilters(true)}>
              <View className="rounded-full shadow-sm aspect-square flex items-center justify-center px-4">
                <Ionicons name="options" size={24} color="black" />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </View>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <ListingCard data={item} />}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (
            loading ||
            !hasMore ||
            endReachedRef.current ||
            isSearchActive // 🔥 ADD THIS
          )
            return;

          endReachedRef.current = true;
          fetchListings(false);
        }}
        ListFooterComponent={
          loading ? (
            <View className="w-screen h-full px-[5vw]">
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

/* ---------------- HELPERS ---------------- */

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mergeUniqueById(arrays: any[][]) {
  const map = new Map<string, any>();
  arrays.flat().forEach((i) => map.set(i.$id, i));
  return Array.from(map.values());
}
