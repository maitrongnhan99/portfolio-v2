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
import { CSSProperties, FC } from "react";

interface SocialProps {
  className?: string;
}

const socialLinks = [
  {
    icon: <GithubLogoIcon className="w-5 h-5" />,
    href: PROFILE.github.url,
    label: "GitHub",
    lightColor: "#6e5494",
    lightHoverColor: "#4f3b78",
  },
  {
    icon: <LinkedinLogoIcon className="w-5 h-5" />,
    href: PROFILE.linkedin.url,
    label: "LinkedIn",
    lightColor: "#0a66c2",
    lightHoverColor: "#004182",
  },
  {
    icon: <InstagramLogoIcon className="w-5 h-5" />,
    href: PROFILE.instagram.url,
    label: "Instagram",
    lightColor: "#c13584",
    lightHoverColor: "#833ab4",
  },
  {
    icon: <FacebookLogoIcon className="w-5 h-5" />,
    href: PROFILE.facebook.url,
    label: "Facebook",
    lightColor: "#1877f2",
    lightHoverColor: "#0d5db8",
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
            className="text-[var(--social-light)] hover:text-[var(--social-light-hover)] dark:!text-text-secondary dark:hover:!text-text-primary transition-colors"
            style={
              {
                "--social-light": social.lightColor,
                "--social-light-hover": social.lightHoverColor,
              } as CSSProperties
            }
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
