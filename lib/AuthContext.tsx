"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"
import {
  createUserWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithGitHub,
  updateUserProfile,
  deleteUserAccount,
  signOut,
  checkEmailExists,
  getCurrentUser,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  changeUserPassword,
} from "@/lib/firebase-service"

type User = {
  id: string
  name?: string
  email: string
  phone?: string
  provider?: string
  photoURL?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
  signup: (userData: { name: string; email: string; phone: string; password: string }) => Promise<void>
  checkEmailExists: (email: string) => Promise<boolean>
  updateProfile: (userData: { name: string; email: string; phone: string }) => Promise<void>
  deleteAccount: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  verifyResetCode: (code: string) => Promise<boolean>
  confirmReset: (code: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  error: string | null
  clearError: () => void
}

// Create context with default values to avoid "missing initializer" errors
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithGitHub: async () => {},
  signup: async () => {},
  checkEmailExists: async () => false,
  updateProfile: async () => {},
  deleteAccount: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  verifyResetCode: async () => false,
  confirmReset: async () => {},
  changePassword: async () => {},
  error: null,
  clearError: () => {},
})

// Validate password strength
function validatePassword(password: string, name: string, email: string): { valid: boolean; message: string } {
  // Check length
  if (password.length < 10) {
    return { valid: false, message: "Password must be at least 10 characters long" }
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 uppercase letter" }
  }

  // Check for numbers (at least 2)
  const numbers = password.match(/\d/g) || []
  if (numbers.length < 2) {
    return { valid: false, message: "Password must contain at least 2 numbers" }
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 special character" }
  }

  // Check if password contains username or email parts
  const emailParts = email.split("@")[0].toLowerCase()
  const nameParts = name.toLowerCase().split(" ")
  const passwordLower = password.toLowerCase()

  if (
    nameParts.some((part) => part.length > 2 && passwordLower.includes(part)) ||
    (emailParts.length > 2 && passwordLower.includes(emailParts))
  ) {
    return { valid: false, message: "Password cannot contain parts of your name or email" }
  }

  return { valid: true, message: "" }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const unsubscribe = getCurrentUser((currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || "",
          email: currentUser.email || "",
          phone: currentUser.phoneNumber || "",
          provider: currentUser.providerData[0]?.providerId || "password",
          photoURL: currentUser.photoURL || "",
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Check if email exists
  const checkEmailExistsHandler = async (email: string): Promise<boolean> => {
    try {
      return await checkEmailExists(email)
    } catch (error: any) {
      console.error("Error checking if email exists:", error)
      setError(error.message || "Failed to check if email exists")
      return false
    }
  }

  // Login with email and password
  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log(`Attempting to login with email: ${email}`)
      await signInWithEmail(email, password)
      console.log("Login successful")
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Use the error message from firebase-service directly
      setError(error.message || "Failed to log in")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Login with Google
  const loginWithGoogleHandler = async () => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Attempting to login with Google")
      await signInWithGoogle()
      console.log("Google login successful")
    } catch (error: any) {
      console.error("Google login error:", error)
      setError(error.message || "Failed to log in with Google")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Login with GitHub
  const loginWithGitHubHandler = async () => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Attempting to login with GitHub")
      await signInWithGitHub()
      console.log("GitHub login successful")
    } catch (error: any) {
      console.error("GitHub login error:", error)
      setError(error.message || "Failed to log in with GitHub")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up with email and password
  const signup = async (userData: { name: string; email: string; phone: string; password: string }) => {
    setError(null)
    setIsLoading(true)

    try {
      // Validate password strength
      const passwordValidation = validatePassword(userData.password, userData.name, userData.email)
      if (!passwordValidation.valid) {
        throw new Error(`Password does not meet requirements: ${passwordValidation.message}`)
      }

      console.log(`Attempting to sign up with email: ${userData.email}`)

      // Create user in Firebase
      await createUserWithEmail(userData.email, userData.password, userData.name)
      console.log("Signup successful")
    } catch (error: any) {
      console.error("Signup error:", error)

      // Special handling for common errors
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.")
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.")
      } else {
        setError(error.message || "Failed to sign up")
      }

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfileHandler = async (userData: { name: string; email: string; phone: string }) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Updating user profile:", userData)

      if (!user) {
        throw new Error("No user logged in")
      }

      // Update user in Firebase
      await updateUserProfile(userData.name, userData.email, userData.phone)
      console.log("Profile updated successfully")
    } catch (error: any) {
      console.error("Error updating user profile:", error)
      setError(error.message || "Failed to update profile")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete user account
  const deleteAccountHandler = async () => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Deleting user account")

      if (!user) {
        throw new Error("No user logged in")
      }

      // Delete user from Firebase
      await deleteUserAccount()
      console.log("Account deleted successfully")
    } catch (error: any) {
      console.error("Error deleting user account:", error)
      setError(error.message || "Failed to delete account")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setError(null)
    try {
      console.log("Attempting to log out")
      await signOut()
      console.log("Logout successful")
    } catch (error: any) {
      console.error("Logout error:", error)
      setError(error.message || "Failed to log out")
      throw error
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log(`Sending password reset email to: ${email}`)
      await sendPasswordResetEmail(email)
      console.log("Password reset email sent successfully")
    } catch (error: any) {
      console.error("Error sending password reset email:", error)
      setError(error.message || "Failed to send password reset email")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Verify reset code
  const verifyResetCode = async (code: string) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Verifying password reset code")
      const valid = await verifyPasswordResetCode(code)
      console.log("Password reset code verified successfully")
      return valid
    } catch (error: any) {
      console.error("Error verifying password reset code:", error)
      setError(error.message || "Failed to verify password reset code")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Confirm password reset
  const confirmReset = async (code: string, newPassword: string) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Confirming password reset")
      await confirmPasswordReset(code, newPassword)
      console.log("Password reset confirmed successfully")
    } catch (error: any) {
      console.error("Error confirming password reset:", error)
      setError(error.message || "Failed to confirm password reset")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setError(null)
    setIsLoading(true)

    try {
      console.log("Changing user password")
      await changeUserPassword(currentPassword, newPassword)
      console.log("Password changed successfully")
    } catch (error: any) {
      console.error("Error changing password:", error)
      setError(error.message || "Failed to change password")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle: loginWithGoogleHandler,
        loginWithGitHub: loginWithGitHubHandler,
        signup,
        checkEmailExists: checkEmailExistsHandler,
        updateProfile: updateProfileHandler,
        deleteAccount: deleteAccountHandler,
        logout,
        resetPassword,
        verifyResetCode,
        confirmReset,
        changePassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
