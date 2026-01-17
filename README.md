# KDVG Assistant

Draft assistant for German conscientious objection (Kriegsdienstverweigerung, Art. 4(3) GG). The app guides users through a step-by-step wizard to collect personal data and conscience-based justification, then generates a printable PDF bundle (cover letter, justification, tabular CV). It never submits documents or provides legal representation.

## Features

- Guided multi-step wizard with validation for status, personal data, conscience grounds, and declarations
- PDF bundle generation in-browser (cover letter, justification, CV) ready for download/printing
- Structured data schema with safe defaults to keep outputs consistent and legally aligned
- Responsive UI with reusable form components and accessible defaults
- Clear disclaimers; no backend submission or legal advice

## Tech Stack

- Next.js (App Router) with React and TypeScript
- Zod schemas for validation and mapping to PDF data
- Tailwind/shadcn-style UI components in `components/ui`
- PDF templating utilities in `lib/pdf`

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 to use the wizard.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm start` – serve the production build
- `npm run lint` – lint the codebase

## Project Structure (high level)

- `app/` – Next.js routes and pages (wizard under `app/wizard`)
- `components/` – shared UI components and wizard-specific parts
- `features/wizard/` – form schema, defaults, and step configuration
- `lib/pdf/` – PDF generation logic and templates
- `public/` – static assets

## PDF Generation

User input is mapped via `features/wizard/mapToPdf.ts` into PDF-ready data and rendered with templates in `lib/pdf/templates.ts`. Downloads happen client-side; no data is sent to a server.

## Data & Privacy

All data stays in the browser session. Users must download and submit documents themselves. No legal advice or representation is provided.

## Deployment

Standard Next.js deployment flow applies (e.g., Vercel). Build with `npm run build` and serve with `npm start`.

## Contributing

- Keep schemas, defaults, and UI in sync with the question catalog
- Maintain accessibility for all form controls and PDF download flows
- Add tests for validation changes and PDF mapping

## License

TBD. Replace this section with the chosen license before release.