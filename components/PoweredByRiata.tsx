"use client";

import { motion } from "framer-motion";
import { RiataLogo } from "@/components/RiataLogo";

export function PoweredByRiata() {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side: Animated Logo */}
          <div className="flex items-center justify-center relative min-h-[300px] lg:min-h-[400px]">
            {/* Decorative background blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/5 to-[var(--color-accent-2)]/5 rounded-full blur-3xl transform scale-110 -z-10" />
            <RiataLogo />
          </div>

          {/* Right Side: Text */}
          <div className="text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-[var(--color-text-main)]"
            >
              Powered by{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">Riata</span>
                {/* Highlight Shape */}
                <motion.span
                  className="absolute bg-[var(--color-accent)] rounded-sm -z-0"
                  initial={{ width: "0%", opacity: 0 }}
                  whileInView={{ width: "110%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1.2, ease: "circOut" }}
                  style={{
                    top: '15%',
                    bottom: '10%',
                    left: '-5%',
                    transform: 'rotate(-2deg)',
                    transformOrigin: 'center left'
                  }}
                />
              </span>
            </motion.h2>
          </div>
        </div>
      </div>
    </section>
  );
}
