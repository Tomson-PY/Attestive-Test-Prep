"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle2, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "Verifiable Comprehension",
    description: "Produce audit-grade proof that people understood—not just opened—your policies. Defensible evidence for regulators, auditors, and incident review."
  },
  {
    icon: Brain,
    title: "AI-Powered Explanation",
    description: "Personalized, plain-language explanations tailored by role, department, and context. Make complex policies accessible to everyone."
  },
  {
    icon: BarChart3,
    title: "Risk Intelligence",
    description: "Identify which teams misunderstand what, where confusion clusters, and what remediation actually works. Act before incidents happen."
  }
];

// Animated card with 3D tilt effect
function TiltCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  // Mouse position for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for natural movement
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Handle mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1] 
      }}
      style={{
        perspective: 1000,
      }}
      className="group"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative p-8 rounded-2xl bg-[var(--bg-surface)] border border-black/5 
                   hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 transition-shadow duration-500
                   cursor-pointer h-full"
      >
        {/* Animated gradient border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-2) 100%)",
            padding: "1px",
            transform: "translateZ(-1px)",
          }}
        />
        
        {/* Inner content wrapper */}
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Icon with floating animation */}
          <motion.div 
            className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 relative overflow-hidden"
            animate={isInView ? {
              y: [0, -4, 0],
            } : {}}
            transition={{
              duration: 3,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Pulse ring animation */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-[var(--color-accent)]/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? {
                scale: [0.8, 1.2, 0.8],
                opacity: [0, 0.5, 0],
              } : {}}
              transition={{
                duration: 2,
                delay: index * 0.2 + 0.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <feature.icon className="w-7 h-7 text-[var(--color-accent)] relative z-10" />
          </motion.div>
          
          {/* Title with character stagger effect */}
          <h3 className="font-display font-bold text-xl mb-3 text-[var(--text-main)]">
            {feature.title.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15 + 0.3 + charIndex * 0.02,
                  ease: [0.23, 1, 0.32, 1]
                }}
              >
                {char}
              </motion.span>
            ))}
          </h3>
          
          {/* Description with blur-in effect */}
          <motion.p 
            className="text-[var(--text-main)]/70 leading-relaxed"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{
              duration: 0.6,
              delay: index * 0.15 + 0.5,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {feature.description}
          </motion.p>
          
          {/* Bottom accent line that draws in */}
          <motion.div
            className="mt-6 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.15 + 0.7,
              ease: [0.23, 1, 0.32, 1]
            }}
          />
        </div>
        
        {/* Subtle glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(214, 255, 10, 0.1) 0%, transparent 50%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function FeatureGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-white relative z-20 overflow-hidden">
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(214, 255, 10, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="max-w-screen-xl mx-auto px-6 relative">
        {/* Header with word-by-word reveal */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            className="font-display font-bold text-3xl md:text-4xl text-[var(--text-main)] mb-4"
          >
            {"From Policy to Proven Understanding".split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block overflow-hidden mr-[0.25em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: 40, opacity: 0 }}
                  animate={isTitleInView ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: wordIndex * 0.08,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          
          <motion.p 
            className="text-lg text-[var(--text-main)]/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            Close the gap between "I saw it" and "I can do it" with AI-powered verification.
          </motion.p>
        </div>
        
        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <TiltCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
