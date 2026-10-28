# Comet Wallet landing

The Comet Wallet site, plus the payment-link checkout at `/payments/:code`.

```bash
npm install
npm run dev -- --host --port 3002   # --host lets a phone on the same Wi-Fi open it
npm test                            # payment-link helpers
npm run build
```

## Payment-link checkout

Links are created from the app's Receive screen. Comet-dashboard builds them as `<CHECKOUT_PAGE_BASE_URL>/payments/<short_code>`, so set `CHECKOUT_PAGE_BASE_URL` on the dashboard to this site's origin (`https://cometagri.com` in production). `/payment-links/:code` redirects to `/payments/:code`.

The payer picks one of two methods:

- **M-Pesa** (KES links only). An STK push is sent to their phone, and the page polls until the callback lands.
- **Comet Wallet**. Phones get an "Open Comet Wallet" button (`cometwallet://pay/<code>`). Larger screens get a QR of the page URL to scan with the app. The payer confirms with their PIN in the app, and this page notices the payment by polling.

Either way, the link creator's wallet is credited. `?source=app` hides the wallet option; the app uses it for its own M-Pesa webview.

The page calls the dashboard's public API under `/api/v1/payment-links`: `GET /:code/status`, `POST /pay/momo` and `POST /:code/invoice`.

| Where | How the API is reached |
|---|---|
| Dev | Vite proxies `/api` to `COMET_API_URL` (default `http://localhost:8092`). The browser only talks to its own origin. |
| Production build | The browser calls `VITE_COMET_API_URL` (default `https://cometapi.mamlakapsp.com`). Add this site's origin to the dashboard's `CORS_ALLOWED_ORIGINS`. |

Host the build with an SPA fallback (every path serves `index.html`), as the legal pages already need.

---

## Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
