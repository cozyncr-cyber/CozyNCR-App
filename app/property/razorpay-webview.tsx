import React, { useEffect, useRef } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { functions, RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID } from "@/lib/appwrite";

export default function RazorpayWebView() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const { orderId, amount, razorpayKey, bookingId } = useLocalSearchParams<{
    orderId: string;
    amount: string;
    razorpayKey: string;
    bookingId: string;
  }>();
  const amountInPaise = Number(amount);
  console.log(orderId, amount, razorpayKey, bookingId);
  if (!razorpayKey) {
    Alert.alert("Payment error", "Invalid payment key");
    router.back();
    return null;
  }
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <script>
  window.onload = function () {
    const options = {
      key: "${razorpayKey}",
      amount: ${amountInPaise},
      currency: "INR",
      order_id: "${orderId}",
      name: "CozyNCR",
      description: "Booking Payment",
      handler: function (response) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "success",
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
          );
        }
      },
      modal: {
        ondismiss: function () {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ status: "cancelled" })
            );
          }
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };
</script>
  </body>
</html>
`;

  const onMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.status === "cancelled") {
      Alert.alert("Payment cancelled");
      router.back();
      return;
    }

    if (data.status === "success") {
      try {
        await functions.createExecution(
          RAZORPAY_VERIFY_PAYMENT_FUNCTION_ID,
          JSON.stringify({
            bookingId,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
          })
        );

        router.replace({
          pathname: "/property/success",
          params: { bookingId },
        });
      } catch (err) {
        Alert.alert("Payment verification failed");
        router.back();
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={onMessage}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: "center" }}
          />
        )}
      />
    </View>
  );
}
