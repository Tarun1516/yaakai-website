"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { ScrollAnimation } from "@/components/ScrollAnimation"
import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import ProfileSection from "@/components/ProfileSection"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/CartContext"
import LoginDialog from "@/components/LoginDialog"
import SignUpDialog from "@/components/SignUpDialog"
import OSSelectionDialog from "@/components/OSSelectionDialog"
import { sendContactEmail } from "./actions/contact"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import LogoSpinner from "@/components/LogoSpinner"
import NetworkStatus from "@/components/NetworkStatus"

// Helper components remain the same
const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`min-h-screen w-full flex flex-col items-center justify-center py-32 px-4 ${className}`}>
    {children}
  </section>
)

const FeatureCard = ({ title, description, delay }: { title: string; description: string; delay: number }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
  >
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <p className="text-lg">{description}</p>
  </motion.div>
)

const AboutCard = ({ title, content }: { title: string; content: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-lg leading-relaxed">{content}</p>
  </motion.div>
)

const TypewriterEffect = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)
  const [currentText, setCurrentText] = React.useState("")

  React.useEffect(() => {
    let timeout: NodeJS.Timeout

    if (currentText.length < texts[currentTextIndex].length) {
      timeout = setTimeout(() => {
        setCurrentText(texts[currentTextIndex].slice(0, currentText.length + 1))
      }, 100)
    } else {
      timeout = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        setCurrentText("")
      }, 2000)
    }

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, texts])

  return (
    <motion.p
      className="text-2xl mb-12 h-16 min-h-[4rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {currentText}
    </motion.p>
  )
}

const Footer = () => (
  <footer className="w-full bg-white/30 backdrop-blur-md py-8 mt-20">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Yaakai</h3>
          <p className="text-sm mb-2">"Smart Security, Stronger Future."</p>
          <p className="text-sm">© 2025 All rights reserved.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="text-sm hover:text-[#f59f0a]">
                Home
              </a>
            </li>
            <li>
              <a href="#products" className="text-sm hover:text-[#f59f0a]">
                Products
              </a>
            </li>
            <li>
              <a href="#about" className="text-sm hover:text-[#f59f0a]">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="text-sm hover:text-[#f59f0a]">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2">
            <li className="text-sm">Email: yaakai1516@gmail.com</li>
            <li className="text-sm">Location: Salem, Tamilnadu</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
)

