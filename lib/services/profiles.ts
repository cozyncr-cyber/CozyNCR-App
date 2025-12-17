import { tablesDB, DATABASE_ID, PROFILES_TABLE_ID } from "@/lib/appwrite";

/**
 * Fetch profile by userId
 */
export const getProfileByUserId = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("userId is required to fetch profile");
    }

    const profile = await tablesDB.getRow(
      DATABASE_ID,
      PROFILES_TABLE_ID,
      userId
    );

    if (!profile) {
      throw new Error("Profile not found");
    }

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
