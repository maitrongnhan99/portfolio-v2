"use client";

import type { FC } from "react";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Fireflies } from "@/components/ui/fireflies";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

const ThankYouModal: FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  autoCloseDelay = 5000,
}) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseDelay]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-navy-light/95 backdrop-blur-md border-navy-lighter text-slate-lighter overflow-hidden">
        <Fireflies
          count={15}
          minSize={1}
          maxSize={3}
          minSpeed={0.3}
          maxSpeed={1}
          className="z-0"
        />

        <div className="relative z-10">
          <DialogHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="mx-auto"
            >
              <CheckCircleIcon
                className="w-16 h-16 text-primary mx-auto"
                weight="duotone"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-2xl font-bold text-slate-lighter">
                Thank You!
              </DialogTitle>
              <DialogDescription className="text-slate mt-2">
                Your message has been sent successfully. I&apos;ll get back to you as
                soon as possible.
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-slate-light">
              This window will close automatically in {autoCloseDelay / 1000}{" "}
              seconds
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ThankYouModal };
