import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <View className="w-full rounded-2xl overflow-hidden pb-4 ">
      {/* Image */}
      <View className="w-full aspect-square overflow-hidden rounded-2xl">
        <Skeleton />
      </View>

      <View className="px-4 pt-4 flex flex-col gap-2">
        {/* Title */}
        <View className="flex flex-row items-center justify-between">
          <View className="w-[60%] h-4 rounded-md overflow-hidden">
            <Skeleton />
          </View>

          {/* Rating row */}
          <View className="flex flex-row items-center gap-2">
            <View className="w-5 h-4 rounded-md overflow-hidden">
              <Skeleton />
            </View>
            <View className="w-10 h-4 rounded-md overflow-hidden">
              <Skeleton />
            </View>
          </View>
        </View>

        {/* Subtitle lines */}
        <View className="w-[90%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </View>

        {/* Price */}
        <View className="w-[30%] h-4 rounded-md overflow-hidden">
          <Skeleton />
        </View>
      </View>
    </View>
  );
}
