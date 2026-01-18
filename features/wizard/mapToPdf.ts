import type { WizardFormValues } from "./schema";
import type { ApplicationData, CvEntry } from "@/lib/pdf/generate";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
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

function formatRiskReasons(
  riskReasons?: Array<"angstKrieg" | "angstTod" | "konkreterKrieg" | "politischeAblehnung">,
) {
  const map: Record<string, string> = {
    angstKrieg: "Angst vor Krieg",
    angstTod: "Angst vor Tod oder Verletzung",
    konkreterKrieg: "Ablehnung eines konkreten Krieges",
    politischeAblehnung: "Politische Ablehnung eines Staates",
  };

  const list = (riskReasons ?? []).map((r) => map[r] ?? r);
  if (list.length === 0) return "Keine (oder nicht angegeben).";
  return list.map((x) => `- ${x}`).join("\n");
}

export function mapToPdfApplicationData(values: WizardFormValues): ApplicationData {
  const { firstName, lastName } = splitName(values.fullName);

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
      conscienceOrigin: `Grundlage: ${values.conscienceBase}

Entstehung / seit wann (Zeitpunkt + Auslöser):
${values.conscienceSince}

Prägungen / Erfahrungen:
${values.experiences}${
        values.changedView === "ja"
          ? `

Veränderung der Haltung:
${values.changedViewDetails}`
          : ""
      }

Abgrenzung (nicht ausreichende Motive, falls zutreffend):
${formatRiskReasons(values.riskReasons)}`,

      moralConflict: values.centralQuestion,

      actionsTaken: `Konfliktszenario (Befehl zum Waffeneinsatz):
${values.scenarioWeapon}

Tödliche Gewalt zur Verteidigung staatlicher Interessen:
${values.deadlyForceDefense}

Unumkehrbarkeit:
${values.irreversibleReason}`,

      refusalScope:
        values.rejectionAlways === "ja"
          ? "Die Verweigerung gilt unabhängig von Gegner, Konflikt oder Umständen."
          : "Hinweis: Die Verweigerung ist nicht universell formuliert (erhöhtes Ablehnungsrisiko).",
    },

    cv: mapCvEntries(values),

    consentConfirmed: true,
  };
}
