# Development Plan

## Completed locally

- [x] Read the complete functional requirements and preserve `info.md`.
- [x] Inspect the existing directory; it contained no app framework or source files.
- [x] Verify that the public Book Hub site uses WordPress and WooCommerce and identify the Woodmart theme and public Store API.
- [x] Inspect the reference finder options, representative result flow, product pages, and public WooCommerce product fields.
- [x] Agree on a plugin + shortcode + built-asset integration architecture before implementation.
- [x] Create a standalone React + TypeScript + Vite app with no production dependency.
- [x] Implement the five-step questionnaire, answer persistence, English/French/Arabic UI, responsive layouts, and RTL direction.
- [x] Add an independent catalogue source, clearly fictional sample catalogue, strict compatibility filters, configurable weighted ranking, and match explanations.
- [x] Add automated recommendation and questionnaire-state tests.
- [x] Write the requested project, architecture, integration, and product-mapping documentation.

## Remaining before a production integration

1. **Approve product-data standards.** Confirm the language, riwayah, edition-coverage, dimensions, publisher, audience, large-print, and Hifz attribute ownership and controlled values with the store catalogue administrator.
2. **Clean existing records.** Resolve conflicting size values, confirm actual translation/riwayah on products and variations, and review stock/purchasability.
3. **Implement and test the plugin.** Add a shortcode, manifest-aware asset loading, normalized read-only endpoint, server-side product mapper, and bounded cache in a staging WordPress environment.
4. **Replace local provider.** Connect the app to the plugin endpoint behind the existing `CatalogueSource` seam, handle API errors visibly, and verify it never falls back to demo products in a live build.
5. **Validate scoring with Book Hub.** Review sample customer journeys with staff and product owners. Tune weights only from verified metadata and approved recommendations.
6. **Expand test coverage.** Add endpoint mapping, variation, currency, cache invalidation, product-link, and browser-level responsive/RTL tests once the staging contract exists.
7. **Staging acceptance.** Test shortcode rendering alongside Woodmart/Elementor, mobile navigation, accessibility, API performance, real prices/stock, and rollback.
8. **Separate deployment approval.** Production deployment requires a later explicit approval. It is not part of this local task.

## Known limitations

- The reference site labels itself a draft preview; its sample result path returned part products after a full-Qur'an selection. The local app deliberately enforces compatibility rather than copying that behavior.
- Only a representative desktop reference path was exercised; reference mobile rendering and every answer permutation were not verified.
- Product facts in the live store are not yet sufficiently normalized for reliable reader suitability, large print, Hifz, edition coverage, and possibly publisher matching.
- A public catalogue endpoint is available, but endpoint stability, CORS behavior, production caching policy, and a staging deployment contract remain to be confirmed.
- The current app intentionally has no live products, API, analytics, cart actions, deployment configuration, or real product imagery.

## Out of scope

No production credentials were requested; no production site, database, or server was modified; nothing was deployed or pushed to GitHub.
