import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import Calendar, { CalendarOnSavePayload } from "./Calendar";
import SuggestedDestinations from "./SuggestedDestination";

import { useSearchDraft } from "@/src/hooks/useSearchDraft";
import { GOOGLE_KEY } from "@/lib/appwrite";

const { width } = Dimensions.get("window");

export default function CityDestinationSelector({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { draft, setSearchInput, setCity, setCalendar, clearAll, commit } =
    useSearchDraft(visible);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Guests (local counters only)
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [typedQuery, setTypedQuery] = useState("");

  const scrollRef = useRef<ScrollView | null>(null);

  async function resolveFirstPlace(query: string) {
    if (!query.trim()) return null;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&types=(cities)&components=country:in&key=${GOOGLE_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.predictions?.length) return null;

    const placeId = data.predictions[0].place_id;

    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_KEY}`;

    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();

    return detailData.result;
  }

  useEffect(() => {
    async function maybeResolve() {
      // only auto-resolve on CITY slide
      if (currentSlide !== 0) return;

      // nothing typed → ignore
      if (!typedQuery.trim()) return;

      // city already selected → ignore
      if (draft.city) return;

      try {
        const place = await resolveFirstPlace(typedQuery);

        if (!place) return;

        const city =
          place.address_components?.find((c: any) =>
            c.types.includes("locality")
          )?.long_name ?? place.name;

        const country =
          place.address_components?.find((c: any) =>
            c.types.includes("country")
          )?.long_name ?? "";

        const { lat, lng } = place.geometry.location;

        setCity({
          label: `${city}, ${country}`,
          name: city,
          country,
          lat,
          long: lng,
        });

        setSearchInput(`${city}, ${country}`);
      } catch (e) {
        console.log("auto resolve failed", e);
      }
    }

    maybeResolve();
  }, [typedQuery, currentSlide]);

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleBack = () => {
    if (currentSlide > 0) scrollToSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < 2) {
      scrollToSlide(currentSlide + 1);
      return;
    }

    // Slide 2 → Done
    const label =
      `${adults} adult${adults > 1 ? "s" : ""}` +
      `${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}` +
      `${infants ? `, ${infants} infant${infants > 1 ? "s" : ""}` : ""}` +
      `${pets ? `, ${pets} pet${pets > 1 ? "s" : ""}` : ""}`;

    commit({
      guests: {
        label,
        adults,
        children,
        infants,
        pets,
      },
    });
    onClose();
  };

  useEffect(() => {
    if (!visible) return;

    setCurrentSlide(0);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    });
  }, [visible]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentSlide) setCurrentSlide(idx);
  };

  const nextLabel = currentSlide === 2 ? "Done" : "Next";

  const increment = (key: "adults" | "children" | "infants" | "pets") => {
    if (key === "adults") setAdults((v) => v + 1);
    if (key === "children") setChildren((v) => v + 1);
    if (key === "infants") setInfants((v) => v + 1);
    if (key === "pets") setPets((v) => v + 1);
  };

  const decrement = (
    key: "adults" | "children" | "infants" | "pets",
    min = 0
  ) => {
    if (key === "adults") setAdults((v) => Math.max(min, v - 1));
    if (key === "children") setChildren((v) => Math.max(min, v - 1));
    if (key === "infants") setInfants((v) => Math.max(min, v - 1));
    if (key === "pets") setPets((v) => Math.max(min, v - 1));
  };

  const handleCalendarSave = (payload: CalendarOnSavePayload) => {
    setCalendar(payload);
  };
  const handleClearAll = () => {
    // 1️⃣ Clear draft (search, city, calendar, guests)
    clearAll();

    // 2️⃣ Reset guest counters (UI)
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setPets(0);

    // 3️⃣ Go back to first slide
    setCurrentSlide(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="border-b border-gray-200 h-20 px-4 py-3 flex-row justify-between items-center">
            <Pressable onPress={handleClearAll}>
              <Text className="text-red-500 font-medium">Clear all</Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </Pressable>
          </View>

          {/* Slides */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            nestedScrollEnabled // ✅ ADD THIS
            directionalLockEnabled
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Slide 0 */}
            <View style={{ width }} className="px-6 py-8 flex-1">
              <Text className="text-3xl font-bold mb-8">
                Choose the city{"\n"}you&apos;re going to visit
              </Text>

              <View className="relative mb-8">
                <Feather
                  name="search"
                  size={22}
                  color="#9CA3AF"
                  style={{ position: "absolute", left: 16, top: 14 }}
                />
                <GooglePlacesAutocomplete
                  placeholder="Search destinations"
                  fetchDetails
                  enablePoweredByContainer={false}
                  onPress={(data, details = null) => {
                    if (!details) return;

                    const city =
                      details.address_components?.find((c) =>
                        c.types.includes("locality")
                      )?.long_name ?? details.name;

                    const country =
                      details.address_components?.find((c) =>
                        c.types.includes("country")
                      )?.long_name ?? "";

                    const { lat, lng } = details.geometry.location;

                    setCity({
                      label: `${city}, ${country}`,
                      name: city,
                      country,
                      lat,
                      long: lng,
                    });

                    setSearchInput(`${city}, ${country}`);
                  }}
                  query={{
                    key: GOOGLE_KEY,
                    language: "en",
                    components: "country:in",
                    types: "geocode",
                    location: "28.6139,77.2090",
                    radius: 100000,
                  }}
                  textInputProps={{
                    placeholderTextColor: "#9CA3AF",
                    onChangeText: (text) => {
                      setTypedQuery(text);
                      setSearchInput(text);
                    },
                  }}
                  debounce={300}
                  styles={{
                    container: { flex: 0 },

                    textInput: {
                      borderWidth: 2,
                      borderColor: "#D1D5DB",
                      borderRadius: 999,
                      paddingLeft: 40,
                      height: 48,
                    },

                    listView: {
                      marginTop: 10,
                      paddingHorizontal: 4,
                    },

                    row: {
                      backgroundColor: "#FFFFFF",
                      paddingVertical: 14,
                      paddingHorizontal: 14,
                      borderRadius: 14,
                      marginVertical: 6,

                      // subtle border and shadow
                      borderWidth: 1,
                      borderColor: "#E5E7EB",

                      shadowColor: "#000",
                      shadowOpacity: 0.06,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 3 },

                      elevation: 2,
                    },

                    separator: {
                      height: 0,
                    },

                    description: {
                      fontSize: 15,
                      color: "#111827",
                      fontWeight: "500",
                    },

                    predefinedPlacesDescription: {
                      color: "#6B7280",
                    },
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <SuggestedDestinations
                  selectedCity={draft.city}
                  onSelect={(city) => {
                    setCity(city);

                    // 👇 KEY PART
                    if (city.name === "Nearby") {
                      setSearchInput("");
                    } else {
                      setSearchInput(city.label);
                    }
                  }}
                />
              </View>
            </View>

            {/* Slide 1 */}
            <View style={{ width, flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 120, // keep space so bottom bar doesn't overlap calendar content
                  backgroundColor: "white",
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true} // allow inner vertical scrolling on Android
              >
                <View className="flex-row items-center justify-between py-6 bg-white px-4">
                  <Text className="text-2xl font-semibold">Change dates</Text>
                </View>
                <Calendar
                  initialSelection={draft.calendar}
                  onSave={handleCalendarSave}
                  onClose={() => scrollToSlide(0)}
                />
              </ScrollView>
            </View>

            {/* Slide 2 */}
            <View style={{ width }} className="px-6 py-8">
              <View className="max-w-xl w-full self-center">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-2xl font-semibold">Change guests</Text>
                </View>

                <Text className="text-sm text-gray-600 mb-6">
                  No limits set — this is for search. Increase or decrease as
                  needed.
                </Text>

                {[
                  {
                    key: "adults",
                    title: "Adults",
                    subtitle: "Age 13+",
                    value: adults,
                    min: 1,
                  },
                  {
                    key: "children",
                    title: "Children",
                    subtitle: "Ages 2–12",
                    value: children,
                    min: 0,
                  },
                  {
                    key: "infants",
                    title: "Infants",
                    subtitle: "Under 2",
                    value: infants,
                    min: 0,
                  },
                  {
                    key: "pets",
                    title: "Pets",
                    subtitle: "Bringing a pet?",
                    value: pets,
                    min: 0,
                  },
                ].map((row) => (
                  <View
                    key={row.key}
                    className="flex-row items-center justify-between py-6 border-b border-gray-200"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-normal text-gray-900">
                        {row.title}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-0.5">
                        {row.subtitle}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-4">
                      <Pressable
                        onPress={() => decrement(row.key as any, row.min)}
                        disabled={row.value <= row.min}
                        className={`w-8 h-8 rounded-full border items-center justify-center ${row.value <= row.min ? "border-gray-200" : "border-gray-400"}`}
                      >
                        <AntDesign
                          name="minus"
                          size={14}
                          color={row.value <= row.min ? "lightgray" : "gray"}
                        />
                      </Pressable>

                      <Text className="w-8 text-center text-base text-gray-900">
                        {row.value}
                      </Text>

                      <Pressable
                        onPress={() => increment(row.key as any)}
                        className="w-8 h-8 rounded-full border items-center justify-center border-gray-400"
                      >
                        <AntDesign name="plus" size={14} color="gray" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="border-t border-gray-200 px-6 py-4 bg-white absolute w-full bottom-0">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={handleBack}
                disabled={currentSlide === 0}
                className={`flex-1 py-4 rounded-xl border ${currentSlide === 0 ? "border-gray-200" : "border-gray-400"}`}
              >
                <Text
                  className={`text-center font-semibold ${currentSlide === 0 ? "text-gray-300" : "text-gray-700"}`}
                >
                  Back
                </Text>
              </Pressable>

              <Pressable
                onPress={handleNext}
                className="flex-1 py-4 rounded-xl items-center justify-center bg-gray-900"
              >
                <Text className="text-base font-semibold text-white">
                  {nextLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
