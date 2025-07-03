"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ArrowLeft, Download, FileText, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/lib/CartContext"
import { useAuth } from "@/lib/AuthContext"
import LogoSpinner from "@/components/LogoSpinner"
import { generateInvoicePDF } from "@/lib/invoice-generator"
import { savePaymentRecord } from "@/lib/firebase-service"

interface PaymentDetails {
  id: string
  amount: number
  currency: string
  productType: string
  paymentTime: string
  applicationName: string
  method?: string
}

interface DownloadUrls {
  windows?: string
  linux?: string
  invoice?: string
}

interface DownloadResponse {
  success: boolean
  downloadUrl?: string
  fileName?: string
  message?: string
  error?: string
  details?: any
}

export default function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [selectedProductType, setSelectedProductType] = useState<string>('windows')
  const [secureDownloadUrl, setSecureDownloadUrl] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  // Your Val.town API URL
  const VAL_TOWN_API_URL = "https://fakeid--a8e875d6544f11f0be19f69ea79377d9.web.val.run";

  // Function to generate secure token
  const generateSecureToken = async (paymentId: string): Promise<string> => {
    const secret = "mysecretkey123"
    const encoder = new TextEncoder()
    const data = encoder.encode(paymentId + secret)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Function to get secure download URL from Val.town
  const getSecureDownloadUrl = async (paymentId: string, fileType: string): Promise<string | null> => {
    try {
      const verificationToken = await generateSecureToken(paymentId)
      
      console.log("🚀 Calling Val.town API:", VAL_TOWN_API_URL)
      console.log("📦 Request payload:", { 
        paymentId, 
        fileType, 
        tokenLength: verificationToken.length,
        tokenPreview: verificationToken.substring(0, 10) + "..."
      })
      
      const response = await fetch(VAL_TOWN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentId,
          fileType: fileType,
          verificationToken: verificationToken
        })
      })

      console.log("📡 Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Val.town API error:", response.status, errorText)
        
        // Try to parse as JSON for better error details
        try {
          const errorData = JSON.parse(errorText)
          setDownloadError(`API Error: ${errorData.error || 'Unknown error'}`)
          console.error("❌ Error details:", errorData)
        } catch {
          setDownloadError(`HTTP ${response.status}: ${errorText}`)
        }
        return null
      }

      const data: DownloadResponse = await response.json()
      console.log("✅ Val.town API response:", data)
      
      if (data.success && data.downloadUrl) {
        console.log("✅ Secure download URL generated successfully")
        setDownloadError(null) // Clear any previous errors
        return data.downloadUrl
      } else {
        console.error("❌ Failed to get download URL:", data.error)
        setDownloadError(data.error || 'Failed to generate download link')
        return null
      }
    } catch (error) {
      console.error('❌ Error calling Val.town API:', error)
      setDownloadError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        console.log("🎉 Processing payment success...")
        clearCart()
        
        // Get payment ID from URL parameters or localStorage
        const paymentId = searchParams?.get('paymentId') || 
                         searchParams?.get('payment') ||
                         localStorage.getItem('lastPaymentId') ||
                         'test_' + Date.now() // Fallback for testing
        
        console.log("💳 Payment ID:", paymentId)
        
        // Get selected product type from localStorage (set during cart selection)
        const storedProductType = localStorage.getItem('selectedProductType') || 'windows'
        setSelectedProductType(storedProductType)
        console.log("📱 Product Type:", storedProductType)
        
        if (paymentId) {
          // Try to get payment method from localStorage (set during payment)
          let paymentMethod = localStorage.getItem('paymentMethod') || 'Online'
          
          // If payment method is not in localStorage, try to get from URL parameters
          if (paymentMethod === 'Online') {
            const methodFromUrl = searchParams?.get('method') || 
                                 searchParams?.get('payment_method')
            if (methodFromUrl) {
              paymentMethod = methodFromUrl
            }
          }
          
          // Format payment method for display
          const formatPaymentMethod = (method: string) => {
            switch (method.toLowerCase()) {
              case 'card':
                return 'Credit/Debit Card'
              case 'upi':
                return 'UPI'
              case 'netbanking':
                return 'Internet Banking'
              case 'wallet':
                return 'Digital Wallet'
              case 'emi':
                return 'EMI'
              case 'bank_transfer':
                return 'Bank Transfer'
              case 'paylater':
                return 'Pay Later'
              default:
                return 'Online Payment'
            }
          }
          
          // Create mock payment details
          const mockPaymentDetails: PaymentDetails = {
            id: paymentId,
            amount: 1, // ₹1 as per requirement
            currency: 'INR',
            productType: storedProductType,
            paymentTime: new Date().toISOString(),
            applicationName: 'CheckBlock',
            method: formatPaymentMethod(paymentMethod)
          }
          
          setPaymentDetails(mockPaymentDetails)

          // Get secure download URL from Val.town in background
          console.log("🔗 Getting secure download URL from Val.town...")
          const downloadUrl = await getSecureDownloadUrl(paymentId, storedProductType)
          if (downloadUrl) {
            setSecureDownloadUrl(downloadUrl)
          }
          
          // Save payment data to Firebase if user is logged in
          if (user) {
            try {
              console.log("💾 Saving payment data to Firebase...")
              await savePaymentRecord({
                paymentId: paymentId,
                userId: user.id,
                userEmail: user.email || '',
                userName: user.name || user.email?.split('@')[0] || 'Customer',
                amount: 1,
                currency: 'INR',
                productType: storedProductType,
                applicationName: 'CheckBlock',
                paymentTime: new Date().toISOString(),
                status: 'completed'
              })
              console.log("✅ Payment data saved successfully")
            } catch (error: any) {
              console.error("❌ Error saving payment data:", error)
              
              if (error.message?.includes('Permission denied') || error.code === 'permission-denied') {
                console.warn("🔒 Firebase permission issue - payment still successful, but data not saved")
                // Don't show error to user as payment was successful
              } else {
                console.error("💥 Unexpected error:", error)
              }
              
              // Continue even if saving fails - don't block the user
            }
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("💥 Error processing payment success:", error)
        setIsLoading(false)
      }
    }

    handleSuccess()
  }, [searchParams, clearCart])

  const handleDownloadApplication = () => {
    // Try secure download URL first (from Val.town)
    if (secureDownloadUrl) {
      console.log("⬇️ Using secure download URL from Val.town")
      const link = document.createElement('a')
      link.href = secureDownloadUrl
      // CORRECTED DOWNLOAD FILE NAMES
      link.download = selectedProductType === 'windows' ? 'CheckBlock-1.0.0-setup.exe' : 'checkblock_1.0.0_amd64.deb'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Show error if no secure URL and there was an error
    if (downloadError) {
      alert(`Download failed: ${downloadError}\n\nPlease contact support or try again later.`)
      return
    }

    // Fallback to environment variable URLs (original method)
    console.log("⬇️ Falling back to environment variable URLs")
    const downloadUrls = {
      windows: process.env.NEXT_PUBLIC_WINDOWS_APP_URL,
      linux: process.env.NEXT_PUBLIC_LINUX_APP_URL
    }
    
    const url = selectedProductType === 'windows' ? downloadUrls.windows : downloadUrls.linux
    
    if (!url) {
      alert('Download URL not configured. Please contact support.')
      return
    }
    
    // Create a temporary link and click it to download
    const link = document.createElement('a')
    link.href = url
    // CORRECTED DOWNLOAD FILE NAMES FOR FALLBACK
    link.download = selectedProductType === 'windows' ? 'CheckBlock-1.0.0-setup.exe' : 'checkblock_1.0.0_amd64.deb'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadInvoice = async () => {
    if (!paymentDetails || !user) return
    
    try {
      console.log("📄 Generating invoice...")
      // Generate invoice PDF on client side
      const invoiceData = {
        userId: user.id,
        paymentId: paymentDetails.id,
        payerName: user.name || user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        modeOfPayment: 'Razorpay',
        applicationName: paymentDetails.applicationName,
        amount: paymentDetails.amount,
        productType: selectedProductType,
        paymentTime: paymentDetails.paymentTime
      }
      
      generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error('❌ Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LogoSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Button onClick={() => router.push("/")} variant="ghost" className="mb-8 hover:bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-lg mb-8 text-gray-700">
          Below are your invoice and the download link for your application
        </p>

        {/* Download Error Display */}
        {downloadError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{downloadError}</span>
          </div>
        )}

        {/* Success Message */}
        {secureDownloadUrl && !downloadError && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Secure download link generated successfully!</span>
          </div>
        )}

        {/* Payment Details */}
        {paymentDetails && (
          <div className="mb-8 p-6 bg-white/50 rounded-lg text-left">
            <h3 className="font-bold text-lg mb-4 text-center">Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm"><strong>User ID:</strong> {user?.id}</p>
                <p className="text-sm"><strong>Payment ID:</strong> {paymentDetails.id}</p>
                <p className="text-sm"><strong>Payer Name:</strong> {user?.name || user?.email}</p>
                <p className="text-sm"><strong>Email ID:</strong> {user?.email}</p>
              </div>
              <div>
                <p className="text-sm"><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
                <p className="text-sm"><strong>Mode of Payment:</strong> {paymentDetails.method || 'Online Payment'}</p>
                <p className="text-sm"><strong>Application Name:</strong> {paymentDetails.applicationName}</p>
                <p className="text-sm"><strong>Date:</strong> {new Date(paymentDetails.paymentTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <Button
            onClick={handleDownloadInvoice}
            className="bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 rounded-full px-6 py-2 transition-colors duration-300"
            style={{ borderWidth: '0.5px' }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Invoice Download
          </Button>
          
          <Button
            onClick={handleDownloadApplication}
            className="bg-green-500 text-white border border-green-600 hover:bg-green-600 rounded-full px-6 py-2 transition-colors duration-300"
            style={{ borderWidth: '0.5px' }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Application
          </Button>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={() => router.push("/")}
            className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => router.push("/my-orders")}
            variant="outline"
            className="border-2 border-[#f59f0a] hover:bg-[#f59f0a]/10 rounded-full px-6 py-2"
          >
            View My Orders
          </Button>
        </div>
      </motion.div>
    </div>
  )
}