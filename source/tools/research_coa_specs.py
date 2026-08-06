"""Snapshot the current CoA Build Hub skill and talent data for research.

The site is fan maintained, so generated files are evidence inputs rather than an
official source of truth.  The snapshot records its retrieval time and original
URLs so every later summary can distinguish current data from interpretation.
"""

from __future__ import annotations

import ast
import json
import re
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "reports" / "coa-specs" / "snapshot"
BASE = "https://coabuildhub.com/_next/"
RUNTIME_URL = BASE + "static/chunks/webpack-cff07e81b72589a4.js"
TALENTS_URL = BASE + "static/chunks/3171-e52ec0c0a3acef15.js"
TIER_LIST_URL = "https://coabuildhub.com/api/tier-list"

CLASSES = [
    (12, "Barbarian", "barbarian", [(31, 31, "Brutality"), (32, 32, "Headhunting"), (33, 33, "Ancestry")]),
    (13, "Witch Doctor", "witch-doctor", [(34, 34, "Voodoo"), (35, 35, "Brewing"), (36, 36, "Shadowhunting")]),
    (14, "Felsworn", "felsworn", [(37, 37, "Slayer"), (38, 38, "Infernal"), (18, 18, "Tyrant")]),
    (15, "Witch Hunter", "witch-hunter", [(39, 39, "Boltslinger"), (40, 40, "Houndmaster"), (94, 94, "Black Knight"), (41, 41, "Inquisition")]),
    (16, "Stormbringer", "stormbringer", [(42, 42, "Lightning"), (43, 43, "Wind"), (44, 44, "Maelstrom")]),
    (17, "Knight of Xoroth", "knight-of-xoroth", [(46, 46, "Hellfire"), (45, 45, "War"), (47, 47, "Defiance")]),
    (18, "Guardian", "guardian", [(7, 7, "Vanguard"), (48, 48, "Inspiration"), (49, 49, "Gladiator")]),
    (19, "Templar", "templar", [(50, 50, "Zealot"), (16, 16, "Oathkeeper"), (51, 51, "Crusader")]),
    (20, "Bloodmage", "bloodmage", [(26, 26, "Sanguine"), (52, 52, "Accursed"), (53, 53, "Eternal"), (93, 93, "Fleshweaver")]),
    (21, "Ranger", "ranger", [(2, 2, "Farstrider"), (54, 54, "Archery"), (55, 55, "Brigand")]),
    (22, "Chronomancer", "chronomancer", [(56, 56, "Infinite"), (57, 57, "Artificer"), (58, 58, "Time")]),
    (23, "Necromancer", "necromancer", [(59, 59, "Death"), (60, 60, "Rime"), (61, 61, "Animation")]),
    (24, "Pyromancer", "pyromancer", [(19, 19, "Flameweaving"), (62, 62, "Incineration"), (63, 63, "Draconic")]),
    (25, "Cultist", "cultist", [(64, 64, "Godblade"), (65, 65, "Corruption"), (66, 66, "Heretic"), (88, 88, "Dreadnought")]),
    (26, "Starcaller", "starcaller", [(67, 67, "Moon Guard"), (68, 68, "Moon Priest"), (69, 69, "Sentinel"), (89, 89, "Warden")]),
    (27, "Sun Cleric", "sun-cleric", [(70, 70, "Piety"), (71, 71, "Blessings"), (72, 72, "Seraphim"), (90, 90, "Valkyrie")]),
    (28, "Tinker", "tinker", [(73, 73, "Demolition"), (74, 74, "Invention"), (75, 75, "Mechanics")]),
    (29, "Venomancer", "venomancer", [(76, 76, "Venom"), (77, 77, "Stalking"), (78, 78, "Fortitude"), (92, 92, "Vizier")]),
    (30, "Reaper", "reaper", [(79, 79, "Harvest"), (80, 80, "Soul"), (81, 81, "Domination")]),
    (31, "Primalist", "primalist", [(82, 82, "Primal"), (83, 83, "Geomancy"), (84, 84, "Life"), (91, 91, "Mountain King")]),
    (32, "Runemaster", "runemaster", [(85, 85, "Runic"), (11, 11, "Arcane"), (86, 86, "Riftblade")]),
]

SKILL_MODULES = {
    "barbarian": 2574, "bloodmage": 3118, "chronomancer": 2555,
    "cultist": 6916, "felsworn": 3842, "guardian": 2241,
    "knight-of-xoroth": 9376, "necromancer": 8916, "primalist": 769,
    "pyromancer": 482, "ranger": 1002, "reaper": 5619,
    "runemaster": 8593, "starcaller": 4885, "stormbringer": 9374,
    "sun-cleric": 646, "templar": 8084, "tinker": 1271,
    "venomancer": 7956, "witch-doctor": 4913, "witch-hunter": 1194,
}


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "CoA-spec-research/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def fetch_json(url: str) -> object:
    return json.loads(fetch(url))


def extract_json_parse_string(source: str, marker: str) -> object:
    start = source.index(marker) + len(marker)
    escaped = False
    for end in range(start, len(source)):
        char = source[end]
        if char == "'" and not escaped:
            raw = source[start:end]
            return json.loads(ast.literal_eval("'" + raw + "'"))
        if char == "\\" and not escaped:
            escaped = True
        else:
            escaped = False
    raise ValueError(f"Unterminated JSON.parse string after {marker!r}")


