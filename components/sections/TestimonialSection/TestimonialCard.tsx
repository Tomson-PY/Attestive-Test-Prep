"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Testimonial } from "./testimonialData";

interface TestimonialCardProps {
  testimonial: Testimonial;
  isExpanded: boolean;
  isDimmed: boolean;
  onClick: () => void;
}

// Varying heights for masonry effect based on row
const cardHeights: Record<number, string> = {
  0: "min-h-[200px]",
  1: "min-h-[220px]",
};

function TestimonialCardComponent({
  testimonial,
  isExpanded,
  isDimmed,
  onClick,
}: TestimonialCardProps) {
  const { id, name, role, industry, beforePhrase, boldedPhrase, afterPhrase, row } = testimonial;

  return (
    <motion.button
      layoutId={`card-${id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex-shrink-0 w-[340px] sm:w-[420px] lg:w-[480px]",
        cardHeights[row % 2],
        "bg-white rounded-2xl border border-slate-200/60",
        "p-6 text-left cursor-pointer flex flex-col",
        "shadow-sm hover:shadow-xl transition-shadow duration-300",
        isDimmed && "opacity-30 blur-[2px] pointer-events-none",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
      )}
      aria-label={`Testimonial from ${name}, ${role}`}
    >
      {/* Quote icon */}
      <Quote
        className="absolute top-4 right-4 w-8 h-8 text-[var(--color-accent)]/20"
        aria-hidden="true"
      />

      {/* Quote text */}
      <p className="text-[15px] sm:text-base text-slate-600 leading-relaxed mb-auto pr-6">
        {beforePhrase}{" "}
        <span
          className="font-bold text-black px-1 -mx-1"
          style={{
            backgroundColor: "var(--color-accent)",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          &ldquo;{boldedPhrase}&rdquo;
        </span>{" "}
        {afterPhrase}
      </p>

      {/* Attribution */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="font-display font-semibold text-sm text-[var(--color-text-main)]">
          {name}
        </p>
        <p className="text-xs text-slate-500">
          {role} <span className="text-slate-300">|</span> {industry}
        </p>
      </div>
    </motion.button>
  );
}

export const TestimonialCard = memo(TestimonialCardComponent);
