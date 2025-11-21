import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";

const images = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
];

export default function HomeScreen() {
  const width = Dimensions.get("window").width * 0.9;
  const router = useRouter();

  return (
    <ScrollView>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text>Hello World</Text>
      </View>
      <div className="flex items-center flex-col">
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
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
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
      </div>
    </ScrollView>
  );
}
