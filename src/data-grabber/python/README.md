# Mewgenics Cat Extractor (Python)

Extracts cat data from a Mewgenics save file (`steamcampaign01.sav`) to `mewgenics_cats.json`.

- Looks for the save in this folder, or at a path you provide, or from a `.env` variable.

## Usage

Run with no arguments (looks for `steamcampaign01.sav` in the current folder, or uses `.env` variable for path if present):

```sh
python mewgenics_extract.py
```

Or pass the save path directly: (make sure to use quotes)

```sh
python mewgenics_extract.py "C:/path/to/steamcampaign01.sav"
```

## Requirements

- Python 3 (standard library only)
- Windows-only process check

## Features

- Only cats with room assignments
- Includes stats, lineage, traits
- Prompts before overwriting JSON

## Example Output

```
==============================
Reading save from:
[.env file]

Path:
["C:/Users/.../Mewgenics/.../steamcampaign01.sav"]
==============================

Total cats found: [43]
Found [43] cats with room assignments
Fetched [26] additional ancestor blobs for name lookups

==============================
Updated .json file at :
["./mewgenics_cats.json"]
==============================
```

Example `mewgenics_cats.json`:

```json
[
	{
		"name": "Snoozy",
		"id": "snoozy",
		"sex": "male",
		"STR": 6,
		"DEX": 5,
		"CON": 7,
		"INT": 6,
		"SPD": 5,
		"CHA": 6,
		"LCK": 4,
		"libido": "average",
		"libido_raw": 0.4264,
		"aggression": "high",
		"aggression_raw": 0.723,
		"loves": "Madame Maxime",
		"hates": "Omry",
		"room": "Attic",
		"stray": false,
		"parent1": "Lucille",
		"parent2": "Fatman",
		"grandparent1": "",
		"grandparent2": "",
		"grandparent3": "",
		"grandparent4": "",
		"saveDay": 113,
		"birthday": 38,
		"script_start_time": "2026-02-26T12:01:14"
	}
]
```
