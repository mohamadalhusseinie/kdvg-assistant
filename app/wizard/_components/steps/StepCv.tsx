"use client";

import type { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import type { WizardFormValues } from "@/features/wizard/schema";

export function StepCv({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="cvText">
                Tabellarischer Lebenslauf (optional, wenn du es kurz halten willst)
            </label>
            <Textarea
                id="cvText"
                placeholder={`Beispiel:\n03/2022–laufend: Softwareentwickler (Firma)\n08/2018–02/2022: Studium (Uni)`}
                {...methods.register("cvText")}
            />
            <p className="text-xs text-muted-foreground">
                Für MVP genügt Text. Später kannst du hier strukturierte CV-Entries bauen.
            </p>
        </div>
    );
}