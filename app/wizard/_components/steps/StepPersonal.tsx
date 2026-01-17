"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { WizardFormValues } from "@/features/wizard/schema";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function StepPersonal({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="fullName">Vollständiger Name</label>
                <Input id="fullName" placeholder="Vorname Nachname" {...methods.register("fullName")} />
                <FieldError message={methods.formState.errors.fullName?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="street">Straße & Hausnummer</label>
                <Input id="street" placeholder="Musterstr. 12" {...methods.register("street")} />
                <FieldError message={methods.formState.errors.street?.message} />
            </div>

            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="postalCode">PLZ</label>
                    <Input id="postalCode" placeholder="12345" inputMode="numeric" {...methods.register("postalCode")} />
                    <FieldError message={methods.formState.errors.postalCode?.message} />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="city">Ort</label>
                    <Input id="city" placeholder="Berlin" {...methods.register("city")} />
                    <FieldError message={methods.formState.errors.city?.message} />
                </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="birthDate">Geburtsdatum</label>
                    <Input id="birthDate" placeholder="TT.MM.JJJJ" {...methods.register("birthDate")} />
                    <FieldError message={methods.formState.errors.birthDate?.message} />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="birthPlace">Geburtsort</label>
                    <Input id="birthPlace" placeholder="Ort" {...methods.register("birthPlace")} />
                    <FieldError message={methods.formState.errors.birthPlace?.message} />
                </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="nationality">Staatsangehörigkeit</label>
                <Input id="nationality" placeholder="z. B. Deutsch" {...methods.register("nationality")} />
                <FieldError message={methods.formState.errors.nationality?.message} />
            </div>
        </div>
    );
}