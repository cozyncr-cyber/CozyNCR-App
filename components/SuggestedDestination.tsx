import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
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

type Props = {
  selectedCity: {
    name: string;
    lat: number | null;
    long: number | null;
  } | null;
  onSelect: (city: {
    name: string;
    lat: number | null;
    long: number | null;
  }) => void;
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

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location permission denied",
          "Enable location access to find nearby studios."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      onSelect({
        name: "Nearby",
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-lg font-semibold text-gray-900">
          Suggested destinations
        </Text>
      </View>

      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default SuggestedDestinations;
