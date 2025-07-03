"use client"

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs"
import { useConvex, useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { useState, useEffect } from "react"
import type React from "react"

export function useAuth() {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const convex = useConvex()
  const [error, setError] = useState<string | null>(null)

  // Get the user from Convex if signed in
  const convexUser = useQuery(api.users.getByClerkId, isSignedIn && clerkUser ? { clerkId: clerkUser.id } : "skip")

  const createUserMutation = useMutation(api.users.create)

  // Create the user in Convex if they don't exist
  useEffect(() => {
    const createUserInConvex = async () => {
      if (isSignedIn && clerkUser && convexUser === null) {
        try {
          await createUserMutation({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            name: clerkUser.fullName || clerkUser.username || "",
            phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber,
          })
        } catch (err) {
          console.error("Error creating user in Convex:", err)
          setError("Failed to initialize user data. Please try again.")
        }
      }
    }

    if (isLoaded && isSignedIn && clerkUser) {
      createUserInConvex()
    }
  }, [isSignedIn, clerkUser, convexUser, isLoaded, createUserMutation])

  // Format the user data to match the previous structure
  const user =
    isSignedIn && clerkUser && convexUser
      ? {
          $id: convexUser._id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          name: clerkUser.fullName || clerkUser.username || "",
          phoneNumber: clerkUser.primaryPhoneNumber?.phoneNumber || "",
        }
      : null

  const clearError = () => setError(null)

  const logout = async () => {
    try {
      await signOut()
    } catch (error: any) {
      setError(error.message || "Failed to log out")
      throw error
    }
  }

  return {
    user,
    error,
    signIn: () => {
      setError("Use Clerk for authentication")
      throw new Error("Use Clerk for authentication")
    },
    signUp: () => {
      setError("Use Clerk for authentication")
      throw new Error("Use Clerk for authentication")
    },
    logout,
    clearError,
    isLoading: !isLoaded,
  }
}

// For backward compatibility
export const AuthContext = {
  Provider: ({ children }: { children: React.ReactNode }) => children,
}
