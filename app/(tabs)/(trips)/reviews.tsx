import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { ArrowLeft, Star } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@/src/contexts/UserContext";
import Feather from "@expo/vector-icons/Feather";

import {
  createReview,
  updateReview,
  deleteReview,
  getReviewByListingAndUser,
} from "@/lib/services/reviews";

/* ----------------------------------
   STAR RATING
----------------------------------- */

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  return (
    <View className="flex-row gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          activeOpacity={0.7}
        >
          <Star
            size={40}
            color={star <= value ? "#facc15" : "#d1d5db"}
            fill={star <= value ? "#facc15" : "none"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

/* ----------------------------------
   MAIN SCREEN
----------------------------------- */

const ReviewScreen: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  const { listingId, ownerId, name, location, image, host, dates, mode } =
    useLocalSearchParams<{
      listingId: string;
      ownerId: string;
      name?: string;
      location?: string;
      image?: string;
      host?: string;
      dates?: string;
      mode?: string;
    }>();
  console.log("Data:", name, mode);

  const userId = user?.current?.$id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);

  const isEditMode = Boolean(existingReviewId);

  /* ----------------------------------
     FETCH EXISTING REVIEW (IF ANY)
  ----------------------------------- */

  useEffect(() => {
    if (!listingId || !userId) return;

    const fetchReview = async () => {
      const review = await getReviewByListingAndUser(listingId, userId);

      if (review) {
        setExistingReviewId(review.$id);
        setRating(review.rating);
        setComment(review.comment);
      }
    };

    fetchReview();
  }, [listingId, userId]);

  /* ----------------------------------
     SUBMIT
  ----------------------------------- */

  const handleSubmit = async () => {
    if (!user?.current || rating === 0 || !comment.trim()) return;

    try {
      setLoading(true);

      if (isEditMode && existingReviewId) {
        await updateReview({
          reviewId: existingReviewId,
          listingId,
          rating,
          comment,
        });
      } else {
        await createReview({
          listingId,
          userId: user.current.$id,
          ownerId,
          rating,
          comment,
          reviewerName: user.current.name ?? "Guest",
          reviewerAvatar: null,
        });
      }

      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     DELETE
  ----------------------------------- */

  const handleDelete = () => {
    if (!existingReviewId) return;

    const confirmDelete = async () => {
      try {
        setLoading(true);
        await deleteReview({
          reviewId: existingReviewId,
          listingId,
        });
        router.back();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Delete review?\nThis action cannot be undone."
      );
      if (confirmed) {
        confirmDelete();
      }
      return;
    }

    Alert.alert("Delete review", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const isFormValid = rating > 0 && comment.trim().length > 0;

  /* ----------------------------------
     UI
  ----------------------------------- */

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="border-b border-gray-200">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={20} />
          </TouchableOpacity>

          <Text className="text-lg font-semibold">
            {isEditMode ? "Edit review" : "Write a review"}
          </Text>

          {isEditMode ? (
            <TouchableOpacity onPress={handleDelete} className="p-2">
              <Text className="text-red-600 font-semibold">
                <Feather name="trash-2" size={24} color="##FF5C5C" />
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="w-12" />
          )}
        </View>
      </View>

      {/* PROPERTY INFO */}
      <View className="px-4 py-4 border-b border-gray-200">
        <View className="flex-row gap-3">
          {image ? (
            <Image source={{ uri: image }} className="w-20 h-20 rounded-xl" />
          ) : null}

          <View className="flex-1">
            <Text className="font-semibold text-base">{name}</Text>
            <Text className="text-sm text-gray-600">{location}</Text>
            <Text className="text-sm text-gray-600">Hosted by {host}</Text>
            <Text className="text-xs text-gray-500 mt-1">{dates}</Text>
          </View>
        </View>
      </View>

      {/* RATING */}
      <View className="px-4 py-6 border-b border-gray-200">
        <Text className="text-xl font-semibold mb-2">Overall rating</Text>
        <StarRating value={rating} onChange={setRating} />
      </View>

      {/* COMMENT */}
      <View className="px-4 py-6 flex-1">
        <Text className="text-xl font-semibold mb-2">Tell us more</Text>

        <TextInput
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={500}
          placeholder="Share your experience..."
          textAlignVertical="top"
          className="border-2 border-gray-300 rounded-xl p-4 min-h-[160px]"
        />

        <View className="items-end mt-2">
          <Text className="text-xs text-gray-500">{comment.length}/500</Text>
        </View>
      </View>

      {/* SUBMIT */}
      <View className="border-t border-gray-200 px-4 py-4">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          className={`py-4 rounded-xl ${
            isFormValid ? "bg-gray-900" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              isFormValid ? "text-white" : "text-gray-400"
            }`}
          >
            {isEditMode ? "Update review" : "Submit review"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReviewScreen;
