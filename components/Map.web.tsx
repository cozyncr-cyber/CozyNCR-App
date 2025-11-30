import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function Map() {
  return (
    <View style={styles.container}>
      <Text className="text-zinc-500 font-light mt-6">
        Map not available on web.
      </Text>
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
