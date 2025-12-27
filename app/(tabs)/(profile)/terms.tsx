import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
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

type TermsAndConditionsProps = {
  onBackPress?: () => void; // Optional: hook this into navigation if you add a header/back button later
};

const sections: SectionData[] = [
  {
    id: 1,
    title: "Eligibility",
    content: [
      {
        items: [
          "Users must be 18+ years.",
          "Government-issued ID verification is mandatory for both Hosts & Guests.",
          "Users must provide true, accurate, and updated information.",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Booking & Use of Property",
    content: [
      {
        items: [
          "Guests must follow all house rules set by the Host.",
          "Maximum guest limit must be followed.",
          "Parties, loud music, gatherings, illegal activities, or events are strictly prohibited unless explicitly allowed by the Host in writing.",
          "Guests must respect the property, neighborhood, and local laws.",
          "The App is not responsible for police complaints arising due to guest behavior.",
          "All bookings made through the App are subject to availability.",
          "A booking is confirmed only after successful payment and confirmation notification.",
          "If the host refuses to provide the booked flat, an alternative flat of the same price will be arranged at a nearby location. If an alternative flat is not available, a full refund will be credited within three (3) working days.",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Host Responsibilities",
    content: [
      {
        items: [
          "Host must list accurate property details, images, rules, pricing, and availability.",
          "Host must ensure safety—basic cleanliness, functional locks, lighting, and secure premises.",
          "Host must follow local regulations for renting or short-term stays.",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Guest Responsibilities",
    content: [
      {
        items: [
          "Guest must maintain hygiene and handle property with care.",
          "Guest must not conduct any illegal activity such as drugs, gambling, prostitution, or violence.",
          "Damage caused by the Guest must be compensated directly to the Host.",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Verification & Security",
    content: [
      {
        items: [
          "All users must undergo ID verification (Aadhaar, Passport, Driving License, etc.).",
          "The App may conduct random checks to ensure account authenticity.",
          "The App may report suspicious or illegal behavior to authorities.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Payments",
    content: [
      {
        items: [
          "All payments must be completed through approved payment methods in the App.",
          "Cozy NCR is not responsible for failed transactions or delays caused by banks, UPI, or gateways.",
          "Payments must be made through the App’s supported payment methods.",
          "We are not responsible for payment failures caused by third-party payment providers.",
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Cancellations & Refunds",
    content: [
      {
        items: [
          "Cancellation and refund policies are controlled by the Host.",
          "The App does not guarantee refunds unless the Host approves.",
          "Any dispute regarding refund must be resolved directly between Host & Guest.",
          "Any applicable refunds will be processed according to the hotel’s cancellation policy.",
          "No-show bookings may be charged in full.",
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Pricing & Fees",
    content: [
      {
        items: [
          "Hosts decide pricing.",
          "Cozy NCR may charge service fees, platform fees, or taxes.",
          "GST will be paid by the App as per applicable laws.",
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Insurance, Damage & Liability",
    content: [
      {
        subtitle: "9.1 General Liability",
        text: "Cozy NCR is not responsible for any of the following:",
        items: [
          "Property damage",
          "Loss of belongings",
          "Theft",
          "Injuries",
          "Accidents",
          "Fights between Guests & Hosts",
          "Misconduct, negligence, or illegal activity by any user",
          "Misrepresentation or fake property details uploaded by Hosts",
        ],
      },
      {
        subtitle: "9.2 Drunk, Unsafe, or Irresponsible Behavior",
        text: "Cozy NCR is not responsible for incidents caused by:",
        items: [
          "Drunk behavior",
          "Jumping from balcony/terrace",
          "Self-harm",
          "Accidental falls",
          "Misuse of property",
          "Reckless acts",
        ],
      },
      {
        subtitle: "9.3 Death Insurance Policy",
        text: "In case of death caused by an accidental incident, the App will provide:",
        items: [
          "₹10,000 (Ten Thousand Rupees) as maximum insurance coverage.",
          "This is the only insurance provided by Cozy NCR.",
          "The App will NOT pay anything for injury, medical treatment, property damage, emotional loss, or legal claims.",
          "This amount is final and non-negotiable.",
        ],
      },
    ],
  },
  {
    id: 10,
    title: "Property Damage",
    content: [
      {
        items: [
          "Any damage caused by Guest must be settled with the Host.",
          "Cozy NCR is not part of property damage settlements.",
          "Cozy NCR will not pay any amount for property repair.",
        ],
      },
    ],
  },
  {
    id: 11,
    title: "Safety & Emergency Protocol",
    content: [
      {
        items: [
          "Guests must follow emergency instructions provided by the Host.",
          "In case of fire, electrical faults, water leaks, or structural damage, contact local authorities immediately.",
          "The App does not guarantee on-ground emergency assistance.",
        ],
      },
    ],
  },
  {
    id: 12,
    title: "Illegal Activities",
    content: [
      {
        text: "The following are strictly prohibited:",
        items: [
          "Drugs or narcotics",
          "Prostitution",
          "Weapon usage",
          "Gambling",
          "Violence",
          "Trespassing",
          "Property misuse",
          "Cozy NCR may suspend the account and inform authorities in such cases.",
        ],
      },
    ],
  },
  {
    id: 13,
    title: "Police & Legal Compliance",
    content: [
      {
        items: [
          "Hosts and Guests must comply with local police registration rules (if applicable).",
          "Cozy NCR is not responsible for police action due to noise complaints, parties, illegal acts, unregistered stays, or overcrowding.",
        ],
      },
    ],
  },
  {
    id: 14,
    title: "User Data & Privacy",
    content: [
      {
        items: [
          "Cozy NCR collects necessary data for account creation, verification, and booking.",
          "All data is stored securely and used only for platform operations.",
          "Users may request data deletion as per privacy laws.",
        ],
      },
    ],
  },
  {
    id: 15,
    title: "Platform Conduct",
    content: [
      {
        items: [
          "No user may harass, threaten, or abuse another user.",
          "Fake reviews, misleading listings, scams, or fraud will lead to permanent ban.",
        ],
      },
    ],
  },
  {
    id: 16,
    title: "Dispute Resolution",
    content: [
      {
        items: [
          "Any dispute between Host & Guest should be resolved directly.",
          "Cozy NCR is not a party to personal disputes.",
          "All legal disputes with the App will be resolved only through binding arbitration, not through court trials.",
        ],
      },
    ],
  },
  {
    id: 17,
    title: "App Suspension & Termination",
    content: [
      {
        items: [
          "Cozy NCR may suspend or terminate accounts for violations.",
          "Once suspended, users cannot create new accounts without approval.",
        ],
      },
    ],
  },
  {
    id: 18,
    title: "No Guarantee of Availability",
    content: [
      {
        items: [
          "Listings, availability, and pricing are controlled by Hosts.",
          "The App does not guarantee uninterrupted or error-free service.",
        ],
      },
    ],
  },
  {
    id: 19,
    title: "Modification of T&C",
    content: [
      {
        text: "Cozy NCR may update these Terms & Conditions at any time. Continued use of the platform means acceptance of updated Terms.",
      },
    ],
  },
  {
    id: 20,
    title: "Acceptance",
    content: [
      {
        text: "By using Cozy NCR, you agree that:",
        items: [
          "You have read and understood these Terms & Conditions.",
          "You accept all clauses, responsibilities, and limitations of liability.",
        ],
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

const TermsAndConditions: React.FC<TermsAndConditionsProps> = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Intro */}
        <View className="px-6 py-6 border-b border-gray-200">
          <Text className="text-sm text-gray-700">
            Welcome to Cozy NCR (“App”, “We”, “Us”). By using our platform,
            services, website, or mobile app, you (“User”, “Guest”, “Host”)
            agree to the following Terms &amp; Conditions.
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

        {/* Footer */}
        <View className="px-6 py-8 items-center">
          <Text className="text-xs text-gray-500 text-center">
            By continuing to use Cozy NCR, you acknowledge that you have read,
            understood, and agree to be bound by these Terms &amp; Conditions.
          </Text>
          <Text className="mt-2 text-xs text-gray-500">
            © {new Date().getFullYear()} Cozy NCR. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;
