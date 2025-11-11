import type { Conclusion } from "../../types/evaluation";

interface ConclusionSectionProps {
  conclusion: Conclusion;
}

export const ConclusionSection = ({ conclusion }: ConclusionSectionProps) => {
  const items: Array<{ title: string; body: string }> = [
    {
      title: "Key Steps to Strengthen Your Case",
      body: conclusion.KeyStepsToStrengthenYourCase,
    },
    {
      title: "Focus Areas to Boost Your Application",
      body: conclusion.FocusAreasToBoostYourApplication,
    },
    {
      title: "Take Immediate Action for Success",
      body: conclusion.TakeImmediateActionForSuccess,
    },
  ];

  return (
    <section className="p-6 flex flex-col gap-4">
      <div>
        <h2>Conclusion</h2>
        <p>Next steps recommended by our immigration evaluation assistant.</p>
      </div>
      <div className="grid gap-4">
        {items.map(({ title, body }) => (
          <article key={title} className="p-4 flex flex-col gap-2 border">
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

