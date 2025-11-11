import { api } from "../config/axios";
import type { EvaluationResult } from "../types/evaluation";

interface EvaluateScoreProps {
  name: string;
  email: string;
  resume: File;
  country: string;
  visa: string;
}

export const evaluateScore = async ({
  name,
  email,
  resume,
  country,
  visa,
}: EvaluateScoreProps): Promise<EvaluationResult> => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("file", resume);
  formData.append("country", country);
  formData.append("visa", visa);

  const response = await api.post<{ evaluation: EvaluationResult }>(
    "/ai-evaluate",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.evaluation;
};