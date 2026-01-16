"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { LegalDisclaimer } from "@/components/wizard/disclaimer";

type FormValues = {
  birthYear: string
  serviceStatus: "ungedient" | "wehrdienst" | "reservist" | "aktiv"
  mustered: "ja" | "nein" | "unbekannt"
  fullName: string
  address: string
  birthDate: string
  birthPlace: string
  nationality: string
  conscienceBase: "religioes" | "ethisch" | "humanistisch"
  conscienceSince: string
  centralQuestion: string
  rejectionAlways: "ja" | "nein"
  scenarioWeapon: string
  deadlyForceDefense: string
  irreversibleReason: string
  riskReasons: typeof reasonOptions[number]["value"][]
  experiences: string
  changedView: "ja" | "nein"
  changedViewDetails: string
  affirmation: boolean
  signatureCity: string
}

const wizardSchema: z.ZodType<FormValues> = z
  .object({
    birthYear: z.string().min(4, "Geburtsjahr erforderlich"),
    serviceStatus: z.enum(["ungedient", "wehrdienst", "reservist", "aktiv"]),
    mustered: z.enum(["ja", "nein", "unbekannt"]),
    fullName: z.string().min(5, "Vollständiger Name erforderlich"),
    address: z.string().min(5, "Aktuelle Anschrift erforderlich"),
    birthDate: z.string().min(4, "Geburtsdatum erforderlich"),
    birthPlace: z.string().min(2, "Geburtsort erforderlich"),
    nationality: z.string().min(2, "Staatsangehörigkeit erforderlich"),
    conscienceBase: z.enum(["religioes", "ethisch", "humanistisch"]),
    conscienceSince: z.string().min(8, "Bitte Zeitpunkt und Auslöser angeben"),
    centralQuestion: z
      .string()
      .min(
        30,
        "Bitte beschreiben Sie ausführlich, warum Sie nicht am Töten mitwirken können.",
      ),
    rejectionAlways: z.enum(["ja", "nein"]),
    scenarioWeapon: z
      .string()
      .min(20, "Bitte skizzieren Sie Ihr Verhalten bei einem Befehl zum Waffengebrauch."),
    deadlyForceDefense: z
      .string()
      .min(20, "Bitte beschreiben Sie Ihre Haltung zu tödlicher Gewalt für staatliche Interessen."),
    irreversibleReason: z
      .string()
      .min(20, "Bitte erläutern Sie, warum Ihre Haltung unumkehrbar ist."),
    riskReasons: z
      .array(z.enum(["angstKrieg", "angstTod", "konkreterKrieg", "politischeAblehnung"]))
      .default([]),
    experiences: z.string().min(10, "Bitte Erfahrungen oder Prägungen beschreiben."),
    changedView: z.enum(["ja", "nein"]),
    changedViewDetails: z.string().default(""),
    affirmation: z.boolean().refine((val) => val === true, {
      message:
        "Bitte bestätigen Sie die Erklärung zur Kriegsdienstverweigerung und Eigenverantwortung.",
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

type WizardStep = {
  id: string;
  label: string;
  description?: string;
  fields: (keyof FormValues)[];
};

const steps: WizardStep[] = [
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
    fields: ["fullName", "address", "birthDate", "birthPlace", "nationality"],
  },
  {
    id: "conscience-base",
    label: "Gewissensgrundlage",
    description: "Kern Ihrer Gewissensüberzeugung",
    fields: ["conscienceBase", "conscienceSince"],
  },
  {
    id: "central",
    label: "Zentrale Gewissensfrage",
    description: "Warum Sie nicht am Töten mitwirken können",
    fields: ["centralQuestion", "rejectionAlways"],
  },
  {
    id: "scenarios",
    label: "Konfliktszenarien",
    description: "Konkrete Situationen zur Plausibilisierung",
    fields: ["scenarioWeapon", "deadlyForceDefense", "irreversibleReason"],
  },
  {
    id: "boundaries",
    label: "Abgrenzung",
    description: "Nicht ausreichende Motive transparent machen",
    fields: ["riskReasons"],
  },
  {
    id: "development",
    label: "Persönliche Entwicklung",
    description: "Biografische Prägungen und Veränderungen",
    fields: ["experiences", "changedView", "changedViewDetails"],
  },
  {
    id: "affirmation",
    label: "Verantwortung & Erklärung",
    description: "Abschließende Bestätigung und Unterschriftszeile",
    fields: ["affirmation", "signatureCity"],
  },
];

const defaultValues: FormValues = {
  birthYear: "",
  serviceStatus: "ungedient",
  mustered: "nein",
  fullName: "",
  address: "",
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
  affirmation: false,
  signatureCity: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const methods = useForm<FormValues>({
    resolver: zodResolver<FormValues>(wizardSchema),
    defaultValues,
    mode: "onBlur",
  });

  const currentStep = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  const handleNext = async () => {
    const valid = await methods.trigger(currentStep.fields as (keyof FormValues)[], {
      shouldFocus: true,
    });
    if (valid) {
      setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
    }
  };

  const handlePrev = () => setStepIndex((idx) => Math.max(idx - 1, 0));

  const onSubmit = methods.handleSubmit((data) => {
    setSubmittedData(data);
  });

  return (
    <div className="bg-muted/40 min-h-screen">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Kriegsdienstverweigerung · Art. 4 Abs. 3 GG
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Schritt-für-Schritt Assistent (rechtssicher)
          </h1>
          <p className="text-muted-foreground text-base">
            Beantworten Sie die Kernfragen. Ihre Eingaben werden ausschließlich im Browser verarbeitet; es findet keine Übermittlung statt.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="h-2 overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              role="progressbar"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Schritt {stepIndex + 1} von {steps.length}: {currentStep.label}
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
          <Card>
            <CardHeader>
              <CardTitle>{currentStep.label}</CardTitle>
              {currentStep.description ? (
                <CardDescription>{currentStep.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {currentStep.id === "status" && (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="birthYear">
                      Geburtsjahr
                    </label>
                    <Input
                      id="birthYear"
                      inputMode="numeric"
                      placeholder="z. B. 1995"
                      {...methods.register("birthYear")}
                    />
                    <FieldError message={methods.formState.errors.birthYear?.message} />
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Haben Sie bereits Wehrdienst geleistet?</p>
                    <Controller
                      control={methods.control}
                      name="serviceStatus"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-3 md:grid-cols-2"
                        >
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="ungedient" />
                            <span>Nein, ungedient</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="wehrdienst" />
                            <span>Ja, Wehrdienst</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="reservist" />
                            <span>Ja, Reservist</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="aktiv" />
                            <span>Ja, aktiver Soldat</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                    <FieldError message={methods.formState.errors.serviceStatus?.message} />
                  </div>

                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Wurden Sie bereits gemustert?</p>
                    <Controller
                      control={methods.control}
                      name="mustered"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-3 sm:grid-cols-3"
                        >
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="ja" />
                            <span>Ja</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="nein" />
                            <span>Nein</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="unbekannt" />
                            <span>Weiß ich nicht</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                    <FieldError message={methods.formState.errors.mustered?.message} />
                  </div>
                </div>
              )}

              {currentStep.id === "personal" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="fullName">
                      Vollständiger Name
                    </label>
                    <Input id="fullName" placeholder="Vorname Nachname" {...methods.register("fullName")} />
                    <FieldError message={methods.formState.errors.fullName?.message} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="address">
                      Aktuelle Anschrift
                    </label>
                    <Input id="address" placeholder="Straße Hausnummer, PLZ Ort" {...methods.register("address")} />
                    <FieldError message={methods.formState.errors.address?.message} />
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium" htmlFor="birthDate">
                        Geburtsdatum
                      </label>
                      <Input id="birthDate" placeholder="TT.MM.JJJJ" {...methods.register("birthDate")} />
                      <FieldError message={methods.formState.errors.birthDate?.message} />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium" htmlFor="birthPlace">
                        Geburtsort
                      </label>
                      <Input id="birthPlace" placeholder="Ort" {...methods.register("birthPlace")} />
                      <FieldError message={methods.formState.errors.birthPlace?.message} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="nationality">
                      Staatsangehörigkeit
                    </label>
                    <Input id="nationality" placeholder="z. B. Deutsch" {...methods.register("nationality")} />
                    <FieldError message={methods.formState.errors.nationality?.message} />
                  </div>
                </div>
              )}

              {currentStep.id === "conscience-base" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Welche Grundlage trifft auf Sie am ehesten zu?</p>
                    <Controller
                      control={methods.control}
                      name="conscienceBase"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-3 md:grid-cols-3"
                        >
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="religioes" />
                            <span>religiöse Gewissensentscheidung</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="ethisch" />
                            <span>ethisch-moralische Gewissensentscheidung</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="humanistisch" />
                            <span>humanistisch / weltanschaulich</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                    <FieldError message={methods.formState.errors.conscienceBase?.message} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="conscienceSince">
                      Seit wann besteht diese Gewissensüberzeugung? (Zeitpunkt + Auslöser)
                    </label>
                    <Textarea
                      id="conscienceSince"
                      minLength={8}
                      placeholder="Bitte kurz beschreiben"
                      {...methods.register("conscienceSince")}
                    />
                    <FieldError message={methods.formState.errors.conscienceSince?.message} />
                  </div>
                </div>
              )}

              {currentStep.id === "central" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="centralQuestion">
                      Warum können Sie persönlich nicht am Töten von Menschen mitwirken, auch nicht indirekt?
                    </label>
                    <Textarea
                      id="centralQuestion"
                      placeholder="Bitte Gewissenskonflikt ohne politische Argumente beschreiben"
                      {...methods.register("centralQuestion")}
                    />
                    <FieldError message={methods.formState.errors.centralQuestion?.message} />
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">
                      Gilt diese Ablehnung unabhängig davon, wer der Gegner ist, in welchem Krieg und unter welchen Umständen?
                    </p>
                    <Controller
                      control={methods.control}
                      name="rejectionAlways"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="ja" />
                            <span>Ja</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="nein" />
                            <span>Nein (hohes Ablehnungsrisiko)</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                    <FieldError message={methods.formState.errors.rejectionAlways?.message} />
                  </div>
                </div>
              )}

              {currentStep.id === "scenarios" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="scenarioWeapon">
                      Wie würden Sie handeln, wenn Ihnen befohlen würde, eine Waffe zu benutzen, um einen anderen Menschen zu verletzen oder zu töten?
                    </label>
                    <Textarea id="scenarioWeapon" {...methods.register("scenarioWeapon")} />
                    <FieldError message={methods.formState.errors.scenarioWeapon?.message} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="deadlyForceDefense">
                      Wie stehen Sie zur Anwendung tödlicher Gewalt zur Verteidigung staatlicher Interessen?
                    </label>
                    <Textarea id="deadlyForceDefense" {...methods.register("deadlyForceDefense")} />
                    <FieldError message={methods.formState.errors.deadlyForceDefense?.message} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="irreversibleReason">
                      Können Sie erklären, warum diese Haltung für Sie unumkehrbar ist?
                    </label>
                    <Textarea id="irreversibleReason" {...methods.register("irreversibleReason")} />
                    <FieldError message={methods.formState.errors.irreversibleReason?.message} />
                  </div>
                </div>
              )}

              {currentStep.id === "boundaries" && (
                <div className="grid gap-3">
                  <p className="text-sm font-medium">Trifft einer der folgenden Gründe auf Sie zu? (Mehrfachauswahl möglich)</p>
                  <Controller
                    control={methods.control}
                    name="riskReasons"
                    render={({ field }) => (
                       <div className="grid gap-2">
                        {reasonOptions.map((item) => {
                          const value = field.value ?? []
                          const isChecked = value.includes(item.value)
                          return (
                            <label
                              key={item.value}
                              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs"
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const next = new Set(value)
                                  if (checked === true) {
                                    next.add(item.value)
                                  } else {
                                    next.delete(item.value)
                                  }
                                  field.onChange(Array.from(next))
                                }}
                              />
                              <span>{item.label}</span>
                            </label>
                          )
                        })}
                       </div>
                     )}
                   />

                   <p className="text-sm text-amber-800">
                     Diese Gründe allein reichen nicht für eine Anerkennung aus.
                   </p>
                </div>
              )}

              {currentStep.id === "development" && (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Hat sich Ihre Sichtweise auf den Kriegsdienst im Laufe der Zeit verändert?</p>
                    <Controller
                      control={methods.control}
                      name="changedView"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="ja" />
                            <span>Ja</span>
                          </label>
                          <label className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                            <RadioGroupItem value="nein" />
                            <span>Nein</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                    <FieldError message={methods.formState.errors.changedView?.message} />
                  </div>

                  {methods.watch("changedView") === "ja" && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium" htmlFor="changedViewDetails">
                        Bitte erläutern Sie kurz, wie sich Ihre Sichtweise verändert hat:
                      </label>
                      <Textarea
                        id="changedViewDetails"
                        placeholder="Ihre Antwort"
                        {...methods.register("changedViewDetails")}
                      />
                      <FieldError message={methods.formState.errors.changedViewDetails?.message} />
                    </div>
                  )}
                </div>
              )}

              {currentStep.id === "affirmation" && (
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <LegalDisclaimer />
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">
                      Ich bestätige hiermit, dass ich die obigen Angaben nach bestem Wissen und Gewissen gemacht habe und dass ich die{" "}
                      <a
                        href="https://www.gesetze-im-internet.de/gg/art_4.html"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Informationen zur Kriegsdienstverweigerung
                      </a>{" "}
                      zur Kenntnis genommen habe.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <label className="flex items-center gap-3">
                      <Controller
                        control={methods.control}
                        name="affirmation"
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 rounded-md border bg-card"
                          />
                        )}
                      />
                      <span className="text-sm font-medium">
                        Ich bestätige die Richtigkeit der Angaben und die Kenntnisnahme der Informationen.
                      </span>
                    </label>
                    <FieldError message={methods.formState.errors.affirmation?.message} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="signatureCity">
                      Ort der Unterschrift
                    </label>
                    <Input id="signatureCity" placeholder="Ort" {...methods.register("signatureCity")} />
                    <FieldError message={methods.formState.errors.signatureCity?.message} />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex w-full items-center justify-between gap-3">
                <Button variant="outline" type="button" onClick={handlePrev} disabled={stepIndex === 0}>
                  Zurück
                </Button>
                {stepIndex < steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Weiter
                  </Button>
                ) : (
                  <Button type="submit">Fertigstellen</Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>

        {submittedData && (
          <pre className="mt-8 rounded-lg bg-muted p-4 text-sm">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}

const reasonOptions = [
  { value: "angstKrieg", label: "Angst vor Krieg" },
  { value: "angstTod", label: "Angst vor Tod oder Verletzung" },
  { value: "konkreterKrieg", label: "Ablehnung eines konkreten Krieges" },
  { value: "politischeAblehnung", label: "Politische Ablehnung eines Staates" },
] as const;