import { api } from "../config/axios"

interface EvaluateScoreProps {
  resume: File,
  country: string,
  visa: string
}

export const evaluateScore = async ({ resume, country, visa }: EvaluateScoreProps) => {
  const formData = new FormData();
  formData.append("file", resume);
  formData.append("country", country);
  formData.append("visa", visa);

  const response = await api.post("/ai-evaluate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.evaluation;
}