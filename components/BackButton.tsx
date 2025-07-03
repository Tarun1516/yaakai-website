"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  returnToSignup?: boolean
}

export default function BackButton({ returnToSignup = false }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (returnToSignup) {
      // Set flag to open signup dialog when returning to main page
      localStorage.setItem("openSignupDialog", "true")
    }
    router.push("/") // Always redirect to home page
  }

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100"
      aria-label="Go back"
    >
      <ArrowLeft className="h-6 w-6" />
    </Button>
  )
}
