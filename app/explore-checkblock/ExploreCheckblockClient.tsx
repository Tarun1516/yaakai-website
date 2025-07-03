"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/CartContext"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import { FaWindows, FaLinux } from "react-icons/fa"
import LogoSpinner from "@/components/LogoSpinner"

// Add this function right before the ExploreCheckblock component definition
function JsonLd({ data }: { data: any }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default function ExploreCheckblockClient() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Parallax effects for different elements
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const sectionY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  const sectionStyles = [
    { y: useTransform(scrollYProgress, [0, 1], [50, -50]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
    { y: useTransform(scrollYProgress, [0, 1], [70, -70]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
    { y: useTransform(scrollYProgress, [0, 1], [90, -90]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
    { y: useTransform(scrollYProgress, [0, 1], [110, -110]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
    { y: useTransform(scrollYProgress, [0, 1], [130, -130]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
    { y: useTransform(scrollYProgress, [0, 1], [150, -150]), opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) },
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
    // Remove any delay and set loading to false immediately
    setIsLoading(false)
  }, [])

  const handleAddToCart = (osType: string) => {
    // Store selected product type in localStorage for the success page
    localStorage.setItem('selectedProductType', osType.toLowerCase())
    
    addToCart({
      productId: `checkblock-${osType.toLowerCase()}`,
      name: `CheckBlock for ${osType}`,
      price: 1, // Change from 0 to 1 to match the ₹1 requirement
      quantity: 1,
    })
    router.push("/cart")
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LogoSpinner size="large" />
      </div>
    )
  }

  // Add this inside the ExploreCheckblock component, right after the opening return statement
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CheckBlock",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Windows, Linux",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          description:
            "CheckBlock is a desktop application designed to monitor network activity, detect active VPN usage, and block unauthorized VPN connections.",
          softwareVersion: "1.0",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "125",
          },
          keywords:
            "vpn, vpn detector, vpn blocker, vpn detector and blocker, checkblock, cyber security, network security",
        }}
      />
      <div ref={containerRef} className="container mx-auto px-4 py-16">
        <motion.div style={{ y: logoY, opacity: logoOpacity }}>
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-8 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Logo only, without header text */}
        <motion.div className="flex justify-center mb-8" style={{ y: logoY, opacity: logoOpacity }}>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-OD8PNDRSMMyCEsJ6tT3rN7hbSdnha5.png"
            alt="CHECKBLOCK Logo"
            width={200}
            height={80}
          />
        </motion.div>

        {[
          "Product Description & Working",
          "VPN Detection Effectiveness",
          "Sophisticated VPN Configurations",
          "False Positive Rate",
          "VPN Provider Database Updates",
          "Data Protection Compliance",
        ].map((title, index) => (
          <motion.section
            key={index}
            className="mb-12 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              y: sectionStyles[index].y,
              opacity: sectionStyles[index].opacity,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{`${index + 1}. ${title}`}</h2>
            <p className="mb-4">
              {/* Content for each section */}
              {index === 0 &&
                "CheckBlock is a desktop application designed to monitor network activity, detect active VPN usage, and block unauthorized VPN connections. It provides a GUI with real-time feedback on VPN status, IP location, and system activity logs. The product works by analyzing network interfaces, actively listening for VPN-related protocols and process names, and cross-referencing public IP geolocation data. On Linux, it uses kernel-level blocking, while Windows blocking involves disabling VPN services and applying firewall rules. Data is logged to MongoDB, enabling audit trails and storage for future analysis."}
              {index === 1 &&
                "The detection engine identifies VPNs using common keywords, network interface monitoring, and public IP-based checks. It can detect mainstream VPN providers. However, stealth VPNs or advanced configurations using custom protocols may evade detection. The system's effectiveness depends on the VPN's traffic patterns and port usage."}
              {index === 2 &&
                "CheckBlock primarily targets basic VPN protocols and keywords. While it blocks common transit traffic, split tunneling might bypass detection if non-obvious ports are used. Stealth VPNs, which obfuscate traffic, are harder to detect without advanced traffic deep-inspection, which the tool does not implement."}
              {index === 3 &&
                "False positives are possible if legitimate applications mimic VPN traffic or use similar port references. For instance, a business VPN might trigger a block if its traffic aligns with blocked keywords. Persona/privacy-focused software may also be misclassified. Accuracy improves with refined regex patterns and exclusion lists for trusted providers. The tool lacks contextual awareness, leading to blocking decisions based solely on static rules."}
              {index === 4 &&
                "The software uses a predefined list of VPN services inward to enforce blocking. This database is not dynamically updated. To include new providers, users must manually modify the list. The tool does not integrate with external APIs for real-time updates, relying on static configurations. Stale entries could lead to missed detections over time."}
              {index === 5 &&
                "CheckBlock logs IP addresses, public location data, and VPN activity into MongoDB without user consent. This practice violates GDPR, CCPA, and other regulations unless anonymization or explicit consent mechanisms are added. The tool lacks built-in mechanisms for data minimization or user notification, raising legal risks if deployed without compliance safeguards. Users handling EU/CA-derived data would need to implement additional safeguards."}
            </p>
          </motion.section>
        ))}

        <motion.section
          className="mb-12 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          style={{
            y: sectionY,
            opacity: sectionOpacity,
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Supported Operating Systems</h2>
          <div className="flex justify-center space-x-8 mb-6">
            <div className="flex flex-col items-center">
              <FaWindows size={64} className="mb-2" />
              <span>Windows</span>
            </div>
            <div className="flex flex-col items-center">
              <FaLinux size={64} className="mb-2" />
              <span>Linux</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/50 p-6 rounded-lg flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-4">Windows Requirements</h3>
              <ul className="list-disc list-inside mb-6 flex-grow">
                <li>Windows 8 or newer (64-bit/32-bit/ARM64)</li>
                <li>Integrated graphics</li>
                <li>2GB - 4GB of RAM</li>
                <li>1 GHz or faster processor or Dual-core processor</li>
                <li>Intel Core i3/i5/i7 or AMD Ryzen equivalents</li>
              </ul>
              <div className="flex justify-center mt-auto">
                <Button
                  onClick={() => handleAddToCart("Windows")}
                  className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-3 text-sm font-medium h-12 min-w-[200px]"
                >
                  Download for Windows
                </Button>
              </div>
            </div>
            <div className="bg-white/50 p-6 rounded-lg flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-4">Linux Requirements</h3>
              <ul className="list-disc list-inside mb-6 flex-grow">
                <li>Debian/Ubuntu-based, Fedora/RHEL-based, Arch-based</li>
                <li>Integrated graphics</li>
                <li>2GB - 4GB of RAM</li>
                <li>1 GHz or faster processor or Dual-core processor</li>
                <li>Intel Core i3/i5/i7 or AMD Ryzen equivalents</li>
              </ul>
              <div className="flex justify-center mt-auto">
                <Button
                  onClick={() => handleAddToCart("Linux")}
                  className="bg-[#f59f0a] text-black border-2 border-black hover:bg-[#f59f0a]/90 rounded-full px-6 py-3 text-sm font-medium h-12 min-w-[200px]"
                >
                  Download for Linux
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  )
}
