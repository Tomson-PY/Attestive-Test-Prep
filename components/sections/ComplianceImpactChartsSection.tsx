"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Activity, CalendarDays, ChevronDown, ShieldAlert, Sparkles, X } from "lucide-react";
import { AccentHighlight } from "@/components/AccentHighlight";

type ActiveView = "risk" | "efficiency";
type DateRange = "30d" | "90d" | "365d" | "custom";
type Facility = "all" | "north-campus" | "west-hub" | "enterprise";
type AuditMetricView = "gaps" | "readiness";
type DrawerTheme = "audit" | "incident" | "efficiency";
type ExpandedChart = "audit" | "incident";

type DrawerState = {
  context: string;
  drivers: string[];
};

type AuditPoint = {
  month: string;
  openGaps: number;
  controlsCurrent: number;
  overdueAttestations: number;
  verifiedUnderstanding: number;
  readinessIndex: number;
};

type IncidentPoint = {
  month: string;
  nearMissRate: number;
  lowRate: number;
  mediumRate: number;
  severeRate: number;
  repeatRate: number;
  daysBetweenRepeats: number;
};

type TimeToClosePoint = {
  bucket: string;
  before: number;
  after: number;
};

type CostPoint = {
  label: string;
  value: number;
  kind: "base" | "delta" | "result";
};

const auditData: AuditPoint[] = [
  {
    month: "Jul",
    openGaps: 72,
    controlsCurrent: 54,
    overdueAttestations: 41,
    verifiedUnderstanding: 61,
    readinessIndex: 58,
  },
  {
    month: "Aug",
    openGaps: 75,
    controlsCurrent: 56,
    overdueAttestations: 40,
    verifiedUnderstanding: 62,
    readinessIndex: 59,
  },
  {
    month: "Sep",
    openGaps: 80,
    controlsCurrent: 55,
    overdueAttestations: 43,
    verifiedUnderstanding: 60,
    readinessIndex: 57,
  },
  {
    month: "Oct",
    openGaps: 42,
    controlsCurrent: 74,
    overdueAttestations: 22,
    verifiedUnderstanding: 78,
    readinessIndex: 74,
  },
  {
    month: "Nov",
    openGaps: 26,
    controlsCurrent: 86,
    overdueAttestations: 10,
    verifiedUnderstanding: 85,
    readinessIndex: 84,
  },
  {
    month: "Dec",
    openGaps: 18,
    controlsCurrent: 92,
    overdueAttestations: 6,
    verifiedUnderstanding: 89,
    readinessIndex: 90,
  },
];

const incidentsData: IncidentPoint[] = [
  {
    month: "Jul",
    nearMissRate: 12,
    lowRate: 9,
    mediumRate: 6,
    severeRate: 4,
    repeatRate: 22,
    daysBetweenRepeats: 11,
  },
  {
    month: "Aug",
    nearMissRate: 11,
    lowRate: 10,
    mediumRate: 5,
    severeRate: 4,
    repeatRate: 20,
    daysBetweenRepeats: 12,
  },
  {
    month: "Sep",
    nearMissRate: 10,
    lowRate: 9,
    mediumRate: 6,
    severeRate: 5,
    repeatRate: 23,
    daysBetweenRepeats: 10,
  },
  {
    month: "Oct",
    nearMissRate: 13,
    lowRate: 8,
    mediumRate: 4,
    severeRate: 3,
    repeatRate: 14,
    daysBetweenRepeats: 18,
  },
  {
    month: "Nov",
    nearMissRate: 12,
    lowRate: 7,
    mediumRate: 3,
    severeRate: 3,
    repeatRate: 11,
    daysBetweenRepeats: 24,
  },
  {
    month: "Dec",
    nearMissRate: 11,
    lowRate: 6,
    mediumRate: 3,
    severeRate: 2,
    repeatRate: 9,
    daysBetweenRepeats: 28,
  },
];

const timeToCloseData: TimeToClosePoint[] = [
  { bucket: "Median", before: 33, after: 16 },
  { bucket: "75th %ile", before: 49, after: 24 },
  { bucket: "90th %ile", before: 72, after: 36 },
];

const costData: CostPoint[] = [
  { label: "Baseline", value: 625, kind: "base" },
  { label: "Audit Hours", value: -122, kind: "delta" },
  { label: "External", value: -86, kind: "delta" },
  { label: "Downtime", value: -78, kind: "delta" },
  { label: "Repeats", value: -56, kind: "delta" },
  { label: "Current", value: 283, kind: "result" },
];

const facilityLabels: Record<Facility, string> = {
  all: "All orgs / facilities",
  "north-campus": "North Campus",
  "west-hub": "West Hub",
  enterprise: "Enterprise",
};

const rangeWindow: Record<DateRange, number> = {
  "30d": 4,
  "90d": 5,
  "365d": 6,
  custom: 6,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    const controlY = (current.y + next.y) / 2;
    path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
  }

  const finalPoint = points[points.length - 1];
  path += ` T ${finalPoint.x} ${finalPoint.y}`;
  return path;
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function getRolloutRange(points: Array<{ label: string; x: number }>, fallbackStep: number) {
  const sepIndex = points.findIndex((point) => point.label === "Sep");
  const octIndex = points.findIndex((point) => point.label === "Oct");

  if (sepIndex === -1 || octIndex === -1) {
    return {
      start: points[0]?.x ?? 0,
      end: (points[0]?.x ?? 0) + fallbackStep,
    };
  }

  const sepPoint = points[sepIndex];
  const octPoint = points[octIndex];
  const start = sepPoint.x + fallbackStep * 0.12;
  const end = octPoint.x - fallbackStep * 0.18;
  return {
    start,
    end: Math.max(end, start + fallbackStep * 0.5),
  };
}

