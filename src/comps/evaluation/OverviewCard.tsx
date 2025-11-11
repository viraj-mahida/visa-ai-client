interface OverviewCardProps {
  chancesOfSuccess: number;
  overview: string;
}

export const OverviewCard = ({
  chancesOfSuccess,
  overview,
}: OverviewCardProps) => {
  return (
    <section className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <div className="w-56 h-36 p-8 flex flex-col items-center justify-center border rounded-full bg-blue-400 text-center">
          <span className="font-bold text-3xl">{chancesOfSuccess}%</span>
          <span className="text-sm">Chances of Success</span>
        </div>
        <div>
          <h2>Overview</h2>
          <p>{overview}</p>
        </div>
      </div>
    </section>
  );
};

