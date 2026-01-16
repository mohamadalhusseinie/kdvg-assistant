import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";

import type { ApplicationData, CvEntry } from "./schemas";

const PAGE_MARGIN = 56;
const LINE_HEIGHT = 16;
const FONT_SIZE = 11;
const HEADING_SIZE = 16;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function wrapLines({
  text,
  maxWidth,
  font,
  fontSize,
}: {
  text: string;
  maxWidth: number;
  font: PDFFont;
  fontSize: number;
}) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const tentative = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(tentative, fontSize);
    if (width <= maxWidth) {
      current = tentative;
    } else {
      if (current) {
        lines.push(current);
      }
      current = word;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}

function addTextBlock({
  doc,
  page,
  font,
  text,
  y,
  fontSize = FONT_SIZE,
}: {
  doc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  text: string;
  y: number;
  fontSize?: number;
}) {
  let cursor = y;
  const maxWidth = page.getWidth() - PAGE_MARGIN * 2;
  const paragraphs = text.split(/\n\n+/u).map((p) => p.trim());

  paragraphs.forEach((paragraph) => {
    const lines = wrapLines({ text: paragraph, maxWidth, font, fontSize });
    lines.forEach((line) => {
      if (cursor < PAGE_MARGIN + LINE_HEIGHT) {
        page = doc.addPage();
        cursor = page.getHeight() - PAGE_MARGIN;
      }
      page.drawText(line, {
        x: PAGE_MARGIN,
        y: cursor,
        size: fontSize,
        font,
        color: rgb(0.08, 0.08, 0.08),
      });
      cursor -= LINE_HEIGHT;
    });
    cursor -= LINE_HEIGHT / 2;
  });

  return { page, cursor };
}

function buildAddressBlock(data: ApplicationData) {
  const { personal } = data;
  return `${personal.firstName} ${personal.lastName}\n${personal.street}\n${personal.postalCode} ${personal.city}`;
}

