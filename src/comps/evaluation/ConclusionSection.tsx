import { useState } from "react";
import type { Conclusion } from "../../types/evaluation";

interface ConclusionSectionProps {
  conclusion: Conclusion;
}

const CONCLUSION_ORDER: Array<{
  id: keyof Conclusion;
  title: string;
  caption: string;
}> = [
  {
    id: "KeyStepsToStrengthenYourCase",
    title: "Key steps to strengthen your case",
    caption: "Prioritise the moves that unlock the greatest evidence velocity.",
  },
  {
    id: "FocusAreasToBoostYourApplication",
    title: "Focus areas to boost your application",
    caption: "Invest resources where adjudicators expect measurable traction.",
  },
  {
    id: "TakeImmediateActionForSuccess",
    title: "Take immediate action for success",
    caption: "Quick wins to shore up critical criteria in the next 90 days.",
  },
];

export const ConclusionSection = ({ conclusion }: ConclusionSectionProps) => {
  const [expandedId, setExpandedId] = useState<keyof Conclusion | null>(null);

  return (
    <article className="space-y-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70">
      <header className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Conclusion & roadmap
        </h3>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Translate insights into a tactical execution plan. Each track below outlines
          why it matters, what to do next, and how to evidence progress for USCIS.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {CONCLUSION_ORDER.map(({ id, title, caption }, index) => {
          const body = conclusion[id];
          const isExpanded = expandedId === id;

          return (
            <article
              key={id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg transition hover:shadow-2xl dark:border-slate-700 dark:bg-slate-950/50"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-600 dark:bg-sky-500/10 dark:text-sky-300">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h4>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {caption}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {body}
              </p>

              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : id)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm transition hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
              >
                {isExpanded ? "Hide learnings" : "Learn more"}
              </button>

              {isExpanded && (
                <div className="rounded-2xl border border-blue-200/70 bg-blue-50/80 px-4 py-4 text-sm text-blue-900 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
                  <p>
                    Translate these actions into calendar commitments. Attach evidence
                    links (press, awards, reference letters) in your workback plan to
                    keep collaborators accountable and accelerate petition drafting.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </article>
  );
};

