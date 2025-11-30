import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <View className="w-full rounded-2xl overflow-hidden pb-4 ">
      {/* Image */}
      <View className="w-full aspect-square overflow-hidden rounded-2xl">
        <Skeleton />
      </View>

      <View className="px-4 pt-4 space-y-2">
        {/* Title */}
        <View className="w-[70%] h-5 rounded-md overflow-hidden">
          <Skeleton />
        </View>

        {/* Subtitle lines */}
        <View className="w-[90%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </View>
        <View className="w-[50%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </View>

        {/* Rating row */}
        <View className="flex items-center gap-2 pt-1">
          <View className="w-5 h-5 rounded-md overflow-hidden">
            <Skeleton />
          </View>
          <View className="w-10 h-4 rounded-md overflow-hidden">
            <Skeleton />
          </View>
        </View>

        {/* Price */}
        <View className="w-[30%] h-5 rounded-md mt-2 overflow-hidden">
          <Skeleton />
        </View>
      </View>
    </View>
  );
}
