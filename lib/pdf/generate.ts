import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont, PDFPage } from "pdf-lib";

export type CvEntry = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ApplicationData = {
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    street: string;
    postalCode: string;
    city: string;
    email: string;
    phone: string;
    nationality: string;
  };
  service: {
    status: string;
    unitOrOffice: string;
    referenceNumber: string;
    pendingDeadlines: string;
    obligations: string;
  };
  conscience: {
    conscienceOrigin: string;
    moralConflict: string;
    actionsTaken: string;
    refusalScope: string;
  };
  cv: CvEntry[];
  consentConfirmed: true;
};

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

function buildSenderBlock(data: ApplicationData) {
  const { personal } = data;

  const contactParts = [personal.email?.trim(), personal.phone?.trim()].filter((v): v is string =>
    Boolean(v),
  );
  const contactLine = contactParts.join(" · ");

  return [
    `${personal.firstName} ${personal.lastName}`.trim(),
    personal.street?.trim(),
    `${personal.postalCode} ${personal.city}`.trim(),
    ...(contactLine ? [contactLine] : []),
  ]
    .filter((line): line is string => Boolean(line && line.trim()))
    .join("\n");
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

  // Title
  let cursor = buildHeader(
    page,
    font,
    "Antrag auf Kriegsdienstverweigerung",
    "Art. 4 Abs. 3 Grundgesetz",
  );

  // --- Letterhead: Recipient (left) + Sender + Date (right) ---
  cursor -= LINE_HEIGHT; // gives recipient some breathing room from the title

  const sender = buildSenderBlock(data);
  const recipient = [
    "Bundesamt für das\nPersonalmanagement der Bundeswehr",
    "- Wehrersatzbehörde -",
    "Militärringstraße 1000",
    "50737 Köln",
  ].join("\n");
  const dateLine = `${data.personal.city}, ${formatDate(new Date())}`;

  // Layout
  const leftX = PAGE_MARGIN;
  const rightX = (page.getWidth() / 3) * 2; // right column start (adjust if needed)
  const startY = cursor;

  // Recipient block (left)
  let yRecipient = startY;
  for (const line of recipient.split("\n")) {
    page.drawText(line, {
      x: leftX,
      y: yRecipient,
      size: FONT_SIZE,
      font,
      color: rgb(0.08, 0.08, 0.08),
    });
    yRecipient -= LINE_HEIGHT;
  }

  // Sender block (right)
  let ySender = startY;
  for (const line of sender.split("\n")) {
    page.drawText(line, {
      x: rightX,
      y: ySender,
      size: FONT_SIZE,
      font,
      color: rgb(0.08, 0.08, 0.08),
    });
    ySender -= LINE_HEIGHT;
  }

  // Date directly under sender block (close to it)
  const yDate = ySender - LINE_HEIGHT * 0.6;
  page.drawText(dateLine, {
    x: rightX,
    y: yDate,
    size: FONT_SIZE,
    font,
    color: rgb(0.08, 0.08, 0.08),
  });

  // Continue below the lowest element (recipient vs date)
  cursor = Math.min(yRecipient, yDate) - LINE_HEIGHT * 1.6;

  // Subject line
  page.drawText("Betreff: Antrag auf Anerkennung als Kriegsdienstverweiger:in", {
    x: PAGE_MARGIN,
    y: cursor,
    size: FONT_SIZE,
    font,
    color: rgb(0.05, 0.05, 0.05),
  });
  cursor -= LINE_HEIGHT * 1.8;

  // Body
  const body = `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Anerkennung als Kriegsdienstverweiger:in gemäß Art. 4 Abs. 3 GG.

Meine Beweggründe schildere ich in der beigefügten Gewissensbegründung. Ein tabellarischer Lebenslauf liegt bei. Ich bitte um Bestätigung des Antragseingangs.

Mit freundlichen Grüßen,

${data.personal.firstName} ${data.personal.lastName}`;

  const bodyResult = addTextBlock({
    doc,
    page,
    font,
    text: body,
    y: cursor,
  });
  page = bodyResult.page;
  cursor = bodyResult.cursor;

  // Signature line
  page.drawText("Unterschrift: ______________________________", {
    x: PAGE_MARGIN,
    y: cursor - LINE_HEIGHT,
    size: FONT_SIZE,
    font,
    color: rgb(0.08, 0.08, 0.08),
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
    { name: "01_Anschreiben.pdf", bytes: Uint8Array.from(coverLetter) },
    { name: "02_Gewissensbegruendung.pdf", bytes: Uint8Array.from(justification) },
    { name: "03_Lebenslauf.pdf", bytes: Uint8Array.from(cv) },
  ];

  const bundleDoc = await PDFDocument.create();
  for (const part of resultParts) {
    const partDoc = await PDFDocument.load(part.bytes);
    const copied = await bundleDoc.copyPages(partDoc, partDoc.getPageIndices());
    copied.forEach((p) => bundleDoc.addPage(p));
  }

  const saved = await bundleDoc.save();
  const bundleBytes = Uint8Array.from(saved);
  return { bundleBytes, parts: resultParts };
}
