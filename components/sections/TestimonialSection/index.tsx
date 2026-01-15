"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import { Quote, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials, Testimonial } from "./testimonialData";
import { TestimonialCard } from "./TestimonialCard";

// Row configuration for different speeds and directions (2 rows)
const rowConfigs = [
  { direction: "left", duration: 70 },
  { direction: "right", duration: 60 },
];

interface MarqueeRowProps {
  cards: Testimonial[];
  direction: string;
  duration: number;
  y: MotionValue<number>;
  isPaused: boolean;
  expandedCard: string | null;
  onCardClick: (id: string) => void;
}

function MarqueeRow({
  cards,
  direction,
  duration,
  y,
  isPaused,
  expandedCard,
  onCardClick,
}: MarqueeRowProps) {
  // Triple duplicate cards for seamless infinite loop
  const duplicatedCards = useMemo(
    () => [...cards, ...cards, ...cards],
    [cards]
  );

  return (
    <motion.div style={{ y }} className="relative overflow-hidden">
      <div
        className={cn(
          "flex gap-4 sm:gap-5 w-max",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicatedCards.map((card, index) => (
          <TestimonialCard
            key={`${card.id}-${index}`}
            testimonial={card}
            isExpanded={expandedCard === card.id}
            isDimmed={expandedCard !== null && expandedCard !== card.id}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface ExpandedCardOverlayProps {
  card: Testimonial;
  onClose: () => void;
}

function ExpandedCardOverlay({ card, onClose }: ExpandedCardOverlayProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { name, role, industry, beforePhrase, boldedPhrase, afterPhrase } = card;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded testimonial from ${name}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Expanded Card */}
      <motion.div
        layoutId={`card-${card.id}`}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-white rounded-3xl p-8 sm:p-10",
          "max-w-xl w-full shadow-2xl",
          "focus:outline-none"
        )}
        tabIndex={-1}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full",
            "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          )}
          aria-label="Close testimonial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large quote icon */}
        <Quote
          className="absolute top-6 left-8 w-12 h-12 text-[var(--color-accent)]/15"
          aria-hidden="true"
        />

        {/* Quote text */}
        <p className="font-display text-xl sm:text-2xl text-[var(--color-text-main)] leading-relaxed mb-8 pt-8">
          {beforePhrase}{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-bold text-black px-2">
              &ldquo;{boldedPhrase}&rdquo;
            </span>
            <motion.span
              className="absolute inset-0 bg-[var(--color-accent)] -skew-x-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.3,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              aria-hidden="true"
            />
          </span>{" "}
          {afterPhrase}
        </p>

        {/* Attribution with avatar */}
        <div className="flex items-center gap-4">
          {/* Avatar with gradient */}
          <div
            className={cn(
              "w-14 h-14 rounded-full flex-shrink-0",
              "bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]",
              "flex items-center justify-center",
              "text-[var(--color-text-main)] font-display font-bold text-lg"
            )}
          >
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-display font-bold text-lg text-[var(--color-text-main)]">
              {name}
            </p>
            <p className="text-sm text-slate-500">
              {role} <span className="text-slate-300">|</span> {industry}
            </p>
          </div>
        </div>

        {/* Close hint */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">Esc</kbd> to close
        </p>
      </motion.div>
    </motion.div>
  );
}

export function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Section fade-in
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Per-row parallax (different speeds for depth)
  const row0Y = useTransform(scrollYProgress, [0, 1], [30, -15]);
  const row1Y = useTransform(scrollYProgress, [0, 1], [15, -30]);

  const rowYValues = [row0Y, row1Y];

  // Group testimonials by row (2 rows)
  const rows = useMemo(
    () => [
      testimonials.filter((t) => t.row === 0),
      testimonials.filter((t) => t.row === 1),
    ],
    []
  );

  // Pause all animation when a card is expanded
  const isPaused = expandedCard !== null;

  const handleCardClick = useCallback((id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setExpandedCard(null);
  }, []);

  // Find expanded card data
  const expandedCardData = expandedCard
    ? testimonials.find((t) => t.id === expandedCard)
    : null;

  return (
    <section
      ref={sectionRef}
      aria-label="Customer testimonials"
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-text-main) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Section Header */}
      <motion.div
        style={{ opacity }}
        className="max-w-6xl mx-auto px-6 mb-10 sm:mb-14 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4"
        >
          The Compliance Pain
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text-main)]"
        >
          Sound familiar?
        </motion.h2>
      </motion.div>

      {/* Masonry Rows */}
      <motion.div style={{ opacity }} className="flex flex-col gap-4 sm:gap-5">
        {rows.map((rowCards, rowIndex) => (
          <MarqueeRow
            key={rowIndex}
            cards={rowCards}
            direction={rowConfigs[rowIndex].direction}
            duration={rowConfigs[rowIndex].duration}
            y={rowYValues[rowIndex]}
            isPaused={isPaused}
            expandedCard={expandedCard}
            onCardClick={handleCardClick}
          />
        ))}
      </motion.div>

      {/* Gradient overlays for smooth edge fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Expanded Card Overlay */}
      <AnimatePresence>
        {expandedCardData && (
          <ExpandedCardOverlay
            card={expandedCardData}
            onClose={handleCloseExpanded}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
