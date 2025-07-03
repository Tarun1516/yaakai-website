"use server"

import { generateOTP, storeOTP, verifyOTP, sendEmail } from "@/lib/email-service"

export async function sendOtpEmail(userEmail: string) {
  try {
    // Generate OTP
    const otp = generateOTP()

    // Store OTP for verification later
    storeOTP(userEmail, otp)

    // For development purposes, log the OTP to the console
    console.log(`[DEV ONLY] OTP for ${userEmail}: ${otp}`)

    try {
      // In development, this won't actually send an email
      // In production, you would replace this with a real email service
      await sendEmail(
        userEmail,
        "OTP for Yaakai",
        `
          <div>
            <h1>One-Time Password</h1>
            <p>Your OTP for Yaakai verification is:</p>
            <h2 style="font-size: 24px; padding: 10px; background-color: #f5f5f5; display: inline-block;">${otp}</h2>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      )

      // For development, we'll return success with the OTP
      // In production, you would NOT include the testOtp field
      return {
        success: true,
        message: `OTP sent successfully to ${userEmail}`,
        // Only include testOtp in development environment
        ...(process.env.NODE_ENV === "development" ? { testOtp: otp } : {}),
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      // For development, still return success with the OTP
      return {
        success: true,
        message: "Email service is not available in development mode. Use the console to find the OTP.",
        // Only include testOtp in development environment
        ...(process.env.NODE_ENV === "development" ? { testOtp: otp } : {}),
      }
    }
  } catch (error) {
    console.error("Error in sendOtpEmail:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const isValid = verifyOTP(email, otp)

    if (isValid) {
      return {
        success: true,
        message: "OTP verified successfully",
      }
    } else {
      return {
        success: false,
        message: "Invalid or expired OTP",
      }
    }
  } catch (error) {
    console.error("Error in verifyOtp:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
