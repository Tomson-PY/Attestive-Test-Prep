"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface LineByLineTextProps {
  lines: string[];
  isActive: boolean;
  onComplete: () => void;
  lineDelay?: number;
  lineDuration?: number;
}

const lineVariants = {
  hidden: {
    opacity: 0.15,
    y: 8,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function LineByLineText({
  lines,
  isActive,
  onComplete,
  lineDelay = 0.4,
  lineDuration = 0.5,
}: LineByLineTextProps) {
  const [visibleLines, setVisibleLines] = useState(0);

  const memoizedOnComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      setVisibleLines(0);
      return;
    }

    let timeout: NodeJS.Timeout;

    const revealNext = (index: number) => {
      if (index <= lines.length) {
        setVisibleLines(index);
        if (index < lines.length) {
          timeout = setTimeout(() => revealNext(index + 1), lineDelay * 1000);
        } else {
          // All lines visible, trigger completion after final animation settles
          timeout = setTimeout(memoizedOnComplete, lineDuration * 1000 + 200);
        }
      }
    };

    // Start revealing after a brief initial delay
    timeout = setTimeout(() => revealNext(1), 300);

    return () => clearTimeout(timeout);
  }, [isActive, lines.length, lineDelay, lineDuration, memoizedOnComplete]);

  return (
    <div className="space-y-3">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial="hidden"
          animate={i < visibleLines ? "visible" : "hidden"}
          variants={lineVariants}
          className="text-lg sm:text-xl md:text-2xl font-display font-bold text-[var(--color-text-main)] leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
