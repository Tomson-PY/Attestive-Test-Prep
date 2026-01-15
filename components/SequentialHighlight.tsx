"use client";

import { motion } from "framer-motion";

type SequentialHighlightProps = {
  children: string;
  className?: string;
  /**
   * Delay (seconds) before highlight starts.
   */
  delay?: number;
  /**
   * Duration for each word's highlight animation
   */
  wordDuration?: number;
  /**
   * Stagger delay between words
   */
  stagger?: number;
  /**
   * Background color for highlight
   */
  bgColor?: string;
  /**
   * Text color
   */
  textColor?: string;
};

export function SequentialHighlight({
  children,
  className,
  delay = 0.8,
  wordDuration = 0.4,
  stagger = 0.1,
  bgColor = "#000000",
  textColor = "#D6FF0A",
}: SequentialHighlightProps) {
  // Split text into words while preserving spaces
  const words = children.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={index} className="relative inline-block">
          <motion.span
            className="relative z-10 px-2"
            style={{ color: textColor }}
            initial={{ color: textColor }}
          >
            {word}
          </motion.span>
          <motion.span
            className="absolute inset-0 -skew-x-2"
            style={{ 
              backgroundColor: bgColor,
              transformOrigin: "left"
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
              delay: delay + (index * stagger),
              duration: wordDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {index < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
