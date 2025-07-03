"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function SimpleNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-[#f59f0a] flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="font-bold text-xl">Yaakai</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost">Products</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About Us</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact Us</Button>
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex space-x-2">
          <Button variant="outline" className="rounded-full border border-black text-black">
            Login
          </Button>
          <Button className="rounded-full bg-[#f59f0a] text-black border-2 border-[#f59f0a]">Sign Up</Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Home
              </Button>
            </Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Products
              </Button>
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                About Us
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Contact Us
              </Button>
            </Link>
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-full border border-black text-black">
                Login
              </Button>
              <Button className="flex-1 rounded-full bg-[#f59f0a] text-black border-2 border-[#f59f0a]">Sign Up</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
