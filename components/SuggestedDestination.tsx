import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import {
  Navigation,
  Building2,
  Palmtree,
  Castle,
  Waves,
  Mountain,
  Landmark,
} from "lucide-react-native";
import { destinations, Destination } from "@/src/data/destinations";
import type { SelectedCity } from "@/src/contexts/SearchContext";

type Props = {
  selectedCity: SelectedCity | null;
  onSelect: (city: SelectedCity) => void;
};

type IconName =
  | "navigation"
  | "building"
  | "palmtree"
  | "castle"
  | "landmark"
  | "mountain"
  | "waves";

const getIcon = (iconName: IconName) => {
  const icons = {
    navigation: Navigation,
    building: Building2,
    palmtree: Palmtree,
    castle: Castle,
    landmark: Landmark,
    mountain: Mountain,
    waves: Waves,
  };
  return icons[iconName] || Building2;
};

const SuggestedDestinations: React.FC<Props> = ({ selectedCity, onSelect }) => {
  const [loadingNearby, setLoadingNearby] = useState(false);

  const handleNearbyPress = async () => {
    try {
      setLoadingNearby(true);

      // 1) Optimistically set "Nearby" immediately
      onSelect({
        name: "Nearby",
        label: "Nearby",
        country: "",
        lat: null,
        long: null,
      });

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location permission denied",
          "Enable location access to find nearby studios."
        );
        return;
      }

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Location timeout")), 6000)
      );

      const location: any = await Promise.race([
        locationPromise,
        timeoutPromise,
      ]);

      const { latitude, longitude } = location.coords;

      // 2) Update when we actually have coords
      onSelect({
        name: "Nearby",
        label: "Nearby",
        country: "",
        lat: latitude,
        long: longitude,
      });
    } catch (error) {
      console.error("Failed to get location", error);
      Alert.alert("Location error", "Unable to fetch your current location.");
    } finally {
      setLoadingNearby(false);
    }
  };

  const renderItem = ({ item }: { item: Destination }) => {
    const Icon = getIcon(item.icon);
    const isSelected = selectedCity?.name === item.name;

    const isNearby = item.name === "Nearby";

    return (
      <Pressable
        onPress={() =>
          isNearby
            ? handleNearbyPress()
            : onSelect({
                name: item.name,
                label: item.name,
                country: "India",
                lat: item.lat,
                long: item.long,
              })
        }
        disabled={loadingNearby && isNearby}
        className={`flex-row items-center gap-4 px-4 py-3 rounded-xl mb-2
          ${
            isSelected
              ? "border-2 border-black bg-gray-50"
              : "border border-transparent"
          }
        `}
      >
        <View
          className={`w-14 h-14 rounded-xl ${item.iconColor} items-center justify-center`}
        >
          {loadingNearby && isNearby ? (
            <ActivityIndicator />
          ) : (
            <Icon
              size={24}
              className={isSelected ? "text-black" : "text-gray-700"}
            />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500">{item.subtitle}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-gray-900">
          Suggested destinations
        </Text>
      </View>

      <FlatList
        style={{ flex: 1 }} // ✅ IMPORTANT
        data={destinations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SuggestedDestinations;
