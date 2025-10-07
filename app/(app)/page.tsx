import About from "@/components/common/about";
import { AIChatbotWidget } from "@/components/common/ai-chatbot-widget";
import Contact from "@/components/common/contact";
import Footer from "@/components/common/footer";
import Hero from "@/components/common/hero";
import { ProjectsServer } from "@/components/common/projects/projects-server";
import { HomeStructuredData } from "@/components/common/seo/home-structured-data";
import { Skills } from "@/components/common/skills";
import { getProjects } from "@/lib/data-service-server";

export default async function Home() {
  // Fetch projects data server-side
  const projects = await getProjects();
  return (
    <main data-testid="home-page" className="min-h-screen bg-navy relative">
      <HomeStructuredData />
      <Hero />
      <About />
      <Skills />
      <ProjectsServer projects={projects} />
      <Contact />
      <Footer />

      {/* AI Chatbot Widget */}
      <AIChatbotWidget autoShow={true} showDelay={3000} />
    </main>
  );
}
