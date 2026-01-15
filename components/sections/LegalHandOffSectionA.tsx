"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AccentHighlight } from "@/components/AccentHighlight";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
      delay: 0.3 + i * 0.15,
    },
  }),
};

export default function LegalHandOffSectionA() {
  return (
    <section
      aria-labelledby="legal-handoff-a"
      className="relative min-h-[90vh] w-full overflow-hidden"
    >
      {/* Full-bleed Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/CYA-Pillow.jpg"
          alt="Man holding a pillow with a checkbox symbol — representing checkbox compliance."
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Giant CYA Watermark */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
        <motion.span
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.08, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="font-display font-black text-[200px] sm:text-[280px] md:text-[360px] lg:text-[420px] text-white leading-none tracking-tighter select-none -ml-4 sm:-ml-8"
        >
          CYA
        </motion.span>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full min-h-[90vh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - spacer on large screens to let image show */}
            <div className="hidden lg:block" />

            {/* Right side - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:max-w-xl"
            >
              {/* Eyebrow */}
              <motion.span
                variants={itemVariants}
                className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#D6FF0A] mb-4"
              >
                Compliance Theater
              </motion.span>

              {/* Headline */}
              <motion.h2
                id="legal-handoff-a"
                variants={itemVariants}
                className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white mb-6"
              >
                Is this what you're handing{" "}
                <AccentHighlight mode="inView" delay={0.4}>
                  Legal
                </AccentHighlight>
                ?
              </motion.h2>

              {/* Description */}
              <motion.div variants={itemVariants} className="space-y-4 mb-10">
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  A checkbox is comforting. It's also a weak form of evidence when the stakes are real.
                </p>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  Attestiva turns policies and procedures into verified understanding — not just "read & signed."
                </p>
              </motion.div>

              {/* Glassmorphism Comparison Cards */}
              <div className="space-y-4 mb-10">
                {/* Checkbox systems card */}
                <motion.div
                  custom={0}
                  variants={cardVariants}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6"
                >
                  <div className="font-display font-bold text-xs tracking-[0.15em] uppercase text-white/60 mb-4">
                    Checkbox systems give you
                  </div>
                  <ul className="space-y-2">
                    <li className="font-display font-semibold text-lg text-white/90">
                      • Proof it was sent
                    </li>
                    <li className="font-display font-semibold text-lg text-white/90">
                      • Proof it was opened
                    </li>
                    <li className="font-display font-semibold text-lg text-white/90">
                      • Proof it was acknowledged
                    </li>
                  </ul>
                </motion.div>

                {/* Attestiva card */}
                <motion.div
                  custom={1}
                  variants={cardVariants}
                  className="backdrop-blur-xl bg-[#D6FF0A]/10 border border-[#D6FF0A]/30 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#D6FF0A] rounded-full" />
                  <div className="font-display font-bold text-xs tracking-[0.15em] uppercase text-[#D6FF0A] mb-4 pl-4">
                    Attestiva gives you
                  </div>
                  <ul className="space-y-2 pl-4">
                    <li className="font-display font-bold text-lg text-white">
                      • Proof it was understood
                    </li>
                    <li className="font-display font-bold text-lg text-white">
                      • Scenario-based verification
                    </li>
                    <li className="font-display font-bold text-lg text-white">
                      • Targeted follow-up for gaps
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "inline-flex items-center justify-center px-7 py-3.5 rounded-full",
                    "bg-[#D6FF0A] text-[#1A1A1A] font-bold text-sm tracking-wide uppercase",
                    "transition-all hover:bg-[#e5ff4d]"
                  )}
                >
                  See Proof of Understanding
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "inline-flex items-center justify-center px-7 py-3.5 rounded-full",
                    "border border-white/30 text-white font-bold text-sm tracking-wide uppercase",
                    "backdrop-blur-sm hover:bg-white/10 transition-all"
                  )}
                >
                  How it works
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-6 left-6 z-20">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium tracking-wide">
          CYA ≠ proof.
        </span>
      </div>
    </section>
  );
}
