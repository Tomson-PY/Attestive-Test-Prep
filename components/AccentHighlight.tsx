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
  /**
   * Custom background color (defaults to accent color)
   */
  bgColor?: string;
  /**
   * Custom text color (defaults to black)
   */
  textColor?: string;
};

export function AccentHighlight({
  children,
  className,
  mode = "animate",
  delay = 1.0,
  bgColor,
  textColor,
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

  const backgroundClass = bgColor ? "" : "bg-[var(--color-accent)]";
  const textClass = textColor ? "" : "text-black";

  return (
    <span className={["relative inline-block", className].filter(Boolean).join(" ")}>
      <span 
        className={`relative z-10 ${textClass} px-2`}
        style={textColor ? { color: textColor } : undefined}
      >
        {children}
      </span>
      <motion.span
        className={`absolute inset-0 ${backgroundClass} -skew-x-2`}
        style={{ 
          transformOrigin: "left",
          ...(bgColor && { backgroundColor: bgColor })
        }}
        transition={{
          delay,
          duration: 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        {...motionProps}
      />
    </span>
  );
}

