(() => {
  "use strict";

  const R = window.COA_RENDER;
  if (!R) throw new Error("profile-render.js must load before explorer.js");
  const { data, specById, famById, CTX_LABELS, AXIS_LABELS, CX_ORDINAL,
          esc, slug, glyph, qcls, tierBadges, pips, cxCell, bestCtx, profileHTML } = R;

  const state = { search: "", role: "All", range: "All", research: "All" };
  const tray = [];
  let wbCtx = "boss";

  const el = id => document.getElementById(id);

  // ---------- URL state: filters and search survive reload and Back ----------

  function readUrlState() {
    const p = new URLSearchParams(location.search);
    state.search = p.get("q") || "";
    for (const k of ["role", "range", "research"]) state[k] = p.get(k) || "All";
  }
  function writeUrlState() {
    const p = new URLSearchParams();
    if (state.search) p.set("q", state.search);
    for (const k of ["role", "range", "research"]) if (state[k] !== "All") p.set(k, state[k]);
    const qs = p.toString();
    history.replaceState(null, "", (qs ? "?" + qs : location.pathname) + location.hash);
  }
  function syncFilterButtons() {
    document.querySelectorAll("[data-filter-group]").forEach(g =>
      g.querySelectorAll("button").forEach(b =>
        b.classList.toggle("active", b.dataset.filter === state[g.dataset.filterGroup])));
    el("searchInput").value = state.search;
  }

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
    const rows = [["Core actions", "core_actions"], ["Tracking", "state_tracking"],
                  ["Reactive", "reactive_decisions"], ["Failure cost", "failure_cost"]];
    const hasPips = rows.some(([, k]) => cxCell(s, k, bc));
    return `<article class="plate spec-card ${qcls(s)}" tabindex="0" role="button" style="--class-color:${s.color}"
        data-open="${s.id}" aria-label="Open ${esc(s.name)} profile">
      <div class="card-top card-glow">
        <span class="card-glyphmark" aria-hidden="true">${glyph(s)}</span>
        <span class="spec-icon">${s.media.icons[0]
          ? `<img src="https://coabuildhub.com/skill-icons/${esc(s.media.icons[0].icon)}.jpg" alt="" loading="lazy">`
          : glyph(s)}</span>
        <div><h3>${esc(s.name)}</h3>
          <div class="sub">${esc(s.klass)} · ${[...s.roles, ...s.range].map(esc).join(" · ")}</div></div>
      </div>
      ${s.fantasy ? `<p class="card-fantasy">"${esc(s.fantasy)}"</p>` : ""}
      <div class="card-mid"><p class="clamp2">${esc(s.oneLine)}</p></div>
      ${hasPips ? `<div class="card-axes">
          <div class="axhead">Relative demand · ${CTX_LABELS[bc]}</div>
          ${rows.map(([n, k]) => {
            const c = cxCell(s, k, bc);
            return c ? `<span class="pip-row">${n}${pips(CX_ORDINAL[c.v] || 0)}</span>` : "";
          }).filter(Boolean).join("")}
        </div>`
        : `<div class="card-axes"><div class="pips-na" style="margin-left:0">complexity not yet researched for this spec</div></div>`}
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

    el("atlas").innerHTML = data.families.map(f => {
      const specs = byFamily.get(f.id);
      if (!specs.length) return "";
      const curated = specs.filter(s => s.enriched).length;
      return `<section class="family-section" id="fam-${f.id}">
        <header class="plate fam-banner">
          <div class="kick">Playstyle family · ${specs.length} spec${specs.length === 1 ? "" : "s"} · ${curated} curated</div>
          <h2>${esc(f.name)}</h2>
          <div class="fam-rule"></div>
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

  function openProfile(id) {
    const s = specById[id];
    if (!s) return;
    el("profileContent").innerHTML = profileHTML(s);
    el("profileDialog").showModal();
    el("profileDialog").scrollTop = 0;
    history.replaceState(null, "", location.search + "#spec=" + slug(id));
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
        <span style="color:var(--faint);font-size:10.5px">Qualitative labels, relative among researched CoA specs.</span>
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
    if (!el("wbDialog").open) { el("wbDialog").showModal(); el("wbDialog").scrollTop = 0; }
  }

  // ---------- Events ----------

  document.addEventListener("click", e => {
    const trayBtn = e.target.closest("[data-tray]");
    if (trayBtn) { e.stopPropagation(); toggleTray(trayBtn.dataset.tray); return; }
    const untray = e.target.closest("[data-untray]");
    if (untray) { toggleTray(untray.dataset.untray); return; }
    if (e.target.closest(".fold-head") || e.target.closest(".ctx-tab")) return; // shared handler owns these
    const card = e.target.closest("[data-open]");
    if (card && !e.target.closest("a")) openProfile(card.dataset.open);
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
      syncFilterToggle();
      writeUrlState();
      render();
    });
  });

  // Mobile: filters live behind a toggle; show how many are active on the button.
  const filterToggle = el("filterToggle");
  function syncFilterToggle() {
    const active = ["role", "range", "research"].filter(k => state[k] !== "All").length;
    filterToggle.textContent = "Filters" + (active ? ` · ${active}` : "");
    filterToggle.classList.toggle("has-active", active > 0);
  }
  filterToggle.addEventListener("click", () => {
    document.querySelector(".bar-row").classList.toggle("filters-open");
  });

  el("searchInput").addEventListener("input", () => {
    state.search = el("searchInput").value;
    writeUrlState();
    render();
  });
  el("clearButton").addEventListener("click", clearAll);
  el("emptyResetButton").addEventListener("click", clearAll);
  function clearAll() {
    Object.assign(state, { search: "", role: "All", range: "All", research: "All" });
    syncFilterButtons();
    syncFilterToggle();
    writeUrlState();
    render();
  }

  el("profileClose").addEventListener("click", () => el("profileDialog").close());
  el("profileDialog").addEventListener("click", e => { if (e.target === el("profileDialog")) el("profileDialog").close(); });
  el("profileDialog").addEventListener("close", () => history.replaceState(null, "", location.pathname + location.search));
  el("wbClose").addEventListener("click", () => el("wbDialog").close());
  el("wbDialog").addEventListener("click", e => { if (e.target === el("wbDialog")) el("wbDialog").close(); });
  el("openBench").addEventListener("click", openBench);
  el("wbTopButton").addEventListener("click", () => { if (tray.length >= 2) openBench(); else el("tray").scrollIntoView(); });

  // ---------- Init ----------

  el("classCount").textContent = data.classCount;
  el("specCount").textContent = data.specCount;
  el("curatedCount").textContent = data.enrichedCount;
  readUrlState();
  syncFilterButtons();
  syncFilterToggle();
  render();
  trayChanged();

  const hash = location.hash.match(/^#spec=([a-z-]+--[a-z-]+)$/);
  if (hash) {
    const id = hash[1].replace("--", "/");
    if (specById[id]) openProfile(id);
  }
})();
