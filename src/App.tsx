import { useCallback, useEffect, useMemo, useState } from "react";
import { useCountryVisas } from "./state/countryVisasContext.tsx";
import { evaluateScore } from "./funcs/evaluateScore.ts";
import Evaluation from "./comps/Evaluation";
import type { EvaluationResult } from "./types/evaluation";
import { EvaluationSkeleton } from "./comps/evaluation/EvaluationSkeleton.tsx";

function App() {
  const countryVisas = useCountryVisas();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visas, setVisas] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("");
  const [visa, setVisa] = useState<string>("");
  const [resume, setResume] = useState<File | undefined>(undefined);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const handleSelectCountry = useCallback((countryId: string) => {
    const countryVisa = countryVisas.find((cntry) => cntry._id === countryId);

    if (countryVisa) {
      setCountry(countryVisa._id);
      setVisas(countryVisa.visas);
      setVisa(countryVisa.visas[0] ?? "");
    }
  }, [countryVisas]);

  useEffect(() => {
    if (countryVisas.length > 0 && !country) {
      handleSelectCountry(countryVisas[0]._id);
    }
  }, [countryVisas, country, handleSelectCountry]);

  const handleEvaluation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !resume || !country || !visa) {
      setError("Please complete all fields to run the evaluation.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowSkeleton(true);

    try {
      const result = await evaluateScore({
        name,
        email,
        resume,
        country,
        visa,
      });

      setEvaluation(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your evaluation. Try again.",
      );
    } finally {
      setLoading(false);
      window.setTimeout(() => setShowSkeleton(false), 320);
    }
  };

  const handleResetEvaluation = () => {
    setEvaluation(null);
    setResume(undefined);
    setShowSkeleton(false);
  };

  const isSubmitDisabled = useMemo(
    () =>
      loading ||
      !name.trim() ||
      !email.trim() ||
      !resume ||
      !country.trim() ||
      !visa.trim(),
    [loading, name, email, resume, country, visa],
  );

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 transition-colors dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-900/30" />
        <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/30" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-24 pt-12 sm:px-6 lg:px-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-white/60 bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-wider text-blue-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-sky-400">
            OpenSphere Evaluation Suite
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Get Your Free U.S. Visa Evaluation
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Upload your resume and we’ll benchmark your eligibility across key O-1A
            visa criteria with actionable insights for faster approvals.
          </p>
        </header>

        <section className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-xl transition dark:border-slate-800/80 dark:bg-slate-900/70">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Start your evaluation
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We assess your profile confidentially. Expect a full report in under a
              minute.
            </p>
          </header>

          <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleEvaluation}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Viraj Mahida"
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="viraj@opensphere.ai"
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="country">
                Country of citizenship
              </label>
              <select
                id="country"
                value={country}
                onChange={(event) => handleSelectCountry(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                required
              >
                {countryVisas.map((countryVisa) => (
                  <option key={countryVisa._id} value={countryVisa._id}>
                    {countryVisa._id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="visa">
                Permit / visa focus
              </label>
              <select
                id="visa"
                value={visa}
                onChange={(event) => setVisa(event.target.value)}
                disabled={visas.length === 0}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                required
              >
                {visas.map((visaOption) => (
                  <option key={visaOption} value={visaOption}>
                    {visaOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="resume">
                  Upload resume (PDF)
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(event) => setResume(event.target.files?.[0])}
                  className="w-full cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-5 text-sm font-medium text-slate-600 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-500/20"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We securely process your document to extract accomplishments and
                  supporting evidence. Files are deleted automatically after the evaluation.
                </p>
              </div>
            </div>

            <div className="md:col-span-2" aria-live="polite">
              {error && (
                <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-600 shadow-sm dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl hover:shadow-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:from-sky-500 dark:to-blue-500"
              >
                {loading ? "Evaluating profile…" : "Evaluate now"}
              </button>

              {evaluation && (
                <button
                  type="button"
                  onClick={handleResetEvaluation}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
                >
                  Reset result
                </button>
              )}
            </div>
          </form>
        </section>

        {showSkeleton && <EvaluationSkeleton />}

        {evaluation && !showSkeleton && (
          <section className="relative" aria-live="polite">
            <Evaluation evaluation={evaluation} onReset={handleResetEvaluation} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
