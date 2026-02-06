"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type MouseEvent } from "react";
import {
  Activity,
  AlertTriangle,
  Clock3,
  DollarSign,
  Filter,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type ActiveView = "risk" | "efficiency";
type DateRange = "30d" | "90d" | "365d";
type OrgUnit = "all" | "north" | "enterprise";
type Framework = "all" | "soc2" | "hipaa" | "iso";

type Insight = {
  view: ActiveView;
  title: string;
  detail: string;
  drivers: string[];
  actions: string[];
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  text: string;
};

type WaterfallPoint = {
  id: string;
  label: string;
  from: number;
  to: number;
  valueLabel: string;
  kind: "start" | "delta" | "current";
  cumulativeAfter: number;
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const burnDownBase = [90, 85, 81, 76, 70, 62, 53, 45, 38, 31, 25, 19];
const evidenceCurrentBase = [67, 69, 70, 72, 74, 77, 80, 84, 87, 89, 91, 93];

const incidentsBase = [
  { low: 21, medium: 13, high: 8, repeat: 10 },
  { low: 20, medium: 12, high: 8, repeat: 9 },
  { low: 19, medium: 12, high: 7, repeat: 9 },
  { low: 18, medium: 11, high: 7, repeat: 8 },
  { low: 17, medium: 10, high: 6, repeat: 7 },
  { low: 16, medium: 10, high: 6, repeat: 7 },
  { low: 15, medium: 9, high: 5, repeat: 6 },
  { low: 14, medium: 8, high: 5, repeat: 5 },
  { low: 13, medium: 8, high: 4, repeat: 5 },
  { low: 12, medium: 7, high: 4, repeat: 4 },
  { low: 11, medium: 6, high: 3, repeat: 4 },
  { low: 10, medium: 6, high: 3, repeat: 3 },
];

const timeToCloseBase = [
  { bucket: "Median", before: 33, after: 16 },
  { bucket: "75th %ile", before: 49, after: 24 },
  { bucket: "90th %ile", before: 72, after: 36 },
];

const dateRangeLabels: Record<DateRange, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "365d": "Last 365 days",
};

const orgLabels: Record<OrgUnit, string> = {
  all: "All Units",
  north: "North Ops",
  enterprise: "Enterprise",
};

const frameworkLabels: Record<Framework, string> = {
  all: "All Frameworks",
  soc2: "SOC 2",
  hipaa: "HIPAA",
  iso: "ISO 27001",
};

const dateWindow: Record<DateRange, number> = {
  "30d": 4,
  "90d": 6,
  "365d": 12,
};

const riskDateFactor: Record<DateRange, number> = {
  "30d": 0.95,
  "90d": 1,
  "365d": 1.12,
};

const efficiencyDateFactor: Record<DateRange, number> = {
  "30d": 0.94,
  "90d": 1,
  "365d": 1.1,
};

const riskOrgFactor: Record<OrgUnit, number> = {
  all: 1,
  north: 0.94,
  enterprise: 1.08,
};

const efficiencyOrgFactor: Record<OrgUnit, number> = {
  all: 1,
  north: 0.93,
  enterprise: 1.06,
};

const riskFrameworkFactor: Record<Framework, number> = {
  all: 1,
  soc2: 0.95,
  hipaa: 1.08,
  iso: 0.97,
};

const efficiencyFrameworkFactor: Record<Framework, number> = {
  all: 1,
  soc2: 0.94,
  hipaa: 1.07,
  iso: 0.98,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildWaterfallPoints(baselineCostK: number, reductionScale: number): WaterfallPoint[] {
  const deltas = [
    { id: "audit-hours", label: "Audit Hours", delta: -Math.round(122 * reductionScale) },
    { id: "external", label: "External Spend", delta: -Math.round(86 * reductionScale) },
    { id: "downtime", label: "Downtime Avoided", delta: -Math.round(78 * reductionScale) },
    { id: "repeat", label: "Repeat Incidents", delta: -Math.round(56 * reductionScale) },
  ];

  const points: WaterfallPoint[] = [
    {
      id: "baseline",
      label: "Baseline",
      from: 0,
      to: baselineCostK,
      valueLabel: `$${baselineCostK}k`,
      kind: "start",
      cumulativeAfter: baselineCostK,
    },
  ];

  let running = baselineCostK;
  for (const item of deltas) {
    const next = running + item.delta;
    points.push({
      id: item.id,
      label: item.label,
      from: next,
      to: running,
      valueLabel: `-${Math.abs(item.delta)}k`,
      kind: "delta",
      cumulativeAfter: next,
    });
    running = next;
  }

  points.push({
    id: "current",
    label: "Current",
    from: 0,
    to: running,
    valueLabel: `$${running}k`,
    kind: "current",
    cumulativeAfter: running,
  });

  return points;
}

function defaultInsight(view: ActiveView): Insight {
  if (view === "risk") {
    return {
      view,
      title: "Top drivers are concentrated in access reviews and vendor evidence timeliness.",
      detail:
        "Risk is improving, but repeat issues still cluster around controls with stale evidence and delayed third-party attestations.",
      drivers: [
        "14 controls are nearing evidence expiration in the next 30 days.",
        "2 vendor groups account for 47% of high-severity repeat incidents.",
        "Access-review signoff latency is above target in one enterprise segment.",
      ],
      actions: [
        "Auto-escalate controls with evidence age > 45 days to control owners.",
        "Increase vendor review cadence from quarterly to monthly for critical vendors.",
        "Trigger focused training for teams with repeat incident concentration.",
      ],
    };
  }

  return {
    view,
    title: "Efficiency gains are strongest in remediation cycle time and external audit prep.",
    detail:
      "The largest savings now come from shrinking long-tail closures and reducing consultant rework during evidence collection.",
    drivers: [
      "90th percentile closure time is down by roughly half versus pre-rollout.",
      "Audit prep labor reduction is the largest cost-avoidance contributor.",
      "Repeat incident investigation effort continues to decline month over month.",
    ],
    actions: [
      "Lock evidence automation coverage to all critical controls this quarter.",
      "Use targeted coaching for owners with closure times above the 75th percentile.",
      "Publish monthly efficiency scorecards for leadership and remediation teams.",
    ],
  };
}

export function ComplianceImpactChartsSection() {
  const [activeView, setActiveView] = useState<ActiveView>("risk");
  const [dateRange, setDateRange] = useState<DateRange>("90d");
  const [orgUnit, setOrgUnit] = useState<OrgUnit>("all");
  const [framework, setFramework] = useState<Framework>("all");
  const [drillFilter, setDrillFilter] = useState<string | null>(null);
  const [insight, setInsight] = useState<Insight>(defaultInsight("risk"));
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const showTooltip = (event: MouseEvent<SVGElement | HTMLElement>, text: string) => {
    setTooltip({
      visible: true,
      x: event.clientX + 12,
      y: event.clientY + 12,
      text,
    });
  };

  const hideTooltip = () => {
    setTooltip((previous) => ({ ...previous, visible: false }));
  };

  const clearAllFilters = () => {
    setDateRange("90d");
    setOrgUnit("all");
    setFramework("all");
    setDrillFilter(null);
    setInsight(defaultInsight(activeView));
  };

  const hasActiveFilter = dateRange !== "90d" || orgUnit !== "all" || framework !== "all" || drillFilter !== null;

  const riskFactor = useMemo(() => {
    return riskDateFactor[dateRange] * riskOrgFactor[orgUnit] * riskFrameworkFactor[framework];
  }, [dateRange, orgUnit, framework]);

  const efficiencyFactor = useMemo(() => {
    return (
      efficiencyDateFactor[dateRange] *
      efficiencyOrgFactor[orgUnit] *
      efficiencyFrameworkFactor[framework]
    );
  }, [dateRange, orgUnit, framework]);

  const windowSize = dateWindow[dateRange];
  const startIndex = monthLabels.length - windowSize;
  const months = monthLabels.slice(startIndex);

  const burnDownSeries = useMemo(() => {
    return burnDownBase.slice(startIndex).map((value, index) => {
      const slopeAdjust = 1 - index * 0.01;
      return clamp(Math.round(value * riskFactor * slopeAdjust), 8, 99);
    });
  }, [startIndex, riskFactor]);

  const evidenceSeries = useMemo(() => {
    return evidenceCurrentBase.slice(startIndex).map((value) => {
      const reduction = (riskFactor - 1) * 19;
      return clamp(Math.round(value - reduction), 58, 98);
    });
  }, [startIndex, riskFactor]);

  const incidentsSeries = useMemo(() => {
    return incidentsBase.slice(startIndex).map((item, index) => {
      const trendAdjust = 1 - index * 0.02;
      return {
        low: clamp(Math.round(item.low * riskFactor * trendAdjust), 2, 38),
        medium: clamp(Math.round(item.medium * riskFactor * trendAdjust), 1, 30),
        high: clamp(Math.round(item.high * riskFactor * trendAdjust), 1, 24),
        repeat: clamp(Math.round(item.repeat * riskFactor * trendAdjust), 1, 18),
      };
    });
  }, [startIndex, riskFactor]);

  const timeToCloseSeries = useMemo(() => {
    return timeToCloseBase.map((bucket) => {
      return {
        bucket: bucket.bucket,
        before: clamp(Math.round(bucket.before * efficiencyFactor), 10, 120),
        after: clamp(Math.round(bucket.after * efficiencyFactor), 5, 80),
      };
    });
  }, [efficiencyFactor]);

  const baselineCostK = clamp(Math.round(625 * efficiencyFactor), 420, 890);
  const reductionScale = clamp(1.14 - (efficiencyFactor - 1) * 0.7, 0.72, 1.28);
  const waterfallPoints = useMemo(
    () => buildWaterfallPoints(baselineCostK, reductionScale),
    [baselineCostK, reductionScale]
  );

  const burnDownLast = burnDownSeries[burnDownSeries.length - 1] ?? 0;
  const evidenceLast = evidenceSeries[evidenceSeries.length - 1] ?? 0;
  const incidentLast = incidentsSeries[incidentsSeries.length - 1] ?? { low: 0, medium: 0, high: 0, repeat: 0 };
  const high30d = incidentsSeries.slice(-2).reduce((sum, item) => sum + item.high, 0);
  const postMedian = timeToCloseSeries.find((item) => item.bucket === "Median")?.after ?? 0;
  const backlog = burnDownLast + incidentLast.high + incidentLast.medium + incidentLast.low;
  const savedHours = clamp(Math.round(462 - (efficiencyFactor - 1) * 260), 180, 560);
  const currentCost = waterfallPoints[waterfallPoints.length - 1]?.to ?? baselineCostK;

  const riskKpis = [
    {
      label: "Open high-risk findings",
      value: `${Math.max(6, Math.round(burnDownLast * 0.42))}`,
      subtext: "Priority controls needing immediate remediation",
    },
    {
      label: "% controls current",
      value: `${evidenceLast}%`,
      subtext: "Required controls with current evidence",
    },
    {
      label: "High-sev incidents (30d)",
      value: `${high30d}`,
      subtext: "Critical incidents in the most recent rolling month",
    },
  ];

  const efficiencyKpis = [
    {
      label: "Median days-to-close",
      value: `${postMedian} days`,
      subtext: "Median remediation cycle after rollout",
    },
    {
      label: "Backlog",
      value: `${backlog}`,
      subtext: "Open findings and incident queue combined",
    },
    {
      label: "Estimated hours saved / month",
      value: `${savedHours}h`,
      subtext: "Labor reclaimed from automation and faster closure",
    },
  ];

  const setRiskView = () => {
    setActiveView("risk");
    setInsight(defaultInsight("risk"));
  };

  const setEfficiencyView = () => {
    setActiveView("efficiency");
    setInsight(defaultInsight("efficiency"));
  };

  const openInsight = (next: Omit<Insight, "view">) => {
    setInsight({ ...next, view: activeView });
  };

  const activeInsight = insight.view === activeView ? insight : defaultInsight(activeView);

  const menuItems: Array<{
    id: ActiveView;
    label: string;
    Icon: typeof ShieldAlert;
    onSelect: () => void;
  }> = [
    { id: "risk", label: "Risk Posture", Icon: ShieldAlert, onSelect: setRiskView },
    { id: "efficiency", label: "Operational Efficiency", Icon: Activity, onSelect: setEfficiencyView },
  ];

  const lineChartWidth = 620;
  const lineChartHeight = 280;
  const linePadding = { top: 22, right: 18, bottom: 42, left: 44 };
  const linePlotWidth = lineChartWidth - linePadding.left - linePadding.right;
  const linePlotHeight = lineChartHeight - linePadding.top - linePadding.bottom;
  const lineMax = Math.max(...burnDownSeries, ...evidenceSeries, 100);
  const lineMin = 0;

  const burnDownPoints = burnDownSeries.map((value, index) => {
    const x = linePadding.left + (index / Math.max(burnDownSeries.length - 1, 1)) * linePlotWidth;
    const y = linePadding.top + ((lineMax - value) / (lineMax - lineMin)) * linePlotHeight;
    return { label: months[index], x, y, value };
  });

  const evidencePoints = evidenceSeries.map((value, index) => {
    const x = linePadding.left + (index / Math.max(evidenceSeries.length - 1, 1)) * linePlotWidth;
    const y = linePadding.top + ((lineMax - value) / (lineMax - lineMin)) * linePlotHeight;
    return { label: months[index], x, y, value };
  });

  const burnDownPath = burnDownPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const evidencePath = evidencePoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const auditAnnotationIndex = Math.min(2, burnDownPoints.length - 1);
  const auditAnnotationPoint = burnDownPoints[auditAnnotationIndex];

  const incidentWidth = 620;
  const incidentHeight = 300;
  const incidentPadding = { top: 20, right: 20, bottom: 46, left: 44 };
  const incidentPlotWidth = incidentWidth - incidentPadding.left - incidentPadding.right;
  const incidentPlotHeight = incidentHeight - incidentPadding.top - incidentPadding.bottom;
  const incidentMax = Math.max(
    ...incidentsSeries.map((item) => item.low + item.medium + item.high),
    26
  );
  const incidentScaleY = (value: number) =>
    incidentPadding.top + ((incidentMax - value) / incidentMax) * incidentPlotHeight;
  const incidentStep = incidentPlotWidth / Math.max(incidentsSeries.length, 1);
  const incidentBarWidth = Math.min(44, incidentStep * 0.58);
  const repeatPath = incidentsSeries
    .map((item, index) => {
      const x = incidentPadding.left + index * incidentStep + incidentStep / 2;
      const y = incidentScaleY(item.repeat);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const incidentAnnotationIndex = Math.min(3, incidentsSeries.length - 1);
  const incidentAnnotationX =
    incidentPadding.left + incidentAnnotationIndex * incidentStep + incidentStep / 2;

  const distributionWidth = 620;
  const distributionHeight = 280;
  const distributionPadding = { top: 20, right: 18, bottom: 46, left: 44 };
  const distributionPlotWidth = distributionWidth - distributionPadding.left - distributionPadding.right;
  const distributionPlotHeight = distributionHeight - distributionPadding.top - distributionPadding.bottom;
  const distributionMax = Math.max(...timeToCloseSeries.map((item) => item.before), 90);
  const distributionScaleY = (value: number) =>
    distributionPadding.top + ((distributionMax - value) / distributionMax) * distributionPlotHeight;
  const distributionStep = distributionPlotWidth / Math.max(timeToCloseSeries.length, 1);
  const distributionAnnotationX = distributionPadding.left + distributionStep * 1.15;

  const waterfallWidth = 620;
  const waterfallHeight = 300;
  const waterfallPadding = { top: 20, right: 20, bottom: 78, left: 44 };
  const waterfallMax = Math.max(baselineCostK + 40, 620);
  const waterfallPlotWidth = waterfallWidth - waterfallPadding.left - waterfallPadding.right;
  const waterfallStep = waterfallPlotWidth / Math.max(waterfallPoints.length, 1);
  const waterfallBarWidth = Math.min(54, waterfallStep * 0.62);
  const waterfallScaleY = (value: number) =>
    waterfallPadding.top +
    ((waterfallMax - value) / waterfallMax) * (waterfallHeight - waterfallPadding.top - waterfallPadding.bottom);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_8%_10%,rgba(214,255,10,0.2)_0%,transparent_44%),radial-gradient(circle_at_88%_82%,rgba(0,211,127,0.16)_0%,transparent_42%),linear-gradient(180deg,#0F1112_0%,#161A1C_56%,#101315_100%)] py-24 md:py-28">
      <div className="pointer-events-none absolute -top-16 left-8 h-56 w-56 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-6 h-72 w-72 rounded-full bg-[var(--color-accent-2)]/15 blur-3xl" />

      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-[60] max-w-[260px] rounded-xl border border-white/20 bg-black/85 px-3 py-2 text-xs font-semibold text-white"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="mx-auto max-w-screen-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[2rem] border border-white/20 bg-white/8 p-8 backdrop-blur-2xl md:p-12"
        >
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-5 py-2 font-display text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-accent)] md:text-base">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
              Compliance Signal Center
            </p>
            <h3 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              Exposure and improvement in one executive view.
            </h3>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-white/85 md:text-2xl">
              Switch between risk and efficiency stories without losing filter context.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-white/20 bg-black/35 p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-full rounded-full border border-white/20 bg-white/5 p-1 lg:w-auto">
                {menuItems.map((item) => {
                  const isActive = item.id === activeView;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onSelect}
                      className={`relative inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors md:px-6 ${
                        isActive ? "text-[#1A1A1A]" : "text-white/82 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-menu-pill"
                          className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
                          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        />
                      )}
                      <item.Icon className="relative z-10 h-4 w-4" />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/85">
                <Filter className="h-4 w-4" />
                {drillFilter && (
                  <span className="rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/15 px-3 py-1 text-[var(--color-accent)]">
                    Drill-down: {drillFilter}
                  </span>
                )}
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-white hover:bg-white/15"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[auto,1fr,1fr]">
              <div className="flex gap-2">
                {(["30d", "90d", "365d"] as DateRange[]).map((range) => {
                  const isSelected = range === dateRange;
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setDateRange(range)}
                      className={`rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
                        isSelected
                          ? "bg-[var(--color-accent)] text-[#1A1A1A]"
                          : "bg-white/10 text-white/85 hover:bg-white/15"
                      }`}
                    >
                      {range === "30d" ? "30d" : range === "90d" ? "90d" : "365d"}
                    </button>
                  );
                })}
              </div>

              <label className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
                <span className="text-sm font-bold text-white/70">Org</span>
                <select
                  value={orgUnit}
                  onChange={(event) => setOrgUnit(event.target.value as OrgUnit)}
                  className="w-full bg-transparent py-2.5 text-sm font-semibold text-white outline-none"
                >
                  {Object.entries(orgLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#171A1D]">
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
                <span className="text-sm font-bold text-white/70">Framework</span>
                <select
                  value={framework}
                  onChange={(event) => setFramework(event.target.value as Framework)}
                  className="w-full bg-transparent py-2.5 text-sm font-semibold text-white outline-none"
                >
                  {Object.entries(frameworkLabels).map(([value, label]) => (
                    <option key={value} value={value} className="bg-[#171A1D]">
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeView === "risk" ? (
              <motion.div
                key="risk-view"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {riskKpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-white/20 bg-black/30 p-5"
                    >
                      <p className="text-sm font-bold uppercase tracking-wide text-white/65">{kpi.label}</p>
                      <p className="mt-2 font-display text-4xl font-black text-[var(--color-accent)]">{kpi.value}</p>
                      <p className="mt-2 text-sm font-semibold text-white/72">{kpi.subtext}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                    <h4 className="font-display text-2xl font-black text-white md:text-[2rem]">
                      Open audit gaps are dropping and evidence is staying current.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/75 md:text-base">
                      Why it matters: This is the cleanest signal that audit exposure is being reduced before the next cycle.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/15 bg-[#121518]/85 p-4">
                      <svg
                        viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
                        className="h-[250px] w-full"
                        role="img"
                        aria-label="Line chart of open audit gaps and controls with current evidence over time."
                      >
                        <defs>
                          <linearGradient id="auditLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D6FF0A" />
                            <stop offset="100%" stopColor="#00D37F" />
                          </linearGradient>
                        </defs>

                        {[0, 20, 40, 60, 80, 100].map((tick) => {
                          const y =
                            linePadding.top +
                            ((lineMax - tick) / (lineMax - lineMin)) * linePlotHeight;
                          return (
                            <g key={tick}>
                              <line
                                x1={linePadding.left}
                                y1={y}
                                x2={lineChartWidth - linePadding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.15)"
                                strokeDasharray="4 6"
                              />
                              <text
                                x={linePadding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="rgba(255,255,255,0.7)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        <motion.path
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.95, ease: "easeOut" }}
                          d={burnDownPath}
                          fill="none"
                          stroke="url(#auditLineGradient)"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 1.0, delay: 0.12, ease: "easeOut" }}
                          d={evidencePath}
                          fill="none"
                          stroke="rgba(255,255,255,0.72)"
                          strokeWidth="3"
                          strokeDasharray="8 7"
                          strokeLinecap="round"
                        />

                        {auditAnnotationPoint && (
                          <>
                            <line
                              x1={auditAnnotationPoint.x}
                              y1={linePadding.top}
                              x2={auditAnnotationPoint.x}
                              y2={lineChartHeight - linePadding.bottom}
                              stroke="rgba(214,255,10,0.88)"
                              strokeDasharray="3 6"
                            />
                            <text
                              x={auditAnnotationPoint.x + 10}
                              y={linePadding.top + 14}
                              fill="#D6FF0A"
                              fontSize="12"
                              fontWeight="800"
                            >
                              New evidence automation turned on
                            </text>
                          </>
                        )}

                        {burnDownPoints.map((point, index) => (
                          <g key={`audit-${point.label}`}>
                            <motion.circle
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true, amount: 0.3 }}
                              transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
                              cx={point.x}
                              cy={point.y}
                              r={6}
                              fill="#D6FF0A"
                              stroke="#101315"
                              strokeWidth={2}
                              className="cursor-pointer"
                              onMouseMove={(event) =>
                                showTooltip(
                                  event,
                                  `${point.label}: ${point.value} open gaps. Click to inspect the control mix.`
                                )
                              }
                              onMouseLeave={hideTooltip}
                              onClick={() => {
                                setDrillFilter(`Audit month: ${point.label}`);
                                openInsight({
                                  title: `${point.label} was an inflection point for audit readiness.`,
                                  detail:
                                    "Automation tightened evidence freshness and reduced open findings across critical controls.",
                                  drivers: [
                                    "Control ownership response times improved by 29%.",
                                    "Expired evidence queue dropped sharply after auto-capture was enabled.",
                                    "High-severity findings are now concentrated in fewer control families.",
                                  ],
                                  actions: [
                                    "Expand auto-capture to remaining high-impact controls.",
                                    "Run weekly owner checkpoints for controls with aging evidence.",
                                    "Escalate unresolved high-risk findings within 72 hours.",
                                  ],
                                });
                              }}
                            />
                            <text
                              x={point.x}
                              y={lineChartHeight - 12}
                              textAnchor="middle"
                              fill="rgba(255,255,255,0.82)"
                              fontSize="12"
                              fontWeight="700"
                            >
                              {point.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                    <h4 className="font-display text-2xl font-black text-white md:text-[2rem]">
                      Severe incidents and repeats are decreasing, and recurrence is being contained.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/75 md:text-base">
                      Why it matters: Fewer severe repeats indicates control fixes are sticking, not just being logged.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/15 bg-[#121518]/85 p-4">
                      <svg
                        viewBox={`0 0 ${incidentWidth} ${incidentHeight}`}
                        className="h-[260px] w-full"
                        role="img"
                        aria-label="Stacked incident severity bars with repeat incident trend line."
                      >
                        {[0, 10, 20, 30, 40, 50].map((tick) => {
                          const y = incidentScaleY(tick);
                          return (
                            <g key={tick}>
                              <line
                                x1={incidentPadding.left}
                                y1={y}
                                x2={incidentWidth - incidentPadding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.14)"
                                strokeDasharray="4 6"
                              />
                              <text
                                x={incidentPadding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="rgba(255,255,255,0.68)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        <motion.path
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                          d={repeatPath}
                          fill="none"
                          stroke="#FF8A65"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <line
                          x1={incidentAnnotationX}
                          y1={incidentPadding.top}
                          x2={incidentAnnotationX}
                          y2={incidentHeight - incidentPadding.bottom}
                          stroke="rgba(214,255,10,0.85)"
                          strokeDasharray="3 6"
                        />
                        <text
                          x={incidentAnnotationX + 8}
                          y={incidentPadding.top + 14}
                          fill="#D6FF0A"
                          fontSize="12"
                          fontWeight="800"
                        >
                          New policy training pushed
                        </text>

                        {incidentsSeries.map((item, index) => {
                          const xCenter =
                            incidentPadding.left + index * incidentStep + incidentStep / 2;
                          const lowY = incidentScaleY(item.low);
                          const mediumY = incidentScaleY(item.low + item.medium);
                          const highY = incidentScaleY(item.low + item.medium + item.high);
                          const baseY = incidentScaleY(0);
                          const isHighFocused = drillFilter === null || drillFilter.includes("High");
                          const isMediumFocused = drillFilter === null || drillFilter.includes("Medium");
                          const isLowFocused = drillFilter === null || drillFilter.includes("Low");

                          return (
                            <g key={`incidents-${months[index]}`}>
                              <motion.rect
                                initial={{ height: 0, y: baseY }}
                                whileInView={{ height: baseY - lowY, y: lowY }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.45, delay: index * 0.04 }}
                                x={xCenter - incidentBarWidth / 2}
                                width={incidentBarWidth}
                                rx={4}
                                fill="rgba(0,211,127,0.72)"
                                opacity={isLowFocused ? 1 : 0.32}
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${months[index]} low-severity incidents: ${item.low}. Click to filter low severity drivers.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter("Severity: Low");
                                  openInsight({
                                    title: "Low-severity volume is declining and remains manageable.",
                                    detail:
                                      "Low-severity incidents still account for most volume, but trend direction is improving steadily.",
                                    drivers: [
                                      "Policy reminders are reducing repeat low-impact process misses.",
                                      "Evidence recency checks are catching issues earlier.",
                                      "Owner follow-up compliance improved after automated nudges.",
                                    ],
                                    actions: [
                                      "Keep low-severity triage in weekly cadence.",
                                      "Promote recurring low-severity patterns into preventive training.",
                                      "Track controls that generate repeated low-severity alerts.",
                                    ],
                                  });
                                }}
                              />
                              <motion.rect
                                initial={{ height: 0, y: baseY }}
                                whileInView={{ height: lowY - mediumY, y: mediumY }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.45, delay: 0.08 + index * 0.04 }}
                                x={xCenter - incidentBarWidth / 2}
                                width={incidentBarWidth}
                                fill="rgba(214,255,10,0.88)"
                                opacity={isMediumFocused ? 1 : 0.32}
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${months[index]} medium-severity incidents: ${item.medium}. Click to filter medium severity drivers.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter("Severity: Medium");
                                  openInsight({
                                    title: "Medium-severity incidents are dropping with stronger policy reinforcement.",
                                    detail:
                                      "Most medium-severity events tie to delayed remediation and can be reduced with tighter owner accountability.",
                                    drivers: [
                                      "SLA adherence improved after weekly remediation scorecards.",
                                      "Repeat policy misconceptions declined post-training refresh.",
                                      "Vendor remediation response times are stabilizing.",
                                    ],
                                    actions: [
                                      "Automate follow-up reminders at day 7 and day 14.",
                                      "Require remediation plans for unresolved medium-severity issues.",
                                      "Add manager-level visibility for aging medium-severity incidents.",
                                    ],
                                  });
                                }}
                              />
                              <motion.rect
                                initial={{ height: 0, y: baseY }}
                                whileInView={{ height: mediumY - highY, y: highY }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.45, delay: 0.15 + index * 0.04 }}
                                x={xCenter - incidentBarWidth / 2}
                                width={incidentBarWidth}
                                fill="rgba(255,122,122,0.92)"
                                opacity={isHighFocused ? 1 : 0.32}
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${months[index]} high-severity incidents: ${item.high}. Click for high-risk driver analysis.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter("Severity: High");
                                  openInsight({
                                    title: "High-severity incident recurrence is narrowing to a few control gaps.",
                                    detail:
                                      "The remaining high-severity repeats are concentrated, making targeted control hardening the fastest lever.",
                                    drivers: [
                                      "Two access-control families account for most remaining high severity events.",
                                      "Third-party evidence lag is correlated with high-severity repeats.",
                                      "Escalation delays still appear in one enterprise workflow.",
                                    ],
                                    actions: [
                                      "Run focused access-control remediation sprint this month.",
                                      "Require critical vendors to meet monthly evidence cadence.",
                                      "Route unresolved high severity incidents to executive review in 48 hours.",
                                    ],
                                  });
                                }}
                              />

                              <motion.circle
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.3, delay: 0.16 + index * 0.04 }}
                                cx={xCenter}
                                cy={incidentScaleY(item.repeat)}
                                r={4.5}
                                fill="#FF8A65"
                                stroke="#101315"
                                strokeWidth={2}
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${months[index]} repeat incidents: ${item.repeat}. Click to open recurrence actions.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter(`Repeat incidents: ${months[index]}`);
                                  openInsight({
                                    title: "Repeat incident trend confirms control reinforcement is working.",
                                    detail:
                                      "Repeat patterns are falling, but recurrence remains elevated in a small subset of controls.",
                                    drivers: [
                                      "Training refresh reduced repeat policy errors.",
                                      "Exception approvals are now tracked with tighter thresholds.",
                                      "Evidence freshness checks prevent stale controls from drifting.",
                                    ],
                                    actions: [
                                      "Trigger targeted coaching for repeat-heavy teams.",
                                      "Set stricter alert thresholds for recurrence-prone controls.",
                                      "Review exception approvals every two weeks with control owners.",
                                    ],
                                  });
                                }}
                              />

                              <text
                                x={xCenter}
                                y={incidentHeight - 12}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.82)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {months[index]}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </article>
                </div>

                <div className="mt-7 rounded-2xl border border-white/20 bg-black/30 p-5 md:flex md:items-center md:justify-between">
                  <p className="text-base font-semibold text-white/85">
                    Want to see what&apos;s driving this change?
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#1A1A1A] transition-colors hover:bg-[#e4ff43] md:mt-0"
                  >
                    Show recommended next actions
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="efficiency-view"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="mt-8"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {efficiencyKpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-white/20 bg-black/30 p-5"
                    >
                      <p className="text-sm font-bold uppercase tracking-wide text-white/65">{kpi.label}</p>
                      <p className="mt-2 font-display text-4xl font-black text-[var(--color-accent-2)]">{kpi.value}</p>
                      <p className="mt-2 text-sm font-semibold text-white/72">{kpi.subtext}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                    <h4 className="font-display text-2xl font-black text-white md:text-[2rem]">
                      Time-to-close is shrinking, including the long tail.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/75 md:text-base">
                      Why it matters: Faster closure with a tighter tail means less operational drag and fewer stuck findings.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/15 bg-[#121518]/85 p-4">
                      <svg
                        viewBox={`0 0 ${distributionWidth} ${distributionHeight}`}
                        className="h-[250px] w-full"
                        role="img"
                        aria-label="Before and after distribution for time-to-close findings."
                      >
                        {[0, 20, 40, 60, 80, 100].map((tick) => {
                          const y = distributionScaleY(tick);
                          return (
                            <g key={tick}>
                              <line
                                x1={distributionPadding.left}
                                y1={y}
                                x2={distributionWidth - distributionPadding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.14)"
                                strokeDasharray="4 6"
                              />
                              <text
                                x={distributionPadding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="rgba(255,255,255,0.68)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        <line
                          x1={distributionAnnotationX}
                          y1={distributionPadding.top}
                          x2={distributionAnnotationX}
                          y2={distributionHeight - distributionPadding.bottom}
                          stroke="rgba(214,255,10,0.86)"
                          strokeDasharray="3 6"
                        />
                        <text
                          x={distributionAnnotationX + 8}
                          y={distributionPadding.top + 14}
                          fill="#D6FF0A"
                          fontSize="12"
                          fontWeight="800"
                        >
                          SLA + owner escalation launched
                        </text>

                        {timeToCloseSeries.map((bucket, index) => {
                          const centerX =
                            distributionPadding.left + index * distributionStep + distributionStep / 2;
                          const beforeHeight = distributionScaleY(0) - distributionScaleY(bucket.before);
                          const afterHeight = distributionScaleY(0) - distributionScaleY(bucket.after);
                          const leftBarX = centerX - 34;
                          const rightBarX = centerX + 8;

                          return (
                            <g key={bucket.bucket}>
                              <motion.rect
                                initial={{ height: 0, y: distributionScaleY(0) }}
                                whileInView={{ height: beforeHeight, y: distributionScaleY(bucket.before) }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                x={leftBarX}
                                width={24}
                                rx={6}
                                fill="rgba(255,255,255,0.44)"
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${bucket.bucket} before rollout: ${bucket.before} days. Click to inspect pre-rollout friction.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter(`Pre-rollout ${bucket.bucket}`);
                                  openInsight({
                                    title: `Pre-rollout ${bucket.bucket} time highlights legacy process drag.`,
                                    detail:
                                      "Legacy closure cadence relied on manual coordination and delayed owner handoffs.",
                                    drivers: [
                                      "Manual evidence requests created scheduling bottlenecks.",
                                      "Remediation ownership was not consistently visible.",
                                      "Escalation criteria were uneven across teams.",
                                    ],
                                    actions: [
                                      "Standardize owner assignment and escalation windows.",
                                      "Automate reminders for open findings after day 7.",
                                      "Set monthly review cadence for the slowest closure cohorts.",
                                    ],
                                  });
                                }}
                              />

                              <motion.rect
                                initial={{ height: 0, y: distributionScaleY(0) }}
                                whileInView={{ height: afterHeight, y: distributionScaleY(bucket.after) }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.5, delay: 0.06 + index * 0.08 }}
                                x={rightBarX}
                                width={24}
                                rx={6}
                                fill="rgba(0,211,127,0.92)"
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${bucket.bucket} after rollout: ${bucket.after} days. Click to inspect the gains.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter(`Post-rollout ${bucket.bucket}`);
                                  openInsight({
                                    title: `Post-rollout ${bucket.bucket} shows sustained remediation acceleration.`,
                                    detail:
                                      "Automation and clearer ownership have materially reduced closure times across the distribution.",
                                    drivers: [
                                      "Evidence handoff is now automated for critical controls.",
                                      "Owner response SLAs are measured and enforced.",
                                      "Recurrence prevention has reduced re-opened findings.",
                                    ],
                                    actions: [
                                      "Expand SLA reporting to every control owner.",
                                      "Keep weekly remediation standups for aging findings.",
                                      "Tie closure metrics to quarterly operational targets.",
                                    ],
                                  });
                                }}
                              />

                              <text
                                x={centerX}
                                y={distributionHeight - 12}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.82)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {bucket.bucket}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </article>

                  <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                    <h4 className="font-display text-2xl font-black text-white md:text-[2rem]">
                      Estimated compliance costs are dropping through targeted improvements.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/75 md:text-base">
                      Why it matters: This turns compliance gains into conservative financial impact leadership can track.
                    </p>

                    <div className="mt-4 rounded-2xl border border-white/15 bg-[#121518]/85 p-4">
                      <svg
                        viewBox={`0 0 ${waterfallWidth} ${waterfallHeight}`}
                        className="h-[270px] w-full"
                        role="img"
                        aria-label="Waterfall chart for estimated compliance and incident cost avoidance."
                      >
                        {[0, 100, 200, 300, 400, 500, 600, 700].map((tick) => {
                          const y = waterfallScaleY(tick);
                          return (
                            <g key={tick}>
                              <line
                                x1={waterfallPadding.left}
                                y1={y}
                                x2={waterfallWidth - waterfallPadding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.14)"
                                strokeDasharray="4 6"
                              />
                              <text
                                x={waterfallPadding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fill="rgba(255,255,255,0.68)"
                                fontSize="12"
                                fontWeight="700"
                              >
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        {waterfallPoints.map((point, index) => {
                          const xCenter =
                            waterfallPadding.left + index * waterfallStep + waterfallStep / 2;
                          const lower = Math.min(point.from, point.to);
                          const upper = Math.max(point.from, point.to);
                          const y = waterfallScaleY(upper);
                          const h = Math.max(waterfallScaleY(lower) - y, 8);
                          const fill =
                            point.kind === "start"
                              ? "rgba(255,138,101,0.9)"
                              : point.kind === "current"
                              ? "rgba(0,211,127,0.9)"
                              : "rgba(214,255,10,0.92)";

                          return (
                            <g key={point.id}>
                              {index < waterfallPoints.length - 1 && (
                                <line
                                  x1={xCenter + waterfallBarWidth / 2}
                                  y1={waterfallScaleY(point.cumulativeAfter)}
                                  x2={xCenter + waterfallStep - waterfallBarWidth / 2}
                                  y2={waterfallScaleY(point.cumulativeAfter)}
                                  stroke="rgba(255,255,255,0.5)"
                                  strokeWidth="1.5"
                                />
                              )}

                              <motion.rect
                                initial={{ height: 0, y: waterfallScaleY(0) }}
                                whileInView={{ height: h, y }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: 0.08 + index * 0.08 }}
                                x={xCenter - waterfallBarWidth / 2}
                                width={waterfallBarWidth}
                                rx={9}
                                fill={fill}
                                className="cursor-pointer"
                                onMouseMove={(event) =>
                                  showTooltip(
                                    event,
                                    `${point.label}: ${point.valueLabel}. Click for cost driver detail and action plan.`
                                  )
                                }
                                onMouseLeave={hideTooltip}
                                onClick={() => {
                                  setDrillFilter(`Cost driver: ${point.label}`);
                                  openInsight({
                                    title: `${point.label} is materially contributing to cost avoidance.`,
                                    detail:
                                      "Estimated savings are conservative and based on user-provided labor and incident cost assumptions.",
                                    drivers: [
                                      "Audit preparation hours continue to decline with automation coverage.",
                                      "External advisory and evidence packaging effort is reduced.",
                                      "Repeat incident effort drops as recurrence trends down.",
                                    ],
                                    actions: [
                                      "Validate hourly rate assumptions each quarter.",
                                      "Publish cost-avoidance trend by control family.",
                                      "Expand automation to high-effort evidence workflows.",
                                    ],
                                  });
                                }}
                              />

                              <text
                                x={xCenter}
                                y={y - 8}
                                textAnchor="middle"
                                fill={point.kind === "delta" ? "#D6FF0A" : "#FFFFFF"}
                                fontSize="12"
                                fontWeight="800"
                              >
                                {point.valueLabel}
                              </text>

                              <text
                                x={xCenter}
                                y={waterfallHeight - 24}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.82)"
                                fontSize="11"
                                fontWeight="700"
                              >
                                {point.label}
                              </text>
                            </g>
                          );
                        })}

                        <text
                          x={waterfallPadding.left + 8}
                          y={waterfallPadding.top + 14}
                          fill="#D6FF0A"
                          fontSize="12"
                          fontWeight="800"
                        >
                          Vendor review cadence tightened
                        </text>
                      </svg>
                    </div>

                    <p className="mt-3 text-xs font-semibold text-white/65">
                      Estimates based on user-provided hourly rates and incident cost assumptions.
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/80">
                      Current estimated cost footprint: <span className="text-[var(--color-accent-2)]">${currentCost}k</span>.
                    </p>
                  </article>
                </div>

                <div className="mt-7 rounded-2xl border border-white/20 bg-black/30 p-5 md:flex md:items-center md:justify-between">
                  <p className="text-base font-semibold text-white/85">
                    Want to see what&apos;s driving this change?
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-2)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#0E1113] transition-colors hover:bg-[#31e39a] md:mt-0"
                  >
                    Generate an executive summary
                    <DollarSign className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-8 rounded-3xl border border-white/20 bg-black/35 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h5 className="font-display text-2xl font-black text-white">
                Top drivers and recommended next actions
              </h5>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80">
                {activeView === "risk" ? "Risk Posture" : "Operational Efficiency"}
              </span>
            </div>
            <p className="mt-3 text-lg font-bold text-[var(--color-accent)]">{activeInsight.title}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-white/80">{activeInsight.detail}</p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Top Drivers</p>
                <ul className="mt-2 space-y-2">
                  {activeInsight.drivers.map((driver) => (
                    <li key={driver} className="text-sm font-semibold text-white/85">
                      - {driver}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                  Recommended Next Actions
                </p>
                <ul className="mt-2 space-y-2">
                  {activeInsight.actions.map((action) => (
                    <li key={action} className="text-sm font-semibold text-white/85">
                      - {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/15 px-3 py-1 text-xs font-bold text-[var(--color-accent)]">
                {dateRangeLabels[dateRange]}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white/85">
                {orgLabels[orgUnit]}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white/85">
                {frameworkLabels[framework]}
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white/85 hover:bg-white/15"
              >
                <Clock3 className="h-3.5 w-3.5" />
                Share insight summary
              </button>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
