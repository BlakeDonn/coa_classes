/* The class page, as ruled (class-page-grammar.md).
   URL contract: class.html?c=<class-slug>[&from=choose|guided]#<spec-slug>

   This is the BAKED ruled state — no study switchers, no variant query params.
   (One round-1 exception while the design pass runs: a temporary ?n= name-form
   switcher — fit | small | tight — removed when the user picks. 2026-08-10.)
   Masthead order: name · tagline (keyword glow) · engine block · plain-text strict
   role line, with the T1 corner video thumb at the text column's right edge.
   Cultist, Tinker and Knight of Xoroth carry their authored seals; the others render
   the G2 seat with the class glyph and the honest caption "Seal not yet drawn".
   Rail cards are the airfam form with verb chips where a verb is authored.
   The codex opens on "The rhythm" — the authored strip, or its honest dashed gap.

   Absent, never invented. Every authored sentence comes from authored-copy.js. */
(() => {
  "use strict";

  const R = window.COA_RENDER, COPY = window.COA_COPY, CARDS = window.COA_CARDS;
  if (!R || !COPY || !CARDS) throw new Error("profile-render.js, authored-copy.js and atlas-cards.js must load first");
  const { data, esc, glyph, profileHTML, bestCtx, famById, specById } = R;

  const el = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const cSlug = params.get("c") || "chronomancer";
  const fromChoose = params.get("from") === "choose";
  const fromGuided = params.get("from") === "guided";

  const specs = data.specs.filter(s => s.id.split("/")[0] === cSlug);
  if (!specs.length) {
    document.body.innerHTML = `<p style="padding:40px;color:#cdcdcd">Unknown class. <a style="color:#c9aa71" href="index.html">Back to the Atlas</a>.</p>`;
    return;
  }
  const klass = specs[0].klass;
  const color = specs[0].color;
  document.title = `${klass} — CoA Atlas`;

  // ---------- masthead pieces ----------

  // Strict true-support counting (ruled 2026-08-09): class-level Support counts only
  // specs that support WITHOUT healing. Spec-level roles are untouched.
  function roleLine() {
    const counts = {};
    specs.forEach(s => s.roles
      .filter(r => r !== "Support" || !s.roles.includes("Healer"))
      .forEach(r => { counts[r] = (counts[r] || 0) + 1; }));
    const ranges = [...new Set(specs.flatMap(s => s.range))];
    return [...Object.entries(counts).map(([r, n]) => n > 1 ? `${r} ×${n}` : r), ...ranges]
      .map(t => `<span>${esc(t)}</span>`).join("");
  }

  function taglineHTML() {
    const tag = COPY.TAGLINES[klass];
    if (!tag) return "";
    return `<p class="cp-tagline">${esc(tag.t).replace(esc(tag.kw),
      `<em class="ry-tagword">${esc(tag.kw)}</em>`)}</p>`;
  }

  // The full authored paragraph where it exists (Cultist, Tinker); otherwise the
  // interim ×21 Atlas engine blurb under the same ruled label.
  function engineHTML() {
    const full = COPY.CLASS_ENGINE[cSlug];
    // The ✦ rare-part list: computed from the roster, the same rule and the same
    // source as the Atlas card. No fact, no bullet — never invented.
    const facts = CARDS.factsFor(CARDS.classByName[klass] || { name: klass, specs });
    const rare = facts.length
      ? `<ul class="ry-rare">${facts.map(f =>
        `<li data-tipname="${esc(f[0])}" data-tip="${esc(f[1])}"><span class="mark">✦</span>${esc(f[0])}</li>`).join("")}</ul>` : "";
    if (full) return `<div class="ry-engine"><span class="lab">${esc(full.label)}</span>
      <p class="ry-lede">${esc(full.lede)}</p><p>${esc(full.text)}</p>${rare}</div>`;
    const blurb = COPY.ENGINES[klass];
    if (!blurb) return "";
    return `<div class="ry-engine"><span class="lab">${esc(blurb.lab)}</span><p>${esc(blurb.p)}</p>${rare}</div>`;
  }

  const classVideo = specs.find(s => s.media.classVideo)?.media.classVideo || null;

  function thumbsHTML() {
    if (!classVideo) return "";
    const title = "Official Ascension class video — an older fantasy reference, not evidence";
    return `<a class="ry-thumb ry-t1" href="https://www.youtube.com/watch?v=${esc(classVideo)}"
        target="_blank" rel="noreferrer" title="${esc(title)}">
        <img src="https://i.ytimg.com/vi/${esc(classVideo)}/mqdefault.jpg" alt="" loading="lazy">
        <span class="play">▶</span><span class="cap">Class highlight</span></a>
      <a class="ph-thumb" href="https://www.youtube.com/watch?v=${esc(classVideo)}"
        target="_blank" rel="noreferrer" title="${esc(title)}">
        <img src="https://i.ytimg.com/vi/${esc(classVideo)}/mqdefault.jpg" alt="" loading="lazy">
        <span class="play">▶</span><span class="cap">Class highlight</span></a>`;
  }

  el("mast").innerHTML = `
    <span class="glyph" aria-hidden="true">${glyph(specs[0])}</span>
    <div class="crumb"><a href="index.html">Atlas</a> / ${esc(klass)}
      ${fromChoose ? ` · <a href="choose.html#results">← Back to your results</a>` : ""}
      ${fromGuided ? ` · <a href="guided.html">← Back to the Guided verdict</a>` : ""}</div>
    <div class="kick">Class · ${specs.length} specializations</div>
    <h1>${esc(klass)}</h1>
    ${taglineHTML()}
    ${engineHTML()}
    <div class="cp-roles">${roleLine()}</div>
    ${thumbsHTML()}`;
  el("mast").style.setProperty("--class-color", color);
  document.body.classList.add("ry-e-col", "ry-v-t1", "ry-glow", "ry-k-airfam");
  // One-line law guard: a role line that would clip (Sun Cleric at 390px) tightens
  // instead — the ruled look everywhere else stays untouched.
  const rolesEl = el("mast").querySelector(".cp-roles");
  const fitRoles = () => {
    if (!rolesEl) return;
    rolesEl.classList.remove("tight");
    if (rolesEl.scrollWidth > rolesEl.clientWidth) rolesEl.classList.add("tight");
  };
  fitRoles();
  window.addEventListener("resize", fitRoles);

  // ROUND-1 STUDY (temporary): the one-line class name, ?n=fit|small|tight.
  // fit = measure the rendered name and scale only the names that overflow,
  // at any width — the same self-correcting idea as the role-line guard above.
  const nameForm = params.get("n");
  if (["fit", "small", "tight"].includes(nameForm)) document.body.classList.add("ry-n-" + nameForm);
  const nameEl = el("mast").querySelector("h1");
  const fitName = () => {
    if (!document.body.classList.contains("ry-n-fit") || !nameEl) return;
    nameEl.style.fontSize = "";
    const cs = getComputedStyle(nameEl);
    const avail = nameEl.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const text = range.getBoundingClientRect().width;
    if (text > avail) nameEl.style.fontSize =
      Math.max(15, parseFloat(cs.fontSize) * avail / text - 0.3) + "px";
  };
  fitName();
  window.addEventListener("resize", fitName);
  // A scrollbar arriving after first paint narrows the h1 without a resize
  // event; the observer re-fits on any size change and converges in one pass.
  if (window.ResizeObserver) new ResizeObserver(fitName).observe(nameEl);

  // ---------- the seal (Cultist, Tinker) ----------

  const cultistNodes = [
    { id: "cultist/corruption", name: "Corruption", verb: "SPREAD", x: 73, y: 64 },
    { id: "cultist/dreadnought", name: "Dreadnought", verb: "ENDURE", x: 347, y: 64 },
    { id: "cultist/heretic", name: "Heretic", verb: "CONVERT", x: 73, y: 196 },
    { id: "cultist/godblade", name: "Godblade", verb: "CROSS", x: 347, y: 196 },
  ];
  const tinkerNodes = [
    { id: "tinker/demolition", name: "Demolition", verb: "DETONATE", x: 78, y: 50, icon: "bomb" },
    { id: "tinker/invention", name: "Invention", verb: "RESTORE", x: 342, y: 50, icon: "beacon" },
    { id: "tinker/mechanics", name: "Mechanics", verb: "OVERCLOCK", x: 210, y: 149, icon: "mech" },
  ];

  const nodeSvg = (s, ny = 42, vy = 54, cls = "") =>
    `<g class="cd-node${cls ? " " + cls : ""}" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;

  const CULTIST_DEFS = `<defs>
      <radialGradient id="cdIris"><stop offset="0" stop-color="#e1b968"/><stop offset=".34" stop-color="#8e4fb2"/><stop offset="1" stop-color="#25112f"/></radialGradient>
      <filter id="cdGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const cultistEye = (cx, cy, scale) => `<g transform="translate(${cx} ${cy}) scale(${scale})">
      <path class="cd-eye-shell" d="M-55 0 Q0-41 55 0 Q0 41-55 0Z"/>
      <path class="cd-eye-lid" d="M-55 0 Q0-41 55 0 M-55 0 Q0 41 55 0"/>
      <circle class="cd-iris" r="24"/><ellipse class="cd-pupil" rx="7" ry="23"/></g>`;

  // Desktop: the re-spaced 420×260 drawing authored for the tall col slot.
  const CULTIST_DESKTOP = `<title id="seal-title">Insanity expressed as four Cultist bargains</title>
    ${CULTIST_DEFS}
    <path class="cd-tendril" d="M210 130 C130 40 105 235 22 185 M210 130 C290 40 315 235 398 185"/>
    <circle class="cd-orbit threshold" cx="210" cy="130" r="69"/><circle class="cd-orbit" cx="210" cy="130" r="88"/>
    ${cultistNodes.map(s => `<path class="cd-link" d="M210 130 L${s.x} ${s.y}"/>`).join("")}
    ${cultistEye(210, 130, .72)}
    <text class="cd-center-label" x="210" y="135" text-anchor="middle">INSANITY</text>
    <text class="cd-threshold" x="210" y="34" text-anchor="middle">60 · HOLD</text>
    <text class="cd-threshold" x="210" y="232" text-anchor="middle">100 · CROSS</text>
    ${cultistNodes.map(s => nodeSvg(s)).join("")}`;

  // Phone: the ruled 420×224 tightened arrangement — orbits 60/77, eye .66,
  // node rows raised. Nothing removed.
  const CULTIST_PHONE_NODES = [
    { id: "cultist/corruption", name: "Corruption", verb: "SPREAD", x: 73, y: 56 },
    { id: "cultist/dreadnought", name: "Dreadnought", verb: "ENDURE", x: 347, y: 56 },
    { id: "cultist/heretic", name: "Heretic", verb: "CONVERT", x: 73, y: 167 },
    { id: "cultist/godblade", name: "Godblade", verb: "CROSS", x: 347, y: 167 },
  ];
  const CULTIST_PHONE = `<title id="seal-title">Insanity expressed as four Cultist bargains</title>
    ${CULTIST_DEFS}
    <path class="cd-tendril" d="M210 110 C130 30 105 200 22 158 M210 110 C290 30 315 200 398 158"/>
    <circle class="cd-orbit threshold" cx="210" cy="110" r="60"/><circle class="cd-orbit" cx="210" cy="110" r="77"/>
    ${CULTIST_PHONE_NODES.map(s => `<path class="cd-link" d="M210 110 L${s.x} ${s.y}"/>`).join("")}
    ${cultistEye(210, 110, .66)}
    <text class="cd-center-label" x="210" y="152" text-anchor="middle">INSANITY</text>
    <text class="cd-threshold" x="210" y="32" text-anchor="middle">60 · HOLD</text>
    <text class="cd-threshold" x="210" y="192" text-anchor="middle">100 · CROSS</text>
    ${CULTIST_PHONE_NODES.map(s => nodeSvg(s, 40, 52)).join("")}`;

  function gearPoints(cx, cy, outer, inner, teeth = 12) {
    return Array.from({ length: teeth * 2 }, (_, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI / teeth);
      const radius = i % 2 ? inner : outer;
      return `${(cx + Math.cos(angle) * radius).toFixed(1)},${(cy + Math.sin(angle) * radius).toFixed(1)}`;
    }).join(" ");
  }
  function tinkerIcon(s) {
    if (s.icon === "bomb") return `<circle class="tk-icon-line" r="9"/><path class="tk-icon-line" d="M5-8 Q12-17 17-10 M14-13l5-3m-3 6 5 1"/>`;
    if (s.icon === "beacon") return `<path class="tk-icon-line" d="M-9 10V-8H9V10M-14 10H14M0-4v9M-5 .5H5"/><path class="tk-signal" d="M-15-8Q0-21 15-8M-10-5Q0-14 10-5"/>`;
    return `<path class="tk-icon-line" d="M-13-8H13V10H-13ZM-7 10v6m14-6v6M-5-1h2m6 0h2M-6 5H6"/><path class="tk-signal" d="M0-8v-7m-4 0h8"/>`;
  }
  const tinkerNodeSvg = s => `<g class="cd-node tk-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="27"/><circle class="tk-bolt" r="21"/>${tinkerIcon(s)}
      <text class="node-name" text-anchor="middle" y="39">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="51">${s.verb}</text></g>`;
  const TINKER_SEAL = `<title id="tinker-seal-title">A workshop core routes Tinker's machines into demolition, healing invention, or an overclocked mech</title>
    <defs>
      <radialGradient id="tkCore"><stop offset="0" stop-color="#f4d67c"/><stop offset=".42" stop-color="#b66d24"/><stop offset="1" stop-color="#2b2114"/></radialGradient>
      <linearGradient id="tkMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7b16b"/><stop offset=".45" stop-color="#64513a"/><stop offset="1" stop-color="#201c18"/></linearGradient>
      <filter id="tkGlow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="tkGrid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="#d9a441" stroke-width=".45" opacity=".12"/></pattern>
    </defs>
    <rect class="tk-grid" x="8" y="8" width="404" height="189" rx="2"/>
    <path class="tk-trace" d="M210 94 L78 50 M210 94 L342 50 M210 94 L210 149"/>
    <path class="tk-trace tk-trace-hot" d="M210 94 L78 50 M210 94 L342 50 M210 94 L210 149"/>
    <circle class="tk-orbit" cx="210" cy="94" r="58"/><circle class="tk-orbit dashed" cx="210" cy="94" r="47"/>
    <polygon class="tk-gear" points="${gearPoints(210, 94, 43, 35, 12)}"/>
    <circle class="tk-core" cx="210" cy="94" r="27"/><circle class="tk-core-ring" cx="210" cy="94" r="17"/>
    <text class="tk-center-label" x="210" y="96" text-anchor="middle">BUILD</text>
    <text class="tk-center-sub" x="210" y="106" text-anchor="middle">MACHINES</text>
    <text class="tk-legend" x="18" y="20">WORKSHOP SCHEMATIC // TEMPORARY MACHINES</text>
    <text class="tk-legend right" x="402" y="190" text-anchor="end">BUILD · DEPLOY · ADAPT</text>
    ${tinkerNodes.map(tinkerNodeSvg).join("")}`;

  // Knight of Xoroth: the Demonfire bar drawn as a ring of six embers around a flame
  // core. The crown ember is the sixth stack — the seal's one tension: FEED / 6 · UNLEASH.
  // Numbers trace to v3: Demon Heart fills six stacks; spenders pay per stack consumed;
  // each spec tree keeps a six-stack rider (Rain of Chaos · Pestilence Unbound · refunds).
  const koxNodes = [
    { id: "knight-of-xoroth/hellfire", name: "Hellfire", verb: "UNLEASH", x: 73, y: 66 },
    { id: "knight-of-xoroth/war", name: "War", verb: "CYCLE", x: 347, y: 66 },
    { id: "knight-of-xoroth/defiance", name: "Defiance", verb: "STOKE", x: 210, y: 206 },
  ];
  const KOX_DEFS = `<defs>
      <radialGradient id="kxEmber"><stop offset="0" stop-color="#ffd98a"/><stop offset=".45" stop-color="#e14f64"/><stop offset="1" stop-color="#3a0f16"/></radialGradient>
      <radialGradient id="kxCore"><stop offset="0" stop-color="#f6cf7f"/><stop offset=".5" stop-color="#c23f52"/><stop offset="1" stop-color="#1c0a0f"/></radialGradient>
      <filter id="kxGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <marker id="kxArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8z" fill="#bfa96e"/></marker>
    </defs>`;
  const koxPip = (x, y, s, crown) => `<g class="kx-pip${crown ? " crown" : ""}" transform="translate(${x} ${y}) scale(${s})">
      <path class="pip-flame" d="M0 5 C-4.5 1 -3 -4 0 -8 C3 -4 4.5 1 0 5 Z"/><circle class="pip-dot" r="1.6" cy="1.5"/></g>`;
  const koxFlame = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})">
      <path class="kx-flame" d="M0 18 C-14 6 -10 -14 0 -26 C10 -14 14 6 0 18 Z"/>
      <path class="kx-flame-in" d="M0 12 C-6 4 -4 -6 0 -14 C4 -6 6 4 0 12 Z"/></g>`;
  // Desktop: pip ring at radius 52 around (210,112); stacks grow toward the crown.
  const KOX_DESKTOP = `<title id="kox-seal-title">Demonfire expressed as a six-ember bar: feed it, and unleash at six</title>
    ${KOX_DEFS}
    <circle class="kx-orbit" cx="210" cy="112" r="74"/>
    <path class="kx-hex" d="M210 60 L255 86 L255 138 L210 164 L165 138 L165 86 Z"/>
    <path class="kx-link" d="M165 86 L73 66"/><path class="kx-link" d="M255 86 L347 66"/>
    <path class="kx-link" d="M210 164 L210 206"/>
    <path class="kx-feed" d="M197 159 C152 140 152 84 197 63" marker-end="url(#kxArr)"/>
    <text class="kx-feed-lab" x="130" y="104" text-anchor="middle">FEED</text>
    <circle class="kx-coreback" cx="210" cy="102" r="24"/>
    ${koxFlame(210, 100, .78)}
    <text class="kx-threshold" x="210" y="38" text-anchor="middle">6 · UNLEASH</text>
    ${koxPip(210, 164, .85)}${koxPip(165, 138, 1)}${koxPip(255, 138, 1)}
    ${koxPip(165, 86, 1.15)}${koxPip(255, 86, 1.15)}${koxPip(210, 60, 1.5, true)}
    <text class="kx-legend" x="16" y="252">FED BY DEMONS AND BLOOD</text>
    <text class="kx-center-label" x="210" y="139" text-anchor="middle">DEMONFIRE</text>
    <text class="kx-center-sub" x="210" y="151" text-anchor="middle">EVERY STACK PAYS</text>
    ${koxNodes.map(s => nodeSvg(s, s.y > 170 ? 38 : 42, s.y > 170 ? 50 : 54, "kx-node")).join("")}`;
  // Phone: the ruled 420×224 tightened arrangement — ring 46, core .66, rows raised.
  const KOX_PHONE_NODES = [
    { id: "knight-of-xoroth/hellfire", name: "Hellfire", verb: "UNLEASH", x: 73, y: 60 },
    { id: "knight-of-xoroth/war", name: "War", verb: "CYCLE", x: 347, y: 60 },
    { id: "knight-of-xoroth/defiance", name: "Defiance", verb: "STOKE", x: 210, y: 178 },
  ];
  const KOX_PHONE = `<title id="kox-seal-title">Demonfire expressed as a six-ember bar: feed it, and unleash at six</title>
    ${KOX_DEFS}
    <circle class="kx-orbit" cx="210" cy="94" r="64"/>
    <path class="kx-hex" d="M210 48 L250 71 L250 117 L210 140 L170 117 L170 71 Z"/>
    <path class="kx-link" d="M170 71 L73 60"/><path class="kx-link" d="M250 71 L347 60"/>
    <path class="kx-link" d="M210 140 L210 178"/>
    <path class="kx-feed" d="M198 135 C158 118 158 68 198 53" marker-end="url(#kxArr)"/>
    <text class="kx-feed-lab" x="136" y="92" text-anchor="middle">FEED</text>
    <circle class="kx-coreback" cx="210" cy="86" r="20"/>
    ${koxFlame(210, 84, .66)}
    <text class="kx-threshold" x="210" y="30" text-anchor="middle">6 · UNLEASH</text>
    ${koxPip(210, 140, .75)}${koxPip(170, 117, .85)}${koxPip(250, 117, .85)}
    ${koxPip(170, 71, 1)}${koxPip(250, 71, 1)}${koxPip(210, 48, 1.3, true)}
    <text class="kx-legend" x="14" y="218">FED BY DEMONS AND BLOOD</text>
    <text class="kx-center-label" x="210" y="119" text-anchor="middle">DEMONFIRE</text>
    <text class="kx-center-sub" x="210" y="129" text-anchor="middle">EVERY STACK PAYS</text>
    ${KOX_PHONE_NODES.map(s => nodeSvg(s, s.y > 150 ? 33 : 40, s.y > 150 ? 44 : 52, "kx-node")).join("")}`;

  if (cSlug === "cultist") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal" aria-label="Cultist class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="seal-title">${CULTIST_DESKTOP}</svg></div>`);
  } else if (cSlug === "tinker") {
    el("mast").classList.add("cd-with-seal", "cd-tinker-mast");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal cd-tinker-seal" aria-label="Tinker class engine diagram">
        <svg viewBox="0 0 420 205" role="img" aria-labelledby="tinker-seal-title">${TINKER_SEAL}</svg></div>`);
  } else if (cSlug === "knight-of-xoroth") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-kox-seal" aria-label="Knight of Xoroth class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="kox-seal-title">${KOX_DESKTOP}</svg></div>`);
  } else {
    // G2 · the seat (RULED 2026-08-10). Crests are skipped, so the class glyph holds
    // the slot with the honest caption. Masthead geometry matches the sealed classes.
    el("mast").classList.add("ry-gap-slot");
    el("mast").insertAdjacentHTML("beforeend", `<div class="ry-sealgap" aria-hidden="true">
      <span class="ry-seatglyph">${glyph(specs[0])}</span>
      <span class="cap">Seal not yet drawn</span></div>`);
  }

  // ---------- rail: the airfam spec cards ----------

  function verbChip(specId) {
    const v = COPY.VERBS[specId];
    return v ? `<span class="ry-verb-chip" data-tipname="${esc(v[0])}" data-tip="${esc(v[1])}">${esc(v[0])}</span>` : "";
  }

  // Loop-topology micro-glyphs, only where a strip has been authored. No invented shapes.
  const TOPO = {
    "cultist/godblade": "spike", "cultist/corruption": "wave", "tinker/demolition": "stack",
    "knight-of-xoroth/hellfire": "pips", "knight-of-xoroth/war": "wheel", "knight-of-xoroth/defiance": "bank",
  };
  function topoGlyph(kind) {
    const art = {
      spike: `<path d="M2 15 L26 6 26 15 Z" class="tg-fill"/><rect x="32" y="3" width="12" height="12" class="tg-hot"/><path d="M50 15 L62 10 62 15 Z" class="tg-fill"/>`,
      wave: `<path d="M2 15 Q9 4 16 15 Q23 4 30 15 Q37 4 44 15 Q51 4 58 15" class="tg-line"/>`,
      stack: `<rect x="2" y="12" width="18" height="3" class="tg-fill"/><rect x="5" y="8" width="15" height="3" class="tg-fill"/><rect x="8" y="4" width="12" height="3" class="tg-fill"/><rect x="28" y="3" width="12" height="12" class="tg-hot"/><rect x="46" y="12" width="14" height="3" class="tg-fill"/>`,
      pips: `<rect x="2" y="13" width="3.4" height="3.4" class="tg-fill"/><rect x="8" y="11.4" width="3.4" height="3.4" class="tg-fill"/><rect x="14" y="9.8" width="3.4" height="3.4" class="tg-fill"/><rect x="20" y="8.2" width="3.4" height="3.4" class="tg-fill"/><rect x="26" y="6.6" width="3.4" height="3.4" class="tg-fill"/><rect x="32" y="5" width="3.4" height="3.4" class="tg-fill"/><rect x="40" y="3" width="12" height="12" class="tg-hot"/><rect x="56" y="13" width="3.4" height="3.4" class="tg-fill"/>`,
      wheel: `<path class="tg-line" d="M17 5 A7.5 7.5 0 1 0 17 13"/><path class="tg-fill" d="M14 2 L20 5 L14 8 Z"/><rect x="28" y="3" width="12" height="12" class="tg-hot"/><path class="tg-line" d="M56 5 A6.5 6.5 0 1 0 56 13"/>`,
      bank: `<path class="tg-line" d="M2 15 L9 15 L9 11 L17 11 L17 7 L30 7"/><rect x="34" y="4" width="11" height="11" class="tg-hot"/><path class="tg-line" d="M49 15 L62 15"/>`,
    }[kind];
    return art ? `<svg class="ry-topo" viewBox="0 0 64 18" aria-hidden="true">${art}</svg>` : "";
  }

  function cardBody(s) {
    const fam = famById[s.atlas];
    const famRow = `<div class="rc-family" ${fam?.tagline ? `data-tipname="${esc(fam.name)}" data-tip="${esc(fam.tagline)}"` : ""}>
      ${topoGlyph(TOPO[s.id])}<span>${esc(fam?.name || "")}</span></div>`;
    const a = COPY.CARDS[s.id];
    if (a) return `
      <div class="rc-top"><b>${esc(s.name)}</b>${verbChip(s.id)}</div>
      <div class="rc-role">${[...s.roles, ...s.range].map(esc).join(" · ")}</div>
      ${famRow}
      <p class="rc-line">${esc(a.line)}</p>
      <div class="rc-div"></div>
      <div class="rc-mark yes"><span>✓</span><span>${esc(a.yes)}</span></div>
      <div class="rc-mark no"><span>✕</span><span>${esc(a.no)}</span></div>`;
    // No authored blurb yet: the researched fantasy and fit lines stand in. The card
    // keeps the ruled airfam anatomy — the family row is researched data, not copy.
    const yes = s.fit.enjoy[0]?.t || "";
    const no = s.fit.avoid[0]?.t || "";
    return `
      <div class="rc-top"><b>${esc(s.name)}</b>${verbChip(s.id)}</div>
      <div class="rc-role">${[...s.roles, ...s.range].map(esc).join(" · ")}</div>
      ${famRow}
      <p class="rc-fantasy">"${esc(s.fantasy || s.oneLine)}"</p>
      ${yes ? `<p class="rc-yes">✓ ${esc(yes)}</p>` : ""}
      ${no ? `<p class="rc-no">✕ ${esc(no)}</p>` : ""}`;
  }

  function railHTML(selId) {
    return specs.map(s => {
      const short = s.id.split("/")[1];
      const sel = s.id === selId;
      return `<button class="rail-card ry-card2 ry-card3 ${sel ? "sel" : ""}" role="tab" aria-selected="${sel}"
          id="tab-${short}" data-sel="${s.id}" style="--class-color:${s.color}">${cardBody(s)}</button>`;
    }).join("");
  }

  // ---------- the rhythm block ----------

  const corrTicks = Array.from({ length: 36 }, (_, i) =>
    `<line class="tick" x1="${30 + i * 22}" y1="118" x2="${30 + i * 22}" y2="126"/>`).join("");

  // Knight of Xoroth strip furniture: Demonfire embers and Defiance's banked imps.
  const stripEmber = (x, y, s, lit) => `<g class="kx-sember${lit ? " lit" : ""}" transform="translate(${x} ${y}) scale(${s})">
      <path class="pip-flame" d="M0 6 C-5.5 1 -3.5 -5 0 -10 C3.5 -5 5.5 1 0 6 Z"/></g>`;
  const impGlyph = (x, y) => `<g class="kx-impg" transform="translate(${x} ${y})">
      <path class="imp-body" d="M-6 6 h12 v-6 a6 6 0 0 0 -12 0 Z"/>
      <path class="imp-horn" d="M-4 -5 l-2.5 -4 M4 -5 l2.5 -4"/></g>`;

  const STRIPS = {
    "cultist/godblade": {
      svg: `<svg viewBox="0 0 1000 158" role="img" aria-label="Godblade rhythm: build, hold at 60, one burst window at 100 that also endangers you, then rebuild">
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="thr" x1="14" y1="32" x2="986" y2="32"/><text class="thr-lab" x="14" y="26">100 · cross</text>
        <line class="thr" x1="14" y1="68" x2="986" y2="68"/><text class="thr-lab" x="14" y="62">60 · hold</text>
        <line class="ax" x1="14" y1="122" x2="986" y2="122"/>
        <path class="gb-climb" d="M20 122 L110 108 L140 112 L240 96 L275 100 L370 82 L400 85 L470 70 L500 74 L530 68 L530 122 Z"/>
        <rect class="gb-window" x="575" y="36" width="170" height="86" rx="2"/>
        <text class="gb-window-lab" x="660" y="66" text-anchor="middle">BURST WINDOW</text>
        <text class="ph2" x="660" y="84" text-anchor="middle" fill="#e8daf7">Voidborne · Rifted Hammer</text>
        <rect class="hazard" x="575" y="126" width="170" height="6"/>
        <text class="hazard-lab" x="660" y="145" text-anchor="middle">you take extra damage here</text>
        <path class="gb-climb" d="M780 122 L870 110 L900 113 L965 102 L965 122 Z"/>
        <text class="ph" x="270" y="142" text-anchor="middle">BUILD</text>
        <text class="ph2" x="270" y="156" text-anchor="middle">Insanity climbs · Rift goes down</text>
        <text class="ph" x="497" y="52" text-anchor="middle">HOLD</text>
        <text class="ph" x="878" y="142" text-anchor="middle">…REBUILD</text>
      </svg>`,
      read: "Most of the fight is preparation. The payoff is one short, loud window that also endangers you. Miss it, and the whole climb was wasted.",
      eyes: "your Insanity bar and your zone placement, then the target. The party barely exists to you.",
    },
    "cultist/corruption": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Corruption rhythm: DoT ticks never stop, medium beam payoffs repeat, refreshes sit between them, Insanity drifts toward a choice">
        <defs><marker id="ryArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${corrTicks}
        <path class="wave" d="M120 126 Q190 52 260 126 Z"/>
        <path class="wave" d="M400 126 Q470 52 540 126 Z"/>
        <path class="wave" d="M660 126 Q730 52 800 126 Z"/>
        <text class="ph" x="190" y="60" text-anchor="middle">BEAM &amp; GAZE</text>
        <text class="ph" x="470" y="60" text-anchor="middle">BEAM &amp; GAZE</text>
        <text class="ph" x="730" y="60" text-anchor="middle">BEAM &amp; GAZE</text>
        <path class="refresh" d="M320 96 l10 -10 l10 10 l-10 10 Z"/><text class="refresh-lab" x="330" y="78" text-anchor="middle">refresh</text>
        <path class="refresh" d="M590 96 l10 -10 l10 10 l-10 10 Z"/><text class="refresh-lab" x="600" y="78" text-anchor="middle">refresh</text>
        <path class="branch" d="M830 110 C 870 105 890 80 905 55" marker-end="url(#ryArr)"/>
        <path class="branch" d="M830 113 C 875 113 905 118 930 118" marker-end="url(#ryArr)"/>
        <text class="ph2" x="912" y="42" text-anchor="middle">Insanity 100: Wrath state</text>
        <text class="ph2" x="920" y="136" text-anchor="middle">or Sanity Tap it into mana</text>
        <text class="ph" x="190" y="146" text-anchor="middle">CARPET</text>
        <text class="ph2" x="190" y="160" text-anchor="middle">Darkwither everything · the ticks never stop</text>
        <text class="ph" x="470" y="146" text-anchor="middle">HARVEST, ENDLESSLY</text>
        <text class="ph2" x="470" y="160" text-anchor="middle">ticks accelerate the payoffs · never let the carpet lapse</text>
      </svg>`,
      read: "There is no big moment and no off switch. Damage rolls in repeating waves, and dropping the carpet stops the engine.",
      eyes: "debuff timers across the whole pack. Your own bar comes second.",
    },
    "tinker/demolition": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Demolition rhythm: layers of deployables stack, everything overlaps in one window, then the machine idles and gets rebuilt">
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <rect class="brick" x="40" y="112" width="330" height="12" rx="1"/><text class="brick-lab" x="48" y="121">Napalm</text>
        <rect class="brick" x="90" y="98" width="280" height="12" rx="1"/><text class="brick-lab" x="98" y="107">oil</text>
        <rect class="brick" x="150" y="84" width="220" height="12" rx="1"/><text class="brick-lab" x="158" y="93">turret — placed after the tank stacks</text>
        <rect class="brick" x="215" y="70" width="155" height="12" rx="1"/><text class="brick-lab" x="223" y="79">drone · factory</text>
        <rect class="dm-window" x="400" y="38" width="180" height="88" rx="2"/>
        <text class="dm-window-lab" x="490" y="64" text-anchor="middle">SPARKED AND READY</text>
        <text class="ph2" x="490" y="80" text-anchor="middle" fill="#e0cb9c">instant rockets while</text>
        <text class="ph2" x="490" y="94" text-anchor="middle" fill="#e0cb9c">every layer overlaps</text>
        <rect class="idle" x="612" y="70" width="120" height="56" rx="2"/>
        <text class="ph2" x="672" y="94" text-anchor="middle">pack moved —</text>
        <text class="ph2" x="672" y="108" text-anchor="middle">the machine idles</text>
        <rect class="brick" x="770" y="112" width="190" height="12" rx="1"/>
        <rect class="brick" x="810" y="98" width="150" height="12" rx="1"/>
        <rect class="brick" x="860" y="84" width="100" height="12" rx="1"/>
        <text class="ph" x="205" y="146" text-anchor="middle">BUILD THE MACHINE</text>
        <text class="ph2" x="205" y="160" text-anchor="middle">layers only pay off if they hit the same pack</text>
        <text class="ph" x="490" y="146" text-anchor="middle">FIRE ALL OF IT</text>
        <text class="ph" x="865" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      read: "You assemble layers before the fight matters, fire everything in one overlap, then rebuild. Layers only pay off if they hit the same pack.",
      eyes: "the ground your machines cover, and the pack the tank is stacking into them.",
    },
    "knight-of-xoroth/hellfire": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Hellfire rhythm: Demonfire stacks climb to six, one unleash window with Rain of Chaos and Hellfire Form, then the climb restarts">
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="thr" x1="14" y1="44" x2="986" y2="44"/><text class="thr-lab" x="14" y="38">6 · the full bar</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M70 122 L420 56"/>
        ${stripEmber(90, 118, .8)}${stripEmber(155, 106, .9)}${stripEmber(220, 94, 1)}
        ${stripEmber(285, 82, 1.1)}${stripEmber(350, 69, 1.2)}${stripEmber(415, 56, 1.4, true)}
        <rect class="kx-window" x="460" y="48" width="240" height="78" rx="2"/>
        <text class="kx-window-lab" x="580" y="74" text-anchor="middle">UNLEASH</text>
        <text class="ph2" x="580" y="92" text-anchor="middle" fill="#f3cdd4">Flames of Xoroth → Rain of Chaos · 9 s</text>
        <text class="ph2" x="580" y="106" text-anchor="middle" fill="#f3cdd4">Hellfire Form 15 s · Seeking Flame free</text>
        <path class="kx-climb" d="M760 122 L950 92"/>
        ${stripEmber(790, 117, .8)}${stripEmber(855, 106, .9)}${stripEmber(920, 95, 1)}
        <text class="ph" x="250" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">Seeking Flame stacks Demonfire · +1 each, faster in Form</text>
        <text class="ph" x="855" y="146" text-anchor="middle">…REBUILD</text>
      </svg>`,
      read: "Stacks climb one strike at a time toward six, then the whole bar goes out in one unleash. Rain of Chaos needs the full six — a thin spend never calls it.",
      eyes: "the Demonfire count, then the Form timer; the number six matters more than the target.",
    },
    "knight-of-xoroth/war": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="War rhythm: a short repeating loop — Gore charges build Demonfire, spending boosts the next Gores for twelve seconds, a free Meatsaw restocks the bar, and the wheel turns again">
        <defs><marker id="kxArrW" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <circle class="kx-charge" cx="70" cy="112" r="7"/><circle class="kx-charge" cx="102" cy="112" r="7"/>
        <text class="ph2" x="86" y="92" text-anchor="middle">Gore ×2 · 8 s</text>
        <path class="refresh" d="M140 104 l10 -10 l10 10 l-10 10 Z"/><text class="refresh-lab" x="150" y="80" text-anchor="middle">spend</text>
        <rect class="kx-window" x="180" y="58" width="140" height="68" rx="2"/>
        <text class="kx-window-lab" x="250" y="82" text-anchor="middle">GORES +25%</text>
        <text class="ph2" x="250" y="100" text-anchor="middle" fill="#f3cdd4">12 s → free Meatsaw</text>
        ${stripEmber(350, 100, 1)}
        <path class="branch" d="M355 112 C 375 128, 395 128, 412 118" marker-end="url(#kxArrW)"/>
        <circle class="kx-charge" cx="420" cy="112" r="7"/><circle class="kx-charge" cx="452" cy="112" r="7"/>
        <path class="refresh" d="M490 104 l10 -10 l10 10 l-10 10 Z"/>
        <rect class="kx-window" x="530" y="58" width="140" height="68" rx="2"/>
        <text class="kx-window-lab" x="600" y="82" text-anchor="middle">GORES +25%</text>
        <text class="ph2" x="600" y="100" text-anchor="middle" fill="#f3cdd4">wounds stack · 10 s</text>
        ${stripEmber(700, 100, 1)}
        <path class="branch" d="M705 112 C 725 128, 745 128, 762 118" marker-end="url(#kxArrW)"/>
        <circle class="kx-charge" cx="770" cy="112" r="7"/><circle class="kx-charge" cx="802" cy="112" r="7"/>
        <path class="refresh" d="M840 104 l10 -10 l10 10 l-10 10 Z"/>
        <rect class="kx-window" x="880" y="58" width="106" height="68" rx="2"/>
        <text class="ph" x="205" y="146" text-anchor="middle">SPEND &amp; RELOAD</text>
        <text class="ph2" x="205" y="160" text-anchor="middle">spending Demonfire hands Gore a charge back</text>
        <text class="ph" x="555" y="146" text-anchor="middle">…AND TURN AGAIN</text>
        <text class="ph2" x="555" y="160" text-anchor="middle">the free Meatsaw restocks the bar for the next turn</text>
      </svg>`,
      read: "There is no long climb — just a short wheel that keeps turning. Spending Demonfire hands Gore a charge back and ends in a free Meatsaw, so every payoff reloads the loop that feeds the next one.",
      eyes: "Gore's two charges and the 12-second boost timer; the wound stacks on your target come second.",
    },
    "knight-of-xoroth/defiance": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Defiance rhythm: blocks bank imps, active imps guard you, sacrificing them cashes the guard into healing and an absorb, then the bank rebuilds">
        <text class="strip-note" x="986" y="18" text-anchor="end">the shape of the loop · not a rotation</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-line" d="M40 124 L120 124 L120 110 L200 110 L200 96 L280 96 L280 82 L560 82"/>
        ${impGlyph(160, 102)}${impGlyph(240, 88)}
        ${impGlyph(320, 74)}${impGlyph(370, 74)}${impGlyph(420, 74)}${impGlyph(470, 74)}
        <text class="ph" x="420" y="40" text-anchor="middle">HOLD</text>
        <text class="ph2" x="420" y="54" text-anchor="middle">active imps blunt Physical &amp; Magic damage · crit blocks rise</text>
        <rect class="kx-window" x="580" y="48" width="180" height="78" rx="2"/>
        <text class="kx-window-lab" x="670" y="64" text-anchor="middle">CASH THE GUARD</text>
        <text class="ph2" x="670" y="78" text-anchor="middle" fill="#f3cdd4">imps become healing + an absorb</text>
        <path class="kx-line" d="M560 82 L596 82 L640 124 L760 124"/>
        <path class="kx-heal" d="M610 124 C640 84 706 84 736 124 Z"/>
        <path class="kx-line" d="M790 124 L850 124 L850 110 L920 110 L920 96 L960 96"/>
        ${impGlyph(885, 102)}
        <text class="ph" x="170" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="170" y="160" text-anchor="middle">a block can raise an imp · Shieldgore feeds the bar two at a time</text>
        <text class="ph" x="875" y="146" text-anchor="middle">…REBUILD</text>
      </svg>`,
      read: "Blocks bank imps, and standing imps are your armor. Sacrificial Circle cashes them out as healing — so you are always choosing between keeping the guard and spending it.",
      eyes: "your imp count and the damage coming in — you time the sacrifice off both.",
    },
  };

  // Authored-to-fit phone redraws (S2): same topology, fewer labels, no scroll.
  const PHONE_STRIPS = {
    "cultist/godblade": `<svg viewBox="0 0 380 214" role="img" aria-label="Godblade rhythm, phone: build, hold at 60, one burst window at 100 that also endangers you, then rebuild">
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="thr" x1="8" y1="40" x2="372" y2="40"/><text class="thr-lab" x="8" y="33">100 · cross</text>
      <line class="thr" x1="8" y1="82" x2="372" y2="82"/><text class="thr-lab" x="8" y="75">60 · hold</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      <path class="gb-climb" d="M12 150 L58 132 L72 137 L110 116 L124 120 L158 96 L172 99 L186 88 L186 150 Z"/>
      <rect class="gb-window" x="205" y="46" width="98" height="104" rx="2"/>
      <text class="gb-window-lab" x="254" y="76" text-anchor="middle">BURST</text>
      <text class="gb-window-lab" x="254" y="92" text-anchor="middle">WINDOW</text>
      <text class="ph2" x="254" y="110" text-anchor="middle" fill="#e6ccff">Voidborne</text>
      <text class="ph2" x="254" y="123" text-anchor="middle" fill="#e6ccff">Rifted Hammer</text>
      <rect class="hazard" x="205" y="154" width="98" height="6"/>
      <path class="gb-climb" d="M318 150 L344 138 L354 141 L370 132 L370 150 Z"/>
      <text class="ph" x="98" y="170" text-anchor="middle">BUILD</text>
      <text class="ph2" x="98" y="184" text-anchor="middle">Insanity climbs</text>
      <text class="ph" x="176" y="66" text-anchor="middle">HOLD</text>
      <text class="ph" x="344" y="170" text-anchor="middle">…REBUILD</text>
      <text class="hazard-lab" x="254" y="172" text-anchor="middle">extra damage here</text>
    </svg>`,
    "cultist/corruption": `<svg viewBox="0 0 380 212" role="img" aria-label="Corruption rhythm, phone: DoT ticks never stop, beam payoffs repeat, refreshes sit between them, Insanity drifts toward a choice">
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      ${Array.from({ length: 16 }, (_, i) => `<line class="tick" x1="${16 + i * 22}" y1="146" x2="${16 + i * 22}" y2="154"/>`).join("")}
      <path class="wave" d="M55 150 Q120 62 185 150 Z"/>
      <path class="wave" d="M220 150 Q285 62 350 150 Z"/>
      <text class="ph" x="120" y="56" text-anchor="middle">BEAM &amp; GAZE</text>
      <text class="ph" x="285" y="56" text-anchor="middle">BEAM &amp; GAZE</text>
      <path class="refresh" d="M195 112 l8 -8 l8 8 l-8 8 Z"/>
      <text class="refresh-lab" x="203" y="94" text-anchor="middle">refresh</text>
      <text class="ph" x="120" y="170" text-anchor="middle">CARPET</text>
      <text class="ph2" x="120" y="184" text-anchor="middle">Darkwither everything</text>
      <text class="ph" x="285" y="170" text-anchor="middle">HARVEST</text>
      <text class="ph2" x="285" y="184" text-anchor="middle">ticks accelerate the payoffs</text>
      <text class="ph2" x="190" y="204" text-anchor="middle">Insanity drifts: Wrath state at 100 — or Sanity Tap it into mana</text>
    </svg>`,
    "tinker/demolition": `<svg viewBox="0 0 380 214" role="img" aria-label="Demolition rhythm, phone: layers of deployables stack, everything overlaps in one window, then the machine idles and gets rebuilt">
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      <rect class="brick" x="16" y="136" width="124" height="11" rx="1"/><text class="brick-lab" x="21" y="145">Napalm</text>
      <rect class="brick" x="32" y="122" width="108" height="11" rx="1"/><text class="brick-lab" x="37" y="131">oil</text>
      <rect class="brick" x="48" y="108" width="92" height="11" rx="1"/><text class="brick-lab" x="53" y="117">turret</text>
      <rect class="brick" x="64" y="94" width="76" height="11" rx="1"/><text class="brick-lab" x="69" y="103">drone</text>
      <rect class="dm-window" x="160" y="52" width="100" height="98" rx="2"/>
      <text class="dm-window-lab" x="210" y="82" text-anchor="middle">FIRE</text>
      <text class="dm-window-lab" x="210" y="98" text-anchor="middle">ALL OF IT</text>
      <text class="ph2" x="210" y="116" text-anchor="middle" fill="#f2dcae">instant rockets,</text>
      <text class="ph2" x="210" y="129" text-anchor="middle" fill="#f2dcae">every layer overlaps</text>
      <rect class="idle" x="272" y="84" width="70" height="40" rx="2"/>
      <text class="ph2" x="307" y="100" text-anchor="middle">pack moved —</text>
      <text class="ph2" x="307" y="113" text-anchor="middle">it idles</text>
      <rect class="brick" x="300" y="136" width="64" height="11" rx="1"/>
      <rect class="brick" x="316" y="122" width="48" height="11" rx="1"/>
      <text class="ph" x="85" y="170" text-anchor="middle">BUILD</text>
      <text class="ph2" x="85" y="184" text-anchor="middle">layers must hit the same pack</text>
      <text class="ph" x="210" y="170" text-anchor="middle">SPARKED &amp; READY</text>
      <text class="ph" x="332" y="170" text-anchor="middle">REBUILD</text>
    </svg>`,
    "knight-of-xoroth/hellfire": `<svg viewBox="0 0 380 206" role="img" aria-label="Hellfire rhythm, phone: Demonfire stacks climb to six, one unleash window with Rain of Chaos and Hellfire Form, then the climb restarts">
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="thr" x1="8" y1="44" x2="372" y2="44"/><text class="thr-lab" x="8" y="37">6 · full bar</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      <path class="kx-climb" d="M20 146 L200 60"/>
      ${stripEmber(35, 139, .7)}${stripEmber(68, 123, .8)}${stripEmber(101, 107, .9)}
      ${stripEmber(134, 92, 1)}${stripEmber(167, 76, 1.1)}${stripEmber(197, 61, 1.25, true)}
      <rect class="kx-window" x="215" y="48" width="110" height="102" rx="2"/>
      <text class="kx-window-lab" x="270" y="76" text-anchor="middle">UNLEASH</text>
      <text class="ph2" x="270" y="94" text-anchor="middle" fill="#f3cdd4">Rain of Chaos · 9 s</text>
      <text class="ph2" x="270" y="108" text-anchor="middle" fill="#f3cdd4">Form 15 s</text>
      <text class="ph2" x="270" y="122" text-anchor="middle" fill="#f3cdd4">builder runs free</text>
      <path class="kx-climb" d="M340 146 L372 132"/>
      ${stripEmber(358, 138, .8)}
      <text class="ph" x="110" y="170" text-anchor="middle">BUILD</text>
      <text class="ph2" x="110" y="184" text-anchor="middle">Seeking Flame · +1 each</text>
      <text class="ph2" x="270" y="170" text-anchor="middle">at six, the whole bar goes out</text>
    </svg>`,
    "knight-of-xoroth/war": `<svg viewBox="0 0 380 206" role="img" aria-label="War rhythm, phone: a short repeating loop — Gore charges build Demonfire, spending boosts the next Gores, a free Meatsaw restocks the bar">
      <defs><marker id="kxArrWp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      <circle class="kx-charge" cx="48" cy="118" r="7"/><circle class="kx-charge" cx="76" cy="118" r="7"/>
      <text class="ph2" x="62" y="96" text-anchor="middle">Gore ×2 · 8 s</text>
      <path class="refresh" d="M110 110 l9 -9 l9 9 l-9 9 Z"/><text class="refresh-lab" x="119" y="86" text-anchor="middle">spend</text>
      <rect class="kx-window" x="148" y="54" width="118" height="72" rx="2"/>
      <text class="kx-window-lab" x="207" y="82" text-anchor="middle">GORES +25%</text>
      <text class="ph2" x="207" y="100" text-anchor="middle" fill="#f3cdd4">12 s</text>
      ${stripEmber(292, 104, 1)}
      <text class="ph2" x="302" y="84" text-anchor="middle">free Meatsaw</text>
      <path class="branch" d="M300 116 C 260 156, 110 156, 52 130" marker-end="url(#kxArrWp)"/>
      <text class="ph" x="150" y="180" text-anchor="middle">SPEND &amp; RELOAD</text>
      <text class="ph2" x="150" y="194" text-anchor="middle">every payoff reloads the loop</text>
      <text class="ph2" x="300" y="180" text-anchor="middle">…and again</text>
    </svg>`,
    "knight-of-xoroth/defiance": `<svg viewBox="0 0 380 206" role="img" aria-label="Defiance rhythm, phone: blocks bank imps, imps guard you, sacrificing them cashes the guard into healing, then the bank rebuilds">
      <text class="strip-note" x="372" y="14" text-anchor="end">shape, not rotation</text>
      <line class="ax" x1="8" y1="150" x2="372" y2="150"/>
      <path class="kx-line" d="M16 148 L60 148 L60 136 L106 136 L106 124 L152 124 L152 112 L210 112"/>
      ${impGlyph(83, 128)}${impGlyph(129, 116)}${impGlyph(175, 104)}${impGlyph(200, 104)}
      <text class="ph" x="150" y="84" text-anchor="middle">HOLD</text>
      <rect class="kx-window" x="222" y="56" width="110" height="94" rx="2"/>
      <text class="kx-window-lab" x="277" y="80" text-anchor="middle">CASH</text>
      <text class="ph2" x="277" y="96" text-anchor="middle" fill="#f3cdd4">imps become healing</text>
      <text class="ph2" x="277" y="110" text-anchor="middle" fill="#f3cdd4">+ an absorb</text>
      <path class="kx-line" d="M210 112 L222 112 L246 148 L332 148"/>
      <path class="kx-heal" d="M232 148 C252 106 302 106 322 148 Z"/>
      <path class="kx-line" d="M344 148 L362 148 L362 136 L376 136"/>
      <text class="ph" x="100" y="170" text-anchor="middle">BUILD</text>
      <text class="ph2" x="100" y="184" text-anchor="middle">blocks raise imps</text>
      <text class="ph2" x="190" y="200" text-anchor="middle">keep the guard, or spend it</text>
    </svg>`,
  };

  // ---------- experimental screen cards ----------
  const HEAT = { hot: 1, med: .55, low: .38, cold: .18 };
  const SCREENS = {
    "cultist/godblade": {
      id: "godblade", color: "#b35cff", enemies: "single", ground: "rift",
      heat: { party: "cold", enemy: "med", ground: "hot", bar: "hot", actions: "med" },
      barFill: .74, barNotch: .6, barLabel: "INSANITY",
      chips: [{ t: "your Insanity bar", x: 150, y: 210, a: "start" }, { t: "your Rift", x: 240, y: 132, a: "middle" }],
    },
    "cultist/corruption": {
      id: "corruption", color: "#b35cff", enemies: "spread", ground: "tentacle", dotTimers: true,
      heat: { party: "cold", enemy: "hot", ground: "med", bar: "med", actions: "med" },
      barFill: .5, barLabel: "INSANITY",
      chips: [{ t: "DoT timers on every nameplate", x: 240, y: 30, a: "middle" }, { t: "Insanity · mana", x: 150, y: 210, a: "start" }],
    },
    "tinker/demolition": {
      id: "demolition", color: "#d9a441", enemies: "stacked", ground: "deployables",
      heat: { party: "low", enemy: "med", ground: "hot", bar: "cold", actions: "med" },
      barFill: .3, barLabel: "",
      chips: [{ t: "your machines on the ground", x: 240, y: 200, a: "middle" }, { t: "the pack, once it's stacked", x: 240, y: 30, a: "middle" }],
    },
  };

  function chipArt(c, color) {
    const w = Math.round(c.t.length * 5.7 + 16);
    const x = c.a === "middle" ? c.x - w / 2 : c.x;
    return `<g><rect x="${x}" y="${c.y}" width="${w}" height="17" rx="3" fill="rgba(8,6,10,.78)" stroke="${color}" stroke-opacity=".65"/>
      <text x="${x + w / 2}" y="${c.y + 12}" text-anchor="middle" font-size="10.5" fill="#efe7d6" letter-spacing=".04em">${esc(c.t)}</text></g>`;
  }
  function enemy(x, y, cfg) {
    const dots = cfg.dotTimers
      ? [0, 1, 2].map(i => `<rect x="${x - 27 + i * 9}" y="${y - 16}" width="7" height="7" rx="1" fill="${cfg.color}" opacity="${.95 - i * .22}"/>`).join("")
      : "";
    return `<rect x="${x - 28}" y="${y - 26}" width="56" height="7" rx="1.5" fill="#241f28"/>
      <rect x="${x - 28}" y="${y - 26}" width="${56 * .82}" height="7" rx="1.5" fill="#a04338"/>
      ${dots}<rect x="${x - 6}" y="${y - 5}" width="12" height="17" rx="2" fill="#4d4456"/>`;
  }
  function enemies(cfg) {
    if (cfg.enemies === "spread") return [[168, 96], [244, 78], [318, 102]].map(p => enemy(p[0], p[1], cfg)).join("");
    if (cfg.enemies === "stacked") return [[220, 92], [242, 84], [262, 96]].map(p => enemy(p[0], p[1], cfg)).join("");
    return enemy(240, 90, cfg);
  }
  function groundArt(cfg) {
    const base = `<ellipse cx="240" cy="166" rx="78" ry="19" fill="${cfg.color}" fill-opacity=".10" stroke="${cfg.color}" stroke-opacity=".8" stroke-width="1.4"/>`;
    if (cfg.ground === "rift") return base +
      `<ellipse cx="240" cy="166" rx="46" ry="11" fill="none" stroke="${cfg.color}" stroke-width="1" stroke-dasharray="5 4" opacity=".8"/>`;
    if (cfg.ground === "tentacle") return base +
      `<path d="M226 168 q4 -16 -4 -24 m18 24 q2 -12 10 -18" fill="none" stroke="${cfg.color}" stroke-width="1.6" opacity=".8"/>`;
    if (cfg.ground === "deployables") return base +
      `<path d="M198 170 L206 154 L214 170 Z" fill="none" stroke="${cfg.color}" stroke-width="1.6"/>
       <circle cx="260" cy="162" r="7" fill="none" stroke="${cfg.color}" stroke-width="1.6"/>
       <path d="M260 153 v-4 M260 171 v4 M251 162 h-4 M273 162 h-4" stroke="${cfg.color}" stroke-width="1.4"/>
       <ellipse cx="230" cy="174" rx="15" ry="4.5" fill="${cfg.color}" fill-opacity=".28"/>`;
    return base;
  }
  const partyArt = () => [.9, .76, .64, .86].map((f, i) => `
      <rect x="18" y="${18 + i * 15}" width="66" height="10" rx="2" fill="#221d29"/>
      <rect x="18" y="${18 + i * 15}" width="${66 * f}" height="10" rx="2" fill="${f < .5 ? "#b0483f" : "#5f9c6a"}"/>`).join("");
  function barArt(cfg) {
    const notch = cfg.barNotch
      ? `<line x1="${150 + 180 * cfg.barNotch}" y1="224" x2="${150 + 180 * cfg.barNotch}" y2="243" stroke="#c9aa71" stroke-width="1.3"/>` : "";
    return `<rect x="150" y="228" width="180" height="11" rx="2" fill="#221d29"/>
      <rect x="150" y="228" width="${180 * cfg.barFill}" height="11" rx="2" fill="${cfg.color}"/>
      ${cfg.barLabel ? `<text x="334" y="237" font-size="9" fill="#8d8678" letter-spacing=".1em">${cfg.barLabel}</text>` : ""}${notch}`;
  }
  const actionsArt = () => [0, 1, 2, 3, 4, 5].map(i =>
    `<rect x="${188 + i * 18}" y="246" width="15" height="15" rx="2" fill="#1c1822" stroke="#332c3b"/>`).join("");

  function screenSVG(cfg) {
    const h = k => HEAT[cfg.heat[k]];
    const glow = k => cfg.heat[k] === "hot" ? `filter="url(#ryg-${cfg.id})"` : "";
    return `<svg viewBox="0 0 480 270" role="img" aria-label="Stylized screen: bright regions are where attention lives">
      <defs><filter id="ryg-${cfg.id}" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect x="0" y="0" width="480" height="270" rx="6" fill="#0b0a0e" stroke="#26212c"/>
      <g opacity="${h("party")}" ${glow("party")}>${partyArt()}</g>
      <g opacity="${h("enemy")}" ${glow("enemy")}>${enemies(cfg)}</g>
      <g opacity="${h("ground")}" ${glow("ground")}>${groundArt(cfg)}</g>
      <g opacity="${h("bar")}" ${glow("bar")}>${barArt(cfg)}</g>
      <g opacity="${h("actions")}">${actionsArt()}</g>
      ${cfg.chips.map(c => chipArt(c, cfg.color)).join("")}
    </svg>`;
  }

  const phone = matchMedia("(max-width: 560px)");

  function blockHTML(specId) {
    const d = STRIPS[specId];
    if (!d) return `<div class="ry-block ry-gap">
      <p class="ry-read">Not drawn yet for this spec. Strips are authored one by one from researched evidence; we don't invent them.</p>
    </div>`;
    const sc = SCREENS[specId];
    const art = (phone.matches && PHONE_STRIPS[specId]) ? PHONE_STRIPS[specId] : d.svg;
    return `<div class="ry-block" data-strip="${specId}">
      <div class="ry-lab"><span></span><span>names: Data · shape: Inference</span></div>
      ${art}
      <div class="ry-reads">
        <p class="ry-read"><b>How to read it:</b> ${d.read}</p>
        <p class="ry-read"><b>Where your eyes live:</b> ${d.eyes}
          ${sc ? `<button class="ry-eye-btn" type="button" aria-expanded="false">👁 experimental</button>` : ""}</p>
      </div>
      ${sc ? `<div class="ry-screen" hidden>
        <p class="ry-warn">Experimental, unreliable, untested. Our sketch of where attention goes — not the real UI.</p>
        ${screenSVG(sc)}</div>` : ""}
    </div>`;
  }

  // Swap the strip drawing when the viewport crosses the phone breakpoint.
  function applyStrips() {
    const block = el("codex").querySelector(".ry-block[data-strip]");
    if (!block) return;
    const svg = block.querySelector(":scope > svg");
    const id = block.dataset.strip;
    if (!svg || !PHONE_STRIPS[id]) return;
    const wantPhone = phone.matches;
    if (wantPhone === (block.dataset.phone === "1")) return;
    svg.outerHTML = wantPhone ? PHONE_STRIPS[id] : STRIPS[id].svg;
    block.dataset.phone = wantPhone ? "1" : "0";
  }

  // ---------- codex composition ----------

  function decorateCodex() {
    const root = el("codex").querySelector("[data-spec-root]");
    if (!root) return;

    // Class-level video lives in the masthead; the codex stops repeating it.
    const strip = root.querySelector(".cine-strip");
    if (strip) {
      const label = strip.nextElementSibling;
      strip.remove();
      if (label?.classList.contains("media-label")) label.remove();
    }
    // RULED: no standing "no verified spec video" row — that record lives in
    // the Evidence & gaps fold instead.
    [...root.querySelectorAll(".media-label")]
      .find(l => l.textContent.includes("No verified current"))?.remove();

    // Defining talents move into the spec header's top-right corner.
    const icons = root.querySelector(".icon-strip");
    const head = root.querySelector(".d-head");
    if (icons && head && !head.querySelector(".ry-head-talents")) {
      const box = document.createElement("div");
      box.className = "ry-head-talents";
      box.setAttribute("aria-label", "Defining talents — hover or tap to read");
      box.append(...icons.querySelectorAll("img"));
      head.appendChild(box);
      icons.remove();
    }

    // Pips: all seven axes keep a tooltip justifying THAT value. The generated
    // boilerplate tail is a data bug — stripped here until the pipeline fixes it.
    const stats = root.querySelector(".d-stats");
    const spec = specById[root.dataset.spec];
    if (stats && spec) {
      const ctx = bestCtx(spec);
      const axisByLabel = Object.fromEntries(Object.entries(R.AXIS_LABELS).map(([k, l]) => [l, k]));
      stats.querySelectorAll(".stat").forEach(span => {
        const label = span.firstChild?.textContent?.trim() || "";
        const cell = (spec.complexity[axisByLabel[label]] || {})[ctx];
        if (cell?.why) {
          span.dataset.tipname = `${label} — ${cell.v}`;
          span.dataset.tip = cell.why.replace(/\s*A durable target makes repeated precision matter\.?\s*$/, "");
        }
      });
    }

    // The rhythm is the FIRST fold, open by default.
    if (!root.querySelector(".ry-block")) {
      root.querySelector(".folds")?.insertAdjacentHTML("afterbegin",
        `<div class="fold open"><button class="fold-head"><h4>The rhythm</h4><span class="f-hint">shape, not script</span><span class="arrow">▸</span></button>
         <div class="fold-body">${blockHTML(root.dataset.spec)}</div></div>`);
      const block = el("codex").querySelector(".ry-block[data-strip]");
      if (block) block.dataset.phone = phone.matches ? "1" : "0";
    }
  }

  // ---------- selection ----------

  function syncActive(id) {
    document.querySelectorAll("[data-cd-spec]").forEach(n =>
      n.classList.toggle("active", n.dataset.cdSpec === id));
  }

  function select(id, updateHash = true) {
    const s = specs.find(x => x.id === id) || specs[0];
    el("rail").innerHTML = railHTML(s.id);
    el("codex").innerHTML = profileHTML(s, { classLink: false });
    el("codex").setAttribute("aria-labelledby", "tab-" + s.id.split("/")[1]);
    decorateCodex();
    syncActive(s.id);
    buildSheet();
    if (updateHash) history.replaceState(null, "", location.pathname + location.search + "#" + s.id.split("/")[1]);
  }

  el("rail").addEventListener("click", e => {
    const card = e.target.closest("[data-sel]");
    if (card) select(card.dataset.sel);
  });
  el("rail").addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const cur = specs.findIndex(s => location.hash.slice(1) === s.id.split("/")[1]);
    const i = Math.max(0, cur);
    const next = specs[(i + (e.key === "ArrowRight" ? 1 : specs.length - 1)) % specs.length];
    select(next.id);
    document.getElementById("tab-" + next.id.split("/")[1])?.focus();
  });

  // Seal nodes and sheet cards are spec switches.
  document.addEventListener("click", e => {
    const node = e.target.closest("[data-cd-spec]");
    if (node) { select(node.dataset.cdSpec); closeSheet(); return; }
    const eye = e.target.closest(".ry-eye-btn");
    if (eye) {
      const sc = eye.closest(".ry-block").querySelector(".ry-screen");
      sc.hidden = !sc.hidden;
      eye.setAttribute("aria-expanded", String(!sc.hidden));
      eye.classList.toggle("on", !sc.hidden);
    }
  });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.("[data-cd-spec]")) {
      e.preventDefault();
      e.target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  // ---------- phone: detached seal plate + "All N specializations" sheet ----------

  const sealStage = el("mast").querySelector(".cd-stage.cd-seal");
  let sealPlate = null;
  function applySealPlacement() {
    if (!sealStage) return;
    if (phone.matches) {
      if (!sealPlate) {
        sealPlate = document.createElement("section");
        sealPlate.className = "plate ph-seal-plate";
        sealPlate.setAttribute("aria-label", "Class engine diagram");
        el("mast").insertAdjacentElement("afterend", sealPlate);
      }
      sealPlate.appendChild(sealStage);
      sealPlate.hidden = false;
    } else if (sealPlate) {
      el("mast").appendChild(sealStage);
      sealPlate.hidden = true;
    }
  }
  // Authored seals with a tightened 420×224 phone arrangement swap drawings here.
  const SEAL_SWAP = {
    "cultist": { desktop: ["0 0 420 260", CULTIST_DESKTOP], phone: ["0 0 420 224", CULTIST_PHONE] },
    "knight-of-xoroth": { desktop: ["0 0 420 260", KOX_DESKTOP], phone: ["0 0 420 224", KOX_PHONE] },
  };
  function applySeal() {
    const swap = SEAL_SWAP[cSlug];
    if (!swap || !sealStage) return;
    const svg = sealStage.querySelector("svg");
    const wantPhone = phone.matches;
    if (wantPhone === (sealStage.dataset.phone === "1")) return;
    const [viewBox, art] = wantPhone ? swap.phone : swap.desktop;
    svg.setAttribute("viewBox", viewBox);
    svg.innerHTML = art;
    sealStage.dataset.phone = wantPhone ? "1" : "0";
    syncActive(el("rail").querySelector(".rail-card.sel")?.dataset.sel);
  }

  el("rail").insertAdjacentHTML("afterend",
    `<button class="ph-all-btn" type="button" aria-haspopup="dialog">All ${specs.length} specializations ▾</button>
     <div class="ph-backdrop"></div>
     <div class="ph-sheet" role="dialog" aria-label="Choose a specialization"><div class="grip"></div>
       <h4>${esc(klass)} · specializations</h4><div class="ph-sheet-cards"></div></div>`);
  const sheetCards = document.querySelector(".ph-sheet-cards");
  const allBtn = document.querySelector(".ph-all-btn");
  function buildSheet() {
    if (!sheetCards) return;
    sheetCards.innerHTML = specs.map(s =>
      `<div class="rail-card ry-card2 ry-card3" data-cd-spec="${s.id}" role="button" tabindex="0"
        style="--class-color:${s.color}">${cardBody(s)}</div>`).join("");
    syncActive(el("rail").querySelector(".rail-card.sel")?.dataset.sel);
  }
  const closeSheet = () => document.body.classList.remove("ph-sheet-open");
  allBtn.addEventListener("click", () => { document.body.classList.add("ph-sheet-open"); syncActive(el("rail").querySelector(".rail-card.sel")?.dataset.sel); });
  document.querySelector(".ph-backdrop").addEventListener("click", closeSheet);
  addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  phone.addEventListener("change", () => { applySealPlacement(); applySeal(); applyStrips(); });

  // ---------- boot ----------
  const wanted = cSlug + "/" + location.hash.slice(1);
  select(specs.some(s => s.id === wanted) ? wanted : specs[0].id, !!location.hash);
  applySealPlacement();
  applySeal();
})();
