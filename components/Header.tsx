"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AttestivaLogo } from "@/components/AttestivaLogo";

interface HeaderProps {
  transparent?: boolean;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  transparent?: boolean;
}

const MotionLink = motion.create(Link);

function NavLink({ href, children, transparent }: NavLinkProps) {
  return (
    <MotionLink
      href={href}
      className="relative inline-block"
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className="relative z-10 px-2"
        variants={{
          idle: { color: transparent ? "rgba(255,255,255,0.9)" : "rgba(26,26,26,0.8)" },
          hover: { color: "#000000" },
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 bg-[var(--color-accent)] -skew-x-2"
        variants={{
          idle: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "left" }}
      />
    </MotionLink>
  );
}

export function Header({ transparent = false }: HeaderProps) {
  return (
    <header className={cn(
      "absolute top-0 left-0 right-0 z-50 w-full transition-all duration-300",
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
          "hidden md:flex items-center gap-2 text-sm font-medium",
          transparent ? "text-white/90" : "text-[var(--text-main)]/80"
        )}>
          <NavLink href="#features" transparent={transparent}>Features</NavLink>
          <NavLink href="#how-it-works" transparent={transparent}>How it Works</NavLink>
          <NavLink href="#pricing" transparent={transparent}>Pricing</NavLink>
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
