import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount, currency, name, description, prefill, notes } = await req.json()

    // Create an order
    const orderResponse = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount === 0 ? 1 : amount, // Minimum 1 rupee
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          ...notes,
          is_free_product: amount === 0 ? "true" : "false",
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create order")
    }

    // Return checkout configuration (without the secret key)
    return NextResponse.json({
      success: true,
      checkoutConfig: {
        key: process.env.RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name,
        description,
        order_id: orderData.order.id,
        prefill,
        notes: orderData.order.notes,
        theme: { color: "#f59f0a" },
      },
    })
  } catch (error) {
    console.error("Error creating checkout config:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
