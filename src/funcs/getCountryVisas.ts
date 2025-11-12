import toast from "react-hot-toast";
import { api } from "../config/axios.ts";
import { type CountryVisa } from "../state/countryVisasContext.tsx";

export const getCountryVisas = async () => {
  try {
    const response = await api.get("/country-visas");
    return response.data as CountryVisa[];
  } catch {
    toast.error("Error getting countries with visa!");
  }
};