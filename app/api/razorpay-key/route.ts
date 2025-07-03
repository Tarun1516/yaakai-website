import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return only the public key
    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Error fetching Razorpay key:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
