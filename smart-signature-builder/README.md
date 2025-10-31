██████╗ ███████╗██╗   ██╗███████╗██╗  ██╗██╗████████╗███████╗ █████╗  ██╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██╔════╝██║ ██╔╝██║╚══██╔══╝██╔════╝██╔══██╗███║██╔════╝ 
██║  ██║█████╗  ██║   ██║███████╗█████╔╝ ██║   ██║   ███████╗╚██████║╚██║███████╗ 
██║  ██║██╔══╝  ╚██╗ ██╔╝╚════██║██╔═██╗ ██║   ██║   ╚════██║ ╚═══██║ ██║██╔═══██╗
██████╔╝███████╗ ╚████╔╝ ███████║██║  ██╗██║   ██║   ███████║ █████╔╝ ██║╚██████╔╝
╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝ ╚════╝  ╚═╝ ╚═════╝ 


# Smart Signature Builder

A single-page React + TypeScript application for crafting email signatures visually and exporting robust HTML that stays faithful across mail clients.

## Stack
- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Zustand](https://github.com/pmndrs/zustand) for global state with localStorage sync
- Vanilla CSS handcrafted for a focused UI

## Getting Started
```bash
npm install
npm run dev
```
The dev server boots on the default Vite port (`http://localhost:5173`).

## Usage Tips
- **Presets**: Start from one of the built-in looks (Clean, Terminal Green, Card Left, Centered Minimal) or duplicate a preset to create your own reusable style.
- **Live preview**: The canvas renders the exact HTML that will be exported. Toggle the terminal theme for a CRT-inspired layout.
- **Logo uploads**: Images are encoded as base64 and persisted locally.
- **Banner CTA**: Add an optional fundraising or promo banner with a direct link.
- **Exporting**:
  - *Copy HTML* sends the table-based markup to your clipboard.
  - *Download .html* saves the snippet for sharing.
  - *Copy as Base64 `<img>`* renders a 2× PNG via canvas and copies the Data URL for tools that prefer image signatures.
- **Autosave**: Everything is stored in `localStorage`; use the Reset button to return to defaults.

## Project Layout
```
src/
  App.tsx             # Layout wiring editor, preview, exports
  components/         # EditorPanel, Preview, ExportBar, SocialIcon
  store/              # Zustand store with presets and palette
  utils/exporters.ts  # HTML generation helpers
  types.ts            # Shared TypeScript types
```

Feel free to customize palettes, add more presets, or integrate different iconography—the exporter inlines SVG data URIs for maximum compatibility.
