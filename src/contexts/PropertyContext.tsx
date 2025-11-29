import { createContext, useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Query } from "react-native-appwrite";
import { tablesDB, getFileUrl } from "../../lib/appwrite";
type PropertyContextType = {
  data: any;
  loading: boolean;
};
const PropertyContext = createContext<PropertyContextType | null>(null);
export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) {
    throw new Error("useProperty must be used inside PropertyProvider");
  }
  return ctx; // <-- now TypeScript knows it's NOT null
}

export function PropertyProvider({ children }: any) {
  const { id } = useLocalSearchParams<{ id: string }>(); // listing id from URL
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function init() {
    try {
      const response = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_ID!,
        queries: [Query.equal("$id", id)],
      });

      if (!response.rows.length) {
        setData(null);
        return;
      }

      const listing = response.rows[0];

      // Extract image IDs → convert to URLs
      const fileIds = Array.isArray(listing.imageIds)
        ? listing.imageIds
        : listing.imageId
        ? [listing.imageId]
        : [];

      const images = fileIds.map((fileId) => getFileUrl(fileId));

      setData({ ...listing, images });
    } catch (err) {
      console.log("Error fetching listing:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) init();
  }, [id]);

  return (
    <PropertyContext.Provider value={{ data, loading }}>
      {children}
    </PropertyContext.Provider>
  );
}
