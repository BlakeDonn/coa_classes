"""Generate explorer-data.js for the class explorer from research-v2.

Reads reports/coa-specs/research-v2 (never writes there) and emits
reports/coa-specs/site/explorer-data.js. Enriched profiles supersede
structural baselines. Rerun after any overlay/profile regeneration:

    python reports/coa-specs/site/build_explorer_data.py
"""
from __future__ import annotations

import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SITE = Path(__file__).resolve().parent
RESEARCH = SITE.parent / "research-v2"

CLASS_COLORS = {
    "Barbarian": "#c79c6e", "Witch Doctor": "#39d994", "Felsworn": "#a95be0",
    "Witch Hunter": "#abd473", "Stormbringer": "#4da2ff", "Knight of Xoroth": "#e14f64",
    "Guardian": "#ff8f38", "Templar": "#f48cba", "Bloodmage": "#999af0",
    "Ranger": "#aad372", "Chronomancer": "#54d5f7", "Necromancer": "#8ca05b",
    "Pyromancer": "#ff6638", "Cultist": "#b35cff", "Starcaller": "#ded9ff",
    "Sun Cleric": "#ffd54f", "Tinker": "#d9a441", "Venomancer": "#58e65f",
    "Reaper": "#93a2b2", "Primalist": "#bc784c", "Runemaster": "#668cff",
}

# Broad Atlas feel-families. Curated specs keep their researched fine-grained
# primary_family label as a chip; this grouping is editorial and says so in the UI.
ATLAS_FAMILIES = [
    {"id": "setup", "name": "Planners & Detonators",
     "tagline": "Set the board, then cash out. DoTs, ramps, and timed payoffs.",
     "feels": "Attention goes into preparation: layering effects, aligning windows, choosing the detonation moment. Interruptions and impatience destroy your work; the payoff is one you built yourself."},
    {"id": "combo", "name": "Combo Sequencers",
     "tagline": "Order matters more than speed. Resources become windows, windows become bursts.",
     "feels": "A short repeating puzzle: generate, open a window, spend in the right order. Landing the sequence feels like a combo; fumbling it wastes the window."},
    {"id": "commanders", "name": "Commanders & Machines",
     "tagline": "Your power stands next to you. Pets, armies, turrets, and mechs do the hitting.",
     "feels": "You direct rather than duel. The package carries steady damage while you position and command. Depth tends to live in setup and build choices more than in your hands."},
    {"id": "steady", "name": "Steady Hitters",
     "tagline": "Readable loops and consistent output. Low ceremony, dependable rhythm.",
     "feels": "A clear builder-and-spender rhythm you can hold under pressure. Nothing collapses if you look away for two seconds. The tradeoff is fewer dramatic highs."},
    {"id": "duelists", "name": "Reactive Duelists",
     "tagline": "Fast, mobile, position-hungry. You answer the fight in real time.",
     "feels": "You live in the enemy's space, improvising every fight. Good reads feel untouchable; bad ones get punished immediately."},
    {"id": "anchors", "name": "Anchors",
     "tagline": "Tanks. You are the fixed point the fight bends around.",
     "feels": "You hold attention, absorb the worst moments, and convert active play into survival. Your mistakes are the loudest in the room, and your calm is the group's calm."},
    {"id": "menders", "name": "Menders & Weavers",
     "tagline": "Healers. Recovery, shields, and rescue - each with its own engine.",
     "feels": "You watch the whole room and spend your engine on other people's health bars. CoA healers differ hugely in how they generate that healing - brews, time, stars, blood, or attacks."},
    {"id": "marshals", "name": "Field Marshals",
     "tagline": "Supports. The group is your instrument.",
     "feels": "Your best moments are other people's best moments. Buffs, windows, saves, and positioning - high responsibility, and your value often lands on someone else's meter."},
]