type KpiChipProps = {
  from: string;
  to: string;
  label: string;
  delta: string;
  tone?: "accent" | "green" | "orange";
};

function KpiChip({ from, to, label, delta, tone = "accent" }: KpiChipProps) {
  const toneClass =
    tone === "green"
      ? "text-[var(--color-accent-2)]"
      : tone === "orange"
      ? "text-[#ffb38d]"
      : "text-[var(--color-accent)]";

  return (
    <div className="min-w-[164px] rounded-2xl border border-white/18 bg-black/35 px-4 py-3">
      <p className={`font-display text-2xl font-black leading-none ${toneClass}`}>
        {from} <span className="text-white/55">→</span> {to}
      </p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">{label}</p>
      <p className="mt-1 text-xs font-semibold text-white/80">{delta}</p>
    </div>
  );
}

type RolloutBandProps = {
  x: number;
  width: number;
  y: number;
  height: number;
  label: string;
};

function RolloutBand({ x, width, y, height, label }: RolloutBandProps) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(214,255,10,0.08)"
        stroke="rgba(214,255,10,0.36)"
        strokeDasharray="5 5"
      />
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fill="rgba(214,255,10,0.95)"
        fontSize="12"
        fontWeight="800"
      >
        {label}
      </text>
    </>
  );
}

type TargetLineLabelProps = {
  x1: number;
  x2: number;
  y: number;
  label: string;
  labelMode?: "line" | "bottom";
  bottomY?: number;
  bottomXRatio?: number;
};

