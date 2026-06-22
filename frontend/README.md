# Hashtag Innovations Frontend

Frontend application for the Hashtag Innovations platform. The project is built with Next.js App Router, React, TypeScript, SCSS modules, and a lightweight custom localization layer for Bulgarian and English routes.

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **SCSS modules** for component-level styling
- **Motion** for UI animation primitives
- **ESLint 9** with Next.js config

## Features

- Localized routes under `/bg` and `/en`
- Shared layout with sticky header and footer
- Home page sections for hero content, community events, experts, learning materials, and insights
- Catalog/detail pages for events, experts, learn, projects, and insights
- Mock data layer for local development
- Responsive components for desktop and mobile navigation

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

The localized entry points are:

```text
http://localhost:3000/bg
http://localhost:3000/en
```

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server after a successful build.

```bash
npm run lint
```

Runs ESLint checks.

## Project Structure

```text
src/
  app/
    [lang]/                 Localized App Router pages
  Components/
    Common/                 Header, footer, buttons, shared layout pieces
    Sections/               Page-level feature sections
    UI/                     Reusable UI primitives
  Context/                  Language and navigation providers
  Hooks/                    Shared React hooks
  Lib/                      i18n and validation helpers
  mockData/                 Local demo data
  Styles/                   Global styles, variables, mixins
  Types/                    Shared TypeScript types
public/
  images/                   Static images and SVG assets
```

## Localization

The app supports English and Bulgarian through the `LanguageProvider` and localized routes.

- Language type: `src/Types/Language.ts`
- Context: `src/Context/LanguageContext.tsx`
- Hook: `src/Hooks/useLanguage.ts`
- Route format: `/en/...` or `/bg/...`

Most feature sections keep their copy in colocated `translations.ts` files. When adding new text, prefer the existing local translation file for that section.

## Styling Guidelines

- Use SCSS modules next to the component they style.
- Keep shared tokens in `src/Styles/variables.scss`.
- Use existing responsive mixins from `src/Styles/mixins.scss`.
- Prefer semantic HTML controls for interactive UI.
- Keep mobile and desktop states visually consistent.

## Development Notes

- Static images live in `public/images`.
- Mock entities live in `src/mockData` and are typed through `src/Types`.
- Component imports currently use a mix of aliases and relative paths; follow the surrounding file style when editing.
- The header language switcher updates the URL locale segment and keeps `document.documentElement.lang` in sync.

## Production

Create and run a production build:

```bash
npm run build
npm run start
```

Before deploying, run:

```bash
npm run lint
npm run build
```
