"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface InteractiveElementProps {
  children: React.ReactNode
  className?: string
}

export default function InteractiveElement({ children, className = "" }: InteractiveElementProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {children}

      {isHovered && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg opacity-0"
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(100, 255, 218, 0.15) 0%, rgba(100, 255, 218, 0.05) 50%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  )
}

