"use dom";
import "../src/global.css";
import Star from "@/components/SVGs/Star";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ScrollView, Image, Dimensions, Pressable } from "react-native";

export default function ListingCard({ data }: { data?: any }) {
  const width = Dimensions.get("window").width * 0.9;
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const best = getBestPrice(data);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/property/[id]",
          params: { id: String(data.$id) },
        });
      }}
      style={{ $$css: true, _: "w-[90%] h-auto" } as any}
    >
      <div className="relative">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={
            {
              $$css: true,
              _: "w-full h-auto rounded-2xl",
              width: `${width}px`,
            } as any
          }
        >
          {data.images.map((src: string, index: number) => (
            <Image
              key={index}
              source={{ uri: src }}
              style={
                {
                  width: `${width}px`,
                  height: `${width}px`,
                  resizeMode: "cover",
                  objectFit: "cover",
                } as any
              }
            />
          ))}
        </ScrollView>
        {/* DOTS INDICATOR */}
        {data.images.length > 1 ? (
          <div className="flex flex-row mt-3 absolute left-1/2 -translate-x-1/2 bottom-4 z-10">
            {data.images.map((_: any, index: number) => (
              <div
                key={index}
                className={
                  "h-2 w-2 mx-0.5 rounded-full " +
                  (index === activeIndex
                    ? "bg-white"
                    : "bg-gray-200 opacity-80")
                }
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="p-4 bg flex flex-col ">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-900">{data.title}</p>
          <div className="flex items-center gap-1">
            <span className="scale-75">
              <Star />
            </span>
            <span className="text-sm font-semibold">4.94</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          {data.category.charAt(0)?.toUpperCase() + data.category?.slice(1)} in{" "}
          {data.city}
        </p>
        <p className="text-gray-600 text-sm mb-1">
          2 Beds • Upto {data.maxGuests} guests
        </p>
        <p className="text-gray-900">
          <span className="font-semibold">₹{best?.price}</span>
          <span className="text-gray-600 text-sm"> per {best?.duration}</span>
        </p>
      </div>
    </Pressable>
  );
}

function getBestPrice(listing: any) {
  if (listing.price_24h != null) {
    return {
      duration: "night",
      price: listing.price_24h,
    };
  }
  const map = {
    "1 hour": listing.price_1h,
    "3 hours": listing.price_3h,
    "6 hours": listing.price_6h,
    "12 hours": listing.price_12h,
  };

  const entries = Object.entries(map)
    .filter(([_, value]) => value != null)
    .sort((a, b) => a[1] - b[1]);

  if (entries.length === 0) return null;

  return {
    duration: entries[0][0],
    price: entries[0][1],
  };
}
