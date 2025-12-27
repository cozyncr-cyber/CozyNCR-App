import { createContext, useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Query } from "react-native-appwrite";
import { tablesDB, getImagePreviewUrl } from "../../lib/appwrite";
type PropertyContextType = {
  data: any;
  owner: any;
  loading: boolean;
  bookings: any[];
  blockedDates: Date[];
  checkoutOnlyDates: Date[];
};

const PropertyContext = createContext<PropertyContextType | null>(null);

export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) {
    throw new Error("useProperty must be used inside PropertyProvider");
  }
  return ctx;
}

/* ---------------- HELPERS ---------------- */

function getDatesBetween(start: Date, end: Date) {
  const dates: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function PropertyProvider({ children }: any) {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [checkoutOnlyDates, setCheckoutOnlyDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  async function init() {
    setLoading(true);
    try {
      /* 1) Fetch listing */
      const listingRes = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
        queries: [Query.equal("$id", id)],
      });

      if (!listingRes.rows.length) {
        setData(null);
        setOwner(null);
        setBookings([]);
        setBlockedDates([]);
        return;
      }

      const listing = listingRes.rows[0];

      /* Images */
      const fileIds = Array.isArray(listing.imageIds)
        ? listing.imageIds
        : listing.imageId
          ? [listing.imageId]
          : [];
      const images = fileIds.map((id: string) =>
        getImagePreviewUrl(id, {
          width: 400,
          height: 400,
          quality: 65,
        })
      );

      setData({ ...listing, images });

      /* 2) Fetch owner */
      /* 2) Fetch owner */
      if (listing.ownerId) {
        const ownerRes = await tablesDB.listRows({
          databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: process.env.EXPO_PUBLIC_APPWRITE_PROFILES_TABLE_ID!,
          queries: [Query.equal("$id", listing.ownerId)],
        });

        const ownerDoc = ownerRes.rows[0] ?? null;

        // 🚫 if owner deleted → treat listing as gone
        if (ownerDoc?.isDeleted) {
          setOwner(ownerDoc);
          setData(null);
          setBookings([]);
          setBlockedDates([]);
          setCheckoutOnlyDates([]);
          return;
        }

        setOwner(ownerDoc);
      } else {
        setOwner(null);
      }

      /* 3) Fetch CONFIRMED bookings */
      const bookingsRes = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_TABLE_ID!,
        queries: [
          Query.equal("listingId", listing.$id),
          Query.equal("status", "confirmed"),
        ],
      });

      const confirmedBookings = bookingsRes.rows;
      setBookings(confirmedBookings);

      /* 4) Convert bookings → blocked dates */ const blocked: Date[] = [];
      const checkoutOnly: Date[] = [];

      confirmedBookings.forEach((b: any) => {
        if (!b.startTime || !b.endTime) return;

        const start = new Date(b.startTime);
        const end = new Date(b.endTime);

        // normalize
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // ✅ first day → checkout-only
        checkoutOnly.push(new Date(start));

        // ❌ remaining days → blocked
        const current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current <= end) {
          blocked.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });

      setBlockedDates(blocked);
      setCheckoutOnlyDates(checkoutOnly);
    } catch (err) {
      console.log("Error fetching property data:", err);
      setOwner(null);
      setBookings([]);
      setBlockedDates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) init();
  }, [id]);

  return (
    <PropertyContext.Provider
      value={{
        data,
        owner,
        loading,
        bookings,
        blockedDates,
        checkoutOnlyDates,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}
