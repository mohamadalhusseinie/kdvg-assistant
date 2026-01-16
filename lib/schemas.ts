import { z } from "zod";

export const cvEntrySchema = z.object({
  title: z.string().min(2, "Bitte geben Sie eine Funktion oder Tätigkeit an."),
  organization: z
    .string()
    .min(2, "Bitte nennen Sie die Organisation, Arbeitgeberin oder Institution."),
  startDate: z
    .string()
    .min(4, "Bitte Startdatum angeben (z. B. 03/2020 oder 2020)."),
  endDate: z
    .string()
    .min(2, "Bitte Enddatum angeben (z. B. laufend oder 08/2024)."),
  description: z
    .string()
    .min(5, "Bitte eine kurze Aufgabenbeschreibung ergänzen."),
});

export const personalSchema = z.object({
  salutation: z.enum(["Herr", "Frau", "Divers", "Keine Angabe"]),
  firstName: z.string().min(2, "Vorname fehlt."),
  lastName: z.string().min(2, "Nachname fehlt."),
  dateOfBirth: z.string().min(4, "Geburtsdatum fehlt."),
  placeOfBirth: z.string().min(2, "Geburtsort fehlt."),
  street: z.string().min(5, "Straße und Hausnummer fehlen."),
  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/u, "Bitte eine fünfstellige Postleitzahl angeben."),
  city: z.string().min(2, "Ort fehlt."),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse angeben."),
  phone: z.string().min(5, "Telefonnummer fehlt."),
  nationality: z.string().min(2, "Staatsangehörigkeit fehlt."),
});

export const serviceSchema = z.object({
  status: z.enum([
    "Noch kein Bescheid",
    "Musterung / Tauglichkeitsfeststellung",
    "Einberufung erhalten",
    "Reservistendienst",
  ]),
  unitOrOffice: z
    .string()
    .min(3, "Bitte zuständige Stelle oder Einheit benennen."),
  referenceNumber: z.string().optional().default(""),
  pendingDeadlines: z.string().optional().default(""),
  obligations: z
    .string()
    .min(5, "Bitte Ihren aktuellen Status kurz skizzieren."),
});

export const conscienceSchema = z.object({
  conscienceOrigin: z
    .string()
    .min(
      30,
      "Bitte beschreiben Sie, wie Ihr Gewissenskonflikt entstanden ist (mindestens 30 Zeichen).",
    ),
  moralConflict: z
    .string()
    .min(
      30,
      "Bitte schildern Sie, warum Waffengewalt für Sie nicht vereinbar ist (mindestens 30 Zeichen).",
    ),
  actionsTaken: z
    .string()
    .min(10, "Bitte beschreiben Sie praktische Schritte oder Engagement."),
  refusalScope: z
    .string()
    .min(10, "Bitte beschreiben Sie, welche Handlungen Sie ablehnen."),
});

export const applicationSchema = z.object({
  personal: personalSchema,
  service: serviceSchema,
  conscience: conscienceSchema,
  cv: z.array(cvEntrySchema).min(1, "Mindestens ein CV-Eintrag ist erforderlich."),
  consentConfirmed: z.literal(true, {
    message:
      "Bitte bestätigen Sie, dass die Anwendung keine Dokumente versendet und keinen Rechtsbeistand leistet.",
  }),
});

export type CvEntry = z.infer<typeof cvEntrySchema>;
export type PersonalData = z.infer<typeof personalSchema>;
export type ServiceData = z.infer<typeof serviceSchema>;
export type ConscienceData = z.infer<typeof conscienceSchema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

export const defaultApplicationData: ApplicationData = {
  personal: {
    salutation: "Keine Angabe",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    street: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
    nationality: "",
  },
  service: {
    status: "Noch kein Bescheid",
    unitOrOffice: "",
    referenceNumber: "",
    pendingDeadlines: "",
    obligations: "",
  },
  conscience: {
    conscienceOrigin: "",
    moralConflict: "",
    actionsTaken: "",
    refusalScope: "",
  },
  cv: [
    {
      title: "Aktuelle Tätigkeit",
      organization: "",
      startDate: "",
      endDate: "laufend",
      description: "",
    },
  ],
  consentConfirmed: true,
};