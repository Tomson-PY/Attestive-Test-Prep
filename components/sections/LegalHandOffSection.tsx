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
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: i * 0.12,
    },
  }),
};

export default function LegalHandOffSection() {
  return (
    <section
      aria-labelledby="legal-handoff"
      className="relative py-14 md:py-20 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-start"
        >
          {/* Image Card - Left on Desktop */}
          <motion.div
            variants={imageVariants}
            className="relative order-2 lg:order-1 lg:col-span-2"
          >
            {/* Big CYA label */}
            <div className="mb-5 lg:mb-6">
              <div className="font-display font-extrabold tracking-tight leading-none text-[44px] sm:text-6xl lg:text-7xl text-[var(--color-text-main)]">
                CYA
              </div>
            </div>

            <motion.div
              whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl shadow-lg border border-slate-200/60 overflow-hidden bg-white"
            >
              {/* Force a bold, cinematic height */}
              <div aria-hidden="true" className="h-[340px] sm:h-[440px] lg:h-[620px]" />

              {/* Subtle top gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent z-10 pointer-events-none" />

              <Image
                src="/images/CYA-Pillow.jpg"
                alt="Man holding a pillow with a checkbox symbol — representing checkbox compliance."
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />

              {/* Caption badge */}
              <div className="absolute bottom-4 left-4 z-20">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium tracking-wide">
                  CYA ≠ proof.
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content - Right on Desktop */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <motion.div variants={itemVariants}>
              {/* Eyebrow */}
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
                Compliance Theater
              </span>
            </motion.div>

            <motion.h2
              id="legal-handoff"
              variants={itemVariants}
              className="font-display font-extrabold text-3xl md:text-4xl lg:text-[44px] leading-tight tracking-tight text-[var(--color-text-main)] mb-5"
            >
              Is this what you're handing{" "}
              <AccentHighlight mode="inView" delay={0.15}>
                Legal
              </AccentHighlight>
              ?
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[52ch]">
                A checkbox is comforting. It's also a weak form of evidence when the stakes are real.
              </p>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[52ch]">
                Attestiva turns policies and procedures into verified understanding — not just "read & signed."
              </p>
            </motion.div>

            {/* Bold comparison statements (no tiny icons) */}
            <div className="space-y-6 mb-8">
              <motion.div
                custom={0}
                variants={cardVariants}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="font-display font-extrabold text-[15px] tracking-widest uppercase text-slate-500 mb-4">
                  Checkbox systems give you
                </div>
                <ul className="space-y-3">
                  <li className="font-display font-bold text-lg md:text-xl text-slate-800 leading-snug">
                    • Proof it was sent
                  </li>
                  <li className="font-display font-bold text-lg md:text-xl text-slate-800 leading-snug">
                    • Proof it was opened
                  </li>
                  <li className="font-display font-bold text-lg md:text-xl text-slate-800 leading-snug">
                    • Proof it was acknowledged
                  </li>
                </ul>
              </motion.div>

              <motion.div
                custom={1}
                variants={cardVariants}
                className="rounded-2xl border border-[var(--color-accent-2)]/30 bg-gradient-to-br from-emerald-50/40 to-white p-6 relative overflow-hidden"
              >
                <div className="absolute left-0 top-5 bottom-5 w-1.5 bg-[var(--color-accent-2)] rounded-full" />
                <div className="font-display font-extrabold text-[15px] tracking-widest uppercase text-slate-500 mb-4 pl-3">
                  Attestiva gives you
                </div>
                <ul className="space-y-3 pl-3">
                  <li className="font-display font-extrabold text-lg md:text-xl text-slate-900 leading-snug">
                    • Proof it was understood
                  </li>
                  <li className="font-display font-extrabold text-lg md:text-xl text-slate-900 leading-snug">
                    • Scenario-based verification
                  </li>
                  <li className="font-display font-extrabold text-lg md:text-xl text-slate-900 leading-snug">
                    • Targeted follow-up for gaps
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full",
                  "bg-[var(--color-accent-2)] text-white font-semibold text-sm",
                  "shadow-md shadow-[var(--color-accent-2)]/25",
                  "transition-colors hover:bg-[var(--color-accent-2)]/90"
                )}
              >
                See Proof of Understanding
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "inline-flex items-center justify-center px-6 py-3 rounded-full",
                  "border border-slate-300 text-slate-700 font-semibold text-sm",
                  "bg-white hover:bg-slate-50 transition-colors"
                )}
              >
                How it works
              </motion.button>
            </motion.div>

            {/* Microcopy */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-slate-500"
            >
              Better adoption. Less drift. Stronger audit posture.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
