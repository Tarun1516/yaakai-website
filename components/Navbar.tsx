"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/CartContext"
import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"
import LogoSpinner from "@/components/LogoSpinner"
import LoginDialog from "@/components/LoginDialog"
import SignUpDialog from "@/components/SignUpDialog"

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home")
  const { cartItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  // Update the useEffect hook to check for authentication on mount and handle navigation
  useEffect(() => {
    // Handle section detection based on scroll position
    const handleScroll = () => {
      const sections = ["home", "products", "about", "contact", "profile"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom > 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    // Set active section based on pathname
    if (pathname === "/") {
      setActiveSection("home")
      window.addEventListener("scroll", handleScroll)
    } else if (pathname.includes("/products")) {
      setActiveSection("products")
    } else if (pathname.includes("/about")) {
      setActiveSection("about")
    } else if (pathname.includes("/contact")) {
      setActiveSection("contact")
    } else if (pathname.includes("/profile")) {
      setActiveSection("profile")
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const handleNavigation = (sectionId: string) => {
    if (pathname === "/") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setActiveSection(sectionId)
      }
    } else {
      router.push(`/#${sectionId}`)
      setActiveSection(sectionId)
    }
  }

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setIsSignUpOpen(false)
  }

  const handleSignUpClick = () => {
    setIsSignUpOpen(true)
    setIsLoginOpen(false)
  }

  // Make sure we're properly checking the user state
  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <LogoSpinner size="small" />
        </div>
      )
    }

    if (!user) {
      return (
        <>
          <Button
            onClick={handleLoginClick}
            variant="outline"
            className="rounded-full border border-black text-black hover:bg-transparent whitespace-nowrap"
          >
            Login
          </Button>
          <Button
            onClick={handleSignUpClick}
            variant="outline"
            className="rounded-full border-2 border-black bg-[#f59f0a] text-black hover:bg-[#f59f0a]/90 whitespace-nowrap"
          >
            Sign Up
          </Button>
        </>
      )
    }

    return (
      <>
        <Button
          onClick={() => handleNavigation("profile")}
          variant="outline"
          className="rounded-full border-2 border-black bg-[#f59f0a] text-black hover:bg-[#f59f0a]/90 whitespace-nowrap"
        >
          <User className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap">My Profile</span>
        </Button>
        <Button
          onClick={() => router.push("/cart")}
          variant="outline"
          className="rounded-full border-2 border-black bg-[#f59f0a] text-black hover:bg-[#f59f0a]/90 whitespace-nowrap"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({cartItems.length})
        </Button>
        <Button
          onClick={logout}
          variant="outline"
          className="rounded-full border border-black text-black hover:bg-transparent"
        >
          Logout
        </Button>
      </>
    )
  }

  // Update the return statement to use the renderAuthButtons function
  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4">
        <div className="flex items-center space-x-2 backdrop-blur-md bg-[#fefeff]/30 rounded-full shadow-lg px-4 py-2">
          <motion.div whileHover={{ scale: 1.05 }} className="mr-2" onClick={() => router.push("/")}>
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#f59f0a] outline outline-1 outline-[#f59f0a] cursor-pointer bg-white">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg"
                alt="YAAKAI Logo"
                fill
                className="object-cover"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#f59f0a]/10 to-transparent"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          <div className="flex space-x-2">
            <NavButton active={activeSection === "home"} onClick={() => handleNavigation("home")}>
              Home
            </NavButton>
            <NavButton active={activeSection === "products"} onClick={() => handleNavigation("products")}>
              Products
            </NavButton>
            <NavButton active={activeSection === "about"} onClick={() => handleNavigation("about")}>
              <span className="whitespace-nowrap">About Us</span>
            </NavButton>
            <NavButton active={activeSection === "contact"} onClick={() => handleNavigation("contact")}>
              <span className="whitespace-nowrap">Contact Us</span>
            </NavButton>
          </div>
          <div className="flex space-x-2 ml-4">{renderAuthButtons()}</div>
        </div>
      </nav>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} onSignUpClick={handleSignUpClick} />

      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onLoginClick={handleLoginClick} />
    </>
  )
}

const NavButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <Button
    onClick={onClick}
    variant="ghost"
    className={`
  transition-all duration-300 ease-in-out
  rounded-full hover:rounded-lg 
  ${active ? "scale-105 bg-black text-white" : "bg-transparent text-black hover:bg-black/10"} 
  px-4 py-2
  transform
  hover:scale-105
  active:scale-95
`}
  >
    {children}
  </Button>
)

export default Navbar
