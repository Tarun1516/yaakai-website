import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Yaakai - Cybersecurity Products",
  description:
    "Explore CheckBlock - our advanced VPN detector and blocker solution. Yaakai provides innovative cybersecurity tools for network security.",
  keywords:
    "vpn, vpn detector, vpn blocker, vpn detector and blocker, checkblock, yaakai, cyber security, network, network security, smart security, stronger future",
}

export default function Products() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">CheckBlock</h2>
          <p className="mb-4">
            Advanced cybersecurity solution designed to detect and block VPN connections, ensuring secure and authentic
            network access.
          </p>
          <Button className="bg-[#f59f0a] text-black border-2 border-black rounded-full px-6 py-2">Learn More</Button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="mb-4">
            We're working on new cybersecurity products to help protect your business. Stay tuned for updates!
          </p>
          <Button variant="outline" className="border-2 border-[#f59f0a] rounded-full px-6 py-2">
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  )
}
