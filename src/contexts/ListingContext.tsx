import { useCallback, useEffect, useRef, useState } from "react";
import { Query } from "react-native-appwrite";
import { tablesDB, getFileUrl } from "@/lib/appwrite";
import type { FiltersState } from "@/components/Filters";

const PAGE_SIZE = 10;
const SEARCH_PAGE_SIZE = 50;

type Guests = {
  adults: number;
  children: number;
  infants: number;
  pets: number;
};

type Params = {
  searchText: string;
  cityLat: number | null;
  cityLong: number | null;
  guests: Guests | null;
  filters: FiltersState | null;
};

type Mode = "FEED" | "SEARCH";

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!;

/* ---------------- HELPERS ---------------- */

function buildQueries({
  mode,
  filters,
  lastId,
  initial,
}: {
  mode: Mode;
  filters: FiltersState | null;
  lastId: string | null;
  initial: boolean;
}) {
  const queries: any[] = [
    Query.orderDesc("$createdAt"),
    Query.limit(mode === "SEARCH" ? SEARCH_PAGE_SIZE : PAGE_SIZE),
  ];

  if (mode === "FEED" && !initial && lastId) {
    queries.push(Query.cursorAfter(lastId));
  }

  if (filters) {
    if (filters.placeTypes.length) {
      queries.push(Query.equal("category", filters.placeTypes));
    }

    if (filters.bookingOptions.includes("pets")) {
      queries.push(Query.greaterThan("maxPets", 0));
    }

    if (filters.bookingOptions.includes("infants")) {
      queries.push(Query.greaterThan("maxInfants", 0));
    }

    if (filters.bookingOptions.includes("children")) {
      queries.push(Query.equal("allowChildren", true));
    }

    // ✅ DURATION + PRICE
    if (filters.duration) {
      const priceField = DURATION_PRICE_FIELD[filters.duration];

      // price_xh must exist
      queries.push(Query.isNotNull(priceField));

      if (filters.minPrice !== null) {
        queries.push(Query.greaterThanEqual(priceField, filters.minPrice));
      }

      if (filters.maxPrice !== null) {
        queries.push(Query.lessThanEqual(priceField, filters.maxPrice));
      }
    }
  }

  return queries;
}
async function fetchSearchRows(queries: any[], searchText: string) {
  const fields = ["title", "city", "address"];

  const results = await Promise.all(
    fields.map((field) =>
      tablesDB.listRows({
        databaseId: DB_ID,
        tableId: TABLE_ID,
        queries: [...queries, Query.search(field, searchText)],
      })
    )
  );

  const map = new Map<string, any>();
  results.forEach((r) => r.rows.forEach((row: any) => map.set(row.$id, row)));

  return Array.from(map.values());
}

function processListings(
  rows: any[],
  cityLat: number | null,
  cityLong: number | null,
  guests: Guests | null,
  sortByDistance: boolean
) {
  console.log("GUEST FILTER INPUT:", guests);
  let processed = rows.map((l) => ({
    ...l,
    images: (Array.isArray(l.imageIds) ? l.imageIds : [l.imageId]).map(
      getFileUrl
    ),
  }));

  if (sortByDistance && cityLat && cityLong) {
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
          : null
      )
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance - b.distance);
  }

  if (guests) {
    const { adults, children, infants, pets } = guests;

    processed = processed.filter((l) => {
      const totalGuests = adults + children;

      // 1️⃣ Total guests (adults + children)
      if (totalGuests > l.maxGuests) return false;

      // 2️⃣ Children policy
      if (children > 0 && !l.allowChildren) return false;

      // 3️⃣ Infants
      if (infants > l.maxInfants) return false;

      // 4️⃣ Pets
      if (pets > l.maxPets) return false;

      return true;
    });
  }
  return processed;
}

/* ---------------- HOOK ---------------- */

export function useListings({
  searchText,
  cityLat,
  cityLong,
  guests,
  filters,
}: Params) {
  const requestIdRef = useRef(0);
  const mode: Mode = searchText ? "SEARCH" : "FEED";

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const fetchListings = useCallback(
    async (initial: boolean) => {
      if (isFetchingRef.current) return;
      if (mode === "FEED" && !hasMore && !initial) return;

      const currentRequestId = ++requestIdRef.current;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const queries = buildQueries({
          mode,
          filters,
          lastId,
          initial,
        });

        const rows =
          mode === "SEARCH"
            ? await fetchSearchRows(queries, searchText)
            : (
                await tablesDB.listRows({
                  databaseId: DB_ID,
                  tableId: TABLE_ID,
                  queries,
                })
              ).rows;

        const processed = processListings(
          rows,
          cityLat,
          cityLong,
          guests,
          initial && mode === "FEED"
        );

        // 🛑 Ignore stale responses
        if (currentRequestId !== requestIdRef.current) return;

        if (mode === "SEARCH") {
          setListings(processed);
          setHasMore(false);
          setLastId(null);
        } else {
          setListings((prev) =>
            initial ? processed : [...prev, ...processed]
          );
          setLastId(processed.at(-1)?.$id ?? null);
          setHasMore(processed.length === PAGE_SIZE);
        }
      } finally {
        // 🛑 Only clear loading for latest request
        if (currentRequestId === requestIdRef.current) {
          isFetchingRef.current = false;
          setLoading(false);
        }
      }
    },
    [mode, filters, searchText, cityLat, cityLong, guests, lastId, hasMore]
  );

  /* Reset & refetch on inputs change */
  useEffect(() => {
    setListings([]);
    setLastId(null);
    setHasMore(true);
    fetchListings(true);
  }, [mode, filters, searchText, cityLat, cityLong, guests]);

  return {
    listings,
    loading,
    hasMore,
    refresh: () => fetchListings(true),
    loadMore: () => fetchListings(false),
  };
}

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

const DURATION_PRICE_FIELD: Record<"3h" | "6h" | "12h" | "24h", string> = {
  "3h": "price_3h",
  "6h": "price_6h",
  "12h": "price_12h",
  "24h": "price_24h",
};
