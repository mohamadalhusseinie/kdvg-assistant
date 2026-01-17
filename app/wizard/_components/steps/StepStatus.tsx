"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import type { WizardFormValues } from "@/features/wizard/schema";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function StepStatus({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
  return (
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
              {[
                ["ungedient", "Nein, ungedient"],
                ["wehrdienst", "Ja, Wehrdienst"],
                ["reservist", "Ja, Reservist"],
                ["aktiv", "Ja, aktiver Soldat"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs"
                >
                  <RadioGroupItem value={value} />
                  <span>{label}</span>
                </label>
              ))}
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
              {[
                ["ja", "Ja"],
                ["nein", "Nein"],
                ["unbekannt", "Weiß ich nicht"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs"
                >
                  <RadioGroupItem value={value} />
                  <span>{label}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
        <FieldError message={methods.formState.errors.mustered?.message} />
      </div>
    </div>
  );
}
