import { useEffect, useMemo, useState } from "react";

interface OverviewCardProps {
  chancesOfSuccess: number;
  overview: string;
}

const RADIUS = 72;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const OverviewCard = ({ chancesOfSuccess, overview }: OverviewCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(0);
    const frame = window.requestAnimationFrame(() => {
      setAnimatedProgress(Math.min(Math.max(chancesOfSuccess, 0), 100));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chancesOfSuccess]);

  const strokeDashoffset = useMemo(() => {
    const normalized = Math.min(Math.max(animatedProgress, 0), 100);
    return CIRCUMFERENCE - (normalized / 100) * CIRCUMFERENCE;
  }, [animatedProgress]);

  const marginOfError = useMemo(() => {
    return Math.max(4, Math.round((100 - chancesOfSuccess) * 0.2));
  }, [chancesOfSuccess]);

  const confidenceLower = useMemo(
    () => Math.max(0, chancesOfSuccess - marginOfError),
    [chancesOfSuccess, marginOfError],
  );

  const confidenceUpper = useMemo(
    () => Math.min(100, chancesOfSuccess + marginOfError),
    [chancesOfSuccess, marginOfError],
  );

  const confidenceRange = confidenceUpper - confidenceLower;
  const rangeWidth = useMemo(
    () => Math.min(100, Math.max(5, confidenceRange)),
    [confidenceRange],
  );
  const rangeOffset = useMemo(
    () => Math.min(confidenceLower, 100 - rangeWidth),
    [confidenceLower, rangeWidth],
  );

  const previousScore = Math.max(0, Math.min(100, chancesOfSuccess - 6));
  const monthOverMonthDelta = chancesOfSuccess - previousScore;
  const cohortAverage = 35;
  const cohortDelta = chancesOfSuccess - cohortAverage;

  return (
    <article className="grid gap-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md transition dark:border-slate-800/80 dark:bg-slate-900/70 lg:grid-cols-[max-content_1fr] lg:items-center">
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="h-56 w-56"
          role="img"
          aria-label={`Chances of success ${chancesOfSuccess}%`}
        >
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59 130 246)" />
              <stop offset="100%" stopColor="rgb(37 99 235)" />
            </linearGradient>
            <linearGradient id="track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(148, 163, 184, 0.25)" />
              <stop offset="100%" stopColor="rgba(148, 163, 184, 0.05)" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke="url(#track-gradient)"
            strokeWidth={STROKE}
            fill="transparent"
          />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke="url(#progress-gradient)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            className="transition-[stroke-dashoffset] duration-700 ease-out"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-4xl font-semibold text-slate-900 dark:text-white">
            {Math.round(animatedProgress)}%
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Success odds
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Executive summary
          </h3>
          <p className="text-base text-slate-600 dark:text-slate-300">{overview}</p>
        </header>

        <section className="grid gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
          <header className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Confidence meter
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {confidenceLower}% – {confidenceUpper}% (±{marginOfError}%)
              </span>
            </div>
            <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
              {confidenceRange >= 30 ? "Low certainty" : "Stable"}
            </span>
          </header>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
            <span
              className="absolute inset-y-0 rounded-full bg-linear-to-r from-blue-500 via-sky-500 to-emerald-500"
              style={{
                left: `${rangeOffset}%`,
                width: `${rangeWidth}%`,
              }}
            />
            <span
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-sm dark:border-slate-900"
              style={{ left: `${chancesOfSuccess}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The meter represents the model’s expected variance based on document depth
            and comparables in your cohort. Narrow the band by adding verified
            evidence for weak criteria.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Month over month
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-lg font-semibold ${
                  monthOverMonthDelta >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {monthOverMonthDelta >= 0 ? "▲" : "▼"}
                {Math.abs(Math.round(monthOverMonthDelta))}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs previous evaluation ({previousScore}%)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cohort benchmark
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-lg font-semibold ${
                  cohortDelta >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {cohortDelta >= 0 ? "+" : ""}
                {Math.round(cohortDelta)}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs AI talent peers (avg {cohortAverage}%)
              </span>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

