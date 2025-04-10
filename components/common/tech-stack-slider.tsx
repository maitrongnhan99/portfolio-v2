"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"

interface Technology {
  name: string
  logo: string
  darkLogo?: string
}

export default function TechStackSlider() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Define tech stack with logos
  const technologies: Technology[] = [
    {
      name: "Next.js",
      logo: "/placeholder.svg?text=Next.js&width=120&height=60",
      darkLogo: "/placeholder.svg?text=Next.js&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "React",
      logo: "/placeholder.svg?text=React&width=120&height=60",
      darkLogo: "/placeholder.svg?text=React&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "TypeScript",
      logo: "/placeholder.svg?text=TypeScript&width=120&height=60",
      darkLogo: "/placeholder.svg?text=TypeScript&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "TailwindCSS",
      logo: "/placeholder.svg?text=TailwindCSS&width=120&height=60",
      darkLogo: "/placeholder.svg?text=TailwindCSS&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "PostgreSQL",
      logo: "/placeholder.svg?text=PostgreSQL&width=120&height=60",
      darkLogo: "/placeholder.svg?text=PostgreSQL&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "Node.js",
      logo: "/placeholder.svg?text=Node.js&width=120&height=60",
      darkLogo: "/placeholder.svg?text=Node.js&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "Prisma",
      logo: "/placeholder.svg?text=Prisma&width=120&height=60",
      darkLogo: "/placeholder.svg?text=Prisma&width=120&height=60&fontColor=ffffff",
    },
    {
      name: "Docker",
      logo: "/placeholder.svg?text=Docker&width=120&height=60",
      darkLogo: "/placeholder.svg?text=Docker&width=120&height=60&fontColor=ffffff",
    },
  ]

  // Duplicate the array to create a seamless loop
  const duplicatedTech = [...technologies, ...technologies]

  return (
    <div className="w-full overflow-hidden py-10 select-none">
      <div className="relative">
        {/* First row - moving left to right */}
        <motion.div
          className="flex gap-8 mb-8"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedTech.map((tech, index) => (
            <div key={`${tech.name}-1-${index}`} className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-[120px] h-[60px] bg-background rounded-lg shadow-md overflow-hidden border border-border/50 flex items-center justify-center">
                <Image
                  src={isDark && tech.darkLogo ? tech.darkLogo : tech.logo}
                  alt={tech.name}
                  width={120}
                  height={60}
                  className="object-contain p-2"
                />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">{tech.name}</span>
            </div>
          ))}
        </motion.div>

        {/* Second row - moving right to left */}
        <motion.div
          className="flex gap-8"
          animate={{
            x: [-1920, 0],
          }}
          transition={{
            x: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedTech.reverse().map((tech, index) => (
            <div key={`${tech.name}-2-${index}`} className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-[120px] h-[60px] bg-background rounded-lg shadow-md overflow-hidden border border-border/50 flex items-center justify-center">
                <Image
                  src={isDark && tech.darkLogo ? tech.darkLogo : tech.logo}
                  alt={tech.name}
                  width={120}
                  height={60}
                  className="object-contain p-2"
                />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

