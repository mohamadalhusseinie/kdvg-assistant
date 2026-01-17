"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WizardProgress } from "./WizardProgress";

type Props = {
    children: ReactNode;

    stepIndex: number;
    stepsCount: number;
    stepLabel: string;
    stepDescription?: string;

    progress: number;

    canGoBack: boolean;
    canGoNext: boolean;
    isLastStep: boolean;

    onPrev: () => void;
    onNext: () => void;
    onDownload: () => void;
};

export function WizardShell(props: Props) {
    return (
        <div className="min-h-screen bg-muted/40">
            <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
                <header className="flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Kriegsdienstverweigerung · Art. 4 Abs. 3 GG
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Schritt-für-Schritt Assistent
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Alles wird lokal im Browser verarbeitet. Kein Versand. Keine Speicherung.
                    </p>
                </header>

                <WizardProgress
                    stepIndex={props.stepIndex}
                    stepsCount={props.stepsCount}
                    label={props.stepLabel}
                    progress={props.progress}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>{props.stepLabel}</CardTitle>
                        {props.stepDescription ? <CardDescription>{props.stepDescription}</CardDescription> : null}
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        {props.children}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <div className="flex w-full items-center justify-between gap-3">
                            <Button variant="outline" type="button" onClick={props.onPrev} disabled={!props.canGoBack}>
                                Zurück
                            </Button>

                            {!props.isLastStep ? (
                                <Button type="button" onClick={props.onNext} disabled={!props.canGoNext}>
                                    Weiter
                                </Button>
                            ) : (
                                <Button type="button" onClick={props.onDownload}>
                                    PDF herunterladen
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}