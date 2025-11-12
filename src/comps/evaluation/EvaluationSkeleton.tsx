export const EvaluationSkeleton = () => {
  return (
    <section
      aria-busy="true"
      aria-label="Loading visa evaluation report"
      className="space-y-8 animate-pulse"
    >
      <div className="h-24 rounded-2xl bg-white/60 shadow-lg ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-900/40 dark:ring-slate-800/80" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-80 rounded-2xl bg-white/60 shadow-lg ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-900/40 dark:ring-slate-800/80" />
        <div className="h-80 rounded-2xl bg-white/50 shadow-lg ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-900/30 dark:ring-slate-800/80" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-60 rounded-2xl bg-white/50 shadow-lg ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-900/30 dark:ring-slate-800/80"
          />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-white/60 shadow-lg ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-900/40 dark:ring-slate-800/80" />
    </section>
  );
};
