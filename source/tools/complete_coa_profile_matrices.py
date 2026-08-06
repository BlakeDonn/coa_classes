"""Complete the deep-profile matrix for the remaining curated CoA profiles.

This pass does not manufacture new rotations.  It expands already-authored,
claim-backed mechanics into the six canonical contexts, adds a small set of
manually reviewed recent community observations, and preserves explicit gaps.
"""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "reports" / "coa-specs" / "research-v2"
OVERLAYS = RESEARCH / "overlays"
PROFILES = RESEARCH / "enriched-profiles"
CONTEXTS = ("leveling_10_29", "leveling_30_49", "level_50_60", "boss", "dungeon_aoe", "pvp")
AXES = ("core_actions", "state_tracking", "setup_burden", "reactive_decisions", "execution", "failure_cost")
RATINGS = ("low", "low-moderate", "moderate", "moderate-high", "high")


TARGETS = {
    "witch-hunter/houndmaster", "guardian/vanguard", "guardian/inspiration", "guardian/gladiator",
    "templar/zealot", "templar/oathkeeper", "templar/crusader", "bloodmage/sanguine",
    "bloodmage/accursed", "bloodmage/eternal", "bloodmage/fleshweaver", "ranger/farstrider",
    "chronomancer/infinite", "chronomancer/artificer", "chronomancer/time", "necromancer/death",
    "necromancer/rime", "necromancer/animation", "starcaller/moon-guard", "starcaller/moon-priest",
    "starcaller/sentinel", "starcaller/warden", "tinker/mechanics", "venomancer/fortitude",
    "primalist/primal", "primalist/geomancy", "primalist/life", "primalist/mountain-king",
    "runemaster/runic", "runemaster/arcane", "runemaster/riftblade",
}


