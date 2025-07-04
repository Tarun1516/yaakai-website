"use server"

import { Resend } from "resend"

// Check if API key exists and provide better error handling
const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set")
}

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  console.log("Contact form submission received:", { name, email, messageLength: message?.length })

  // Validate inputs
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all fields",
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

    console.log("📩 Sending email to: yaakai1516@gmail.com")
    console.log("🔑 Using API key:", resendApiKey?.substring(0, 10) + "...")

    // Send email to your verified email address
    const { data, error } = await resend.emails.send({
      from: "Yaakai Contact <onboarding@resend.dev>", // Add sender name for better deliverability
      to: "yaakai1516@gmail.com", // Your verified email
      subject: `[Yaakai] Contact Form: ${name}`, // Add prefix to make it more recognizable
      replyTo: email, // Set reply-to as the visitor's email
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #f59f0a; margin-bottom: 20px; border-bottom: 2px solid #f59f0a; padding-bottom: 10px;">New Contact Form Submission</h1>
            <div style="margin-bottom: 20px;">
              <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> <span style="color: #666;">${name}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> <a href="mailto:${email}" style="color: #f59f0a; text-decoration: none;">${email}</a></p>
              <p style="margin: 15px 0 10px 0;"><strong style="color: #333;">Message:</strong></p>
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #f59f0a; border-radius: 5px; margin: 10px 0;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sent from Yaakai website contact form on ${new Date().toLocaleString()}
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
              Reply directly to this email to respond to ${name}
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("❌ Error sending contact email:", error)
      
      // Check if it's a recipient verification issue
      if (error.message && (error.message.includes('not verified') || error.message.includes('not found'))) {
        console.error("🚨 RECIPIENT EMAIL NOT VERIFIED IN RESEND")
        console.error("📋 TO FIX: Go to https://resend.com/emails and verify yaakai1516@gmail.com")
        
        return {
          success: false,
          message: "Email delivery issue: The recipient email needs to be verified in Resend. Please contact support directly at yaakai1516@gmail.com.",
        }
      }
      
      return {
        success: false,
        message: "Failed to send message. Please try again.",
      }    }

    console.log("✅ Email sent successfully:", data)
    console.log("📧 Email ID:", data?.id)
    console.log("📬 Sent to: yaakai1516@gmail.com")

    return {
      success: true,
      message: "Message sent successfully! We will get back to you soon.",
    }
  } catch (error) {
    console.error("Error in sendContactEmail:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
