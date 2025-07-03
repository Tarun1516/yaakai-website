"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import type React from "react"

export const ScrollAnimation = ({
  children,
  className,
  duration,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) => {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [100, 0, 0, 100])

  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  )
}
