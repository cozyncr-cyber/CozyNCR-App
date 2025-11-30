import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  text: string;
  limit?: number;
};

export default function ExpandableText({ text, limit = 140 }: Props) {
  const [expanded, setExpanded] = useState(false);

  const safeText = text ?? "";
  const isLong = safeText.length > limit;

  // Cut at last full word (nearest space before limit)
  const shortText = isLong
    ? safeText.slice(0, safeText.lastIndexOf(" ", limit))
    : safeText;

  const displayText = expanded ? safeText : shortText + (isLong ? "..." : "");

  return (
    <View>
      <Text className="text-gray-700 mb-2">{displayText}</Text>

      {isLong && (
        <Pressable
          onPress={() => setExpanded((prev) => !prev)}
          className="flex-row items-center gap-1"
        >
          <Text className="font-semibold underline">
            {expanded ? "Show Less" : "Show More"}
          </Text>

          <MaterialIcons
            name="chevron-right"
            size={16}
            // rotate arrow when expanded
            style={expanded ? { transform: [{ rotate: "90deg" }] } : undefined}
          />
        </Pressable>
      )}
    </View>
  );
}
