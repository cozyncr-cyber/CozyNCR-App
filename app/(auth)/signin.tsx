import { sendPasswordRecovery } from "@/lib/services/auth";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
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
import { useUser } from "../../src/contexts/UserContext";
export default function SignIn() {
  const { login } = useUser();
  const router = useRouter();

  const [view, setView] = useState<"signin" | "forgot_password">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const toggleView = () => {
    setView(view === "signin" ? "forgot_password" : "signin");
    setErrors({});
    setRecoverySent(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    if (view === "signin" && !password)
      newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (view === "forgot_password") {
      try {
        setIsLoading(true);
        await sendPasswordRecovery(email);
        setRecoverySent(true);
      } catch (err: any) {
        setErrors({
          general: err?.message || "Failed to send recovery email",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      console.log("Loading");
      await login(email, password); // ⬅️ Already handled in context
    } catch (err: any) {
      setErrors({ general: err?.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };
  const { isLoggedIn, isInitializing } = useUser();

  useEffect(() => {
    if (!isInitializing && isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, isInitializing]);

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
          <Image
            source={require("../../components/SVGs/cozncr_t.png")} // 👈 your image path
            style={{
              width: 220,
              height: 120,
              resizeMode: "contain",
            }}
            className="mx-auto mt-8 "
          />

          <View className="items-center justify-center p-6 w-full h-full bg-gray-100">
            <View className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
              {/* HEADER */}
              <Text className="text-3xl font-medium text-gray-900 mb-2">
                {view === "signin" ? "Sign In" : "Reset Password"}
              </Text>

              <Text className="text-gray-500 text-sm mb-6">
                {view === "signin"
                  ? "Welcome to CozyNCR! Please sign in to continue."
                  : "Enter your email to receive a recovery link"}
              </Text>

              {/* RECOVERY SENT */}
              {view === "forgot_password" && recoverySent ? (
                <View className="items-center">
                  <Text className="text-lg font-medium mt-4">
                    Check your email
                  </Text>
                  <View className="text-gray-500 mt-2">
                    <Text className="text-center w-full">
                      We&apos;ve sent a recovery link to{" "}
                      <Text className="font-medium">{email}</Text>
                    </Text>
                  </View>

                  <TouchableOpacity onPress={toggleView} className="mt-6">
                    <Text className="font-medium underline text-black">
                      Back to Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex flex-col">
                  {/* GLOBAL ERROR */}
                  {errors.general && (
                    <View className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                      <Text className="text-red-600 text-sm">
                        {errors.general}
                      </Text>
                    </View>
                  )}

                  {/* EMAIL */}
                  <Text className="font-medium mb-1">Email</Text>
                  <View className="relative mb-3 gap-4 flex flex-row items-center bg-gray-100 px-4 py-3 rounded-xl">
                    <Feather name="mail" size={20} color="gray" />
                    <TextInput
                      placeholderTextColor="#9CA3AF"
                      className="w-full outline-none bg-transparent text-black"
                      placeholder="john@example.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />
                  </View>
                  {errors.email && (
                    <Text className="text-red-500 text-xs">{errors.email}</Text>
                  )}

                  {/* PASSWORD (ONLY SIGNIN) */}
                  {view === "signin" && (
                    <>
                      <Text className="font-medium mb-1 mt-4">Password</Text>
                      <View className="mb-3 flex-row items-center bg-gray-100 px-4 py-3 rounded-xl">
                        <Feather name="lock" size={20} color="gray" />

                        <TextInput
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showPassword}
                          className="flex-1 mx-3 bg-transparent text-black"
                          placeholder="Enter Password"
                          value={password}
                          onChangeText={setPassword}
                        />

                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Feather
                            name={showPassword ? "eye" : "eye-off"}
                            size={20}
                            color="gray"
                          />
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text className="text-red-500 text-xs">
                          {errors.password}
                        </Text>
                      )}
                      <View className="self-end">
                        <TouchableOpacity onPress={toggleView} className="">
                          <Text className="text-xs font-medium text-purple-600">
                            Forgot Password?
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {/* SUBMIT BUTTON */}
                  <TouchableOpacity disabled={isLoading} onPress={handleSubmit}>
                    <Pressable
                      onPress={handleSubmit}
                      className="w-full mt-6 bg-black text-white py-3.5 rounded-2xl font-medium text-lg hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex flex-row items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Text className="text-white text-lg font-medium">
                        {isLoading
                          ? "Loading"
                          : view === "signin"
                            ? "Sign In"
                            : "Send Recovery Link"}
                      </Text>
                      <FontAwesome6
                        name="arrow-right-long"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                  </TouchableOpacity>

                  {/* FOOTER */}
                  <View className="self-center mt-4">
                    {view === "signin" ? (
                      <View className="text-gray-500 text-sm">
                        <Text>
                          Don&apos;t have an account?{" "}
                          <Link
                            href="/signup"
                            className="font-medium underline text-black"
                          >
                            Sign Up
                          </Link>
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={toggleView}
                        className="flex-row items-center mt-2"
                      >
                        <Text className="ml-2 text-sm text-gray-500">
                          Back to Login
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* CONTINUE AS GUEST */}
                  <View className="items-center mt-4">
                    <TouchableOpacity
                      onPress={() => router.replace("/")}
                      disabled={isLoading}
                    >
                      <Text className="text-gray-600 text-sm underline">
                        Continue as Guest
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
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
