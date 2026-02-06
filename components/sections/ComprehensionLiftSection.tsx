"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, Sparkles, TrendingUp } from "lucide-react";

type TrackId = "email" | "attestiva";

const metricRows: Array<{ label: string; values: Record<TrackId, number> }> = [
  {
    label: "Regulatory compliance rate",
    values: {
      email: 20,
      attestiva: 89,
    },
  },
  {
    label: "Incidents, breaches, and operational losses",
    values: {
      email: 75,
      attestiva: 30,
    },
  },
  {
    label: "Compliance-ready execution",
    values: {
      email: 15,
      attestiva: 75,
    },
  },
];

const comparison: Array<{
  id: TrackId;
  label: string;
  defaultValue: number;
  barClass: string;
  textClass: string;
  Icon: typeof Mail;
}> = [
  {
    id: "email",
    label: "Typical email dispatch",
    defaultValue: 20,
    barClass: "bg-white/35",
    textClass: "text-white",
    Icon: Mail,
  },
  {
    id: "attestiva",
    label: "Attestiva proficiency flow",
    defaultValue: 89,
    barClass: "bg-gradient-to-r from-[#D6FF0A] to-[#00D37F]",
    textClass: "text-[#D6FF0A]",
    Icon: CheckCircle2,
  },
];

export function ComprehensionLiftSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(0,211,127,0.24)_0%,transparent_48%),linear-gradient(125deg,#101712_0%,#1A1A1A_100%)] py-24 md:py-28">
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#D6FF0A]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-4 h-80 w-80 rounded-full bg-[#00D37F]/20 blur-3xl" />

      <div className="mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/25 bg-white/10 p-8 backdrop-blur-2xl md:p-12"
        >
          <div className="mb-10 max-w-4xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-5 py-2 font-display text-base font-bold uppercase tracking-wide text-[#D6FF0A]">
              <Sparkles className="h-5 w-5" />
              Comprehension Delta
            </p>
            <h3 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              Delivery alone is not understanding.
            </h3>
            <p className="mt-4 text-xl font-semibold leading-relaxed text-white/90 md:text-2xl">
              Typical policy emails get acknowledgment. Attestiva drives measurable comprehension.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="space-y-10">
              {metricRows.map((metric, metricIndex) => (
                <div key={metric.label} className="space-y-5">
                  <h4 className="font-display text-2xl font-bold text-white md:text-3xl">
                    {metric.label}
                  </h4>
                  {comparison.map((track, trackIndex) => {
                    const trackValue = metric.values[track.id] ?? track.defaultValue;
                    return (
                      <div
                        key={`${metric.label}-${track.label}`}
                        className="grid items-center gap-4 md:grid-cols-[280px_1fr_auto]"
                      >
                        <div className="flex items-center gap-3">
                          <track.Icon className="h-6 w-6 text-white/90" />
                          <span className="text-lg font-semibold text-white/90 md:text-xl">
                            {track.label}
                          </span>
                        </div>
                        <div className="h-7 rounded-full border border-white/20 bg-black/35 p-1">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${trackValue}%` }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                              duration: 0.85,
                              delay: metricIndex * 0.12 + trackIndex * 0.08,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${track.barClass}`}
                          />
                        </div>
                        <span className={`font-display text-4xl font-black ${track.textClass}`}>
                          {trackValue}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/25 bg-black/30 p-7 backdrop-blur-xl">
              <p className="mb-4 text-lg font-semibold uppercase tracking-wide text-white/70">
                Impact Snapshot
              </p>
              <p className="font-display text-7xl font-black leading-none text-[#D6FF0A]">
                4.4x
              </p>
              <p className="mt-3 text-2xl font-bold text-white">
                higher measured comprehension
              </p>
              <div className="mt-10 space-y-5 text-lg font-semibold text-white/90">
                <p className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-[#00D37F]" />
                  Email-only delivery captures clicks, not capability.
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#D6FF0A]" />
                  Attestiva adds teaching plus a proficiency checkpoint.
                </p>
                <p className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-[#00D37F]" />
                  Results are clear, auditable, and operationally useful.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
