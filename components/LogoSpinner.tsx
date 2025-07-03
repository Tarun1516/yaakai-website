"use client"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LogoSpinner({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeMap = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 100, height: 100 },
  }

  const { width, height } = sizeMap[size]

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative overflow-hidden rounded-full border-2 border-[#f59f0a] outline outline-1 outline-[#f59f0a] bg-white"
        style={{ width, height }}
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 4, // Slowed down from 2 to 4 seconds
            ease: "linear",
          },
          scale: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 2.5, // Slowed down from 1.5 to 2.5 seconds
            ease: "easeInOut",
          },
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg"
          alt="YAAKAI Logo"
          fill
          className="object-cover"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#f59f0a]/20 to-transparent"
          animate={{
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3, // Slowed down and made more subtle
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
