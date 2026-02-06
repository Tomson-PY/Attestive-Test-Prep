"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Activity, BarChart3, Grid3X3, Layers3, ShieldCheck, TrendingDown } from "lucide-react";

type ChartOptionId = "slope" | "incidents" | "waterfall" | "closure" | "heatmap" | "coverage";

type ChartOption = {
  id: ChartOptionId;
  code: string;
  title: string;
  sentence: string;
  Icon: typeof TrendingDown;
};

const chartOptions: ChartOption[] = [
  {
    id: "slope",
    code: "A",
    title: "Executive Ski Slope",
    sentence: "Open gaps are dropping faster after automation is enabled.",
    Icon: TrendingDown,
  },
  {
    id: "incidents",
    code: "B",
    title: "Severity + Repeat Overlay",
    sentence: "Severity is down and repeat incidents are trending down month over month.",
    Icon: Activity,
  },
  {
    id: "waterfall",
    code: "C",
    title: "Risk-to-Value Waterfall",
    sentence: "Risk and cost are being reduced through specific compliance interventions.",
    Icon: Layers3,
  },
  {
    id: "closure",
    code: "D",
    title: "Time-to-Close Shrink",
    sentence: "The long tail is shrinking and remediation is moving faster.",
    Icon: BarChart3,
  },
  {
    id: "heatmap",
    code: "E",
    title: "Evidence Freshness Heatmap",
    sentence: "Stale evidence is shrinking and critical controls are staying current.",
    Icon: Grid3X3,
  },
  {
    id: "coverage",
    code: "F",
    title: "Critical Control Coverage",
    sentence: "Coverage is strongest where risk-weighted controls matter most.",
    Icon: ShieldCheck,
  },
];

function SlopePreview() {
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      <defs>
        <linearGradient id="pickerSlopeLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D6FF0A" />
          <stop offset="100%" stopColor="#00D37F" />
        </linearGradient>
        <linearGradient id="pickerSlopeArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,211,127,0.42)" />
          <stop offset="100%" stopColor="rgba(0,211,127,0.02)" />
        </linearGradient>
      </defs>
      <path d="M 24 34 L 98 56 L 172 74 L 246 92 L 300 106 L 300 120 L 24 120 Z" fill="url(#pickerSlopeArea)" />
      <path d="M 24 34 L 98 56 L 172 74 L 246 92 L 300 106" fill="none" stroke="url(#pickerSlopeLine)" strokeWidth="5" strokeLinecap="round" />
      <line x1="172" y1="18" x2="172" y2="120" stroke="rgba(214,255,10,0.8)" strokeDasharray="3 5" />
      <circle cx="24" cy="34" r="5" fill="#D6FF0A" />
      <circle cx="98" cy="56" r="5" fill="#D6FF0A" />
      <circle cx="172" cy="74" r="5" fill="#D6FF0A" />
      <circle cx="246" cy="92" r="5" fill="#D6FF0A" />
      <circle cx="300" cy="106" r="5" fill="#D6FF0A" />
    </svg>
  );
}

function IncidentsPreview() {
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      {[40, 90, 140, 190, 240].map((x, index) => (
        <g key={x}>
          <rect x={x} y={86 - index * 2} width="24" height="34" fill="rgba(0,211,127,0.75)" rx="3" />
          <rect x={x} y={62 - index * 2} width="24" height="24" fill="rgba(214,255,10,0.9)" rx="3" />
          <rect x={x} y={50 - index} width="24" height="12" fill="rgba(255,122,122,0.92)" rx="3" />
        </g>
      ))}
      <path d="M 52 44 L 102 52 L 152 60 L 202 68 L 252 75" fill="none" stroke="#FF8A65" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function WaterfallPreview() {
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      <rect x="24" y="26" width="34" height="94" rx="5" fill="rgba(255,138,101,0.9)" />
      <line x1="58" y1="56" x2="88" y2="56" stroke="rgba(255,255,255,0.55)" />
      <rect x="88" y="56" width="34" height="32" rx="5" fill="rgba(214,255,10,0.92)" />
      <line x1="122" y1="70" x2="152" y2="70" stroke="rgba(255,255,255,0.55)" />
      <rect x="152" y="70" width="34" height="24" rx="5" fill="rgba(214,255,10,0.92)" />
      <line x1="186" y1="80" x2="216" y2="80" stroke="rgba(255,255,255,0.55)" />
      <rect x="216" y="80" width="34" height="20" rx="5" fill="rgba(214,255,10,0.92)" />
      <line x1="250" y1="92" x2="280" y2="92" stroke="rgba(255,255,255,0.55)" />
      <rect x="280" y="92" width="28" height="28" rx="5" fill="rgba(0,211,127,0.9)" />
    </svg>
  );
}

