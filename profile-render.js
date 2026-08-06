/* Shared spec-profile renderer for the CoA Atlas pages.
   Owns labels, pips, the full profile HTML, talent tooltips, and fold/tab
   interaction. Load explorer-data.js first; index.html and class.html both
   consume window.COA_RENDER. */
window.COA_RENDER = (() => {
  "use strict";

  const data = window.COA_EXPLORER;
  if (!data) throw new Error("Explorer data failed to load.");

  const CTX_LABELS = {
    general: "General", boss: "Boss (single-target)", dungeon_aoe: "Dungeon AoE", pvp: "PvP",
    leveling_10_29: "Leveling 10–29", leveling_30_49: "Leveling 30–49", level_50_60: "Level 50–60",
  };
  const ENDGAME_CTX = ["general", "boss", "dungeon_aoe"];
  const LEVELING_CTX = ["leveling_10_29", "leveling_30_49", "level_50_60"];
  const AXIS_LABELS = {
    core_actions: "Core actions", state_tracking: "State tracking", setup_burden: "Setup burden",
    sequencing: "Sequencing", reactive_decisions: "Reactive decisions",
    execution: "Execution", failure_cost: "Failure cost",
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

  const esc = v => String(v ?? "").replace(/[&<>'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[c]);
  const slug = id => id.replace("/", "--");
  const classSlug = s => s.id.split("/")[0];
  const glyph = s => CLASS_GLYPHS[s.klass] || "✦";
  const qcls = s => s.enriched ? "q-c" : "q-w";

  const tierBadges = ts => (ts || []).map(t =>
    `<span class="tier tier-${t}" title="${esc(TIER_TITLES[t])}">${TIER_LABELS[t]}</span>`).join(" ");

  const pips = n =>
    `<span class="pips">${[1,2,3,4,5].map(i => `<span class="${i <= n ? "" : "off"}">◆</span>`).join("")}</span>`;
  const cxPips = cell => cell
    ? `${pips(CX_ORDINAL[cell.v] || 0)}`
    : `<span class="pips-na">unresearched</span>`;
  const cxCell = (s, axis, ctx = "boss") => (s.complexity[axis] || {})[ctx] || null;
  const hasCtx = (s, c) => !!(s.contexts[c] || Object.values(s.complexity).some(a => a[c]));
  // Fullest endgame context wins; boss beats general only on equal axis coverage.
  const bestCtx = s => {
    const covered = c => Object.values(s.complexity).filter(a => a[c]).length;
    const ranked = ["boss", "general", "dungeon_aoe"]
      .map(c => [c, covered(c)]).filter(([, n]) => n).sort((a, b) => b[1] - a[1]);
    if (ranked.length) return ranked[0][0];
    const ids = Object.keys(CTX_LABELS).filter(c => hasCtx(s, c));
    return ids[0] || null;
  };

  function contextSection(s, ctxId, noteEmptyAxes = true) {
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
      ${axes || (noteEmptyAxes ? `<p class="cx-empty">Complexity for this context has not been researched yet.</p>` : "")}`;
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
    const bands = s.bands.map(b => {
      const delta = b.changes.length ? b.changes.join(" ") : b.loop;
      return `<div class="band"><span class="lvl">${b.min}–${b.max}</span><div>
        ${delta ? `<p>${esc(delta)}</p>` : ""}
        ${b.unlocks.length ? `<p class="unlocks">Unlocks: ${b.unlocks.map(esc).join(", ")}</p>` : ""}
      </div></div>`;
    }).join("");
    const ctxBlocks = LEVELING_CTX.filter(c => hasCtx(s, c)).map(c =>
      `<div class="ctx-block"><h5 class="ctx-block-head">${CTX_LABELS[c]}</h5>${contextSection(s, c, false)}</div>`).join("");
    return bands + ctxBlocks;
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
        <span class="cap">Defining talents — hover or tap to read, from the current snapshot</span></div>` : "";
    return strip + guides + icons;
  }

  function profileHTML(s, opts = {}) {
    const ctxIds = ENDGAME_CTX.filter(c => hasCtx(s, c));
    const bc = bestCtx(s);
    const feel = bc && s.contexts[bc]?.feel ? s.contexts[bc].feel : "";
    const yes = [...s.fit.enjoy.slice(0, 2).map(i => i.t), ...(s.contexts[bc]?.strengths || []).slice(0, 1)];
    const no = [...s.fit.avoid.slice(0, 2).map(i => i.t), ...(s.contexts[bc]?.cautions || []).slice(0, 1)];
    const stats = Object.entries(AXIS_LABELS).map(([k, label]) => {
      const c = cxCell(s, k, bc || "boss");
      return c ? `<span class="stat">${label}${pips(CX_ORDINAL[c.v] || 0)}</span>` : "";
    }).filter(Boolean).join("");

    const startCtx = ctxIds.includes(bc) ? bc : ctxIds[0];
    const ctxFoldBody = ctxIds.length ? `
      <div class="ctx-tabs">${ctxIds.map(c =>
        `<button class="ctx-tab ${c === startCtx ? "active" : ""}" data-ctx="${c}">${CTX_LABELS[c]}</button>`).join("")}</div>
      <div class="ctx-panel">${contextSection(s, startCtx)}</div>`
      : `<p class="cx-empty">Contextual complexity has not been researched yet. The structural data above is real; feel claims would be invented, so we show none.</p>`;

    const classLink = opts.classLink === false ? "" :
      `<a class="gold-link class-link" href="class.html?c=${classSlug(s)}#${s.id.split("/")[1]}">View full class ⇢</a>`;

    return `<div data-spec-root data-spec="${s.id}" style="--class-color:${s.color}">
      <header class="d-head ${qcls(s)}">
        <h2>${esc(s.name)}</h2>
        <div class="d-meta"><span>${esc(s.klass)}</span><span>${[...s.roles, ...s.range].map(esc).join(" · ")}</span>
          <span>${esc(famById[s.atlas].name)}${s.provisionalFamily ? " (provisional)" : ""}</span>
          <span class="wb-q ${s.enriched ? "c" : "w"}">${s.enriched ? "Curated · " + esc(s.confidence) : "Research in progress"}</span>
          ${classLink}</div>
        <p class="d-flavor">"${esc(s.fantasy || s.oneLine)}"</p>
        ${feel ? `<p class="d-feel">${esc(feel)}</p>` : ""}
      </header>
      ${mediaBlock(s)}
      <div class="d-stats">${stats}</div>
      ${(yes.length || no.length) ? `<div class="d-verdicts">
        <div>${yes.map(t => `<p class="v-yes">✓ ${esc(t)}</p>`).join("")}</div>
        <div>${no.map(t => `<p class="v-no">✕ ${esc(t)}</p>`).join("")}</div>
      </div>` : ""}
      <div class="d-quickfoot">${bc ? CTX_LABELS[bc] + " context · " : ""}qualitative labels, relative among researched CoA specs · hover evidence tags for meaning</div>
      <div class="folds">
        ${fold("Endgame contexts", ctxFoldBody, ctxIds.length ? ctxIds.map(c => CTX_LABELS[c]).join(" · ") : "not researched")}
        ${fold("Leveling story", bandsFold(s), s.enriched && s.hasShift ? "loop evolves" : "")}
        ${fold("PvP", hasCtx(s, "pvp") ? contextSection(s, "pvp") : "", "")}
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

  // ---------- Shared interaction: talent tooltips, folds, context tabs ----------

  let tipEl = null, tipFor = null;
  function showTip(target) {
    hideTip();
    tipFor = target;
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
  function hideTip() { tipEl?.remove(); tipEl = null; tipFor = null; }
  document.addEventListener("mouseover", e => {
    const t = e.target.closest("[data-tipname]");
    if (t) { if (t !== tipFor) showTip(t); } else if (tipEl) hideTip();
  });
  // Tap support: tapping an icon shows its tooltip; tapping anywhere else hides it.
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-tipname]");
    if (t) { if (t !== tipFor) showTip(t); } else hideTip();
  }, true);

  document.addEventListener("click", e => {
    const foldHead = e.target.closest(".fold-head");
    if (foldHead) { foldHead.parentElement.classList.toggle("open"); return; }
    const ctxTab = e.target.closest(".ctx-tab");
    if (ctxTab) {
      const root = ctxTab.closest("[data-spec-root]");
      const s = specById[root?.dataset.spec];
      if (!s) return;
      root.querySelectorAll(".ctx-tab").forEach(t => t.classList.toggle("active", t === ctxTab));
      root.querySelector(".ctx-panel").innerHTML = contextSection(s, ctxTab.dataset.ctx);
    }
  });

  return {
    data, specById, famById,
    CTX_LABELS, ENDGAME_CTX, LEVELING_CTX, AXIS_LABELS, CX_ORDINAL, CLASS_GLYPHS,
    esc, slug, classSlug, glyph, qcls, tierBadges, pips, cxPips, cxCell, hasCtx, bestCtx,
    contextSection, profileHTML,
  };
})();