# Atlas family per spec. Curated specs (enriched) carry researched fine labels;
# the atlas grouping itself is editorial for everyone. Structural-only specs are
# additionally flagged provisional in the UI.
SPEC_ATLAS = {
    "barbarian/brutality": "steady", "barbarian/headhunting": "steady", "barbarian/ancestry": "marshals",
    "witch-doctor/voodoo": "setup", "witch-doctor/brewing": "menders", "witch-doctor/shadowhunting": "steady",
    "felsworn/slayer": "duelists", "felsworn/infernal": "setup", "felsworn/tyrant": "anchors",
    "witch-hunter/boltslinger": "steady", "witch-hunter/houndmaster": "commanders",
    "witch-hunter/black-knight": "anchors", "witch-hunter/inquisition": "combo",
    "stormbringer/lightning": "steady", "stormbringer/wind": "marshals", "stormbringer/maelstrom": "setup",
    "knight-of-xoroth/hellfire": "commanders", "knight-of-xoroth/war": "steady", "knight-of-xoroth/defiance": "anchors",
    "guardian/vanguard": "anchors", "guardian/inspiration": "marshals", "guardian/gladiator": "duelists",
    "templar/zealot": "combo", "templar/oathkeeper": "anchors", "templar/crusader": "steady",
    "bloodmage/sanguine": "setup", "bloodmage/accursed": "duelists", "bloodmage/eternal": "anchors",
    "bloodmage/fleshweaver": "menders",
    "ranger/farstrider": "marshals", "ranger/archery": "steady", "ranger/brigand": "duelists",
    "chronomancer/infinite": "setup", "chronomancer/artificer": "combo", "chronomancer/time": "menders",
    "necromancer/death": "setup", "necromancer/rime": "combo", "necromancer/animation": "commanders",
    "pyromancer/flameweaving": "menders", "pyromancer/incineration": "setup", "pyromancer/draconic": "combo",
    "cultist/godblade": "setup", "cultist/corruption": "setup", "cultist/heretic": "menders",
    "cultist/dreadnought": "anchors",
    "starcaller/moon-guard": "anchors", "starcaller/moon-priest": "menders",
    "starcaller/sentinel": "steady", "starcaller/warden": "duelists",
    "sun-cleric/piety": "combo", "sun-cleric/blessings": "menders", "sun-cleric/seraphim": "anchors",
    "sun-cleric/valkyrie": "duelists",
    "tinker/demolition": "commanders", "tinker/invention": "menders", "tinker/mechanics": "commanders",
    "venomancer/venom": "setup", "venomancer/stalking": "duelists", "venomancer/fortitude": "anchors",
    "venomancer/vizier": "menders",
    "reaper/harvest": "duelists", "reaper/soul": "duelists", "reaper/domination": "anchors",
    "primalist/primal": "commanders", "primalist/geomancy": "steady", "primalist/life": "menders",
    "primalist/mountain-king": "anchors",
    "runemaster/runic": "combo", "runemaster/arcane": "combo", "runemaster/riftblade": "duelists",
}

# Official Ascension class-highlight videos (media-audit/availability.md, 2026-08-06).
# Older class-fantasy references — the UI must label them as such, never as guides.
CLASS_VIDEOS = {
    "Barbarian": "5VYpy1JEp4U", "Bloodmage": "4mEVTHzHkqY", "Chronomancer": "yvmzxxVsHZg",
    "Cultist": "g0NkjXMVSPA", "Felsworn": "7mcE4UtAxNs", "Guardian": "BkL3c6SoMPw",
    "Knight of Xoroth": "54rKyrsNqWM", "Necromancer": "rL775c4_X2s", "Primalist": "ukNiDWKWEtI",
    "Pyromancer": "eED_TiScjM8", "Ranger": "-YGIMTGsHD8", "Reaper": "rdCXdk3GgjI",
    "Runemaster": "mONxwNBrn-g", "Starcaller": "3YfxzGfnAKM", "Stormbringer": "W5C0-U3RvW8",
    "Sun Cleric": "LQ5kUApKG8w", "Templar": "zPLCEhx0tiI", "Tinker": "DzPERJxC7MQ",
    "Venomancer": "RSOJihG0_aQ", "Witch Doctor": "XnVFqU1XY6o", "Witch Hunter": "4opoBFzyvsU",
}

# Verified spec-specific guides from the captured Build Hub set (availability.md).
SPEC_GUIDES = {
    "cultist/heretic": [
        {"id": "-rMi2co9cUE", "creator": "Zreula", "title": "Melee-healer guide", "verified": "2026-08-06"}],
    "templar/crusader": [
        {"id": "jraMdaePtLw", "creator": "RSTAR", "title": "General Crusader guide", "verified": "2026-08-06"}],
    "sun-cleric/valkyrie": [
        {"id": "IpDr4hiSI44", "creator": "Hello Heroes Guild", "title": "Strength melee DPS guide", "verified": "2026-08-06"},
        {"id": "7TixqGYGt7A", "creator": "Leonardo Calegário", "title": "PvE / Mythic+ guide", "verified": "2026-08-06"}],
    "reaper/harvest": [
        {"id": "AZBb9IE3WRo", "creator": "NxS mvm", "title": "PvP guide", "verified": "2026-08-06"},
        {"id": "mdpzCNOsgiw", "creator": "NxS mvm", "title": "Gameplay commentary", "verified": "2026-08-06"}],
}

