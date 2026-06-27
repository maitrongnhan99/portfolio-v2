"use client";

import { DEFAULT_DURATION } from "@/constants/animation-configs";
import { PROFILE } from "@/constants/profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface SocialProps {
  className?: string;
}

const socialLinks = [
  {
    src: "/images/social/github.svg",
    href: PROFILE.github.url,
    label: "GitHub",
    // GitHub mark is solid black; flip to white in dark mode so it stays visible.
    iconClassName: "dark:invert",
  },
  {
    src: "/images/social/linkedin.svg",
    href: PROFILE.linkedin.url,
    label: "LinkedIn",
  },
  {
    src: "/images/social/instagram.svg",
    href: PROFILE.instagram.url,
    label: "Instagram",
  },
  {
    src: "/images/social/facebook.svg",
    href: PROFILE.facebook.url,
    label: "Facebook",
  },
];

const Social: FC<SocialProps> = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className={cn("flex items-center space-x-6", className)}
    >
      {socialLinks.map((social, index) => (
        <motion.div
          key={social.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: DEFAULT_DURATION + index * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block transition-opacity hover:opacity-80"
            aria-label={social.label}
          >
            <Image
              src={social.src}
              alt=""
              aria-hidden
              width={20}
              height={20}
              unoptimized
              className={cn("h-5 w-5 select-none", social.iconClassName)}
            />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export { Social };
