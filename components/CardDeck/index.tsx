"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StartButton } from "./StartButton";
import { CardStack } from "./CardStack";
import { CARD_DATA } from "./cardData";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "active" | "complete";

interface CardDeckState {
  phase: Phase;
  currentCardIndex: number;
  textAnimationComplete: boolean;
}

const completionVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function CardDeck() {
  const [state, setState] = useState<CardDeckState>({
    phase: "idle",
    currentCardIndex: 0,
    textAnimationComplete: false,
  });

  // Start the experience
  const handleStart = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "active" }));
  }, []);

  // Called when line-by-line text animation finishes
  const handleTextComplete = useCallback(() => {
    setState((prev) => ({ ...prev, textAnimationComplete: true }));
  }, []);

  // Called when user clicks the navigation arrow
  const handleNextCard = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentCardIndex + 1;
      if (nextIndex >= CARD_DATA.length) {
        return { ...prev, phase: "complete", textAnimationComplete: false };
      }
      return {
        ...prev,
        currentCardIndex: nextIndex,
        textAnimationComplete: false,
      };
    });
  }, []);

  // Reset to beginning
  const handleRestart = useCallback(() => {
    setState({
      phase: "idle",
      currentCardIndex: 0,
      textAnimationComplete: false,
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
      <AnimatePresence mode="wait">
        {state.phase === "idle" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <StartButton onClick={handleStart} />
          </motion.div>
        )}

        {state.phase === "active" && (
          <motion.div
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardStack
              cards={CARD_DATA}
              currentIndex={state.currentCardIndex}
              textComplete={state.textAnimationComplete}
              onTextComplete={handleTextComplete}
              onNext={handleNextCard}
            />
          </motion.div>
        )}

        {state.phase === "complete" && (
          <motion.div
            key="complete"
            variants={completionVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className={cn(
                "w-full max-w-[calc(100vw-48px)] sm:max-w-md",
                "p-8 sm:p-10 md:p-12",
                "border-4 border-[var(--color-text-main)]",
                "rounded-2xl",
                "bg-gradient-to-br from-white to-slate-50",
                "shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
              )}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--color-accent)]" />

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-text-main)] mb-6">
                That&apos;s Riata.
              </h3>

              <p className="text-slate-600 mb-8">
                Ready to transform your compliance training?
              </p>

              <button
                onClick={handleRestart}
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-6 py-3",
                  "bg-[var(--color-text-main)] text-white",
                  "font-display font-semibold text-sm uppercase tracking-wider",
                  "border-2 border-[var(--color-accent)]",
                  "rounded-lg",
                  "hover:bg-[var(--color-text-main)]/90",
                  "transition-colors duration-200",
                  "cursor-pointer"
                )}
              >
                <RotateCcw className="w-4 h-4" />
                Replay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
