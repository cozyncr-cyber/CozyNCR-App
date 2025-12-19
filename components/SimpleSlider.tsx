import React, { useRef, useEffect } from "react";
import { View, PanResponder } from "react-native";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
}

export const DualRangeSlider = ({
  min,
  max,
  step = 1,
  values,
  onChange,
}: DualRangeSliderProps) => {
  const trackWidth = useRef(0);
  const trackX = useRef(0);

  // 🔑 LIVE VALUES (fixes reset bug)
  const minRef = useRef(values[0]);
  const maxRef = useRef(values[1]);

  // keep refs in sync with state
  useEffect(() => {
    minRef.current = values[0];
    maxRef.current = values[1];
  }, [values]);

  const clamp = (v: number, minV: number, maxV: number) =>
    Math.min(Math.max(v, minV), maxV);

  const percentToValue = (percent: number) => {
    let value = min + percent * (max - min);
    if (step) value = Math.round(value / step) * step;
    return clamp(value, min, max);
  };

  const valueToPercent = (value: number) => ((value - min) / (max - min)) * 100;

  const createResponder = (type: "min" | "max") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (!trackWidth.current) return;

        const relativeX = gesture.moveX - trackX.current;
        let percent = relativeX / trackWidth.current;
        percent = clamp(percent, 0, 1);

        const newValue = percentToValue(percent);

        if (type === "min") {
          if (newValue <= maxRef.current) {
            onChange([newValue, maxRef.current]);
          }
        } else {
          if (newValue >= minRef.current) {
            onChange([minRef.current, newValue]);
          }
        }
      },
    });

  const minResponder = useRef(createResponder("min")).current;
  const maxResponder = useRef(createResponder("max")).current;

  const minLeft = valueToPercent(values[0]);
  const maxLeft = valueToPercent(values[1]);

  return (
    <View
      className="h-12 justify-center"
      onLayout={(e) => {
        trackWidth.current = e.nativeEvent.layout.width;
        trackX.current = e.nativeEvent.layout.x;
      }}
    >
      {/* Track */}
      <View className="h-2 bg-gray-200 rounded-full" />

      {/* Active Range */}
      <View
        className="absolute h-2 bg-gray-900 rounded-full"
        style={{
          left: `${minLeft}%`,
          width: `${maxLeft - minLeft}%`,
        }}
      />

      {/* Min Thumb */}
      <View
        {...minResponder.panHandlers}
        className="absolute h-6 w-6 bg-gray-900 rounded-full"
        style={{ left: `${minLeft}%`, marginLeft: -12 }}
      />

      {/* Max Thumb */}
      <View
        {...maxResponder.panHandlers}
        className="absolute h-6 w-6 bg-gray-900 rounded-full"
        style={{ left: `${maxLeft}%`, marginLeft: -12 }}
      />
    </View>
  );
};
