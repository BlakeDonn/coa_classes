# CoA specialization research v2

This directory is the evidence layer for the 70-spec class explorer. It is intentionally separate from the live site and the design mockups.

## Current state

- 21 classes and 70 specializations have a current structural baseline.
- The baseline contains 2,811 claim-addressable talent facts split into five level bands.
- Every specialization has a recent evidence packet containing its community-build inventory, direct discussion sources when found, and two separate performance signals.
- All 70 specializations have validated claim-level overlays and generated enriched profiles.
- The first 31 profiles received a detailed class-by-class pass. The remaining 39 received a controlled roster-completion pass with curated play families, six-axis complexity, leveling shifts, fit guidance, failure modes, indexed community evidence, and explicit confidence limits.
- Every profile has one normalized Atlas shelf (`planners`, `sequencers`, `commanders`, `duelists`, `marksmen`, or `strategists`), optional broad-family cross-links, and separate micro-archetype `playstyle_tags`.
- Coverage is not uniform. Profiles marked `curated_structural_interpretation`, `thin_indexed`, or `medium-low` must retain their visible caveats until stronger current guides or direct live-play checks are available.

## Important files

- `methodology.md`: evidence lanes, freshness rules, contexts, and complexity axes.
- `profiles/`: generated structural baselines for all 70 specs.
- `overlays/`: curated claim-level additions and interpretations.
- `enriched-profiles/`: validated merge of baselines and available overlays.
- `community-build-inventory.json`: complete 70-spec Build Hub inventory. Build count is documentation depth, not power.
- `discovered-sources.json`: recent roster-wide source discovery index.
- `performance-signals.json`: complete 70-spec Mythic upload counts plus the separate 62-entry reported DPS snapshot.
- `evidence-packets.json`: one curation packet per spec combining the available evidence lanes.
- `evidence-coverage.json`: complete source and curation status matrix.
- `research-validation.json`: machine-readable inventory, linkage, and freshness checks.

## Regenerate and validate

```powershell
python tools\build_coa_research_v2.py
python tools\apply_coa_research_overlays.py
```

The first command validates roster coverage, evidence linkage, and the 90-day freshness window. The second validates overlay claim IDs, source IDs, and supported complexity values.

`tools\generate_coa_remaining_overlays.py` is an idempotent roster-completion helper. It only creates missing overlays and never replaces the detailed hand-authored files.

## Interpretation guardrails

- Do not average the DPS snapshot with upload counts, guide tiers, or player sentiment.
- Do not treat a low upload count as evidence that a spec is weak.
- Do not compare tank or support off-role DPS directly with primary damage specs.
- Do not turn sentiment themes into approval percentages.
- Do not call a video current until its URL, title, creator, publication date, and mechanics have been verified.
- Preserve conflicts by source, level band, content type, and build rather than resolving them into one score.
