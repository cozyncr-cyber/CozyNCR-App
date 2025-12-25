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
