"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, CheckCircle, X } from "lucide-react"
import LogoSpinner from "@/components/LogoSpinner"
import { useAuth } from "@/lib/AuthContext"


export default function ChangePasswordPage() {
  const router = useRouter()
  const { user, logout, changePassword } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
    noNameEmail: true,
    noPhone: true,
    notOldPassword: true,
    overall: false,
  })

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && password !== ""

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    // Check password requirements
    const lengthValid = password.length >= 10
    const uppercaseValid = /[A-Z]/.test(password)
    const lowercaseValid = /[a-z]/.test(password)
    const numbersValid = (password.match(/\d/g) || []).length >= 2
    const specialValid = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    // Check if password contains email or name parts
    const emailParts = user?.email.split("@")[0].toLowerCase() || ""
    const nameParts = (user?.name || "").toLowerCase().split(" ")
    const passwordLower = password.toLowerCase()

    const containsNameOrEmail =
      nameParts.some((part) => part.length > 2 && passwordLower.includes(part)) ||
      (emailParts.length > 2 && passwordLower.includes(emailParts))

    // Check if password is or contains phone number
    const isPhone = /^\d{10,15}$/.test(password)
    const has5ConsecutiveDigits = /\d{5}/.test(password)

    // Check if new password is the same as current password
    const notOldPasswordValid = password !== currentPassword || currentPassword === ""

    const noNameEmailValid = !containsNameOrEmail
    const noPhoneValid = !isPhone && !has5ConsecutiveDigits

    // Overall validation
    const overallValid =
      lengthValid &&
      uppercaseValid &&
      lowercaseValid &&
      numbersValid &&
      specialValid &&
      noNameEmailValid &&
      noPhoneValid &&
      notOldPasswordValid

    setPasswordValidation({
      length: lengthValid,
      uppercase: uppercaseValid,
      lowercase: lowercaseValid,
      numbers: numbersValid,
      special: specialValid,
      noNameEmail: noNameEmailValid,
      noPhone: noPhoneValid,
      notOldPassword: notOldPasswordValid,
      overall: overallValid,
    })
  }, [password, currentPassword, user])

  const handleChangePassword = async () => {
    if (!passwordValidation.overall) {
      setError("Please ensure your password meets all requirements")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }

    if (!currentPassword) {
      setError("Please enter your current password")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      console.log("Attempting to change password for user:", user?.email)

      // Use the real Firebase password change function
      await changePassword(currentPassword, password)
      
      console.log("Password changed successfully!")
      setSuccess(true)
    } catch (error: any) {
      console.error("Error changing password:", error)
      setError(error.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = () => {
    // Always logout and redirect to login page
    logout()
      .then(() => {
        router.push("/?login=true")
      })
      .catch((error) => {
        console.error("Error during logout:", error)
        // Still redirect even if logout fails
        router.push("/?login=true")
      })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        onClick={() => {
          if (success) {
            // If password was changed successfully, log out first
            logout().then(() => {
              router.push("/")
            })
          } else {
            // Otherwise just go back
            router.push("/")
          }
        }}
        variant="ghost"
        className="mb-8 hover:bg-transparent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
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

        <h1 className="text-2xl font-bold text-center mb-6">Change Your Password</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
          {success ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Success</h2>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-green-600">The password has been successfully changed.</p>
              <p>You may login now with your new password.</p>
              <Button
                onClick={handleLoginClick}
                className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 mt-4"
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-2">Current Password</p>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2">Enter your new password</p>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-2 text-xs space-y-1">
                  <p className="font-medium">Password must have:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center">
                      {passwordValidation.length ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.length ? "text-green-600" : "text-gray-500"}>
                        At least 10 characters
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.uppercase ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}>
                        1 uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.lowercase ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.lowercase ? "text-green-600" : "text-gray-500"}>
                        1 lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.numbers ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.numbers ? "text-green-600" : "text-gray-500"}>2 numbers</span>
                    </div>
                    <div className="flex items-center">
                      {passwordValidation.special ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.special ? "text-green-600" : "text-gray-500"}>
                        1 special character
                      </span>
                    </div>
                    <div className="flex items-center col-span-2">
                      {passwordValidation.noNameEmail ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.noNameEmail ? "text-green-600" : "text-gray-500"}>
                        Cannot contain your name or email
                      </span>
                    </div>
                    <div className="flex items-center col-span-2">
                      {passwordValidation.noPhone ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.noPhone ? "text-green-600" : "text-gray-500"}>
                        Cannot be phone number or contain 5 consecutive digits
                      </span>
                    </div>
                    <div className="flex items-center col-span-2">
                      {passwordValidation.notOldPassword ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={passwordValidation.notOldPassword ? "text-green-600" : "text-gray-500"}>
                        Cannot be the same as current password
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2">Re-confirm your new password</p>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pr-10 ${passwordsMatch && confirmPassword ? "border-green-500" : confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {confirmPassword && (
                  <p className={`text-xs mt-1 ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleChangePassword}
                  className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6"
                  disabled={!passwordValidation.overall || !passwordsMatch || !currentPassword || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LogoSpinner size="small" />
                      <span className="ml-2">Changing Password...</span>
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
