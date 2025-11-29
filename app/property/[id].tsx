"use dom";
import "../../src/global.css";
import ExpandableText from "@/components/Expandable";
import { useRouter } from "expo-router";
import { ScrollView, Image, Dimensions, Pressable } from "react-native";
import ReviewCarousel from "@/components/Reviews";
import Star from "@/components/SVGs/Star";
import ProfileCard from "@/components/ProfileCard";
import Map from "@/components/Map";
import Footer from "@/components/Footer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { useState } from "react";
import { amenityIcons } from "@/components/AmenityIcon";
import { useProperty } from "@/src/contexts/PropertyContext";
export default function Details() {
  // ⬇️ GET DATA FROM CONTEXT
  const { data, loading } = useProperty();

  const width = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  if (loading) {
    return (
      <div className="flex-1 justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 justify-center items-center">
        <p>No property found.</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex-1 justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}
        >
          <div className="relative">
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
                    width: `${width}px`,
                  } as any
                }
              >
                {data?.images &&
                  data.images.map((src: string, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: src }}
                      style={
                        {
                          width: `${width}px`,
                          height: `${width}px`,
                          resizeMode: "cover",
                        } as any
                      }
                    />
                  ))}
              </ScrollView>
              {/* DOTS INDICATOR */}
              <div className="flex flex-row mt-3 absolute left-1/2 -translate-x-1/2 bottom-4 z-10">
                {data?.images &&
                  data.images.map((_: any, index: number) => (
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
            </div>
            <main className={`w-full mx-auto px-6 rounded-2xl `}>
              <div className="grid grid-cols-1 gap-16">
                {/* Left Column */}
                <div className="lg:col-span-2">
                  {/* Property Details */}
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2 mt-6">
                      {data?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {data?.city}, {data?.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data?.maxGuests} guest · 1 bed · 1 bathroom
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex w-full items-center text-center justify-around gap-3 sm:gap-6 border-b border-zinc-300 py-6">
                    <div className="flex items-center gap-1 ">
                      <Star />
                      <p className="font-semibold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-500 ml-1"></p>
                    </div>
                    <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>

                    <div>
                      <p className="font-semibold text-gray-900">1+</p>
                      <p className="text-sm text-gray-500">Years</p>
                    </div>

                    <div className="h-10 w-0.5 rounded-full bg-zinc-300"></div>
                    <div>
                      <p className="font-semibold text-gray-900">4</p>
                      <p className="text-sm text-gray-500">Reviews</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="py-8 border-b border-zinc-300 ">
                    <ExpandableText limit={200} text={data?.description} />
                  </div>

                  {/* Amenities */}
                  <div className="py-8 border-b border-zinc-300">
                    <h3 className="text-xl font-semibold mb-6">
                      What this place offers
                    </h3>
                    <div className="flex flex-col gap-4">
                      {data?.amenities &&
                        data.amenities.map((amenity: string) => {
                          const iconData =
                            amenityIcons[amenity] || amenityIcons["default"];
                          const Icon = iconData.component;
                          return (
                            <div
                              key={amenity}
                              className="flex items-center gap-4"
                            >
                              <Icon
                                name={iconData.name}
                                size={24}
                                color="black"
                              />
                              <span>
                                {amenity.charAt(0).toUpperCase() +
                                  amenity.slice(1)}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/*Map*/}

                  <div className="flex-1 relative py-8 border-b border-zinc-300">
                    <h3 className="text-xl font-semibold mb-2">
                      Where you&apos;ll be
                    </h3>

                    <p className="text-zinc-500 text-sm mb-6">
                      {data?.address}
                    </p>
                    <Map />
                  </div>
                  {/*Host*/}

                  <div className="flex-1 relative py-8">
                    <h3 className="text-xl text-center font-semibold mb-6">
                      Meet your host
                    </h3>
                    <ProfileCard />
                  </div>

                  {/*Reviews*/}
                  <div className="py-8 border-y border-zinc-300">
                    <h3 className="text-xl  font-semibold mb-6">Reviews</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Star />{" "}
                      <p className="text-lg font-medium">4.6 • 20 Reviews</p>
                    </div>
                    <ReviewCarousel />
                  </div>
                  {/* Highlights */}
                  <div className="py-8 space-y-6">
                    <div className="flex items-start gap-4">
                      <FontAwesome
                        name="calendar-times-o"
                        size={24}
                        color="black"
                      />
                      <div>
                        <h4 className="font-medium mb-1">
                          Cancellation Policy
                        </h4>
                        <p className="text-sm text-gray-600">
                          • 90% refund for cancellations made up to 24 hours
                          before check-in <br />
                          • 50% refund for cancellations made up to 4 hours
                          before check-in <br />• No refund if cancelled within
                          the last 4 hours before check-in.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <FontAwesome6 name="key" size={24} color="black" />
                      <div>
                        <h4 className="font-medium mb-1">
                          {" "}
                          Seamless Check-in Experience
                        </h4>
                        <p className="text-sm text-gray-600">
                          We prioritize a smooth arrival. Fast, hassle-free
                          check-in with clear instructions and support available
                          if needed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <MaterialIcons name="money-off" size={24} color="black" />
                      <div>
                        <h4 className="font-medium mb-1">
                          Transparent Pricing
                        </h4>
                        <p className="text-sm text-gray-600">
                          No hidden charges. All prices are shown upfront,
                          including taxes and service fees
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ScrollView>
      )}
      {/* Sticky Bottom Bar */}
      <div className="fixed z-10 left-0 right-0 bottom-0 top-[calc(100vh-5rem)] h-20 w-full flex items-center justify-between shadow-sm bg-white p-4 border-t border-gray-200">
        <Pressable onPress={() => setOpen(true)}>
          <p className="font-semibold underline">Rs 4131.06 /-</p>
          <p className="text-zinc-500 text-sm">For 2 nights</p>
        </Pressable>
        <Pressable onPress={() => router.push(`/property/reserve`)}>
          <div className="bg-pink-600 text-white font-medium px-6 p-2 min-w-10 rounded-full">
            Reserve
          </div>
        </Pressable>
      </div>
      {/* Bottom sheet */}
      <div
        className={`fixed left-0 right-0 bg-white rounded-t-2xl z-50 transition-all duration-300 
        ${
          open ? "bottom-0" : "-bottom-[100vh]"
        } p-5 max-h-[75vh] overflow-y-auto`}
      >
        <div
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"
          onClick={() => setOpen(false)}
        />

        <p className="text-xl font-semibold mb-4">Price Details</p>

        {/* Content */}
        <div className="">
          <div className="flex-row justify-between mb-3 border-b border-zinc-400 pb-3">
            <p className="text-base text-gray-700">2 nights × ₹2,065.53</p>
            <p className="text-base font-semibold">₹4,131.06</p>
          </div>

          <div className="mt-4 mb-3">
            <p className="text-lg mb-1 font-medium">Dates</p>
            <p className="text-gray-600">12–14 Dec</p>
            <p className="text-sm text-gray-500">
              Free cancellation before 11 December
            </p>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
