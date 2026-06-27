"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedShapes from "./animated-shapes";
import ContactFormModal from "./contact-form-modal";
import ScrollReveal from "./scroll-reveal";
import { ThankYouModal } from "./thank-you-modal";
import { Container } from "@/components/ui/container";

export default function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-24 bg-canvas-white"
    >
      <Container>
        <AnimatedShapes count={5} className="opacity-25" />
        <ScrollReveal className="z-40">
          <div className="flex flex-col items-center text-center">
            <p className="font-mono text-text-muted mb-2 text-sm">
              <span className="text-logo-blue">04. </span> What&apos;s Next?
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-text-primary mb-6">
              Get In Touch
            </h2>

            <p className="text-text-secondary max-w-lg mb-12 text-center tracking-body">
              I&apos;m currently looking for new opportunities. Whether you have
              a question or just want to say hi, I&apos;ll do my best to get
              back to you!
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                size="lg"
                className="font-mono !border-logo-blue !text-logo-blue !bg-transparent hover:!bg-logo-blue/10 hover:!text-logo-blue px-8 py-6 rounded-pill"
              >
                Say Hello
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>
      </Container>

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