def chunk_hashes(runtime: str) -> dict[int, str]:
    match = re.search(r'\}\)\[e\]\+"\.js"', runtime)
    if not match:
        raise ValueError("Could not locate webpack chunk hash map")
    prefix = runtime.rfind("({", 0, match.start()) + 1
    raw_mapping = runtime[prefix:match.start() + 1]
    pairs = re.findall(r'(\d+):"([0-9a-f]+)"', raw_mapping)
    if not pairs:
        raise ValueError("Webpack chunk hash map was empty")
    return {int(key): value for key, value in pairs}


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    retrieved = datetime.now(timezone.utc).isoformat()
    runtime = fetch(RUNTIME_URL)
    hashes = chunk_hashes(runtime)

    talent_source = fetch(TALENTS_URL)
    talents_by_class = extract_json_parse_string(talent_source, "var i=JSON.parse('")

    skills_by_slug = {}
    source_urls = [RUNTIME_URL, TALENTS_URL, TIER_LIST_URL]
    for _, _, slug, _ in CLASSES:
        chunk_id = SKILL_MODULES[slug]
        url = BASE + f"static/chunks/{chunk_id}.{hashes[chunk_id]}.js"
        source_urls.append(url)
        source = fetch(url)
        skills_by_slug[slug] = extract_json_parse_string(source, "exports=JSON.parse('")

    classes = []
    spec_count = 0
    for class_id, class_name, slug, specs in CLASSES:
        nodes = talents_by_class[str(class_id)]
        class_specs = []
        for spec_id, tab_id, spec_name in specs:
            spec_nodes = [node for node in nodes if node["tabId"] == tab_id]
            class_specs.append({
                "id": spec_id,
                "tab_id": tab_id,
                "name": spec_name,
                "talent_nodes": spec_nodes,
            })
            spec_count += 1
        classes.append({
            "id": class_id,
            "name": class_name,
            "slug": slug,
            "class_talent_nodes": [node for node in nodes if node["tabId"] == 87],
            "specializations": class_specs,
            "skills": skills_by_slug[slug]["skills"],
        })

    snapshot = {
        "retrieved_utc": retrieved,
        "source_kind": "fan-maintained structured mirror of Ascension DB and CoA trees",
        "source_warning": "Cross-check important claims. The source can contain mapping mistakes or lag live hotfixes.",
        "source_urls": source_urls,
        "class_count": len(classes),
        "specialization_count": spec_count,
        "classes": classes,
    }
    (OUTPUT / "coa-current-data.json").write_text(
        json.dumps(snapshot, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    rankings = fetch_json(TIER_LIST_URL)
    ranked_builds = {build["id"]: build for build in rankings["classRanked"]}.values()
    builds_by_spec = defaultdict(list)
    for build in ranked_builds:
        builds_by_spec[(build["class_id"], build["spec_id"])].append(build)
    top_builds = []
    for builds in builds_by_spec.values():
        top_builds.append(max(builds, key=lambda item: (item["score"], item["updated_at"])))

    def fetch_build(build: dict) -> dict:
        detail_url = f"https://coabuildhub.com/api/builds/{build['id']}"
        detail = fetch_json(detail_url)["build"]
        return {**detail, "source_url": f"https://coabuildhub.com/build/{build['id']}"}

    with ThreadPoolExecutor(max_workers=4) as pool:
        top_build_details = list(pool.map(fetch_build, top_builds))
    community_snapshot = {
        "retrieved_utc": retrieved,
        "source_url": TIER_LIST_URL,
        "latest_source_update": rankings.get("latestUpdate"),
        "latest_patch_label": rankings.get("latestPatch"),
        "all_ranked_build_metadata": list(ranked_builds),
        "top_build_detail_per_documented_spec": top_build_details,
    }
    (OUTPUT / "community-builds.json").write_text(
        json.dumps(community_snapshot, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    roster_lines = [
        "# Current CoA roster and talent-source digest",
        "",
        f"Retrieved: {retrieved}",
        "",
        "> Source warning: CoA Build Hub is fan maintained. Treat these current tree and tooltip records as a research baseline, then cross-check material claims against recent player evidence and the game client.",
        "",
        f"Coverage: {len(classes)} classes, {spec_count} specializations.",
        "",
    ]
    for coa_class in classes:
        roster_lines.append(f"## {coa_class['name']}")
        roster_lines.append("")
        for spec in coa_class["specializations"]:
            roster_lines.append(f"### {spec['name']} ({len(spec['talent_nodes'])} nodes)")
            roster_lines.append("")
            for node in sorted(spec["talent_nodes"], key=lambda item: (item["y"], item["x"], item["id"])):
                cost = f"TE {node['teCost']}" if node["teCost"] else f"AE {node['aeCost']}"
                description = re.sub(r"<[^>]+>", "", node.get("description") or "").strip()
                roster_lines.append(f"- Row {node['y']}: **{node['name']}** ({cost}, {node['maxPoints']} rank) | {description}")
            roster_lines.append("")
    (OUTPUT / "talent-digest.md").write_text("\n".join(roster_lines), encoding="utf-8")

    print(f"Wrote {OUTPUT / 'coa-current-data.json'}")
    print(f"Wrote {OUTPUT / 'talent-digest.md'}")
    print(f"Wrote {OUTPUT / 'community-builds.json'}")
    print(f"Captured {len(classes)} classes, {spec_count} specializations, {sum(len(c['skills']) for c in classes)} skills, and {len(ranked_builds)} recent community builds.")


if __name__ == "__main__":
    main()
