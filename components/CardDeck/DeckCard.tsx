"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LineByLineText } from "./LineByLineText";
import { NavigationArrow } from "./NavigationArrow";

interface DeckCardProps {
  lines: string[];
  cardIndex: number;
  isActive: boolean;
  showArrow: boolean;
  onTextComplete: () => void;
  onNext: () => void;
}

export function DeckCard({
  lines,
  cardIndex,
  isActive,
  showArrow,
  onTextComplete,
  onNext,
}: DeckCardProps) {
  return (
    <div
      className={cn(
        // Sizing
        "w-full max-w-[calc(100vw-48px)] sm:max-w-md",
        "min-h-[280px] sm:min-h-[320px] md:min-h-[380px]",
        "p-6 sm:p-8 md:p-10",
        // Bold border treatment
        "border-4 border-[var(--color-text-main)]",
        "rounded-2xl",
        // Background with subtle gradient
        "bg-gradient-to-br from-white to-slate-50",
        // Strong shadow for depth
        "shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
        // Positioning
        "relative overflow-hidden"
      )}
    >
      {/* Accent stripe on top */}
      <div
        className="absolute top-0 left-0 right-0 h-2 bg-[var(--color-accent)]"
        aria-hidden="true"
      />

      {/* Card number indicator */}
      <div className="absolute top-6 right-6">
        <span className="font-display font-black text-5xl sm:text-6xl text-slate-200">
          {String(cardIndex + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-4">
        <LineByLineText
          lines={lines}
          isActive={isActive}
          onComplete={onTextComplete}
        />
      </div>

      {/* Navigation arrow */}
      <AnimatePresence>
        {showArrow && (
          <motion.div className="absolute bottom-6 right-6">
            <NavigationArrow onClick={onNext} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
