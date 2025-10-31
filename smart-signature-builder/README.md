# Smart Signature Builder — Phase Two

Smart Signature Builder is a zero-backend Vite + React + TypeScript application for designing email signatures and exporting them in email-client-safe formats. Phase Two expands on the original editor with import tooling, presets 2.0, accessibility checks, and richer export pathways.

## ✨ Highlights

- **Import anything** – paste raw HTML signatures or load `.signature.json`/`.preset.json` files. Unknown markup is preserved as custom blocks that can be repositioned.
- **Layout tools** – snap-to-grid, alignment actions, grouping, element locking, and spacing inspector keep designs tidy.
- **Undo/redo history** – up to 50 operations kept in-memory, so you can explore safely without bloating localStorage.
- **Preset management** – ship with six presets, save your own variations locally, duplicate, import, and export presets.
- **Accessibility & linting** – WCAG contrast badges, tel/mailto normalization, and email client guardrails to avoid common pitfalls.
- **Robust exports** – modern div-based or table-based HTML, single-file bundle with embedded data URIs, multi-DPR PNG (with optional watermark), and shareable `.signature.json` config files.
- **Read-only preview** – toggle to verify the exported output exactly as recipients will see it.

## 🧰 Stack & Tooling

- Vite + React 18 + TypeScript
- Zustand state store with undo/redo history helpers
- html-to-image for PNG renders
- Vitest + Testing Library for unit tests

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` to launch the editor. The current design and preferences persist to `localStorage` under the key `smartSignature.v2`. Undo/redo history stays in memory only.

### Scripts

| Command        | Description                           |
| -------------- | ------------------------------------- |
| `npm run dev`  | Start the Vite development server     |
| `npm run build`| Type-check and build for production   |
| `npm run test` | Run Vitest unit tests                 |
| `npm run lint` | Type-check without emitting files     |

## 🖱️ Editor Overview

### Panels

- **Identity & Theme** – manage name, roles, pronouns, phones, tagline, custom fields, color palette, and watermark.
- **Canvas** – add text or custom HTML blocks, snap to 4px grid, lock elements, and inspect spacing. Keyboard nudges and shortcuts work even when focus leaves the canvas.
- **Alignment Toolbar** – align edges or centers, group/ungroup, and nudge elements via buttons.
- **Presets** – load any of the six built-ins (Clean Default, Terminal Green, Card Left, Centered Minimal, Left Rail, Badge Row) or save/duplicate/import/export your own.
- **Import** – drag in `.signature.json`, `.preset.json`, `.html`, or paste HTML directly to rebuild a signature model.
- **Preview & Export** – review table-based output, inspect modern HTML, export HTML/PNG/JSON, and monitor contrast + lint warnings.

### Keyboard Shortcuts

| Shortcut                   | Action                      |
| -------------------------- | --------------------------- |
| `Ctrl/Cmd + Z`             | Undo                        |
| `Ctrl/Cmd + Shift + Z`     | Redo                        |
| `Ctrl/Cmd + D`             | Duplicate selected nodes    |
| `Delete`                   | Remove selected nodes       |
| `Arrow Keys`               | Nudge selected nodes 1px    |
| `Shift + Arrow Keys`       | Nudge selected nodes 8px    |

## 📥 Importing

- **HTML signatures**: Paste HTML into the Import panel or upload an `.html` file. The parser maps tables, inline styles, links, and images into model nodes; anything ambiguous becomes a movable Custom HTML block.
- **Configuration JSON**: Load `.signature.json` exports to fully restore a design, including theme tokens, custom fields, and watermark settings.
- **Presets**: Import `.preset.json` bundles to add them to your local preset library.

## 📤 Exporting

- **HTML (Table-based)**: Inline-styled table markup optimized for Outlook and legacy clients.
- **HTML (Modern)**: Flexbox-friendly div layout for modern webmail clients.
- **Single-file HTML**: A shareable HTML file with embedded resources and a metadata `<meta>` comment containing export timestamp, app version, and serialized config.
- **PNG (2× / 3×)**: Canvas renders with optional watermark (PNG only) for scenarios requiring raster signatures.
- **`.signature.json`**: Schema-versioned config storing the complete signature state for portability.

## 📱 iOS Mail Paste Steps

1. Export the HTML (table-based recommended).
2. Send the HTML file or rendered preview to your iPhone (AirDrop or email).
3. Open the HTML in Safari, tap and hold to copy the rendered signature.
4. Paste into Settings → Mail → Signature.

## 📧 Email Client Tips

- Keep images ≤ 640px wide and always include alt text.
- Avoid external fonts, scripts, or video tags—most clients block them.
- Ensure tel/mailto links are correctly formatted; the exporter normalizes when possible.
- Use the contrast badge to ensure WCAG AA compliance for both light and dark contexts.

## 🧾 Schema

The `.signature.json` format is documented in [`schema.md`](./schema.md). Sample payloads are provided in [`sample.signature.json`](./sample.signature.json) and [`sample.html`](./sample.html) for quick testing.

## 🔁 Resetting

Use the **Reset App** control in the editor (Settings section) or clear browser storage for `smartSignature.v2` to restore default presets and state.

Enjoy crafting professional, portable signatures! ✉️
