# Smart Signature Builder CLI

The CLI companion renders Smart Signature Builder profiles to standalone HTML/PNG files.

## Usage

```bash
npm run build -w packages/cli
node packages/cli/bin/ssb.js render --config apps/web/sample.signature.json --out dist/signature.html --png dist/signature.png
```

Render all profiles from a bundle and publish static HTML pages:

```bash
node packages/cli/bin/ssb.js render --config apps/web/sample.signature.json --out dist/signatures --publish
```

The CLI reuses the shared renderer package so HTML output matches the web app.
