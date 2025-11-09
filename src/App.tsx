import { useState } from "react";
import "./App.css";
import { useCountryVisas } from "./state/countryVisasContext.tsx";

function App() {
  const countryVisas = useCountryVisas();
  const [visas, setVisas] = useState<string[] | undefined>(undefined);

  const handleSelectCountry = (country: string) => {
    const countryVisa = countryVisas.find(cntry => cntry._id === country);

    if (countryVisa) {
      setVisas(countryVisa.visas);
    }
  }

  return (
    <main>
      <form className="flex flex-col gap-4">
        <label htmlFor="name">Full Name</label>
        <input type="text" className="border-b" id="name" />

        <label htmlFor="email">Email</label>
        <input type="text" className="border-b" id="email" />

        <select 
        name="country" 
        id="country"
        onChange={(e) => handleSelectCountry(e.target.value)}
        >
          {countryVisas.map((countryVisa) => (
            <option key={countryVisa._id} value={countryVisa._id}>
              {countryVisa._id}
            </option>
          ))}
        </select>

        <select name="visa" id="visa">
          {visas?.map((visa)=>(
            <option key={visa} value={visa}>
              {visa}
            </option>
          ))}
        </select>
      </form>
    </main>
  );
}

export default App;
