"use dom";
import "../../src/global.css";
import { Pressable, ScrollView } from "react-native";
import { useUser } from "@/src/contexts/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

export default function Profile() {
  const user = useUser();
  return (
    <ScrollView>
      <div className="min-h-screen p-4 flex flex-col gap-6">
        <h3 className="text-2xl font-medium">Profile</h3>
        {/* Cards */}
        <div className="flex flex-col gap-2">
          {/* CARD A */}
          <div className="flex-1 relative">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden py-4">
              {/* Image */}
              <div className="relative w-28 aspect-square rounded-full overflow-hidden mx-auto bg-orange-300">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-semibold text-gray-900">
                    Natasha Romanoff
                  </p>
                  <p className="text-gray-600 text-sm">Guest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col  border-b border-zinc-300">
          <div className="w-full h-12 text-zinc-700 flex items-center gap-4 px-2">
            <Ionicons name="settings-outline" size={24} color="#3f3f46" />
            <p className="w-full">Settings</p>
            <Entypo name="chevron-thin-right" size={16} color="#3f3f46" />
          </div>
          <Pressable onPress={() => user.logout()}>
            <div className="w-full h-12 text-zinc-700 flex items-center gap-4 px-2">
              <Ionicons name="exit-outline" size={24} color="#3f3f46" />
              <p>Logout</p>
            </div>
          </Pressable>
        </div>
      </div>
    </ScrollView>
  );
}
