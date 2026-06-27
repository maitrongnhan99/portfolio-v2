"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FlipWords } from "../ui/flip-words";
import { Social } from "./social";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-canvas-white z-20 relative"
    >
      {/*
      <Spotlight
        className="-top-40 left-0 md:top-[-1000px] md:left-[-500px]"
        fill="white"
      />
      */}
      <Container className="z-10 py-28">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,500px)] lg:gap-4">
          <div className="flex flex-col items-start relative">
            <motion.p
              initial={{ opacity: 0.8, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-text-muted mb-5 text-sm md:text-base"
            >
              Hi, my name is
            </motion.p>

            <motion.h1
              initial={{ opacity: 0.8, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-display-hero md:text-6xl lg:text-7xl text-text-primary mb-4"
            >
              Mai Trọng Nhân
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0.8, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-col md:flex-row md:items-center gap-2 text-2xl md:text-3xl lg:text-4xl font-light text-text-secondary mb-6"
            >
              I engineer{" "}
              <FlipWords
                className="px-0 md:px-2 text-text-secondary"
                words={["web apps", "mobile apps", "AI-powered products"]}
              />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0.8, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-text-secondary max-w-lg mb-12 text-base text-left leading-8 tracking-body-relaxed"
            >
              I&apos;m an AI Applied Engineer who builds exceptional digital
              experiences end to end. Currently, I&apos;m focused on shipping
              accessible, human-centered products that put LLMs and AI to
              practical use - built with React, Next.js, NestJS, MongoDB
              and PostgreSQL.
            </motion.p>

            <Social />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] md:max-w-none lg:max-w-[500px]"
          >
            <Image
              src="/images/illustrations/software-engineer-coding-laptop-hero-illustration.png"
              alt="3D illustration of an engineer typing on a laptop"
              width={1254}
              height={1254}
              priority
              sizes="(min-width: 1024px) 500px, (min-width: 768px) 360px, 320px"
              className="h-auto w-full select-none object-contain"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
