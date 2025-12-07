import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");

const cities = [
  {
    id: 1,
    name: "New York",
    country: "United States",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Dubai",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Barcelona",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop",
  },
];

export default function CityDestinationSelector() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<any | null>(null);

  const scrollRef = useRef<ScrollView>(null);

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (currentSlide === 0) {
      if (!selectedCity) return;
      const next = 1;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else if (currentSlide === 1) {
      const next = 2;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }
  };

  const handleChangeCity = () => {
    const next = 0;
    setCurrentSlide(next);
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(index);
  };

  const isNextDisabled =
    currentSlide === 0 && !selectedCity
      ? true
      : currentSlide === 2
        ? true
        : false;

  const nextLabel =
    currentSlide === 0 ? "Next" : currentSlide === 1 ? "Next" : "Done";

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200 px-4 py-3 flex-row items-center justify-end">
        <Pressable className="p-2 -mr-2 rounded-full">
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
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {/* Slide 1 - City Selection */}
          <View style={{ width }} className="px-6 py-8">
            <View className="max-w-xl w-full self-center">
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

              {/* City Grid */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap -mx-1">
                  {filteredCities.map((city) => {
                    const isSelected = selectedCity?.id === city.id;
                    return (
                      <Pressable
                        key={city.id}
                        onPress={() => setSelectedCity(city)}
                        className="px-1 pb-2"
                        style={{ width: "50%" }}
                      >
                        <View
                          className={`overflow-hidden rounded-2xl ${
                            isSelected ? "border-2 border-gray-900" : ""
                          }`}
                        >
                          <View className="aspect-[4/3] relative">
                            <Image
                              source={{ uri: city.image }}
                              className="w-full h-full"
                              style={{ resizeMode: "cover" }}
                            />
                            <View className="absolute inset-0 bg-black/30" />
                            <View className="absolute bottom-0 left-0 p-3">
                              <Text className="text-white font-semibold text-base">
                                {city.name}
                              </Text>
                              <Text className="text-white/80 text-xs">
                                {city.country}
                              </Text>
                            </View>
                            {isSelected && (
                              <View className="absolute top-3 right-3 w-6 h-6 bg-gray-900 rounded-full items-center justify-center">
                                <View className="w-3 h-3 bg-white rounded-full" />
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Slide 2 - Confirmation/Details */}
          <View style={{ width }} className="px-6 py-8">
            <View className="max-w-xl w-full self-center">
              <Text className="text-3xl font-bold text-gray-900 mb-8">
                Perfect choice!
              </Text>

              {selectedCity && (
                <View className="bg-gray-50 rounded-3xl p-6 mb-8">
                  <View className="flex-row items-center gap-4 mb-4">
                    <Feather name="map-pin" size={24} color="#4B5563" />
                    <View>
                      <Text className="text-xl font-semibold">
                        {selectedCity.name}
                      </Text>
                      <Text className="text-gray-600">
                        {selectedCity.country}
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={{ uri: selectedCity.image }}
                    className="w-full h-48 rounded-2xl"
                    style={{ resizeMode: "cover" }}
                  />
                </View>
              )}

              <Pressable onPress={handleChangeCity}>
                <Text className="text-gray-600 underline font-semibold">
                  ← Change city
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Slide 3 - Empty/Coming Soon */}
          <View style={{ width }} className="px-6 py-8">
            <View className="flex-1 items-center justify-center">
              <Text className="text-3xl font-bold text-gray-900 mb-4">
                Coming soon
              </Text>
              <Text className="text-gray-500 text-center">
                We&apos;re working on personalized guides, tips, and more for{" "}
                {selectedCity ? selectedCity.name : "your next trip"}.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View className="border-t border-gray-200 px-6 py-4">
        <View className="flex-row gap-2 mb-3 justify-center">
          <View
            className={`h-1 w-10 rounded-full ${
              currentSlide === 0 ? "bg-gray-900" : "bg-gray-300"
            }`}
          />
          <View
            className={`h-1 w-10 rounded-full ${
              currentSlide === 1 ? "bg-gray-900" : "bg-gray-300"
            }`}
          />
          <View
            className={`h-1 w-10 rounded-full ${
              currentSlide === 2 ? "bg-gray-900" : "bg-gray-300"
            }`}
          />
        </View>

        <Pressable
          onPress={handleNext}
          disabled={isNextDisabled}
          className={`
            w-full py-4 rounded-xl items-center justify-center
            ${isNextDisabled ? "bg-gray-200" : "bg-gray-900"}
          `}
        >
          <Text
            className={`text-base font-semibold ${
              isNextDisabled ? "text-gray-400" : "text-white"
            }`}
          >
            {nextLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
