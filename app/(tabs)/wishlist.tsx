import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import { Query } from "react-native-appwrite";
import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect } from "expo-router";
import SkeletonCard from "@/components/SkeletonCard";
import { getUserWishlist, removeFromWishlist } from "@/lib/services/wishlist";
import {
  DATABASE_ID,
  getFileUrl,
  LISTINGS_TABLE_ID,
  tablesDB,
} from "@/lib/appwrite";
import { useUser } from "@/src/contexts/UserContext";
import WishlistListingCard from "@/components/WishlistListingCard";

export default function WishlistScreen() {
  const user = useUser();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.current?.$id;

  const loadWishlist = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const wishlist = await getUserWishlist(userId);
      if (!wishlist.length) {
        setListings([]);
        return;
      }

      const listingIds = wishlist.map((w) => w.listing_id);
      const wishlistMap = new Map(wishlist.map((w) => [w.listing_id, w.$id]));

      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID!,
        tableId: LISTINGS_TABLE_ID!,
        queries: [Query.equal("$id", listingIds)],
      });

      const listingsWithImages = response.rows.map((listing: any) => {
        const fileIds = Array.isArray(listing.imageIds)
          ? listing.imageIds
          : listing.imageId
            ? [listing.imageId]
            : [];

        const images = fileIds.map((id: string) => getFileUrl(id));

        return {
          ...listing,
          images,
          wishlistId: wishlistMap.get(listing.$id),
        };
      });

      setListings(listingsWithImages);
    } catch (err) {
      console.error("Wishlist load error", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [loadWishlist])
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200 px-6 pb-4">
        <Text className="text-3xl font-semibold mt-6 mb-4">Wishlist</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="items-center flex-col gap-8 py-6">
          {loading && (
            <View className="w-[90%]">
              <SkeletonCard />
            </View>
          )}

          {!loading && listings.length === 0 && (
            <View className="items-center py-20">
              <Entypo name="heart-outlined" size={64} color="#ccc" />
              <Text className="text-xl font-semibold mt-4">
                No saved listings
              </Text>
              <Text className="text-gray-500 mt-2">
                Start adding places to your wishlist
              </Text>
            </View>
          )}

          {!loading &&
            listings.map((listing) => (
              <WishlistListingCard
                key={listing.$id}
                data={listing}
                onRemove={async () => {
                  await removeFromWishlist(listing.wishlistId);

                  // Optimistically update UI
                  setListings((prev) =>
                    prev.filter((l) => l.$id !== listing.$id)
                  );
                }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
