"use client";
import About from "@/components/common/about";
import Contact from "@/components/common/contact";
import Footer from "@/components/common/footer";
import Hero from "@/components/common/hero";
import { Projects } from "@/components/common/projects";
import { Skills } from "@/components/common/skills";

export default function Home() {
  return (
    <main className="min-h-screen bg-navy relative">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
