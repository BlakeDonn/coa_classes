"""Build the structural baseline for the CoA specialization deep-research dataset.

This deliberately does not pretend tooltip parsing can establish effective rotations,
difficulty, enjoyment, or performance. It creates claim-addressable mechanical facts
and leaves those observational fields open for the community-evidence pass.
"""

from __future__ import annotations

import html
import json
import re
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "reports" / "coa-specs" / "snapshot" / "coa-current-data.json"
BUILD_SNAPSHOT = ROOT / "reports" / "coa-specs" / "snapshot" / "community-builds.json"
SITE_DATA = ROOT / "reports" / "coa-specs" / "site" / "data.js"
OUTPUT = ROOT / "reports" / "coa-specs" / "research-v2"
PROFILE_DIR = OUTPUT / "profiles"
DISCOVERED_SOURCES = OUTPUT / "discovered-sources.json"
OVERLAY_DIR = OUTPUT / "overlays"
PERFORMANCE_SIGNALS = OUTPUT / "performance-signals.json"

LEVEL_BANDS = (
    ("leveling_10_19", 10, 19, range(0, 2)),
    ("leveling_20_29", 20, 29, range(2, 4)),
    ("leveling_30_39", 30, 39, range(4, 6)),
    ("leveling_40_49", 40, 49, range(6, 8)),
    ("level_50_60", 50, 60, range(8, 10)),
)

COMPLEXITY_AXES = (
    "core_actions",
    "state_tracking",
    "sequencing",
    "reactive_decisions",
    "execution",
    "failure_cost",
)

CONTEXTS = (
    "leveling_10_29",
    "leveling_30_49",
    "level_50_60",
    "boss",
    "dungeon_aoe",
    "pvp",
)


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def clean_text(value: str | None) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", "", value or ""))
    text = re.sub(r"\s+", " ", text).strip()
    # The source frequently concatenates a spell-type prefix and the first word.
    text = re.sub(r"^(Distortion Spell|Continuum Spell|Transform)\s*", r"\1: ", text)
    return text


def load_site_data() -> dict:
    raw = SITE_DATA.read_text(encoding="utf-8")
    prefix = "window.COA_DATA = "
    if not raw.startswith(prefix) or not raw.rstrip().endswith(";"):
        raise ValueError("Unexpected site data wrapper")
    return json.loads(raw[len(prefix) :].rstrip()[:-1])


def claim_id(class_slug: str, spec_slug: str, node_id: str) -> str:
    return f"talent:{class_slug}/{spec_slug}:{node_id}"


def source_claim(class_slug: str, spec_slug: str, node: dict) -> dict:
    description = clean_text(node.get("description"))
    return {
        "id": claim_id(class_slug, spec_slug, node["id"]),
        "kind": "structural",
        "text": f"{node['name']}: {description}",
        "source_ids": ["snapshot-talents-2026-08-05"],
        "scope": {
            "levels": next(
                (band for band, _, _, rows in LEVEL_BANDS if node["y"] in rows),
                "unknown",
            ),
            "content": ["all"],
            "build_or_mode": [],
        },
        "confidence": "medium",
        "conflicts_with": [],
        "notes": "Tooltip structure from a current fan-maintained mirror; verify material behavior in live play or recent reports.",
    }


def node_ref(node: dict, class_slug: str, spec_slug: str) -> dict:
    return {
        "name": node["name"],
        "claim_ids": [claim_id(class_slug, spec_slug, node["id"])],
    }


def resource_names(nodes: list[dict]) -> list[str]:
    found: set[str] = set()
    patterns = (
        r"\b(?:generates?|gain(?:s)?) (?:an? |\d+ )?([A-Z][A-Za-z' -]{2,28}?)(?=[.,]| which| every| for|$)",
        r"\bconsumes? (?:all |up to |an? |\d+ )?([A-Z][A-Za-z' -]{2,28}?)(?=[.,]| to | which|$)",
    )
    for node in nodes:
        description = clean_text(node.get("description"))
        for pattern in patterns:
            for match in re.finditer(pattern, description):
                candidate = match.group(1).strip()
                if candidate.lower() not in {"damage", "health", "mana", "time"}:
                    found.add(candidate)
    return sorted(found)


