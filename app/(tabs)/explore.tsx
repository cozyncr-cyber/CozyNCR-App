import { ScrollView } from "react-native";
import AirbnbGuests from "@/components/Guests";

export default function explore() {
  return (
    <ScrollView
      style={
        {
          $$css: true,
          _: "flex-1",
        } as any
      }
    >
      <AirbnbGuests />
    </ScrollView>
  );
}
