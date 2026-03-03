import { account } from "@/lib/appwrite";
import {
  completeSignup,
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/services/auth";
import { useUser } from "@/src/contexts/UserContext";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();
  const user = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    phone: "",
    location: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [dobDate, setDobDate] = useState<Date | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { hydrateAfterSignup } = useUser();

  /* ───────────────────────
     Helpers
  ─────────────────────── */
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: "" });
  };
  const formatDate = (date: Date): string => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const openDobPicker = () => {
    DateTimePickerAndroid.open({
      value: dobDate ?? new Date("2000-01-01"),
      mode: "date",
      maximumDate: new Date(),
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDobDate(selectedDate);
          handleChange("dob", formatDate(selectedDate));
        }
      },
    });
  };
  const isAdult = (dob: string) => {
    const birth = new Date(dob);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!otpVerified) newErrors.otp = "Email verification required";
    if (!formData.phone) newErrors.phone = "Phone is required";

    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be 8+ characters";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ───────────────────────
     OTP
  ─────────────────────── */
  const handleSendOtp = async () => {
    if (!formData.email) {
      setErrors({ email: "Email required" });
      return;
    }

    setLoading(true);
    const result = await sendEmailOtp(formData.email);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      setTempUserId(result.userId);
    } else {
      setErrors({ email: result.error });
    }
  };

  const handleVerifyOtp = async () => {
    if (!tempUserId || !formData.otp) return;

    setLoading(true);
    const result = await verifyEmailOtp(tempUserId, formData.otp);
    setLoading(false);

    if (result.success) {
      setOtpVerified(true);
    } else {
      setErrors({ otp: result.error });
    }
  };

  /* ───────────────────────
     Submit
  ─────────────────────── */
  const handleSubmit = async () => {
    console.log("Start");
    if (!validateForm()) return;

    setLoading(true);
    console.log("Validated");
    const result = await completeSignup(formData);
    console.log("Completed Signup", result);
    setLoading(false);

    if (result.success) {
      await hydrateAfterSignup();
    } else {
      setErrors({ backend: result.error });
    }
  };

  /* ───────────────────────
     Form
  ─────────────────────── */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <KeyboardDismissWrapper>
        <ScrollView
          className="flex-1 bg-gray-100"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="m-8 p-6 rounded-3xl shadow-xl bg-white">
            <Text className="text-3xl font-medium text-gray-900 mb-2">
              Create Account
            </Text>

            <Text className="text-gray-500 text-sm mb-6">Join as a host</Text>

            {/* Name */}
            <Text className="font-medium mb-1">Full Name</Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 px-4 py-3 rounded-xl mb-1 text-black"
              placeholder="John Doe"
              onChangeText={(v) => handleChange("name", v)}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mb-2">{errors.name}</Text>
            )}

            {/* Email */}
            <Text className="font-medium mb-1 mt-3">Email</Text>
            <View className="flex-row gap-2">
              <TextInput
                placeholderTextColor="#9CA3AF"
                className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-black"
                editable={!otpVerified}
                placeholder="email@example.com"
                onChangeText={(v) => handleChange("email", v)}
              />

              {!otpVerified && (
                <TouchableOpacity
                  onPress={handleSendOtp}
                  className="bg-black px-5 rounded-xl justify-center"
                >
                  <Text className="text-white">
                    {otpSent ? "Sent" : "Verify"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* OTP */}
            {otpSent && !otpVerified && (
              <View className="flex-row gap-2 mt-3">
                <TextInput
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-center text-black"
                  placeholder="OTP"
                  onChangeText={(v) => handleChange("otp", v)}
                />

                <TouchableOpacity
                  onPress={handleVerifyOtp}
                  className="bg-black px-6 rounded-xl justify-center"
                >
                  <Text className="text-white">Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
            {errors.otp && (
              <Text className="text-red-500 text-xs mt-1">{errors.otp}</Text>
            )}

            {/* Phone */}
            <Text className="font-medium mt-4 mb-1">Phone</Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 px-4 py-3 rounded-xl text-black"
              placeholder="+91..."
              onChangeText={(v) => handleChange("phone", v)}
            />

            {/* City */}
            <Text className="font-medium mt-4 mb-1">
              City &#40; Optional &#41;
            </Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="bg-gray-100 px-4 py-3 rounded-xl text-black"
              placeholder="Delhi"
              onChangeText={(v) => handleChange("location", v)}
            />

            {/* DOB */}
            <Text className="font-medium mt-4 mb-1 text-black">
              Date of Birth &#40; Optional &#41;
            </Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                className="bg-gray-100 px-4 py-3 rounded-xl outline-none text-black w-full"
              />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  Platform.OS === "android"
                    ? openDobPicker()
                    : setDobPickerVisible(true)
                }
                className="bg-gray-100 px-4 py-3 rounded-xl"
              >
                <Text className="text-black">
                  {formData.dob || "YYYY-MM-DD"}
                </Text>
              </TouchableOpacity>
            )}

            {errors.dob && (
              <Text className="text-red-500 text-xs mt-1">{errors.dob}</Text>
            )}
            {/* Password */}
            <Text className="font-medium mt-4 mb-1">Password</Text>
            <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
              <TextInput
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-4 text-black"
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                onChangeText={(v) => handleChange("password", v)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} />
              </Pressable>
            </View>

            {/* Confirm Password */}
            <Text className="font-medium mt-4 mb-1">Confirm Password</Text>
            <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
              <TextInput
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-4 text-black"
                secureTextEntry={!showConfirmPassword}
                placeholder="••••••••"
                onChangeText={(v) => handleChange("confirmPassword", v)}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={18}
                />
              </Pressable>
            </View>

            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </Text>
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="bg-black py-4 rounded-2xl mt-8 items-center"
            >
              <Text className="text-white font-medium text-lg">
                {loading ? "Loading..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <TouchableOpacity
              onPress={async () => {
                try {
                  await account.deleteSession("current");
                } catch {}
                router.replace("/signin");
              }}
              className="mt-4 items-center"
            >
              <Text className="text-gray-500">
                Already have an account?{" "}
                <Text className="text-black font-medium underline">
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
            {/* CONTINUE AS GUEST */}
            <TouchableOpacity
              onPress={() => router.replace("/")}
              disabled={loading}
              className="mt-3 items-center"
            >
              <Text className="text-gray-600 text-sm underline">
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === "ios" && dobPickerVisible && (
            <DateTimePicker
              value={dobDate ?? new Date("2000-01-01")}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDobDate(selectedDate);
                  handleChange("dob", formatDate(selectedDate));
                }
              }}
            />
          )}
        </ScrollView>
      </KeyboardDismissWrapper>
    </KeyboardAvoidingView>
  );
}

function KeyboardDismissWrapper({ children }: any) {
  if (Platform.OS === "web") return children;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
}