CONTEXTS = ["leveling_10_29", "leveling_30_49", "level_50_60", "boss", "dungeon_aoe", "pvp"]
AXES = ["core_actions", "state_tracking", "setup_burden", "sequencing",
        "reactive_decisions", "execution", "failure_cost"]
COMPLEXITY_VALUES = {"low", "low-moderate", "moderate", "moderate-high", "high"}


def tier_of(claim_id: str) -> str:
    prefix = claim_id.split(":", 1)[0]
    if prefix in ("talent", "changelog", "snapshot"):
        return "data"
    if prefix in ("observed", "guide"):
        return "players"
    return "inference"


def tiers(claim_ids) -> list[str]:
    order = ["data", "players", "inference"]
    found = {tier_of(c) for c in (claim_ids or [])}
    return [t for t in order if t in found]


def texted(items):
    """[{text|str, claim_ids}] -> [{t, tiers}]"""
    out = []
    for it in items or []:
        if isinstance(it, str):
            out.append({"t": it, "tiers": []})
        else:
            out.append({"t": it.get("text") or it.get("theme") or "", "tiers": tiers(it.get("claim_ids"))})
    return out


def also_fits_atlas(label: str) -> str | None:
    """Best-effort mapping from a fine-grained also_fits label to an atlas family."""
    l = label.lower()
    if "tank" in l:
        return "anchors"
    if "healer" in l:
        return "menders"
    if "support" in l:
        return "marshals"
    if "pet" in l or "summon" in l or "turret" in l:
        return "commanders"
    if "dot" in l or "ramp" in l or "maintenance" in l or "attrition" in l:
        return "setup"
    if "combo" in l or "stance" in l or "sequenc" in l or "burst" in l:
        return "combo"
    if "skirmish" in l or "mobile" in l or "position" in l or "execute" in l:
        return "duelists"
    if "builder" in l or "priority" in l or "leveler" in l or "caster" in l or "ranged" in l:
        return "steady"
    return None


def load_talent_records() -> dict:
    """Flatten snapshot talent records to {record_id: {name, icon, tip}}."""
    snap_path = RESEARCH.parent / "snapshot" / "coa-current-data.json"
    records: dict[str, dict] = {}

    def walk(node):
        if isinstance(node, dict):
            if "icon" in node and "id" in node and "name" in node:
                records[str(node["id"])] = {
                    "name": node.get("name", ""),
                    "icon": node.get("icon", ""),
                    "tip": (node.get("description") or "").strip(),
                }
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(json.loads(snap_path.read_text(encoding="utf-8")))
    return records


ICON_CACHE_PATH = SITE / "icon-verification.json"
ICON_URL = "https://coabuildhub.com/skill-icons/{}.jpg"


