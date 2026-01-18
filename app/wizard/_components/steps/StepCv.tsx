"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { WizardFormValues } from "@/features/wizard/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function StepCv({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
  const {
    control,
    register,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cvEntries",
  });

  const rootError = Array.isArray(errors.cvEntries) ? undefined : errors.cvEntries?.message;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Tragen Sie Ihren tabellarischen Lebenslauf als einzelne Stationen ein (z. B. Schule,
        Ausbildung, Beruf, Wehrdienst/Reserve, etc.). Mindestens ein Eintrag ist erforderlich.
      </p>

      <FieldError message={rootError as string | undefined} />

      <div className="flex flex-col gap-4">
        {fields.map((field, index) => {
          const entryErr = errors.cvEntries?.[index];
          return (
            <div key={field.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Eintrag {index + 1}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  Entfernen
                </Button>
              </div>

              <div className="mt-4 grid gap-4">
                <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Start</label>
                    <Input
                      placeholder="z. B. 03/2020 oder 2020"
                      {...register(`cvEntries.${index}.startDate` as const)}
                    />
                    <FieldError message={entryErr?.startDate?.message} />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Ende</label>
                    <Input
                      placeholder='z. B. 08/2024 oder "laufend"'
                      {...register(`cvEntries.${index}.endDate` as const)}
                    />
                    <FieldError message={entryErr?.endDate?.message} />
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tätigkeit / Funktion</label>
                    <Input
                      placeholder="z. B. Softwareentwickler"
                      {...register(`cvEntries.${index}.title` as const)}
                    />
                    <FieldError message={entryErr?.title?.message} />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Organisation</label>
                    <Input
                      placeholder="z. B. Firma / Schule / Universität"
                      {...register(`cvEntries.${index}.organization` as const)}
                    />
                    <FieldError message={entryErr?.organization?.message} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Kurzbeschreibung</label>
                  <Textarea
                    placeholder="1–3 Sätze: Aufgaben, Schwerpunkt, Abschluss, etc."
                    {...register(`cvEntries.${index}.description` as const)}
                  />
                  <FieldError message={entryErr?.description?.message} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={() =>
          append({
            startDate: "",
            endDate: "laufend",
            title: "",
            organization: "",
            description: "",
          })
        }
      >
        Eintrag hinzufügen
      </Button>
    </div>
  );
}
