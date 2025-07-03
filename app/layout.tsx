import type React from "react"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"
import { CartProvider } from "@/lib/CartContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Yaakai",
  description:
    "Advanced cybersecurity solutions for VPN detection and blocking. CheckBlock by Yaakai provides innovative network security tools to protect your business.",
  keywords:
    "vpn, vpn detector, vpn blocker, vpn detector and blocker, checkblock, yaakai, cyber security, network, network security, smart security, stronger future",
  openGraph: {
    title: "Yaakai",
    description:
      "Advanced VPN detection and blocking solutions. CheckBlock by Yaakai provides innovative cybersecurity tools.",
    url: "https://yaakai.com",
    siteName: "Yaakai",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg",
        width: 800,
        height: 600,
        alt: "Yaakai Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaakai",
    description:
      "Advanced VPN detection and blocking solutions. CheckBlock by Yaakai provides innovative cybersecurity tools.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg",
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Yaakai - Innovative Cybersecurity Solutions</title>
        <meta
          name="description"
          content="Yaakai provides innovative cybersecurity solutions designed to keep your business safe."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yaakai.com" />
        <meta name="author" content="Yaakai" />
        <style>{`
          body {
            background-color: white;
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-white`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="pt-16 bg-white">{children}</div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
