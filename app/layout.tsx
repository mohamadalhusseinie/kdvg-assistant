import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "KDV-Assistent",
    description: "Schritt-für-Schritt Generator für KDV-Antrag (Art. 4 Abs. 3 GG).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body className="antialiased">{children}</body>
        </html>
    );
}