// Add this function right before the Home component definition
function JsonLd({ data }: { data: any }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default function ClientPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [isOSDialogOpen, setIsOSDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fix: Provide default values for destructuring
  const auth = useAuth()
  const user = auth?.user || null
  const authLoading = auth?.isLoading || false

  // Contact form states
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")

  // Fix: Correct useState syntax
  const [contactStatus, setContactStatus] = useState<{
    success?: boolean
    message?: string
    errors?: Record<string, string[]>
  } | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check for the flag to open signup dialog when returning from policy pages
  useEffect(() => {
    const shouldOpenSignup = localStorage.getItem("openSignupDialog")
    if (shouldOpenSignup === "true") {
      // Clear the flag
      localStorage.removeItem("openSignupDialog")
      // Open the signup dialog
      setIsSignUpOpen(true)
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleAddToCart = () => {
    setIsOSDialogOpen(true)
  }

  const handleOSSelect = (osType: string) => {
    addToCart({
      productId: `checkblock-${osType.toLowerCase()}`,
      name: `CheckBlock for ${osType}`,
      price: 1,
      quantity: 1,
    })
    router.push("/cart")
  }

  const handleExploreMore = () => {
    router.push("/explore-checkblock")
  }

  const handleLoginClick = () => {
    setIsLoginOpen(true)
    setIsSignUpOpen(false)
  }

  const handleSignUpClick = () => {
    setIsSignUpOpen(true)
    setIsLoginOpen(false)
  }

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to products page
      router.push("/products")
    } else {
      // If user is not logged in, open login dialog
      handleLoginClick()
    }
  }

  // Handle forgot password click
  const handleForgotPasswordClick = () => {
    router.push("/forgot-password")
  }

  // Add this after other useEffect hooks
  useEffect(() => {
    // Check if redirected from change password page with login=true parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("login") === "true") {
      setIsLoginOpen(true)
    }
  }, [])

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setContactStatus(null)

    try {
      const formData = new FormData()
      formData.append("name", contactName)
      formData.append("email", contactEmail)
      formData.append("message", contactMessage)

      const result = await sendContactEmail(formData)

      setContactStatus(result)

      if (result.success) {
        // Reset form on success
        setContactName("")
        setContactEmail("")
        setContactMessage("")
      }
    } catch (error) {
      setContactStatus({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this inside the Home component, right after the opening return statement
  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LogoSpinner size="large" />
      </div>
    )
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Yaakai",
          url: "https://yaakai.com",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg",
          description: "Yaakai provides innovative cybersecurity solutions including VPN detection and blocking tools.",
          sameAs: ["https://twitter.com/yaakai", "https://facebook.com/yaakai", "https://linkedin.com/company/yaakai"],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Salem",
            addressRegion: "Tamilnadu",
            addressCountry: "India",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "yaakai1516@gmail.com",
          },
          potentialAction: {
            "@type": "SearchAction",
            target: "https://yaakai.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "CheckBlock",
          description:
            "Advanced cybersecurity solution designed to detect and block VPN connections, ensuring secure and authentic network access.",
          brand: {
            "@type": "Brand",
            name: "Yaakai",
          },
          offers: {
            "@type": "Offer",
            price: "3",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
          category: "Cybersecurity Software",
          keywords:
            "vpn, vpn detector, vpn blocker, vpn detector and blocker, checkblock, cyber security, network security",
        }}
      />
      <NetworkStatus />

      {/* Main content with white background */}
      <div className="min-h-screen bg-white">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {/* Hidden semantic content for SEO */}
            <div className="sr-only">
              <h2>Yaakai - Advanced VPN Detection and Blocking Solutions</h2>
              <p>
                Yaakai provides innovative cybersecurity solutions including VPN detection and blocking tools. Our
                flagship product CheckBlock is designed to monitor network activity, detect active VPN usage, and block
                unauthorized VPN connections, ensuring network security for your business.
              </p>
              <ul>
                <li>VPN Detector</li>
                <li>VPN Blocker</li>
                <li>Network Security</li>
                <li>Cyber Security</li>
                <li>Smart Security, Stronger Future</li>
              </ul>
            </div>

            {/* Home section */}
            <Section id="home">
              {/* Company logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="mb-16 relative"
              >
                <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-full shadow-lg border-4 border-[#f59f0a]/30 outline outline-2 outline-[#f59f0a] bg-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pudulogo.jpg-mvrS25XFfLYuKDc1Sr7XiiJFqCC1zI.jpeg"
                    alt="YAAKAI Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#f59f0a]/10 to-transparent"
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>

              {/* Typewriter effect */}
              <TypewriterEffect
                texts={[
                  "Innovative Cybersecurity Solutions",
                  "Affordable | Secure | Reliable",
                  "Protecting Your Business, One Layer at a Time",
                ]}
              />

              {/* Main content */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full max-w-4xl mx-auto mb-24"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Cybersecurity Reinvented!</h2>
                  <p className="text-xl mb-4">Your data, your security—our priority.</p>
                  <p className="text-xl mb-8">
                    <strong>Next-gen cyber solutions</strong> designed to keep your business safe.
                  </p>
                  <p className="text-lg mb-8">🔐 100% Tested | Easy to Implement | Cutting-Edge Technology</p>
                  <Button
                    className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-all duration-300 bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 hover:text-white"
                    onClick={handleGetStarted}
                  >
                    Get Started →
                  </Button>
                </div>
              </motion.div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
                <FeatureCard
                  title="Advanced Security"
                  description="Modern cyber solutions tailored for you."
                  delay={0.2}
                />
                <FeatureCard
                  title="Affordable Pricing"
                  description="High-end protection without high-end costs."
                  delay={0.4}
                />
                <FeatureCard title="Tested & Trusted" description="Rigorous testing ensures safety." delay={0.6} />
                <FeatureCard title="Easy Integration" description="No complex setups, just security!" delay={0.8} />
              </div>
            </Section>

            {/* Products section */}
            <Section id="products">
              <ScrollAnimation className="w-full max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Our Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="col-span-full lg:col-span-1">
                    <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <div className="flex flex-col items-center">
                        {/* Product logo */}
                        <div className="w-full h-32 rounded-lg mb-2 flex items-center justify-center relative">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-OD8PNDRSMMyCEsJ6tT3rN7hbSdnha5.png"
                            alt="CHECKBLOCK Logo"
                            width={200}
                            height={80}
                            className="object-contain"
                            priority
                          />
                        </div>
                        {/* Product name - Moved down by adding more margin-top */}
                        <div className="w-full bg-white/90 py-2 px-4 rounded-lg mb-4 mt-6">
                          <h3 className="text-xl font-semibold text-center">CheckBlock</h3>
                        </div>
                        <p className="text-center mb-8">
                          Advanced cybersecurity solution designed to detect and block VPN connections, ensuring secure
                          and authentic network access.
                        </p>
                        <div className="flex space-x-4 mt-auto">
                          <Button
                            onClick={handleAddToCart}
                            className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
                          >
                            Add to Cart
                          </Button>
                          <Button
                            onClick={handleExploreMore}
                            variant="outline"
                            className="border-2 border-[#f59f0a] hover:bg-[#f59f0a]/10 rounded-full px-6 py-2"
                          >
                            Explore More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Space for future products */}
                </div>
              </ScrollAnimation>
            </Section>

            {/* About section */}
            <Section id="about">
              <ScrollAnimation className="w-full max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12">About Yaakai</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AboutCard
                    title="Who We Are"
                    content="We are a team of passionate cybersecurity experts committed to addressing modern security challenges with state-of-the-art technology. At Yaakai, we believe that strong digital security should be accessible to all businesses, regardless of size."
                  />
                  <AboutCard
                    title="What We Offer"
                    content="Yaakai provides a wide range of cybersecurity solutions, including modern applications and services tailored to protect businesses from cyber threats. Our products are designed to be affordable, easy to integrate, and highly efficient in preventing security breaches."
                  />
                  <AboutCard
                    title="Our Mission"
                    content="Our goal is to offer reliable, affordable, and easy-to-implement cybersecurity products that ensure complete protection against emerging cyber threats. With a focus on innovation, safety, and efficiency, we aim to empower organizations with advanced security tools."
                  />
                  <AboutCard
                    title="How Safe Are We?"
                    content="Security is our top priority. All our cybersecurity solutions undergo rigorous testing in controlled environments before they reach our clients. We implement the latest security protocols, encryption standards, and compliance measures to guarantee maximum protection."
                  />
                </div>
              </ScrollAnimation>
            </Section>

            {/* Profile section - only shown if user is logged in */}
            {!isLoading && user && (
              <Section id="profile">
                <ScrollAnimation className="w-full">
                  <ProfileSection />
                </ScrollAnimation>
              </Section>
            )}

            {/* Contact section */}
            <Section id="contact" className="pb-0">
              <ScrollAnimation className="w-full max-w-4xl mx-auto" duration={1.5}>
                <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
                <div className="bg-white/30 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-20">
                  {contactStatus && (
                    <Alert
                      variant={contactStatus.success ? "default" : "destructive"}
                      className={`mb-6 ${contactStatus.success ? "bg-green-50 border-green-200" : ""}`}
                    >
                      {contactStatus.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2" />
                      )}
                      <AlertDescription>
                        {contactStatus.message ||
                          (contactStatus.success
                            ? "Your message has been sent successfully!"
                            : "Failed to send message. Please try again.")}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-white/50 border-2 border-[#f59f0a]"
                        required
                      />
                      {contactStatus?.errors?.name && (
                        <p className="text-red-500 text-xs mt-1">{contactStatus.errors.name[0]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white/50 border-2 border-[#f59f0a]"
                        required
                      />
                      {contactStatus?.errors?.email && (
                        <p className="text-red-500 text-xs mt-1">{contactStatus.errors.email[0]}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Your message here..."
                        className="w-full bg-white/50 border-2 border-[#f59f0a]"
                        rows={4}
                        required
                      />
                      {contactStatus?.errors?.message && (
                        <p className="text-red-500 text-xs mt-1">{contactStatus.errors.message[0]}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <LogoSpinner size="small" />
                          <span className="ml-2">Sending...</span>
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </div>
              </ScrollAnimation>
            </Section>
            <div className="w-full max-w-4xl mx-auto text-center mb-20">
              <p className="text-lg">
                For enterprise inquiries, please contact:{" "}
                <a href="mailto:yaakai1516@gmail.com" className="text-[#f59f0a] hover:underline">
                  yaakai1516@gmail.com
                </a>
              </p>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <LoginDialog
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSignUpClick={handleSignUpClick}
        onForgotPasswordClick={handleForgotPasswordClick}
      />

      <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onLoginClick={handleLoginClick} />

      <OSSelectionDialog open={isOSDialogOpen} onOpenChange={setIsOSDialogOpen} onSelectOS={handleOSSelect} />
    </>
  )
}
