import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { paymentId, amount, currency } = await req.json();

    if (!paymentId || amount === undefined || !currency) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: paymentId, amount, or currency" },
        { status: 400 }
      );
    }

    // Ensure amount is an integer (paise)
    const amountInPaise = Math.round(Number(amount));
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
        return NextResponse.json(
            { success: false, error: "Invalid amount provided." },
            { status: 400 }
        );
    }


    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    console.log(`Attempting to capture payment: ${paymentId} for amount: ${amountInPaise} ${currency}`);

    const captureResponse = await razorpay.payments.capture(paymentId, amountInPaise, currency);

    console.log("Payment capture response:", captureResponse);

    if (captureResponse.status === "captured") {
      return NextResponse.json({
        success: true,
        message: "Payment captured successfully",
        data: captureResponse,
      });
    } else {
      // Handle cases where capture might not have succeeded as expected
      // e.g., if status is 'authorized' or some other state
      console.error("Payment capture failed or status not 'captured':", captureResponse);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to capture payment. Status: ${captureResponse.status}`,
          data: captureResponse,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error capturing payment:", error);
    // Check if the error is from Razorpay and has a specific structure
    const errorMessage = error.error?.description || error.message || "An unexpected error occurred during payment capture";
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.error // Include more details if available from Razorpay error
      },
      { status: statusCode }
    );
  }
} 