import React, { useState, useMemo, useCallback } from "react";
import {
  tablesDB,
  DATABASE_ID,
  BOOKINGS_TABLE_ID,
  LISTINGS_TABLE_ID,
  PROFILES_TABLE_ID,
  getFileUrl,
} from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";

import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import Star from "@/components/SVGs/Star";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";

type TripType = "upcoming" | "past";

type Trip = {
  id: string;
  listingId?: string;
  type: TripType;
  image?: string;
  title?: string;
  location?: string;
  dates?: string;
  nights?: number;
  status?: string;
  host?: string;
  ownerId?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;

  // 🔥 NEW
  reviewed?: boolean;
  reviewId?: string;

  rating?: number;
  reviews?: number;
  raw: any;
};

// helper to build "Dec 7-12, 2025"
const formatDates = (startISO?: string, endISO?: string): string => {
  if (!startISO || !endISO) return "";
  const start = new Date(startISO);
  const end = new Date(endISO);

  const month = start.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  return `${month} ${startDay}-${endDay}, ${year}`;
};

const diffNights = (startISO?: string, endISO?: string): number => {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
};

const Trips = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">(
    "all"
  );
  const router = useRouter();
  const user = useUser();
  console.log(user);
  const userId = user?.current?.$id;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openMaps = (lat: number, lng: number) => {
    const url =
      Platform.OS === "ios"
        ? `maps:0,0?q=${lat},${lng}`
        : `geo:0,0?q=${lat},${lng}`;

    Linking.openURL(url);
  };

  const makePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };

  // 🔹 Fetch bookings + listing + host profile details from Appwrite

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Fetch bookings
      const bookingRes = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: BOOKINGS_TABLE_ID,
        queries: [
          Query.equal("customerId", userId), // ✅ THIS WAS MISSING
          Query.orderDesc("$createdAt"),
        ],
      });
      const rows = bookingRes.rows ?? [];

      // 2) Collect unique listingIds from bookings
      const listingIds = [
        ...new Set(
          rows.map((row: any) => row.listingId).filter(Boolean) // remove undefined/null
        ),
      ];

      // 3) Fetch matching listings in one query (if any)
      let listingMap: Record<string, any> = {};
      if (listingIds.length > 0) {
        const listingsRes = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: LISTINGS_TABLE_ID,
          queries: [Query.equal("$id", listingIds)],
        });

        listingMap = (listingsRes.rows || []).reduce(
          (acc: Record<string, any>, listing: any) => {
            acc[listing.$id] = listing;
            return acc;
          },
          {}
        );
      }
      // Fetch reviews for this user + these listings
      let reviewMap: Record<string, any> = {};

      if (listingIds.length > 0 && userId) {
        const reviewsRes = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: "reviews",
          queries: [
            Query.equal("user_id", userId),
            Query.equal("listing_id", listingIds),
          ],
        });

        reviewMap = (reviewsRes.rows || []).reduce(
          (acc: Record<string, any>, review: any) => {
            acc[review.listing_id] = review;
            return acc;
          },
          {}
        );
      }

      // 4) Collect unique hostIds from listings
      //    🔁 adjust "hostId" to whatever field your listings use
      const hostIds = [
        ...new Set(
          Object.values(listingMap)
            .map((l: any) => l.ownerId) // e.g. l.hostId or l.profileId
            .filter(Boolean)
        ),
      ];

      // 5) Fetch host profiles
      let profileMap: Record<string, any> = {};
      if (hostIds.length > 0) {
        const profilesRes = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: PROFILES_TABLE_ID,
          queries: [Query.equal("$id", hostIds)],
        });

        profileMap = (profilesRes.rows || []).reduce(
          (acc: Record<string, any>, profile: any) => {
            acc[profile.$id] = profile;
            return acc;
          },
          {}
        );
      }

      // 6) Map bookings -> Trip[] using booking + listing + profile data
      const now = new Date();

      const mapped: Trip[] = rows.map((row: any) => {
        const endTimeISO = row.endTime as string | undefined;
        const startTimeISO = row.startTime as string | undefined;

        const endDate = endTimeISO ? new Date(endTimeISO) : null;
        const type: TripType = endDate && endDate >= now ? "upcoming" : "past";

        const listing = row.listingId ? listingMap[row.listingId] : undefined;

        // 👇 Adjust this to match your schema
        const hostProfile =
          listing?.ownerId && profileMap[listing.ownerId]
            ? profileMap[listing.ownerId]
            : undefined;

        // Images from Appwrite (using imageIds field on listing)
        let imageUrl: string | undefined;
        if (
          listing?.imageIds &&
          Array.isArray(listing.imageIds) &&
          listing.imageIds.length
        ) {
          const fileIds = listing.imageIds as string[];
          const images = fileIds.map((fileId) => getFileUrl(fileId));
          imageUrl = images[0]; // use first as cover
        }

        // Build host label from profile (e.g. profile.name)
        const hostName = hostProfile?.name;
        const hostLabel = hostName ? `Hosted by ${hostName}` : "Hosted by ...";

        const review = reviewMap[listing?.$id];
        return {
          id: row.$id,
          listingId: listing?.$id,
          type,

          title: listing?.title,
          location: listing?.city,
          image: imageUrl,
          dates: formatDates(startTimeISO, endTimeISO),
          nights: diffNights(startTimeISO, endTimeISO),
          status: row.status,
          latitude: listing?.latitude,
          longitude: listing?.longitude,
          phone: hostProfile.phone,

          host: hostLabel,
          ownerId: listing?.ownerId,
          rating: listing?.avg_rating ?? 0,
          reviews: listing?.review_count ?? 0,

          reviewed: Boolean(review),
          reviewId: review?.$id,

          raw: row,
        };
      });
      setTrips(mapped);
    } catch (err) {
      console.error("Error fetching trips", err);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, [userId, user]);
  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const visibleTrips = useMemo(() => {
    if (activeFilter === "all") return trips;
    return trips.filter((t) => t.type === activeFilter);
  }, [activeFilter, trips]);

  const hasUpcoming = trips.some((t) => t.type === "upcoming");
  const hasPast = trips.some((t) => t.type === "past");

  const Chip = ({
    label,
    value,
  }: {
    label: string;
    value: "all" | "upcoming" | "past";
  }) => {
    const isActive = activeFilter === value;
    return (
      <TouchableOpacity
        onPress={() => setActiveFilter(value)}
        className={`px-4 py-2 rounded-full border mr-2
        ${isActive ? "bg-black border-black" : "bg-white border-gray-300"}`}
      >
        <Text
          className={`text-sm font-semibold ${
            isActive ? "text-white" : "text-gray-800"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const TripCard = ({ trip }: { trip: Trip }) => {
    const isPast = trip.type === "past";

    const goToTrip = () => {
      router.push(`/tripDetails?tripId=${trip.id}`);
    };

    return (
      <View className="mb-4">
        {/* CARD PRESS */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={goToTrip}
          className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
        >
          <View className="relative">
            <Image
              source={{ uri: trip.image }}
              className="w-full h-48"
              resizeMode="cover"
            />
            {trip.status === "confirmed" && (
              <View className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold">Confirmed</Text>
              </View>
            )}
            {trip.status === "pending" && (
              <View className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold">Pending</Text>
              </View>
            )}
            {trip.status === "rejected" && (
              <View className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-red-500">
                  Rejected
                </Text>
              </View>
            )}
            {trip.status === "cancelled" && (
              <View className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-red-500">
                  Cancelled
                </Text>
              </View>
            )}
          </View>

          <View className="p-4">
            <Text className="font-semibold text-base mb-1" numberOfLines={2}>
              {trip.title}
            </Text>

            <View className="flex-row items-center mb-1">
              <EvilIcons name="location" size={16} />
              <Text className="text-sm text-gray-600 ml-1">
                {trip.location}
              </Text>
            </View>

            <View className="flex-row items-center mb-1">
              <Feather name="calendar" size={16} color="black" />
              <Text className="text-sm text-gray-600 ml-1">
                {trip.dates} · {trip.nights ? trip.nights : 1} nights
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Star />
              <Text className="text-sm font-semibold ml-1">
                {trip.rating?.toFixed(2)}
              </Text>
              <Text className="text-sm text-gray-600 ml-1">
                ({trip.reviews})
              </Text>
              <Text className="text-sm text-gray-400 mx-1">·</Text>
              <Text className="text-sm text-gray-600">{trip.host}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ACTIONS (NOT pressable by card) */}
        <View className="flex-row mt-2 px-2 flex gap-2">
          {trip.status === "confirmed" ? (
            isPast ? (
              trip.reviewed ? (
                <Link
                  href={{
                    pathname: "/reviews",
                    params: {
                      mode: "create",
                      listingId: trip.listingId,
                      ownerId: trip.ownerId,
                      name: trip.title,
                      location: trip.location,
                      image: trip.image,
                      dates: trip.dates,
                    },
                  }}
                  className="flex-1 flex py-2 border border-gray-900 rounded-lg items-center "
                >
                  <Text className="font-semibold w-full text-center">
                    Edit review
                  </Text>
                </Link>
              ) : (
                <Link
                  href={{
                    pathname: "/reviews",
                    params: {
                      mode: "create",
                      listingId: trip.listingId,
                      ownerId: trip.ownerId,
                      name: trip.title,
                      location: trip.location,
                      image: trip.image,
                      dates: trip.dates,
                    },
                  }}
                  className="flex-1 flex py-2 bg-gray-900 rounded-lg items-center "
                >
                  <Text className="font-semibold text-white w-full text-center">
                    Write a review
                  </Text>
                </Link>
              )
            ) : (
              <TouchableOpacity
                className="flex-1 py-2 border rounded-lg items-center"
                onPress={() =>
                  openMaps(
                    trip.latitude ? trip.latitude : 0,
                    trip.longitude ? trip.longitude : 0
                  )
                }
              >
                <Text className="font-semibold">Get directions</Text>
              </TouchableOpacity>
            )
          ) : (
            <></>
          )}
          {trip.status === "confirmed" ? (
            isPast ? (
              <TouchableOpacity
                onPress={() => router.push(`/property/${trip.listingId}`)}
                className="flex-1 py-2 border border-gray-900 rounded-lg items-center"
              >
                <Text className="font-semibold">Book again</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => makePhoneCall(trip.phone ? trip.phone : "")}
                className="flex-1 py-2 bg-gray-900 rounded-lg items-center"
              >
                <Text className="font-semibold text-white">Contact Host</Text>
              </TouchableOpacity>
            )
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View className="items-center py-16">
          <Text className="text-gray-600">Loading trips…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center py-16">
          <Text className="text-red-500 mb-2">{error}</Text>
        </View>
      );
    }

    if (activeFilter === "upcoming") {
      return (
        <View className="items-center py-16">
          <Feather name="home" size={64} color="black" />
          <Text className="text-xl font-semibold mt-4 mb-2">
            No trips booked...yet!
          </Text>
          <Text className="text-gray-600 text-center px-6 mb-6">
            Time to dust off your bags and start planning your next adventure.
          </Text>
          <TouchableOpacity className="px-6 py-3 bg-gray-900 rounded-lg">
            <Text className="text-white font-semibold">Start searching</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeFilter === "past") {
      return (
        <View className="items-center py-16">
          <Feather name="calendar" size={16} color="black" />
          <Text className="text-xl font-semibold mt-4 mb-2">No past trips</Text>
          <Text className="text-gray-600 text-center px-6">
            Once you complete a trip, it will show up here.
          </Text>
        </View>
      );
    }

    return (
      <View className="items-center py-16">
        <Feather name="home" size={64} color="black" />
        <Text className="text-xl font-semibold mt-4 mb-2">No trips yet</Text>
        <Text className="text-gray-600 text-center px-6">
          Start exploring stays and your trips will appear here.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200 px-6 pb-4">
        <Text className="text-3xl font-semibold mt-6 mb-4">Trips</Text>

        {/* Chips */}
        <View className="flex-row">
          <Chip label="All" value="all" />
          <Chip label="Upcoming" value="upcoming" />
          <Chip label="Past" value="past" />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {visibleTrips.length > 0 ? (
          <>
            {activeFilter === "all" && hasUpcoming && (
              <>
                <Text className="text-lg font-semibold mb-2">Upcoming</Text>
                {visibleTrips
                  .filter((t) => t.type === "upcoming")
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </>
            )}

            {activeFilter === "all" && hasPast && (
              <>
                <Text className="text-lg font-semibold mt-4 mb-2">Past</Text>
                {visibleTrips
                  .filter((t) => t.type === "past")
                  .map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
              </>
            )}

            {activeFilter !== "all" &&
              visibleTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
};

export default Trips;
