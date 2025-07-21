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
      <DialogContent className="sm:max-w-[500px] bg-navy-light border-navy-lighter text-slate-lighter">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-lighter">
            <span className="text-primary font-mono text-sm mr-2">04.</span>
            Get In Touch
          </DialogTitle>
          <DialogDescription className="text-slate">
            Fill out the form below and I&apos;ll get back to you as soon as
            possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-mono text-slate-light"
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
                className="bg-navy border-navy-lighter focus:ring-primary text-slate-lighter"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-mono text-slate-light"
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
                className="bg-navy border-navy-lighter focus:ring-primary text-slate-lighter"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="text-sm font-mono text-slate-light"
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
              className="bg-navy border-navy-lighter focus:ring-primary text-slate-lighter"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-mono text-slate-light"
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
              className="bg-navy border-navy-lighter focus:ring-primary text-slate-lighter resize-none"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="mr-2 text-slate hover:text-slate-lighter hover:bg-navy-lighter"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-transparent border border-primary text-primary hover:bg-primary/10 font-mono"
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
