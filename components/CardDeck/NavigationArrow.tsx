"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationArrowProps {
  onClick: () => void;
}

const arrowButtonVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: -90,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

export function NavigationArrow({ onClick }: NavigationArrowProps) {
  return (
    <motion.button
      variants={arrowButtonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
        "rounded-full",
        "bg-[var(--color-accent)]",
        "border-4 border-[var(--color-text-main)]",
        "flex items-center justify-center",
        "shadow-lg",
        "cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50"
      )}
    >
      {/* Pulsing inner circle for attention */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--color-text-main)] relative z-10" />
    </motion.button>
  );
}