def empty_complexity() -> dict:
    return {
        axis: {
            context: {"value": "unknown", "reason": "", "claim_ids": []}
            for context in CONTEXTS
        }
        for axis in COMPLEXITY_AXES
    }


def build_profile(coa_class: dict, spec: dict, site_spec: dict) -> dict:
    class_slug = coa_class["slug"]
    spec_slug = slugify(spec["name"])
    nodes = sorted(spec["talent_nodes"], key=lambda item: (item["y"], item["x"], item["id"]))
    claims = [source_claim(class_slug, spec_slug, node) for node in nodes]
    all_claim_ids = [claim["id"] for claim in claims]

    builders = [
        node_ref(node, class_slug, spec_slug)
        for node in nodes
        if re.search(r"\b(generate|generates|gain|gains)\b", clean_text(node.get("description")), re.I)
    ]
    spenders = [
        node_ref(node, class_slug, spec_slug)
        for node in nodes
        if re.search(r"\b(consume|consumes|costs?)\b", clean_text(node.get("description")), re.I)
    ]
    windows = [
        node_ref(node, class_slug, spec_slug)
        for node in nodes
        if re.search(r"\b(within|for \d+(?:\.\d+)? sec|while .* active|next .* within)\b", clean_text(node.get("description")), re.I)
    ]
    modes = [
        {
            **node_ref(node, class_slug, spec_slug),
            "structural_description": clean_text(node.get("description")),
        }
        for node in nodes
        if re.search(r"Continuum Spell|stance|form|mode|Can only have 1", clean_text(node.get("description")), re.I)
    ]

    level_bands = []
    for band, minimum, maximum, rows in LEVEL_BANDS:
        band_nodes = [node for node in nodes if node["y"] in rows]
        level_bands.append(
            {
                "id": band,
                "minimum_level": minimum,
                "maximum_level": maximum,
                "structural_unlocks": [node_ref(node, class_slug, spec_slug) for node in band_nodes],
                "observed_loop": "",
                "observed_changes": [],
                "claim_ids": [claim_id(class_slug, spec_slug, node["id"]) for node in band_nodes],
            }
        )

    build_count = site_spec.get("community", {}).get("count", 0)
    top_url = site_spec.get("community", {}).get("topUrl")
    top_build_source_id = f"buildhub:{top_url.rsplit('/', 1)[-1]}" if top_url else None
    coverage_gaps = [
        "Effective core loop needs recent guide or player cross-check.",
        "Contextual complexity values are not yet researched.",
        "Recent performance, sentiment, issues, and video evidence are not yet reconciled.",
    ]
    if not build_count:
        coverage_gaps.append("No community builds were captured; this is a documentation gap, not evidence of weakness.")

    return {
        "schema_version": 2,
        "as_of_date": "2026-08-05",
        "spec": {
            "id": f"{class_slug}/{spec_slug}",
            "class": coa_class["name"],
            "name": spec["name"],
            "roles": site_spec.get("roles", []),
            "range": site_spec.get("combat", []),
        },
        "identity": {
            "fantasy": "",
            "one_line": site_spec.get("summary", ""),
            "primary_family": "",
            "also_fits": [],
            "claim_ids": all_claim_ids,
        },
        "mechanics": {
            "core_loop": site_spec.get("summary", ""),
            "resources": resource_names(nodes),
            "builders": builders,
            "spenders": spenders,
            "windows": windows,
            "modes": modes,
            "single_target": "",
            "aoe": "",
            "movement_and_target_switching": "",
            "defense_and_control": "",
            "group_utility": "",
            "failure_modes": [],
            "claim_ids": all_claim_ids,
        },
        "level_bands": level_bands,
        "contexts": {
            context: {
                "feel": "",
                "strengths": [],
                "cautions": [],
                "claim_ids": [],
            }
            for context in CONTEXTS
        },
        "complexity": empty_complexity(),
        "fit": {"enjoy_if": [], "avoid_if": []},
        "stat_and_equipment_hooks": [],
        "performance_signal_ids": [],
        "sentiment": {"praise": [], "frustrations": [], "contested": []},
        "known_issue_claim_ids": [],
        "video_ids": [],
        "community_build_snapshot": {
            "count": build_count,
            "latest_update": site_spec.get("community", {}).get("latestUpdate"),
            "top_title": site_spec.get("community", {}).get("topTitle"),
            "top_url": top_url,
            "source_ids": (
                ["buildhub-builds-2026-08-05", top_build_source_id]
                if top_build_source_id
                else (["buildhub-builds-2026-08-05"] if build_count else [])
            ),
        },
        "coverage": {
            "mechanical": "structural_baseline",
            "community": "indexed" if build_count else "missing",
            "performance": "missing",
            "video": "missing",
            "overall_confidence": "low",
            "gaps": coverage_gaps,
        },
        "claims": claims,
    }


