"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LogoSpinner from "@/components/LogoSpinner"
import { isValidEmailDomain } from "@/lib/email-validator"
import { Eye, EyeOff, Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCurrentDomain } from "@/lib/firebase-debug"

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginClick: () => void
}

// Define the form state interface
interface SignUpFormState {
  name: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
  privacyAccepted: boolean
  cookiesAccepted: boolean
}

export default function SignUpDialog({ open, onOpenChange, onLoginClick }: SignUpDialogProps) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [cookiesAccepted, setCookiesAccepted] = useState(false)

  const auth = useAuth()
  const signup = auth?.signup || (async () => {})
  const loginWithGoogle = auth?.loginWithGoogle || (async () => {})
  const loginWithGitHub = auth?.loginWithGitHub || (async () => {})
  const checkEmailExists = auth?.checkEmailExists || (async () => false)

  // Check if all policies are accepted
  const allPoliciesAccepted = termsAccepted && privacyAccepted && cookiesAccepted

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    numbers: false,
    special: false,
    noUsernameEmail: true,
    overall: false,
  })

  // Load saved form state on component mount
  useEffect(() => {
    if (open) {
      const savedState = localStorage.getItem("signupFormState")
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState) as SignUpFormState
          setName(parsedState.name || "")
          setEmail(parsedState.email || "")
          setPassword(parsedState.password || "")
          setConfirmPassword(parsedState.confirmPassword || "")
          setTermsAccepted(parsedState.termsAccepted || false)
          setPrivacyAccepted(parsedState.privacyAccepted || false)
          setCookiesAccepted(parsedState.cookiesAccepted || false)
        } catch (e) {
          console.error("Error parsing saved form state:", e)
        }
      }
    }
  }, [open])

  // Save form state whenever it changes
  useEffect(() => {
    if (open) {
      const formState: SignUpFormState = {
        name,
        email,
        password,
        confirmPassword,
        termsAccepted,
        privacyAccepted,
        cookiesAccepted,
      }
      localStorage.setItem("signupFormState", JSON.stringify(formState))
    }
  }, [name, email, password, confirmPassword, termsAccepted, privacyAccepted, cookiesAccepted, open])

  useEffect(() => {
    // Check password requirements
    const lengthValid = password.length >= 10
    const uppercaseValid = /[A-Z]/.test(password)
    const numbersValid = (password.match(/\d/g) || []).length >= 2
    const specialValid = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    // Check if password contains username or email parts
    const emailParts = email.split("@")[0].toLowerCase()
    const nameParts = name.toLowerCase().split(" ")
    const passwordLower = password.toLowerCase()

    const containsNameOrEmail =
      nameParts.some((part) => part.length > 2 && passwordLower.includes(part)) ||
      (emailParts.length > 2 && passwordLower.includes(emailParts))

    const noUsernameEmailValid = !containsNameOrEmail

    // Overall validation
    const overallValid = lengthValid && uppercaseValid && numbersValid && specialValid && noUsernameEmailValid

    setPasswordValidation({
      length: lengthValid,
      uppercase: uppercaseValid,
      numbers: numbersValid,
      special: specialValid,
      noUsernameEmail: noUsernameEmailValid,
      overall: overallValid,
    })
  }, [password, name, email])

  // Check if passwords match
  const passwordsMatch = password === confirmPassword && password !== ""

  // Validate email
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(null)
      return false
    }

    if (!isValidEmailDomain(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }

    setEmailError(null)
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    // Only validate if there's some input
    if (newEmail) {
      validateEmail(newEmail)
    } else {
      setEmailError(null)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    setLocalError(null)

    // Validate email before proceeding
    if (!validateEmail(email)) {
      return
    }

    if (!passwordValidation.overall) {
      setLocalError("Please ensure your password meets all requirements")
      return
    }

    if (!passwordsMatch) {
      setLocalError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Proceed with signup
      await signup({
        name,
        email,
        phone: "", // Empty phone number
        password,
      })

      console.log("SignUpDialog - Signup successful")

      onOpenChange(false)

      // Clear saved form state
      localStorage.removeItem("signupFormState")

      // Reset form
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setTermsAccepted(false)
      setPrivacyAccepted(false)
      setCookiesAccepted(false)
    } catch (error: any) {
      console.error("Signup - Error in handleSignUp:", error)
      setLocalError(error.message || "Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Check if all policies are accepted
    if (!allPoliciesAccepted) {
      setLocalError("Please accept the terms and conditions, privacy policy, and cookie policy before signing up.")
      return
    }

    setLocalError(null)
    setIsLoading(true)

    try {
      await loginWithGoogle()
      onOpenChange(false)
    } catch (error: any) {
      console.error("SignUpDialog - Error in handleGoogleLogin:", error)

      // Check if it's an unauthorized domain error
      if (error.message && error.message.includes("not authorized for Google sign-in")) {
        // Show detailed instructions
        setLocalError(
          `${error.message}\n\nCurrent domain: ${getCurrentDomain()}\n\nPlease make sure you've added this exact domain to Firebase.`,
        )
      } else {
        setLocalError(error.message || "Failed to sign up with Google. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    // Check if all policies are accepted
    if (!allPoliciesAccepted) {
      setLocalError("Please accept the terms and conditions, privacy policy, and cookie policy before signing up.")
      return
    }

    setLocalError(null)
    setIsLoading(true)

    try {
      await loginWithGitHub()
      onOpenChange(false)
    } catch (error: any) {
      console.error("SignUpDialog - Error in handleGitHubLogin:", error)
      setLocalError(error.message || "Failed to sign up with GitHub. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle navigation to policy pages
  const navigateToPolicy = (path: string) => {
    // Close the dialog
    onOpenChange(false)
    // Navigate to the policy page
    router.push(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">Create Account</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded-lg">
            <LogoSpinner size="large" />
          </div>
        )}

        {localError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Email</label>
            <div className="flex-grow relative">
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email"
                required
                className={emailError ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-medium">Password must have:</p>
              <ul className="space-y-1 pl-5 list-disc">
                <li className={passwordValidation.length ? "text-green-600" : "text-gray-500"}>
                  At least 10 characters
                </li>
                <li className={passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}>
                  At least 1 uppercase letter
                </li>
                <li className={passwordValidation.numbers ? "text-green-600" : "text-gray-500"}>At least 2 numbers</li>
                <li className={passwordValidation.special ? "text-green-600" : "text-gray-500"}>
                  At least 1 special character
                </li>
                <li className={passwordValidation.noUsernameEmail ? "text-green-600" : "text-gray-500"}>
                  Cannot contain your name or email
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={confirmPassword ? (passwordsMatch ? "border-green-500" : "border-red-500") : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && <p className="text-red-500 text-xs">Passwords do not match</p>}
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label htmlFor="terms" className="text-sm">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={() => navigateToPolicy("/terms-and-conditions")}
                  className="text-blue-600 hover:underline"
                >
                  terms and conditions
                </button>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
              />
              <label htmlFor="privacy" className="text-sm">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={() => navigateToPolicy("/privacy-policy")}
                  className="text-blue-600 hover:underline"
                >
                  privacy policy
                </button>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cookies"
                checked={cookiesAccepted}
                onCheckedChange={(checked) => setCookiesAccepted(checked === true)}
              />
              <label htmlFor="cookies" className="text-sm">
                I have read and accept the{" "}
                <button
                  type="button"
                  onClick={() => navigateToPolicy("/cookie-policy")}
                  className="text-blue-600 hover:underline"
                >
                  cookie policy
                </button>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full px-8 bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full mx-auto block"
              disabled={
                !name ||
                !email ||
                !password ||
                !confirmPassword ||
                !passwordsMatch ||
                !passwordValidation.overall ||
                !termsAccepted ||
                !privacyAccepted ||
                !cookiesAccepted ||
                isLoading
              }
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || !allPoliciesAccepted}
              className={`w-full border-2 border-gray-300 ${
                allPoliciesAccepted ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGitHubLogin}
              disabled={isLoading || !allPoliciesAccepted}
              className={`w-full border-2 border-gray-300 ${
                allPoliciesAccepted ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button onClick={onLoginClick} className="text-blue-600 hover:underline" disabled={isLoading}>
            Sign In
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
