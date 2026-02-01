"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARD_DATA } from "./cardData";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";

export function ModernCardDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    if (currentIndex < CARD_DATA.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleDotClick = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const currentCard = CARD_DATA[currentIndex];

  // Animation variants for cards
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? -15 : 15,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    }),
  };

  // Text reveal animation
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const textLineVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(8px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Card Container */}
      <div 
        className="relative"
        style={{ perspective: "1200px" }}
      >
        {/* Background decorative elements */}
        <div className="absolute -inset-4 bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-accent-2)]/10 to-transparent rounded-3xl blur-2xl opacity-60" />
        
        {/* Card Stack Container */}
        <div className="relative">
          {/* Background cards for depth */}
          <div 
            className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg"
            style={{ 
              transform: "translateY(8px) translateX(8px) scale(0.96)",
              zIndex: 1,
            }}
          />
          <div 
            className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/30 shadow-md"
            style={{ 
              transform: "translateY(16px) translateX(16px) scale(0.92)",
              zIndex: 0,
            }}
          />

          {/* Main Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={cn(
                "relative z-10",
                "bg-white/90 backdrop-blur-xl",
                "rounded-2xl",
                "border border-white/50",
                "shadow-[0_8px_40px_rgba(0,0,0,0.08)]",
                "overflow-hidden"
              )}
            >
              {/* Top accent bar with gradient */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent)]" />
              
              {/* Card Content */}
              <div className="p-8 sm:p-10">
                {/* Card Number Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                      Step {String(currentIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                  
                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5">
                    {CARD_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          idx === currentIndex 
                            ? "w-6 bg-[var(--color-accent)]" 
                            : idx < currentIndex
                              ? "bg-[var(--color-accent)]/60"
                              : "bg-slate-200 hover:bg-slate-300"
                        )}
                        aria-label={`Go to card ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Text Content with staggered reveal */}
                <motion.div
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  key={`text-${currentIndex}`}
                  className="space-y-3 min-h-[140px]"
                >
                  {currentCard.lines.map((line, idx) => (
                    <motion.p
                      key={idx}
                      variants={textLineVariants}
                      className={cn(
                        "text-xl sm:text-2xl font-display font-bold leading-tight",
                        idx === currentCard.lines.length - 1 && currentCard.lines.length > 1
                          ? "text-[var(--color-accent-2)]"
                          : "text-[var(--color-text-main)]"
                      )}
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>

                {/* CTA Button - Only on last card */}
                {currentIndex === CARD_DATA.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="mt-6"
                  >
                    <Link href="/contact">
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(214, 255, 10, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "w-full py-4 px-6 rounded-xl",
                          "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]",
                          "text-[var(--color-text-main)] font-bold text-base",
                          "flex items-center justify-center gap-3",
                          "shadow-lg shadow-[var(--color-accent)]/30",
                          "transition-all duration-300",
                          "relative overflow-hidden group"
                        )}
                      >
                        {/* Animated shine effect */}
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            repeatDelay: 1,
                            ease: "easeInOut" 
                          }}
                        />
                        
                        {/* Pulsing ring animation */}
                        <motion.span
                          className="absolute inset-0 rounded-xl border-2 border-[var(--color-accent)]"
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.1, opacity: 0 }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeOut" 
                          }}
                        />
                        
                        <MessageCircle className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Contact Us</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        >
                          <ArrowRight className="w-5 h-5 relative z-10" />
                        </motion.span>
                      </motion.button>
                    </Link>
                  </motion.div>
                )}

                {/* Bottom section with navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  {/* Progress text */}
                  <span className="text-sm text-slate-400 font-medium">
                    {currentIndex + 1} of {CARD_DATA.length}
                  </span>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Previous button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "border-2 border-slate-200",
                        "transition-all duration-200",
                        currentIndex === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                      )}
                    >
                      <ArrowLeft className="w-4 h-4 text-[var(--color-text-main)]" />
                    </motion.button>

                    {/* Next button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      disabled={currentIndex === CARD_DATA.length - 1}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        "bg-[var(--color-accent)]",
                        "shadow-lg shadow-[var(--color-accent)]/30",
                        "transition-all duration-200",
                        currentIndex === CARD_DATA.length - 1
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:shadow-xl hover:shadow-[var(--color-accent)]/40"
                      )}
                    >
                      <ArrowRight className="w-5 h-5 text-[var(--color-text-main)]" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Completion indicator for last card */}
              {currentIndex === CARD_DATA.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-4 right-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent-2)]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-2)]" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="mt-8 px-4">
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / CARD_DATA.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
