import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map() {
  // Replace these with your coordinates
  const latitude = 26.9124;
  const longitude = 75.7873;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.02, // zoom levels
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Your place"
          description="This is where you'll be"
        />
      </MapView>
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
  map: {
    width: "100%",
    height: 300, // like the Airbnb card screenshot
    borderRadius: 16,
    overflow: "hidden", // rounds the map corners
  },
});
