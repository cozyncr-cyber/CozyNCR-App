// lib/auth.ts
import {
  account,
  DATABASE_ID,
  databases,
  PROFILES_TABLE_ID,
} from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";

export async function sendPasswordRecovery(email: string) {
  const redirectUrl = "https://cozyncr.com/reset-password";

  await account.createRecovery(email, redirectUrl);
}

/**
 * Send email OTP
 */
export async function sendEmailOtp(
  email: string
): Promise<
  { success: true; userId: string } | { success: false; error: string }
> {
  try {
    // 1. Check if a profile with this email already exists in your DB
    const existingProfile = await databases.listDocuments(
      DATABASE_ID,
      PROFILES_TABLE_ID,
      [Query.equal("email", email)]
    );

    if (existingProfile.total > 0) {
      return {
        success: false,
        error: "This email is already registered. Please sign in.",
      };
    }

    // 2. If not found, proceed to send OTP
    const token = await account.createEmailToken(ID.unique(), email);

    return {
      success: true,
      userId: token.userId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send OTP",
    };
  }
}

/**
 * Verify email OTP
 */
export async function verifyEmailOtp(userId: string, otp: string) {
  try {
    const session = await account.createSession(userId, otp);

    return {
      success: true,
      sessionSecret: session.$id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Invalid OTP",
    };
  }
}

/**
 * Complete signup after OTP verification
 */

export async function completeSignup(formData: any) {
  try {
    const user = await account.get();
    if (!user) throw new Error("Session missing. Please verify OTP again.");

    if (!formData.password)
      throw new Error("Password is required to complete signup.");
    console.log("➡️ Step 1: set password");
    await account.updatePassword(formData.password);

    console.log("➡️ Step 2: delete OTP session");
    await account.deleteSession("current");
    console.log("➡️ Step 3: create new normal session");
    const newSession = await account.createEmailPasswordSession({
      email: user.email,
      password: formData.password,
    });

    if (!newSession) throw new Error("Failed to create permanent session.");
    console.log("➡️ Step 4: create profile");
    await databases.createDocument(DATABASE_ID, PROFILES_TABLE_ID, user.$id, {
      name: formData.name,
      email: user.email,
      kycStatus: "unverified",
      role: "host",
      phone: formData.phone || null,
      location: formData.location || null,
      dob: formData.dob || null,
    });

    return { success: true };
  } catch (error: any) {
    console.log("❌ Signup error:", error);
    return {
      success: false,
      error: error.message || "Signup failed",
    };
  }
}

export async function requestAccountDeletion(userId: string) {
  try {
    // 1) mark as deleted in profile
    await databases.updateDocument(DATABASE_ID, PROFILES_TABLE_ID, userId, {
      isDeleted: true,
    });

    // 2) delete all active sessions → disables access immediately
    await account.deleteSessions();

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message ?? "Failed to delete account",
    };
  }
}
