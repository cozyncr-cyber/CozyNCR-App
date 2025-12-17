// lib/reviews.ts
import {
  tablesDB,
  DATABASE_ID,
  REVIEWS_TABLE_ID,
  LISTINGS_TABLE_ID,
  ID,
  Permission,
  Role,
} from "@/lib/appwrite";
import { Query, Models } from "react-native-appwrite";

/* ----------------------------------
     TYPES
  ----------------------------------- */

export interface Review extends Models.DefaultRow {
  booking_id: string;
  listing_id: string;
  user_id: string;
  owner_id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
}
export type CreateReviewParams = {
  listingId: string;
  userId: string;
  ownerId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar?: string | null;
};

/* ----------------------------------
     CREATE REVIEW
  ----------------------------------- */

export const createReview = async (params: CreateReviewParams) => {
  const res = await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    rowId: ID.unique(),
    data: {
      listing_id: params.listingId,
      user_id: params.userId,
      owner_id: params.ownerId,
      rating: params.rating,
      comment: params.comment,
      reviewer_name: params.reviewerName,
      reviewer_avatar: params.reviewerAvatar ?? null,
    },
    permissions: [
      Permission.read(Role.any()),
      Permission.update(Role.user(params.userId)),
      Permission.delete(Role.user(params.userId)),
    ],
  });

  await recalculateListingRating(params.listingId);

  return res;
};

/* ----------------------------------
     GET REVIEW BY BOOKING ID
  ----------------------------------- */

export async function getReviewsByListingId(listingId: string) {
  const response = await tablesDB.listRows(DATABASE_ID, REVIEWS_TABLE_ID, [
    Query.equal("listing_id", listingId),
    Query.orderDesc("$createdAt"),
    Query.limit(5),
  ]);

  return response.rows as Review[];
}

export const getReviewByBookingId = async (
  bookingId: string
): Promise<Review | null> => {
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    queries: [Query.equal("booking_id", bookingId), Query.limit(1)],
  });

  if (!res.rows || res.rows.length === 0) return null;

  return res.rows[0] as Review;
};

/* ----------------------------------
     UPDATE REVIEW (EDIT)
  ----------------------------------- */
export const updateReview = async ({
  reviewId,
  listingId,
  rating,
  comment,
}: {
  reviewId: string;
  listingId: string;
  rating: number;
  comment: string;
}) => {
  const res = await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    rowId: reviewId,
    data: { rating, comment },
  });

  await recalculateListingRating(listingId);

  return res;
};

/* ----------------------------------
     DELETE REVIEW
  ----------------------------------- */
export const deleteReview = async ({
  reviewId,
  listingId,
}: {
  reviewId: string;
  listingId: string;
}) => {
  await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    rowId: reviewId,
  });

  await recalculateListingRating(listingId);
};
export const getReviewByListingAndUser = async (
  listingId: string,
  userId: string
): Promise<Review | null> => {
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    queries: [
      Query.equal("listing_id", listingId),
      Query.equal("user_id", userId),
      Query.limit(1),
    ],
  });

  return res.rows?.length ? (res.rows[0] as Review) : null;
};
export const getListingReviewStats = async (listingId: string) => {
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    queries: [Query.equal("listing_id", listingId)],
  });

  const reviews = res.rows || [];

  const total = reviews.length;
  const average =
    total === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum, r: any) => sum + (r.rating || 0), 0) / total
          ).toFixed(2)
        );

  return {
    totalReviews: total,
    averageRating: average,
  };
};

//Recalculate Avg Reviews

export const recalculateListingRating = async (listingId: string) => {
  // 1️⃣ Fetch all reviews for this listing
  const res = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: REVIEWS_TABLE_ID,
    queries: [Query.equal("listing_id", listingId)],
  });

  const reviews = res.rows || [];
  const reviewCount = reviews.length;

  const avgRating =
    reviewCount === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
            reviewCount
          ).toFixed(2)
        );

  // 2️⃣ Update listing
  await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId: LISTINGS_TABLE_ID,
    rowId: listingId,
    data: {
      avg_rating: avgRating,
      review_count: reviewCount,
    },
  });

  return { avgRating, reviewCount };
};
