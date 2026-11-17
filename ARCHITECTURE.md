# Architecture

## Goals and boundaries

Mushaf Finder is a standalone React + TypeScript + Vite application. It runs locally with no backend and keeps the questionnaire, product catalogue, recommendation rules, user interface, and translations separate. No Book Hub code, account, or production endpoint is required to run it.

The local catalogue contains fictional demonstration records only. A `CatalogueSource` is the seam for replacing this local provider with a future WordPress-backed source; the UI and recommendation rules consume the same normalized `MushafProduct` model.

## Structure

```text
src/
  App.tsx
  main.tsx
  styles.css
  domain/
    catalogue/
      types.ts                 answer and normalized product types
      source.ts                local catalogue source contract
      sample-products.ts       clearly fictional local catalogue and weights
    recommendations/
      recommend.ts             hard compatibility filters and weighted rank
      recommend.test.ts
  features/
    questionnaire/
      options.ts               option IDs and visual marks
      state.ts                 navigation, answer persistence, validation
      state.test.ts
  i18n/
    en.ts
    fr.ts
    ar.ts
```

The eventual WordPress packaging layer is documented in [INTEGRATION.md](./INTEGRATION.md); it is not installed on or connected to the public site.

## Data flow

1. The welcome panel starts the questionnaire.
2. The reducer stores one answer set and current step. `localStorage` preserves an in-progress or completed set in the local browser; restart clears it. Storage errors are logged and surfaced in the interface.
3. Each selected answer is compared against a catalogue record using the normalized types.
4. The recommender first removes incompatible or explicitly unavailable products, then scores the remaining products and creates reason codes for the UI.
5. Localized presentation formats CAD prices, availability, facts, and match reasons. Images are optional and have an accessible local fallback.

## Questionnaire

1. **Reader:** child/young learner, adult/daily reading, older reader/large print, Hifz, new Muslim/beginner, or gift.
2. **Language alongside Arabic:** Arabic only, English, French, German, Spanish, or Russian. The reference grouped the last three under “another language”; the local UI makes those choices explicit so a translation can be matched exactly.
3. **Riwayah:** Hafs, Warsh, Qalun, Al-Douri, another reading, or not sure. Unknown narration is not treated as a match for a named choice.
4. **Size:** Pocket, Personal, Standard, Large, or Any.
5. **Edition and budget:** full Qur'an, a part, or either; Under C$25, C$25–C$60, Over C$60, or Any.

## Matching rules

The customer must complete all five steps before recommendations are produced. These selections are hard constraints:

- Translation: Arabic-only means the product has an explicit, empty translation-language list; a missing language value is not treated as Arabic-only. A translated edition must explicitly list the selected language.
- Riwayah: a selected named riwayah must match exactly. “Not sure” does not constrain riwayah.
- Size: a selected size bucket must match the normalized size. “Any size” does not constrain it.
- Edition type: full/part must match. “Either” does not constrain it.
- Budget: under C$25 is `< 25`; C$25–C$60 is inclusive; over C$60 is `> 60`. “Any” does not constrain price.
- Explicit out-of-stock products are excluded. Unknown stock is shown as unconfirmed rather than advertised as available.
- Missing required product data does not satisfy a selected language, riwayah, size, or type.

No incompatible near-match is presented as a recommendation. If a hard-filter combination has no results, the user is told there is no match and can change answers or ask for help.

Audience fit and declared product features are preferences, not guesses. The default configurable weights are in `sample-products.ts`: audience suitability 40, reader-specific feature 30, additional suitability 20, and clear-print evidence 10. The displayed score is the sum of earned points as a percentage of 100. Hifz receives feature points only when a memorization layout is explicitly present; an older-reader preference receives feature points only when the product is explicitly marked large print. A `clear-print` tag earns a smaller general-quality score and is not misrepresented as large print. Budget compatibility is a filter and an explanation, not a score.

## Localization and accessibility

Translation strings live in separate language modules. Language of the questionnaire (Arabic, English, French, German, Spanish, or Russian) is separate from the interface language (English, French, Arabic). Arabic sets document language and `dir=rtl`; the layout uses logical spacing and direction-aware controls. Buttons expose selected state, progress is announced as a progress bar, the flow supports keyboard use, and reduced-motion preferences are respected.

## Data and privacy

The app stores questionnaire answers in the current browser's local storage. It does not send answers to a server, and no analytics are configured. Demo product data and visual assets are local. WhatsApp help opens the publicly listed Book Hub contact; that is the only external action provided in the demo.

## Tests

`npm test` covers strict filters, type/language/riwayah/budget compatibility, availability and unknown-data behavior, feature ranking, no-match results, incomplete questionnaires, and back-navigation answer preservation.
