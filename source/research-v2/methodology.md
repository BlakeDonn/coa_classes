# CoA specialization deep-research methodology

Research date: 2026-08-05

## Purpose

Build a current, source-linked profile for every Conquest of Azeroth specialization that explains what playing it feels like, how its loop changes while leveling or between major builds, what current players praise or dislike, and what limited performance evidence actually supports.

The dataset supports the Playstyle Atlas, full specialization profiles, and Decision Workbench. It does not produce a universal fun score or authoritative tier list.

## Evidence lanes

1. **Structural data**: current talent and skill tooltips, unlock levels, interactions, and official changelogs. These establish that a mechanic exists, not how difficult or enjoyable it feels.
2. **Observed reports**: recent build guides, player explanations, gameplay reports, performance posts, and verified videos. Each claim retains its date, level/build/content scope, and limitations.
3. **Inference**: our synthesis from structural data and reports. Inference is explicit, never silently promoted to fact.

Conflicting evidence is retained as separate claims. Build count is documentation coverage, not popularity or strength. Community DPS values are performance signals, not a cross-source ranking unless the source documents a comparable test.

## Freshness

- Target window: 2026-05-05 through 2026-08-05.
- Prefer evidence from the latest 30 days.
- Older evidence is retained only when no recent replacement exists and is labeled stale.
- Every external source records publication date and capture date.
- A post-rework source supersedes an older mechanical description only when the affected mechanic is identifiable.

## Claim rules

- Every material sentence in a finished profile maps to one or more claim IDs.
- `structural` claims cite talent/skill snapshot records or official changelogs.
- `observed` claims identify what a player, guide, video, or dataset actually reported.
- `inference` claims cite the structural or observed claims from which they were derived.
- Claims are scoped by level band, content, and major build/mode when those change the answer.
- Absence of builds, discussion, or videos is a documentation gap, not evidence that a spec is weak or unpopular.

## Complexity language

Quick comparisons use `low`, `moderate`, `high`, or a range between adjacent labels. Each label requires a reason and supporting claim IDs.

The six axes are:

1. **Core actions**: effective buttons regularly used in the core loop, distinct from the full utility kit.
2. **State tracking**: resources, buffs, debuffs, targets, modes, pets, and cooldown states watched simultaneously.
3. **Setup burden**: preparation before or between encounters, including builds, gear, forms, pets, recipes, placements, and group coordination. Strict in-combat ordering is described in the core-loop and state-tracking reasons rather than hidden in a separate score.
4. **Reactive decisions**: procs, encounter changes, triage, and branching priorities.
5. **Execution**: movement, positioning, aiming, target switching, and mechanical input demands.
6. **Failure cost**: throughput, survival, or recovery lost after a mistake.

Values may differ across `leveling_10_29`, `leveling_30_49`, `level_50_60`, `boss`, `dungeon_aoe`, and `pvp` contexts.

## Performance signals

Each signal records the reported value or band, source methodology, sample/context when stated, and limitations. Conflicting tier labels remain visible. We do not average incompatible sources.

## Sentiment synthesis

Sentiment is represented as recurring praise, frustrations, and contested themes. Each theme records the number of independent supporting sources in the captured corpus and links to its claims. Raw Reddit mood is not converted to a percentage or universal positive/negative label.

## Video verification

A video record requires creator, title, URL, publication date, content type, visible or stated level/build, and a verification note explaining whether the demonstrated mechanics still match the current snapshot. Search failure produces `no_verified_video_found` with the query date, never an invented recommendation.

## Scaling result

The schema was first validated on Artificer, Infinite, Time, Mechanics, Houndmaster, Farstrider, and Fortitude. It now covers all 70 specializations. Every profile exposes the six current complexity axes, one of the six broad Atlas feel families, micro-archetype playstyle tags, leveling shifts, fit guidance, failure modes, and evidence-specific coverage limits.
