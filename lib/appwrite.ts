import { Platform } from "react-native";
import { Client, TablesDB, Account, Storage } from "react-native-appwrite";

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

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

export const getFileUrl = (fileId: string) => {
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
};
