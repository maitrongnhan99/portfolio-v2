"use client";

import { DEFAULT_DURATION } from "@/constants/animation-configs";
import { PROFILE } from "@/constants/profile";
import { cn } from "@/lib/utils";
import {
  FacebookLogoIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

interface SocialProps {
  className?: string;
}

const socialLinks = [
  {
    icon: <GithubLogoIcon className="w-5 h-5" />,
    href: PROFILE.github.url,
    label: "GitHub",
  },
  {
    icon: <LinkedinLogoIcon className="w-5 h-5" />,
    href: PROFILE.linkedin.url,
    label: "LinkedIn",
  },
  {
    icon: <InstagramLogoIcon className="w-5 h-5" />,
    href: PROFILE.instagram.url,
    label: "Instagram",
  },
  {
    icon: <FacebookLogoIcon className="w-5 h-5" />,
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
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label={social.label}
          >
            {social.icon}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export { Social };
