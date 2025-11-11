import type { SubEvaluation } from "../../types/evaluation";

interface SubEvaluationCardProps {
  label: string;
  evaluation: SubEvaluation;
  defaultOpen?: boolean;
}

const getStrengthLabel = (score: number): "Weak" | "Medium" | "Strong" => {
  if (score >= 7) return "Strong";
  if (score >= 4) return "Medium";
  return "Weak";
};

export const SubEvaluationCard = ({
  label,
  evaluation,
  defaultOpen = false,
}: SubEvaluationCardProps) => {
  const strength = getStrengthLabel(evaluation.subScore);

  const details: Array<{ heading: string; value: string }> = [
    { heading: "Summary", value: evaluation.summary },
    {
      heading: "Score Justification",
      value: evaluation.subScoreJustification,
    },
    {
      heading: "Supporting Material Found",
      value: evaluation.supportingMaterial,
    },
    {
      heading: "Improvement Needed",
      value: evaluation.improvementNeeded,
    },
    { heading: "Recommendation", value: evaluation.recommendation },
  ];

  return (
    <details className="border p-4" open={defaultOpen}>
      <summary className="flex justify-between items-center gap-4 cursor-pointer list-none">
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <span>{strength}</span>
        </div>
        <span>
          {evaluation.subScore}/10
        </span>
      </summary>

      <div className="mt-4 flex flex-col gap-4">
        {details.map(({ heading, value }) => (
          <div key={heading}>
            <h4>{heading}</h4>
            <p>{value || "No supporting evidence detected."}</p>
          </div>
        ))}
      </div>
    </details>
  );
};

