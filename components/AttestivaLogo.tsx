"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AttestivaLogoProps = {
  className?: string;
};

/**
 * Wordmark "Attestiva" with a custom "V" rendered as a checkmark-style glyph
 * in the site's accent color.
 */
export function AttestivaLogo({ className }: AttestivaLogoProps) {
  return (
    <span className={cn("inline-flex items-baseline", className)} aria-hidden="true">
      <span>Attesti</span>
      <span className="relative inline-block mx-[0.02em] align-baseline">
        <svg
          viewBox="0 0 24 24"
          className="inline-block h-[0.96em] w-[0.96em] translate-y-[0.06em]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.4 8.6 L10.4 19.0 L21.0 3.2"
            stroke="var(--color-accent)"
            strokeWidth="4.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>a</span>
    </span>
  );
}

