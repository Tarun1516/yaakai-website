"use client"

import { useCart } from "@/lib/CartContext"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import LogoSpinner from "@/components/LogoSpinner"
import LoginDialog from "@/components/LoginDialog"
import SignUpDialog from "@/components/SignUpDialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createOrder } from "@/lib/order-service"

export default function Cart() {
  const router = useRouter()
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const { user, isLoading } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    // Set quantities from cart items
    if (cartItems.length > 0) {
      setQuantities(Object.fromEntries(cartItems.map((item) => [item.id, item.quantity])))
    }
  }, [cartItems])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }))
      updateQuantity(id, newQuantity)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + 1 * (quantities[item.id] || item.quantity), 0)

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setIsSignUpOpen(false)
  }

  const handleSignUpClick = () => {
    setIsSignUpOpen(true)
    setIsLoginOpen(false)
  }

  // Placeholder for Forgot Password functionality
  const handleForgotPasswordClick = () => {
    console.log("Forgot password clicked")
    // TODO: Implement forgot password logic
  }

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Razorpay) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    if (!user) {
      handleLoginClick()
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      // Load Razorpay script first
      console.log("Loading Razorpay script...")
      await loadRazorpayScript()
      console.log("Razorpay script loaded successfully")

      // Calculate total amount in paise for Razorpay (₹1 per item)
      const totalAmountInPaise = cartItems.reduce((sum, item) => sum + 1 * (quantities[item.id] || item.quantity), 0) * 100;
      // Ensure a minimum amount for Razorpay if the total is 0 (e.g., for free items)
      const finalAmountForRazorpay = totalAmountInPaise === 0 ? 100 : totalAmountInPaise;

      // Create a proper Razorpay order via backend API
      console.log("Creating Razorpay order via backend...")
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmountForRazorpay,
          currency: "INR",
          receipt: `cart_${Date.now()}`,
          notes: {
            cart_items: cartItems.map(item => `${item.name} (${quantities[item.id] || item.quantity})`).join(", "),
            user_id: user.id,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Razorpay options
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key is not configured");
      }

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Yaakai",
        description: "CheckBlock Purchase",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log("Payment successful and auto-captured:", response);

          try {
            // For now, set a default payment method that shows it's a card/UPI payment
            // In a real implementation, you would get this from Razorpay payment details API
            const paymentMethod = 'Credit/Debit Card'; // Default assumption for online payments
            
            // Store payment method for success page
            localStorage.setItem('paymentMethod', paymentMethod);
            
            // Since auto-capture is enabled, the payment is already captured
            // No need for manual capture - just create orders and proceed
            console.log("Processing order creation for cart items...");

            // Create orders for each item in the cart
            for (const item of cartItems) {
              // Detect product type from item name or ID
              const productType = item.name.toLowerCase().includes('windows') ? 'windows' : 
                                 item.name.toLowerCase().includes('linux') ? 'linux' : 
                                 item.productId.includes('windows') ? 'windows' :
                                 item.productId.includes('linux') ? 'linux' : 'windows' // default
              
              // Store the detected product type for the success page
              localStorage.setItem('selectedProductType', productType)
              
              await createOrder({
                userId: user.id,
                productId: item.id,
                productName: item.name,
                quantity: quantities[item.id] || item.quantity,
                transactionId: response.razorpay_payment_id,
              });
            }

            // Clear the cart and redirect to success page with payment ID
            localStorage.setItem('lastPaymentId', response.razorpay_payment_id);
            clearCart();
            router.push(`/checkout/success?paymentId=${response.razorpay_payment_id}`);

          } catch (error) {
            console.error("Error during post-payment processing (order creation):", error);
            setPaymentError(
              "Payment was successful, but there was an error processing your order. Please contact support."
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed")
            setIsProcessing(false)
          },
        },
      }

      console.log("Initializing Razorpay with options:", JSON.stringify(options, null, 2))

      // Create and open Razorpay instance
      const razorpay = new window.Razorpay(options)

      razorpay.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error)
        setPaymentError(`Payment failed: ${response.error.description || "Unknown error"}`)
        setIsProcessing(false)
      })

      // Open Razorpay payment form
      razorpay.open()
    } catch (error: any) {
      console.error("Error during checkout:", error)
      setPaymentError(error.message || "An error occurred during payment processing")
      setIsProcessing(false)
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
    <>
      <div className="container mx-auto px-4 py-16">
        <Button onClick={() => router.back()} variant="ghost" className="mb-8 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        {paymentError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{paymentError}</AlertDescription>
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty.</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Added product logo */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-OD8PNDRSMMyCEsJ6tT3rN7hbSdnha5.png"
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p className="text-gray-600">Price: ₹2</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity) - 1)}
                        className="w-8 h-8 rounded-full border border-black text-black bg-transparent hover:bg-transparent"
                        disabled={(quantities[item.id] || item.quantity) <= 1}
                      >
                        -
                      </Button>
                      <span className="mx-2 min-w-[2ch] text-center">{quantities[item.id] || item.quantity}</span>
                      <Button
                        onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity) + 1)}
                        className="w-8 h-8 rounded-full bg-[#f59f0a] text-black border border-black hover:bg-[#f59f0a]/90"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-semibold">Subtotal: ₹{(quantities[item.id] || item.quantity) * 1}</p>
                    <Button onClick={() => removeFromCart(item.id)} variant="destructive" className="rounded-full">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartItems.reduce((sum, item) => sum + 1 * (quantities[item.id] || item.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{cartItems.reduce((sum, item) => sum + 1 * (quantities[item.id] || item.quantity), 0)}</span>
                  </div>
                </div>
                {user ? (
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-8 py-3 text-lg"
                    disabled={cartItems.length === 0 || isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <LogoSpinner size="small" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      "Proceed to Pay"
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center text-gray-700">Please log in to complete your purchase</p>
                    <Button
                      onClick={handleLoginClick}
                      className="w-full bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-8 py-3"
                    >
                      Login to Continue
                    </Button>
                    <p className="text-center text-sm">
                      Don't have an account?{" "}
                      <button onClick={handleSignUpClick} className="text-blue-600 hover:underline">
                        Sign Up
                      </button>
                    </p>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-600 text-center">
                  For enterprise inquiries, please contact:
                  <br />
                  <a href="mailto:yaakai1516@gmail.com" className="text-[#f59f0a] hover:underline">
                    yaakai1516@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSignUpClick={handleSignUpClick}
        onForgotPasswordClick={handleForgotPasswordClick}
      />

      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onLoginClick={handleLoginClick} />
    </>
  )
}
