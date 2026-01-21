"use client";

import type { UseFormReturn } from "react-hook-form";
import type { WizardFormValues } from "@/features/wizard/schema";
import { reasonOptions, RiskReason } from "@/features/wizard/steps";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function labelForReason(value: RiskReason) {
  return reasonOptions.find((o) => o.value === value)?.label ?? value;
}

function yesNo(v: string) {
  return v === "ja" ? "Ja" : "Nein";
}

function Line({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium text-foreground sm:text-right">
        {value && value.trim() ? value : "—"}
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  );
}

export function StepReview({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
  const v = methods.getValues();

  const riskReasons = v.riskReasons ?? [];
  const hasRiskReasons = riskReasons.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Prüfen Sie Ihre Angaben kurz. Der Download erzeugt{" "}
        <span className="font-medium">3 PDFs</span> (Anschreiben, Begründung, Lebenslauf) in einem
        Bundle. Die Kopie von Ausweis/Geburtsurkunde fügen Sie separat bei.
      </p>

      <div className="rounded-lg border bg-card p-3 text-sm">
        <p className="font-medium">Einreichung:</p>
        <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
          Bundesamt für das Personalmanagement der Bundeswehr{"\n"}
          Abt. II ZA Wehrersatz{"\n"}
          Militärringstraße 1000{"\n"}
          50737 Köln
        </p>
      </div>

      {hasRiskReasons && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">Hinweis zur Abgrenzung</p>
          <p className="mt-1">
            Sie haben Gründe markiert, die <span className="font-semibold">allein</span> nicht als
            Gewissensbegründung ausreichen. Das ist okay – aber Ihre Begründung muss klar auf
            Gewissensgründe fokussieren.
          </p>
          <ul className="mt-2 list-disc pl-5">
            {riskReasons.map((r) => (
              <li key={r}>{labelForReason(r)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Status & Einordnung">
          <Line label="Geburtsjahr" value={v.birthYear} />
          <Line label="Wehrdienst-Status" value={v.serviceStatus} />
          <Line label="Bereits gemustert" value={yesNo(v.mustered)} />
        </Block>

        <Block title="Persönliche Angaben">
          <Line label="Name" value={v.fullName} />
          <Line label="Geburtsdatum" value={v.birthDate} />
          <Line label="Geburtsort" value={v.birthPlace} />
          <Line label="Staatsangehörigkeit" value={v.nationality} />
          <Separator />
          <Line label="Adresse" value={`${v.street}, ${v.postalCode} ${v.city}`} />
        </Block>
      </div>

      <Block title="Gewissensbegründung">
        <Line label="Grundlage" value={v.conscienceBase} />
        <Line label="Ablehnung gilt immer" value={yesNo(v.rejectionAlways)} />
        <Line label="Ort/Datum (Unterschrift)" value={`${v.signatureCity}`} />

        <Separator />

        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">Seit wann / Auslöser</div>
          <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {v.conscienceSince?.trim() || "—"}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">Zentrale Gewissensfrage</div>
          <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {v.centralQuestion?.trim() || "—"}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">Prägungen / Erfahrungen</div>
          <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {v.experiences?.trim() || "—"}
          </div>
        </div>

        {v.changedView === "ja" && (
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Veränderung der Haltung</div>
            <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
              {v.changedViewDetails?.trim() || "—"}
            </div>
          </div>
        )}
      </Block>

      <Block title="Lebenslauf">
        <div className="flex flex-col gap-3">
          {(v.cvEntries ?? []).map((e, idx) => (
            <div key={idx} className="rounded-md border bg-muted/30 p-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="text-sm font-medium">
                  {e.title || "—"}{" "}
                  <span className="font-normal text-muted-foreground">
                    {e.organization ? `(${e.organization})` : ""}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {e.startDate || "—"} – {e.endDate || "—"}
                </div>
              </div>
              <div className="mt-2 whitespace-pre-wrap text-sm">{e.description?.trim() || "—"}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Bestätigungen">
        <Line
          label="Kopie Personalausweis oder Geburtsurkunde wird beigelegt"
          value={v.idCopyConfirmed ? "✔ Bestätigt" : "✖ Fehlt"}
        />
        <Line
          label="Kein Versand / keine Rechtsberatung"
          value={v.consentNoSubmission ? "✔ Bestätigt" : "✖ Fehlt"}
        />
        <Line
          label="Angaben wahrheitsgemäß / eigenverantwortlich"
          value={v.truthConfirmed ? "✔ Bestätigt" : "✖ Fehlt"}
        />
      </Block>
    </div>
  );
}