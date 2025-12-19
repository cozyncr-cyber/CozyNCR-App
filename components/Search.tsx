import React, { useRef, useState, useEffect } from "react";
import { useSearch } from "@/src/contexts/SearchContext"; // adjust path if needed
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import Calendar, { CalendarOnSavePayload } from "./Calendar"; // <- adjust path
import SuggestedDestinations from "./SuggestedDestination";

const { width } = Dimensions.get("window");

type GuestsResult = {
  label: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
};
type SelectedCity = {
  name: string;
  lat: number | null;
  long: number | null;
};

export default function CityDestinationSelector({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Search / city states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [storedSearchValue, setStoredSearchValue] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);

  // Calendar selection stored in parent
  const [calendarSelection, setCalendarSelection] =
    useState<CalendarOnSavePayload | null>(null);

  // Guests inline (no limits)
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);
  const [guestSelection, setGuestSelection] = useState<GuestsResult | null>(
    null
  );
  const { setSearchState, searchState } = useSearch();

  // scroll / indicator
  const scrollRef = useRef<ScrollView | null>(null);
  const commitSearchState = () => {
    const finalPayload = {
      search: storedSearchValue || searchQuery,
      city: selectedCity,
      calendar:
        calendarSelection ?? calendarActionsRef.current.getSelection?.(),
      guests: guestSelection,
    };

    setSearchState(finalPayload);
    console.log("Committed search state:", finalPayload);
  };
  // calendar actions from child (populated by Calendar.onMount)
  const calendarActionsRef = useRef<{
    save?: () => void;
    getSelection?: () => CalendarOnSavePayload | null;
  }>({});

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleCitySelect = (city: SelectedCity) => {
    setSelectedCity(city);
  };

  // Back button handler
  const handleBack = () => {
    if (currentSlide > 0) scrollToSlide(currentSlide - 1);
  };

  // Next button handler (keeps flow single-threaded)
  const handleNext = () => {
    // Slide 0: store search and go to Calendar
    if (currentSlide === 0) {
      setStoredSearchValue(searchQuery);
      scrollToSlide(1);
      return;
    }
    if (currentSlide === 1) {
      // If calendar mounted, call its save()
      calendarActionsRef.current.save?.();

      const prevCheckIn = searchState.calendar?.checkIn ?? null;
      const prevCheckOut = searchState.calendar?.checkOut ?? null;

      // New selection from calendar (may be null)
      const sel = calendarActionsRef.current.getSelection?.() ?? null;

      // Prefer new selection; fall back to previously saved
      const mergedCheckIn = sel?.checkIn ?? prevCheckIn;
      const mergedCheckOut = sel?.checkOut ?? prevCheckOut ?? null;
      const mergedMode = sel?.mode ?? searchState.calendar?.mode ?? "range";

      if (!mergedCheckIn) {
        // no check-in available — clear calendar selection
        setCalendarSelection(null);
      } else {
        // safe to set because checkIn is guaranteed non-null here
        const mergedPayload: CalendarOnSavePayload = {
          label:
            sel?.label ??
            (mergedCheckOut
              ? `${mergedCheckIn.toLocaleDateString()} – ${mergedCheckOut.toLocaleDateString()}`
              : mergedCheckIn.toLocaleDateString()),
          checkIn: mergedCheckIn,
          checkOut: mergedCheckOut,
          mode: mergedMode,
        };
        setCalendarSelection(mergedPayload);
      }

      scrollToSlide(2);
      return;
    }

    // Slide 2: save guests and finalize
    if (currentSlide === 2) {
      const guestString =
        `${adults} adult${adults > 1 ? "s" : ""}` +
        `${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}` +
        `${infants ? `, ${infants} infant${infants > 1 ? "s" : ""}` : ""}` +
        `${pets ? `, ${pets} pet${pets > 1 ? "s" : ""}` : ""}`;

      const payload: GuestsResult = {
        label: guestString,
        adults,
        children,
        infants,
        pets,
      };
      setGuestSelection(payload);

      // Final assembled payload for query/navigation
      const finalPayload = {
        search: storedSearchValue || searchQuery,
        city: selectedCity, // ✅ coordinates saved here
        calendar:
          calendarSelection ?? calendarActionsRef.current.getSelection?.(),
        guests: payload,
      };
      commitSearchState();
      onClose?.(); // TODO: call your search function / navigation here

      return;
    }
  };
  // Reset modal state whenever it's opened (or closed) so UI stays in sync.
  useEffect(() => {
    if (visible) {
      // reset slide index and scroll to first slide immediately
      setCurrentSlide(0);

      // scroll the horizontal ScrollView to the first slide synchronously if available
      // animated: false avoids visible jumping
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }, 0);
    }
  }, [visible]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentSlide) setCurrentSlide(idx);
  };

  const nextLabel = currentSlide === 2 ? "Done" : "Next";

  // Guests helpers (no limits)
  const increment = (category: "adults" | "children" | "infants" | "pets") => {
    if (category === "adults") setAdults((a) => a + 1);
    if (category === "children") setChildren((c) => c + 1);
    if (category === "infants") setInfants((i) => i + 1);
    if (category === "pets") setPets((p) => p + 1);
  };
  const decrement = (
    category: "adults" | "children" | "infants" | "pets",
    min = 0
  ) => {
    if (category === "adults") setAdults((a) => Math.max(min, a - 1));
    if (category === "children") setChildren((c) => Math.max(min, c - 1));
    if (category === "infants") setInfants((i) => Math.max(min, i - 1));
    if (category === "pets") setPets((p) => Math.max(min, p - 1));
  };

  // Calendar child onSave handler
  const handleCalendarSave = (payload: CalendarOnSavePayload) => {
    setCalendarSelection(payload);
    // don't auto-advance here — Next controls the flow
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white max-h-[calc(100vh)]">
        {/* Header */}
        <View className="border-b border-gray-200 px-4 py-3 flex-row items-center justify-end">
          <Pressable
            className="p-2 -mr-2 rounded-full"
            onPress={() => {
              commitSearchState();
              onClose();
            }}
          >
            <Feather name="x" size={24} color="black" />
          </Pressable>
        </View>

        {/* Slides */}
        <View className="flex-1">
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            directionalLockEnabled={true}
            nestedScrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Slide 0 - Search / City Grid */}
            <View style={{ width }} className="px-6 py-8">
              <View className="max-w-xl w-full self-center h-[70vh] flex justify-center">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Choose the city{"\n"}you&apos;re going to visit
                </Text>
                <Text className="text-gray-500 mb-8">
                  More city guides coming soon!
                </Text>

                {/* Search Bar */}
                <View className="relative mb-8">
                  <View className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Feather name="search" size={22} color="#9CA3AF" />
                  </View>
                  <TextInput
                    placeholder="Search destinations"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full text-base"
                  />
                </View>
                <SuggestedDestinations
                  selectedCity={selectedCity}
                  onSelect={handleCitySelect}
                />
              </View>
            </View>

            {/* Slide 1 - Calendar */}
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
                  initialSelection={calendarSelection} // <-- calendarSelection: CalendarOnSavePayload | null
                  onSave={handleCalendarSave}
                  onClose={() => scrollToSlide(0)}
                  onMount={(actions) => {
                    calendarActionsRef.current.save = actions.save;
                    calendarActionsRef.current.getSelection =
                      actions.getSelection;
                  }}
                />
              </ScrollView>
            </View>

            {/* Slide 2 - Guests (inline, no limits) */}
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
                    minValue: 1,
                  },
                  {
                    key: "children",
                    title: "Children",
                    subtitle: "Ages 2–12",
                    value: children,
                    minValue: 0,
                  },
                  {
                    key: "infants",
                    title: "Infants",
                    subtitle: "Under 2",
                    value: infants,
                    minValue: 0,
                  },
                  {
                    key: "pets",
                    title: "Pets",
                    subtitle: "Bringing a pet?",
                    value: pets,
                    minValue: 0,
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
                        onPress={() => decrement(row.key as any, row.minValue)}
                        disabled={row.value <= row.minValue}
                        className={`w-8 h-8 rounded-full border items-center justify-center ${row.value <= row.minValue ? "border-gray-200" : "border-gray-400"}`}
                      >
                        <AntDesign
                          name="minus"
                          size={14}
                          color={
                            row.value <= row.minValue ? "lightgray" : "gray"
                          }
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
        </View>

        {/* Bottom Navigation (Back & Next always present) */}
        <View className="border-t border-gray-200 px-6 py-4 bg-white absolute w-full bottom-0">
          {/* Progress dots */}
          <View className="flex-row gap-2 mb-3 justify-center">
            <View
              className={`h-1 w-10 rounded-full ${currentSlide === 0 ? "bg-gray-900" : "bg-gray-300"}`}
            />
            <View
              className={`h-1 w-10 rounded-full ${currentSlide === 1 ? "bg-gray-900" : "bg-gray-300"}`}
            />
            <View
              className={`h-1 w-10 rounded-full ${currentSlide === 2 ? "bg-gray-900" : "bg-gray-300"}`}
            />
          </View>

          {/* Back + Next/Done */}
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
    </Modal>
  );
}
