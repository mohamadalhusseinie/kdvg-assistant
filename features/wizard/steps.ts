import type { WizardFormValues } from "./schema";

export const reasonOptions: { value: RiskReason; label: string }[] = [
  { value: "angstKrieg", label: "Angst vor Krieg" },
  { value: "angstTod", label: "Angst vor Tod oder Verletzung" },
  { value: "konkreterKrieg", label: "Ablehnung eines konkreten Krieges" },
  { value: "politischeAblehnung", label: "Politische Ablehnung eines Staates" },
];

export type RiskReason = "angstKrieg" | "angstTod" | "konkreterKrieg" | "politischeAblehnung";

export type WizardStep = {
  id: "status" | "personal" | "conscience" | "cv" | "review";
  label: string;
  description?: string;
  fields: (keyof WizardFormValues)[];
};

export const steps: WizardStep[] = [
  {
    id: "status",
    label: "Status & Einordnung",
    description: "Grunddaten für die Einordnung Ihrer Situation",
    fields: ["birthYear", "serviceStatus", "mustered"],
  },
  {
    id: "personal",
    label: "Persönliche Angaben",
    description: "Diese Angaben fließen 1:1 in das Anschreiben ein",
    fields: ["fullName", "street", "postalCode", "city", "birthDate", "birthPlace", "nationality"],
  },
  {
    id: "conscience",
    label: "Gewissensbegründung",
    description: "Kernfragen, Szenarien, Abgrenzung und Bestätigung",
    fields: [
      "conscienceBase",
      "conscienceSince",
      "centralQuestion",
      "rejectionAlways",
      "scenarioWeapon",
      "deadlyForceDefense",
      "irreversibleReason",
      "riskReasons",
      "experiences",
      "changedView",
      "changedViewDetails",
      "consentNoSubmission",
      "truthConfirmed",
      "signatureCity",
    ],
  },
  {
    id: "cv",
    label: "Lebenslauf",
    description: "Tabellarischer Lebenslauf (mindestens ein Eintrag erforderlich)",
    fields: ["cvEntries"],
  },
  {
    id: "review",
    label: "Review & Download",
    description: "Finaler Check. Dann PDF herunterladen.",
    fields: [],
  },
];
