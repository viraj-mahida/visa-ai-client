import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCountryVisas } from "../funcs/getCountryVisas";

export interface CountryVisa {
  _id: string; //country
  visas: string[];
}

interface CountryVisasProviderProps {
  children: ReactNode;
}

const VISAS_STORAGE_KEY = "countryVisas";

const getCountryVisasFromLocal = (): CountryVisa[] => { 
  const countryVisas = localStorage.getItem(VISAS_STORAGE_KEY);
  if (countryVisas) {
    return JSON.parse(countryVisas);
  } else return [];
};

const saveCountryVisasToLocal = (countryVisas: CountryVisa[]) => {
  localStorage.setItem(VISAS_STORAGE_KEY, JSON.stringify(countryVisas));
}

// eslint-disable-next-line react-refresh/only-export-components
export const CountryVisasContext = createContext<CountryVisa[] | undefined>(undefined);

export const CountryVisasProvider = ({ children }: CountryVisasProviderProps) => {
  const [countryVisas, setCountryVisas] = useState<CountryVisa[]>(() => getCountryVisasFromLocal());

  useEffect(() => {
    if (countryVisas.length === 0) {
      getCountryVisas().then((data) => {
        if (data) {
          setCountryVisas(data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(()=>{
    saveCountryVisasToLocal(countryVisas)
  }, [countryVisas])

  const contextValue = useMemo<CountryVisa[]>(
    () => countryVisas,
    [countryVisas]
  )

  return (
    <CountryVisasContext.Provider value={contextValue}>
      {children}
    </CountryVisasContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCountryVisas = (): CountryVisa[] => {
  const context = useContext(CountryVisasContext);

  if (context === undefined) {
    throw new Error("useCountryVisas must be used within a CountryVisasProvider")
  }

  return context;
}