import RazorpayCheckout from "react-native-razorpay";
import {
  functions,
  RAZORPAY_CREATE_ORDER_FUNCTION_ID,
  RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID,
} from "./appwrite";

/**
 * Create Razorpay Order via Appwrite Function
 */
export const createRazorpayOrder = async (
  amount: number,
  bookingId: string
) => {
  const execution = await functions.createExecution(
    RAZORPAY_CREATE_ORDER_FUNCTION_ID,
    JSON.stringify({ amount, bookingId })
  );

  console.log("Create order response:", execution.responseBody);

  if (!execution.responseBody) {
    throw new Error("Empty response from create-order function");
  }

  return JSON.parse(execution.responseBody);
};

/**
 * Open Razorpay Checkout UI
 */ export const openRazorpayCheckout = async (order: any) => {
  try {
    return await RazorpayCheckout.open({
      key: order.key,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "CozyNCR",
      description: "Booking Payment",
      theme: { color: "#000000" },
    });
  } catch (err) {
    console.log(err);
    throw new Error("PAYMENT_CANCELLED");
  }
};

/**
 * Verify payment via Appwrite Function
 */ export const verifyRazorpayPayment = async (paymentResult: any) => {
  const execution = await functions.createExecution(
    RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID,
    JSON.stringify(paymentResult)
  );

  console.log("Verify payment response:", execution.responseBody);

  if (!execution.responseBody) {
    throw new Error("Empty response from verify-payment function");
  }

  return JSON.parse(execution.responseBody);
};

/**
 * One-step helper (recommended)
 */ export const payForBooking = async (amount: number, bookingId: string) => {
  // 1️⃣ Create order
  const order = await createRazorpayOrder(amount, bookingId);

  // 2️⃣ Open checkout
  const paymentResult = await openRazorpayCheckout(order);

  // 3️⃣ Verify payment (FIXED)
  return await verifyRazorpayPayment({
    ...paymentResult,
    bookingId,
  });
};
