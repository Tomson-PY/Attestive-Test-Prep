"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "header" | "header-transparent" | "footer";
}

const MotionLink = motion.create(Link);

export function NavLink({ 
  href, 
  children, 
  className,
  variant = "header" 
}: NavLinkProps) {
  const isTransparent = variant === "header-transparent";
  const isFooter = variant === "footer";

  // Color configurations based on variant
  const textColors = {
    idle: isTransparent 
      ? "rgba(255,255,255,0.9)" 
      : isFooter 
        ? "rgba(26,26,26,0.8)" 
        : "rgba(26,26,26,0.8)",
    hover: isFooter ? "rgba(26,26,26,1)" : "#000000",
  };

  return (
    <MotionLink
      href={href}
      className={cn("relative inline-block", className)}
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className="relative z-10 px-2"
        variants={{
          idle: { color: textColors.idle },
          hover: { color: textColors.hover },
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 bg-[var(--color-accent)] rounded-sm"
        variants={{
          idle: { scaleX: 0, opacity: 0 },
          hover: { scaleX: 1, opacity: 1 },
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "left" }}
      />
    </MotionLink>
  );
}
