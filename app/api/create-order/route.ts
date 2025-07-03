import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    console.log("Creating order...")

    // Parse the request body
    const body = await req.json()
    const { amount = 100, currency = "INR" } = body

    // Generate a random order ID (in production, this would come from Razorpay)
    // For testing purposes, we'll use a simple format
    const orderId = `order_${Date.now()}`

    console.log(`Created order: ${orderId} for amount: ${amount} ${currency}`)

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      currency,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order. Please try again.",
      },
      { status: 500 },
    )
  }
}
