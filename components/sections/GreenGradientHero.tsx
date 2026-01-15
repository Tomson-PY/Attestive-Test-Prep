"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GreenGradientHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect for phone image
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/green-gradient.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between py-12 md:py-16 px-6">
        {/* Top Content - Headline & Subheadline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none text-[#D6FF0A] mb-4"
          >
            UNDERSTANDING IS THE METRIC.
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            Attestiva transforms policies into verified competence with AI-powered assessments.
          </motion.p>

        </div>

        {/* Phone Image */}
        <motion.div
          className="relative flex-shrink-0 my-4 md:my-0"
          style={{ y: phoneY }}
        >
          {/* Entrance animation wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {/* Floating animation wrapper */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Hover interaction wrapper */}
              <motion.div
                whileHover={{
                  y: -20,
                  scale: 1.05,
                  rotateY: -5,
                }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                className="relative cursor-pointer"
                style={{ perspective: 1000 }}
              >
                {/* Glow effect behind phone */}
                <div className="absolute inset-0 blur-3xl bg-[#D6FF0A]/30 scale-125 rounded-full opacity-60" />

                <Image
                  src="/images/hand-holding-phone.png"
                  alt="Hand holding phone showing Attestiva app"
                  width={400}
                  height={320}
                  className="relative z-10 w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] h-auto drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row w-full max-w-2xl gap-0 sm:gap-0"
        >
          {/* Primary CTA - See Demo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group flex-1 flex items-center justify-center gap-3",
              "px-6 py-4 sm:py-5",
              "bg-[#D6FF0A] text-[#1A1A1A]",
              "font-display font-bold text-base sm:text-lg tracking-wide uppercase",
              "rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none",
              "transition-all duration-300",
              "hover:bg-[#e5ff4d]"
            )}
          >
            SEE DEMO
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </motion.button>

          {/* Secondary CTA - How It Works */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group flex-1 flex items-center justify-center gap-3",
              "px-6 py-4 sm:py-5",
              "bg-[#1A1A1A] text-white",
              "font-display font-bold text-base sm:text-lg tracking-wide uppercase",
              "rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none",
              "transition-all duration-300",
              "hover:bg-[#2a2a2a]"
            )}
          >
            HOW IT WORKS
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
