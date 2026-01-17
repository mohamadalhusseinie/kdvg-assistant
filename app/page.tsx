import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-muted/40">
            <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
                <header className="flex flex-col gap-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Kriegsdienstverweigerung · Art. 4 Abs. 3 GG
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        KDV-Assistent
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Schritt-für-Schritt Generator für Anschreiben, Gewissensbegründung und tabellarischen Lebenslauf.
                        Keine Übermittlung, keine Rechtsvertretung.
                    </p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Start</CardTitle>
                        <CardDescription>
                            Beantworte die Kernfragen. Am Ende bekommst du ein druckbares PDF-Bundle.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/wizard">
                            <Button className="w-full sm:w-auto">Wizard starten</Button>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            Hinweis: Die Anwendung erstellt Entwürfe und ersetzt keine Rechtsberatung.
                        </p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}