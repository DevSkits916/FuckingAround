# `.signature.json` Schema

The Smart Signature Builder exports a portable configuration file with the extension `.signature.json`. The document contains the app schema version, export timestamp, and the full signature state.

```json
{
  "schemaVersion": "2.0.0",
  "exportedAt": "2024-05-01T12:34:56.000Z",
  "data": {
    "version": "2.0.0",
    "identity": {
      "name": "Alex Lee",
      "title": "Director of Product",
      "secondaryTitle": "Smart Signature Builder",
      "tagline": "Helping teams build email trust",
      "pronouns": "they/them",
      "phone": "+1 (555) 123-4567",
      "secondaryPhone": "+1 (555) 987-6543",
      "email": "alex@example.com",
      "website": "https://example.com",
      "address": "123 Market Street, San Francisco, CA"
    },
    "social": [
      {
        "id": "social-id",
        "label": "LinkedIn",
        "platform": "linkedin",
        "url": "https://linkedin.com/in/alex",
        "username": "alex"
      }
    ],
    "customFields": [
      {
        "id": "custom-id",
        "key": "Office",
        "value": "HQ — 5th Floor"
      }
    ],
    "theme": {
      "baseFont": "sans",
      "baseFontSize": 14,
      "lineHeight": 1.4,
      "primary": "#0a84ff",
      "text": "#1f2933",
      "subtleText": "#52606d",
      "divider": "#d9e2ec",
      "background": "#ffffff"
    },
    "nodes": [
      {
        "id": "element-id",
        "type": "text",
        "x": 48,
        "y": 48,
        "text": "Thanks for reading!",
        "fontSize": 14
      },
      {
        "id": "logo",
        "type": "image",
        "x": 0,
        "y": 0,
        "alt": "Company logo",
        "dataUri": "data:image/png;base64,...",
        "maxWidth": 140
      },
      {
        "id": "html",
        "type": "customHtml",
        "x": 120,
        "y": 80,
        "html": "<table>…</table>"
      }
    ],
    "selectedIds": [],
    "showGrid": true,
    "snapToGrid": true,
    "snapToAlignment": true,
    "spacingInspector": true,
    "readOnlyPreview": false,
    "watermark": {
      "text": "",
      "enabled": false
    },
    "terminalTheme": false
  }
}
```

### Field Notes

- `schemaVersion` increments when breaking changes are introduced. Phase Two uses `2.0.0`.
- `identity` values map to the primary contact details rendered in both modern and table exports.
- `social` entries support arbitrary platforms. Unknown platforms can provide `customIconDataUri` with base64 SVG/PNG content.
- `nodes` describe positioned elements on the design canvas. Supported `type` values:
  - `text`: basic text block, optional `fontFamily`, `fontSize`, `lineHeight`, etc.
  - `image`: inline image data or remote URL (`dataUri` is preferred for exports).
  - `link`: text link with `href`.
  - `divider`: horizontal or vertical line with thickness.
  - `customHtml`: preserved markup when parsing imports.
  - `group`: container that owns `children` node IDs for grouped alignment.
- `watermark` text is only rendered in PNG exports when `enabled` is `true`.
- `terminalTheme` toggles the faux CRT preview styling; HTML exports remain clean regardless of this flag.

### Preset Files

Preset exports (`.preset.json`) wrap the same signature schema within a lightweight envelope:

```json
{
  "version": "2.0.0",
  "preset": {
    "id": "left-rail",
    "name": "Left Rail",
    "signature": { "version": "2.0.0", "identity": { "name": "…" }, "nodes": [ … ] }
  }
}
```

### Compatibility

- The editor stores only the `data` portion of the schema in `localStorage`.
- Future schema versions must preserve backward compatibility through migration in `useSignatureStore`.
