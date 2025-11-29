"use dom";
import "../../src/global.css";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../src/contexts/UserContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
export default function SignIn() {
  const { login } = useUser();

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
      // TODO: implement Appwrite recovery
      setRecoverySent(true);
      return;
    }
    console.log("Submitting login for:", email);

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

  return (
    <div className="items-center justify-center p-6 w-full h-full bg-gray-100">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        {/* HEADER */}
        <p className="text-3xl font-medium text-gray-900 mb-2">
          {view === "signin" ? "Sign In" : "Reset Password"}
        </p>

        <p className="text-gray-500 text-sm mb-6">
          {view === "signin"
            ? "Welcome to CozyNCR! Please sign in to continue."
            : "Enter your email to receive a recovery link"}
        </p>

        {/* RECOVERY SENT */}
        {view === "forgot_password" && recoverySent ? (
          <div className="items-center">
            <p className="text-lg font-medium mt-4">Check your email</p>
            <div className="text-gray-500 text-center mt-2">
              We&apos;ve sent a recovery link to{" "}
              <span className="font-medium">{email}</span>
            </div>

            <TouchableOpacity onPress={toggleView} className="mt-6">
              <p className="font-medium underline text-black">
                Back to Sign In
              </p>
            </TouchableOpacity>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* GLOBAL ERROR */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* EMAIL */}
            <p className="font-medium mb-1">Email</p>
            <div className="relative mb-3 gap-4 flex items-center bg-gray-100 px-4 py-3 rounded-xl">
              <Feather name="mail" size={20} color="gray" />
              <input
                className="w-full outline-none"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            {/* PASSWORD (ONLY SIGNIN) */}
            {view === "signin" && (
              <>
                <p className="font-medium mb-1 mt-4">Password</p>
                <div className="relative mb-3 gap-4 flex items-center bg-gray-100 px-4 py-3 rounded-xl">
                  <Feather name="lock" size={20} color="gray" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full outline-none"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <div>
                        <Feather name="eye" size={20} color="gray" />
                      </div>
                    ) : (
                      <div>
                        <Feather name="eye-off" size={20} color="gray" />
                      </div>
                    )}
                  </TouchableOpacity>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
                <div className="self-end">
                  <TouchableOpacity onPress={toggleView} className="">
                    <p className="text-xs font-medium text-purple-600">
                      Forgot Password?
                    </p>
                  </TouchableOpacity>
                </div>
              </>
            )}

            {/* SUBMIT BUTTON */}
            <TouchableOpacity disabled={isLoading} onPress={handleSubmit}>
              <p className="text-black font-medium text-lg"></p>
              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-black text-white py-3.5 rounded-2xl font-medium text-lg hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Loading..."
                  : view === "signin"
                  ? "Sign In"
                  : "Send Recovery Link"}
                <FontAwesome6 name="arrow-right-long" size={16} color="white" />
              </button>
            </TouchableOpacity>

            {/* FOOTER */}
            <div className="self-center mt-4">
              {view === "signin" ? (
                <div className="text-gray-500 text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="font-medium underline text-black"
                  >
                    Sign Up
                  </a>
                </div>
              ) : (
                <TouchableOpacity
                  onPress={toggleView}
                  className="flex-row items-center mt-2"
                >
                  <p className="ml-2 text-sm text-gray-500">Back to Login</p>
                </TouchableOpacity>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
