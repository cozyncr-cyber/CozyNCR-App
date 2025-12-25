import React from "react";
import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import {
  Mail,
  MessageCircle,
  FileText,
  AlertCircle,
} from "lucide-react-native";
import { Link } from "expo-router";

type SupportOption = {
  id: number;
  title: string;
  subtitle: string;
  email?: string;
  phone?: string;
  icon: any;
  iconColor: string;
  action?: "email" | "whatsapp" | "call";
  wa?: string;
};

type QuickLink = {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  link: any;
};

const supportOptions: SupportOption[] = [
  {
    id: 1,
    title: "Email Support",
    subtitle: "We'll respond within 24 hours",
    email: "cozyncr@gmail.com",
    icon: Mail,
    iconColor: "bg-blue-50 text-blue-600",
    action: "email",
  },
  {
    id: 2,
    title: "WhatsApp Support",
    subtitle: "Chat with us instantly",
    phone: "",
    icon: MessageCircle,
    iconColor: "bg-green-50 text-green-600",
    action: "whatsapp",
    wa: "7827521858",
  },
];

const quickLinks: QuickLink[] = [
  {
    id: 1,
    title: "Terms & Conditions",
    subtitle: "Read our service terms",
    icon: FileText,
    iconColor: "bg-gray-50 text-gray-600",
    link: "/(tabs)/(profile)/terms",
  },
  {
    id: 2,
    title: "Privacy Policy",
    subtitle: "Read our privacy policy",
    icon: FileText,
    iconColor: "bg-blue-50 text-blue-600",
    link: "/(tabs)/(profile)/privacy",
  },
];

export default function CustomerSupport() {
  const handleAction = (option: SupportOption) => {
    switch (option.action) {
      case "email":
        Linking.openURL(`mailto:${option.email}`);
        break;
      case "whatsapp":
        Linking.openURL(`https://wa.me/${option.wa?.replace(/\s/g, "")}`);
        break;
      case "call":
        Linking.openURL(`tel:${option.phone?.replace(/\s/g, "")}`);
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* Hero Section */}
        <View className="px-4 py-6 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            How can we help you?
          </Text>
          <Text className="text-sm text-gray-600">
            Choose the best way to reach us
          </Text>
        </View>

        {/* Contact Options */}
        <View className="px-4 py-6">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Contact us
          </Text>

          <View className="space-y-3">
            {supportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleAction(option)}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-4 active:border-gray-900"
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${option.iconColor}`}
                    >
                      <Icon size={24} />
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {option.title}
                      </Text>
                      <Text className="text-sm text-gray-600 mb-1">
                        {option.subtitle}
                      </Text>

                      {option.email && (
                        <Text className="text-sm font-medium text-blue-600">
                          {option.email}
                        </Text>
                      )}

                      {option.phone && !option.email && (
                        <Text className="text-sm font-medium text-gray-700">
                          {option.phone}
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Quick Links */}
        <View className="px-4 py-6 bg-gray-50">
          <Text className="text-base font-semibold text-gray-900 mb-4">
            Quick links
          </Text>

          <View className="space-y-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  href={link.link}
                  key={link.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 active:bg-gray-100"
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${link.iconColor}`}
                    >
                      <Icon size={24} />
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-0.5">
                        {link.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {link.subtitle}
                      </Text>
                    </View>
                  </View>
                </Link>
              );
            })}
          </View>
        </View>

        {/* Company Info */}
        <View className="px-4 py-6 border-t border-gray-200">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            CozyNCR
          </Text>

          <View className="space-y-2">
            <Text className="text-sm text-gray-600">
              Owned by: Sagar Soni & Shreyansh Gupta
            </Text>
            <Text className="text-sm text-gray-600">
              Location: Noida, Uttar Pradesh, India
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