function TargetLineLabel({
  x1,
  x2,
  y,
  label,
  labelMode = "line",
  bottomY,
  bottomXRatio = 0.73,
}: TargetLineLabelProps) {
  const labelWidth = Math.max(120, Math.round(label.length * 6.8) + 16);
  const labelX = x2 - labelWidth - 4;
  const labelY = y - 22;
  const legendY = bottomY ?? y + 20;
  const legendTextX = x1 + (x2 - x1) * bottomXRatio;

  return (
    <>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="rgba(255,255,255,0.62)"
        strokeWidth={1.5}
        strokeDasharray="6 6"
      />
      {labelMode === "line" ? (
        <>
          <rect
            x={labelX}
            y={labelY}
            width={labelWidth}
            height={18}
            rx={8}
            fill="rgba(11,15,18,0.9)"
            stroke="rgba(255,255,255,0.22)"
          />
          <text
            x={x2 - 10}
            y={labelY + 13}
            textAnchor="end"
            fill="rgba(255,255,255,0.9)"
            fontSize="12"
            fontWeight="800"
          >
            {label}
          </text>
        </>
      ) : (
        <g>
          <text
            x={legendTextX}
            y={legendY}
            textAnchor="start"
            fill="rgba(255,255,255,0.9)"
            fontSize="12"
            fontWeight="800"
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
}

type AnnotationCalloutProps = {
  x: number;
  y: number;
  lines: [string, string];
  width?: number;
};

function AnnotationCallout({ x, y, lines, width = 208 }: AnnotationCalloutProps) {
  const bubbleX = x + 18;
  const bubbleY = y - 44;

  return (
    <>
      <circle cx={x} cy={y} r={5} fill="#D6FF0A" stroke="#101315" strokeWidth={2} />
      <line x1={x + 5} y1={y - 5} x2={bubbleX} y2={bubbleY + 16} stroke="rgba(255,255,255,0.8)" strokeWidth={1.2} />
      <rect
        x={bubbleX}
        y={bubbleY}
        rx={10}
        width={width}
        height={38}
        fill="rgba(11,15,18,0.92)"
        stroke="rgba(255,255,255,0.24)"
      />
      <text x={bubbleX + 10} y={bubbleY + 14} fill="rgba(255,255,255,0.94)" fontSize="11" fontWeight="700">
        {lines[0]}
      </text>
      <text x={bubbleX + 10} y={bubbleY + 28} fill="rgba(255,255,255,0.94)" fontSize="11" fontWeight="700">
        {lines[1]}
      </text>
    </>
  );
}

function drawerDrivers(theme: DrawerTheme): string[] {
  if (theme === "audit") {
    return [
      "Comprehension checkpoints now block attestations when understanding fails.",
      "Manager follow-up SLA is enforced for unresolved evidence questions.",
      "Escalation loop routes stalled controls before they age into open gaps.",
    ];
  }

  if (theme === "incident") {
    return [
      "Scenario-based checks reduced repeat misunderstanding in high-risk workflows.",
      "Manager escalation is triggered automatically on repeat pattern detection.",
      "Near-miss reporting improved, allowing severe risks to be corrected earlier.",
    ];
  }

  return [
    "Closure ownership is visible by facility and escalated before SLA breach.",
    "Evidence handoffs are automated, reducing rework during audit preparation.",
    "Repeat investigations are shrinking as root-cause coaching is sustained.",
  ];
}

export function ComplianceImpactChartsSection() {
  const [activeView, setActiveView] = useState<ActiveView>("risk");
  const [dateRange, setDateRange] = useState<DateRange>("365d");
  const [facility, setFacility] = useState<Facility>("all");
  const [auditMetricView, setAuditMetricView] = useState<AuditMetricView>("gaps");
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [expandedChart, setExpandedChart] = useState<ExpandedChart | null>(null);

  const windowSize = rangeWindow[dateRange];
  const auditWindow = useMemo(() => auditData.slice(Math.max(auditData.length - windowSize, 0)), [windowSize]);
  const incidentWindow = useMemo(
    () => incidentsData.slice(Math.max(incidentsData.length - windowSize, 0)),
    [windowSize]
  );

  const openDrawer = (context: string, theme: DrawerTheme) => {
    setDrawer({ context, drivers: drawerDrivers(theme) });
  };

  const closeExpandedChart = () => {
    setExpandedChart(null);
  };

  const openExpandedChart = (chart: ExpandedChart) => {
    setDrawer(null);
    setExpandedChart(chart);
  };

  const maybeOpenExpandedChart =
    (chart: ExpandedChart) => (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as Element | null;
      if (target?.closest('[data-drill="true"]')) return;
      openExpandedChart(chart);
    };

  useEffect(() => {
    if (!expandedChart) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedChart(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [expandedChart]);

  const auditWidth = 640;
  const auditHeight = 306;
  const auditPadding = { top: 26, right: 40, bottom: 50, left: 58 };
  const auditPlotWidth = auditWidth - auditPadding.left - auditPadding.right;
  const auditPlotHeight = auditHeight - auditPadding.top - auditPadding.bottom;

  const auditMetric = auditMetricView === "gaps" ? "openGaps" : "readinessIndex";
  const auditMax = auditMetricView === "gaps" ? 90 : 100;
  const auditTicks = auditMetricView === "gaps" ? [0, 20, 40, 60, 80] : [0, 20, 40, 60, 80, 100];
  const auditYLabel = auditMetricView === "gaps" ? "Open gaps (#)" : "Readiness index (0-100)";
  const auditTargetValue = auditMetricView === "gaps" ? 20 : 85;
  const auditTargetLabel = auditMetricView === "gaps" ? "Target: <20 open gaps" : "Target: >85 readiness";

  const auditPoints = auditWindow.map((row, index) => {
    const step = auditPlotWidth / Math.max(auditWindow.length - 1, 1);
    const x = auditPadding.left + index * step;
    const value = row[auditMetric as keyof AuditPoint] as number;
    const y = auditPadding.top + ((auditMax - value) / auditMax) * auditPlotHeight;
    return { label: row.month, x, y, value };
  });

  const auditStep = auditPlotWidth / Math.max(auditWindow.length - 1, 1);
  const auditPath = buildLinePath(auditPoints);
  const auditAreaPath =
    auditPoints.length > 1
      ? `${auditPath} L ${auditPoints[auditPoints.length - 1].x} ${auditHeight - auditPadding.bottom} L ${auditPoints[0].x} ${auditHeight - auditPadding.bottom} Z`
      : "";

  const verifiedPath = buildLinePath(
    auditWindow.map((row, index) => {
      const x = auditPadding.left + index * auditStep;
      const y = auditPadding.top + ((100 - row.verifiedUnderstanding) / 100) * auditPlotHeight;
      return { x, y };
    })
  );

  const auditRollout = getRolloutRange(
    auditPoints.map((point) => ({ label: point.label, x: point.x })),
    Math.max(auditStep, 36)
  );

  const auditOctPoint = auditPoints.find((point) => point.label === "Oct") ?? auditPoints[Math.min(3, auditPoints.length - 1)];

  const incidentWidth = 640;
  const incidentHeight = 320;
  const incidentPadding = { top: 26, right: 52, bottom: 52, left: 58 };
  const incidentPlotWidth = incidentWidth - incidentPadding.left - incidentPadding.right;
  const incidentPlotHeight = incidentHeight - incidentPadding.top - incidentPadding.bottom;

  const incidentTotals = incidentWindow.map(
    (row) => row.nearMissRate + row.lowRate + row.mediumRate + row.severeRate
  );
  const incidentMax = Math.max(...incidentTotals, 36);
  const incidentScaleY = (value: number) =>
    incidentPadding.top + ((incidentMax - value) / incidentMax) * incidentPlotHeight;

  const repeatMax = 25;
  const repeatScaleY = (value: number) =>
    incidentPadding.top + ((repeatMax - value) / repeatMax) * incidentPlotHeight;

  const incidentStep = incidentPlotWidth / Math.max(incidentWindow.length, 1);
  const incidentBarWidth = Math.min(48, incidentStep * 0.62);

  const repeatPoints = incidentWindow.map((row, index) => {
    const x = incidentPadding.left + index * incidentStep + incidentStep / 2;
    const y = repeatScaleY(row.repeatRate);
    return { label: row.month, x, y, value: row.repeatRate };
  });

  const repeatPath = buildSmoothPath(repeatPoints);
  const incidentRollout = getRolloutRange(
    repeatPoints.map((point) => ({ label: point.label, x: point.x })),
    Math.max(incidentStep, 40)
  );
  const incidentOctPoint = repeatPoints.find((point) => point.label === "Oct") ?? repeatPoints[Math.min(3, repeatPoints.length - 1)];

  const severeThreshold = 3.4;
  const severeThresholdY = incidentScaleY(severeThreshold);

  const riskKpiLeft = [
    {
      from: "72",
      to: "18",
      label: "Open gaps (Jul-Dec)",
      delta: "-75%",
      tone: "accent" as const,
    },
    {
      from: "54%",
      to: "92%",
      label: "Controls current",
      delta: "+38 pts",
      tone: "green" as const,
    },
    {
      from: "61%",
      to: "89%",
      label: "Verified understanding",
      delta: "+28 pts",
      tone: "orange" as const,
    },
  ];

  const riskKpiRight = [
    {
      from: "22%",
      to: "9%",
      label: "Repeat rate",
      delta: "-59%",
      tone: "accent" as const,
    },
    {
      from: "4",
      to: "2",
      label: "Severe rate / 10k hrs",
      delta: "-50%",
      tone: "green" as const,
    },
    {
      from: "11",
      to: "28",
      label: "Days between repeats",
      delta: "+155%",
      tone: "orange" as const,
    },
  ];

  const efficiencyKpisA = [
    { from: "33", to: "16", label: "Median days-to-close", delta: "-52%", tone: "green" as const },
    { from: "72", to: "36", label: "90th percentile", delta: "-50%", tone: "accent" as const },
  ];

  const efficiencyKpisB = [
    { from: "$625k", to: "$283k", label: "Estimated annual cost", delta: "-55%", tone: "green" as const },
    { from: "0", to: "342k", label: "Avoidance captured", delta: "Illustrative", tone: "accent" as const },
  ];

  const closeMax = Math.max(...timeToCloseData.map((row) => row.before), 80);
  const closeWidth = 640;
  const closeHeight = 292;
  const closePadding = { top: 24, right: 20, bottom: 52, left: 58 };
  const closePlotWidth = closeWidth - closePadding.left - closePadding.right;
  const closePlotHeight = closeHeight - closePadding.top - closePadding.bottom;
  const closeScaleY = (value: number) =>
    closePadding.top + ((closeMax - value) / closeMax) * closePlotHeight;
  const closeStep = closePlotWidth / Math.max(timeToCloseData.length, 1);

  const costWidth = 640;
  const costHeight = 320;
  const costPadding = { top: 24, right: 24, bottom: 72, left: 58 };
  const costMax = 700;
  const costScaleY = (value: number) =>
    costPadding.top + ((costMax - value) / costMax) * (costHeight - costPadding.top - costPadding.bottom);
  const costStep = (costWidth - costPadding.left - costPadding.right) / Math.max(costData.length, 1);
  const costBarWidth = Math.min(56, costStep * 0.64);

  const activeTabClass = "text-[#151515]";
  const inactiveTabClass = "text-white/82 hover:text-white";

  const renderAuditChart = (variant: "card" | "expanded") => {
    const expanded = variant === "expanded";
    const lineGradientId = `auditLineGradient-${variant}`;
    const areaFillId = `auditAreaFill-${variant}`;
    const postRolloutMonths = new Set(["Oct", "Nov", "Dec"]);
    const auditTargetY = auditPadding.top + ((auditMax - auditTargetValue) / auditMax) * auditPlotHeight;

    return (
      <svg
        viewBox={`0 0 ${auditWidth} ${auditHeight}`}
        className={expanded ? "h-[62vh] min-h-[380px] w-full" : "h-[270px] w-full"}
        role="img"
        aria-label="Audit risk trend with target and rollout band."
      >
        <defs>
          <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,122,122,0.78)" />
            <stop offset="45%" stopColor="rgba(255,122,122,0.78)" />
            <stop offset="60%" stopColor="rgba(0,211,127,0.92)" />
            <stop offset="100%" stopColor="rgba(0,211,127,0.96)" />
          </linearGradient>
          <linearGradient id={areaFillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,211,127,0.30)" />
            <stop offset="100%" stopColor="rgba(0,211,127,0.02)" />
          </linearGradient>
        </defs>

        {auditTicks.map((tick) => {
          const y = auditPadding.top + ((auditMax - tick) / auditMax) * auditPlotHeight;
          return (
            <g key={`audit-tick-${variant}-${tick}`}>
              <line
                x1={auditPadding.left}
                y1={y}
                x2={auditWidth - auditPadding.right}
                y2={y}
                stroke="rgba(255,255,255,0.14)"
                strokeDasharray="3 6"
              />
              <text
                x={auditPadding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.72)"
                fontSize="12"
                fontWeight="700"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <RolloutBand
          x={auditRollout.start}
          width={auditRollout.end - auditRollout.start}
          y={auditPadding.top}
          height={auditPlotHeight}
          label="Attestiva rollout"
        />

        {auditAreaPath && <path d={auditAreaPath} fill={`url(#${areaFillId})`} />}

        <motion.path
          d={auditPath}
          fill="none"
          stroke={`url(#${lineGradientId})`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        {auditMetricView === "gaps" && (
          <>
            <path
              d={verifiedPath}
              fill="none"
              stroke="rgba(255,179,141,0.88)"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <text
              x={auditWidth - auditPadding.right - 2}
              y={auditPadding.top + 14}
              textAnchor="end"
              fill="rgba(255,179,141,0.9)"
              fontSize="11"
              fontWeight="700"
            >
              Verified understanding (%)
            </text>
          </>
        )}

        <TargetLineLabel
          x1={auditPadding.left}
          x2={auditWidth - auditPadding.right}
          y={auditTargetY}
          label={auditTargetLabel}
          labelMode="bottom"
          bottomY={auditTargetY + 18}
          bottomXRatio={0.07}
        />

        {auditPoints.map((point) => (
          <g key={`audit-point-${variant}-${point.label}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r={5}
              fill={postRolloutMonths.has(point.label) ? "#D6FF0A" : "#ff9d8d"}
              stroke="#0f1418"
              strokeWidth={2}
              className="cursor-pointer"
              data-drill="true"
              onClick={(event) => {
                event.stopPropagation();
                if (variant !== "card") return;
                openDrawer(`Audit risk detail: ${point.label}`, "audit");
              }}
            />
            <text
              x={point.x}
              y={auditHeight - 14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.83)"
              fontSize="12"
              fontWeight="700"
            >
              {point.label}
            </text>
          </g>
        ))}

        {auditOctPoint && (
          <AnnotationCallout
            x={auditOctPoint.x}
            y={auditOctPoint.y}
            lines={["Verified understanding +", "escalation loop"]}
            width={184}
          />
        )}

        <text
          x={16}
          y={auditPadding.top + auditPlotHeight / 2}
          transform={`rotate(-90 16 ${auditPadding.top + auditPlotHeight / 2})`}
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="700"
        >
          {auditYLabel}
        </text>
        <text
          x={auditPadding.left + auditPlotWidth / 2}
          y={auditHeight - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="700"
        >
          Month
        </text>
      </svg>
    );
  };

  const renderIncidentChart = (variant: "card" | "expanded") => {
    const expanded = variant === "expanded";

    return (
      <svg
        viewBox={`0 0 ${incidentWidth} ${incidentHeight}`}
        className={expanded ? "h-[66vh] min-h-[420px] w-full" : "h-[285px] w-full"}
        role="img"
        aria-label="Stacked incident rates with repeat-rate overlay and rollout band."
      >
        {[0, 8, 16, 24, 32, 40].map((tick) => {
          const y = incidentScaleY(tick);
          return (
            <g key={`incident-grid-${variant}-${tick}`}>
              <line
                x1={incidentPadding.left}
                y1={y}
                x2={incidentWidth - incidentPadding.right}
                y2={y}
                stroke="rgba(255,255,255,0.14)"
                strokeDasharray="3 6"
              />
              <text
                x={incidentPadding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.72)"
                fontSize="12"
                fontWeight="700"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <RolloutBand
          x={incidentRollout.start}
          width={incidentRollout.end - incidentRollout.start}
          y={incidentPadding.top}
          height={incidentPlotHeight}
          label="Attestiva rollout"
        />

        <line
          x1={incidentPadding.left}
          y1={severeThresholdY}
          x2={incidentWidth - incidentPadding.right}
          y2={severeThresholdY}
          stroke="rgba(255,125,125,0.8)"
          strokeDasharray="6 6"
        />
        <text
          x={incidentWidth - incidentPadding.right - 3}
          y={severeThresholdY - 8}
          textAnchor="end"
          fill="rgba(255,175,175,0.92)"
          fontSize="11"
          fontWeight="700"
        >
          Risk tolerance line
        </text>

        {incidentWindow.map((row, index) => {
          const xCenter = incidentPadding.left + index * incidentStep + incidentStep / 2;

          const nearTop = row.nearMissRate;
          const lowTop = nearTop + row.lowRate;
          const mediumTop = lowTop + row.mediumRate;
          const severeTop = mediumTop + row.severeRate;

          const nearY = incidentScaleY(nearTop);
          const lowY = incidentScaleY(lowTop);
          const mediumY = incidentScaleY(mediumTop);
          const severeY = incidentScaleY(severeTop);
          const baseY = incidentScaleY(0);

          return (
            <g key={`incident-${variant}-${row.month}`}>
              <rect
                x={xCenter - incidentBarWidth / 2}
                y={nearY}
                width={incidentBarWidth}
                height={baseY - nearY}
                fill="rgba(255,255,255,0.2)"
                rx={4}
                className="cursor-pointer"
                data-drill="true"
                onClick={(event) => {
                  event.stopPropagation();
                  if (variant !== "card") return;
                  openDrawer(`Near-miss detail: ${row.month}`, "incident");
                }}
              />
              <rect
                x={xCenter - incidentBarWidth / 2}
                y={lowY}
                width={incidentBarWidth}
                height={nearY - lowY}
                fill="rgba(0,211,127,0.72)"
                className="cursor-pointer"
                data-drill="true"
                onClick={(event) => {
                  event.stopPropagation();
                  if (variant !== "card") return;
                  openDrawer(`Low severity detail: ${row.month}`, "incident");
                }}
              />
              <rect
                x={xCenter - incidentBarWidth / 2}
                y={mediumY}
                width={incidentBarWidth}
                height={lowY - mediumY}
                fill="rgba(214,255,10,0.88)"
                className="cursor-pointer"
                data-drill="true"
                onClick={(event) => {
                  event.stopPropagation();
                  if (variant !== "card") return;
                  openDrawer(`Medium severity detail: ${row.month}`, "incident");
                }}
              />
              <rect
                x={xCenter - incidentBarWidth / 2}
                y={severeY}
                width={incidentBarWidth}
                height={mediumY - severeY}
                fill="rgba(255,74,92,0.96)"
                className="cursor-pointer"
                data-drill="true"
                onClick={(event) => {
                  event.stopPropagation();
                  if (variant !== "card") return;
                  openDrawer(`Severe detail: ${row.month}`, "incident");
                }}
              />

              <text
                x={xCenter}
                y={incidentHeight - 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.83)"
                fontSize="12"
                fontWeight="700"
              >
                {row.month}
              </text>
            </g>
          );
        })}

        <path
          d={repeatPath}
          fill="none"
          stroke="rgba(255,179,141,0.95)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {repeatPoints.map((point) => (
          <circle
            key={`repeat-${variant}-${point.label}`}
            cx={point.x}
            cy={point.y}
            r={4.5}
            fill="#ffb38d"
            stroke="#101315"
            strokeWidth={2}
            className="cursor-pointer"
            data-drill="true"
            onClick={(event) => {
              event.stopPropagation();
              if (variant !== "card") return;
              openDrawer(`Repeat rate detail: ${point.label}`, "incident");
            }}
          />
        ))}

        {repeatPoints[repeatPoints.length - 1] && (
          <text
            x={repeatPoints[repeatPoints.length - 1].x + 10}
            y={clamp(
              repeatPoints[repeatPoints.length - 1].y - 8,
              incidentPadding.top + 12,
              incidentHeight - incidentPadding.bottom - 6
            )}
            fill="rgba(255,179,141,0.98)"
            fontSize="12"
            fontWeight="800"
          >
            Repeat rate
          </text>
        )}

        {incidentOctPoint && (
          <AnnotationCallout
            x={incidentOctPoint.x}
            y={incidentOctPoint.y}
            lines={["Understanding verified +", "manager escalation enabled"]}
            width={226}
          />
        )}

        <text
          x={16}
          y={incidentPadding.top + incidentPlotHeight / 2}
          transform={`rotate(-90 16 ${incidentPadding.top + incidentPlotHeight / 2})`}
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="700"
        >
          Incidents / 10,000 work hours
        </text>
        <text
          x={incidentWidth - 10}
          y={incidentPadding.top + incidentPlotHeight / 2}
          transform={`rotate(90 ${incidentWidth - 10} ${incidentPadding.top + incidentPlotHeight / 2})`}
          fill="rgba(255,179,141,0.92)"
          fontSize="12"
          fontWeight="700"
        >
          Repeat rate (%)
        </text>
        <text
          x={incidentPadding.left + incidentPlotWidth / 2}
          y={incidentHeight - 6}
          textAnchor="middle"
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="700"
        >
          Month
        </text>
      </svg>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_8%_10%,rgba(214,255,10,0.2)_0%,transparent_44%),radial-gradient(circle_at_88%_82%,rgba(0,211,127,0.16)_0%,transparent_42%),linear-gradient(180deg,#0F1112_0%,#161A1C_56%,#101315_100%)] py-24 md:py-28">
      <div className="pointer-events-none absolute -top-16 left-8 h-56 w-56 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-6 h-72 w-72 rounded-full bg-[var(--color-accent-2)]/15 blur-3xl" />

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
              Verified understanding first.
              <br />
              <AccentHighlight mode="inView" delay={0.15}>
                Risk drops where it matters.
              </AccentHighlight>
            </h3>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-white/85 md:text-2xl">
              The story management wants to hear, with leading and lagging indicators in one view.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-white/20 bg-black/35 p-4 md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-full rounded-full border border-white/20 bg-white/5 p-1 lg:w-auto">
                {[
                  { id: "risk", label: "Risk Posture", Icon: ShieldAlert },
                  { id: "efficiency", label: "Operational Efficiency", Icon: Activity },
                ].map((item) => {
                  const isActive = item.id === activeView;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveView(item.id as ActiveView)}
                      className={`relative inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors md:px-6 ${
                        isActive ? activeTabClass : inactiveTabClass
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-dashboard-tab"
                          className="absolute inset-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_28px_rgba(214,255,10,0.35)]"
                          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        />
                      )}
                      <item.Icon className="relative z-10 h-4 w-4" />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1">
                  {(["30d", "90d", "365d", "custom"] as DateRange[]).map((range) => {
                    const active = range === dateRange;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setDateRange(range)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
                          active
                            ? "bg-[var(--color-accent)] text-[#1A1A1A]"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>

                <label className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-white/70">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Org/Facility
                  </span>
                  <select
                    value={facility}
                    onChange={(event) => setFacility(event.target.value as Facility)}
                    className="bg-transparent py-2.5 pr-1 text-xs font-bold uppercase tracking-[0.08em] text-white outline-none"
                  >
                    {Object.entries(facilityLabels).map(([value, label]) => (
                      <option key={value} value={value} className="bg-[#171A1D] text-white">
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                </label>
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-white/60">Example metrics (illustrative).</p>
          </div>

          <AnimatePresence mode="wait">
            {activeView === "risk" ? (
              <motion.div
                key="risk-view"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="mt-8 grid gap-6 lg:grid-cols-2"
              >
                <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-[1.7rem] font-black leading-tight text-white">
                        Audit gaps fall when understanding is verified.
                      </h4>
                      <p className="mt-2 text-sm font-semibold text-white/78 md:text-base">
                        After Attestiva rollout, open gaps drop and evidence stays current.
                      </p>
                    </div>
                    <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1">
                      <button
                        type="button"
                        onClick={() => setAuditMetricView("gaps")}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                          auditMetricView === "gaps"
                            ? "bg-[var(--color-accent)] text-[#131313]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Open gaps
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuditMetricView("readiness")}
                        className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                          auditMetricView === "readiness"
                            ? "bg-[var(--color-accent)] text-[#131313]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        Readiness index
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {riskKpiLeft.map((chip) => (
                      <KpiChip
                        key={chip.label}
                        from={chip.from}
                        to={chip.to}
                        label={chip.label}
                        delta={chip.delta}
                        tone={chip.tone}
                      />
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-[#111518]/90 p-4">
                    <div
                      className="cursor-zoom-in rounded-xl transition-transform duration-300 hover:scale-[1.01]"
                      onClick={maybeOpenExpandedChart("audit")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openExpandedChart("audit");
                        }
                      }}
                      aria-label="Expand audit risk chart"
                    >
                      {renderAuditChart("card")}
                    </div>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.11em] text-white/55">
                      Click chart to expand
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white/83">
                    What changed: comprehension checks + manager follow-ups.
                  </p>
                </article>

                <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                  <div>
                    <h4 className="font-display text-[1.7rem] font-black leading-tight text-white">
                      Severe events drop—and repeats stop repeating.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/78 md:text-base">
                      Repeat rate falls first; severe incidents follow within 60 days.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {riskKpiRight.map((chip) => (
                      <KpiChip
                        key={chip.label}
                        from={chip.from}
                        to={chip.to}
                        label={chip.label}
                        delta={chip.delta}
                        tone={chip.tone}
                      />
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-[#111518]/90 p-4">
                    <div
                      className="cursor-zoom-in rounded-xl transition-transform duration-300 hover:scale-[1.01]"
                      onClick={maybeOpenExpandedChart("incident")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openExpandedChart("incident");
                        }
                      }}
                      aria-label="Expand incident trend chart"
                    >
                      {renderIncidentChart("card")}
                    </div>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.11em] text-white/55">
                      Click chart to expand
                    </p>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-white/83">
                    What changed: scenario-based checks + coaching loop.
                  </p>
                </article>
              </motion.div>
            ) : (
              <motion.div
                key="efficiency-view"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="mt-8 grid gap-6 lg:grid-cols-2"
              >
                <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                  <div>
                    <h4 className="font-display text-[1.7rem] font-black leading-tight text-white">
                      Time-to-close compression is holding across the tail.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/78 md:text-base">
                      Escalation and ownership clarity pull down median and 90th percentile closure time.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {efficiencyKpisA.map((chip) => (
                      <KpiChip
                        key={chip.label}
                        from={chip.from}
                        to={chip.to}
                        label={chip.label}
                        delta={chip.delta}
                        tone={chip.tone}
                      />
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-[#111518]/90 p-4">
                    <svg viewBox={`0 0 ${closeWidth} ${closeHeight}`} className="h-[260px] w-full" role="img" aria-label="Before and after time-to-close distribution.">
                      {[0, 20, 40, 60, 80].map((tick) => {
                        const y = closeScaleY(tick);
                        return (
                          <g key={`close-grid-${tick}`}>
                            <line
                              x1={closePadding.left}
                              y1={y}
                              x2={closeWidth - closePadding.right}
                              y2={y}
                              stroke="rgba(255,255,255,0.14)"
                              strokeDasharray="3 6"
                            />
                            <text
                              x={closePadding.left - 10}
                              y={y + 4}
                              textAnchor="end"
                              fill="rgba(255,255,255,0.72)"
                              fontSize="12"
                              fontWeight="700"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {timeToCloseData.map((bucket, index) => {
                        const centerX = closePadding.left + index * closeStep + closeStep / 2;
                        const beforeHeight = closeScaleY(0) - closeScaleY(bucket.before);
                        const afterHeight = closeScaleY(0) - closeScaleY(bucket.after);
                        return (
                          <g key={bucket.bucket}>
                            <rect
                              x={centerX - 36}
                              y={closeScaleY(bucket.before)}
                              width={24}
                              height={beforeHeight}
                              rx={6}
                              fill="rgba(255,255,255,0.45)"
                              className="cursor-pointer"
                              onClick={() => openDrawer(`Before rollout: ${bucket.bucket}`, "efficiency")}
                            />
                            <rect
                              x={centerX + 10}
                              y={closeScaleY(bucket.after)}
                              width={24}
                              height={afterHeight}
                              rx={6}
                              fill="rgba(0,211,127,0.9)"
                              className="cursor-pointer"
                              onClick={() => openDrawer(`After rollout: ${bucket.bucket}`, "efficiency")}
                            />
                            <text
                              x={centerX}
                              y={closeHeight - 14}
                              textAnchor="middle"
                              fill="rgba(255,255,255,0.83)"
                              fontSize="12"
                              fontWeight="700"
                            >
                              {bucket.bucket}
                            </text>
                          </g>
                        );
                      })}

                      <text
                        x={16}
                        y={closePadding.top + closePlotHeight / 2}
                        transform={`rotate(-90 16 ${closePadding.top + closePlotHeight / 2})`}
                        fill="rgba(255,255,255,0.75)"
                        fontSize="12"
                        fontWeight="700"
                      >
                        Days to close (#)
                      </text>
                    </svg>
                  </div>
                </article>

                <article className="rounded-3xl border border-white/20 bg-black/35 p-6">
                  <div>
                    <h4 className="font-display text-[1.7rem] font-black leading-tight text-white">
                      Cost avoidance scales as rework and repeats shrink.
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-white/78 md:text-base">
                      Conservative savings assumptions still show strong improvement after rollout.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {efficiencyKpisB.map((chip) => (
                      <KpiChip
                        key={chip.label}
                        from={chip.from}
                        to={chip.to}
                        label={chip.label}
                        delta={chip.delta}
                        tone={chip.tone}
                      />
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/15 bg-[#111518]/90 p-4">
                    <svg viewBox={`0 0 ${costWidth} ${costHeight}`} className="h-[278px] w-full" role="img" aria-label="Cost avoidance waterfall chart.">
                      {[0, 100, 200, 300, 400, 500, 600, 700].map((tick) => {
                        const y = costScaleY(tick);
                        return (
                          <g key={`cost-grid-${tick}`}>
                            <line
                              x1={costPadding.left}
                              y1={y}
                              x2={costWidth - costPadding.right}
                              y2={y}
                              stroke="rgba(255,255,255,0.14)"
                              strokeDasharray="3 6"
                            />
                            <text
                              x={costPadding.left - 10}
                              y={y + 4}
                              textAnchor="end"
                              fill="rgba(255,255,255,0.72)"
                              fontSize="12"
                              fontWeight="700"
                            >
                              {tick}
                            </text>
                          </g>
                        );
                      })}

                      {costData.map((point, index) => {
                        const xCenter = costPadding.left + index * costStep + costStep / 2;
                        const isBaseline = point.kind === "base";
                        const isCurrent = point.kind === "result";

                        let from = 0;
                        let to = point.value;
                        if (point.kind === "delta") {
                          const prior = costData.slice(0, index).reduce((sum, row) => sum + row.value, 0);
                          from = prior + point.value;
                          to = prior;
                        }

                        const y = costScaleY(Math.max(from, to));
                        const h = Math.max(Math.abs(costScaleY(from) - costScaleY(to)), 8);
                        const fill = isBaseline
                          ? "rgba(255,138,101,0.92)"
                          : isCurrent
                          ? "rgba(0,211,127,0.92)"
                          : "rgba(214,255,10,0.92)";

                        return (
                          <g key={point.label}>
                            <rect
                              x={xCenter - costBarWidth / 2}
                              y={y}
                              width={costBarWidth}
                              height={h}
                              rx={8}
                              fill={fill}
                              className="cursor-pointer"
                              onClick={() => openDrawer(`Cost driver: ${point.label}`, "efficiency")}
                            />
                            <text
                              x={xCenter}
                              y={y - 8}
                              textAnchor="middle"
                              fill={point.kind === "delta" ? "#D6FF0A" : "#FFFFFF"}
                              fontSize="12"
                              fontWeight="800"
                            >
                              {point.kind === "delta" ? `${point.value}k` : `$${point.value}k`}
                            </text>
                            <text
                              x={xCenter}
                              y={costHeight - 24}
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
                    </svg>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {expandedChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[70] bg-black/80 p-3 backdrop-blur-sm md:p-6"
            onClick={closeExpandedChart}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className="mx-auto flex h-full w-full max-w-[1300px] flex-col rounded-[1.8rem] border border-white/20 bg-[#0f1418]/95 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.6)] md:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={expandedChart === "audit" ? "Expanded audit risk chart" : "Expanded incident trend chart"}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Expanded chart view
                  </p>
                  <h5 className="mt-1 font-display text-3xl font-black text-white md:text-4xl">
                    {expandedChart === "audit" ? "Audit Risk Trend" : "Incident Trend"}
                  </h5>
                  <p className="mt-1 text-sm font-semibold text-white/72 md:text-base">
                    {expandedChart === "audit"
                      ? "Current filters and readiness view are preserved."
                      : "Current filters and severity mix are preserved."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeExpandedChart}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#111] shadow-[0_0_24px_rgba(214,255,10,0.42)] transition-all hover:bg-[#e4ff43]"
                >
                  Close
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-[#111518]/95 p-3 md:p-5">
                {expandedChart === "audit" ? renderAuditChart("expanded") : renderIncidentChart("expanded")}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-white/55">
                Press Esc or click outside to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/55"
              onClick={() => setDrawer(null)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/20 bg-[#0f1418]/95 p-6 backdrop-blur-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">Detail panel</p>
                  <h5 className="mt-1 font-display text-3xl font-black text-white">Top drivers</h5>
                  <p className="mt-2 text-sm font-semibold text-white/76">{drawer.context}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawer(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
                  aria-label="Close drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul className="mt-6 space-y-3">
                {drawer.drivers.map((driver) => (
                  <li key={driver} className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white/88">
                    - {driver}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-black uppercase tracking-[0.09em] text-[#111] transition-colors hover:bg-[#e4ff43]"
              >
                Generate exec summary
              </button>

              <p className="mt-4 text-xs font-semibold text-white/55">
                Active filters: {dateRange} | {facilityLabels[facility]}
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
