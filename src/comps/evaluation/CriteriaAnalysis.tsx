import { useEffect, useMemo, useState } from "react";
import type {
  CriteriaAnalysis as CriteriaAnalysisType,
  CriteriaKey,
} from "../../types/evaluation";
import {
  CRITERIA_LABELS,
  CRITERIA_ORDER,
} from "../../types/evaluation";
import { SubEvaluationCard } from "./SubEvaluationCard";

interface CriteriaAnalysisProps {
  criteria: CriteriaAnalysisType;
}

const CRITERIA_META: Record<CriteriaKey, { icon: string; why: string; learnMore: string }> = {
  recognizedPrizeOrAwards: {
    icon: "🏆",
    why: "Awards validate peer recognition and can replace multiple weaker criteria when nationally lauded.",
    learnMore:
      "Gather documentation for award prestige, judging panels, and media coverage to prove industry impact.",
  },
  membershipInRecognizedAssociations: {
    icon: "🛡️",
    why: "Selective memberships evidence endorsement from respected authorities in your discipline.",
    learnMore:
      "Secure letters from association leaders and detail admission selectivity, voting rights, and contributions.",
  },
  originalContributionsToTheField: {
    icon: "💡",
    why: "Novel intellectual property and product launches show the beneficiary pushes the field forward.",
    learnMore:
      "Document patents, shipped features, and adoption metrics to prove widespread industry reliance.",
  },
  EmploymentInCriticalCapacity: {
    icon: "🧭",
    why: "Serving in pivotal roles at top-tier organizations signals trust and critical influence.",
    learnMore:
      "Compile organization rankings, team scope, and letters confirming strategic responsibility.",
  },
  HighSalaryOrRemuneration: {
    icon: "💼",
    why: "Salary benchmarks quantify marketplace demand and exceptional compensation.",
    learnMore:
      "Show contracts, equity valuations, and salary surveys proving compensation exceeds 90th percentile peers.",
  },
  PublishedMaterialOrMediaAboutTheBeneficiary: {
    icon: "📰",
    why: "Independent press demonstrates market excitement and third-party validation of achievements.",
    learnMore:
      "Aggregate links, circulation data, and editorial quotes highlighting impact and scale.",
  },
  AuthorshipOfScholarlyArticles: {
    icon: "✍️",
    why: "Peer-reviewed articles show thought leadership and influence on the academic discourse.",
    learnMore:
      "Provide DOIs, citation counts, and venue acceptance rates to emphasize authority.",
  },
  JudgingParticipationInTheField: {
    icon: "⚖️",
    why: "Judging others’ work indicates the community relies on your expertise to set the standard.",
    learnMore:
      "List judging invitations, evaluation criteria, and notable events to prove selectivity.",
  },
};

export const CriteriaAnalysis = ({ criteria }: CriteriaAnalysisProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  const distribution = useMemo(() => {
    return Object.values(criteria).reduce(
      (acc, item) => {
        if (item.subScore >= 7) acc.strong += 1;
        else if (item.subScore >= 4) acc.medium += 1;
        else acc.weak += 1;
        return acc;
      },
      { strong: 0, medium: 0, weak: 0 },
    );
  }, [criteria]);

  return (
    <article className="space-y-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/70">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Criteria analysis
          </h3>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Each criterion below is scored on evidentiary strength. Expand the sections
            to view supporting material, gaps, and our recommended next moves.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
          <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-300">
            ● {distribution.strong} strong
          </span>
          <span className="flex items-center gap-1 text-amber-500 dark:text-amber-300">
            ● {distribution.medium} moderate
          </span>
          <span className="flex items-center gap-1 text-red-500 dark:text-red-300">
            ● {distribution.weak} weak
          </span>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {CRITERIA_ORDER.map((key, index) => {
          const evaluation = criteria[key];
          const meta = CRITERIA_META[key];
          const defaultOpen = isMobile
            ? evaluation.subScore < 4
            : index === 0 || evaluation.subScore < 4;

          return (
            <SubEvaluationCard
              key={key}
              label={CRITERIA_LABELS[key]}
              evaluation={evaluation}
              icon={meta.icon}
              whyMatters={meta.why}
              learnMore={meta.learnMore}
              defaultOpen={defaultOpen}
            />
          );
        })}
      </div>
    </article>
  );
};

