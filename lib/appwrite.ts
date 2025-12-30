import { Platform } from "react-native";
import {
  Client,
  TablesDB,
  Account,
  Databases,
  Storage,
  Functions,
  ID,
  Permission,
  Role,
} from "react-native-appwrite";

import * as Notifications from "expo-notifications";

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT!)
  .setPlatform(
    Platform.OS === "web" ? "web" : process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!
  );

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT!;
export const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;
export const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY!;

// 👇 NEW: database + tables
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const LISTINGS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!;
export const PROFILES_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_PROFILES_TABLE_ID!;
export const BOOKINGS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_TABLE_ID!;
export const REVIEWS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_TABLE_ID!;
export const WISHLIST_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_WISHLISTS_TABLE_ID!;
export const RAZORPAY_CREATE_ORDER_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_RAZORPAY_CREATE_ORDER_FUNCTION_ID!;
export const RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID!;

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// re-export helpers for convenience
export { ID, Permission, Role };
type ImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
};
export const getFileUrl = (fileId: string) => {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};

export const getImagePreviewUrl = (fileId: string, options?: ImageOptions) => {
  const params = new URLSearchParams({
    project: projectId,
  });

  if (options?.width) params.append("width", String(options.width));
  if (options?.height) params.append("height", String(options.height));
  if (options?.quality) params.append("quality", String(options.quality));

  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?${params.toString()}`;
};
export async function registerPush(userId: string) {
  try {
    console.log("REGISTER PUSH START");

    if (Platform.OS === "web") {
      console.log("WEB MODE");

      console.log("USER (WEB):", userId);

      await databases.createDocument(DATABASE_ID, "push_tokens", ID.unique(), {
        token: "WEB_TEST_TOKEN",
        platform: "web",
        userId: userId,
      });

      console.log("WEB TOKEN SAVED");
      return;
    }
    console.log("MOBILE MODE");

    // ANDROID CHANNEL (important)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    let { status } = await Notifications.getPermissionsAsync();
    console.log("PERMISSION:", status);

    if (status !== "granted") {
      const res = await Notifications.requestPermissionsAsync();
      status = res.status;
      console.log("PERMISSION AFTER ASK:", status);
    }

    if (status !== "granted") {
      console.log("NOT GRANTED — EXIT");
      return;
    }

    await databases.createDocument(DATABASE_ID, "push_tokens", ID.unique(), {
      token: "token",
      platform: Platform.OS,
      userId: userId,
    });

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "df0beaaf-2104-4364-96d6-8ace81b9ded4",
      })
    ).data;
    console.log("PUSH TOKEN OBTAINED", token);
    console.log("TOKEN:", token);

    console.log("USER:", userId);

    await databases.createDocument(DATABASE_ID, "push_tokens", ID.unique(), {
      token: token,
      platform: Platform.OS,
      userId: userId,
    });

    console.log("TOKEN SAVED SUCCESS");
  } catch (err) {
    console.log("Push registration failed:", err);
  }
}
