"""Apply curated claim-level research overlays to generated CoA baselines."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "reports" / "coa-specs" / "research-v2"
BASELINES = RESEARCH / "profiles"
OVERLAYS = RESEARCH / "overlays"
OUTPUT = RESEARCH / "enriched-profiles"
REQUIRED_COMPLEXITY_AXES = {
    "core_actions",
    "state_tracking",
    "setup_burden",
    "reactive_decisions",
    "execution",
    "failure_cost",
}
ATLAS_FAMILIES = {"planners", "sequencers", "commanders", "duelists", "marksmen", "strategists"}


def merge_dict(target: dict, patch: dict) -> None:
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(target.get(key), dict):
            merge_dict(target[key], value)
        else:
            target[key] = deepcopy(value)


def load_source_ids() -> set[str]:
    source_ids: set[str] = set()
    for name in (
        "source-ledger.json",
        "external-sources.json",
        "generated-build-sources.json",
        "discovered-sources.json",
    ):
        path = RESEARCH / name
        if path.exists():
            data = json.loads(path.read_text(encoding="utf-8-sig"))
            source_ids.update(source["id"] for source in data.get("sources", []))
    return source_ids


def apply_overlay(profile: dict, overlay: dict) -> dict:
    result = deepcopy(profile)
    merge_dict(result, overlay.get("set", {}))

    band_lookup = {band["id"]: band for band in result["level_bands"]}
    for band_id, band_patch in overlay.get("level_band_updates", {}).items():
        if band_id not in band_lookup:
            raise ValueError(f"Unknown level band {band_id!r} for {result['spec']['id']}")
        merge_dict(band_lookup[band_id], band_patch)

    result["claims"].extend(deepcopy(overlay.get("append_claims", [])))
    return result


def referenced_claim_ids(value: object, key: str | None = None) -> set[str]:
    found: set[str] = set()
    if isinstance(value, dict):
        for child_key, child in value.items():
            if child_key in {"claim_ids", "known_issue_claim_ids"} and isinstance(child, list):
                found.update(str(item) for item in child)
            else:
                found.update(referenced_claim_ids(child, child_key))
    elif isinstance(value, list):
        for child in value:
            found.update(referenced_claim_ids(child, key))
    return found


def validate(profile: dict, source_ids: set[str]) -> list[str]:
    errors: list[str] = []
    claims = profile.get("claims", [])
    claim_ids = [claim["id"] for claim in claims]
    known_claim_ids = set(claim_ids)
    if len(claim_ids) != len(known_claim_ids):
        errors.append("duplicate claim IDs")

    missing_claims = referenced_claim_ids(profile) - known_claim_ids
    if missing_claims:
        errors.append(f"missing referenced claims: {sorted(missing_claims)}")

    missing_sources = {
        source_id
        for claim in claims
        for source_id in claim.get("source_ids", [])
        if source_id not in source_ids
    }
    if missing_sources:
        errors.append(f"missing sources: {sorted(missing_sources)}")

    allowed_values = {"unknown", "low", "low-moderate", "moderate", "moderate-high", "high"}
    for axis, contexts in profile.get("complexity", {}).items():
        for context, entry in contexts.items():
            if entry.get("value") not in allowed_values:
                errors.append(f"invalid complexity value {axis}.{context}: {entry.get('value')!r}")
            if entry.get("value") != "unknown" and (not entry.get("reason") or not entry.get("claim_ids")):
                errors.append(f"unsupported complexity value {axis}.{context}")

    complexity = profile.get("complexity", {})
    for axis in sorted(REQUIRED_COMPLEXITY_AXES):
        contexts = complexity.get(axis)
        if not isinstance(contexts, dict):
            errors.append(f"missing required complexity axis: {axis}")
            continue
        if not any(entry.get("value") != "unknown" for entry in contexts.values() if isinstance(entry, dict)):
            errors.append(f"required complexity axis has no known value: {axis}")

    identity = profile.get("identity", {})
    primary_family = identity.get("primary_family")
    if primary_family not in ATLAS_FAMILIES:
        errors.append(f"invalid Atlas primary family: {primary_family!r}")
    invalid_cross_links = set(identity.get("also_fits", [])) - ATLAS_FAMILIES
    if invalid_cross_links:
        errors.append(f"invalid Atlas cross-links: {sorted(invalid_cross_links)}")
    if not identity.get("playstyle_tags"):
        errors.append("missing micro-archetype playstyle tags")

    fit = profile.get("fit", {})
    if not fit.get("enjoy_if") or not fit.get("avoid_if"):
        errors.append("missing enjoy-if or avoid-if fit guidance")
    coverage = profile.get("coverage", {})
    if not coverage.get("overall_confidence") or not coverage.get("gaps"):
        errors.append("missing confidence or research gaps")
    return errors


def main() -> None:
    source_ids = load_source_ids()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    errors = []
    for overlay_path in sorted(OVERLAYS.glob("*.json")):
        overlay = json.loads(overlay_path.read_text(encoding="utf-8-sig"))
        baseline_path = BASELINES / overlay["baseline"]
        baseline = json.loads(baseline_path.read_text(encoding="utf-8-sig"))
        profile = apply_overlay(baseline, overlay)
        profile_errors = validate(profile, source_ids)
        if profile_errors:
            errors.append({"profile": profile["spec"]["id"], "errors": profile_errors})
        output_path = OUTPUT / overlay["baseline"]
        output_path.write_text(json.dumps(profile, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        results.append(profile)

    index = {
        "schema_version": 2,
        "generated": "2026-08-06",
        "profile_count": len(results),
        "profiles": [profile["spec"]["id"] for profile in results],
        "validation_errors": errors,
    }
    spec_ids = [profile["spec"]["id"] for profile in results]
    if len(results) != 70:
        errors.append({"profile": "__roster__", "errors": [f"expected 70 enriched profiles, found {len(results)}"]})
    if len(spec_ids) != len(set(spec_ids)):
        errors.append({"profile": "__roster__", "errors": ["duplicate enriched profile IDs"]})
    index["validation_errors"] = errors
    (RESEARCH / "enriched-index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    if errors:
        raise SystemExit(f"Enriched profiles have {len(errors)} validation failures")
    print(f"Generated and validated {len(results)} enriched profiles.")


if __name__ == "__main__":
    main()
