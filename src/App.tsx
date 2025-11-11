import { useEffect, useState } from "react";
import "./App.css";
import { useCountryVisas } from "./state/countryVisasContext.tsx";
import { evaluateScore } from "./funcs/evaluateScore.ts";

function App() {
  const countryVisas = useCountryVisas();
  const [visas, setVisas] = useState<string[] | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [visa, setVisa] = useState<string | undefined>(undefined);
  const [resume, setResume] = useState<File | undefined>(undefined);

  const handleSelectCountry = (country: string) => {
    const countryVisa = countryVisas.find((cntry) => cntry._id === country);

    if (countryVisa) {
      setCountry(country);
      setVisas(countryVisa.visas);
    }
  };

  useEffect(()=> {
    handleSelectCountry(countryVisas[0]._id);
  }, [])

  const handleEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !country || !visa) return;

    await evaluateScore({ resume, country, visa });
  }

  return (
    <main>
      <form 
      onSubmit={handleEvaluation}
      className="flex flex-col gap-4">
        <label htmlFor="name">Full Name</label>
        <input type="text" className="border-b" id="name" />

        <label htmlFor="email">Email</label>
        <input type="text" className="border-b" id="email" />

        <label htmlFor="country">Select Country</label>
        <select id="country" onChange={(e) => handleSelectCountry(e.target.value)}>
          {countryVisas.map((countryVisa) => (
            <option key={countryVisa._id} value={countryVisa._id}>
              {countryVisa._id}
            </option>
          ))}
        </select>

        <label htmlFor="visa">Select Permit</label>
        <select id="visa" onChange={(e) => setVisa(e.target.value)}>
          {visas?.map((visa) => (
            <option key={visa} value={visa}>
              {visa}
            </option>
          ))}
        </select>
        <div className="border flex flex-col gap-2 rounded-lg p-3">
          <label htmlFor="resume">Upload Resume</label>
          <input 
          type="file" 
          id="resume"
          onChange={(e) => setResume(e.target.files?.[0])}
           />
        </div>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}

export default App;
