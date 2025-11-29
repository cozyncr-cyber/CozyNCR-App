"use dom";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Map() {
  return (
    <View style={styles.container}>
      <p className="text-zinc-500 font-light mt-6">Map not available on web.</p>
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
