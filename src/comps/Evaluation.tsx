import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { EvaluationResult } from "../types/evaluation";
import { CRITERIA_ORDER } from "../types/evaluation";
import { OverviewCard } from "./evaluation/OverviewCard";
import { CriteriaAnalysis } from "./evaluation/CriteriaAnalysis";
import { ConclusionSection } from "./evaluation/ConclusionSection";

interface EvaluationProps {
  evaluation: EvaluationResult;
  onReset?: () => void;
}

const NAV_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "criteria", label: "Criteria" },
  { id: "conclusion", label: "Conclusion" },
  { id: "next-steps", label: "Next Steps" },
];

const downloadEvaluation = (evaluation: EvaluationResult) => {
  const blob = new Blob([JSON.stringify(evaluation, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `opensphere-evaluation-${Date.now()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getSectionElement = (id: string) => document.getElementById(id);

const Evaluation = ({ evaluation, onReset }: EvaluationProps) => {
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [isActionFloating, setIsActionFloating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(NAV_SECTIONS[0].id);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const completion = useMemo(() => {
    const totalScore = Object.values(evaluation.CriteriaAnalysis).reduce(
      (acc, item) => acc + item.subScore,
      0,
    );
    const maxScore = CRITERIA_ORDER.length * 10;
    if (maxScore === 0) return 0;
    return Math.min(100, Math.max(0, Math.round((totalScore / maxScore) * 100)));
  }, [evaluation.CriteriaAnalysis]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsHeaderCondensed(scrollY > 72);
      setIsActionFloating(scrollY > 360);

      const sectionOffsets = NAV_SECTIONS.map((section) => {
        const el = getSectionElement(section.id);
        if (!el) {
          return { id: section.id, top: Number.POSITIVE_INFINITY };
        }
        const rect = el.getBoundingClientRect();
        return { id: section.id, top: rect.top };
      });

      const viewportTrigger = window.innerHeight * 0.3;
      const visibleSections = sectionOffsets
        .filter((section) => section.top <= viewportTrigger)
        .sort((a, b) => b.top - a.top);

      const nextActive = visibleSections[0]?.id ?? sectionOffsets[0]?.id;
      setActiveSection((prev) => (nextActive && prev !== nextActive ? nextActive : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const element = getSectionElement(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDownload = () => {
    downloadEvaluation(evaluation);
    toast.success("Report downloaded", { duration: 2400 });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopyFeedback(true);
      toast.success("Public link copied", { duration: 2200 });
      window.setTimeout(() => setShowCopyFeedback(false), 2200);
    } catch {
      toast.error("Unable to copy link. Try again.");
    }
  };

  const handleStrategySession = () => {
    toast("We’ll reach out to schedule within 1 business day.", {
      icon: "📅",
    });
  };

  const handleShareWithAttorney = () => {
    toast("Shareable summary generated for your attorney.", {
      icon: "📤",
    });
  };

  const actionButtons = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:from-sky-500 dark:to-blue-500"
      >
        Download
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Copy link
        </button>
        {showCopyFeedback && (
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-white shadow-lg dark:bg-slate-100/90 dark:text-slate-900">
            Copied!
          </span>
        )}
      </div>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Reset
        </button>
      )}
    </div>
  );

  return (
    <div className="relative space-y-10">
      <header
        className={`sticky top-0 z-30 rounded-3xl border border-white/50 bg-white/80 px-6 py-6 shadow-xl backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-900/70 ${isHeaderCondensed ? "mt-0 shadow-2xl" : "mt-6"}`}
      >
        <div className={`flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between ${isHeaderCondensed ? "lg:gap-4" : "lg:gap-6"}`}>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-sky-400">
              Your evaluation report
            </p>
            <h2 className={`font-semibold text-slate-900 transition-all dark:text-white ${isHeaderCondensed ? "text-2xl" : "text-3xl"}`}>
              U.S. O-1A Visa Feasibility Snapshot
            </h2>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Explore how your achievements align with the extraordinary ability visa
              requirements. Navigate through each criterion and follow the recommended
              roadmap to strengthen your case.
            </p>
          </div>

          <nav aria-label="Evaluation sections" className="flex flex-wrap items-center gap-2">
            {NAV_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleScrollTo(section.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-500 ${
                  activeSection === section.id
                    ? "border-blue-500/70 bg-blue-500/10 text-blue-600 dark:border-sky-400/70 dark:bg-sky-500/10 dark:text-sky-300"
                    : "border-transparent bg-slate-100/40 text-slate-500 hover:bg-slate-200/60 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-700/60"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div
          className="relative mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={completion}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            style={{ width: `${completion}%` }}
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-blue-500 via-sky-500 to-emerald-500 transition-all duration-500 ease-out"
          />
        </div>

        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {completion}% report completeness based on available documentation
        </p>

        <div className={`pt-4 transition ${isActionFloating ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          {actionButtons}
        </div>
      </header>

      <section id="overview">
        <OverviewCard
          chancesOfSuccess={evaluation.ChancesOfSuccess}
          overview={evaluation.overview}
        />
      </section>

      <section id="criteria">
        <CriteriaAnalysis criteria={evaluation.CriteriaAnalysis} />
      </section>

      <section id="conclusion">
        <ConclusionSection conclusion={evaluation.conclusion} />
      </section>

      <article
        id="next-steps"
        className="rounded-3xl border border-white/60 bg-linear-to-br from-blue-600 to-sky-500 p-8 text-white shadow-2xl backdrop-blur-xl dark:border-slate-700/60"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-semibold">Ready for your next milestone?</h3>
            <p className="text-sm/6 opacity-90">
              Partner with an immigration specialist to translate these recommendations
              into a winning petition strategy. We can help audit evidence, draft
              support letters, and prepare expert testimony.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStrategySession}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-slate-900/10 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              Book strategy session
            </button>
            <button
              type="button"
              onClick={handleShareWithAttorney}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
            >
              Share with attorney
            </button>
          </div>
        </div>
      </article>

      <aside className="rounded-3xl border border-white/60 bg-white/80 p-6 text-sm text-slate-600 shadow-lg backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300">
        <p>
          Important notice: This evaluation report is generated by a technology
          company and should not be considered legal advice. For specific legal
          guidance, consult a qualified immigration attorney.
        </p>
      </aside>

      {isActionFloating && (
        <aside className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-2xl backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-900/70">
            {actionButtons}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Evaluation;