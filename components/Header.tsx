"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttestivaLogo } from "@/components/AttestivaLogo";
import { useScrolled } from "@/hooks/useScrolled";

interface HeaderProps {
  transparent?: boolean;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  transparent?: boolean;
  isActive?: boolean;
}

const MotionLink = motion.create(Link);

function NavLink({ href, children, transparent, isActive }: NavLinkProps) {
  // Calculate the default text color based on state
  const defaultColor = isActive ? "#000000" : transparent ? "rgba(255,255,255,0.9)" : "#000000";

  return (
    <MotionLink
      href={href}
      className="relative inline-block"
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className={cn(
          "relative z-10 px-2",
          isActive && "text-black"
        )}
        animate={{ color: defaultColor }}
        whileHover={{ color: "#000000" }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 bg-[var(--color-accent)] -skew-x-2"
        variants={{
          idle: { scaleX: isActive ? 1 : 0 },
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

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  transparent: boolean;
}

function MobileMenuButton({ isOpen, onClick, transparent }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "md:hidden p-2 -mr-2 rounded-lg transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]",
        transparent
          ? "text-white hover:bg-white/10"
          : "text-[var(--text-main)] hover:bg-black/5"
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isOpen ? "close" : "menu"}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  transparent: boolean;
  currentPath: string;
}

const menuContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

function MobileMenu({ isOpen, onClose, transparent, currentPath }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className={cn(
              "absolute inset-0",
              transparent
                ? "bg-black/95 backdrop-blur-md"
                : "bg-[var(--bg-surface)]/98 backdrop-blur-md"
            )}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Menu Content */}
          <motion.nav
            className="relative h-full pt-20 px-6 flex flex-col"
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Navigation Links */}
            <div className="flex-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <motion.div key={link.href} variants={menuItemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "block py-4 text-xl font-medium border-b transition-colors",
                        transparent
                          ? "text-white border-white/10 hover:text-[var(--color-accent)]"
                          : "text-[var(--text-main)] border-black/5 hover:text-[var(--color-accent)]",
                        isActive && (transparent ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]")
                      )}
                    >
                      <span className="relative">
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="mobileActiveIndicator"
                            className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                          />
                        )}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Section */}
            <motion.div className="pb-8 space-y-4" variants={menuItemVariants}>
              <Link
                href="/login"
                onClick={onClose}
                className={cn(
                  "block py-3 text-center text-lg font-medium transition-colors",
                  transparent
                    ? "text-white/80 hover:text-white"
                    : "text-[var(--text-main)]/80 hover:text-[var(--text-main)]"
                )}
              >
                Log in
              </Link>
              <Link
                href="/start"
                onClick={onClose}
                className={cn(
                  "block py-4 rounded-xl text-center text-lg font-semibold transition-all",
                  transparent
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[var(--color-ink)] text-white hover:bg-black/80"
                )}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled(20);

  // Compute effective transparency based on scroll state
  const isTransparent = transparent && !scrolled;

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
    <header className={cn(
      "fixed top-0 left-0 right-0 z-60 w-full transition-all duration-300",
      isTransparent
        ? "bg-transparent"
        : "backdrop-blur-md bg-[var(--bg-surface)]/80 border-b border-black/5"
    )}>
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Attestiva"
          className={cn(
          "font-display font-extrabold text-3xl leading-none tracking-tight transition-colors",
          isTransparent ? "text-white" : "text-[var(--text-main)]"
          )}
        >
          <span className="sr-only">Attestiva</span>
          <AttestivaLogo />
        </Link>

        <nav className={cn(
          "hidden md:flex items-center gap-2 text-sm font-medium",
          isTransparent ? "text-white/90" : "text-black"
        )}>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              transparent={isTransparent}
              isActive={pathname === link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className={cn(
            "hidden md:block text-sm font-medium transition-colors",
            isTransparent ? "text-white hover:text-white/80" : "text-[var(--text-main)] hover:text-[var(--color-ink)]"
          )}>
            Log in
          </Link>
          <Link
            href="/start"
            className={cn(
              "hidden md:block px-5 py-2.5 rounded-lg text-sm font-semibold transition-all focus:ring-2 focus:ring-offset-2",
              isTransparent
                ? "bg-white text-black hover:bg-white/90 focus:ring-white"
                : "bg-[var(--color-ink)] text-white hover:bg-black/80 focus:ring-[var(--color-ink)]"
            )}
          >
            Get Started
          </Link>
          <MobileMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            transparent={isTransparent}
          />
        </div>
      </div>
    </header>

    <MobileMenu
      isOpen={isMenuOpen}
      onClose={handleCloseMenu}
      transparent={isTransparent}
      currentPath={pathname}
    />
    </>
  );
}
