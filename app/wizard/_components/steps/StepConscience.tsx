"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { WizardFormValues } from "@/features/wizard/schema";
import { reasonOptions } from "@/features/wizard/steps";
import { LegalDisclaimer } from "@/components/wizard/disclaimer";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

export function StepConscience({ methods }: { methods: UseFormReturn<WizardFormValues> }) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-2">
                <p className="text-sm font-medium">Welche Grundlage trifft auf Sie am ehesten zu?</p>
                <Controller
                    control={methods.control}
                    name="conscienceBase"
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3 md:grid-cols-3">
                            {[
                                ["religioes", "religiöse Gewissensentscheidung"],
                                ["ethisch", "ethisch-moralische Gewissensentscheidung"],
                                ["humanistisch", "humanistisch / weltanschaulich"],
                            ].map(([value, label]) => (
                                <label key={value} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                                    <RadioGroupItem value={value} />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    )}
                />
                <FieldError message={methods.formState.errors.conscienceBase?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="conscienceSince">
                    Seit wann besteht diese Gewissensüberzeugung? (Zeitpunkt + Auslöser)
                </label>
                <Textarea id="conscienceSince" placeholder="Bitte kurz beschreiben" {...methods.register("conscienceSince")} />
                <FieldError message={methods.formState.errors.conscienceSince?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="centralQuestion">
                    Warum können Sie persönlich nicht am Töten von Menschen mitwirken, auch nicht indirekt?
                </label>
                <Textarea id="centralQuestion" placeholder="Keine Politik/Angst als Hauptgrund, sondern Gewissen." {...methods.register("centralQuestion")} />
                <FieldError message={methods.formState.errors.centralQuestion?.message} />
            </div>

            <div className="grid gap-2">
                <p className="text-sm font-medium">
                    Gilt diese Ablehnung unabhängig von Gegner/Krieg/Umständen?
                </p>
                <Controller
                    control={methods.control}
                    name="rejectionAlways"
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3 sm:grid-cols-2">
                            {[
                                ["ja", "Ja"],
                                ["nein", "Nein (hohes Ablehnungsrisiko)"],
                            ].map(([value, label]) => (
                                <label key={value} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                                    <RadioGroupItem value={value} />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    )}
                />
                <FieldError message={methods.formState.errors.rejectionAlways?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="scenarioWeapon">
                    Wie würden Sie handeln, wenn Ihnen befohlen würde, eine Waffe zu benutzen?
                </label>
                <Textarea id="scenarioWeapon" {...methods.register("scenarioWeapon")} />
                <FieldError message={methods.formState.errors.scenarioWeapon?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="deadlyForceDefense">
                    Haltung zu tödlicher Gewalt zur Verteidigung staatlicher Interessen?
                </label>
                <Textarea id="deadlyForceDefense" {...methods.register("deadlyForceDefense")} />
                <FieldError message={methods.formState.errors.deadlyForceDefense?.message} />
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="irreversibleReason">
                    Warum ist diese Haltung für Sie unumkehrbar?
                </label>
                <Textarea id="irreversibleReason" {...methods.register("irreversibleReason")} />
                <FieldError message={methods.formState.errors.irreversibleReason?.message} />
            </div>

            <div className="grid gap-3">
                <p className="text-sm font-medium">
                    Trifft einer der folgenden Gründe auf Sie zu? (Mehrfachauswahl möglich)
                </p>

                <Controller
                    control={methods.control}
                    name="riskReasons"
                    render={({ field }) => {
                        const value = field.value ?? [];
                        return (
                            <div className="grid gap-2">
                                {reasonOptions.map((item) => {
                                    const checked = value.includes(item.value);
                                    return (
                                        <label key={item.value} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={(c) => {
                                                    const next = new Set(value);
                                                    if (c) next.add(item.value);
                                                    else next.delete(item.value);
                                                    field.onChange(Array.from(next));
                                                }}
                                            />
                                            <span>{item.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        );
                    }}
                />

                <p className="text-sm text-amber-800">
                    Diese Gründe allein reichen nicht für eine Anerkennung aus.
                </p>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="experiences">
                    Biografische Prägungen / Erfahrungen
                </label>
                <Textarea id="experiences" {...methods.register("experiences")} />
                <FieldError message={methods.formState.errors.experiences?.message} />
            </div>

            <div className="grid gap-2">
                <p className="text-sm font-medium">Hat sich Ihre Sichtweise im Laufe der Zeit verändert?</p>
                <Controller
                    control={methods.control}
                    name="changedView"
                    render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3 sm:grid-cols-2">
                            {[
                                ["ja", "Ja"],
                                ["nein", "Nein"],
                            ].map(([value, label]) => (
                                <label key={value} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-xs">
                                    <RadioGroupItem value={value} />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                    )}
                />
                <FieldError message={methods.formState.errors.changedView?.message} />
            </div>

            {methods.watch("changedView") === "ja" && (
                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="changedViewDetails">
                        Bitte erläutern:
                    </label>
                    <Textarea id="changedViewDetails" {...methods.register("changedViewDetails")} />
                    <FieldError message={methods.formState.errors.changedViewDetails?.message} />
                </div>
            )}

            <div className="grid gap-4">
                <LegalDisclaimer />

                <label className="flex items-center gap-3">
                    <Controller
                        control={methods.control}
                        name="consentNoSubmission"
                        render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <span className="text-sm font-medium">
            Ich bestätige: kein Versand, keine Rechtsberatung, alles bleibt lokal.
          </span>
                </label>
                <FieldError message={methods.formState.errors.consentNoSubmission?.message} />

                <label className="flex items-center gap-3">
                    <Controller
                        control={methods.control}
                        name="truthConfirmed"
                        render={({ field }) => (
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                    <span className="text-sm font-medium">
            Ich bestätige: Angaben wahrheitsgemäß und eigenverantwortlich.
          </span>
                </label>
                <FieldError message={methods.formState.errors.truthConfirmed?.message} />

                <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="signatureCity">Ort der Unterschrift</label>
                    <Input id="signatureCity" placeholder="Ort" {...methods.register("signatureCity")} />
                    <FieldError message={methods.formState.errors.signatureCity?.message} />
                </div>
            </div>
        </div>
    );
}