# Mewgenics - Visual cat organizer

This project can be run locally
or by visiting the web url: </br>
https://wybebosch.github.io/mewgenics-cat-visualiser/

This project is only meant as a visualiser, you cannot edit your save file with it.
<img width="1415" height="1259" alt="afbeelding" src="https://github.com/user-attachments/assets/2deeb3e3-6eb4-4e72-8600-fa6fd55a1d30" />


---

## Features

- Upload your .sav file and we parse it to get the cats out of it
- Visualize cat relationships and attributes
- No persistent storage or editing
  (Yall can just use some other mod to edit your game)

## Smaller things explained

### What does each icon mean?

**Stat Icons:**

| Stat | Icon | Meaning      |
| ---- | ---- | ------------ |
| STR  | 💪   | Strength     |
| DEX  | 🏹   | Dexterity    |
| CON  | ➕   | Constitution |
| INT  | 💡   | Intelligence |
| SPD  | 🥾   | Speed        |
| CHA  | 💋   | Charisma     |
| LCK  | 🍀   | Luck         |

**Other Info Icons:**

| Info       | Icon | Meaning        |
| ---------- | ---- | -------------- |
| Libido     | 💕   | Cat's libido   |
| Aggression | 😾   | Aggression     |
| Loves      | ❤️   | Cats they love |
| Hates      | ⚔️   | Cats they hate |

**Sex Icons:**

| Sex    | Icon |
| ------ | ---- |
| Male   | ♂    |
| Female | ♀    |
| Herm   | ⚥    |

**Cats whose matching partner is in another room**
There is the 💞 column

If a cat has a matching partner (they both love each other) but are not in the same room, an icon is shown: 🕵️‍♂️.

---

## How to use on the web

https://wybebosch.github.io/mewgenics-cat-visualiser/

## How to Use locally

1. Run `pnpm install` to install dependencies.
2. Start the local server with `pnpm run dev`.
3. Upload or load your cat data JSON file.

## Developer workflow

### Build and preview

- Dev server: `pnpm run dev`
- Production build: `pnpm run build`
- Preview production build: `pnpm run preview`

### Linting

- Lint everything: `pnpm run lint`
- Lint + auto-fix everything: `pnpm run lint:fix`
- JS/JSX only: `pnpm run lint:js`
- CSS only: `pnpm run lint:styles`
- Other text/config files (`json/md/yaml/yml/mjs/cjs`): `pnpm run lint:other`

### Formatting

- Check formatting: `pnpm run format:check`
- Write formatting: `pnpm run format:write`

### Editor setup

- Shared settings are committed in `.vscode/settings.json` and `.vscode/extensions.json`.
- On save, VS Code runs Prettier formatting plus ESLint/Stylelint fix actions.
- `.editorconfig` provides cross-editor basics (tabs, line endings, final newline).

---

## Releases (GitHub + Pages)

This project uses the `version` in `package.json` as the app version shown in browser console.
On startup, the app logs:

`Mewgenics cat tracker vX.Y.Z`

So you can quickly verify which deployed build is currently served by GitHub Pages.

### Release flow

1. Make sure you are on `main` with clean working tree.
2. Bump `package.json` version (manual edit or optional command):
    - Patch: `pnpm run patch`
    - Minor: `pnpm run minor`
    - Major: `pnpm run major`
3. Commit and push (example commit message: `release: v1.0.1`).
4. In GitHub UI, create/publish a Release for that version tag (for example `v1.0.1`).
5. GitHub Actions workflow (`.github/workflows/release-pages.yml`) runs on release publish:
    - builds the app
    - deploys to GitHub Pages
    - deploys exactly the release tag commit

### Verifying a new release

1. Open the deployed website.
2. Open browser devtools console.
3. Confirm logged version matches your tag/release (for example `v1.0.1`).
4. If Pages/CDN cache is delayed, hard refresh and re-check the console version line.

---

## Styling conventions (Native CSS + nesting)

- Use native CSS files (no Tailwind, no CSS modules).
- Use one CSS file per React component, co-located next to the component file.
- Use short, component-scoped class names (avoid long BEM chains).
- Prefer native CSS nesting to keep selectors close to their component root.
- Keep defaults as base styles, and only add classes for exceptions/states. - Base: `.cell` - Optional state: `.stat-high` - Avoid adding a class for the common/default case if it can be the base rule.
- Scope short state classes under a local component root to avoid collisions.
- Keep global styles minimal: - `src/styles/tokens.css` for shared CSS custom properties. - `src/styles/base.css` for reset/base rules.
- Import global CSS once in `src/index.jsx`, and each component CSS inside its own component file.
