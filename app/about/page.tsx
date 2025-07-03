export const metadata = {
  title: "Yaakai - About Us",
  description:
    "Learn about Yaakai's mission to provide innovative cybersecurity solutions including VPN detection and blocking tools.",
  keywords:
    "vpn, vpn detector, vpn blocker, vpn detector and blocker, checkblock, yaakai, cyber security, network, network security, smart security, stronger future",
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">About YAAKAI</h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-8">
          At YAAKAI, our mission is to provide innovative cybersecurity solutions that protect businesses of all sizes
          from emerging threats. We believe that strong digital security should be accessible to everyone, not just
          large enterprises with big budgets.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="mb-8">
          Our team consists of passionate cybersecurity experts with years of experience in the field. We're dedicated
          to staying ahead of the latest threats and developing solutions that keep our clients safe.
        </p>

        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2">Innovation: We're constantly exploring new ways to improve cybersecurity.</li>
          <li className="mb-2">
            Accessibility: We make advanced security solutions available to businesses of all sizes.
          </li>
          <li className="mb-2">
            Reliability: Our products are thoroughly tested to ensure they work when you need them most.
          </li>
          <li className="mb-2">Transparency: We believe in being open and honest about our products and services.</li>
        </ul>
      </div>
    </div>
  )
}
