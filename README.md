# Smart Signature Builder – Phase Three

This monorepo hosts the Phase Three release of the Smart Signature Builder suite:

- **apps/web** – Vite + React progressive web app with offline-first editing, multi-profile libraries, pack manager, share links, and render queue.
- **packages/shared** – Schema v3 models and shared rendering utilities used by both the web app and the CLI.
- **packages/cli** – Node CLI (`ssb`) for batch rendering signatures to HTML/PNG and publishing static bundles.
- **e2e** – Playwright end-to-end specifications covering profile creation, pack import/export, and share link workflows.

## Getting Started

```bash
npm install
npm run dev     # starts the web editor
npm run build   # type-check + build web + CLI
npm test        # unit + e2e tests
```

The web app ships as a PWA with a service worker, manifest, and offline cache. Use the **Profiles** drawer to create, duplicate, rename, and bundle signatures. The **Library** panel exposes reusable Avatar, Contact, Social Row, Banner, and Custom HTML blocks with master style support. Packs can be imported/exported as `.pack.zip` bundles containing presets, themes, and assets.

## Cloud Sync

Cloud synchronisation is feature-flagged. Set `VITE_CLOUD_SYNC=true` (or `CLOUD_SYNC=true` in the environment) before building to enable the sync indicator and stub provider. The app continues to operate fully offline when the flag is absent.

## Share & Publish

Use the **Share link** action to generate a compressed hash-based URL and QR code. Publishing creates a static bundle of HTML pages cached via OPFS for offline viewing. The render queue processes exports in a worker and logs local telemetry only.

## CLI

```bash
npm run build -w packages/cli
node packages/cli/bin/ssb.js render --config path/to/profile.json --out dist/signature.html --png dist/signature.png
```

The CLI also accepts `.profiles.json` bundles with `--publish` to emit an index and per-profile pages.

## Testing

- **Unit:** Vitest coverage for compression, HTML linting, and export rendering.
- **E2E:** Playwright specs (see `e2e/specs`) validate profile authoring, theme packs, and share link round-trips.

## Packs & Schema

- **Pack format:** `.pack.zip` files must include `/presets/*.json`, `/themes/*.json`, and optional `/assets/*`. Assets are imported as base64 data URIs and validated for size/type.
- **Schema v3:** Libraries store `profiles`, `packs`, `masterStyles` keyed by component type, and global `settings` (language, telemetry, UTM presets). Each profile records `components`, `theme` tokens, and per-profile settings including UTM selection.

Reference the starter pack under `apps/web/sample-packs/starter`. Run `npm run generate:starter-pack` to materialise `apps/web/starter.pack.zip` from the checked-in base64 snapshot before importing it in the app or end-to-end tests. Legacy v1/v2 signatures are migrated on import with warnings where applicable.

## Automation

Run the CLI in CI to publish static HTML:

```bash
npm ci
npm run build
node packages/cli/bin/ssb.js render --config apps/web/sample.signature.json --out dist/signatures --publish
```
