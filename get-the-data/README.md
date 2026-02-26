# get-the-data

This folder contains scripts and data files for extracting cat information from Mewgenics save files.

## Contents

- `mewgenics_extract.py` — Python script for extracting cat data
- `mewgenics_cats.json` / `mewgenics_cats_old.json` — Example cat data files
- `steamcampaign01.sav` — Example save file
- `__pycache__/` — Python cache files (ignored)

## Usage

Run the extraction script to generate JSON files for use in the main app.

## Git Ignore

The following files and folders in this directory are currently ignored by git:

- `.env` — Environment files
- `__pycache__/` — Python cache files
- `mewgenics_cats.json` — Generated cat data
- `steamcampaign01.sav` — Save file

Other ignored files (like `node_modules/`, `.claude/`) are listed in the main README.

---

## How to Generate Cat Data

You have two options to create cat data for use in the visualizer:

1. **Python Script (Local File):**
	- Run `mewgenics_extract.py` to extract cat data from a save file and generate a `.json` file on your drive.
	- Place the resulting `.json` file in this folder.

2. **Browser (JavaScript + SQL WASM):**
	- Use the web app to upload a save file and extract cat data directly in your browser using JavaScript and SQL WASM.
	- No need to generate a local file; everything happens client-side.

---

## License

MIT
