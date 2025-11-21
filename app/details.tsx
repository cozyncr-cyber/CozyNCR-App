import ExpandableText from "@/components/Expandable";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, Image, Dimensions, Pressable } from "react-native";

const images = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
  "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800",
];
export default function ReebahScreen() {
  const width = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}
    >
      <div className="w-12 h-12 absolute z-10 rounded-full top-6 left-4 bg-white shadow-lg flex items-center justify-center">
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={
            {
              $$css: true,
              _: "w-full h-full rounded-full shadow-lg",
            } as any
          }
        >
          <svg
            className="w-6 h-6 text-gray-800 left-1/2 absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Pressable>
      </div>
      {/* Image Grid */}
      <div className="relative">
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={
            {
              $$css: true,
              _: "w-full h-auto",
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
        {/* DOTS INDICATOR */}
        <div className="flex flex-row mt-3 absolute left-1/2 -translate-x-1/2 bottom-4 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={
                "h-2 w-2 mx-0.5 rounded-full " +
                (index === activeIndex ? "bg-white" : "bg-gray-200 opacity-80")
              }
            />
          ))}
        </div>
      </div>
      <main className={`w-full mx-auto px-6 rounded-2xl`}>
        <div className="grid grid-cols-1 gap-16">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Property Details */}
            <div className="pb-8 border-b">
              <h2 className="text-xl font-semibold mb-2 mt-6">
                Sector 100, Noida
              </h2>
              <p className="text-gray-600">3 guests · 2 beds · 2 bathrooms</p>
            </div>

            {/* Description */}
            <div className="py-8 border-b">
              <ExpandableText
                limit={200}
                text="The price mentioned is for room only, breakfast is not included. 
                Extra bedding for the 3rd guest is not included. An upscale newly built 
                property, perfect for your leisure or business stay in the heart of Gurugram. 
                Every room has a work desk with 2 chairs, and also each room has its own wifi router ..."
              />
            </div>

            {/* Amenities */}
            <div className="py-8 border-b">
              <h3 className="text-xl font-semibold mb-6">
                What this place offers
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Kitchen</span>
                </div>

                <div className="flex items-center gap-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                  <span>Wifi</span>
                </div>
              </div>
            </div>
            {/* Highlights */}
            <div className="py-8 border-b space-y-6">
              <div className="flex items-start gap-4">
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-medium mb-1">Guest favourite</h4>
                  <p className="text-sm text-gray-600">
                    One of the most loved homes on Airbnb, according to guests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <div>
                  <h4 className="font-medium mb-1">
                    Exceptional check-in experience
                  </h4>
                  <p className="text-sm text-gray-600">
                    Recent guests gave the check-in process a 5-star rating
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-medium mb-1">Great location</h4>
                  <p className="text-sm text-gray-600">
                    Guests who stayed here in the past year loved the location
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg
                  className="w-6 h-6 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h4 className="font-medium mb-1">
                    Free cancellation before 30 November
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get a full refund if you change your mind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ScrollView>
  );
}
