import type { WizardFormValues } from "./schema";
import type { ApplicationData, CvEntry } from "@/lib/pdf/generate";

function splitName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

function cvTextToEntries(cvText: string): CvEntry[] {
    const t = cvText.trim();
    if (!t) return [];
    // MVP: keep whole text as one entry
    return [
        {
            startDate: "",
            endDate: "",
            title: "Lebenslauf (Freitext)",
            organization: "",
            description: t,
        },
    ];
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
            // authorities differ; keep it generic
            unitOrOffice: "Zuständiges Karrierecenter der Bundeswehr",
            referenceNumber: "",
            pendingDeadlines: "",
            obligations: `Status: ${values.serviceStatus}, Musterung: ${values.mustered}, Geburtsjahr: ${values.birthYear}`,
        },
        conscience: {
            conscienceOrigin: `Grundlage: ${values.conscienceBase}\n\nSeit wann: ${values.conscienceSince}\n\nPrägungen: ${values.experiences}${
                values.changedView === "ja" ? `\n\nVeränderung: ${values.changedViewDetails}` : ""
            }`,
            moralConflict: values.centralQuestion,
            actionsTaken: `Konfliktszenario (Befehl zum Waffeneinsatz):\n${values.scenarioWeapon}\n\nTödliche Gewalt für staatliche Interessen:\n${values.deadlyForceDefense}\n\nUnumkehrbar:\n${values.irreversibleReason}`,
            refusalScope:
                values.rejectionAlways === "ja"
                    ? "Die Verweigerung gilt unabhängig von Gegner, Konflikt oder Umständen."
                    : "Hinweis: Die Verweigerung ist nicht universell formuliert (erhöhtes Ablehnungsrisiko).",
        },
        cv: cvTextToEntries(values.cvText),
        consentConfirmed: true,
    };
}