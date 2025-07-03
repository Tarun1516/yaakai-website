// Define types for Razorpay

// More specific response types
interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayErrorResponseData {
  code: string;
  description: string;
  source?: string;
  step?: string;
  reason?: string;
  metadata?: object; // Or be more specific if structure is known
}

interface RazorpayErrorResponse {
  error: RazorpayErrorResponseData;
}

// Updated RazorpayOptions
interface RazorpayOptions {
  key: string;
  amount: number; // amount in the smallest currency unit
  currency: string;
  name: string;
  description?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>; // Changed from Record<string, string> to Record<string, any> for flexibility
  theme?: {
    color?: string;
    [key: string]: any; // Allow other theme properties
  };
  handler?: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
    [key: string]: any; // Allow other modal properties
  };
  [key: string]: any; // Allow other top-level properties Razorpay might use
}

// Define the Razorpay instance type
interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", callback: (response: RazorpayErrorResponse) => void) => void;
  // Add other event signatures if used, e.g.:
  // on: (event: string, callback: (response: any) => void) => void;
  // If only 'payment.failed' is used, the above is fine.
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Load the Razorpay script
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
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

// Get Razorpay key from server
async function getRazorpayKey(): Promise<string> {
  const response = await fetch("/api/razorpay-key")
  const data = await response.json()

  if (!data.success || !data.key) {
    throw new Error("Failed to get Razorpay key")
  }

  return data.key
}

// Initialize Razorpay checkout
export async function initializeRazorpayCheckout(options: Omit<RazorpayOptions, "key">): Promise<any> {
  await loadRazorpayScript()
  const key = await getRazorpayKey()

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      key,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      handler: (response: any) => {
        resolve(response)
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment canceled by user"))
        },
      },
    })

    razorpay.open()
  })
}

// Process a payment with Razorpay
export async function processPayment(options: {
  amount: number
  currency: string
  name: string
  description: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
}): Promise<any> {
  try {
    // For testing, we'll create a simple order directly
    // No need for order_id for basic payments

    // For free products, use 1 rupee (100 paise) as the minimum amount
    const finalAmount = options.amount === 0 ? 100 : options.amount * 100 // Convert to paise

    // Initialize checkout with the key from server
    return await initializeRazorpayCheckout({
      amount: finalAmount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      notes: {
        ...options.notes,
        is_free_product: options.amount === 0 ? "true" : "false",
      },
      theme: { color: "#f59f0a" },
    })
  } catch (error) {
    console.error("Error processing payment:", error)
    throw error
  }
}
