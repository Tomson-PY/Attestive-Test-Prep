"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, HardHat, Landmark, Zap } from "lucide-react";

const industryProps = [
  {
    icon: Heart,
    industry: "Healthcare & Clinical Teams",
    description: "Policy updates, clinical protocols, infection control—ensure staff don't just receive information, they can apply it. Reduced errors, faster rollouts, audit-ready evidence.",
    color: "from-red-100 to-red-200"
  },
  {
    icon: HardHat,
    industry: "Manufacturing & Industrial Safety",
    description: "Lockout/tagout, PPE changes, incident response—prove your workforce understands safety procedures with defensible training evidence that satisfies OSHA requirements.",
    color: "from-amber-100 to-amber-200"
  },
  {
    icon: Landmark,
    industry: "Financial Services & Banking",
    description: "AML/KYC procedures, fraud response, customer data handling—fewer violations caused by misunderstanding, better evidence for SEC, FINRA, and regulatory exams.",
    color: "from-blue-100 to-blue-200"
  },
  {
    icon: Zap,
    industry: "Energy, Utilities & Field Services",
    description: "Distributed workforce alignment across sites and shifts. Consistent execution under pressure, verified at scale. From safety briefings to outage response.",
    color: "from-green-100 to-green-200"
  }
];

export function ValueCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Optional parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Subtle horizontal shift on scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  return (
    <section className="py-24 overflow-hidden bg-[var(--bg-surface)]">
      <div className="max-w-screen-xl mx-auto px-6 mb-12">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-main)]">Proof of Understanding Across Industries</h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative w-full overflow-x-auto pb-8 hide-scrollbar">
        <motion.div
          className="flex gap-6 px-6 w-max"
          style={{ x }}
        >
           {industryProps.map((item, i) => (
             <div key={i} className="w-[300px] md:w-[400px] h-[280px] bg-white rounded-2xl border border-black/5 p-8 shadow-sm flex-shrink-0 flex flex-col justify-between hover:border-[var(--color-accent)]/30 transition-colors group">
               <div>
                 <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                   <item.icon className="w-6 h-6 text-gray-700" />
                 </div>
                 <div className="text-base text-[var(--text-main)]/80 leading-relaxed">
                   {item.description}
                 </div>
               </div>
               <div className="font-bold text-sm text-[var(--text-main)]">
                 {item.industry}
               </div>
             </div>
           ))}
        </motion.div>
      </div>
    </section>
  );
}
