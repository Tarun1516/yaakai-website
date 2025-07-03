"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LogoSpinner from "@/components/LogoSpinner"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function TestPayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`])
  }

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      addLog("Checking if Razorpay is already loaded...")

      if (window.Razorpay) {
        addLog("Razorpay already loaded")
        resolve()
        return
      }

      addLog("Loading Razorpay script...")
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        addLog("Razorpay script loaded successfully")
        resolve()
      }

      script.onerror = () => {
        const error = "Failed to load Razorpay SDK"
        addLog(`ERROR: ${error}`)
        reject(new Error(error))
      }

      document.body.appendChild(script)
    })
  }

  const handleTestPayment = async () => {
    setIsProcessing(true)
    setPaymentError(null)
    setPaymentSuccess(null)
    setLogs([])

    try {
      // Load Razorpay script
      addLog("Starting payment process...")
      await loadRazorpayScript()

      // Use hardcoded key
      const key = "rzp_live_9A4LaDKp4UZPCj"
      addLog(`Using Razorpay key: ${key}`)

      // Create a simple order ID
      const orderId = `order_${Date.now()}`
      addLog(`Generated order ID: ${orderId}`)

      // Create Razorpay options
      const options = {
        key: key,
        amount: 100, // 1 INR in paise
        currency: "INR",
        name: "Yaakai Test",
        description: "Test Payment",
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f59f0a",
        },
        handler: (response: any) => {
          addLog(`Payment successful: ${JSON.stringify(response)}`)
          setPaymentSuccess("Payment completed successfully!")
          setIsProcessing(false)
        },
        modal: {
          ondismiss: () => {
            addLog("Payment modal dismissed")
            setIsProcessing(false)
          },
        },
      }

      addLog(`Initializing Razorpay with options: ${JSON.stringify(options, null, 2)}`)

      // Check if Razorpay is available
      if (!window.Razorpay) {
        throw new Error("Razorpay is not available even after loading the script")
      }

      // Create Razorpay instance
      addLog("Creating Razorpay instance...")
      const razorpay = new window.Razorpay(options)

      // Set up payment failed handler
      razorpay.on("payment.failed", (response: any) => {
        const errorMessage = response.error?.description || "Unknown error"
        addLog(`Payment failed: ${errorMessage}`)
        setPaymentError(`Payment failed: ${errorMessage}`)
        setIsProcessing(false)
      })

      // Open Razorpay payment form
      addLog("Opening Razorpay payment form...")
      razorpay.open()
    } catch (error: any) {
      addLog(`Error during payment: ${error.message}`)
      setPaymentError(error.message || "An error occurred during payment processing")
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Test Razorpay Payment</h1>

      {paymentError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      {paymentSuccess && (
        <Alert className="mb-6 bg-green-100 border-green-500">
          <AlertDescription className="text-green-800">{paymentSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Test Payment</h2>
          <p className="mb-4">
            This page allows you to test the Razorpay payment integration. Click the button below to initiate a test
            payment.
          </p>
          <Button
            onClick={handleTestPayment}
            className="w-full bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-8 py-3 text-lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <LogoSpinner size="small" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              "Test Payment"
            )}
          </Button>
        </div>

        <div className="bg-black/90 text-green-400 p-6 rounded-xl shadow-lg font-mono text-sm overflow-auto h-96">
          <h2 className="text-xl font-bold mb-4 text-white">Payment Logs</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Start a test payment to see logs.</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="break-words">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
