import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { View, Text } from "react-native";
const Footer = () => {
  return (
    <View className="flex bg-slate-100 justify-between px-4 md:px-8 py-4 rounded-t-md text-sm">
      <View className="flex gap-2">
        <Text className="text-slate-600">&copy; 2025 Cozy NCR</Text>
        <Text className="text-slate-600">Privacy</Text>
        <Text className="text-slate-600">Terms</Text>
        <Text className="text-slate-600">Company Details</Text>
      </View>

      <View className="flex gap-4 ">
        <Entypo name="instagram" size={20} color="gray" />
        <View className="text-slate-600">
          <Feather name="mail" size={20} color="gray" />
        </View>
      </View>
    </View>
  );
};

export default Footer;
