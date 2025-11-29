"use dom";
import "../src/global.css";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

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

const AirbnbGuests = () => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const maxGuests = 2;
  const maxInfants = 5;
  const totalGuests = adults + children;

  const increment = (setter: Setter, value: number, category: string) => {
    if (category === "pets") {
      setter(value + 1);
      return;
    }
    if (category === "infants") {
      if (value < maxInfants) setter(value + 1);
      return;
    }
    if (totalGuests < maxGuests) setter(value + 1);
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
  }: GuestRowProps) => (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 last:border-b-0">
      <div>
        <h3 className="text-base font-normal text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {subtitle}
          {link && (
            <button className="text-left underline text-gray-500 hover:text-gray-700">
              {link}
            </button>
          )}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={value <= minValue}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors
            ${
              value <= minValue
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-400 text-gray-600 hover:border-gray-900"
            }`}
        >
          <AntDesign name="minus" size={14} color="gray" />
        </button>
        <span className="w-4 text-center text-base text-gray-900">{value}</span>
        <button
          onClick={onIncrement}
          disabled={disabledIncrement}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors
            ${
              disabledIncrement
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-gray-400 text-gray-600 hover:border-gray-900"
            }`}
        >
          <AntDesign name="plus" size={14} color="gray" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Change guests</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Feather name="x" size={24} color="black" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          This place has a maximum of {maxGuests} guests, not including infants.
          Pets aren&apos;t allowed.
        </p>

        <div>
          <GuestRow
            title="Adults"
            subtitle="Age 13+"
            value={adults}
            onIncrement={() => increment(setAdults, adults, "adults")}
            onDecrement={() => decrement(setAdults, adults, 1)}
            disabledIncrement={totalGuests >= maxGuests}
            minValue={1}
          />
          <GuestRow
            title="Children"
            subtitle="Ages 2–12"
            value={children}
            onIncrement={() => increment(setChildren, children, "children")}
            onDecrement={() => decrement(setChildren, children)}
            disabledIncrement={totalGuests >= maxGuests}
          />
          <GuestRow
            title="Infants"
            subtitle="Under 2"
            value={infants}
            onIncrement={() => setInfants(infants + 1)}
            onDecrement={() => decrement(setInfants, infants)}
            disabledIncrement={infants >= maxInfants}
          />
          <GuestRow
            title="Pets"
            subtitle=""
            value={pets}
            onIncrement={() => setPets(pets + 1)}
            onDecrement={() => decrement(setPets, pets)}
            disabledIncrement={false}
            link="Bringing a service animal?"
          />
        </div>
      </div>
    </div>
  );
};

export default AirbnbGuests;
