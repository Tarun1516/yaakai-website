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

    console.log("📩 Contact form submission received:", { 
      name, 
      email, 
      messageLength: message.length,
      recipientEmail: "yaakai1516@gmail.com"
    })
    console.log("🔑 Attempting to send email with Resend API key:", resendApiKey?.substring(0, 10) + "...")
    console.log("🔑 Full API key (for debugging):", resendApiKey)

    // Send email to your verified email address
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Simplified sender address
      to: "yaakai1516@gmail.com", // Your company email (string instead of array)
      subject: `New Contact Form Message from ${name}`,
      replyTo: email, // Set reply-to as the visitor's email
      headers: {
        'X-Entity-Ref-ID': new Date().getTime().toString(),
      },
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Sent from Yaakai website contact form</p>
      `,
    })

    if (error) {
      console.error("❌ Error sending contact email:", error)
      console.error("❌ Full error details:", JSON.stringify(error, null, 2))
      
      // Provide more specific error messages based on error type
      if (error.name === 'validation_error') {
        return {
          success: false,
          message: "Email service configuration error. Please contact support.",
        }
      }
      
      return {
        success: false,
        message: "Failed to send message. Please try again or contact us directly at yaakai1516@gmail.com.",
      }
    }

    console.log("✅ Email sent successfully:", data)
    console.log("📧 Email ID:", data?.id)
    console.log("📬 Sent to: yaakai1516@gmail.com")
    console.log("🔔 Subject: New Contact Form Message from", name)
    
    // Also try to send a test email directly using fetch as backup
    try {
      const backupEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'yaakai1516@gmail.com',
          subject: `BACKUP: Contact from ${name}`,
          html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
        }),
      });
      
      if (backupEmailResponse.ok) {
        const backupData = await backupEmailResponse.json();
        console.log("🔄 Backup email also sent:", backupData.id);
      }
    } catch (backupError) {
      console.log("⚠️ Backup email failed:", backupError);
    }
    
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
