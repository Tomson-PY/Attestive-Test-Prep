"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AccentHighlight } from "@/components/AccentHighlight";

export function HeroAttestiva() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Girl-Hero-BW.jpg"
          alt="Creator working on laptop"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] mb-8 text-white"
          >
            Stop tracking checkboxes.
            <br />
            Start{" "}
            <AccentHighlight mode="animate" delay={1.0}>
              verifying
            </AccentHighlight>{" "}
            competence.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed"
          >
Attestiva is compliance SaaS that verifies comprehension—turning policy distribution into measurable, auditable understanding and competency, not just "read and signed."
          </motion.p>
        </div>
      </div>

    </section>
  );
}
