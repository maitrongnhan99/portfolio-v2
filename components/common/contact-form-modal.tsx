"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { useState } from "react";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContactFormModal({
  isOpen,
  onClose,
  onSuccess,
}: ContactFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would normally send the data to your API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", subject: "", message: "" });
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-canvas-white border border-borderLight text-text-primary shadow-outline-ring rounded-section p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light font-display text-text-primary tracking-body">
            <span className="text-text-muted font-mono text-sm mr-2">04.</span>
            Get In Touch
          </DialogTitle>
          <DialogDescription className="text-text-secondary tracking-body">
            Fill out the form below and I&apos;ll get back to you as soon as
            possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-text-primary tracking-body"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Mai Trọng Nhân"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-canvas-white border border-borderLight focus:ring-2 focus:ring-ring focus:border-transparent text-text-primary rounded-base placeholder:text-text-muted shadow-inset-border transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-text-primary tracking-body"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-canvas-white border border-borderLight focus:ring-2 focus:ring-ring focus:border-transparent text-text-primary rounded-base placeholder:text-text-muted shadow-inset-border transition-shadow"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-text-primary tracking-body"
            >
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="bg-canvas-white border border-borderLight focus:ring-2 focus:ring-ring focus:border-transparent text-text-primary rounded-base placeholder:text-text-muted shadow-inset-border transition-shadow"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-text-primary tracking-body"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="bg-canvas-white border border-borderLight focus:ring-2 focus:ring-ring focus:border-transparent text-text-primary rounded-base placeholder:text-text-muted shadow-inset-border transition-shadow resize-none"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="mr-2 text-text-secondary hover:text-text-primary hover:bg-canvas-light rounded-pill tracking-body font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="warm"
              disabled={isSubmitting}
              className="bg-canvas-warm text-text-primary hover:bg-[#ede7e1] hover:text-text-primary rounded-pill shadow-warm-lift border border-borderSubtle tracking-body font-medium transition-all hover:scale-105 active:scale-95 px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PaperPlaneTiltIcon className="h-4 w-4" />
                  Send Message
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
