"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import LogoSpinner from "@/components/LogoSpinner"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isValidEmailDomain } from "@/lib/email-validator"
import { useRouter } from "next/navigation"

export default function ProfileSection() {
  const { user, isLoading, logout, updateUserProfile, deleteUserAccount } = useAuth()
  const router = useRouter()

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")

  // Error and loading states
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Confirmation dialogs
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Email validation
  const [emailError, setEmailError] = useState<string | null>(null)

  // Initialize form values when user data changes
  useEffect(() => {
    if (user) {
      setEditedName(user.name || "")
      setEditedEmail(user.email || "")
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LogoSpinner size="medium" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">My Profile</h2>
        <p className="text-lg mb-6">Please log in to view your profile.</p>
      </div>
    )
  }

  const handleEditClick = () => {
    setEditedName(user.name || "")
    setEditedEmail(user.email || "")
    setError(null)
    setIsEditing(true)
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEditing(false)
    setError(null)
  }

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEditedEmail(newEmail)
    validateEmail(newEmail)
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Validate all fields
    if (!editedName) {
      setError("Name is required")
      return
    }

    if (!validateEmail(editedEmail)) return

    // Show confirmation dialog
    setShowSaveConfirmation(true)
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      console.log("Saving profile changes:", { name: editedName, email: editedEmail })

      await updateUserProfile({
        name: editedName,
        email: editedEmail,
        phone: "", // Empty phone number
      })

      setIsEditing(false)
      setShowSaveConfirmation(false)

      // Show success message
      setError(null)
      console.log("Profile updated successfully")
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setError(error.message || "Failed to update profile. Please try again.")
      // Keep the confirmation dialog open so user can try again
      setShowSaveConfirmation(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteUserAccount()
      // Logout will be handled by the auth context after successful deletion
    } catch (error: any) {
      setError(error.message || "Failed to delete account")
      setIsDeleting(false)
      setShowDeleteConfirmation(false)
    }
  }

  const navigateToMyOrders = () => {
    router.push("/my-orders")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-8 text-center">My Profile</h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Name</label>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Email</label>
            <div className="flex-grow relative">
              <Input
                type="email"
                value={editedEmail}
                onChange={handleEmailChange}
                placeholder="Your email"
                required
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <Button
              onClick={handleSaveClick}
              type="button"
              className={`bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 ${!editedName || emailError ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!editedName || !!emailError}
            >
              Save Changes
            </Button>
            <Button
              onClick={handleCancelEdit}
              type="button"
              variant="outline"
              className="border-2 border-black rounded-full px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Name</label>
            <p className="p-2 bg-white/80 rounded-lg">{user.name || "N/A"}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Email</label>
            <p className="p-2 bg-white/80 rounded-lg">{user.email || "N/A"}</p>
          </div>

          <div className="mt-8 p-4 bg-white/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Account Details</h3>
            <p className="mb-2">User ID: {user.id}</p>
          </div>

          <div className="text-center mb-4 flex flex-col space-y-3">
            <Button
              onClick={() => router.push("/change-password")}
              variant="link"
              className="text-blue-600 hover:underline text-center"
            >
              Change Password
            </Button>
            <Button onClick={navigateToMyOrders} variant="link" className="text-blue-600 hover:underline text-center">
              My Orders
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={handleEditClick}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6"
            >
              Edit Profile
            </Button>
            <Button
              onClick={handleDeleteClick}
              variant="outline"
              className="border-2 border-black rounded-full px-6 text-red-600 hover:bg-red-50"
            >
              Delete Profile
            </Button>
          </div>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Changes</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to save these changes to your profile?</p>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              onClick={handleConfirmSave}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6"
              disabled={isSaving}
            >
              {isSaving ? <LogoSpinner size="small" /> : "Yes"}
            </Button>
            <Button
              onClick={() => setShowSaveConfirmation(false)}
              variant="outline"
              className="border-2 border-black rounded-full px-6"
              disabled={isSaving}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Delete Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">Are you sure you want to delete your profile?</p>
            <p className="text-red-600 text-sm">This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              onClick={handleConfirmDelete}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6"
              disabled={isDeleting}
            >
              {isDeleting ? <LogoSpinner size="small" /> : "Yes, Delete"}
            </Button>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              variant="outline"
              className="border-2 border-black rounded-full px-6"
              disabled={isDeleting}
            >
              No, Don&apos;t Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
