import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";

import { ScrollView, Image, Dimensions, Pressable } from "react-native";

export default function Card() {
  const images = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
  ];
  const width = Dimensions.get("window").width * 0.9;
  const router = useRouter();
  return (
    <Pressable
      onPress={() => {
        router.push("/details");
      }}
      style={{ $$css: true, _: "w-[90%] h-auto" } as any}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={
          {
            $$css: true,
            _: "w-full h-auto rounded-2xl",
            width: width,
          } as any
        }
      >
        {images.map((src, index) => (
          <Image
            key={index}
            source={{ uri: src }}
            style={{ width, height: width, resizeMode: "cover" }}
          />
        ))}
      </ScrollView>

      <div className="p-4 bg">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900">Sector 100, Noida</h3>
          <div className="flex items-center gap-1">
            <span className="scale-75">
              <Star />
            </span>
            <span className="text-sm font-semibold">4.94</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-1">
          Stay with Raghav · Hosting for 1 year
        </p>
        <p className="text-gray-600 text-sm mb-2">2 beds</p>
        <p className="text-gray-900">
          <span className="font-semibold">₹1020</span>
          <span className="text-gray-600 text-sm"> per night</span>
        </p>
      </div>
    </Pressable>
  );
}
