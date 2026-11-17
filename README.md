# Mushaf Finder

A local-first, responsive Qur'an edition finder. The current catalogue is explicitly fictional demonstration data; the app does not contact The Book Hub or any production service.

## Requirements

- Node.js 20.19 or later
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints a local URL (normally `http://localhost:5173`). No API, production website, or credentials are required.

```sh
npm test       # focused recommendation and questionnaire-state tests
npm run build  # TypeScript check and production bundle
npm run preview
```

## What is included

- Five questionnaire steps with answer persistence, back/continue, edit, and restart.
- English, French, and Arabic interface dictionaries; Arabic switches the app content to right-to-left layout.
- A deterministic recommender: selected translation, riwayah, size, full/part type, and budget are compatibility filters; audience suitability and explicitly described features affect ranking.
- No real product links, images, publisher claims, or live availability are fabricated. Missing cover art uses a local placeholder.
- A fixed sample-data notice is visible throughout the app.

## Editing demonstration products

Edit `src/domain/catalogue/sample-products.ts`. Keep demonstration records marked `isDemo: true`; do not copy live listings into this file. Product fields are intentionally separated from the question definitions and recommendation algorithm.

To add an answer option, update the central domain types and question options, then add its localized labels in `src/i18n/en.ts`, `src/i18n/fr.ts`, and `src/i18n/ar.ts`. Read [PRODUCT_MAPPING.md](./PRODUCT_MAPPING.md) before adding live catalogue attributes. Add regression cases to the existing `*.test.ts` files when changing matching behavior.

## Project documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — modules, data flow, and recommendation rules.
- [INTEGRATION.md](./INTEGRATION.md) — proposed WordPress/WooCommerce plugin integration.
- [PRODUCT_MAPPING.md](./PRODUCT_MAPPING.md) — question-to-product field mapping and data gaps.
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) — completed local work and future phases.

No deployment, production changes, or GitHub push are part of this project.
