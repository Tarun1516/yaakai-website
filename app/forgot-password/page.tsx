"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, CheckCircle, InfoIcon } from "lucide-react"
import LogoSpinner from "@/components/LogoSpinner"
import { isValidEmailDomain } from "@/lib/email-validator"
import { useAuth } from "@/lib/AuthContext"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const auth = useAuth()
  const resetPassword = auth?.resetPassword || (async () => {})
  const checkEmailExists = auth?.checkEmailExists || (async () => false)

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }

    if (!isValidEmailDomain(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    setEmailError(null)
    return true
  }

  const handleSendResetEmail = async () => {
    if (!validateEmail(email)) return

    setError(null)
    setSuccess(null)
    setIsSendingEmail(true)

    try {
      // Check if email exists
      const emailExists = await checkEmailExists(email)

      if (!emailExists) {
        setError("Email not registered. Please sign up first.")
        return
      }

      // Send password reset email
      await resetPassword(email)
      setSuccess("Password reset email sent. Please check your inbox.")
    } catch (error: any) {
      setError(error.message || "Failed to send password reset email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleBackToLogin = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={handleBackToLogin} variant="ghost" className="mb-8 hover:bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-[#f59f0a]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg"
              alt="YAAKAI Logo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <p className="text-center mb-4">Please enter your registered email address</p>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value) {
                      validateEmail(e.target.value)
                    } else {
                      setEmailError(null)
                    }
                  }}
                  className={emailError ? "border-red-500" : ""}
                  disabled={isLoading || isSendingEmail}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              <Button
                type="button"
                onClick={handleSendResetEmail}
                disabled={!email || !!emailError || isSendingEmail}
                className="shrink-0"
              >
                {isSendingEmail ? (
                  <LogoSpinner size="small" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>

            {success && (
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-500 mr-2" />
                <AlertDescription className="text-blue-700 text-xs">
                  Check your email for a password reset link. If you don't see it, check your spam folder.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center mt-6">
              <Button onClick={handleBackToLogin} variant="outline" className="border-2 border-black rounded-full px-6">
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
