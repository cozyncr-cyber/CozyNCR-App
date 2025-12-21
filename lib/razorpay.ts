import { functions, RAZORPAY_CREATE_ORDER_FUNCTION_ID } from "./appwrite";
import { router } from "expo-router";
type RazorpayOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
};

export const createRazorpayOrder = async (
  amount: number,
  bookingId: string
): Promise<RazorpayOrderResponse> => {
  const execution = await functions.createExecution(
    RAZORPAY_CREATE_ORDER_FUNCTION_ID,
    JSON.stringify({ amount, bookingId })
  );

  if (!execution.responseBody) {
    throw new Error("Empty response from create-order function");
  }

  const data = JSON.parse(execution.responseBody);

  // 🚨 Hard validation (prevents silent Razorpay failure)
  if (!data.orderId || !data.amount || !data.key) {
    throw new Error("Invalid create-order response");
  }

  return data;
};
export const payForBooking = async (amount: number, bookingId: string) => {
  // amount MUST be in paise
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Amount must be a positive integer (paise)");
  }

  const order = await createRazorpayOrder(amount, bookingId);

  console.log("Razorpay order:", order);

  router.push({
    pathname: "/property/razorpay-webview",
    params: {
      orderId: order.orderId,
      amount: String(order.amount * 100), // paise
      razorpayKey: order.key, // ✅ guaranteed
      bookingId,
    },
  });
};
