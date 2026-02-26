# Mewgenics Cat Visual Organizer

This project can be run locally
or by visiting the web url:

 https://wybebosch.github.io/mewgenics-cat-visualiser/

## Features

- Upload your .sav file and we parse it to get the cats out of it
- Visualize cat relationships and attributes
- No persistent storage or editing
(Yall can just use some other mod to edit your game)

## Smaller things explained

### What does each icon mean?

**Stat Icons:**

| Stat | Icon | Meaning |
|------|------|---------|
| STR  | 💪   | Strength |
| DEX  | 🏹   | Dexterity |
| CON  | ➕   | Constitution |
| INT  | 💡   | Intelligence |
| SPD  | 🥾   | Speed |
| CHA  | 💋   | Charisma |
| LCK  | 🍀   | Luck |

**Other Info Icons:**

| Info        | Icon | Meaning         |
|-------------|------|----------------|
| Libido      | 💕   | Cat's libido    |
| Aggression  | 😾   | Aggression      |
| Loves       | ❤️   | Cats they love  |
| Hates       | ⚔️   | Cats they hate  |
| Mutations   | 🧬   | Genetic mutations |

**Sex Icons:**

| Sex    | Icon |
|--------|------|
| Male   | ♂    |
| Female | ♀    |
| Herm   | ⚥    |

**Cats whose matching partner is in another room**
There is the 💞 column

If a cat has a matching partner (they both love each other) but are not in the same room, an icon is shown: 🕵️‍♂️.

---

### What are other features (kittens)

Kittens are shown in the table and graph. Their relationships, stats, and mutations are visualized just like adult cats. You can see parentage and connections, making it easy to track family trees and breeding outcomes.

---

## How does the graph work

The graph visualizes cat relationships:

**Lines:**

| Example | Meaning |
|---------|--------|
| <svg width="32" height="8"><line x1="0" y1="4" x2="30" y2="4" stroke="#4ade80" stroke-width="2"/></svg> | Loves (❤️) |
| <svg width="32" height="8"><line x1="0" y1="4" x2="30" y2="4" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/></svg> | Hates (⚔️) |
| <svg width="32" height="8"><line x1="0" y1="4" x2="30" y2="4" stroke="#60a5fa" stroke-width="2"/></svg> | Parent-child |
| <svg width="32" height="8"><line x1="0" y1="4" x2="30" y2="4" stroke="#c084fc" stroke-width="2" stroke-dasharray="2,2"/></svg> | Separated matching partners (💞) |

**Why use the graph?**

The graph helps you quickly see complex relationships, clusters, and family trees. It's useful for:

- Spotting love/hate triangles
- Finding separated partners
- Visualizing mutations and stats across generations
- Understanding connections that are hard to see in a table

---

All icons and colors are defined in `src/config/config.jsx`.


## Project Structure

- `src/` — Frontend code (React, Vite)
- `get-the-data/` — Scripts and data files for extracting and preparing cat data
- `package.json` — Project dependencies and scripts
- `vite.config.js` — Vite configuration

## Deployment

You can deploy this project to GitHub Pages for a live view. See instructions in this README or ask for help.

---

## How to Use locally

1. Run `npm install` to install dependencies.
2. Start the local server with `npm run dev`.
3. Upload or load your cat data JSON file.


## How to use on the web

https://wybebosch.github.io/mewgenics-cat-visualiser/
