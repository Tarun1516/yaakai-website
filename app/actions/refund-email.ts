"use server"

import { Resend } from "resend"

// Check if API key exists and provide better error handling
const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set")
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendRefundRequestEmail(data: {
  orderId: string
  userId: string
  userEmail?: string
  userName?: string
  reason: string
  issueDescription: string
}) {
  // Validate inputs
  if (!data.orderId || !data.userId || !data.reason || !data.issueDescription) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  try {
    // Check if Resend is properly initialized
    if (!resend) {
      console.error("Resend client is not initialized - missing API key")
      return {
        success: false,
        message: "Email service is not configured. Please contact support.",
      }
    }

    // Send email to your company email address
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Resend's default sender
      to: "yaakai1516@gmail.com", // Your company email
      subject: `Refund Request - Order ID: ${data.orderId}`,
      reply_to: data.userEmail || "noreply@example.com", // Set reply-to as the user's email if available
      html: `
        <div>
          <h1>New Refund Request</h1>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>User ID:</strong> ${data.userId}</p>
          ${data.userName ? `<p><strong>User Name:</strong> ${data.userName}</p>` : ""}
          ${data.userEmail ? `<p><strong>User Email:</strong> ${data.userEmail}</p>` : ""}
          <p><strong>Reason for Refund:</strong></p>
          <p>${data.reason.replace(/\n/g, "<br>")}</p>
          <p><strong>Issue Description:</strong></p>
          <p>${data.issueDescription.replace(/\n/g, "<br>")}</p>
          <p><strong>Request Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending refund request email:", error)
      return {
        success: false,
        message: "Failed to send refund request. Please try again.",
      }
    }

    return {
      success: true,
      message: "Refund request sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendRefundRequestEmail:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
