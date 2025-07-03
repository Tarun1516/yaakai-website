"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { XCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function CheckoutCancel() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-16">
      <Button onClick={() => router.push("/")} variant="ghost" className="mb-8 hover:bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg text-center"
      >
        <div className="flex justify-center mb-6">
          <XCircle className="h-24 w-24 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-lg mb-8">Payment failed. Please re-do the payment.</p>

        <div className="mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg"
            alt="Yaakai Logo"
            width={100}
            height={100}
            className="mx-auto rounded-full border-2 border-[#f59f0a] outline outline-1 outline-[#f59f0a]"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push("/cart")}
            className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
          >
            Return to Cart
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-2 border-[#f59f0a] hover:bg-[#f59f0a]/10 rounded-full px-6 py-2"
          >
            Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
