import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { CountryVisasProvider } from "./state/countryVisasContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CountryVisasProvider>
      <App />
      <Toaster />
    </CountryVisasProvider>
  </StrictMode>
);
