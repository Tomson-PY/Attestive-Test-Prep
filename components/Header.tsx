"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AttestivaLogo } from "@/components/AttestivaLogo";

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      transparent
        ? "bg-transparent"
        : "backdrop-blur-md bg-[var(--bg-surface)]/80 border-b border-black/5"
    )}>
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Attestiva"
          className={cn(
          "font-display font-extrabold text-3xl leading-none tracking-tight transition-colors",
          transparent ? "text-white" : "text-[var(--text-main)]"
          )}
        >
          <span className="sr-only">Attestiva</span>
          <AttestivaLogo />
        </Link>

        <nav className={cn(
          "hidden md:flex items-center gap-8 text-sm font-medium transition-colors",
          transparent ? "text-white/90" : "text-[var(--text-main)]/80"
        )}>
          <Link href="#features" className="hover:text-[var(--color-accent)] transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-[var(--color-accent)] transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-[var(--color-accent)] transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className={cn(
            "text-sm font-medium transition-colors",
            transparent ? "text-white hover:text-white/80" : "text-[var(--text-main)] hover:text-[var(--color-ink)]"
          )}>
            Log in
          </Link>
          <Link
            href="/start"
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all focus:ring-2 focus:ring-offset-2",
              transparent
                ? "bg-white text-black hover:bg-white/90 focus:ring-white"
                : "bg-[var(--color-ink)] text-white hover:bg-black/80 focus:ring-[var(--color-ink)]"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
