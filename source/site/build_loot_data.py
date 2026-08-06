"""Build the recommended level 45-60 Chronomancer loot dataset."""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPORTS = HERE.parents[1]
SOURCE_MD = REPORTS / "lootcollector-chrono-level45-60.md"
SOURCE_CSV = REPORTS / "lootcollector-chrono-level45-60-complete.csv"
OUTPUT = HERE / "loot-data.js"


def main() -> None:
    with SOURCE_CSV.open(encoding="utf-8-sig", newline="") as handle:
        rows = {row["item_id"]: row for row in csv.DictReader(handle)}

    band = None
    slot = None
    rank_by_group = defaultdict(int)
    items = []
    bullet = re.compile(r"^- (.+?) \(ID (\d+), requires (\d+), (.*?), score (-?[\d.]+)\): (.+)$")
    for line in SOURCE_MD.read_text(encoding="utf-8").splitlines():
        if line.startswith("## Requires levels "):
            band = line.removeprefix("## Requires levels ").replace("–", "-")
            slot = None
            continue
        if line.startswith("### ") and band:
            slot = line.removeprefix("### ").strip()
            continue
        if not (band and slot and line.startswith("- ")):
            continue
        match = bullet.match(line)
        if not match:
            raise ValueError(f"Could not parse recommended item: {line}")
        name, item_id, required_level, stat_text, score, location = match.groups()
        raw = rows[item_id]
        group = (band, slot)
        rank_by_group[group] += 1
        rank = rank_by_group[group]
        priority = "Top target" if rank == 1 else "Strong" if rank <= 3 else "Alternative"
        status_match = re.search(r"\[(CONFIRMED|FADING|STALE)\]", location)
        status = status_match.group(1).title() if status_match else "Unknown"
        zones = []
        if location != "no known location":
            for part in location.split(";"):
                zone = re.sub(r"\s+\d+(?:\.\d+)?,\s*\d+(?:\.\d+)?\s+\[[A-Z]+\]", "", part).strip()
                if zone and zone not in zones:
                    zones.append(zone)
        stats = {
            label: float(raw[label]) if "." in raw[label] else int(raw[label])
            for label in ("spell_power", "intellect", "haste", "hit", "crit", "spirit", "mp5")
            if raw[label] and float(raw[label]) != 0
        }
        items.append({
            "id": int(item_id),
            "name": name,
            "requiredLevel": int(required_level),
            "itemLevel": int(raw["item_level"]),
            "band": band,
            "slot": slot,
            "quality": int(raw["quality"]),
            "subtype": raw["item_subtype"],
            "score": float(score),
            "statText": stat_text,
            "stats": stats,
            "priority": priority,
            "rankInBandSlot": rank,
            "location": location,
            "zones": zones,
            "status": status,
            "worldforged": raw["worldforged"] == "True",
            "collected": raw["collected"] == "True",
        })

    payload = {
        "generated": "2026-08-05",
        "character": "Writhkin",
        "levelRange": "45-60",
        "itemCount": len(items),
        "scoreWeights": {"Spell Power": 1.0, "Intellect": .8, "Haste": .65, "Hit": .45, "Crit": .4},
        "items": items,
    }
    OUTPUT.write_text("window.COA_LOOT = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(items)} recommended items")


if __name__ == "__main__":
    main()
