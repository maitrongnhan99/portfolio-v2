"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useTheme } from "next-themes"
import Image from "next/image"

interface Technology {
  name: string
  logo: string
  darkLogo?: string
}

export default function HeroTechCarousel() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Define tech stack with logos
  const technologies: Technology[] = [
    {
      name: "Next.js",
      logo: "/placeholder.svg?text=Next.js&width=120&height=80",
      darkLogo: "/placeholder.svg?text=Next.js&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "React",
      logo: "/placeholder.svg?text=React&width=120&height=80",
      darkLogo: "/placeholder.svg?text=React&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "TypeScript",
      logo: "/placeholder.svg?text=TypeScript&width=120&height=80",
      darkLogo: "/placeholder.svg?text=TypeScript&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "TailwindCSS",
      logo: "/placeholder.svg?text=TailwindCSS&width=120&height=80",
      darkLogo: "/placeholder.svg?text=TailwindCSS&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "PostgreSQL",
      logo: "/placeholder.svg?text=PostgreSQL&width=120&height=80",
      darkLogo: "/placeholder.svg?text=PostgreSQL&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "Node.js",
      logo: "/placeholder.svg?text=Node.js&width=120&height=80",
      darkLogo: "/placeholder.svg?text=Node.js&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "Prisma",
      logo: "/placeholder.svg?text=Prisma&width=120&height=80",
      darkLogo: "/placeholder.svg?text=Prisma&width=120&height=80&fontColor=ffffff",
    },
    {
      name: "Docker",
      logo: "/placeholder.svg?text=Docker&width=120&height=80",
      darkLogo: "/placeholder.svg?text=Docker&width=120&height=80&fontColor=ffffff",
    },
  ]

  // Duplicate the array to create a seamless loop
  const duplicatedTech = [...technologies, ...technologies]

  // Animation for infinite carousel
  useEffect(() => {
    const startAnimation = async () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.scrollWidth
      const viewportWidth = containerRef.current.offsetWidth

      await controls.start({
        x: [0, -(containerWidth / 2)],
        transition: {
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      })
    }

    startAnimation()
  }, [controls])

  return (
    <div className="w-full overflow-hidden py-10">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent"></div>

        <div className="overflow-hidden" ref={containerRef}>
          <motion.div className="flex gap-8" animate={controls}>
            {duplicatedTech.map((tech, index) => (
              <div key={`${tech.name}-${index}`} className="flex-shrink-0 flex flex-col items-center">
                <motion.div
                  className="relative w-[120px] h-[80px] bg-background rounded-lg shadow-md overflow-hidden border border-border/50 flex items-center justify-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Image
                    src={isDark && tech.darkLogo ? tech.darkLogo : tech.logo}
                    alt={tech.name}
                    width={120}
                    height={80}
                    className="object-contain p-2"
                  />
                </motion.div>
                <span className="text-sm mt-2 text-muted-foreground">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

