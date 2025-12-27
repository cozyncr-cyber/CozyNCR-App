import {
  tablesDB,
  DATABASE_ID,
  BOOKINGS_TABLE_ID,
  LISTINGS_TABLE_ID,
  getImagePreviewUrl,
} from "@/lib/appwrite";

import { getProfileByUserId } from "@/lib/services/profiles";

/**
 * Fetch booking → listing → profiles
 */
export const getTripDetailsByTripId = async (tripId: string) => {
  try {
    /* 1️⃣ Fetch booking */
    const booking = await tablesDB.getRow(
      DATABASE_ID,
      BOOKINGS_TABLE_ID,
      tripId
    );

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (!booking.listingId) {
      throw new Error("listingId missing in booking");
    }

    /* 2️⃣ Fetch listing */
    const listing = await tablesDB.getRow(
      DATABASE_ID,
      LISTINGS_TABLE_ID,
      booking.listingId
    );

    if (!listing) {
      throw new Error("Listing not found");
    }

    /* 3️⃣ Fetch profiles */
    const hostProfilePromise = listing.ownerId
      ? getProfileByUserId(listing.ownerId)
      : null;

    const customerProfilePromise = booking.customerId
      ? getProfileByUserId(booking.customerId)
      : null;

    const [hostProfile, customerProfile] = await Promise.all([
      hostProfilePromise,
      customerProfilePromise,
    ]);

    /* 4️⃣ Resolve images */ /* 4️⃣ Resolve images */
    const images =
      listing.imageIds?.map((id: string) =>
        getImagePreviewUrl(id, {
          width: 500,
          height: 500,
          quality: 75,
        })
      ) ?? [];

    const thumbnailUrl = listing.thumbnail
      ? getImagePreviewUrl(listing.thumbnail, {
          width: 400,
          height: 400,
          quality: 60,
        })
      : null;

    /* 5️⃣ Return combined data */
    return {
      booking,
      listing: {
        ...listing,
        images,
        thumbnailUrl,
      },
      hostProfile,
      customerProfile,
    };
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw error;
  }
};
