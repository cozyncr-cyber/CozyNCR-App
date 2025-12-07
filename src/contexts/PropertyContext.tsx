import { createContext, useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Query } from "react-native-appwrite";
import { tablesDB, getFileUrl } from "../../lib/appwrite";

type PropertyContextType = {
  data: any;
  owner: any;
  loading: boolean;
};

const PropertyContext = createContext<PropertyContextType | null>(null);

export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) {
    throw new Error("useProperty must be used inside PropertyProvider");
  }
  return ctx;
}

export function PropertyProvider({ children }: any) {
  const { id } = useLocalSearchParams<{ id: string }>(); // listing id from URL

  const [data, setData] = useState<any>(null); // listing
  const [owner, setOwner] = useState<any>(null); // owner profile
  const [loading, setLoading] = useState(true);

  async function init() {
    setLoading(true);
    try {
      // 1) Fetch listing
      const listingRes = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!,
        queries: [Query.equal("$id", id)],
      });

      if (!listingRes.rows.length) {
        setData(null);
        setOwner(null);
        return;
      }

      const listing = listingRes.rows[0];

      // Images
      const fileIds = Array.isArray(listing.imageIds)
        ? listing.imageIds
        : listing.imageId
          ? [listing.imageId]
          : [];

      const images = fileIds.map((fileId) => getFileUrl(fileId));
      const listingWithImages = { ...listing, images };
      setData(listingWithImages);

      // 2) Fetch owner profile (if owner_id exists)
      if (listing.ownerId) {
        const ownerRes = await tablesDB.listRows({
          databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: process.env.EXPO_PUBLIC_APPWRITE_PROFILES_TABLE_ID!, // your profiles table
          queries: [Query.equal("$id", listing.ownerId)],
        });

        if (ownerRes.rows.length) {
          setOwner(ownerRes.rows[0]);
        } else {
          setOwner(null);
        }
      } else {
        setOwner(null);
      }
    } catch (err) {
      console.log("Error fetching listing or owner:", err);
      setOwner(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) init();
  }, [id]);

  return (
    <PropertyContext.Provider value={{ data, owner, loading }}>
      {children}
    </PropertyContext.Provider>
  );
}
