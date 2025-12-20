import { View, Image } from "react-native";

export default function LaunchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../components/SVGs/cozncr_t.png")} // 👈 your image path
        style={{
          width: 220,
          height: 220,
          marginBottom: 20,
          resizeMode: "contain",
        }}
      />
    </View>
  );
}
