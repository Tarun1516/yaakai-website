"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LogoSpinner from "@/components/LogoSpinner"
import { isValidEmailDomain } from "@/lib/email-validator"
import { Eye, EyeOff, Github } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignUpClick: () => void
  onForgotPasswordClick: () => void
}

export default function LoginDialog({ open, onOpenChange, onSignUpClick, onForgotPasswordClick }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const auth = useAuth()
  const login = auth?.login || (async () => {})
  const loginWithGoogle = auth?.loginWithGoogle || (async () => {})
  const loginWithGitHub = auth?.loginWithGitHub || (async () => {})
  const checkEmailExists = auth?.checkEmailExists || (async () => false)

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email before proceeding
    if (!validateEmail(email)) {
      return
    }

    setLocalError(null)
    setIsLoading(true)

    try {
      // Proceed with login
      await login(email, password)
      onOpenChange(false)

      // Reset form
      setEmail("")
      setPassword("")
    } catch (error: any) {
      console.error("LoginDialog - Error in handleLogin:", error)
      
      // Check if it's a "user not found" error
      if (error.message?.includes("No account found with this email address")) {
        setLocalError("No account found. Would you like to sign up instead?")
        // Optionally auto-switch to signup after a delay
        setTimeout(() => {
          onOpenChange(false)
          onSignUpClick()
        }, 2000)
      } else {
        setLocalError(error.message || "Failed to log in. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLocalError(null)
    setIsLoading(true)

    try {
      await loginWithGoogle()
      onOpenChange(false)
    } catch (error: any) {
      console.error("LoginDialog - Error in handleGoogleLogin:", error)
      setLocalError(error.message || "Failed to log in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLocalError(null)
    setIsLoading(true)

    try {
      await loginWithGitHub()
      onOpenChange(false)
    } catch (error: any) {
      console.error("LoginDialog - Error in handleGitHubLogin:", error)
      setLocalError(error.message || "Failed to log in with GitHub. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">Welcome Back!</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded-lg">
            <LogoSpinner size="large" />
          </div>
        )}

        {localError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{localError}</AlertDescription>
            {localError.includes("No account found") && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    onSignUpClick()
                  }}
                  className="text-xs"
                >
                  Sign Up Instead
                </Button>
              </div>
            )}
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Your password"
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
          </div>

          <Button
            type="submit"
            className="w-full px-8 bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full mx-auto block"
            disabled={!email || !password || isLoading}
          >
            Login
          </Button>
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
              disabled={isLoading}
              className="w-full border-2 border-gray-300 hover:bg-gray-50"
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
              disabled={isLoading}
              className="w-full border-2 border-gray-300 hover:bg-gray-50"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <button onClick={onSignUpClick} className="text-blue-600 hover:underline" disabled={isLoading}>
            Sign Up Now
          </button>
        </p>
        <p className="text-center mt-2">
          <button onClick={onForgotPasswordClick} className="text-blue-600 hover:underline">
            Forgot Password?
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
