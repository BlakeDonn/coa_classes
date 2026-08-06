# Fable-high sponsor brief: CoA class explorer

## Mandate

Propose a better class and specialization exploration experience for the existing static Conquest of Azeroth guide. The user likes the current dashboard, but wants it to make choosing a spec easier based on fun, complexity, actual playstyle, and useful recent videos when they exist.

This is a detached product and UX sponsor task. Produce a candidate proposal only. Do not edit implementation files, do not claim final authority, and do not treat subjective judgments as facts. The user will choose a concept before implementation.

## Current baseline to inspect

- `reports/coa-specs/site/index.html`
- `reports/coa-specs/site/styles.css`
- `reports/coa-specs/site/app.js`
- `reports/coa-specs/site/data.js`
- `reports/coa-specs/coa-classes-and-specs-2026-08-05.md`
- `reports/coa-specs/site/loot.html` for the shared visual language

The baseline covers 21 classes, 70 specializations, and 177 recent community builds. Preserve its compact dark fantasy dashboard character, fast filtering, static/offline operation, and honest evidence labels.

## Product questions to solve

1. How can a new player quickly tell whether a spec is likely to feel fun for them without presenting one universal fun score?
2. How should complexity be decomposed? Consider execution speed, rotation or priority load, setup, reactive decisions, button density, punishment for mistakes, and whether complexity changes while leveling or in groups.
3. How should playstyle feel be expressed? Consider pace, range, mobility, setup versus immediacy, burst versus sustain, pets, DoTs, control, support responsibility, solo comfort, and encounter preference.
4. How can comparison and progressive disclosure work across 70 specs without turning the page into a spreadsheet?
5. How should recent videos appear when verified videos exist, and how should the UI honestly say that no current video was found? Never invent a creator, title, URL, date, or endorsement.
6. How should current evidence, inference, uncertainty, and player opinion be distinguished?

Use real examples from the current data, especially Chronomancer Infinite, Artificer, and Time, plus Houndmaster, Tinker Mechanics, Sentinel, Farstrider, and Incineration where useful.

## Deliverable

Return concise markdown containing:

1. A critique of the current class portion focused on choice quality, not decorative taste.
2. Three meaningfully different layout concepts. For each, include a compact ASCII wireframe populated with real project examples, the intended decision flow, strengths, and tradeoffs.
3. A recommended information model for fun-fit signals, decomposed complexity, playstyle traits, and video evidence.
4. A policy for subjective claims and evidence freshness.
5. Your recommended concept or hybrid and why.
6. Acceptance criteria for a later implementation.
7. The smallest set of product choices the user needs to make before implementation.

Keep the proposal practical for plain HTML, CSS, and JavaScript with static local data. Do not produce code and do not modify files.
