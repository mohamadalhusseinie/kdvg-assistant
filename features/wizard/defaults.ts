import type { WizardFormValues } from "./schema";

export const defaultValues: WizardFormValues = {
  birthYear: "",
  serviceStatus: "ungedient",
  mustered: "nein",

  fullName: "",
  street: "",
  postalCode: "",
  city: "",
  birthDate: "",
  birthPlace: "",
  nationality: "",

  conscienceBase: "ethisch",
  conscienceSince: "",

  centralQuestion: "",
  rejectionAlways: "ja",

  scenarioWeapon: "",
  deadlyForceDefense: "",
  irreversibleReason: "",

  riskReasons: [],
  experiences: "",
  changedView: "nein",
  changedViewDetails: "",

  cvEntries: [
    {
      startDate: "",
      endDate: "laufend",
      title: "",
      organization: "",
      description: "",
    },
  ],
  consentNoSubmission: true,
  truthConfirmed: true,
  signatureCity: "",
};
