export function LegalDisclaimer() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Wichtiger Hinweis</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>
          Die Anwendung erstellt Entwürfe. Sie versendet <strong>keine</strong> Anträge.
        </li>
        <li>Prüfen Sie Ihre Angaben vor dem Versand an die zuständige Stelle.</li>
        <li>PDFs werden ausschließlich lokal im Browser generiert und nicht gespeichert.</li>
        <li>
          Eine Kopie des Personalausweises oder der Geburtsurkunde ist beizulegen und wird nicht als
          PDF erzeugt.
        </li>
      </ul>
    </div>
  );
}
