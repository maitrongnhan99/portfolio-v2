"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

interface AnimatedTechCardProps {
  name: string
  logo: string
  darkLogo?: string
  index: number
}

export default function AnimatedTechCard({ name, logo, darkLogo, index }: AnimatedTechCardProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 * index,
        type: "spring",
        stiffness: 100,
      }}
    >
      <motion.div
        className="relative w-24 h-24 bg-background rounded-xl shadow-lg overflow-hidden border border-border/50 flex items-center justify-center p-3"
        whileHover={{
          scale: 1.1,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 0.5 },
        }}
      >
        <Image
          src={isDark && darkLogo ? darkLogo : logo}
          alt={name}
          width={80}
          height={80}
          className="object-contain"
        />
      </motion.div>
      <motion.span className="text-sm font-medium mt-3" whileHover={{ scale: 1.05 }}>
        {name}
      </motion.span>
    </motion.div>
  )
}

