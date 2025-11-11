import { useEffect, useState } from "react";
import { useCountryVisas } from "./state/countryVisasContext.tsx";
import { evaluateScore } from "./funcs/evaluateScore.ts";
import Evaluation from "./comps/Evaluation";
import type { EvaluationResult } from "./types/evaluation";

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

  const handleSelectCountry = (countryId: string) => {
    const countryVisa = countryVisas.find((cntry) => cntry._id === countryId);

    if (countryVisa) {
      setCountry(countryVisa._id);
      setVisas(countryVisa.visas);
      setVisa(countryVisa.visas[0] ?? "");
    }
  };

  useEffect(() => {
    if (countryVisas.length > 0 && !country) {
      handleSelectCountry(countryVisas[0]._id);
    }
  }, [countryVisas, country]);

  const handleEvaluation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !resume || !country || !visa) {
      setError("Please fill all the fields");
      return;
    }

    setLoading(true);
    setError(null);

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
          : "Error in evaluation. Try again!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetEvaluation = () => {
    setEvaluation(null);
    setResume(undefined);
  };

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 text-center font-semibold">
        <h1>Get Your Free U.S. Visa Evaluation</h1>
        <p>
          Upload your resume to discover the best U.S. visa options for your
          profile.
        </p>
      </header>

      <section className="p-6">
        <h2>Start Your Evaluation</h2>
        <form className="grid gap-4" onSubmit={handleEvaluation}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Viraj Mahida"
              className="p-2 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="viraj@openshere.ai"
              className="p-2 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => handleSelectCountry(e.target.value)}
              className="p-2 border"
            >
              {countryVisas.map((countryVisa) => (
                <option key={countryVisa._id} value={countryVisa._id}>
                  {countryVisa._id}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="visa">Permit/Visa</label>
            <select
              id="visa"
              value={visa}
              onChange={(e) => setVisa(e.target.value)}
              disabled={visas.length === 0}
              className="p-2 border"
            >
              {visas.map((visaOption) => (
                <option key={visaOption} value={visaOption}>
                  {visaOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="resume">Upload Resume</label>
            <input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files?.[0])}
              className="p-2 border"
            />
          </div>

          {error && <p>{error}</p>}

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="p-2 border bg-blue-400 font-semibold rounded">
              {loading ? "Evaluating..." : "Evaluate Now"}
            </button>
            {evaluation && (
              <button
                type="button"
                onClick={handleResetEvaluation}
                className="p-2 underline"
              >
                Reset Result
              </button>
            )}
          </div>
        </form>
      </section>

      {evaluation && (
        <section className="flex flex-col">
          <Evaluation evaluation={evaluation} onReset={handleResetEvaluation} />
        </section>
      )}
    </main>
  );
}

export default App;