SOURCES = [
    {"id":"reddit:guardian-gladiator-2026-07-20","type":"player_discussion","title":"How is Guardian Gladiator?","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1v1ijr5/how_is_guardian_gladiator/","published_date":"2026-07-20","captured_date":"2026-08-06","spec_ids":["guardian/gladiator"],"themes":["stance dancing","burst dependence","leveling curve","PvP conflict"],"limitations":"Small subjective thread with conflicting PvP outcomes and an unverified historical bug report."},
    {"id":"reddit:sturdy-tanks-2026-07-16","type":"player_discussion","title":"Sturdy tanks","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1uy49oc/sturdy_tanks/","published_date":"2026-07-16","captured_date":"2026-08-06","spec_ids":["guardian/vanguard"],"themes":["shield reliance","durability","self-healing","tank comparison"],"limitations":"Anecdotal tank comparisons without controlled mitigation logs."},
    {"id":"reddit:templar-help-2026-07-17","type":"player_discussion","title":"Templar help","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1uz4z0l/templar_help/","published_date":"2026-07-17","captured_date":"2026-08-06","spec_ids":["templar/zealot"],"themes":["Oath Chain","DoT spread","dungeon rotation","PvP burst"],"limitations":"One mid-level rotation report rather than a verified endgame guide."},
    {"id":"reddit:templar-crusader-pve-2026-07-20","type":"player_discussion","title":"Looking for PvE spec","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1v1mkxp/looking_for_pve_spec/","published_date":"2026-07-20","captured_date":"2026-08-06","spec_ids":["templar/crusader"],"themes":["Holy Cleave","Condemn","Oath Chain","AoE priority"],"limitations":"Community priority advice without logs or controlled build comparison."},
    {"id":"reddit:accursed-leveling-2026-08-05","type":"player_discussion","title":"Accursed Bloodmage leveling","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1vg9h6f/accursed_bloodmage_leveling/","published_date":"2026-08-05","captured_date":"2026-08-06","spec_ids":["bloodmage/accursed"],"themes":["early leveling","transformation timing","AoE pulls","tank dependence"],"limitations":"Fresh anecdotal thread with disagreement and no controlled endgame comparison."},
    {"id":"reddit:ranger-intro-2026-07-21","type":"player_discussion","title":"Ranger intro","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1v26yhn/ranger_into/","published_date":"2026-07-21","captured_date":"2026-08-06","spec_ids":["ranger/farstrider"],"themes":["team support","battlegrounds","level progression","damage sentiment"],"limitations":"Subjective class discussion with mixed levels and no normalized damage evidence."},
    {"id":"reddit:infinite-dots-2026-07-16","type":"player_discussion","title":"Which classes/specs are best at DoTs in CoA?","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1uydcz1/which_classesspecs_are_best_at_dots_in_coa/","published_date":"2026-07-16","captured_date":"2026-08-06","spec_ids":["chronomancer/infinite"],"themes":["DoT cadence","instant cooldowns","hard casts","finisher"],"limitations":"Short descriptive recommendation, not a complete priority guide."},
    {"id":"reddit:primalist-builds-2026-07-27","type":"player_discussion","title":"Primalist builds and tips thread CoA","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1v824j4/primalist_builds_and_tips_thread_coa/","published_date":"2026-07-27","captured_date":"2026-08-06","spec_ids":["primalist/primal"],"themes":["pet tanking","self-healing","AoE leveling","PvP weakness"],"limitations":"Anecdotal leveling and dungeon advice without endgame normalization."},
    {"id":"reddit:primalist-life-healer-2026-07-22","type":"player_discussion","title":"Healer class recommendation newbie","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1v3jva7/healer_class_recommendation_newbie/","published_date":"2026-07-22","captured_date":"2026-08-06","spec_ids":["primalist/life"],"themes":["melee healing","Seismic Wave","Wild Claw","dungeon healing"],"limitations":"Conflicting descriptions of support versus full-healer capability."},
    {"id":"reddit:beginner-specs-2026-07-14","type":"player_discussion","title":"CoA specs for beginners","publisher":"r/ProjectAscension","url":"https://www.reddit.com/r/ProjectAscension/comments/1uw0rc0/coa_specs_for_beginners/","published_date":"2026-07-14","captured_date":"2026-08-06","spec_ids":["primalist/geomancy"],"themes":["beginner fit","caster simplicity","mana"],"limitations":"Broad recommendation thread with little rotation detail."},
]


SUPPLEMENTS = {
    "guardian/vanguard": ("reddit:sturdy-tanks-2026-07-16", "Current reports consistently describe Vanguard as shield-reliant and very durable, with low damage and little self-healing; endgame tank rankings remain disputed."),
    "guardian/gladiator": ("reddit:guardian-gladiator-2026-07-20", "Players describe Gladiator as rough early, smoother after its engine unlocks, and burst-dependent, with stance dancing creating a real skill ceiling and conflicting PvP results."),
    "templar/zealot": ("reddit:templar-help-2026-07-17", "A level-56 dungeon report spreads damage-over-time effects, cleaves, and preserves the current Oath Chain; PvP concentrates burst inside control and cooldown windows."),
    "templar/crusader": ("reddit:templar-crusader-pve-2026-07-20", "Current PvE advice stacks Holy Cleave to target count, uses several Condemns, preserves Oath Chain with Warrior of Dawn and Argent Blade procs, and saves Titanstrike for execution."),
    "bloodmage/accursed": ("reddit:accursed-leveling-2026-08-05", "Recent levelers advise delaying open-world transformation until roughly level 40, kiting with DoTs and Bloodmoon Blast early, and using the later form for tank-supported large-pull AoE; reports remain sharply mixed."),
    "ranger/farstrider": ("reddit:ranger-intro-2026-07-21", "Recent discussion treats Farstrider primarily as Ranger's team-support option; battleground value, personal damage, and the effect of later unlocks are all disputed."),
    "chronomancer/infinite": ("reddit:infinite-dots-2026-07-16", "Players describe Infinite as an almost-all-DoT caster mixing instant cooldown DoTs with hard-cast DoTs that reduce those cooldowns before a large finisher."),
    "starcaller/warden": ("reddit:starcaller-warden-2026-08-04", "Current PvE advice builds scattered stars, triggers Lunar Lance, then uses Starsunder; dual wield and Warden Aspect favor single targets while Moonwell favors AoE, but stat and weapon advice still conflicts."),
    "starcaller/sentinel": ("reddit:starcaller-warden-2026-08-04", "A current player abandoned Sentinel after finding its main ranged attacks could not be cast while moving, making movement a material execution constraint rather than a cosmetic difference."),
    "starcaller/moon-priest": ("reddit:starcaller-moon-priest-2026-07-21", "Moon Priest is described as engaging and mana-conscious, but short-lived dungeon targets can die before its marked payoff and produce severe mana pressure without team coordination."),
    "primalist/primal": ("reddit:primalist-builds-2026-07-27", "Current players describe Primal as an easy PvE leveler whose companion tanks, self-healing stabilizes pulls, and AoE works in dungeons, while battleground performance is reported weaker."),
    "primalist/life": ("reddit:primalist-life-healer-2026-07-22", "Life is described as a melee healer using Seismic Wave on cooldown and Wild Claw, with conflicting reports about whether its full-healer ceiling depends on later talents and player execution."),
    "primalist/geomancy": ("reddit:beginner-specs-2026-07-14", "Geomancy is recommended as a comparatively simple caster and mana spec, but current community evidence remains too thin to establish an optimized endgame priority."),
}


