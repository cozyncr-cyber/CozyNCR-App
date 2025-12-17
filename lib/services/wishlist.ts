import { databases, DATABASE_ID, ID, WISHLIST_TABLE_ID } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";

/* ─────────────────────────────
     Add to Wishlist
  ───────────────────────────── */
export async function addToWishlist(userId: string, listingId: string) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      WISHLIST_TABLE_ID!,
      ID.unique(),
      {
        user_id: userId,
        listing_id: listingId,
      }
    );
  } catch (error: any) {
    // Handle duplicate (already wishlisted)
    if (error?.code === 409) {
      return { alreadyExists: true };
    }
    throw error;
  }
}

/* ─────────────────────────────
     Remove from Wishlist
  ───────────────────────────── */
export async function removeFromWishlist(wishlistId: string) {
  return databases.deleteDocument(DATABASE_ID, WISHLIST_TABLE_ID!, wishlistId);
}

/* ─────────────────────────────
     Toggle Wishlist
  ───────────────────────────── */
export async function toggleWishlist(userId: string, listingId: string) {
  const existing = await getWishlistItem(userId, listingId);

  if (existing) {
    await removeFromWishlist(existing.$id);
    return { removed: true };
  }

  await addToWishlist(userId, listingId);
  return { added: true };
}

/* ─────────────────────────────
     Check if Wishlisted
  ───────────────────────────── */
export async function isWishlisted(userId: string, listingId: string) {
  const res = await databases.listDocuments(DATABASE_ID, WISHLIST_TABLE_ID!, [
    Query.equal("user_id", userId),
    Query.equal("listing_id", listingId),
    Query.limit(1),
  ]);

  return res.documents.length > 0;
}

/* ─────────────────────────────
     Get Wishlist Item
  ───────────────────────────── */
export async function getWishlistItem(userId: string, listingId: string) {
  const res = await databases.listDocuments(DATABASE_ID, WISHLIST_TABLE_ID!, [
    Query.equal("user_id", userId),
    Query.equal("listing_id", listingId),
    Query.limit(1),
  ]);

  return res.documents.length ? res.documents[0] : null;
}

/* ─────────────────────────────
     Get User Wishlist
  ───────────────────────────── */
export async function getUserWishlist(userId: string) {
  const res = await databases.listDocuments(DATABASE_ID, WISHLIST_TABLE_ID!, [
    Query.equal("user_id", userId),
    Query.orderDesc("$createdAt"),
  ]);

  return res.documents;
}
