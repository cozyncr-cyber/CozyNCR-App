import { databases } from "@/lib/appwrite"; // adjust import

export const cancelBooking = async (bookingId: string) => {
  try {
    await databases.updateDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_TABLE_ID!,
      bookingId,
      {
        status: "cancelled", // your "cancelled" state
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Cancel booking failed:", error);
    return {
      success: false,
      error: error?.message || "Failed to cancel booking",
    };
  }
};
