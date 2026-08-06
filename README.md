# CoA Atlas — Conquest of Azeroth class & spec guide

Live site: https://blakedonn.github.io/coa_classes/

## Layout

- **Root** — the deployed static site (GitHub Pages serves from here).
  Atlas (`index.html`), Choose questionnaire (`choose.html`), class pages
  (`class.html`), and the Chronomancer loot guide (`loot.html`).
- **`source/`** — everything that produces the site:
  - `research-v2/` — the researched profile roster (all 70 specs, per-context
    complexity, sentiment, evidence tiers).
  - `snapshot/` — the captured talent/skill data snapshot.
  - `site/` — data-pipeline scripts (`build_explorer_data.py` regenerates
    `explorer-data.js` from `research-v2`).
  - `tools/` — research generation and curation scripts.
  - `design/`, `media-audit/` — design rulings and media verification records.

## Updating the site

Day-to-day work happens in the local working repo; deploys run through
`tools/deploy_coa_site.py` there (or the CoA Toolkit's "Deploy CoA Site"
launcher), which copies the runtime files here, commits, and pushes.
Pages rebuilds automatically on push.