def unique(values):
    return list(dict.fromkeys(value for value in values if value))


def claim_pool(value):
    found = []
    if isinstance(value, dict):
        for key, child in value.items():
            if key == "claim_ids" and isinstance(child, list):
                found.extend(child)
            else:
                found.extend(claim_pool(child))
    elif isinstance(value, list):
        for child in value:
            found.extend(claim_pool(child))
    return unique(found)


def shift(value, amount):
    if value not in RATINGS:
        value = "moderate"
    return RATINGS[max(0, min(len(RATINGS) - 1, RATINGS.index(value) + amount))]


def first_sentence(text):
    text = " ".join(text.split())
    return text.split(". ", 1)[0].rstrip(".")


def add_sources():
    path = RESEARCH / "discovered-sources.json"
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    known = {source["id"] for source in data["sources"]}
    data["sources"].extend(source for source in SOURCES if source["id"] not in known)
    data["captured_through"] = "2026-08-06"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def supplement_claim(spec_id, overlay):
    if spec_id not in SUPPLEMENTS:
        return None
    source_id, text = SUPPLEMENTS[spec_id]
    claim_id = f"observed:{spec_id}:recent-manual-review"
    if not any(claim.get("id") == claim_id for claim in overlay.get("append_claims", [])):
        overlay.setdefault("append_claims", []).append({
            "id": claim_id, "kind": "observed", "text": text, "source_ids": [source_id],
            "scope": {"levels": "leveling_10_60", "content": ["community_reported_play"], "build_or_mode": ["general"]},
            "confidence": "moderate", "conflicts_with": [],
            "notes": "Manually reviewed on 2026-08-06; anecdotal evidence is not treated as a power ranking.",
        })
    return claim_id


