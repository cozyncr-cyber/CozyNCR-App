import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Linking from "expo-linking";

export default function Map({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  // Replace these with your coordinates

  const openMaps = (lat: number, lng: number) => {
    const url =
      Platform.OS === "ios"
        ? `maps:0,0?q=${lat},${lng}`
        : `geo:0,0?q=${lat},${lng}`;

    Linking.openURL(url);
  };

  return (
    <View style={styles.container} className="rounded-xl overflow-hidden">
      <TouchableOpacity
        className="flex-1 py-2 border-2 rounded-lg items-center bg-gray-900 px-6"
        onPress={() => openMaps((latitude = 0), (longitude = 0))}
      >
        <Text className="font-semibold text-white">Get directions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
