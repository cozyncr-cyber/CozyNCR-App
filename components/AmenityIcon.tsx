import FontAwesome6 from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

export const amenityIcons: Record<
  string,
  { component: any; name: string; size?: number; color?: string }
> = {
  wifi: {
    component: Feather,
    name: "wifi",
  },
  tv: {
    component: Feather,
    name: "tv",
  },
  ac: {
    component: FontAwesome6,
    name: "snowflake-o",
  },
  desk: {
    component: MaterialIcons,
    name: "desk",
  },
  parking: {
    component: MaterialIcons,
    name: "local-parking",
  },
  coffee: {
    component: Ionicons,
    name: "cafe-outline",
  },
  kitchen: {
    component: MaterialIcons,
    name: "kitchen",
  },

  // fallback icon if key does not match
  default: {
    component: FontAwesome6,
    name: "circle-question",
  },
};
