"use client";

import { motion } from "framer-motion";
import { FlipWords } from "../ui/flip-words";
import { ShootingStars } from "../ui/shooting-stars";
import { StarsBackground } from "../ui/stars-background";
import { Social } from "./social";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-navy z-20 relative"
      style={{ backgroundColor: "#0b192f" }}
    >
      {/* 
      <Spotlight
        className="-top-40 left-0 md:-top-[1000px] md:-left-[500px]"
        fill="white"
      />
      */}
      <div className="container px-4 md:px-6 lg:px-8 max-w-5xl mx-auto z-10">
        <div className="flex flex-col items-start relative">
          <motion.p
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-primary mb-5 text-sm md:text-base"
          >
            Hi, my name is
          </motion.p>

          <motion.h1
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-lighter mb-4"
          >
            Mai Trọng Nhân
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-center gap-2 text-3xl md:text-4xl lg:text-5xl font-bold text-slate mb-6"
          >
            I build things for{" "}
            <FlipWords
              className="px-0 md:px-2 text-slate"
              words={["the web", "mobile apps"]}
            />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0.8, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-slate max-w-lg mb-12 text-lg text-left leading-8"
          >
            I&apos;m a FullStack developer specializing in building exceptional
            digital experiences. Currently, I&apos;m focused on building
            accessible, human-centered products using React, Next.js, NestJS,
            MongoDB and PostgreSQL.
          </motion.p>

          <Social />
        </div>
      </div>

      <ShootingStars />
      <StarsBackground />
    </section>
  );
}