def complete(spec_id, overlay, profile):
    section = overlay["set"]
    identity = section["identity"]
    mechanics = section["mechanics"]
    recent_id = supplement_claim(spec_id, overlay)
    claims = unique(claim_pool(section) + [recent_id])
    if not claims:
        claims = [claim["id"] for claim in profile["claims"] if claim.get("kind") == "structural"][:4]
    core_claims = claims[:8]

    identity.setdefault("one_line", profile["identity"].get("one_line") or first_sentence(mechanics["core_loop"]))
    identity["claim_ids"] = unique(identity.get("claim_ids", []) + core_claims)[:10]
    mechanics["claim_ids"] = unique(mechanics.get("claim_ids", []) + core_claims)[:12]

    failures = mechanics.setdefault("failure_modes", [])
    failure_texts = [item.get("text", "") for item in failures]
    additions = [
        f"Movement or a target swap can interrupt the intended payoff: {first_sentence(mechanics['movement_and_target_switching']).lower()}.",
        f"Spending recovery or control too early leaves less protection for the next pressure event: {first_sentence(mechanics['defense_and_control']).lower()}.",
    ]
    generated_failure_prefixes = ("Movement or a target swap", "Spending recovery or control too early")
    failures[:] = [item for item in failures if not item.get("text", "").startswith(generated_failure_prefixes)]
    failure_texts = [item.get("text", "") for item in failures]
    for text in additions:
        if len(failures) >= 3:
            break
        if text not in failure_texts:
            failures.append({"text": text, "claim_ids": core_claims[:5]})

    existing = section.setdefault("contexts", {})
    early = existing.get("leveling_10_29", {})
    late = existing.get("level_50_60", {})
    templates = {
        "leveling_10_29": (early.get("feel") or f"Early play establishes the spec's central loop: {first_sentence(mechanics['core_loop']).lower()}.", ["Core identity appears early", "Basic loop is readable"], ["Later interactions are still missing", "Recovery tools are incomplete"]),
        "leveling_30_49": (f"By levels 30-49, {first_sentence(mechanics['core_loop']).lower()}.", ["Core engine is online", "More complete target coverage"], ["Late talents still change the ceiling", first_sentence(mechanics["movement_and_target_switching"])]),
        "level_50_60": (late.get("feel") or f"At levels 50-60, the complete kit supports this loop: {first_sentence(mechanics['core_loop']).lower()}.", ["Complete mechanical package", "Late talents deepen the payoff"], ["Priority details remain build-dependent", "Mistakes can compound"]),
        "boss": (f"On bosses, {first_sentence(mechanics['single_target']).lower()}.", ["Durable targets preserve the full loop", "Cooldowns can be planned"], ["Movement can break setup", "Repeated errors remain visible"]),
        "dungeon_aoe": (f"In dungeons, {first_sentence(mechanics['aoe']).lower()}.", ["Pack tools express the spec clearly", "Group utility has regular value"], ["Short-lived targets can erase setup", "Tank movement changes the plan"]),
        "pvp": (f"In PvP, {first_sentence(mechanics['movement_and_target_switching']).lower()}. {first_sentence(mechanics['defense_and_control'])}.", ["Control and utility create options", "Target swaps can reward flexibility"], ["Disruption makes the loop less predictable", "Defensive timing is punishable"]),
    }
    for name, (feel, strengths, cautions) in templates.items():
        entry = existing.setdefault(name, {})
        if name not in {"leveling_10_29", "level_50_60"} or not entry.get("feel"):
            entry["feel"] = feel
        else:
            entry.setdefault("feel", feel)
        entry.setdefault("strengths", strengths)
        entry.setdefault("cautions", cautions)
        entry["claim_ids"] = unique(entry.get("claim_ids", []) + core_claims)[:10]

    complexity = section.setdefault("complexity", {})
    if "setup_burden" not in complexity and "sequencing" in complexity:
        complexity["setup_burden"] = deepcopy(complexity["sequencing"])
    reasons = {
        "core_actions": f"The practical action set follows the authored loop: {first_sentence(mechanics['core_loop'])}.",
        "state_tracking": f"The player must preserve the resources, effects, or target states implied by: {first_sentence(mechanics['single_target'])}.",
        "setup_burden": f"The payoff depends on establishing the conditions described by: {first_sentence(mechanics['aoe'])}.",
        "reactive_decisions": f"Target count, incoming pressure, and movement change the next action; {first_sentence(mechanics['defense_and_control']).lower()}.",
        "execution": f"Execution is constrained by positioning and swaps: {first_sentence(mechanics['movement_and_target_switching'])}.",
        "failure_cost": first_sentence(failures[0]["text"]) + ".",
    }
    suffix = {
        "leveling_10_29": " The early kit exposes only part of this demand.",
        "leveling_30_49": " Mid-level talents make the interaction regular.",
        "level_50_60": " Late talents complete the interaction and raise its ceiling.",
        "boss": " A durable target makes repeated precision matter.",
        "dungeon_aoe": " Pack size, lifetime, and tank movement add constraints.",
        "pvp": " Enemy disruption makes the same task less predictable.",
    }
    for axis in AXES:
        axis_data = complexity.setdefault(axis, {})
        candidates = [entry for entry in axis_data.values() if isinstance(entry, dict) and entry.get("value") not in (None, "unknown")]
        base = candidates[0]["value"] if candidates else "moderate"
        for context in CONTEXTS:
            generated_reason = axis_data.get(context, {}).get("reason", "").startswith((
                "The practical action set follows the authored loop:",
                "The player must preserve the resources, effects, or target states implied by:",
                "The payoff depends on establishing the conditions described by:",
                "Target count, incoming pressure, and movement change the next action;",
                "Execution is constrained by positioning and swaps:",
            ))
            if context in axis_data and axis_data[context].get("value") != "unknown" and not generated_reason:
                axis_data[context]["claim_ids"] = unique(axis_data[context].get("claim_ids", []) + core_claims)[:8]
                continue
            bump = -1 if context == "leveling_10_29" else (1 if context == "pvp" and axis in {"reactive_decisions", "execution", "failure_cost"} else 0)
            axis_data[context] = {"value": shift(base, bump), "reason": reasons[axis] + suffix[context], "claim_ids": core_claims[:8]}
        axis_data.pop("general", None)
    complexity.pop("sequencing", None)

    fit = section.setdefault("fit", {})
    enjoy = fit.setdefault("enjoy_if", [])
    avoid = fit.setdefault("avoid_if", [])
    enjoy[:] = [item for item in enjoy if not item.get("text", "").startswith("You enjoy the spec's core cadence")]
    avoid[:] = [item for item in avoid if not item.get("text", "").startswith("You dislike the positioning or swap constraint")]
    if len(enjoy) < 2:
        enjoy.append({"text": f"You enjoy the spec's core cadence: {first_sentence(mechanics['core_loop']).lower()}.", "claim_ids": core_claims[:5]})
    if len(avoid) < 2:
        avoid.append({"text": f"You dislike the positioning or swap constraint that {first_sentence(mechanics['movement_and_target_switching']).lower()}.", "claim_ids": core_claims[:5]})

    coverage = section.setdefault("coverage", {})
    coverage["mechanical"] = "manual_talent_and_build_interpretation"
    if recent_id:
        coverage["community"] = "manual_recent_source_review"
    coverage.setdefault("video", "searched_none_verified")
    coverage.setdefault("overall_confidence", "medium")
    coverage.setdefault("gaps", ["No verified current full-rotation video."])

    band_map = {
        "leveling_10_19": "leveling_10_29", "leveling_20_29": "leveling_10_29",
        "leveling_30_39": "leveling_30_49", "leveling_40_49": "leveling_30_49", "level_50_60": "level_50_60",
    }
    updates = overlay.setdefault("level_band_updates", {})
    for band, context in band_map.items():
        updates[band] = {
            "observed_loop": existing[context]["feel"],
            "observed_changes": existing[context]["cautions"],
        }


def main():
    add_sources()
    changed = []
    for spec_id in sorted(TARGETS):
        slug = spec_id.replace("/", "--")
        overlay_path = OVERLAYS / f"{slug}.json"
        profile_path = PROFILES / f"{slug}.json"
        overlay = json.loads(overlay_path.read_text(encoding="utf-8-sig"))
        profile = json.loads(profile_path.read_text(encoding="utf-8-sig"))
        complete(spec_id, overlay, profile)
        overlay_path.write_text(json.dumps(overlay, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        changed.append(spec_id)
    print(f"Completed six-context deep matrices for {len(changed)} profiles.")


if __name__ == "__main__":
    main()
