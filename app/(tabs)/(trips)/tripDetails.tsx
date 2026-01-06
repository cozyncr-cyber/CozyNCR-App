import { useLocalSearchParams, useRouter } from "expo-router";

import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { cancelBooking } from "@/lib/services/bookings";

import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Star,
  MessageCircle,
} from "lucide-react-native";
import { getTripDetailsByTripId } from "@/lib/services/trips";
import { useUser } from "@/src/contexts/UserContext";
type BookingTypeKey = "3hours" | "6hours" | "12hours" | "24hours";

type BookingStatus = "confirmed" | "pending" | "rejected" | "cancelled";

const BookingDetailsView: React.FC = () => {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const bookingTypeMap: Record<BookingTypeKey, string> = {
    "3hours": "3 Hours",
    "6hours": "6 Hours",
    "12hours": "12 Hours",
    "24hours": "Nightly",
  };
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelBooking = async () => {
    if (!booking?.$id) return;

    setCancelLoading(true);

    const result = await cancelBooking(booking.$id);

    setCancelLoading(false);

    if (result.success) {
      // update local state so UI refreshes
      setBooking((prev: any) => ({
        ...prev,
        status: "rejected",
      }));
    } else {
      alert(result.error);
    }
  };
  const makePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };
  useEffect(() => {
    if (!tripId) return;

    const fetchTripDetails = async () => {
      try {
        const data = await getTripDetailsByTripId(tripId);
        setBooking(data.booking);
        setListing(data.listing);
        setData(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return <ActivityIndicator className="flex-1" />;
  }

  if (!booking || !listing) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Trip not found</Text>
      </View>
    );
  }
  const now = new Date();
  const checkInTime = new Date(booking.startTime);
  const checkOutTime = new Date(booking.endTime);

  const isBeforeCheckIn = now < checkInTime;
  const isDuringStay = now >= checkInTime && now < checkOutTime;
  const isAfterCheckOut = now >= checkOutTime;
  const derivedStatus = isAfterCheckOut
    ? "Completed"
    : isDuringStay
      ? "Ongoing"
      : booking.status;

  type StatusConfig = {
    label: string;
    container: string;
    dot: string;
    text: string;
  };
  const statusKey = booking.status as BookingStatus;

  const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
    confirmed: {
      label: derivedStatus,
      container: "bg-green-50 border-green-200",
      dot: "bg-green-500",
      text: "text-green-700",
    },
    pending: {
      label: "Pending",
      container: "bg-yellow-50 border-yellow-200",
      dot: "bg-yellow-500",
      text: "text-yellow-700",
    },
    rejected: {
      label: "Rejected",
      container: "bg-red-50 border-red-200",
      dot: "bg-red-500",
      text: "text-red-700",
    },
    cancelled: {
      label: "Cancelled",
      container: "bg-red-50 border-red-200",
      dot: "bg-red-500",
      text: "text-red-700",
    },
  };
  const status = STATUS_CONFIG[statusKey];
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              className="p-2 -ml-2 rounded-full active:bg-gray-100"
              onPress={() => router.push("/")}
            >
              <ArrowLeft size={20} />
            </Pressable>

            <View className="ml-2">
              <Text className="text-lg font-semibold">Booking Details</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View className="px-4 pt-4">
          {status && (
            <View
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full border self-start ${status.container}`}
            >
              <View className={`w-2 h-2 rounded-full ${status.dot}`} />
              <Text className={`text-sm font-semibold ${status.text}`}>
                {status.label}
              </Text>
            </View>
          )}
        </View>

        {/* Property Image */}
        <View className="px-4 py-4">
          <Image
            source={{ uri: listing.images[0] }}
            className="w-full h-64 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Property Info */}
        <View className="px-4 pb-4 border-b border-gray-200">
          <Text className="text-2xl font-semibold mb-2">{listing.title}</Text>

          <View className="flex-row items-center gap-2 mb-3">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600">{listing.address}</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Star size={18} color="#FACC15" fill="#FACC15" />
            <Text className="font-semibold">5</Text>
            <Text className="text-sm text-gray-600">
              ({booking.reviews} reviews)
            </Text>
            <Text className="text-gray-400">·</Text>
            <Text className="text-sm text-gray-600">
              Hosted by {data.hostProfile?.name || "Host"}
            </Text>
          </View>
        </View>

        {/* Booking Details */}
        <View className="px-4 py-6 space-y-4">
          {/* Booking Type */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-gray-600 mb-2">
              Booking Type
            </Text>
            <Text className="text-lg font-semibold">
              {bookingTypeMap[booking.bookingType as BookingTypeKey]}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {booking.nights} night stay
            </Text>
          </View>

          {/* Check-in / Check-out */}
          <View className="flex-row gap-3">
            <View className="flex-1 border border-gray-200 rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm font-semibold text-gray-600">
                  Check-in
                </Text>
              </View>
              <Text className="font-semibold">
                {formatDateTime(booking.startTime)}
              </Text>
            </View>

            <View className="flex-1 border border-gray-200 rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm font-semibold text-gray-600">
                  Check-out
                </Text>
              </View>
              <Text className="font-semibold">
                {formatDateTime(booking.endTime)}
              </Text>
            </View>
          </View>

          {/* Guests */}
          <View className="border border-gray-200 rounded-xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Users size={16} color="#6B7280" />
              <Text className="text-sm font-semibold text-gray-600">
                Guests
              </Text>
            </View>
            <Text className="font-semibold">
              {" "}
              {[
                booking.guestCount > 0 &&
                  `${booking.guestCount} adult${booking.guestCount > 1 ? "s" : ""}`,
                booking.childrenCount > 0 &&
                  `${booking.childrenCount} child${booking.childrenCount > 1 ? "ren" : ""}`,
                booking.infantCount > 0 &&
                  `${booking.infantCount} infant${booking.infantCount > 1 ? "s" : ""}`,
                booking.petCount > 0 &&
                  `${booking.petCount} pet${booking.petCount > 1 ? "s" : ""}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>

          {/* Price */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-gray-600 mb-2">
              Total Price
            </Text>
            <Text className="text-2xl font-bold">
              Rs {booking.totalPrice} /-
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Including all taxes and fees
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="px-4 pb-6 space-y-3">
          {!isAfterCheckOut && (
            <Pressable
              onPress={() => makePhoneCall(user.profile.phone)}
              className="bg-gray-900 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <MessageCircle size={20} color="#fff" />
              <Text className="text-white font-semibold">Contact Host</Text>
            </Pressable>
          )}
          {isBeforeCheckIn && booking.status !== "rejected" && (
            <Pressable
              onPress={handleCancelBooking}
              disabled={cancelLoading}
              className={`border-2 border-gray-900 py-4 mt-2 rounded-xl flex-row items-center justify-center gap-2 ${
                cancelLoading ? "opacity-50" : ""
              }`}
            >
              <Text className="font-semibold">
                {cancelLoading ? "Cancelling..." : "Cancel Booking"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Important Info */}
        {!isAfterCheckOut && (
          <View className="mx-4 mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Text className="font-semibold text-blue-900 mb-2">
              Important Information
            </Text>
            <Text className="text-sm text-blue-800">
              • Please arrive during check-in hours{"\n"}• Contact host if
              you&apos;ll be late{"\n"}• Government ID required at check-in
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BookingDetailsView;

export const formatTripDetails = (booking: any, listing: any) => {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  return {
    bookingSummary: {
      id: booking.$id,
      status: booking.status,
      serviceType: booking.serviceType,
      bookingType: booking.bookingType,
      date: start.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: `${start.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      guests: {
        adults: booking.guestCount,
        children: booking.childrenCount,
        infants: booking.infantCount,
        pets: booking.petCount,
      },
      totalPrice: `₹${booking.totalPrice}`,
      customerName: booking.customerName,
    },

    property: {
      id: listing.$id,
      title: listing.title,
      category: listing.category,
      description: listing.description,
      address: `${listing.address}, ${listing.city}, ${listing.state}`,
      location: {
        latitude: listing.latitude,
        longitude: listing.longitude,
      },
      amenities: listing.amenities,
      maxGuests: listing.maxGuests,
      pricing: {
        "3h": listing.price_3h,
        "6h": listing.price_6h,
        "12h": listing.price_12h,
        "24h": listing.price_24h,
      },
      images: listing.images,
      thumbnail: listing.thumbnailUrl,
    },
  };
};

/*Helper Functions*/
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${time} ${formattedDate}`;
};
