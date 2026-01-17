import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Kriegsdienstverweigerung · Art. 4 Abs. 3 GG
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            KDV-Assistent: Schritt für Schritt zum druckbaren Antrag
          </h1>

          <p className="text-base text-muted-foreground">
            Der Kriegsdienst mit der Waffe kann aus Gewissensgründen verweigert werden. Dieses Recht
            ist im Grundgesetz verankert.
          </p>

          <p className="text-base text-muted-foreground">
            In der Praxis ist der Weg dorthin für viele unübersichtlich: Welche Angaben sind nötig?
            Wie formuliert man eine persönliche Begründung? Und was gehört überhaupt in den Antrag?
          </p>

          <p className="text-base text-muted-foreground">
            Dieser Assistent hilft dabei, die eigenen Gedanken zu ordnen und die erforderlichen
            Unterlagen strukturiert vorzubereiten. Am Ende entsteht ein druckbares PDF, das selbst
            unterschrieben und bei der zuständigen Stelle eingereicht werden kann.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/wizard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Wizard starten</Button>
            </Link>
            <a
              href="https://www.gesetze-im-internet.de/gg/art_4.html"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                Art. 4 Abs. 3 GG öffnen
              </Button>
            </a>
          </div>

          <span className="text-xs text-muted-foreground">
            Es handelt sich hierbei um keine Rechtsberatung und keine automatische Einreichung. Die
            Verarbeitung findet ausschließlich im Browser statt.
          </span>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Wehrdienst & Wehrpflicht – kurz eingeordnet</CardTitle>
              <CardDescription>
                Die Debatte um den Wehrdienst und die Wehrpflicht ist wieder da – und viele wollen
                vorbereitet sein.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                Die sicherheitspolitische Lage in Europa ist seit Jahren angespannt. Parallel wird
                in Deutschland offener darüber gesprochen, wie schnell die Bundeswehr personell
                aufwachsen könnte – inklusive Modellen für einen <strong>Wehrdienst</strong> auf
                freiwilliger Basis und einer möglichen <strong>Wehrpflicht</strong>-Option, falls
                Freiwilligkeit nicht reicht.
              </p>

              <p>
                Unabhängig davon gilt: Niemand ist verpflichtet, gegen sein Gewissen am Kriegsdienst
                mit der Waffe teilzunehmen.
              </p>
              <p>
                Artikel 4 Absatz 3 des Grundgesetzes garantiert das Recht, den Kriegsdienst aus
                Gewissensgründen zu verweigern.
              </p>
              <p className="text-muted-foreground">
                Entscheidend ist dabei eine persönliche, in sich schlüssige Begründung der eigenen
                Gewissensentscheidung.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wo wird der Antrag eingereicht?</CardTitle>
              <CardDescription>
                Kurz: nicht hier, sondern bei den zuständigen Stellen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                Anträge auf Kriegsdienstverweigerung werden nicht bei dieser Anwendung, sondern bei
                staatlichen Stellen eingereicht.
              </p>
              <p>
                In der Regel erfolgt die Antragstellung über das zuständige{" "}
                <strong>Karrierecenter der Bundeswehr</strong> bzw. das{" "}
                <strong>Bundesamt für das Personalmanagement der Bundeswehr (BAPersBw)</strong>.
              </p>
              <p>
                Nach der formalen Erfassung wird der Antrag an das{" "}
                <strong>Bundesamt für Familie und zivilgesellschaftliche Aufgaben (BAFzA)</strong>{" "}
                zur Entscheidung weitergeleitet.
              </p>

              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium">Üblicherweise besteht der Antrag aus:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>kurzes Anschreiben mit Berufung auf Art. 4 Abs. 3 GG + Unterschrift</li>
                  <li>tabellarischer Lebenslauf</li>
                  <li>ausführliche, persönliche Gewissensbegründung</li>
                </ul>
              </div>

              <p className="text-muted-foreground">
                Der Assistent erstellt diese Unterlagen als zusammenhängendes PDF. Die Prüfung,
                Unterschrift und Einreichung erfolgen eigenverantwortlich.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.bafza.de/rat-und-hilfe/kriegsdienstverweigerung"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto">
                    Offizielle Infos (BAFzA)
                  </Button>
                </a>
                <a
                  href="https://www.bundeswehrkarriere.de/karrierecenter"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto">
                    Karrierecenter finden
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Diese Anwendung unterstützt dich dabei:</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>die relevanten Fragen strukturiert zu beantworten</li>
            <li>eine konsistente Gewissensbegründung zu formulieren</li>
            <li>die erforderlichen Dokumente gebündelt als PDF zu erzeugen</li>
            <li>den Überblick über den formalen Ablauf zu behalten</li>
          </ul>

          <p className="mt-3 text-sm text-muted-foreground">
            Keine Speicherung, kein Konto, keine Weitergabe von Daten.
          </p>

          <div className="mt-5">
            <Link href="/wizard">
              <Button>Jetzt starten</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