function buildHeader(page: PDFPage, font: PDFFont, title: string, subtitle?: string) {
  const x = PAGE_MARGIN;
  let y = page.getHeight() - PAGE_MARGIN;
  page.drawText(title, {
    x,
    y,
    size: HEADING_SIZE,
    font,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= LINE_HEIGHT * 1.4;

  if (subtitle) {
    page.drawText(subtitle, {
      x,
      y,
      size: FONT_SIZE,
      font,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= LINE_HEIGHT * 1.2;
  }

  return y;
}

async function createCoverLetter(data: ApplicationData) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage();
  let cursor = buildHeader(
    page,
    font,
    "Antrag auf Kriegsdienstverweigerung",
    "Art. 4 Abs. 3 Grundgesetz",
  );

  const applicantAddress = buildAddressBlock(data);
  const authorityAddress = `${data.service.unitOrOffice}\n- Kriegsdienstverweigerung -`;
  const dateLine = `${data.personal.city}, ${formatDate(new Date())}`;

  [{ label: applicantAddress }, { label: authorityAddress }, { label: dateLine }]
    .filter(Boolean)
    .forEach((item) => {
      const result = addTextBlock({
        doc,
        page,
        font,
        text: item.label ?? "",
        y: cursor,
        fontSize: FONT_SIZE,
      });
      page = result.page;
      cursor = result.cursor - LINE_HEIGHT / 2;
    });

  const body = `Sehr geehrte Damen und Herren,\n\nHiermit beantrage ich die Anerkennung als Kriegsdienstverweiger:in gemäß Art. 4 Abs. 3 GG. Ich befinde mich aktuell im Status: ${data.service.status}. Zuständige Stelle / Einheit: ${data.service.unitOrOffice}${
    data.service.referenceNumber
      ? ` (Aktenzeichen: ${data.service.referenceNumber})`
      : ""
  }. ${data.service.pendingDeadlines ? `Bekannte Fristen: ${data.service.pendingDeadlines}.` : ""}\n\nMeine Beweggründe schildere ich in der beigefügten Gewissensbegründung. Ein tabellarischer Lebenslauf liegt bei. Ich bitte um zügige Bearbeitung und Bestätigung des Antragseingangs.\n\nMit freundlichen Grüßen,\n${data.personal.firstName} ${data.personal.lastName}`;

  const bodyResult = addTextBlock({
    doc,
    page,
    font,
    text: body,
    y: cursor,
  });
  page = bodyResult.page;
  cursor = bodyResult.cursor;

  page.drawText("Unterschrift: ______________________________", {
    x: PAGE_MARGIN,
    y: cursor - LINE_HEIGHT,
    size: FONT_SIZE,
    font,
  });

  return doc.save();
}

async function createJustification(data: ApplicationData) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage();
  let cursor = buildHeader(
    page,
    font,
    "Persönliche Gewissensbegründung",
    `${data.personal.firstName} ${data.personal.lastName}`,
  );

  const intro = `Ich stelle den Antrag auf Kriegsdienstverweigerung, weil es meinem Gewissen widerspricht, an Handlungen mitzuwirken, die auf den Einsatz von Waffen oder die Vorbereitung militärischer Gewalt gerichtet sind.`;
  const segments = [
    { heading: "Entstehung des Gewissenskonflikts", text: data.conscience.conscienceOrigin },
    { heading: "Weshalb Waffengewalt unvereinbar ist", text: data.conscience.moralConflict },
    { heading: "Konkretes friedliches Handeln", text: data.conscience.actionsTaken },
    { heading: "Was ich ablehne", text: data.conscience.refusalScope },
  ];

  const introResult = addTextBlock({ doc, page, font, text: intro, y: cursor });
  page = introResult.page;
  cursor = introResult.cursor;

  segments.forEach((segment) => {
    const headingResult = addTextBlock({
      doc,
      page,
      font,
      text: segment.heading,
      y: cursor,
      fontSize: FONT_SIZE + 2,
    });
    page = headingResult.page;
    cursor = headingResult.cursor;

    const textResult = addTextBlock({
      doc,
      page,
      font,
      text: segment.text,
      y: cursor,
    });
    page = textResult.page;
    cursor = textResult.cursor - LINE_HEIGHT / 2;
  });

  return doc.save();
}

function renderCvEntry(entry: CvEntry) {
  return `${entry.startDate} – ${entry.endDate}: ${entry.title} (${entry.organization})\n${entry.description}`;
}

async function createCv(data: ApplicationData) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  let page = doc.addPage();
  let cursor = buildHeader(page, font, "Tabellarischer Lebenslauf");

  const contact = `${data.personal.firstName} ${data.personal.lastName}\n${data.personal.street}\n${data.personal.postalCode} ${data.personal.city}\n${data.personal.email} | ${data.personal.phone}`;
  const contactResult = addTextBlock({ doc, page, font, text: contact, y: cursor });
  page = contactResult.page;
  cursor = contactResult.cursor - LINE_HEIGHT / 2;

  data.cv.forEach((entry) => {
    const sectionResult = addTextBlock({
      doc,
      page,
      font,
      text: renderCvEntry(entry),
      y: cursor,
    });
    page = sectionResult.page;
    cursor = sectionResult.cursor;
  });

  return doc.save();
}

export type PdfBundle = {
  bundleBytes: Uint8Array;
  parts: { name: string; bytes: Uint8Array }[];
};

export async function generatePdfBundle(data: ApplicationData): Promise<PdfBundle> {
  const [coverLetter, justification, cv] = await Promise.all([
    createCoverLetter(data),
    createJustification(data),
    createCv(data),
  ]);

  const resultParts = [
    { name: "01_Anschreiben.pdf", bytes: coverLetter },
    { name: "02_Gewissensbegruendung.pdf", bytes: justification },
    { name: "03_Lebenslauf.pdf", bytes: cv },
  ];

  const bundleDoc = await PDFDocument.create();
  for (const part of resultParts) {
    const partDoc = await PDFDocument.load(part.bytes);
    const copied = await bundleDoc.copyPages(partDoc, partDoc.getPageIndices());
    copied.forEach((p) => bundleDoc.addPage(p));
  }

  const bundleBytes = await bundleDoc.save();
  return { bundleBytes, parts: resultParts };
}