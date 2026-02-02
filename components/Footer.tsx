"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

interface FooterNavLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterNavLink({ href, children }: FooterNavLinkProps) {
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
          idle: { color: "rgba(26,26,26,0.8)" },
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

export function Footer() {
  return (
    <footer className="bg-white/50 border-t border-black/5 py-12 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-display font-bold text-lg text-[var(--text-main)]">Attestiva</div>
          <div className="text-xs text-[var(--text-main)]/60 mt-1 italic">If it matters, verify it.</div>
        </div>
        <div className="text-sm text-[var(--text-main)]/60">
          © {new Date().getFullYear()} Attestiva. All rights reserved.
        </div>
        <div className="flex gap-2 text-sm font-medium">
          <FooterNavLink href="#">Privacy</FooterNavLink>
          <FooterNavLink href="#">Terms</FooterNavLink>
          <FooterNavLink href="/contact">Contact Us</FooterNavLink>
        </div>
      </div>
    </footer>
  );
}
