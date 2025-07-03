import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {
  try {
    const { amount, currency, receipt, notes } = await req.json()

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    })

    // Create an order with auto-capture enabled
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
      payment_capture: true, // Enable automatic payment capture
    })

    console.log("Order created:", order)

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
