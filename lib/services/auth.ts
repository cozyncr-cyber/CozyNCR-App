// lib/auth.ts
import {
  account,
  databases,
  DATABASE_ID,
  PROFILES_TABLE_ID,
} from "@/lib/appwrite";
import { ID } from "react-native-appwrite";

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
    const token = await account.createEmailToken(ID.unique(), email);

    return {
      success: true,
      userId: token.userId!, // ✅ Appwrite guarantees this
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

    await databases.createDocument(
      DATABASE_ID,
      PROFILES_TABLE_ID,
      ID.unique(),
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        kycStatus: "unverified",
        dob: formData.dob,
        role: "host",
      }
    );

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Signup failed",
    };
  }
}
