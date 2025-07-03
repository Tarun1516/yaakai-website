"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentDomain, getFirebaseAuthInstructions } from "@/lib/firebase-debug"

export default function FirebaseDebugHelper() {
  const [currentDomain, setCurrentDomain] = useState<string>("")
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Only run on client side
    setCurrentDomain(getCurrentDomain())
  }, [])

  return (
    <div className="p-4 border rounded-lg bg-gray-50 my-4">
      <h2 className="text-lg font-bold mb-2">Firebase Authentication Debug Helper</h2>

      <div className="mb-4">
        <p>
          <strong>Current Domain:</strong> {currentDomain}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          This is the domain that needs to be added to Firebase authorized domains.
        </p>
      </div>

      <Button onClick={() => setShowInstructions(!showInstructions)} variant="outline" className="mb-4">
        {showInstructions ? "Hide Instructions" : "Show Instructions"}
      </Button>

      {showInstructions && (
        <Alert className="mb-4">
          <AlertDescription>
            <pre className="whitespace-pre-wrap text-sm">{getFirebaseAuthInstructions()}</pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-600 mt-4">
        <p>Common issues:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>
            Make sure you've added the <strong>exact</strong> domain (no http:// or https://)
          </li>
          <li>Changes to Firebase settings can take a few minutes to propagate</li>
          <li>For Vercel deployments, add both the main domain and preview domains</li>
          <li>For local development, consider using email/password auth instead</li>
        </ul>
      </div>
    </div>
  )
}
