"use client"

import { useEffect, useRef } from "react"
import type React from "react"

const ParallaxElement = ({ children, speed = 0.5 }: { children: React.ReactNode; speed?: number }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const scrollPosition = window.pageYOffset
        elementRef.current.style.transform = `translateY(${scrollPosition * speed}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return <div ref={elementRef}>{children}</div>
}

export default ParallaxElement
