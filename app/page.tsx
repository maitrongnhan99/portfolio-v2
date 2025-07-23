"use client";
import About from "@/components/common/about";
import { AIChatbotWidget } from "@/components/common/ai-chatbot-widget";
import Contact from "@/components/common/contact";
import Footer from "@/components/common/footer";
import Hero from "@/components/common/hero";
import { Projects } from "@/components/common/projects";
import { HomeStructuredData } from "@/components/common/seo/home-structured-data";
import { Skills } from "@/components/common/skills";

export default function Home() {
  return (
    <main data-testid="home-page" className="min-h-screen bg-navy relative">
      <HomeStructuredData />
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
