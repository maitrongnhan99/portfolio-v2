"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedShapes from "./animated-shapes";
import ContactFormModal from "./contact-form-modal";
import ScrollReveal from "./scroll-reveal";
import { ThankYouModal } from "./thank-you-modal";

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  return (
    <section id="contact" className="relative py-32 bg-navy">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <AnimatedShapes count={5} className="opacity-90" />
        <ScrollReveal className="z-40">
          <div className="flex flex-col items-center text-center">
            <p className="font-mono text-primary mb-2 text-sm">
              04. What&apos;s Next?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-lighter mb-6">
              Get In Touch
            </h2>

            <p className="text-slate max-w-lg mb-12 text-center">
              I&apos;m currently looking for new opportunities. Whether you have
              a question or just want to say hi, I&apos;ll do my best to get
              back to you!
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                size="lg"
                className="font-mono border-primary text-primary hover:bg-white/80 hover:text-primary px-8 py-6"
              >
                Say Hello
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setShowThankYou(true)}
      />

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </section>
  );
}
