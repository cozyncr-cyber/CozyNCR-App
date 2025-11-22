import Card from "@/components/Card";
import SkeletonCard from "@/components/SkeletonCard";

import { View, Text, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text>Hello World</Text>
      </View>
      <div className="flex items-center flex-col gap-8 py-8">
        <Card />
        <div className="w-[90%]">
          <SkeletonCard />
        </div>
      </div>
    </ScrollView>
  );
}
