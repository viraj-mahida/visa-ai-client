export interface SubEvaluation {
  subScore: number;
  subScoreJustification: string;
  summary: string;
  supportingMaterial: string;
  improvementNeeded: string;
  recommendation: string;
}

export interface Conclusion {
  KeyStepsToStrengthenYourCase: string;
  FocusAreasToBoostYourApplication: string;
  TakeImmediateActionForSuccess: string;
}

export interface CriteriaAnalysis {
  recognizedPrizeOrAwards: SubEvaluation;
  membershipInRecognizedAssociations: SubEvaluation;
  originalContributionsToTheField: SubEvaluation;
  EmploymentInCriticalCapacity: SubEvaluation;
  HighSalaryOrRemuneration: SubEvaluation;
  PublishedMaterialOrMediaAboutTheBeneficiary: SubEvaluation;
  AuthorshipOfScholarlyArticles: SubEvaluation;
  JudgingParticipationInTheField: SubEvaluation;
}

export interface EvaluationResult {
  ChancesOfSuccess: number;
  overview: string;
  conclusion: Conclusion;
  CriteriaAnalysis: CriteriaAnalysis;
}

export type CriteriaKey = keyof CriteriaAnalysis;

export const CRITERIA_LABELS: Record<CriteriaKey, string> = {
  recognizedPrizeOrAwards: "Recognized Prizes or Awards",
  membershipInRecognizedAssociations: "Membership in Recognized Associations",
  originalContributionsToTheField: "Original Contributions to the Field",
  EmploymentInCriticalCapacity: "Employment in Critical Capacity",
  HighSalaryOrRemuneration: "High Salary or Remuneration",
  PublishedMaterialOrMediaAboutTheBeneficiary:
    "Published Material or Media About the Beneficiary",
  AuthorshipOfScholarlyArticles: "Authorship of Scholarly Articles",
  JudgingParticipationInTheField: "Judging Participation in the Field",
};

export const CRITERIA_ORDER: CriteriaKey[] = [
  "recognizedPrizeOrAwards",
  "membershipInRecognizedAssociations",
  "originalContributionsToTheField",
  "EmploymentInCriticalCapacity",
  "HighSalaryOrRemuneration",
  "PublishedMaterialOrMediaAboutTheBeneficiary",
  "AuthorshipOfScholarlyArticles",
  "JudgingParticipationInTheField",
];

