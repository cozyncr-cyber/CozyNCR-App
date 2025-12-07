import { Platform } from "react-native";
import {
  Client,
  TablesDB,
  Account,
  Storage,
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
const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!;

// 👇 NEW: database + tables
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const LISTINGS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_LISTING_TABLE_ID!;
export const PROFILES_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_PROFILES_TABLE_ID!;
export const BOOKINGS_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_BOOKINGS_TABLE_ID!; // <-- add to .env

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

// re-export helpers for convenience
export { ID, Permission, Role };

export const getFileUrl = (fileId: string) => {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
