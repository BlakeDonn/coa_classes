(() => {
  "use strict";

  const data = window.COA_EXPLORER;
  if (!data) throw new Error("Explorer data failed to load.");

  const CTX_LABELS = {
    leveling_10_29: "Leveling 10–29", leveling_30_49: "Leveling 30–49",
    level_50_60: "Level 50–60", boss: "Boss", dungeon_aoe: "Dungeon AoE", pvp: "PvP",
  };
  const AXIS_LABELS = {
    core_actions: "Core actions", state_tracking: "State tracking", setup_burden: "Setup burden",
    reactive_decisions: "Reactive decisions", execution: "Execution", failure_cost: "Failure cost",
  };
  const TIER_LABELS = { data: "Data", players: "Players", inference: "Inference" };
  const TIER_TITLES = {
    data: "Structural fact from the current talent snapshot.",
    players: "Recent player reports and guides. Secondhand.",
    inference: "Our synthesis. The weakest evidence tier.",
  };
  const CX_ORDINAL = { "low": 1, "low-moderate": 2, "moderate": 3, "moderate-high": 4, "high": 5 };
  const CLASS_GLYPHS = {
    "Barbarian": "⚔", "Witch Doctor": "☿", "Felsworn": "♆", "Witch Hunter": "✟", "Stormbringer": "⚡",
    "Knight of Xoroth": "♜", "Guardian": "🛡", "Templar": "☩", "Bloodmage": "♥", "Ranger": "➶",
    "Chronomancer": "⌛", "Necromancer": "☠", "Pyromancer": "🜂", "Cultist": "👁", "Starcaller": "✦",
    "Sun Cleric": "☀", "Tinker": "⚙", "Venomancer": "🕷", "Reaper": "☾", "Primalist": "⛰", "Runemaster": "ᚱ",
  };

  const specById = Object.fromEntries(data.specs.map(s => [s.id, s]));
  const famById = Object.fromEntries(data.families.map(f => [f.id, f]));
  const state = { search: "", role: "All", range: "All", research: "All" };
  const tray = [];
  let wbCtx = "boss";

  const el = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[c]);
  const slug = id => id.replace("/", "--");
  const glyph = s => CLASS_GLYPHS[s.klass] || "✦";
  const qcls = s => s.enriched ? "q-c" : "q-w";

  const tierBadges = ts => (ts || []).map(t =>
    `<span class="tier tier-${t}" title="${esc(TIER_TITLES[t])}">${TIER_LABELS[t]}</span>`).join(" ");

  const pips = n =>
    `<span class="pips">${[1,2,3,4,5].map(i => `<span class="${i <= n ? "" : "off"}">◆</span>`).join("")}</span>`;
  const cxPips = cell => cell
    ? `${pips(CX_ORDINAL[cell.v] || 0)}`
    : `<span class="pips-na">not rated for this context</span>`;
  const cxCell = (s, axis, ctx = "boss") => (s.complexity[axis] || {})[ctx] || null;
  const bestCtx = s => {
    if (s.contexts.boss || Object.values(s.complexity).some(a => a.boss)) return "boss";
    const ids = Object.keys(CTX_LABELS).filter(c => s.contexts[c] || Object.values(s.complexity).some(a => a[c]));
    return ids[0] || null;
  };

  // ---------- Atlas ----------

  function matches(s) {
    const q = state.search.trim().toLowerCase();
    if (q) {
      const hay = [s.name, s.klass, s.oneLine, s.fineFamily, famById[s.atlas].name,
        ...s.roles, ...s.range, ...s.mech.resources, ...s.mech.builders, ...s.mech.spenders,
      ].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.role !== "All" && !s.roles.includes(state.role)) return false;
    if (state.range !== "All" && !s.range.includes(state.range)) return false;
    if (state.research === "Curated" && !s.enriched) return false;
    if (state.research === "In progress" && s.enriched) return false;
    return true;
  }

  function cardTemplate(s) {
    const bc = bestCtx(s) || "boss";
    const rows = [["Setup burden", "setup_burden"], ["Tracking", "state_tracking"],
                  ["Reactive", "reactive_decisions"], ["Failure cost", "failure_cost"]];
    return `<article class="plate spec-card ${qcls(s)}" tabindex="0" role="button" style="--class-color:${s.color}"
        data-open="${s.id}" aria-label="Open ${esc(s.name)} profile">
      <div class="card-top">
        <span class="spec-icon">${s.media.icons[0]
          ? `<img src="https://coabuildhub.com/skill-icons/${esc(s.media.icons[0].icon)}.jpg" alt="" loading="lazy">`
          : glyph(s)}</span>
        <div><h3>${esc(s.name)}</h3>
          <div class="sub">${esc(s.klass)} · ${[...s.roles, ...s.range].map(esc).join(" · ")}</div></div>
      </div>
      <div class="card-mid">
        <p>${esc(s.oneLine)}</p>
        ${rows.some(([, k]) => cxCell(s, k, bc))
          ? `<div class="pips-grid">${rows.map(([n, k]) =>
              `<span class="pip-row">${n}${cxPips(cxCell(s, k, bc))}</span>`).join("")}</div>`
          : `<div class="pips-na" style="margin-left:0">No contextual complexity rating is available for this view.</div>`}
      </div>
      <div class="card-foot">
        <span>${s.community.count ? `${s.community.count} build${s.community.count === 1 ? "" : "s"}` : "no builds"}</span>
        ${s.enriched && s.hasShift ? `<span class="chip-shift">· evolves</span>` : ""}
        <button class="bench-add ${tray.includes(s.id) ? "in-tray" : ""}" data-tray="${s.id}">${tray.includes(s.id) ? "✓ Bench" : "+ Bench"}</button>
        <span class="q-tag">${s.enriched ? "Curated" : "In progress"}</span>
      </div>
    </article>`;
  }

  function render() {
    const visible = data.specs.filter(matches);
    const byFamily = new Map(data.families.map(f => [f.id, []]));
    visible.forEach(s => byFamily.get(s.atlas).push(s));

    el("familyNav").innerHTML = data.families.map(f =>
      `<a href="#fam-${f.id}">${esc(f.name)} · ${byFamily.get(f.id).length}</a>`).join("");

    el("atlas").innerHTML = data.families.map(f => {
      const specs = byFamily.get(f.id);
      if (!specs.length) return "";
      const curated = specs.filter(s => s.enriched).length;
      return `<section class="family-section" id="fam-${f.id}">
        <header class="plate fam-banner">
          <div class="kick">Playstyle family · ${specs.length} spec${specs.length === 1 ? "" : "s"} · ${curated} curated</div>
          <h2>${esc(f.name)}</h2>
          <p>${esc(f.tagline)} ${esc(f.feels)}</p>
          <div class="fam-note">Family grouping is editorial. Specs still in progress await curated research.</div>
        </header>
        <div class="atlas-grid">${specs.map(cardTemplate).join("")}</div>
      </section>`;
    }).join("");

    const count = visible.length;
    el("resultCount").textContent = count === data.specCount
      ? `Showing all ${data.specCount} specializations`
      : `Showing ${count} of ${data.specCount} specializations`;
    el("emptyState").hidden = count !== 0;
  }

  // ---------- Profile dialog: lean TL;DR + codex folds ----------

  function contextSection(s, ctxId) {
    const ctx = s.contexts[ctxId];
    const axes = Object.entries(AXIS_LABELS).map(([axis, label]) => {
      const cell = (s.complexity[axis] || {})[ctxId];
      return cell ? `<div class="cx-row"><span class="n">${label}</span>
        <span>${pips(CX_ORDINAL[cell.v] || 0)} <span style="color:var(--gold);font-size:10.5px;text-transform:capitalize">${esc(cell.v)}</span> ${tierBadges(cell.tiers)}</span>
        <span class="why">${esc(cell.why)}</span></div>` : "";
    }).filter(Boolean).join("");
    return `
      ${ctx?.feel ? `<p class="ctx-feel">${esc(ctx.feel)} ${tierBadges(ctx.tiers)}</p>` : ""}
      ${(ctx?.strengths?.length || ctx?.cautions?.length) ? `<div class="sc-cols">
        ${ctx.strengths?.length ? `<div><span class="lab">Strengths</span><ul>${ctx.strengths.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
        ${ctx.cautions?.length ? `<div><span class="lab caution">Cautions</span><ul>${ctx.cautions.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
      </div>` : ""}
      ${axes || `<p class="cx-empty">Complexity for this context has not been researched yet.</p>`}`;
  }

  const fold = (title, body, hint = "", open = false) => body ? `
    <div class="fold ${open ? "open" : ""}">
      <button class="fold-head"><h4>${title}</h4>${hint ? `<span class="f-hint">${esc(hint)}</span>` : ""}<span class="arrow">▸</span></button>
      <div class="fold-body">${body}</div>
    </div>` : "";

  function mechFold(s) {
    const parts = [];
    if (s.mech.coreLoop && s.mech.coreLoop !== s.oneLine) parts.push(`<p><b style="color:#c9c3b2">The loop.</b> ${esc(s.mech.coreLoop)}</p>`);
    if (s.mech.st) parts.push(`<p><b style="color:#c9c3b2">Single target.</b> ${esc(s.mech.st)}</p>`);
    if (s.mech.aoe) parts.push(`<p><b style="color:#c9c3b2">AoE.</b> ${esc(s.mech.aoe)}</p>`);
    if (s.mech.movement) parts.push(`<p><b style="color:#c9c3b2">Movement.</b> ${esc(s.mech.movement)}</p>`);
    if (s.mech.defense) parts.push(`<p><b style="color:#c9c3b2">Defense &amp; control.</b> ${esc(s.mech.defense)}</p>`);
    if (s.mech.utility) parts.push(`<p><b style="color:#c9c3b2">Group utility.</b> ${esc(s.mech.utility)}</p>`);
    if (!parts.length && (s.mech.resources.length || s.mech.builders.length))
      parts.push(`<p><b style="color:#c9c3b2">Resources.</b> ${s.mech.resources.map(esc).join(", ") || "—"}</p>
        <p><b style="color:#c9c3b2">Builders.</b> ${s.mech.builders.map(esc).join(", ") || "—"}</p>
        <p><b style="color:#c9c3b2">Spenders &amp; windows.</b> ${[...s.mech.spenders, ...s.mech.windows].map(esc).join(", ") || "—"}</p>`);
    return parts.join("");
  }

  function bandsFold(s) {
    if (!s.bands.length) return "";
    return s.bands.map(b => {
      const delta = b.changes.length ? b.changes.join(" ") : b.loop;
      return `<div class="band"><span class="lvl">${b.min}–${b.max}</span><div>
        ${delta ? `<p>${esc(delta)}</p>` : ""}
        ${b.unlocks.length ? `<p class="unlocks">Unlocks: ${b.unlocks.map(esc).join(", ")}</p>` : ""}
      </div></div>`;
    }).join("");
  }

  function sentimentFold(s) {
    const { praise, frustrations, contested } = s.sentiment;
    if (!praise.length && !frustrations.length && !contested.length) return "";
    const li = items => items.map(i => `<li>${esc(i.t)} ${tierBadges(i.tiers)}</li>`).join("");
    return `${praise.length ? `<p><b style="color:#7fc98a">Praise.</b></p><ul>${li(praise)}</ul>` : ""}
      ${frustrations.length ? `<p style="margin-top:8px"><b style="color:var(--red-soft)">Frustrations.</b></p><ul>${li(frustrations)}</ul>` : ""}
      ${contested.map(c => `<div class="contested-card" style="margin-top:9px"><p><b>Contested:</b> ${esc(c.t)} ${tierBadges(c.tiers)}</p></div>`).join("")}`;
  }

  function conflictFold(s) {
    if (!s.conflicts.length && !s.issues.length) return "";
    return `${s.conflicts.map(p => `<div class="contested-card">
        <p>${esc(p.a.t)} ${tierBadges([p.a.tier])}</p><div class="vs">conflicts with</div>
        <p>${esc(p.b.t)} ${tierBadges([p.b.tier])}</p></div>`).join("")}
      ${s.issues.map(i => `<div class="issue-card"><p><b>Known issue:</b> ${esc(i.t)} ${tierBadges([i.tier])}</p></div>`).join("")}`;
  }

  function perfFold(s) {
    const p = s.perf, c = s.community;
    const dps = p.dps
      ? `<b style="color:#c9c3b2">${p.dps.toLocaleString()}</b> reported DPS (${esc(String(p.ctx || "").replace(/_/g, " "))}) in one community compilation.`
      : "No usable DPS entry in the captured compilation.";
    const uploads = (p.uploads ?? null) !== null
      ? ` ${p.uploads} Mythic log upload${p.uploads === 1 ? "" : "s"} — representation, not strength.` : "";
    const build = c.count
      ? `${c.count} recent community build${c.count === 1 ? "" : "s"}; top: <a class="gold-link" href="${esc(c.topUrl)}" target="_blank" rel="noreferrer">${esc(c.topTitle)}</a>.`
      : "No submitted builds captured — a documentation gap, not weakness.";
    return `<p>${dps}${uploads}</p><p>${build}</p>
      <p style="color:var(--faint)">These signals are uncontrolled and cannot be compared across roles or encounter contexts. Not a ranking.</p>`;
  }

  function evidenceFold(s) {
    const v = s.media.guides.length
      ? `${s.media.guides.length} verified current spec guide${s.media.guides.length === 1 ? "" : "s"} (shown above). The class highlight is an older fantasy reference.`
      : (s.coverage.video === "searched_none_verified"
        ? "We searched and could not verify a current spec video. None is invented. The class highlight is an older fantasy reference."
        : "Spec-video research has not started. The class highlight is an older fantasy reference.");
    return `<p>${s.enriched ? `Curated overlay · ${esc(s.confidence)} confidence.` : "Structural baseline only."}</p>
      <p>${v}</p>
      ${s.gaps.length ? `<p style="color:var(--faint)">Open gaps:</p><ul>${s.gaps.map(g => `<li style="color:var(--faint)">${esc(g)}</li>`).join("")}</ul>` : ""}`;
  }

  function profileHTML(s) {
    const ctxIds = Object.keys(CTX_LABELS).filter(c => s.contexts[c] ||
      Object.values(s.complexity).some(axis => axis[c]));
    const bc = bestCtx(s);
    const feel = bc && s.contexts[bc]?.feel ? s.contexts[bc].feel : "";
    const yes = [...s.fit.enjoy.slice(0, 2).map(i => i.t), ...(s.contexts[bc]?.strengths || []).slice(0, 1)];
    const no = [...s.fit.avoid.slice(0, 2).map(i => i.t), ...(s.contexts[bc]?.cautions || []).slice(0, 1)];
    const stats = Object.entries(AXIS_LABELS).map(([k, label]) => {
      const c = cxCell(s, k, bc || "boss");
      return `<span class="stat">${label}${c ? pips(CX_ORDINAL[c.v] || 0) : `<span class="pips-na" style="margin-left:auto">—</span>`}</span>`;
    }).join("");

    const ctxFoldBody = ctxIds.length ? `
      <div class="ctx-tabs">${ctxIds.map(c =>
        `<button class="ctx-tab ${c === (bc || ctxIds[0]) ? "active" : ""}" data-ctx="${c}">${CTX_LABELS[c]}</button>`).join("")}</div>
      <div id="ctxPanel">${contextSection(s, bc || ctxIds[0])}</div>`
      : `<p class="cx-empty">Contextual complexity has not been researched yet. The structural data above is real; feel claims would be invented, so we show none.</p>`;

    return `<div style="--class-color:${s.color}">
      <header class="d-head ${qcls(s)}">
        <h2>${esc(s.name)}</h2>
        <div class="d-meta"><span>${esc(s.klass)}</span><span>${[...s.roles, ...s.range].map(esc).join(" · ")}</span>
          <span>${esc(famById[s.atlas].name)}${s.provisionalFamily ? " (provisional)" : ""}</span>
          <span class="wb-q ${s.enriched ? "c" : "w"}">${s.enriched ? "Curated · " + esc(s.confidence) : "Research in progress"}</span></div>
        <p class="d-flavor">"${esc(s.fantasy || s.oneLine)}"</p>
        ${feel ? `<p class="d-feel">${esc(feel)}</p>` : ""}
      </header>
      ${mediaBlock(s)}
      <div class="d-stats">${stats}</div>
      ${(yes.length || no.length) ? `<div class="d-verdicts">
        <div>${yes.map(t => `<p class="v-yes">✓ ${esc(t)}</p>`).join("")}</div>
        <div>${no.map(t => `<p class="v-no">✕ ${esc(t)}</p>`).join("")}</div>
      </div>` : ""}
      <div class="d-quickfoot">${bc ? CTX_LABELS[bc] + " context · " : ""}qualitative labels, not scores · hover evidence tags for meaning</div>
      <div class="folds">
        ${fold("By context", ctxFoldBody, ctxIds.length ? ctxIds.length + " contexts" : "not researched")}
        ${fold("Leveling story", bandsFold(s), s.enriched && s.hasShift ? "loop evolves" : "")}
        ${fold("Mechanics in detail", mechFold(s))}
        ${fold("How it fails", s.mech.failureModes.length ? `<ul>${s.mech.failureModes.map(f => `<li>${esc(f.t)} ${tierBadges(f.tiers)}</li>`).join("")}</ul>` : "")}
        ${fold("What players say", sentimentFold(s))}
        ${fold("Disagreements & known issues", conflictFold(s), (s.conflicts.length + s.issues.length) ? String(s.conflicts.length + s.issues.length) : "")}
        ${fold("Performance context", perfFold(s), "not a ranking")}
        ${fold("Evidence & gaps", evidenceFold(s))}
      </div>
      ${!s.enriched ? `<div class="progress-panel"><b>Research in progress</b>
        <ul>${(s.gaps.length ? s.gaps : ["Curated overlay not yet written."]).map(g => `<li>${esc(g)}</li>`).join("")}</ul></div>` : ""}
    </div>`;
  }

  function mediaBlock(s) {
    const m = s.media;
    if (!m.classVideo && !m.icons.length) return "";
    const strip = m.classVideo ? `
      <a class="cine-strip" href="https://www.youtube.com/watch?v=${esc(m.classVideo)}" target="_blank" rel="noreferrer"
        style="background-image:url('https://i.ytimg.com/vi/${esc(m.classVideo)}/hqdefault.jpg')"
        aria-label="Watch the official ${esc(s.klass)} class highlight"><span class="play">▶</span></a>
      <div class="media-label"><span class="tag tag-class">Class highlight</span>
        Official Ascension ${esc(s.klass)} video — an older class-fantasy reference, not a rotation guide.</div>` : "";
    const guides = m.guides.length ? m.guides.map(g => `
      <a class="guide-row" href="https://www.youtube.com/watch?v=${esc(g.id)}" target="_blank" rel="noreferrer">
        <img src="https://i.ytimg.com/vi/${esc(g.id)}/mqdefault.jpg" alt="" loading="lazy">
        <span><b>${esc(g.title)} — ${esc(g.creator)}</b>
        <small><span class="tag tag-guide">Spec guide</span> Verified current community guide · checked ${esc(g.verified)}</small></span>
      </a>`).join("")
      : (m.classVideo ? `<div class="media-label" style="border-bottom:0"><span class="tag tag-class">No spec video</span>
          No verified current ${esc(s.name)}-specific video. We say so rather than surfacing a stale or unrelated upload.</div>` : "");
    const icons = m.icons.length ? `
      <div class="icon-strip">${m.icons.map(i =>
        `<img src="https://coabuildhub.com/skill-icons/${esc(i.icon)}.jpg" alt="${esc(i.name)}" loading="lazy"
           data-tipname="${esc(i.name)}" data-tip="${esc(i.tip)}">`).join("")}
        <span class="cap">Defining talents — hover to read, from the current snapshot</span></div>` : "";
    return strip + guides + icons;
  }

  function openProfile(id) {
    const s = specById[id];
    if (!s) return;
    el("profileContent").innerHTML = profileHTML(s);
    el("profileContent").dataset.spec = id;
    el("profileDialog").showModal();
    history.replaceState(null, "", "#spec=" + slug(id));
  }

  // ---------- Workbench ----------

  function trayChanged() {
    el("tray").hidden = tray.length === 0;
    el("traySlots").innerHTML = tray.map(id => {
      const s = specById[id];
      return `<span class="tray-chip" style="--class-color:${s.color}">${esc(s.name)}<button data-untray="${id}" aria-label="Remove ${esc(s.name)}">×</button></span>`;
    }).join("");
    el("openBench").disabled = tray.length < 2;
    el("openBench").textContent = tray.length < 2 ? "Compare" : `Compare ${tray.length}`;
    const badge = el("wbCount");
    badge.hidden = tray.length === 0;
    badge.textContent = tray.length;
    render();
  }

  function toggleTray(id) {
    const i = tray.indexOf(id);
    if (i >= 0) tray.splice(i, 1);
    else if (tray.length < 3) tray.push(id);
    trayChanged();
  }

  function wbRow(label, cells, comparable) {
    const filled = cells.filter(c => c.key !== undefined);
    const same = comparable && filled.length > 1 && filled.every(c => c.key === filled[0].key);
    return `<div class="wb-cell wb-rowhead ${same ? "row-same" : ""}">${esc(label)}</div>`
      + cells.map(c => `<div class="wb-cell ${same ? "row-same" : ""}">${c.html}</div>`).join("");
  }

  function benchHTML() {
    const specs = tray.map(id => specById[id]);
    const n = specs.length;
    const mixed = specs.some(s => s.enriched) && specs.some(s => !s.enriched);
    const cell = (s, html, key) => ({ html, key });

    let rows = `<div class="wb-cell wb-rowhead"></div>` + specs.map(s =>
      `<div class="wb-cell wb-headcell" style="--class-color:${s.color}">
        <div class="sub">${esc(s.klass)}</div><h3>${esc(s.name)}</h3>
        <div class="sub">${[...s.roles, ...s.range].map(esc).join(" · ")}</div>
        <div class="wb-q ${s.enriched ? "c" : "w"}" style="margin-top:5px">${s.enriched ? "Curated · " + esc(s.confidence) : "In progress"}</div>
      </div>`).join("");

    rows += wbRow("Feel family", specs.map(s => cell(s,
      `${esc(famById[s.atlas].name)}${s.provisionalFamily ? ` <span class="wb-na">(provisional)</span>` : ""}`, s.atlas)), true);
    rows += wbRow("In one line", specs.map(s => cell(s, esc(s.oneLine))), false);

    for (const [axis, label] of Object.entries(AXIS_LABELS)) {
      rows += wbRow(label, specs.map(s => {
        const c = (s.complexity[axis] || {})[wbCtx];
        return cell(s, `${c ? pips(CX_ORDINAL[c.v] || 0) + ` <span style="color:var(--gold);font-size:10.5px;text-transform:capitalize">${esc(c.v)}</span>` : `<span class="wb-na">not researched</span>`}${c?.why ? `<div style="color:var(--faint);font-size:11px;margin-top:2px">${esc(c.why)}</div>` : ""}`, c ? c.v : undefined);
      }), true);
    }

    rows += wbRow("Strengths here", specs.map(s => {
      const ctx = s.contexts[wbCtx];
      return cell(s, ctx?.strengths?.length ? ctx.strengths.map(esc).join("; ") : `<span class="wb-na">not researched</span>`);
    }), false);
    rows += wbRow("Cautions here", specs.map(s => {
      const ctx = s.contexts[wbCtx];
      return cell(s, ctx?.cautions?.length ? ctx.cautions.map(esc).join("; ") : `<span class="wb-na">not researched</span>`);
    }), false);

    rows += wbRow("Leveling shift", specs.map(s => {
      if (s.enriched && s.hasShift) {
        const last = [...s.bands].reverse().find(b => b.changes.length || b.loop);
        return cell(s, esc(last?.changes[0] || last?.loop || "Loop evolves across bands."));
      }
      return cell(s, s.enriched ? "No major reported shift." : `<span class="wb-na">structural unlocks only — shift not researched</span>`);
    }), false);

    rows += wbRow("Enjoy if", specs.map(s => cell(s,
      s.fit.enjoy.length ? s.fit.enjoy.slice(0, 2).map(i => esc(i.t)).join(" · ") : `<span class="wb-na">not researched</span>`)), false);
    rows += wbRow("Avoid if", specs.map(s => cell(s,
      s.fit.avoid.length ? s.fit.avoid.slice(0, 2).map(i => esc(i.t)).join(" · ") : `<span class="wb-na">not researched</span>`)), false);

    rows += wbRow("Contested / issues", specs.map(s => {
      const parts = [];
      if (s.sentiment.contested.length) parts.push(`${s.sentiment.contested.length} contested`);
      if (s.conflicts.length) parts.push(`${s.conflicts.length} conflict${s.conflicts.length === 1 ? "" : "s"}`);
      if (s.issues.length) parts.push(`${s.issues.length} known issue${s.issues.length === 1 ? "" : "s"}`);
      return cell(s, parts.length ? parts.join(" · ") + " — see profile" : "none recorded");
    }), false);

    rows += wbRow("Performance context", specs.map(s => cell(s,
      `${s.perf.dps ? `${s.perf.dps.toLocaleString()} reported DPS (${esc(String(s.perf.ctx || "").replace(/_/g, " "))})` : "no DPS entry"} · ${s.perf.uploads ?? 0} uploads`)), false);
    rows += wbRow("Builds", specs.map(s => cell(s, s.community.count
      ? `${s.community.count} recent · <a class="gold-link" href="${esc(s.community.topUrl)}" target="_blank" rel="noreferrer">top ↗</a>`
      : "none captured")), false);

    return `<h2>Workbench</h2>
      ${mixed ? `<div class="wb-banner">Evidence depth differs across this bench. "Not researched" cells mean curation has not happened yet — never zero.</div>` : ""}
      <div class="wb-bar">
        <label>Context
          <select id="wbCtxSelect">${Object.entries(CTX_LABELS).map(([c, l]) =>
            `<option value="${c}" ${c === wbCtx ? "selected" : ""}>${l}</option>`).join("")}</select>
        </label>
        <label><input type="checkbox" id="wbDiffOnly"> Differences only</label>
        <span style="color:var(--faint);font-size:10.5px">Qualitative labels, not scores.</span>
      </div>
      <div class="wb-scroll"><div class="wb-grid ${el("wbDialog").dataset.diff === "1" ? "diff-only" : ""}"
        style="grid-template-columns:132px repeat(${n},minmax(170px,1fr))">${rows}</div></div>`;
  }

  function openBench() {
    el("wbBody").innerHTML = benchHTML();
    const sel = el("wbCtxSelect");
    sel.addEventListener("change", () => { wbCtx = sel.value; openBench(); });
    const diff = el("wbDiffOnly");
    diff.checked = el("wbDialog").dataset.diff === "1";
    diff.addEventListener("change", () => {
      el("wbDialog").dataset.diff = diff.checked ? "1" : "0";
      document.querySelector(".wb-grid").classList.toggle("diff-only", diff.checked);
    });
    if (!el("wbDialog").open) el("wbDialog").showModal();
  }

  // ---------- Talent hover tooltips (local snapshot text) ----------

  let tipEl = null;
  function showTip(target) {
    hideTip();
    tipEl = document.createElement("div");
    tipEl.className = "talent-tip";
    tipEl.innerHTML = `<b>${esc(target.dataset.tipname)}</b>${esc(target.dataset.tip || "No tooltip text captured.")}`;
    document.body.appendChild(tipEl);
    const r = target.getBoundingClientRect();
    const tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    let x = Math.min(Math.max(8, r.left), window.innerWidth - tw - 8);
    let y = r.bottom + 8;
    if (y + th > window.innerHeight - 8) y = r.top - th - 8;
    tipEl.style.left = x + "px";
    tipEl.style.top = Math.max(8, y) + "px";
  }
  function hideTip() { tipEl?.remove(); tipEl = null; }
  document.addEventListener("mouseover", e => {
    const t = e.target.closest("[data-tipname]");
    if (t) showTip(t); else if (tipEl) hideTip();
  });
  document.addEventListener("click", () => hideTip(), true);

  // ---------- Events ----------

  document.addEventListener("click", e => {
    const trayBtn = e.target.closest("[data-tray]");
    if (trayBtn) { e.stopPropagation(); toggleTray(trayBtn.dataset.tray); return; }
    const untray = e.target.closest("[data-untray]");
    if (untray) { toggleTray(untray.dataset.untray); return; }
    const foldHead = e.target.closest(".fold-head");
    if (foldHead) { foldHead.parentElement.classList.toggle("open"); return; }
    const ctxTab = e.target.closest(".ctx-tab");
    if (ctxTab) {
      const s = specById[el("profileContent").dataset.spec];
      document.querySelectorAll(".ctx-tab").forEach(t => t.classList.toggle("active", t === ctxTab));
      el("ctxPanel").innerHTML = contextSection(s, ctxTab.dataset.ctx);
      return;
    }
    const card = e.target.closest("[data-open]");
    if (card) openProfile(card.dataset.open);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest?.("[data-open]");
      if (card) { e.preventDefault(); openProfile(card.dataset.open); }
    }
    if (e.key === "/" && document.activeElement !== el("searchInput") && !el("profileDialog").open && !el("wbDialog").open) {
      e.preventDefault();
      el("searchInput").focus();
    }
  });

  document.querySelectorAll("[data-filter-group]").forEach(group => {
    group.addEventListener("click", e => {
      const button = e.target.closest("button[data-filter]");
      if (!button) return;
      state[group.dataset.filterGroup] = button.dataset.filter;
      group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === button));
      render();
    });
  });

  el("searchInput").addEventListener("input", () => { state.search = el("searchInput").value; render(); });
  el("clearButton").addEventListener("click", clearAll);
  el("emptyResetButton").addEventListener("click", clearAll);
  function clearAll() {
    Object.assign(state, { search: "", role: "All", range: "All", research: "All" });
    el("searchInput").value = "";
    document.querySelectorAll("[data-filter-group]").forEach(g =>
      g.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.filter === "All")));
    render();
  }

  el("profileClose").addEventListener("click", () => el("profileDialog").close());
  el("profileDialog").addEventListener("click", e => { if (e.target === el("profileDialog")) el("profileDialog").close(); });
  el("profileDialog").addEventListener("close", () => history.replaceState(null, "", location.pathname));
  el("wbClose").addEventListener("click", () => el("wbDialog").close());
  el("wbDialog").addEventListener("click", e => { if (e.target === el("wbDialog")) el("wbDialog").close(); });
  el("openBench").addEventListener("click", openBench);
  el("wbTopButton").addEventListener("click", () => { if (tray.length >= 2) openBench(); else el("tray").scrollIntoView(); });

  // ---------- Init ----------

  el("classCount").textContent = data.classCount;
  el("specCount").textContent = data.specCount;
  el("curatedCount").textContent = data.enrichedCount;
  render();
  trayChanged();

  const hash = location.hash.match(/^#spec=([a-z-]+--[a-z-]+)$/);
  if (hash) {
    const id = hash[1].replace("--", "/");
    if (specById[id]) openProfile(id);
  }
})();
