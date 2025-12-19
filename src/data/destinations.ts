export type Destination = {
  id: number;
  name: string;
  subtitle: string;
  icon:
    | "navigation"
    | "building"
    | "palmtree"
    | "castle"
    | "landmark"
    | "mountain"
    | "waves";
  iconColor: string;
  lat: number | null;
  long: number | null;
};

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Nearby",
    subtitle: "Find what's around you",
    icon: "navigation",
    iconColor: "bg-blue-50",
    lat: null,
    long: null,
  },
  {
    id: 2,
    name: "Noida, Uttar Pradesh",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-pink-50",
    lat: 28.5355,
    long: 77.391,
  },
  {
    id: 3,
    name: "North Goa, Goa",
    subtitle: "Popular beach destination",
    icon: "palmtree",
    iconColor: "bg-yellow-50",
    lat: 15.4909,
    long: 73.8278,
  },
  {
    id: 4,
    name: "Gurgaon District, Haryana",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-gray-50",
    lat: 28.4595,
    long: 77.0266,
  },
  {
    id: 5,
    name: "South Delhi, Delhi",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-blue-50",
    lat: 28.5244,
    long: 77.2066,
  },
  {
    id: 6,
    name: "Jaipur, Rajasthan",
    subtitle: "Great for a weekend getaway",
    icon: "castle",
    iconColor: "bg-purple-50",
    lat: 26.9124,
    long: 75.7873,
  },
  {
    id: 7,
    name: "Paris, France",
    subtitle: "For sights like Eiffel Tower",
    icon: "landmark",
    iconColor: "bg-indigo-50",
    lat: 48.8566,
    long: 2.3522,
  },
  {
    id: 8,
    name: "Greater Noida, Uttar Pradesh",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-red-50",
    lat: 28.4744,
    long: 77.504,
  },
  {
    id: 9,
    name: "Chandigarh",
    subtitle: "Popular with travellers near you",
    icon: "building",
    iconColor: "bg-green-50",
    lat: 30.7333,
    long: 76.7794,
  },
  {
    id: 10,
    name: "Kolkata, West Bengal",
    subtitle: "For its top-notch dining",
    icon: "building",
    iconColor: "bg-orange-50",
    lat: 22.5726,
    long: 88.3639,
  },
  {
    id: 11,
    name: "Nainital, Uttarakhand",
    subtitle: "Great for a weekend getaway",
    icon: "mountain",
    iconColor: "bg-pink-50",
    lat: 29.3803,
    long: 79.4636,
  },
  {
    id: 12,
    name: "Dehradun, Uttarakhand",
    subtitle: "For nature lovers",
    icon: "mountain",
    iconColor: "bg-teal-50",
    lat: 30.3165,
    long: 78.0322,
  },
  {
    id: 13,
    name: "Bangkok, Thailand",
    subtitle: "For sights like Grand Palace",
    icon: "landmark",
    iconColor: "bg-emerald-50",
    lat: 13.7563,
    long: 100.5018,
  },
];
