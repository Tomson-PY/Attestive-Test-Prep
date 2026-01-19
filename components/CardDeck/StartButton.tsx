"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StartButtonProps {
  onClick: () => void;
}

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <motion.button
      variants={buttonVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "px-10 py-5",
        "bg-[var(--color-text-main)] text-white",
        "font-display font-bold text-lg uppercase tracking-wider",
        "border-4 border-[var(--color-accent)]",
        "rounded-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        "transition-shadow duration-300",
        "cursor-pointer",
        "focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50"
      )}
    >
      Start
    </motion.button>
  );
}
