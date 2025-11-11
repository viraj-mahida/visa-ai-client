import type { CriteriaAnalysis as CriteriaAnalysisType } from "../../types/evaluation";
import { CRITERIA_LABELS, CRITERIA_ORDER } from "../../types/evaluation";
import { SubEvaluationCard } from "./SubEvaluationCard";

interface CriteriaAnalysisProps {
  criteria: CriteriaAnalysisType;
}

export const CriteriaAnalysis = ({ criteria }: CriteriaAnalysisProps) => {
  return (
    <section className="p-6 flex flex-col gap-4">
      <div>
        <h2>Criteria Analysis</h2>
      </div>
      <div className="flex flex-col gap-4">
        {CRITERIA_ORDER.map((key, index) => (
          <SubEvaluationCard
            key={key}
            label={CRITERIA_LABELS[key]}
            evaluation={criteria[key]}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
};

