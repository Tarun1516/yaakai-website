// Load the Razorpay library
declare global {
  interface Window {
    Razorpay: any
  }
}

// Function to create a Razorpay order
async function createOrder() {
  try {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100, // 1 INR in paise (minimum amount)
        currency: "INR",
      }),
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || "Failed to create order")
    }

    return data.orderId
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function initiateRazorpayPayment(options: {
  amount: number
  currency: string
  name: string
  description: string
  orderId?: string
  email?: string
  contact?: string
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create an order first
      const orderId = await createOrder()

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => createRazorpayInstance(orderId)
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
        document.body.appendChild(script)
      } else {
        createRazorpayInstance(orderId)
      }
    } catch (error) {
      reject(error)
    }

    function createRazorpayInstance(orderId: string) {
      // For free products, use 1 rupee (100 paise) as the minimum amount
      // Razorpay doesn't support zero-amount payments
      const finalAmount = 100 // 1 INR in paise

      // Get the key from the server instead of using it directly
      fetch("/api/razorpay-key")
        .then((response) => response.json())
        .then((data) => {
          if (!data.key) {
            throw new Error("Failed to get Razorpay key")
          }

          const razorpay = new window.Razorpay({
            key: data.key,
            amount: finalAmount,
            currency: options.currency,
            name: options.name,
            description: options.description,
            order_id: orderId,
            handler: (response: any) => {
              // Payment successful
              resolve(response)
              // Redirect to success page
              window.location.href = "/checkout/success"
            },
            prefill: {
              email: options.email,
              contact: options.contact,
            },
            notes: {
              // Add a note to indicate this is a free product
              is_free_product: "true",
            },
            modal: {
              ondismiss: () => {
                // Payment canceled
                reject(new Error("Payment canceled"))
                // Redirect to cancel page
                window.location.href = "/checkout/cancel"
              },
            },
            theme: {
              color: "#f59f0a",
            },
          })

          razorpay.open()
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}

// For free products (₹0), we'll use a minimum amount of 1 rupee in Razorpay
// but display it as ₹0 to the user
export async function processZeroPayment(options: {
  name: string
  description: string
  email?: string
  contact?: string
}) {
  try {
    await initiateRazorpayPayment({
      amount: 0, // This will be converted to 1 rupee (100 paise) in initiateRazorpayPayment
      currency: "INR",
      name: options.name,
      description: options.description,
      email: options.email,
      contact: options.contact,
    })
  } catch (error) {
    console.error("Error processing zero payment:", error)
    throw error
  }
}
