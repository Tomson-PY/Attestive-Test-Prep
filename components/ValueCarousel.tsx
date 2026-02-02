"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, HardHat, Landmark, Zap, ArrowRight } from "lucide-react";

const industryProps = [
  {
    icon: Heart,
    industry: "Healthcare & Clinical Teams",
    shortTitle: "Healthcare",
    description: "Policy updates, clinical protocols, infection control—ensure staff don't just receive information, they can apply it. Reduced errors, faster rollouts, audit-ready evidence.",
    color: "from-red-400 to-rose-500",
    bgGlow: "rgba(244, 63, 94, 0.15)",
    accentColor: "#f43f5e"
  },
  {
    icon: HardHat,
    industry: "Manufacturing & Industrial Safety",
    shortTitle: "Manufacturing",
    description: "Lockout/tagout, PPE changes, incident response—prove your workforce understands safety procedures with defensible training evidence that satisfies OSHA requirements.",
    color: "from-amber-400 to-orange-500",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    accentColor: "#f59e0b"
  },
  {
    icon: Landmark,
    industry: "Financial Services & Banking",
    shortTitle: "Financial",
    description: "AML/KYC procedures, fraud response, customer data handling—fewer violations caused by misunderstanding, better evidence for SEC, FINRA, and regulatory exams.",
    color: "from-blue-400 to-indigo-500",
    bgGlow: "rgba(59, 130, 246, 0.15)",
    accentColor: "#3b82f6"
  },
  {
    icon: Zap,
    industry: "Energy, Utilities & Field Services",
    shortTitle: "Energy",
    description: "Distributed workforce alignment across sites and shifts. Consistent execution under pressure, verified at scale. From safety briefings to outage response.",
    color: "from-green-400 to-emerald-500",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    accentColor: "#10b981"
  }
];

// Individual industry card with slide-in and hover expansion
function IndustryCard({ 
  item, 
  index, 
  isActive, 
  onHover 
}: { 
  item: typeof industryProps[0]; 
  index: number;
  isActive: boolean;
  onHover: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 100, rotateY: -15 }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        rotateY: 0,
      } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.12,
        ease: [0.23, 1, 0.32, 1]
      }}
      onMouseEnter={onHover}
      className="relative flex-shrink-0"
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{
          width: isActive ? 420 : 300,
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.23, 1, 0.32, 1] 
        }}
        className="h-[300px] rounded-2xl border border-black/5 p-6 shadow-sm 
                   hover:shadow-xl transition-shadow duration-500 relative overflow-hidden
                   cursor-pointer group"
        style={{
          background: "white",
        }}
      >
        {/* Animated background gradient on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${item.bgGlow} 0%, transparent 70%)`,
          }}
        />
        
        {/* Top accent bar with gradient */}
        <motion.div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.12 + 0.3,
            ease: [0.23, 1, 0.32, 1]
          }}
          style={{ originX: 0 }}
        />
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon with bounce-in animation */}
          <motion.div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: index * 0.12 + 0.2
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <item.icon className="w-6 h-6 text-white" />
          </motion.div>
          
          {/* Description with fade and slide */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.12 + 0.4,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            <p className="text-base text-[var(--text-main)]/80 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
          
          {/* Industry label with animated underline */}
          <motion.div 
            className="mt-auto pt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[var(--text-main)]">
                {isActive ? item.industry : item.shortTitle}
              </span>
              
              {/* Animated arrow on active */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight 
                      className="w-5 h-5"
                      style={{ color: item.accentColor }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Progress indicator line */}
            <motion.div
              className="mt-2 h-0.5 rounded-full overflow-hidden bg-gray-100"
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${item.color}`}
                initial={{ width: "0%" }}
                animate={isActive ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Corner decoration */}
        <motion.div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${item.accentColor} 0%, transparent 70%)`,
          }}
          animate={isActive ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function ValueCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTitleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Parallax on scroll - subtle horizontal shift as user scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Animation: shifts from right to left as user scrolls
  // At scrollYProgress 0.5 (section centered), x = 0 (cards centered)
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden bg-[var(--bg-surface)] relative">
      {/* Background decorative elements */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 211, 127, 0.2) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-screen-xl mx-auto px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Title with typewriter-like reveal */}
          <motion.h2
            className="font-display font-bold text-3xl md:text-4xl text-[var(--text-main)]"
          >
            {"Proof of Understanding Across Industries".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={isTitleInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.05,
                  delay: i * 0.02,
                  ease: "linear"
                }}
              >
                {char}
              </motion.span>
            ))}
            {/* Blinking cursor */}
            <motion.span
              className="inline-block w-[3px] h-[1em] bg-[var(--color-accent)] ml-1 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </motion.h2>

          {/* Subtitle fade in */}
          <motion.p
            className="mt-4 text-[var(--text-main)]/60 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Explore how Attestiva transforms compliance across different sectors
          </motion.p>
        </div>
      </div>

      {/* Horizontal Scroll Container - centered with overflow visible */}
      <div ref={containerRef} className="relative w-full overflow-x-auto pb-8 hide-scrollbar">
        <motion.div
          className="flex gap-6 w-max items-center mx-auto"
          style={{ x }}
        >
          {industryProps.map((item, i) => (
            <IndustryCard 
              key={i} 
              item={item} 
              index={i}
              isActive={activeIndex === i}
              onHover={() => setActiveIndex(i)}
            />
          ))}
          
          {/* End CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="flex-shrink-0 w-[260px] h-[300px] rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] 
                       p-6 flex flex-col justify-center items-center text-center cursor-pointer group
                       shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-4xl mb-4 block">🚀</span>
            </motion.div>
            <h3 className="font-display font-bold text-xl text-[var(--text-main)] mb-2">
              See Your Industry?
            </h3>
            <p className="text-[var(--text-main)]/70 text-sm mb-4">
              Let&apos;s discuss how Attestiva can work for you
            </p>
            <motion.div
              className="flex items-center gap-2 text-[var(--text-main)] font-semibold text-sm"
              whileHover={{ x: 5 }}
            >
              Get in touch <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Gradient fade on right edge */}
        <div className="absolute right-0 top-0 bottom-8 w-32 bg-gradient-to-l from-[var(--bg-surface)] to-transparent pointer-events-none" />
      </div>
      
      {/* Progress dots */}
      <div className="max-w-screen-xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-2">
          {industryProps.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: activeIndex === i ? industryProps[i].accentColor : "#e5e7eb",
                width: activeIndex === i ? 32 : 8,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
