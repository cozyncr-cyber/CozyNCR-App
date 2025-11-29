"use dom";
import "../../src/global.css";
import ListingCard from "@/components/ListingCard";
import SkeletonCard from "@/components/SkeletonCard";

import { Query } from "react-native-appwrite";
import { useEffect, useState } from "react";
import { getFileUrl, tablesDB } from "../../lib/appwrite";

import { View, ScrollView, Pressable } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const [listings, setListings] = useState<any>([]);

  async function init() {
    const response = await tablesDB.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: process.env.EXPO_PUBLIC_APPWRITE_LISTING_ID!,
      queries: [Query.orderDesc("$createdAt"), Query.limit(10)],
    });

    const listingsWithImages = response.rows.map((listing: any) => {
      const fileIds = Array.isArray(listing.imageIds)
        ? listing.imageIds
        : listing.imageId
        ? [listing.imageId]
        : [];

      const images = fileIds.map((id: any) => getFileUrl(id));

      return { ...listing, images };
    });

    setListings(listingsWithImages);
    console.log(listingsWithImages);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <ScrollView>
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Pressable onPress={() => setOpen(true)} style={{ width: "90%" }}>
            <div className="w-full h-20 bg-white rounded-full shadow-sm flex items-center px-4 justify-between cursor-pointer">
              <div className="pl-2 flex gap-3 items-center">
                <Feather name="search" size={24} color="black" />
                <div className="flex flex-col">
                  <h5 className="font-medium">Where To?</h5>
                  <div className="mt-0.5 flex flex-wrap gap-0.5 text-sm text-zinc-500 leading-3">
                    <p>Anywhere </p>•<p>Add guests</p>
                  </div>
                </div>
              </div>
              <div className="shadow-sm aspect-square rounded-full flex items-center px-4 gap-2">
                <Ionicons name="options" size={24} color="black" />
              </div>
            </div>
          </Pressable>
        </View>
        <div className="flex items-center flex-col gap-8 pb-8">
          {listings.map((listing: any) => (
            <ListingCard key={listing.$id} data={listing} />
          ))}
          <div className="w-[90%]">
            <SkeletonCard />
          </div>
        </div>
      </ScrollView>
      {/* Sheet */}
      <div
        className={`fixed left-0 right-0 bg-white rounded-b-2xl z-50 transition-all duration-300 
        ${
          open ? "top-0" : "-top-[100vh]"
        } px-5 pt-5 p-2 max-h-[75vh] overflow-y-auto`}
      >
        <p className="text-xl font-semibold mb-4">Filters</p>

        {/* Content */}
        <div className="">
          <div className="flex-row justify-between mb-3 border-b border-zinc-400 pb-3">
            <p className="text-base text-gray-700">2 nights × ₹2,065.53</p>
            <p className="text-base font-semibold">₹4,131.06</p>
          </div>
        </div>
        <div
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-4"
          onClick={() => setOpen(false)}
        />
      </div>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
