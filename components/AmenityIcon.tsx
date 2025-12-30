import {
  Wifi,
  Tv,
  Snowflake,
  Utensils,
  Wind,
  Cigarette,
  Wine,
  Zap,
  Accessibility,
  ShieldCheck,
  Speaker,
  Flame,
  Key,
  Waves,
  Flower2,
  BriefcaseMedical,
  Users,
  Car,
  Monitor,
  Coffee,
  Home,
  Armchair,
  PartyPopper,
  Castle,
  Briefcase,
  Music,
  MapPin,
} from "lucide-react-native";

export const amenityIcons: Record<string, { component: any }> = {
  // Core
  wifi: { component: Wifi },
  ac: { component: Snowflake },
  tv: { component: Tv },
  kitchen: { component: Utensils },

  // Extra features
  parking: { component: Car },
  desk: { component: Monitor },
  coffee: { component: Coffee },
  washing_machine: { component: Waves },
  lift: { component: Accessibility },
  power_backup: { component: Zap },
  balcony: { component: Wind },
  garden: { component: Flower2 },
  sound_system: { component: Speaker },
  private_entrance: { component: Key },
  first_aid: { component: BriefcaseMedical },
  fire_ext: { component: Flame },
  safety: { component: ShieldCheck },

  // Rules
  smoking: { component: Cigarette },
  alcohol: { component: Wine },
  party: { component: Users },

  // Optional / misc (present on web)
  home: { component: Home },
  armchair: { component: Armchair },
  party_popper: { component: PartyPopper },
  castle: { component: Castle },
  briefcase: { component: Briefcase },
  music: { component: Music },
  map: { component: MapPin },

  // fallback
  default: { component: ShieldCheck },
};
