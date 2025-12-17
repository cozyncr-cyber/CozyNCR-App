import { Stack } from "expo-router";
export default function TripsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="trips"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="tripDetails"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reviews"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
