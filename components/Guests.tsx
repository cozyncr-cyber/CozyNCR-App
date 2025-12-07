import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useProperty } from "@/src/contexts/PropertyContext";

type Setter = React.Dispatch<React.SetStateAction<number>>;

interface GuestRowProps {
  title: string;
  subtitle: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: number;
  disabledIncrement?: boolean;
  link?: string;
}
type GuestsResult = {
  label: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
};

export default function Guests({
  onSave,
  onClose,
}: {
  onSave: (result: GuestsResult) => void;
  onClose: () => void;
}) {
  const { data } = useProperty();

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Safeguard defaults
  const maxGuests = data?.maxGuests ?? Number.POSITIVE_INFINITY;
  const maxInfants = data?.maxInfants ?? Number.POSITIVE_INFINITY;
  const maxPets = data?.maxPets ?? 0;
  const allowChildren = data?.allowChildren ?? true;

  const totalGuests = adults + children; // infants & pets don't count towards maxGuests

  const increment = (setter: Setter, value: number, category: string) => {
    if (category === "pets") {
      // Respect maxPets
      if (value < maxPets) {
        setter(value + 1);
      }
      return;
    }

    if (category === "infants") {
      // Respect maxInfants
      if (value < maxInfants) {
        setter(value + 1);
      }
      return;
    }

    // Adults & children: respect maxGuests (infants not included)
    if (totalGuests < maxGuests) {
      setter(value + 1);
    }
  };

  const decrement = (setter: Setter, value: number, min = 0) => {
    if (value > min) setter(value - 1);
  };

  const GuestRow = ({
    title,
    subtitle,
    value,
    onIncrement,
    onDecrement,
    minValue = 0,
    disabledIncrement,
    link,
  }: GuestRowProps) => {
    const minusDisabled = value <= minValue;
    const plusDisabled = !!disabledIncrement;

    return (
      <View className="flex-row items-center justify-between py-6 border-b border-gray-200">
        <View className="flex-1">
          <Text className="text-base font-normal text-gray-900">{title}</Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {subtitle}
            {!!link && <Text>{"\n"}</Text>}
            {!!link && <Text className="underline text-gray-500">{link}</Text>}
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={onDecrement}
            disabled={minusDisabled}
            className={`w-8 h-8 rounded-full border items-center justify-center
              ${minusDisabled ? "border-gray-200" : "border-gray-400"}`}
          >
            <AntDesign
              name="minus"
              size={14}
              color={minusDisabled ? "lightgray" : "gray"}
            />
          </Pressable>

          <Text className="w-4 text-center text-base text-gray-900">
            {value}
          </Text>

          <Pressable
            onPress={onIncrement}
            disabled={plusDisabled}
            className={`w-8 h-8 rounded-full border items-center justify-center
              ${plusDisabled ? "border-gray-200" : "border-gray-400"}`}
          >
            <AntDesign
              name="plus"
              size={14}
              color={plusDisabled ? "lightgray" : "gray"}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center">
      <View className="bg-white w-full h-full p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-semibold">Change guests</Text>
          <Pressable className="p-2 rounded-full" onPress={onClose}>
            <Feather name="x" size={24} color="black" />
          </Pressable>
        </View>

        <Text className="text-sm text-gray-600 mb-6">
          This place has a maximum of{" "}
          {Number.isFinite(maxGuests) ? maxGuests : "–"} guests, not including
          infants.{" "}
          {maxPets > 0
            ? `Up to ${maxPets} pet${maxPets > 1 ? "s" : ""} allowed.`
            : "Pets aren’t allowed."}
        </Text>

        <View>
          <GuestRow
            title="Adults"
            subtitle="Age 13+"
            value={adults}
            onIncrement={() => increment(setAdults, adults, "adults")}
            onDecrement={() => decrement(setAdults, adults, 1)}
            disabledIncrement={totalGuests >= maxGuests}
            minValue={1}
          />

          {/* Children row only allowed iff allowChildren */}
          {allowChildren && (
            <GuestRow
              title="Children"
              subtitle="Ages 2–12"
              value={children}
              onIncrement={() => increment(setChildren, children, "children")}
              onDecrement={() => decrement(setChildren, children)}
              disabledIncrement={totalGuests >= maxGuests}
            />
          )}

          {!allowChildren && (
            <GuestRow
              title="Children"
              subtitle="Children aren’t allowed at this place"
              value={0}
              onIncrement={() => {}}
              onDecrement={() => {}}
              disabledIncrement
            />
          )}

          <GuestRow
            title="Infants"
            subtitle={`Under 2${
              Number.isFinite(maxInfants)
                ? ` · Up to ${maxInfants} allowed`
                : ""
            }`}
            value={infants}
            onIncrement={() => increment(setInfants, infants, "infants")}
            onDecrement={() => decrement(setInfants, infants)}
            disabledIncrement={infants >= maxInfants}
          />

          <GuestRow
            title="Pets"
            subtitle={
              maxPets > 0
                ? `Up to ${maxPets} pet${maxPets > 1 ? "s" : ""} allowed`
                : "Pets aren’t allowed (service animals exempt)"
            }
            value={pets}
            onIncrement={() => increment(setPets, pets, "pets")}
            onDecrement={() => decrement(setPets, pets)}
            disabledIncrement={maxPets === 0 || pets >= maxPets}
            link="Bringing a service animal?"
          />
        </View>

        <Pressable
          onPress={() => {
            const guestString =
              `${adults} adult${adults > 1 ? "s" : ""}` +
              `${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}` +
              `${infants ? `, ${infants} infant${infants > 1 ? "s" : ""}` : ""}` +
              `${pets ? `, ${pets} pet${pets > 1 ? "s" : ""}` : ""}`;

            onSave({
              label: guestString,
              adults,
              children,
              infants,
              pets,
            });
          }}
          className="mt-6 bg-gray-900 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
