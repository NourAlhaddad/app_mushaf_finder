# Future Book Hub Integration

## Verified public-site observations

Research was performed against the public website on 2026-11-17; no account or administrative access was used.

- `thebookhub.ca` is WordPress with WooCommerce. WordPress REST API headers and `/wp-json/` identify WordPress; the namespace list includes `wc/store/v1`.
- Public site assets expose the Woodmart theme and Elementor. Headers indicate PHP 8.2 and Hostinger infrastructure.
- `GET /wp-json/wc/store/v1/products` returns public catalogue fields without credentials. A public product record includes canonical product URL, SKU, price/currency, images, categories, attributes, dimensions, and stock state.
- `GET /wp-json/wc/v3/products` returned 401 for a product listing. Do not put an API key in the browser or weaken administrative API permissions to support the finder.

This confirms the platform and a public read path, not a complete or stable integration contract. Public data quality and allowed browser origins still need verification on a staging site.

## Recommended approach: plugin + shortcode + built frontend

Use a small, version-controlled WordPress plugin to package a compiled Mushaf Finder frontend and connect it to WooCommerce. Register a shortcode such as `[mushaf_finder]`; place it in a normal WordPress page at `/mushaf-finder/`. The shortcode emits a single app mount point (`id="root"`, class `mushaf-finder-root`, `data-embedded="true"`) and enqueues hashed Vite assets only for that page. The embedded mode hides the standalone Book Hub header/footer, retains the interface-language selector, and lets the existing WordPress header/footer and navigation frame the feature. Its CSS selectors are scoped to `.mushaf-finder-root` to avoid changing Woodmart/Elementor or WooCommerce styles outside the app. It uses normal Book Hub product links and avoids iframe sizing, cross-origin communication, and a second customer-facing domain.

Suggested plugin layout:

```text
wordpress-plugin/mushaf-finder/
  mushaf-finder.php            plugin entry; registers shortcode/assets
  includes/
    rest-controller.php        same-origin read-only catalogue endpoint
    product-mapper.php         WooCommerce product -> app schema
    cache.php                  short-lived catalogue cache
  build/                       versioned Vite output and manifest
```

The plugin is a future deliverable; this local project does not currently include or install it.

### Rendering and asset loading

Build the frontend as static assets with Vite's production manifest and relative asset paths. The plugin should read the manifest, enqueue the generated JS/CSS with versioned URLs, and output the app mount element. Load those assets only when the shortcode is present; do not modify the active theme or globally enqueue the app. Avoid inline executable code and preserve WordPress escaping/sanitization practices.

### Product retrieval

Preferred: a same-origin, read-only WordPress REST route that queries published, purchasable WooCommerce products server-side using WooCommerce product APIs, maps only approved public fields, and returns the normalized catalogue schema. This avoids browser CORS uncertainty and provides a stable boundary between WordPress product data and application logic. It does not require WooCommerce consumer keys: the site plugin runs inside WordPress and does not expose administrative credentials.

The public WooCommerce Store API is a viable read-only fallback for public fields, and was observed responding without authentication. It can supply live prices, currency, product permalinks, images, purchasability, stock status, dimensions, categories, and attributes. Use it only from a controlled same-origin/server-side adapter if its output fits the integration contract. Do not use the authenticated `/wc/v3` endpoint from the frontend.

The future endpoint returns only the normalized fields needed by the finder. Product page links should be the WooCommerce canonical permalink. Recommendations should link to the normal product page; no custom cart or checkout flow is necessary.

### Caching and performance

- Return a bounded, paginated set of relevant published Qur'an products, not the entire store.
- Use a short-lived server cache (initially 2–5 minutes) with a schema/versioned key. Reconsider the TTL against inventory freshness before launch.
- Invalidate or refresh relevant cache entries on WooCommerce product/stock updates.
- Defer nonessential images and use WooCommerce image sizes; do not send full descriptions if normalized metadata is sufficient.
- Surface endpoint failures rather than silently reverting to sample products in production.

### Security and privacy

- Never put WooCommerce REST consumer keys, admin credentials, or privileged nonces in browser code.
- The endpoint is a public read-only product feed: allow only published, publicly purchasable records and whitelist response properties.
- Escape shortcode markup and validate endpoint inputs. Apply sane request bounds and rate controls; do not accept arbitrary product queries or SQL.
- Keep questionnaire answers in-browser unless analytics are separately approved and privacy-reviewed. This local version sends no answers to Book Hub.
- Use HTTPS, least privilege, and WordPress's standard update/deployment process.

### Deployment and rollback

1. Confirm product mapping and data quality; implement and test the plugin in a local/staging WordPress copy, never against production while developing.
2. Build the static app and plugin, install the plugin in staging, add the shortcode to a staging page, and test desktop/mobile, language/RTL, product URLs, price, stock changes, cache invalidation, and no-match behavior.
3. Before any future production deployment, get explicit approval, take a database/files backup, deploy only the versioned plugin, and verify the page and checkout remain unchanged.
4. Roll back by removing the shortcode from the page and disabling the plugin (or restore the previous plugin version); existing WooCommerce products and checkout must not be modified by the finder.

No production changes, installation, or deployment were performed for this project.

## Other integration options considered

| Option | Assessment |
| --- | --- |
| Dedicated plugin | Recommended as the deployable owner of the shortcode, asset loading, endpoint, and cache invalidation. |
| Shortcode alone | Useful page insertion mechanism, but does not by itself provide a stable catalogue mapper or asset lifecycle. Implement the shortcode in the plugin. |
| Frontend assets in WordPress | Recommended rendering model when compiled assets are enqueued by the plugin only on the finder page. It keeps React reusable and avoids an iframe. |
| Direct WooCommerce API from browser | Public Store API may work for GETs, but cross-origin behavior and raw store schema are less controlled. Authenticated WooCommerce REST API is not appropriate for browser credentials. |
| Iframe | Not recommended: creates a separate app shell, complicates responsive sizing, styling, accessibility, and analytics. |
