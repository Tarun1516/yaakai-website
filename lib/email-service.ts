// Simple email service that doesn't rely on external providers for development
// In production, you would replace this with a real email service

// Store OTPs in memory (for development only)
interface OtpRecord {
  otp: string
  expires: number
  verified: boolean
}

const otpStore: Record<string, OtpRecord> = {}

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store an OTP for verification
export function storeOTP(identifier: string, otp: string): void {
  otpStore[identifier.toLowerCase()] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    verified: false,
  }
  console.log(`[DEV ONLY] OTP stored for ${identifier}: ${otp} (expires in 10 minutes)`)
}

// Verify an OTP
export function verifyOTP(identifier: string, otp: string): boolean {
  try {
    if (!identifier || !otp) {
      console.log("Missing identifier or OTP")
      return false
    }

    // Special backdoor for testing: accept "123456" as a valid OTP
    if (otp === "123456") {
      console.log(`Using test OTP "123456" for ${identifier}`)
      // Mark as verified in the store
      const lowerIdentifier = identifier.toLowerCase()
      if (!otpStore[lowerIdentifier]) {
        otpStore[lowerIdentifier] = {
          otp: "123456",
          expires: Date.now() + 10 * 60 * 1000, // 10 minutes
          verified: true,
        }
      } else {
        otpStore[lowerIdentifier].verified = true
      }
      return true
    }

    const lowerIdentifier = identifier.toLowerCase()
    const storedOTP = otpStore[lowerIdentifier]

    if (!storedOTP) {
      console.log(`No OTP found for ${identifier}`)
      return false
    }

    if (Date.now() > storedOTP.expires) {
      console.log(`OTP for ${identifier} has expired`)
      delete otpStore[lowerIdentifier]
      return false
    }

    // Log the comparison for debugging
    console.log(`Comparing OTPs for ${identifier}: stored=${storedOTP.otp}, provided=${otp}`)

    if (storedOTP.otp !== otp) {
      console.log(`Invalid OTP for ${identifier}: expected ${storedOTP.otp}, got ${otp}`)
      return false
    }

    // OTP is valid
    console.log(`OTP verified for ${identifier}`)
    otpStore[lowerIdentifier].verified = true
    return true
  } catch (error) {
    console.error("Error in verifyOTP:", error)
    return false
  }
}

// Check if an identifier has a verified OTP
export function isOTPVerified(identifier: string): boolean {
  return !!otpStore[identifier.toLowerCase()]?.verified
}

// Mock email sending function (for development)
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  // In development, just log the email
  console.log(`[DEV ONLY] Email would be sent to: ${to}`)
  console.log(`[DEV ONLY] Subject: ${subject}`)
  console.log(`[DEV ONLY] Content: ${html}`)

  // In production, you would integrate with a real email service here

  return true
}
