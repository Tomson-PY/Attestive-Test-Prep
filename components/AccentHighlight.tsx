"use client";

import { motion } from "framer-motion";

type AccentHighlightProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * Use "animate" for immediate animation (hero) or "inView" for scroll-triggered sections.
   */
  mode?: "animate" | "inView";
  /**
   * Delay (seconds) before highlight draws in.
   */
  delay?: number;
};

export function AccentHighlight({
  children,
  className,
  mode = "animate",
  delay = 1.0,
}: AccentHighlightProps) {
  const motionProps =
    mode === "inView"
      ? {
          initial: { scaleX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true, amount: 0.8 },
        }
      : {
          initial: { scaleX: 0 },
          animate: { scaleX: 1 },
        };

  return (
    <span className={["relative inline-block", className].filter(Boolean).join(" ")}>
      <span className="relative z-10 text-black px-2">{children}</span>
      <motion.span
        className="absolute inset-0 bg-[var(--color-accent)] -skew-x-2"
        transition={{
          delay,
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "left" }}
        {...motionProps}
      />
    </span>
  );
}

