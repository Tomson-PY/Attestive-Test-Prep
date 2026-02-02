"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, CheckCircle, Mail, MessageSquare, User, Building } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-surface)]">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-main)]/60 hover:text-[var(--color-accent-2)] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-[var(--color-text-main)] mb-6">
                Let&apos;s start a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">conversation</span>
                  <motion.span
                    className="absolute bg-[var(--color-accent)] rounded-sm -z-0"
                    initial={{ width: "0%", opacity: 0 }}
                    animate={{ width: "110%", opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: "circOut" }}
                    style={{
                      top: "15%",
                      bottom: "10%",
                      left: "-5%",
                      transform: "rotate(-2deg)",
                      transformOrigin: "center left",
                    }}
                  />
                </span>
              </h1>
              
              <p className="text-lg text-[var(--text-main)]/70 leading-relaxed mb-8 max-w-md">
                Ready to transform your compliance training? We&apos;d love to hear from you. 
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-main)]">Email us</div>
                    <div className="text-sm text-[var(--text-main)]/60">hello@attestiva.com</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-2)]/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[var(--color-accent-2)]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-main)]">Live chat</div>
                    <div className="text-sm text-[var(--text-main)]/60">Available 9am - 5pm EST</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent)]" />
                
                <div className="p-8 sm:p-10">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-[var(--text-main)]">
                          Full name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                            className={cn(
                              "w-full pl-12 pr-4 py-3 rounded-xl",
                              "bg-slate-50 border border-slate-200",
                              "text-[var(--text-main)] placeholder:text-slate-400",
                              "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)]",
                              "transition-all duration-200"
                            )}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-[var(--text-main)]">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            required
                            className={cn(
                              "w-full pl-12 pr-4 py-3 rounded-xl",
                              "bg-slate-50 border border-slate-200",
                              "text-[var(--text-main)] placeholder:text-slate-400",
                              "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)]",
                              "transition-all duration-200"
                            )}
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      {/* Company Field */}
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-semibold text-[var(--text-main)]">
                          Company
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formState.company}
                            onChange={handleChange}
                            className={cn(
                              "w-full pl-12 pr-4 py-3 rounded-xl",
                              "bg-slate-50 border border-slate-200",
                              "text-[var(--text-main)] placeholder:text-slate-400",
                              "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)]",
                              "transition-all duration-200"
                            )}
                            placeholder="Acme Inc. (optional)"
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-semibold text-[var(--text-main)]">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl",
                            "bg-slate-50 border border-slate-200",
                            "text-[var(--text-main)] placeholder:text-slate-400",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)]",
                            "transition-all duration-200 resize-none"
                          )}
                          placeholder="Tell us about your compliance needs..."
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "w-full py-4 rounded-xl",
                          "bg-[var(--color-ink)] text-white",
                          "font-semibold text-base",
                          "flex items-center justify-center gap-2",
                          "shadow-lg shadow-black/10",
                          "hover:shadow-xl hover:shadow-black/20",
                          "transition-all duration-200",
                          "disabled:opacity-70 disabled:cursor-not-allowed"
                        )}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send message
                          </>
                        )}
                      </motion.button>
                    </form>
                  ) : (
                    /* Success State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-[var(--color-accent-2)]/10 flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-[var(--color-accent-2)]" />
                      </motion.div>
                      <h3 className="font-display font-bold text-2xl text-[var(--text-main)] mb-3">
                        Message sent!
                      </h3>
                      <p className="text-[var(--text-main)]/60 mb-8">
                        Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                      <Link
                        href="/"
                        className={cn(
                          "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                          "bg-[var(--color-accent)] text-[var(--color-text-main)]",
                          "font-semibold text-sm",
                          "hover:shadow-lg hover:shadow-[var(--color-accent)]/30",
                          "transition-all duration-200"
                        )}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
