import type { WizardFormValues } from "./schema";
import type { ApplicationData, CvEntry } from "@/lib/pdf/generate";
import { RiskReason } from "@/features/wizard/steps";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function mapCvEntries(values: WizardFormValues): CvEntry[] {
  const entries = values.cvEntries ?? [];
  return entries.map((e) => ({
    startDate: e.startDate.trim(),
    endDate: e.endDate.trim(),
    title: e.title.trim(),
    organization: e.organization.trim(),
    description: e.description.trim(),
  }));
}

function formatConscienceBase(base: WizardFormValues["conscienceBase"]) {
  switch (base) {
    case "religiös":
      return "religiös";
    case "ethisch":
      return "ethisch-moralisch";
    case "humanistisch":
      return "humanistisch / weltanschaulich";
    default:
      return String(base);
  }
}

function formatRiskReasonsAsAbgrenzung(riskReasons?: RiskReason[]) {
  const map: Record<RiskReason, string> = {
    angstKrieg: "Angst vor Krieg",
    angstTod: "Angst vor Tod oder Verletzung",
    konkreterKrieg: "Ablehnung eines konkreten (einzelnen) Krieges",
    politischeAblehnung: "politische Ablehnung eines Staates / einer Regierung",
  };

  const list = (riskReasons ?? []).map((r) => map[r]).filter(Boolean);

  if (list.length === 0) return "";

  return [
    "Mir ist bewusst, dass folgende Aspekte für sich genommen keine Gewissensentscheidung ersetzen. Sie sind nicht der Kern meiner Verweigerung:",
    ...list.map((x) => `- ${x}`),
  ].join("\n\n");
}

function joinParagraphs(...parts: Array<string | undefined>) {
  return parts
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join("\n\n");
}

export function mapToPdfApplicationData(values: WizardFormValues): ApplicationData {
  const { firstName, lastName } = splitName(values.fullName);

  const abgrenzung = formatRiskReasonsAsAbgrenzung(values.riskReasons);

  // Better structured text blocks for the PDF generator
  const conscienceOrigin = joinParagraphs(
    `Meine Gewissensentscheidung ist ${formatConscienceBase(values.conscienceBase)} begründet.`,
    values.conscienceSince ? `Entstehung / seit wann:\n${values.conscienceSince}` : undefined,
    values.experiences ? `Prägungen / Erfahrungen:\n${values.experiences}` : undefined,
    values.changedView === "ja" && values.changedViewDetails?.trim()
      ? `Entwicklung meiner Haltung:\n${values.changedViewDetails}`
      : undefined,
    abgrenzung ? abgrenzung : undefined,
  );

  const moralConflict = joinParagraphs(
    values.centralQuestion,
    values.rejectionAlways === "ja"
      ? "Diese Ablehnung gilt unabhängig davon, wer der Gegner ist, in welchem Konflikt und unter welchen Umständen."
      : "Meine Ablehnung ist nicht universell formuliert. Mir ist bewusst, dass dies die Anerkennung erschweren kann.",
  );

  const actionsTaken = joinParagraphs(
    values.scenarioWeapon ? `Befehl zum Waffeneinsatz:\n${values.scenarioWeapon}` : undefined,
    values.deadlyForceDefense
      ? `Tödliche Gewalt zur Verteidigung staatlicher Interessen:\n${values.deadlyForceDefense}`
      : undefined,
    values.irreversibleReason
      ? `Warum diese Haltung für mich unumkehrbar ist:\n${values.irreversibleReason}`
      : undefined,
  );

  // This field in your pdf generator is currently used as a section.
  // Use it as a short “what I refuse” statement (clean and non-technical).
  const refusalScope = joinParagraphs(
    "Ich kann nicht an Handlungen mitwirken, die darauf gerichtet sind, Menschen mit Waffen zu verletzen oder zu töten – auch nicht durch Ausbildung, Vorbereitung oder Unterstützung solcher Handlungen.",
  );

  return {
    personal: {
      firstName,
      lastName,
      dateOfBirth: values.birthDate,
      placeOfBirth: values.birthPlace,
      street: values.street,
      postalCode: values.postalCode,
      city: values.city,
      nationality: values.nationality,
      email: "",
      phone: "",
    },
    service: {
      status: values.serviceStatus,
      unitOrOffice: "",
      referenceNumber: "",
      pendingDeadlines: "",
      obligations: `Status: ${values.serviceStatus}, Musterung: ${values.mustered}, Geburtsjahr: ${values.birthYear}`,
    },
    conscience: {
      conscienceOrigin,
      moralConflict,
      actionsTaken,
      refusalScope,
    },

    cv: mapCvEntries(values),

    consentConfirmed: true,
  };
}