def load_icon_cache() -> dict:
    if ICON_CACHE_PATH.is_file():
        return json.loads(ICON_CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def check_icon(slug: str) -> bool:
    """True only when the CDN actually serves an image for this slug."""
    req = urllib.request.Request(ICON_URL.format(slug), method="GET",
                                 headers={"User-Agent": "coa-atlas-icon-check"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            ctype = resp.headers.get("Content-Type", "")
            return resp.status == 200 and ctype.startswith("image/") and len(resp.read(64)) > 0
    except Exception:
        return False


def verify_icons(slugs: set[str]) -> dict:
    """Verify slugs against the CDN, using and updating the local cache."""
    cache = load_icon_cache()
    todo = sorted(s for s in slugs if s not in cache)
    if todo:
        print(f"Verifying {len(todo)} uncached icon URLs...")
        with ThreadPoolExecutor(max_workers=12) as pool:
            for slug, ok in zip(todo, pool.map(check_icon, todo)):
                cache[slug] = ok
        ICON_CACHE_PATH.write_text(json.dumps(cache, indent=1, sort_keys=True), encoding="utf-8")
    return cache


def spec_icon_candidates(profile: dict, records: dict) -> list[dict]:
    """All distinct talent-icon candidates for a spec, in identity-first order."""
    sid = profile["spec"]["id"]
    ordered_claims = list(profile.get("identity", {}).get("claim_ids", []))
    ordered_claims += list(profile.get("mechanics", {}).get("claim_ids", []))
    for band in profile.get("level_bands", []):
        ordered_claims += list(band.get("claim_ids", []))
    out, seen = [], set()
    for cid in ordered_claims:
        if not cid.startswith(f"talent:{sid}:"):
            continue
        rec = records.get(cid.split(":", 2)[2])
        if not rec or not rec["icon"] or rec["icon"] in seen:
            continue
        seen.add(rec["icon"])
        out.append(rec)
    return out


def spec_media(profile: dict, records: dict, icon_ok: dict) -> dict:
    """Verified-loadable defining-talent icons + class video + verified guides."""
    icons = [r for r in spec_icon_candidates(profile, records) if icon_ok.get(r["icon"])][:4]
    return {
        "icons": icons,
        "classVideo": CLASS_VIDEOS.get(profile["spec"]["class"]),
        "guides": SPEC_GUIDES.get(profile["spec"]["id"], []),
    }


def build_spec(profile: dict, enriched: bool, perf_by_id: dict, warnings: list[str],
               records: dict, icon_ok: dict) -> dict:
    spec = profile["spec"]
    sid = spec["id"]
    media = spec_media(profile, records, icon_ok)
    if len(media["icons"]) < 3:
        warnings.append(f"{sid}: only {len(media['icons'])} verified defining-talent icons")
    ident = profile["identity"]
    mech = profile["mechanics"]
    cov = profile["coverage"]
    claims = {c["id"]: c for c in profile.get("claims", [])}

    # Contexts: keep only ones with real content.
    ctxs = {}
    for ctx in CONTEXTS:
        c = (profile.get("contexts") or {}).get(ctx) or {}
        if c.get("feel") or c.get("strengths") or c.get("cautions"):
            ctxs[ctx] = {"feel": c.get("feel", ""), "strengths": c.get("strengths", []),
                         "cautions": c.get("cautions", []), "tiers": tiers(c.get("claim_ids"))}

    # Complexity: keep known values only; warn on unexpected labels.
    # The rare 'raid' context is folded into 'boss' (a native boss cell wins).
    cx = {}
    for axis in AXES:
        axis_data = (profile.get("complexity") or {}).get(axis) or {}
        cells = {}
        for raid_pass in (False, True):
            for ctx, cell in axis_data.items():
                if (ctx == "raid") is not raid_pass:
                    continue
                v = (cell or {}).get("value", "unknown")
                if v == "unknown" or not v:
                    continue
                if v not in COMPLEXITY_VALUES:
                    warnings.append(f"{sid}: unexpected complexity value '{v}' on {axis}/{ctx}")
                key = "boss" if ctx == "raid" else ctx
                if key in cells:
                    warnings.append(f"{sid}: raid cell overlaps native boss on {axis}; kept boss")
                    continue
                cells[key] = {"v": v, "why": cell.get("reason", ""), "tiers": tiers(cell.get("claim_ids"))}
        if cells:
            cx[axis] = cells

    # Level bands as a progression story.
    bands = []
    for b in profile.get("level_bands", []):
        bands.append({
            "id": b["id"], "min": b["minimum_level"], "max": b["maximum_level"],
            "unlocks": [u["name"] for u in b.get("structural_unlocks", [])],
            "loop": b.get("observed_loop", ""),
            "changes": b.get("observed_changes", []),
        })
    has_shift = any(b["loop"] or b["changes"] for b in bands)

    # Known issues and conflict pairs resolved to claim text.
    issues = []
    for cid in profile.get("known_issue_claim_ids", []):
        c = claims.get(cid)
        if c:
            issues.append({"t": c["text"], "tier": tier_of(cid), "note": c.get("notes", "")})
    conflict_pairs, seen = [], set()
    for c in profile.get("claims", []):
        for other_id in c.get("conflicts_with", []):
            key = tuple(sorted((c["id"], other_id)))
            if key in seen:
                continue
            seen.add(key)
            other = claims.get(other_id)
            if other:
                conflict_pairs.append({
                    "a": {"t": c["text"], "tier": tier_of(c["id"])},
                    "b": {"t": other["text"], "tier": tier_of(other_id)},
                })

    perf = perf_by_id.get(sid) or {}
    community = profile.get("community_build_snapshot") or {}
    fine_family = ident.get("primary_family") or ""
    also = []
    for label in ident.get("also_fits", []):
        also.append({"label": label, "atlas": also_fits_atlas(label)})

    return {
        "id": sid,
        "klass": spec["class"],
        "name": spec["name"],
        "color": CLASS_COLORS.get(spec["class"], "#ffca67"),
        "roles": spec.get("roles", []),
        "range": spec.get("range", []),
        "atlas": SPEC_ATLAS[sid],
        "fineFamily": fine_family,
        "alsoFits": also,
        "provisionalFamily": not enriched,
        "enriched": enriched,
        "confidence": cov.get("overall_confidence", "low"),
        "coverage": {k: cov.get(k, "missing") for k in ("mechanical", "community", "performance", "video")},
        "gaps": cov.get("gaps", []),
        "oneLine": ident.get("one_line", ""),
        "fantasy": ident.get("fantasy", ""),
        "mech": {
            "coreLoop": mech.get("core_loop", ""),
            "coreTiers": tiers(mech.get("claim_ids")),
            "resources": mech.get("resources", []),
            "builders": [b["name"] for b in mech.get("builders", [])],
            "spenders": [s["name"] for s in mech.get("spenders", [])],
            "windows": [w["name"] for w in mech.get("windows", [])],
            "st": mech.get("single_target", ""),
            "aoe": mech.get("aoe", ""),
            "movement": mech.get("movement_and_target_switching", ""),
            "defense": mech.get("defense_and_control", ""),
            "utility": mech.get("group_utility", ""),
            "failureModes": texted(mech.get("failure_modes")),
        },
        "contexts": ctxs,
        "complexity": cx,
        "bands": bands,
        "hasShift": has_shift,
        "fit": {"enjoy": texted(profile.get("fit", {}).get("enjoy_if")),
                "avoid": texted(profile.get("fit", {}).get("avoid_if"))},
        "sentiment": {k: texted(profile.get("sentiment", {}).get(k)) for k in ("praise", "frustrations", "contested")},
        "issues": issues,
        "conflicts": conflict_pairs,
        "perf": {"dps": perf.get("reported_dps"), "ctx": perf.get("dps_context"),
                 "uploads": perf.get("mythic_upload_records")},
        "community": {"count": community.get("count", 0), "topTitle": community.get("top_title"),
                      "topUrl": community.get("top_url"), "latest": community.get("latest_update")},
        "media": media,
    }


def main() -> int:
    index = json.loads((RESEARCH / "index.json").read_text(encoding="utf-8"))
    enriched_index = json.loads((RESEARCH / "enriched-index.json").read_text(encoding="utf-8"))
    enriched_ids = set(enriched_index["profiles"])
    perf_raw = json.loads((RESEARCH / "performance-signals.json").read_text(encoding="utf-8"))
    perf_by_id = {p["spec_id"]: p for p in perf_raw["specs"]}

    warnings: list[str] = []
    records = load_talent_records()

    # Verify every candidate icon against the CDN before shipping it.
    all_slugs: set[str] = set()
    profiles_cache: dict[str, dict] = {}
    for entry in index["profiles"]:
        sid = entry["id"]
        fname = sid.replace("/", "--") + ".json"
        folder = "enriched-profiles" if sid in enriched_ids else "profiles"
        profiles_cache[sid] = json.loads((RESEARCH / folder / fname).read_text(encoding="utf-8"))
        all_slugs |= {r["icon"] for r in spec_icon_candidates(profiles_cache[sid], records)}
    icon_ok = verify_icons(all_slugs)
    print(f"Icon verification: {sum(1 for v in icon_ok.values() if v)}/{len(icon_ok)} slugs loadable.")

    specs = []
    for entry in index["profiles"]:
        sid = entry["id"]
        enriched = sid in enriched_ids
        profile = profiles_cache[sid]
        if sid not in SPEC_ATLAS:
            print(f"ERROR: no atlas family assigned for {sid}")
            return 1
        specs.append(build_spec(profile, enriched, perf_by_id, warnings, records, icon_ok))

    assert len(specs) == 70, f"expected 70 specs, got {len(specs)}"
    enriched_count = sum(1 for s in specs if s["enriched"])
    assert enriched_count == len(enriched_ids), (enriched_count, len(enriched_ids))

    payload = {
        "generated": index["generated"],
        "specCount": len(specs),
        "classCount": index["class_count"],
        "enrichedCount": enriched_count,
        "families": ATLAS_FAMILIES,
        "perfRules": perf_raw.get("rules", []),
        "specs": specs,
    }
    out = SITE / "explorer-data.js"
    out.write_text(
        "// GENERATED by build_explorer_data.py from ../research-v2 - do not hand-edit.\n"
        "window.COA_EXPLORER = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB): {len(specs)} specs, {enriched_count} enriched.")
    for w in warnings:
        print("WARN:", w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
