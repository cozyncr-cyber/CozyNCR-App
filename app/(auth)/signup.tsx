import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import {
  sendEmailOtp,
  verifyEmailOtp,
  completeSignup,
} from "@/lib/services/auth";
import Feather from "@expo/vector-icons/Feather";

export default function Signup() {
  const router = useRouter();

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
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ───────────────────────
     Helpers
  ─────────────────────── */
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: "" });
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
    if (!formData.location) newErrors.location = "City is required";
    if (!formData.dob) newErrors.dob = "Date of birth required";
    else if (!isAdult(formData.dob)) newErrors.dob = "You must be at least 18";

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
    if (!validateForm()) return;

    setLoading(true);
    const result = await completeSignup(formData);
    setLoading(false);

    if (result.success) {
      setSignupSuccess(true);
    } else {
      setErrors({ backend: result.error });
    }
  };

  /* ───────────────────────
     Success Screen
  ─────────────────────── */
  if (signupSuccess) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center p-6">
        <View className="bg-white rounded-3xl p-8 w-full max-w-md items-center">
          <Feather name="check-circle" size={48} color="green" />
          <Text className="text-2xl font-bold mt-4">Account Created</Text>
          <Text className="text-gray-500 text-center mt-2">
            Your account has been created successfully.
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/signin")}
            className="bg-black py-4 rounded-xl mt-6 w-full items-center"
          >
            <Text className="text-white font-bold text-lg">Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ───────────────────────
     Form
  ─────────────────────── */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-gray-100"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="m-8 p-4 rounded-xl shadow-sm py-8 bg-white">
            <Text className="text-3xl font-bold mb-2">Create Account</Text>
            <Text className="text-gray-500 mb-6">Join as a host</Text>

            {/* Name */}
            <Text className="font-medium mb-1">Full Name</Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-500 bg-white p-4 rounded-xl mb-1 text-black"
              placeholder="John Doe"
              onChangeText={(v) => handleChange("name", v)}
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mb-2">{errors.name}</Text>
            )}

            {/* Email */}
            <Text className="font-medium mb-1">Email</Text>
            <View className="flex-row gap-2">
              <TextInput
                placeholderTextColor="#9CA3AF"
                className="border border-zinc-500 flex-1 bg-white p-4 rounded-xl text-black"
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
                  className="flex-1 border border-zinc-500  bg-white p-4 rounded-xl text-center text-black"
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
              className="border border-zinc-500 bg-white p-4 rounded-xl text-black"
              placeholder="+91..."
              onChangeText={(v) => handleChange("phone", v)}
            />

            {/* City */}
            <Text className="font-medium mt-4 mb-1">City</Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-500 bg-white p-4 rounded-xl text-black"
              placeholder="Delhi"
              onChangeText={(v) => handleChange("location", v)}
            />

            {/* DOB */}
            <Text className="font-medium mt-4 mb-1 text-black">
              Date of Birth
            </Text>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="border border-zinc-500 bg-white p-4 rounded-xl text-black"
              placeholder="YYYY-MM-DD"
              onChangeText={(v) => handleChange("dob", v)}
            />
            {errors.dob && (
              <Text className="text-red-500 text-xs mt-1">{errors.dob}</Text>
            )}

            {/* Password */}
            <Text className="font-medium mt-4 mb-1">Password</Text>
            <View className="bg-white border border-zinc-500  rounded-xl flex-row items-center px-4 text-black">
              <TextInput
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-black py-4"
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
            <View className="bg-white border border-zinc-500  rounded-xl flex-row items-center px-4">
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
              className="bg-black py-4 rounded-xl mt-8 items-center"
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Loading..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <TouchableOpacity
              onPress={() => router.replace("/signin")}
              className="mt-4 items-center"
            >
              <Text className="text-gray-500">
                Already have an account?{" "}
                <Text className="text-black font-bold underline">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
