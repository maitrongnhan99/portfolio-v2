"use client";
import About from "@/components/common/about";
import { AIChatbotWidget } from "@/components/common/ai-chatbot-widget";
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

      {/* AI Chatbot Widget */}
      <AIChatbotWidget autoShow={true} showDelay={3000} />
    </main>
  );
}
