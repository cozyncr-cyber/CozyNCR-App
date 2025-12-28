import { View, Text } from "react-native";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AccountSettings() {
  return (
    <View className="flex-1 p-4 pt-0 gap-2 bg-white">
      <Link href="/account/editProfile">
        <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2  ">
          <MaterialCommunityIcons name="account" size={24} color="#3f3f46" />
          <Text className="text-lg">Profile Information</Text>
        </View>
      </Link>
      <Link href="/account/changeEmail">
        <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2 ">
          <Fontisto name="email" size={24} color="#3f3f46" />
          <Text className="text-lg">Change Email</Text>
        </View>
      </Link>
      <Link href="/account/changePassword">
        <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2 ">
          <MaterialIcons name="password" size={24} color="#3f3f46" />
          <Text className="text-lg">Change Password</Text>
        </View>
      </Link>
      <Link href="/account/requestPersonalData">
        <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2">
          <FontAwesome6 name="circle-question" size={24} color="#3f3f46" />
          <Text className="text-lg">Request personal data</Text>
        </View>
      </Link>
      <Link href="/account/deleteAccount">
        <View className="w-full h-14 text-zinc-700 flex flex-row items-center gap-4 px-2  border-b border-zinc-300">
          <MaterialIcons name="delete-outline" size={24} color="#3f3f46" />
          <Text className="text-lg">Delete Account</Text>
        </View>
      </Link>
    </View>
  );
}
