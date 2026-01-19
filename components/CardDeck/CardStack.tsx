"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DeckCard } from "./DeckCard";
import { CardContent } from "./cardData";

interface CardStackProps {
  cards: CardContent[];
  currentIndex: number;
  textComplete: boolean;
  onTextComplete: () => void;
  onNext: () => void;
}

// Card animation variants
const cardVariants = {
  enter: {
    y: 60,
    rotateX: -15,
    scale: 0.9,
    opacity: 0,
  },
  center: {
    y: 0,
    rotateX: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    y: -80,
    x: 40,
    rotateZ: 12,
    scale: 0.85,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function CardStack({
  cards,
  currentIndex,
  textComplete,
  onTextComplete,
  onNext,
}: CardStackProps) {
  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const thirdCard = cards[currentIndex + 2];

  return (
    <div
      className="relative"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Background cards for depth effect */}
      {thirdCard && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translateY(16px) scale(0.94)",
            opacity: 0.3,
            zIndex: 1,
          }}
        >
          <DeckCard
            lines={thirdCard.lines}
            cardIndex={currentIndex + 2}
            isActive={false}
            showArrow={false}
            onTextComplete={() => {}}
            onNext={() => {}}
          />
        </div>
      )}

      {nextCard && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translateY(8px) scale(0.97)",
            opacity: 0.5,
            zIndex: 2,
          }}
        >
          <DeckCard
            lines={nextCard.lines}
            cardIndex={currentIndex + 1}
            isActive={false}
            showArrow={false}
            onTextComplete={() => {}}
            onNext={() => {}}
          />
        </div>
      )}

      {/* Current active card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: "relative",
            zIndex: 10,
            transformOrigin: "center bottom",
          }}
        >
          <DeckCard
            lines={currentCard.lines}
            cardIndex={currentIndex}
            isActive={true}
            showArrow={textComplete}
            onTextComplete={onTextComplete}
            onNext={onNext}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
