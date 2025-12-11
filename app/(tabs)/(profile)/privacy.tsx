import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

type SectionContentBlock = {
  subtitle?: string;
  text?: string;
  items?: string[];
};

type SectionData = {
  id: number;
  title: string;
  content: SectionContentBlock[];
};

type SectionProps = {
  section: SectionData;
  isExpanded: boolean;
  onToggle: (id: number) => void;
};

type PrivacyPolicyProps = {
  onBackPress?: () => void; // Optional: hook this into navigation
};

const sections: SectionData[] = [
  {
    id: 1,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information Provided by Users",
        items: [
          "Full name",
          "Phone number",
          "Email address",
          "Gender (optional)",
          "Date of birth (optional)",
          "Identity verification documents (PAN, Aadhaar, Passport, Driving License)",
          "Profile photos",
        ],
      },
      {
        subtitle: "Booking & Host Information",
        items: [
          "Property details",
          "Photos and videos of listings",
          "Pricing and availability",
          "Guest reviews",
          "Booking dates and history",
        ],
      },
      {
        subtitle: "Payment & Financial Information",
        items: [
          "UPI ID",
          "Bank account details (only for hosts)",
          "Payment history",
          "Transaction IDs",
          "Note: We do NOT store full card numbers. All payments are handled by secure third-party gateways.",
        ],
      },
      {
        subtitle: "Device & Technical Data",
        items: [
          "IP address",
          "Device model",
          "OS version",
          "App version",
          "Device identifiers",
          "Crash logs",
          "Cookies and tracking technologies",
        ],
      },
      {
        subtitle: "Location Data",
        items: [
          "Approximate or precise location (only with user permission)",
          "Location of listed properties",
        ],
      },
      {
        subtitle: "Automatically Collected Usage Data",
        items: [
          "Pages viewed",
          "Buttons clicked",
          "Search history",
          "Time spent on pages",
          "Referring URLs",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "How We Use Your Information",
    content: [
      {
        items: [
          "Provide, maintain & improve the Platform",
          "Facilitate bookings between guests and hosts",
          "Verify user identity",
          "Prevent fraud, scams & illegal activities",
          "Process payments & refunds",
          "Customize user experience",
          "Provide customer support",
          "Send important notifications & updates",
          "Comply with law enforcement and regulatory requirements",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Legal Bases for Processing",
    content: [
      {
        items: [
          "User Consent",
          "Performance of Contract (providing bookings)",
          "Legitimate Interests (security, fraud prevention, analytics)",
          "Legal Obligations (tax, verification, criminal complaints)",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Sharing of Information",
    content: [
      {
        subtitle: "Verified Third-Party Service Providers",
        items: [
          "Payment processors (UPI, Razorpay, Stripe, etc.)",
          "Cloud hosting (AWS, Google Cloud, etc.)",
          "SMS/Email OTP service providers",
          "Analytics partners",
        ],
      },
      {
        subtitle: "Hosts & Guests",
        items: ["To complete bookings"],
      },
      {
        subtitle: "Law Enforcement",
        items: [
          "When legally required or in cases of: Fraud, Abuse, Criminal activity, Court orders",
        ],
      },
      {
        subtitle: "Business Transfers",
        items: [
          "If CozyNCR is acquired or merged, user data may be transferred securely.",
        ],
      },
      {
        items: ["We DO NOT sell user data to third parties."],
      },
    ],
  },
  {
    id: 5,
    title: "Data Security Measures",
    content: [
      {
        items: [
          "AES-256 encryption",
          "HTTPS/SSL security",
          "Secure cloud storage",
          "Limited employee access",
          "Two-step admin verification",
          "Regular security audits",
          "Real-time fraud detection systems",
          "No method of transmission is 100% secure, but we follow global best practices to protect your data.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Data Retention",
    content: [
      {
        text: "We keep user data only as long as necessary for:",
        items: [
          "Providing services",
          "Legal compliance",
          "Audit / tax requirements",
          "Security & dispute resolution",
          "Users may request deletion anytime (unless required by law to retain).",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "International Data Transfers",
    content: [
      {
        text: "Your data may be transferred to servers located outside India (e.g., Singapore, US, EU) depending on where our service providers are hosted. We ensure that all transfers comply with global privacy regulations and secure-transfer agreements.",
      },
    ],
  },
  {
    id: 8,
    title: "User Rights",
    content: [
      {
        text: "You may:",
        items: [
          "Access your data",
          "Correct inaccurate information",
          "Request deletion",
          "Request restriction of processing",
          "Withdraw consent",
          "Request a copy of your data",
          "Requests can be made via ncrcozy@gmail.com",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Cookies & Tracking",
    content: [
      {
        text: "We use cookies and similar technologies for:",
        items: [
          "Authentication",
          "Security",
          "Analytics",
          "Personalization",
          "Improving app performance",
          "Users may disable cookies, but some features may not function properly.",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Children's Privacy",
    content: [
      {
        text: "Our Platform is not intended for users under 18. We do not knowingly collect data from minors.",
      },
    ],
  },
  {
    id: 11,
    title: "Third-Party Links",
    content: [
      {
        text: "CozyNCR may contain links to external websites. We are not responsible for their content or privacy practices.",
      },
    ],
  },
  {
    id: 12,
    title: "Fraud Prevention & Safety",
    content: [
      {
        text: "We may use automated systems and manual checks to:",
        items: [
          "Detect suspicious behavior",
          "Block fraudulent users",
          "Verify identity documents",
          "Track illegal activities",
          "Fraudulent users may be permanently barred and reported to authorities.",
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Notifications & Communication",
    content: [
      {
        text: "We may send:",
        items: [
          "Transactional SMS",
          "OTPs",
          "Security alerts",
          "Policy updates",
          "Promotional messages (with opt-out option)",
        ],
      },
    ],
  },
  {
    id: 14,
    title: "Dispute Resolution",
    content: [
      {
        text: "All disputes will be handled under the jurisdiction of courts in Noida, Uttar Pradesh.",
      },
    ],
  },
  {
    id: 15,
    title: "Changes to This Policy",
    content: [
      {
        text: "We may update this Privacy Policy from time to time. Continued use of the Platform after updates means acceptance of the new terms.",
      },
    ],
  },
];

const Section: React.FC<SectionProps> = ({ section, isExpanded, onToggle }) => {
  return (
    <View className="border-b border-gray-200">
      <Pressable
        onPress={() => onToggle(section.id)}
        className="w-full flex-row items-center justify-between py-4"
      >
        <Text className="text-base font-semibold text-gray-900">
          {section.title}
        </Text>
        {isExpanded ? (
          <Entypo name="chevron-up" size={24} color="black" />
        ) : (
          <Entypo name="chevron-down" size={24} color="black" />
        )}
      </Pressable>

      {isExpanded && (
        <View className="pb-4">
          {section.content.map((block, idx) => (
            <View key={idx} className="mt-2">
              {block.subtitle && (
                <Text className="font-semibold text-gray-900 mb-2">
                  {block.subtitle}
                </Text>
              )}
              {block.text && (
                <Text className="mb-2 text-sm text-gray-700">{block.text}</Text>
              )}
              {block.items && (
                <View className="ml-4">
                  {block.items.map((item, i) => (
                    <View key={i} className="flex-row gap-2 mb-1.5">
                      <Text className="text-gray-400 mt-0.5">•</Text>
                      <Text className="text-sm text-gray-700 flex-1">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBackPress }) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleMailPress = () => {
    Linking.openURL("mailto:ncrcozy@gmail.com").catch(() => {
      // Optionally handle error
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Company Info */}
        <View className="bg-gray-50 border-b border-gray-200 px-6 py-6">
          <Text className="text-2xl font-bold text-gray-900 mb-3">CozyNCR</Text>
          <View>
            <Text className="font-semibold text-gray-900 text-sm">
              Owners: Sagar Soni &amp; Shreyansh Gupta
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-sm text-gray-700">
            CozyNCR (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
            committed to protecting the privacy of individuals who use our
            mobile application, website, and related services (collectively, the
            &quot;Platform&quot;). This Privacy Policy explains how we collect,
            use, store, protect, share, and process your personal information.
          </Text>
          <Text className="text-sm text-gray-700 mt-4">
            By accessing or using CozyNCR, you agree to the collection and use
            of your information in accordance with this Privacy Policy.
          </Text>
        </View>

        {/* Sections */}
        <View className="px-6">
          {sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              isExpanded={!!expandedSections[section.id]}
              onToggle={toggleSection}
            />
          ))}
        </View>

        {/* Grievance Officer */}
        <View className="px-6 py-6 bg-gray-50 border-t border-gray-200 mt-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Grievance Officer
          </Text>
          <Text className="text-sm text-gray-700 mb-3">
            Required by Indian Law
          </Text>
          <View>
            <Pressable
              className="flex-row items-center mb-2"
              onPress={handleMailPress}
            >
              <Entypo name="mail" size={24} color="#4B5563" />
              <Text className="text-sm text-blue-600 underline ml-2">
                ncrcozy@gmail.com
              </Text>
            </Pressable>
            <View className="flex-row items-center mb-2">
              <Entypo name="location-pin" size={24} color="#4B5563" />
              <Text className="text-sm text-gray-700 ml-2">
                Noida, Uttar Pradesh
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 py-8 items-center">
          <Text className="text-xs text-gray-500">
            Last Updated: December 2025
          </Text>
          <Text className="mt-2 text-xs text-gray-500">
            © 2025 CozyNCR. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
