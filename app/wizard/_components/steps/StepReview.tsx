"use client";

import type { UseFormReturn } from "react-hook-form";
import type { WizardFormValues } from "@/features/wizard/schema";

export function StepReview({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
  const values = methods.getValues();

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Prüfe deine Angaben. Der Download erzeugt 3 PDFs (Anschreiben, Begründung, Lebenslauf) +
        Bundle.
      </p>

      <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
}
