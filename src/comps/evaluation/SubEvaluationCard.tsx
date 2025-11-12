import { useEffect, useMemo, useState } from "react";
import type { SubEvaluation } from "../../types/evaluation";

interface SubEvaluationCardProps {
  label: string;
  evaluation: SubEvaluation;
  icon: string;
  whyMatters: string;
  learnMore: string;
  defaultOpen?: boolean;
}

interface StatusConfig {
  label: "Critical" | "Warning" | "Good";
  badge: string;
  accent: string;
  bar: string;
  text: string;
}

const getStatusConfig = (score: number): StatusConfig => {
  if (score >= 7) {
    return {
      label: "Good",
      badge:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
      accent: "bg-emerald-500",
      bar: "bg-emerald-500",
      text: "text-emerald-500",
    };
  }
  if (score >= 4) {
    return {
      label: "Warning",
      badge:
        "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
      accent: "bg-amber-500",
      bar: "bg-amber-500",
      text: "text-amber-500",
    };
  }
  return {
    label: "Critical",
    badge: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-200",
    accent: "bg-red-500",
    bar: "bg-red-500",
    text: "text-red-500",
  };
};

export const SubEvaluationCard = ({
  label,
  evaluation,
  icon,
  whyMatters,
  learnMore,
  defaultOpen = false,
}: SubEvaluationCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [badgePulse, setBadgePulse] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  useEffect(() => {
    if (!badgePulse) return;
    const timeout = window.setTimeout(() => setBadgePulse(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [badgePulse]);

  const status = useMemo(() => getStatusConfig(evaluation.subScore), [evaluation.subScore]);
  const scorePercent = useMemo(
    () => Math.min(100, Math.max(0, Math.round((evaluation.subScore / 10) * 100))),
    [evaluation.subScore],
  );

  const details: Array<{ heading: string; value: string }> = useMemo(
    () => [
      { heading: "Summary", value: evaluation.summary },
      {
        heading: "Score justification",
        value: evaluation.subScoreJustification,
      },
      {
        heading: "Supporting material located",
        value: evaluation.supportingMaterial,
      },
      {
        heading: "Improvement needed",
        value: evaluation.improvementNeeded,
      },
      { heading: "Recommendation", value: evaluation.recommendation },
    ],
    [evaluation],
  );

  return (
    <details
      className="group relative overflow-hidden rounded-2xl border border-white/65 bg-white/80 p-6 shadow-xl shadow-slate-900/5 transition-all duration-200 ease-out hover:scale-[1.01] hover:shadow-2xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 rounded-tr-full rounded-br-full ${status.accent}`}
      />
      <summary className="flex cursor-pointer list-none flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-xl">
              {icon}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Criterion
              </span>
              <h4 className="text-lg font-semibold text-slate-900 transition group-open:text-xl dark:text-white">
                {label}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                badgePulse ? `animate-pulse ${status.badge}` : status.badge
              }`}
            >
              {status.label}
            </span>
            <span
              className={`rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200`}
            >
              {evaluation.subScore}/10
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className={`${status.text}`}>Evidence signal</span>
          <button
            type="button"
            className="relative rounded-full border border-slate-200/60 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setTooltipVisible((prev) => !prev);
            }}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
            aria-expanded={tooltipVisible}
          >
            Why this matters
            {tooltipVisible && (
              <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-2xl border border-slate-200/60 bg-white/95 p-3 text-[11px] font-normal text-slate-600 shadow-xl dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
                {whyMatters}
              </span>
            )}
          </button>
        </div>

        <div className="relative mt-2 max-h-16 overflow-hidden pr-4 text-sm text-slate-600 dark:text-slate-400 group-open:hidden">
          <p className="leading-relaxed">
            {evaluation.summary || "No supporting evidence detected."}
          </p>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80" />
        </div>
      </summary>

      <div className="mt-5 space-y-5 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>Evidence strength</span>
            <span>{scorePercent}% resolved</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
            <span
              className={`block h-full rounded-full ${status.bar}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {details.map(({ heading, value }) => (
          <div key={heading} className="space-y-1 rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
            <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
              {heading}
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {value || "No supporting evidence detected."}
            </p>
          </div>
        ))}

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm transition hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
          onClick={() => setShowLearnMore((prev) => !prev)}
        >
          {showLearnMore ? "Hide insights" : "Learn more"}
        </button>

        {showLearnMore && (
          <div className="rounded-2xl border border-blue-200/70 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
            {learnMore}
          </div>
        )}
      </div>
    </details>
  );
};

