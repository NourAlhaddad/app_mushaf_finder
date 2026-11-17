# Questionnaire-to-WooCommerce Product Mapping

## Mapping principles

The finder must consume live WooCommerce products through the future plugin endpoint, not maintain a second permanent catalogue. Live price/currency, image, product URL, and stock state come from the current product record. The app maps product fields into a normalized schema and never infers characteristics from a name, image, or unrelated category.

The public Store API was inspected without credentials. It exposes prices/currency, image URLs, canonical permalinks, categories, attributes, dimensions, purchasability, stock state, and variable-product data. The authenticated WooCommerce REST product list was not public (401); frontend code must not use it with a secret.

## Mapping table

| Finder answer/product fact | Public data observed | Recommended WooCommerce source | Matching policy |
| --- | --- | --- | --- |
| Translation language | Language product categories exist (e.g. English, French; other catalogue categories also appear) | Add/standardize a global product attribute such as `Translation language` (`pa_translation-language`) with controlled language terms; handle multiple translations explicitly | Selected translation requires an explicit matching term. Arabic-only requires an explicit “no translation” value/record state, not a missing field. |
| Riwayah | `Reading` attribute (`pa_reading`) with terms such as Hafs; narration/reading categories also appear | Continue using the global `Reading` attribute, standardize term slugs and clarify whether each term is a riwayah or a broader qira’ah | Exact term match when selected. Unknown/missing reading cannot satisfy a named selection. |
| Size | `Size (Width × High)` attribute (`pa_size`) and physical `dimensions` are exposed | Keep width/height dimension fields authoritative; standardize the size attribute and document bucket boundaries | Derive Pocket/Personal/Standard/Large only from validated dimensions. Do not trust a conflicting label. |
| Price/budget | Public current price and currency are exposed in minor units; shopper currency can vary | Use current WooCommerce Store API price and currency output, including sale price as WooCommerce calculates it | Parse minor units with the API's `currency_minor_unit`; apply selected budget in the displayed currency. Do not hard-code CAD after integration. |
| Availability | `is_in_stock`, `is_purchasable`, and stock availability are exposed | Use WooCommerce current product/variation availability | Exclude explicit out-of-stock or not-purchasable products. Unknown status is not described as available. |
| Product card image | Product image URLs, alt text, and responsive image sizes are exposed | Use the primary product image and responsive thumbnail/srcset | Display the live image; show a neutral placeholder if absent or failed. |
| Product link | Canonical `permalink` is exposed | Use the canonical product page URL | Link to the regular Book Hub product detail page. |
| Publisher | No normalized publisher field was verified in the inspected public product response | Add a global `Publisher` attribute or explicit product metadata; decide the source of truth | Show only when supplied; never parse publisher from a title. |
| Full Qur'an vs part | Product categories such as Qur'an Parts and part descriptions are visible | Add controlled `Edition coverage` attribute (`full`, `part`, optionally `surah`) or equivalent metadata; do not rely on free-text descriptions | Exact type match when selected. An unknown type cannot satisfy “full” or “part”. |
| Intended reader | No normalized suitability field was verified | Add explicit `Suitable reader` terms (child, adult/daily reading, older reader, beginner, gift) and curate assignments | Preference score only for explicitly assigned products. Do not infer suitability from cover artwork/title. |
| Large print | Descriptions may say “large font”; no consistent field was verified | Add `Print size`/`Large print` metadata with a defined measurable standard and curated product assignments | Award large-print relevance only when explicit metadata confirms it; large physical dimensions alone are not proof of larger type. |
| Hifz | A Memorization Tajweed Quran category and descriptions are visible; there is no universal Hifz attribute verified | Add explicit `Memorization features` terms (e.g. page layout/line count, memorization aids) and curate them | Prioritize only identified Hifz features; category/title text alone is insufficient. |
| Cover/material/other features | Attributes such as cover type, paper type, and internal page content are exposed | Reuse existing global attributes where values are controlled and useful | Display only if the question or an approved explanation needs the field. |

## Data quality and completeness

The public language-category listing contains some categories with no products, so category presence does not prove that a translation is currently purchasable. The reference finder groups “another language” as German/Spanish/Russian; the actual store taxonomy contains additional language or script categories. Add an answer only after confirming current products and canonical language metadata.

One public French listing showed 12×17 cm in its product title while a size listing showed 17×24 cm. Resolve such conflicts in WooCommerce before making size a strict production filter. Product variation fields should be checked individually; do not assume every variant inherits the parent language, price, image, or stock state.

The normalized schema distinguishes unknown language (`null`) from an explicit Arabic-only record (an empty translation list). The same discipline applies to unknown riwayah, dimensions, edition type, and suitability. A missing field must never be converted into a positive match.

## Sample catalogue

`src/domain/catalogue/sample-products.ts` contains fictional records with `demo-*` identifiers, explicit `isDemo: true`, no real product URL, no borrowed product images, and clearly labelled demonstration prices/availability. These are for exercising the local experience only; they are not claims about Book Hub inventory.

## Future endpoint response

The plugin endpoint should return a versioned list conforming to the normalized `MushafProduct` model. At minimum, each returned record needs stable ID, display name, current numeric price and ISO currency, product URL, stock/purchasability state, and explicit normalized answer-related attributes. It may return `null` for optional unknown metadata, but must not synthesize defaults that could create a false recommendation. The endpoint should omit products that are unpublished, private, or otherwise not publicly purchasable.
