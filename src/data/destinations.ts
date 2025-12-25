export type Destination = {
  id: number;
  name: string; // raw city name
  label: string; // display label
  country: string; // country name
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
    label: "Near you",
    country: "India",
    subtitle: "Find what's around you",
    icon: "navigation",
    iconColor: "bg-blue-50",
    lat: null,
    long: null,
  },
  {
    id: 2,
    name: "Noida",
    label: "Noida, Uttar Pradesh",
    country: "India",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-pink-50",
    lat: 28.5355,
    long: 77.391,
  },
  {
    id: 3,
    name: "Greater Noida",
    label: "Greater Noida, Uttar Pradesh",
    country: "India",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-red-50",
    lat: 28.4744,
    long: 77.504,
  },
  {
    id: 4,
    name: "Delhi",
    label: "Delhi, India",
    country: "India",
    subtitle: "Capital city of India",
    icon: "building",
    iconColor: "bg-blue-50",
    lat: 28.6139,
    long: 77.209,
  },
  {
    id: 5,
    name: "Gurugram",
    label: "Gurugram, Haryana",
    country: "India",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-gray-50",
    lat: 28.4595,
    long: 77.0266,
  },
  {
    id: 6,
    name: "Faridabad",
    label: "Faridabad, Haryana",
    country: "India",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-green-50",
    lat: 28.4089,
    long: 77.3178,
  },
  {
    id: 7,
    name: "Ghaziabad",
    label: "Ghaziabad, Uttar Pradesh",
    country: "India",
    subtitle: "National Capital Region",
    icon: "building",
    iconColor: "bg-indigo-50",
    lat: 28.6692,
    long: 77.4538,
  },
  {
    id: 8,
    name: "Jaipur",
    label: "Jaipur, Rajasthan",
    country: "India",
    subtitle: "Great for a weekend getaway",
    icon: "castle",
    iconColor: "bg-purple-50",
    lat: 26.9124,
    long: 75.7873,
  },
  {
    id: 9,
    name: "Chandigarh",
    label: "Chandigarh",
    country: "India",
    subtitle: "Popular with travellers nearby",
    icon: "building",
    iconColor: "bg-emerald-50",
    lat: 30.7333,
    long: 76.7794,
  },
];
