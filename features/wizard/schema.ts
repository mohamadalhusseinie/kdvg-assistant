import { z } from "zod";

export const cvEntrySchema = z.object({
  startDate: z.string().min(2, "Startdatum erforderlich (z. B. 03/2020 oder 2020)."),
  endDate: z.string().min(2, "Enddatum erforderlich (z. B. laufend oder 08/2024)."),
  title: z.string().min(2, "Tätigkeit/Funktion erforderlich."),
  organization: z.string().min(2, "Organisation/Arbeitgeber/Schule erforderlich."),
  description: z.string().min(5, "Kurzbeschreibung erforderlich."),
});

export const wizardSchema = z
  .object({
    birthYear: z.string().min(4, "Geburtsjahr erforderlich"),
    serviceStatus: z.enum(["ungedient", "wehrdienst", "reservist", "aktiv"]),
    mustered: z.enum(["ja", "nein", "unbekannt"]),

    fullName: z.string().min(5, "Vollständiger Name erforderlich"),
    street: z.string().min(5, "Straße + Hausnummer erforderlich"),
    postalCode: z.string().regex(/^[0-9]{5}$/u, "PLZ muss 5-stellig sein"),
    city: z.string().min(2, "Ort erforderlich"),
    birthDate: z.string().min(4, "Geburtsdatum erforderlich"),
    birthPlace: z.string().min(2, "Geburtsort erforderlich"),
    nationality: z.string().min(2, "Staatsangehörigkeit erforderlich"),

    conscienceBase: z.enum(["religiös", "ethisch", "humanistisch"]),
    conscienceSince: z.string().min(8, "Bitte Zeitpunkt und Auslöser angeben"),

    centralQuestion: z.string().min(30, "Bitte ausführlicher beschreiben"),
    rejectionAlways: z.enum(["ja", "nein"]),

    scenarioWeapon: z.string().min(20, "Bitte Szenario beantworten"),
    deadlyForceDefense: z.string().min(20, "Bitte Szenario beantworten"),
    irreversibleReason: z.string().min(20, "Bitte erläutern"),

    riskReasons: z
      .array(z.enum(["angstKrieg", "angstTod", "konkreterKrieg", "politischeAblehnung"]))
      .optional()
      .default([]),

    experiences: z.string().min(10, "Bitte Erfahrungen/Prägungen beschreiben"),
    changedView: z.enum(["ja", "nein"]),
    changedViewDetails: z.string().optional().default(""),

    cvEntries: z.array(cvEntrySchema).min(1, "Mindestens ein Lebenslauf-Eintrag ist erforderlich."),

    idCopyConfirmed: z
      .boolean()
      .default(false)
      .refine((v) => v === true, {
        message:
          "Bitte bestätigen Sie, dass Sie eine Kopie des Personalausweises oder der Geburtsurkunde beilegen.",
      }),

    consentNoSubmission: z
      .boolean()
      .default(false)
      .refine((v) => v === true, {
        message: "Bitte bestätigen (kein Versand/keine Rechtsberatung).",
      }),

    truthConfirmed: z
      .boolean()
      .default(false)
      .refine((v) => v === true, {
        message: "Bitte bestätigen (wahrheitsgemäß/eigenverantwortlich).",
      }),

    signatureCity: z.string().min(2, "Ort erforderlich"),
  })
  .superRefine((value, ctx) => {
    if (value.changedView === "ja" && !value.changedViewDetails?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Bitte beschreiben Sie die Veränderung Ihrer Haltung.",
        path: ["changedViewDetails"],
      });
    }
  });

export type WizardFormValues = z.input<typeof wizardSchema>;
