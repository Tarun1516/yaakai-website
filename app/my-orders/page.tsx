"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"
import LogoSpinner from "@/components/LogoSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import BackButton from "@/components/BackButton"
import { getUserOrders, requestRefund, type Order as OrderType } from "@/lib/order-service"
import { sendRefundRequestEmail } from "@/app/actions/refund-email"
import { generateInvoicePDF } from "@/lib/invoice-generator"
import { getUserPayments, type PaymentRecord } from "@/lib/firebase-service"
import { FileText, Download } from "lucide-react"

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [orders, setOrders] = useState<OrderType[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [refundReason, setRefundReason] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setIsOrdersLoading(true)
        try {
          // Fetch both old orders and new payment records
          const userOrders = await getUserOrders(user.id)
          
          // Fetch payment records from Firebase
          const userPayments = await getUserPayments(user.id)
          
          // Remove duplicate payments (same paymentId)
          const uniquePayments = userPayments.filter((payment, index, self) =>
            index === self.findIndex(p => p.paymentId === payment.paymentId)
          )
          
          // Deduplicate: Remove orders that have matching paymentIds in payments
          const paymentIds = new Set(uniquePayments.map(payment => payment.paymentId))
          const uniqueOrders = userOrders.filter(order => 
            !order.transactionId || !paymentIds.has(order.transactionId)
          )
          
          setOrders(uniqueOrders)
          setPayments(uniquePayments)
          
          console.log("📋 Total orders found:", userOrders.length)
          console.log("💳 Total payments found:", userPayments.length)
          console.log("📋 Unique orders after deduplication:", uniqueOrders.length)
          console.log("🔄 Duplicates removed:", userOrders.length - uniqueOrders.length)
        } catch (error) {
          console.error("Error fetching orders:", error)
        } finally {
          setIsOrdersLoading(false)
        }
      }
    }

    fetchOrders()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LogoSpinner size="large" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">My Orders</h2>
          <p className="text-lg mb-6">Please log in to view your orders.</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
          >
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  const handleRefundClick = (orderId: string) => {
    setCurrentOrderId(orderId)
    setShowRefundDialog(true)
    setRefundReason("")
    setIssueDescription("")
  }

  const handleDownloadInvoice = (order: OrderType) => {
    if (!user) return
    
    try {
      const invoiceData = {
        userId: user.id,
        paymentId: order.transactionId || order.id,
        payerName: user.name || user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        modeOfPayment: 'Razorpay',
        applicationName: order.productName,
        amount: 1, // Fixed ₹1 price
        productType: order.productName.toLowerCase().includes('windows') ? 'windows' : 'linux',
        paymentTime: order.purchaseDate
      }
      
      generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  const handleDownloadInvoiceForPayment = async (payment: PaymentRecord) => {
    if (!user) return

    try {
      const invoiceData = {
        userId: payment.userId,
        paymentId: payment.paymentId,
        payerName: payment.userName,
        email: payment.userEmail,
        modeOfPayment: 'Razorpay',
        applicationName: payment.applicationName,
        amount: payment.amount,
        productType: payment.productType,
        paymentTime: payment.paymentTime
      }
      
      generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    }
  }

  const handleRefundSubmit = async () => {
    if (!refundReason || !issueDescription || !currentOrderId || !user) {
      return // Don't proceed if fields are empty
    }

    setIsSubmittingRefund(true)

    try {
      // Submit refund request to the system
      const success = await requestRefund({
        orderId: currentOrderId,
        userId: user.id,
        reason: refundReason,
        issueDescription: issueDescription,
      })

      if (success) {
        // Send email notification to company
        const emailResult = await sendRefundRequestEmail({
          orderId: currentOrderId,
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          reason: refundReason,
          issueDescription: issueDescription,
        })

        if (emailResult.success) {
          // Update order status in UI
          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === currentOrderId ? { ...order, status: "processing" } : order)),
          )

          // Close dialog
          setShowRefundDialog(false)
          setCurrentOrderId(null)
        } else {
          console.error("Failed to send email notification:", emailResult.message)
          // Still update UI even if email fails
          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === currentOrderId ? { ...order, status: "processing" } : order)),
          )
          setShowRefundDialog(false)
          setCurrentOrderId(null)
        }
      }
    } catch (error) {
      console.error("Error initiating refund:", error)
    } finally {
      setIsSubmittingRefund(false)
    }
  }

  // Format the ISO date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <BackButton />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

        {isOrdersLoading ? (
          <div className="flex items-center justify-center py-16">
            <LogoSpinner size="medium" />
          </div>
        ) : orders.length === 0 && payments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg mb-6">You haven't made any purchases yet.</p>
            <Button
              onClick={() => router.push("/explore-checkblock")}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
            >
              Explore CheckBlock
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Display new payment records first */}
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white/80 p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 border-l-4 border-green-500"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-OD8PNDRSMMyCEsJ6tT3rN7hbSdnha5.png"
                        alt={payment.applicationName}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{payment.applicationName} for {payment.productType}</h2>
                      <p className="text-gray-600 text-sm">Order ID: {payment.id}</p>
                      <p className="text-gray-600 text-sm">Payment ID: {payment.paymentId}</p>
                      <p className="text-gray-600 text-sm">User ID: {payment.userId}</p>
                      <p className="text-gray-600 text-sm">Purchased: {formatDate(payment.paymentTime)}</p>
                      <p className="text-gray-600 text-sm">Amount: ₹{payment.amount}</p>
                      <div className="mt-1">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 md:flex">
                    <Button
                      onClick={() => handleDownloadInvoiceForPayment(payment)}
                      className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-4 py-2 text-sm flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Download Invoice
                    </Button>
                    <Button
                      onClick={() => handleRefundClick(payment.id)}
                      variant="outline"
                      className="border-2 border-black rounded-full px-4 py-2 text-sm"
                    >
                      Request Refund
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Display old orders */}
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/80 p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-OD8PNDRSMMyCEsJ6tT3rN7hbSdnha5.png"
                        alt={order.productName}
                        width={64}
                        height={64}
                        className="rounded-md object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{order.productName}</h2>
                      <p className="text-gray-600 text-sm">Order ID: {order.id}</p>
                      {order.transactionId && (
                        <p className="text-gray-600 text-sm">Payment ID: {order.transactionId}</p>
                      )}
                      <p className="text-gray-600 text-sm">User ID: {order.userId}</p>
                      <p className="text-gray-600 text-sm">Purchased: {formatDate(order.purchaseDate)}</p>
                      <p className="text-gray-600 text-sm">Quantity: {order.quantity}</p>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "refunded"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "completed"
                            ? "Completed"
                            : order.status === "refunded"
                              ? "Refunded"
                              : "Processing Refund"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2 md:flex">
                    {order.status === "completed" && (
                      <>
                        <Button
                          onClick={() => handleDownloadInvoice(order)}
                          className="w-full md:w-auto bg-blue-500 text-white border-2 border-blue-500 hover:bg-blue-600 rounded-full"
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          Download Invoice
                        </Button>
                        <Button
                          onClick={() => handleRefundClick(order.id)}
                          variant="outline"
                          className="w-full md:w-auto border-2 border-black rounded-full hover:bg-red-50 text-red-600"
                        >
                          Request Refund
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Refund Request Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Request Refund</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="reason">
                Why do you need a refund?
              </label>
              <Textarea
                id="reason"
                placeholder="Please explain your reason for requesting a refund"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="issue">
                What is the issue with the website or the application?
              </label>
              <Textarea
                id="issue"
                placeholder="Please describe any issues you experienced"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              onClick={handleRefundSubmit}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6"
              disabled={isSubmittingRefund || !refundReason || !issueDescription}
            >
              {isSubmittingRefund ? <LogoSpinner size="small" /> : "Submit Refund Request"}
            </Button>
            <Button
              onClick={() => setShowRefundDialog(false)}
              variant="outline"
              className="border-2 border-black rounded-full px-6"
              disabled={isSubmittingRefund}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