def validate_profile(profile: dict) -> list[str]:
    errors: list[str] = []
    required = (
        "schema_version", "as_of_date", "spec", "identity", "mechanics",
        "level_bands", "contexts", "complexity", "coverage", "claims",
    )
    for key in required:
        if key not in profile:
            errors.append(f"missing {key}")
    claim_ids = [claim["id"] for claim in profile.get("claims", [])]
    if len(claim_ids) != len(set(claim_ids)):
        errors.append("duplicate claim IDs")
    if len(profile.get("level_bands", [])) != len(LEVEL_BANDS):
        errors.append("wrong level-band count")
    if set(profile.get("complexity", {})) != set(COMPLEXITY_AXES):
        errors.append("wrong complexity axes")
    return errors


def main() -> None:
    snapshot = json.loads(SNAPSHOT.read_text(encoding="utf-8-sig"))
    build_snapshot = json.loads(BUILD_SNAPSHOT.read_text(encoding="utf-8-sig"))
    site_data = load_site_data()
    site_lookup = {
        (coa_class["name"], spec["name"]): spec
        for coa_class in site_data["classes"]
        for spec in coa_class["specs"]
    }

    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    profiles = []
    validation_errors = []
    for coa_class in snapshot["classes"]:
        for spec in coa_class["specializations"]:
            site_spec = site_lookup[(coa_class["name"], spec["name"])]
            profile = build_profile(coa_class, spec, site_spec)
            errors = validate_profile(profile)
            if errors:
                validation_errors.append({"spec": profile["spec"]["id"], "errors": errors})
            profiles.append(profile)
            output_path = PROFILE_DIR / f"{coa_class['slug']}--{slugify(spec['name'])}.json"
            output_path.write_text(json.dumps(profile, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    index = {
        "schema_version": 2,
        "generated": "2026-08-05",
        "profile_count": len(profiles),
        "class_count": len(snapshot["classes"]),
        "claim_count": sum(len(profile["claims"]) for profile in profiles),
        "profiles": [
            {
                "id": profile["spec"]["id"],
                "class": profile["spec"]["class"],
                "name": profile["spec"]["name"],
                "path": f"profiles/{profile['spec']['id'].replace('/', '--')}.json",
                "coverage": profile["coverage"],
            }
            for profile in profiles
        ],
        "validation_errors": validation_errors,
    }
    (OUTPUT / "index.json").write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUTPUT / "mechanical-baseline.json").write_text(
        json.dumps({"schema_version": 2, "profiles": profiles}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    community_inventory = [
        {
            "spec_id": profile["spec"]["id"],
            "class": profile["spec"]["class"],
            "spec": profile["spec"]["name"],
            "roles": profile["spec"]["roles"],
            "build_count": profile["community_build_snapshot"]["count"],
            "latest_update": profile["community_build_snapshot"]["latest_update"],
            "top_title": profile["community_build_snapshot"]["top_title"],
            "top_url": profile["community_build_snapshot"]["top_url"],
            "evidence_priority": (
                "critical_no_builds"
                if profile["community_build_snapshot"]["count"] == 0
                else "high_thin_builds"
                if profile["community_build_snapshot"]["count"] == 1
                else "normal_cross_check"
            ),
        }
        for profile in profiles
    ]
    community_summary = {
        "total_specs": len(community_inventory),
        "total_ranked_builds": len(build_snapshot.get("all_ranked_build_metadata", [])),
        "specs_with_no_builds": sum(item["build_count"] == 0 for item in community_inventory),
        "specs_with_one_build": sum(item["build_count"] == 1 for item in community_inventory),
        "specs_with_two_or_more_builds": sum(item["build_count"] >= 2 for item in community_inventory),
        "interpretation": "Build count measures documentation depth, not specialization strength.",
    }
    (OUTPUT / "community-build-inventory.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "captured_date": "2026-08-05",
                "source_id": "buildhub-builds-2026-08-05",
                "summary": community_summary,
                "specs": community_inventory,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    discovered = (
        json.loads(DISCOVERED_SOURCES.read_text(encoding="utf-8-sig")).get("sources", [])
        if DISCOVERED_SOURCES.exists()
        else []
    )
    evidence_rows = []
    for profile in profiles:
        spec_id = profile["spec"]["id"]
        direct_sources = [source for source in discovered if spec_id in source.get("spec_ids", [])]
        overlay_name = f"{spec_id.replace('/', '--')}.json"
        evidence_rows.append(
            {
                "spec_id": spec_id,
                "community_build_count": profile["community_build_snapshot"]["count"],
                "recent_direct_source_count": len(direct_sources),
                "recent_direct_source_ids": [source["id"] for source in direct_sources],
                "source_types": sorted({source["type"] for source in direct_sources}),
                "global_performance_inventory_available": any(
                    source["id"] == "reddit:class-statistics-2026-08-02" for source in discovered
                ),
                "curated_overlay": (OVERLAY_DIR / overlay_name).exists(),
                "next_pass": (
                    "refine_with_stronger_evidence"
                    if (OVERLAY_DIR / overlay_name).exists()
                    else "curate_claims"
                    if direct_sources
                    else "search_gap"
                ),
            }
        )
    evidence_summary = {
        "total_specs": len(evidence_rows),
        "specs_with_direct_recent_source": sum(row["recent_direct_source_count"] > 0 for row in evidence_rows),
        "specs_with_curated_overlay": sum(row["curated_overlay"] for row in evidence_rows),
        "specs_requiring_search": sum(row["next_pass"] == "search_gap" for row in evidence_rows),
        "global_performance_inventory_is_not_power_ranking": True,
    }
    (OUTPUT / "evidence-coverage.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "captured_date": "2026-08-05",
                "summary": evidence_summary,
                "specs": evidence_rows,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    performance_lookup = {}
    if PERFORMANCE_SIGNALS.exists():
        performance_data = json.loads(PERFORMANCE_SIGNALS.read_text(encoding="utf-8-sig"))
        performance_lookup = {item["spec_id"]: item for item in performance_data.get("specs", [])}
    evidence_packets = []
    for profile in profiles:
        spec_id = profile["spec"]["id"]
        direct_sources = [source for source in discovered if spec_id in source.get("spec_ids", [])]
        evidence_packets.append(
            {
                "spec": profile["spec"],
                "baseline_path": f"profiles/{spec_id.replace('/', '--')}.json",
                "structural_claim_count": len(profile["claims"]),
                "structural_summary": profile["mechanics"]["core_loop"],
                "community_build_snapshot": profile["community_build_snapshot"],
                "recent_direct_sources": [
                    {
                        "id": source["id"],
                        "type": source["type"],
                        "title": source["title"],
                        "published_date": source["published_date"],
                        "themes": source.get("themes", []),
                        "limitations": source.get("limitations"),
                    }
                    for source in direct_sources
                ],
                "performance_signals": performance_lookup.get(spec_id),
                "curated_overlay_path": (
                    f"overlays/{spec_id.replace('/', '--')}.json"
                    if (OVERLAY_DIR / f"{spec_id.replace('/', '--')}.json").exists()
                    else None
                ),
                "curation_status": (
                    "validated_overlay"
                    if (OVERLAY_DIR / f"{spec_id.replace('/', '--')}.json").exists()
                    else "evidence_packet_ready"
                ),
            }
        )
    (OUTPUT / "evidence-packets.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "captured_date": "2026-08-05",
                "packet_count": len(evidence_packets),
                "packets": evidence_packets,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    roster_lines = [
        "# CoA specialization research cards",
        "",
        "Generated from the August 5 structural snapshot and the current evidence packets. These are research cards, not a tier list. A reported DPS value is reproduced as a limited source signal and is not a recommendation.",
        "",
    ]
    current_class = None
    for packet in evidence_packets:
        spec = packet["spec"]
        if spec["class"] != current_class:
            current_class = spec["class"]
            roster_lines.extend([f"## {current_class}", ""])
        performance = packet.get("performance_signals") or {}
        dps_value = performance.get("reported_dps")
        dps_text = (
            f"reported DPS {dps_value} ({performance.get('dps_context')})"
            if dps_value is not None
            else "no DPS value in the source snapshot"
        )
        direct_sources = packet["recent_direct_sources"]
        themes = sorted({theme for source in direct_sources for theme in source.get("themes", [])})
        theme_text = ", ".join(themes) if themes else "covered through the validated overlay's external sources"
        source_text = ", ".join(source["id"] for source in direct_sources) if direct_sources else "see curated overlay claims"
        roster_lines.extend(
            [
                f"### {spec['name']}",
                "",
                f"- **Role and range:** {', '.join(spec['roles']) or 'Unclassified'}; {', '.join(spec['range']) or 'Unclassified'}.",
                f"- **Structural baseline:** {packet['structural_summary']}",
                f"- **Current evidence themes:** {theme_text}.",
                f"- **Community documentation:** {packet['community_build_snapshot']['count']} indexed Build Hub build(s); {dps_text}; {performance.get('mythic_upload_records', 'unknown')} Mythic upload record(s).",
                f"- **Evidence IDs:** {source_text}.",
                f"- **Curation:** {packet['curation_status'].replace('_', ' ')}.",
                "",
            ]
        )
    (OUTPUT / "roster-research-cards.md").write_text(
        "\n".join(roster_lines),
        encoding="utf-8",
    )

    freshness_floor = date.fromisoformat("2026-05-05")
    dated_discovered = [source for source in discovered if source.get("published_date")]
    stale_discovered = [
        source["id"]
        for source in dated_discovered
        if date.fromisoformat(source["published_date"]) < freshness_floor
    ]
    validation_checks = {
        "profile_count_is_70": len(profiles) == 70,
        "class_count_is_21": len(snapshot["classes"]) == 21,
        "all_profiles_have_structural_claims": all(profile["claims"] for profile in profiles),
        "community_inventory_covers_every_profile": len(community_inventory) == len(profiles),
        "performance_signals_cover_every_profile": set(performance_lookup) == {
            profile["spec"]["id"] for profile in profiles
        },
        "every_profile_has_direct_source_or_overlay": all(
            packet["recent_direct_sources"] or packet["curated_overlay_path"]
            for packet in evidence_packets
        ),
        "all_discovered_sources_inside_freshness_window": not stale_discovered,
    }
    research_validation = {
        "schema_version": 1,
        "validated_date": "2026-08-05",
        "freshness_floor": freshness_floor.isoformat(),
        "checks": validation_checks,
        "passed": all(validation_checks.values()),
        "stale_discovered_source_ids": stale_discovered,
        "notes": [
            "Passing validates inventory, linkage, and freshness only.",
            "All 70 profiles now have validated overlays, but evidence depth varies; inspect each profile's coverage and gaps before making comparative claims.",
            "Overlay claim-reference validation is performed by tools/apply_coa_research_overlays.py.",
        ],
    }
    (OUTPUT / "research-validation.json").write_text(
        json.dumps(research_validation, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    if not research_validation["passed"]:
        failed = [name for name, passed in validation_checks.items() if not passed]
        raise SystemExit(f"Research inventory validation failed: {failed}")

    build_sources = []
    for build in build_snapshot.get("top_build_detail_per_documented_spec", []):
        build_id = build["id"]
        updated = build.get("updated_at")
        build_sources.append(
            {
                "id": f"buildhub:{build_id}",
                "type": "community_build_guide",
                "title": build.get("title") or "Untitled community build",
                "publisher": "CoA Build Hub community contributor",
                "url": build.get("source_url") or f"https://coabuildhub.com/build/{build_id}",
                "published_date": updated[:10] if updated else None,
                "captured_date": "2026-08-05",
                "methodology": "User-submitted build. Full guide text was captured when the author supplied it.",
                "limitations": "One contributor and build cannot establish a universal rotation, performance rank, or sentiment. Verify outdated-tooltip warnings and post-rework mechanics.",
            }
        )
    (OUTPUT / "generated-build-sources.json").write_text(
        json.dumps({"schema_version": 1, "sources": build_sources}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    if validation_errors:
        raise SystemExit(f"Structural baseline has {len(validation_errors)} invalid profiles")
    print(
        f"Generated {len(profiles)} profiles with {index['claim_count']} structural claims "
        f"across {index['class_count']} classes."
    )


if __name__ == "__main__":
    main()
