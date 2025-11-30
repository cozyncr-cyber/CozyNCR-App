import { View } from "react-native";

export default function Skeleton() {
  return (
    <View className="relative w-full h-full overflow-hidden bg-gray-300 animate-pulse" />
  );
}
