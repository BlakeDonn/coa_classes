"""Build a file:// friendly JavaScript dataset for the static CoA explorer."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path


HERE = Path(__file__).resolve().parent
GUIDE = HERE.parent / "coa-classes-and-specs-2026-08-05.md"
CURRENT = HERE.parent / "snapshot" / "coa-current-data.json"
COMMUNITY = HERE.parent / "snapshot" / "community-builds.json"
OUTPUT = HERE / "data.js"

CLASS_COLORS = {
    "Barbarian": "#c79c6e", "Witch Doctor": "#39d994", "Felsworn": "#a95be0",
    "Witch Hunter": "#abd473", "Stormbringer": "#4da2ff", "Knight of Xoroth": "#e14f64",
    "Guardian": "#ff8f38", "Templar": "#f48cba", "Bloodmage": "#999af0",
    "Ranger": "#aad372", "Chronomancer": "#54d5f7", "Necromancer": "#8ca05b",
    "Pyromancer": "#ff6638", "Cultist": "#b35cff", "Starcaller": "#ded9ff",
    "Sun Cleric": "#ffd54f", "Tinker": "#d9a441", "Venomancer": "#58e65f",
    "Reaper": "#93a2b2", "Primalist": "#bc784c", "Runemaster": "#668cff",
}

TAG_RULES = {
    "Pets": r"\b(pet|pets|minion|minions|summon|summons|army|hound|falcon|elemental|undead|imp|drone|turret|companion)\b",
    "DoTs": r"\b(dot|dots|damage-over-time|periodic|disease|diseases|bleed|bleeds|ignite|rot|wither)\b",
    "Burst": r"\b(burst|detonat|execute|payoff|cash out|window)\b",
    "Control": r"\b(control|stun|slow|root|pull|silence|trap|banish|freeze)\b",
    "Mobility": r"\b(mobile|mobility|charge|dash|teleport|leap|pursuit|moving)\b",
    "Shields": r"\b(shield|shields|barrier|barriers|absorb|block)\b",
    "Forms": r"\b(form|forms|transform|transformation|shapeshift|aspect|incarnation)\b",
    "Raid buffs": r"\b(raid buff|party buff|group amplification|war cry|haste.*all|aura|support)\b",
    "Healing": r"\b(heal|heals|healer|healing|recovery|sustain)\b",
    "Deployables": r"\b(cauldron|totem|turret|device|devices|object|zone|pyre|factory|beacon)\b",
}


def clean(text: str) -> str:
    return text.replace("’", "'").strip()


def parse_guide() -> list[dict]:
    text = GUIDE.read_text(encoding="utf-8")
    sections = list(re.finditer(r"^## (\d+)\. (.+)$", text, re.MULTILINE))
    classes = []
    for index, match in enumerate(sections):
        end = sections[index + 1].start() if index + 1 < len(sections) else text.index("\n## What the freshest", match.end())
        body = text[match.end():end].strip()
        intro = body.split("\n\n- **", 1)[0].strip()
        specs = []
        pattern = re.compile(r"^- \*\*(.+?): (.+?)\.\*\* (.+)$", re.MULTILINE)
        for spec_match in pattern.finditer(body):
            name, descriptor, summary = map(clean, spec_match.groups())
            descriptor_lower = descriptor.lower()
            roles = []
            if "dps" in descriptor_lower:
                roles.append("Damage")
            if "tank" in descriptor_lower:
                roles.append("Tank")
            if "healer" in descriptor_lower:
                roles.append("Healer")
            if "support" in descriptor_lower:
                roles.append("Support")
            combat = []
            if "melee" in descriptor_lower or "shield" in descriptor_lower:
                combat.append("Melee")
            if "ranged" in descriptor_lower:
                combat.append("Ranged")
            if not combat:
                combat.append("Hybrid")

            load_match = re.search(
                r"(very high|moderate-to-high|low-to-moderate|high|moderate|low)\b(?: [a-z]+){0,2} load",
                descriptor_lower,
            )
            load_label = load_match.group(1).replace("-to-", " to ").title() if load_match else "Unrated"
            load_value = {
                "Low": 1, "Low To Moderate": 2, "Moderate": 3,
                "Moderate To High": 4, "High": 4, "Very High": 5,
            }.get(load_label, 0)
            searchable = f"{name} {descriptor} {summary}"
            tags = [label for label, rule in TAG_RULES.items() if re.search(rule, searchable, re.IGNORECASE)]
            specs.append({
                "name": name,
                "descriptor": descriptor,
                "summary": summary,
                "roles": roles,
                "combat": combat,
                "load": {"label": load_label, "value": load_value},
                "tags": tags,
            })
        classes.append({
            "order": int(match.group(1)),
            "name": match.group(2),
            "intro": clean(intro),
            "color": CLASS_COLORS[match.group(2)],
            "specs": specs,
        })
    return classes


def enrich(classes: list[dict]) -> None:
    current = json.loads(CURRENT.read_text(encoding="utf-8"))
    community = json.loads(COMMUNITY.read_text(encoding="utf-8"))

    talent_index = {}
    for coa_class in current["classes"]:
        for spec in coa_class["specializations"]:
            nodes = sorted(spec["talent_nodes"], key=lambda node: (node["y"], node["x"]))
            last_row = max(node["y"] for node in nodes)
            notable = [node for node in nodes if node["y"] == 0]
            notable += [node for node in nodes if node["y"] >= last_row - 1]
            names = []
            for node in notable:
                if node["name"] not in names:
                    names.append(node["name"])
            talent_index[(coa_class["name"], spec["name"])] = names[:6]

    builds_by_spec = defaultdict(list)
    class_id_to_name = {coa_class["id"]: coa_class["name"] for coa_class in current["classes"]}
    spec_id_to_name = {
        (coa_class["id"], spec["id"]): spec["name"]
        for coa_class in current["classes"] for spec in coa_class["specializations"]
    }
    for build in community["all_ranked_build_metadata"]:
        key = (class_id_to_name[build["class_id"]], spec_id_to_name[(build["class_id"], build["spec_id"])])
        builds_by_spec[key].append(build)

    for coa_class in classes:
        for spec in coa_class["specs"]:
            key = (coa_class["name"], spec["name"])
            builds = builds_by_spec[key]
            top = max(builds, key=lambda build: (build["score"], build["updated_at"])) if builds else None
            spec["notable"] = talent_index.get(key, [])
            spec["community"] = {
                "count": len(builds),
                "roles": dict(Counter(build["role"] for build in builds)),
                "topTitle": top["title"] if top else None,
                "topUrl": f"https://coabuildhub.com/build/{top['id']}" if top else None,
                "latestUpdate": max((build["updated_at"] for build in builds), default=None),
            }


def main() -> None:
    classes = parse_guide()
    enrich(classes)
    payload = {
        "generated": "2026-08-05",
        "classCount": len(classes),
        "specCount": sum(len(coa_class["specs"]) for coa_class in classes),
        "communityBuildCount": 177,
        "classes": classes,
    }
    OUTPUT.write_text(
        "window.COA_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT} with {payload['classCount']} classes and {payload['specCount']} specs")


if __name__ == "__main__":
    main()