function ClosurePreview() {
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      {[56, 146, 236].map((x, index) => (
        <g key={x}>
          <rect x={x - 14} y={40 + index * 4} width="24" height={70 - index * 14} rx="4" fill="rgba(255,255,255,0.45)" />
          <rect x={x + 14} y={72 + index * 4} width="24" height={38 - index * 8} rx="4" fill="rgba(0,211,127,0.9)" />
        </g>
      ))}
      <line x1="18" y1="58" x2="302" y2="58" stroke="rgba(214,255,10,0.8)" strokeDasharray="4 6" />
    </svg>
  );
}

function HeatmapPreview() {
  const blocks = [
    [0.2, 0.35, 0.55, 0.8, 0.9],
    [0.25, 0.4, 0.6, 0.75, 0.85],
    [0.3, 0.42, 0.64, 0.78, 0.9],
    [0.18, 0.28, 0.48, 0.68, 0.84],
  ];
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      {blocks.map((row, rowIndex) =>
        row.map((opacity, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={28 + colIndex * 54}
            y={22 + rowIndex * 26}
            width="44"
            height="20"
            rx="3"
            fill={`rgba(0,211,127,${opacity})`}
          />
        ))
      )}
    </svg>
  );
}

function CoveragePreview() {
  return (
    <svg viewBox="0 0 320 140" className="h-28 w-full">
      {[20, 44, 68, 92, 116].map((y, index) => (
        <g key={y}>
          <rect x="24" y={y} width="264" height="14" rx="7" fill="rgba(255,255,255,0.15)" />
          <rect
            x="24"
            y={y}
            width={[236, 218, 194, 176, 160][index]}
            height="14"
            rx="7"
            fill={index < 2 ? "rgba(0,211,127,0.92)" : "rgba(214,255,10,0.9)"}
          />
        </g>
      ))}
    </svg>
  );
}

function PreviewById({ id }: { id: ChartOptionId }) {
  if (id === "slope") return <SlopePreview />;
  if (id === "incidents") return <IncidentsPreview />;
  if (id === "waterfall") return <WaterfallPreview />;
  if (id === "closure") return <ClosurePreview />;
  if (id === "heatmap") return <HeatmapPreview />;
  return <CoveragePreview />;
}

export function ChartStyleExamplesSection() {
  const [selectedId, setSelectedId] = useState<ChartOptionId>("slope");
  const selected = chartOptions.find((item) => item.id === selectedId) ?? chartOptions[0];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_18%_15%,rgba(214,255,10,0.16)_0%,transparent_42%),radial-gradient(circle_at_85%_88%,rgba(0,211,127,0.16)_0%,transparent_40%),linear-gradient(180deg,#111517_0%,#151A1D_58%,#101315_100%)] py-24 md:py-28">
      <div className="mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/20 bg-white/8 p-8 backdrop-blur-2xl md:p-12"
        >
          <p className="inline-flex items-center rounded-full border border-white/25 bg-black/35 px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Choose Chart Direction
          </p>
          <h3 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
            Pick the chart style you want next.
          </h3>
          <p className="mt-4 max-w-3xl text-lg font-semibold text-white/82 md:text-2xl">
            I added six strong options below. Pick an option code and I will turn it into the final section.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {chartOptions.map((option, index) => {
              const isActive = selectedId === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedId(option.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    isActive
                      ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/12"
                      : "border-white/20 bg-black/30 hover:bg-black/36"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white/90">
                      Option {option.code}
                    </span>
                    <option.Icon className={`h-4 w-4 ${isActive ? "text-[var(--color-accent)]" : "text-white/70"}`} />
                  </div>
                  <div className="rounded-xl border border-white/15 bg-[#121518]/90 p-2">
                    <PreviewById id={option.id} />
                  </div>
                  <p className="mt-3 font-display text-xl font-black text-white">{option.title}</p>
                  <p className="mt-1 text-sm font-semibold text-white/76">{option.sentence}</p>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-7 rounded-2xl border border-white/20 bg-black/32 p-5 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-white/60">Current Selection</p>
              <p className="mt-1 font-display text-2xl font-black text-[var(--color-accent)]">
                Option {selected.code}: {selected.title}
              </p>
              <p className="mt-1 text-sm font-semibold text-white/78">{selected.sentence}</p>
            </div>
            <p className="mt-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white md:mt-0">
              Reply with Option {selected.code}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
