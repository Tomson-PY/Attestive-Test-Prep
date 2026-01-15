"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SequentialHighlight } from "@/components/SequentialHighlight";

export function GreenGradientHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Parallax effect for rising image - completes as you approach the section
  const phoneY = useTransform(scrollYProgress, [0, 1], [300, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] md:min-h-[90vh] w-full overflow-hidden"
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
      <div className="relative z-10 h-full flex flex-col items-center justify-start py-12 md:py-16 px-6">
        {/* Top Content - Headline & Subheadline */}
        <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none mb-4"
          >
            <SequentialHighlight 
              delay={0.8}
              wordDuration={0.4}
              stagger={0.15}
              bgColor="#000000"
              textColor="#D6FF0A"
            >
              comprehension is our metric.
            </SequentialHighlight>
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

        {/* Woman with Binoculars Image */}
        <motion.div
          className="relative flex-shrink-0 mb-8 md:mb-12 z-0"
          style={{ y: phoneY }}
        >
          {/* Entrance animation wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 200, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: 1.2,
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
                  src="/images/woman-binoculars-hero.png"
                  alt="Woman with binoculars viewing ambulances - clear visibility into competence assessment"
                  width={700}
                  height={525}
                  className="relative z-10 w-[385px] sm:w-[490px] md:w-[595px] lg:w-[700px] h-auto drop-shadow-2xl"
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
          className="flex flex-col sm:flex-row w-full max-w-2xl gap-0 sm:gap-0 relative z-20 mt-auto"
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
