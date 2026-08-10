/* The class page, as ruled (class-page-grammar.md).
   URL contract: class.html?c=<class-slug>[&from=choose|guided]#<spec-slug>

   This is the BAKED ruled state — no study switchers, no variant query params.
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
  // The two-register role lines (RULED 2026-08-10, design-pass round 3): the
  // Atlas card's S1 form arrives here — jobs line, then ranges on their own
  // fainter line, card order and card join. Amends the one-line law to one
  // line PER register; the Sun Cleric tight guard retires (jobs fit at 390).
  function roleLines() {
    const counts = {};
    specs.forEach(s => s.roles
      .filter(r => r !== "Support" || !s.roles.includes("Healer"))
      .forEach(r => { counts[r] = (counts[r] || 0) + 1; }));
    const jobs = Object.entries(counts).map(([r, n]) => n > 1 ? `${r} ×${n}` : r);
    const ranges = ["Melee", "Hybrid", "Ranged"].filter(r => specs.some(s => s.range.includes(r)));
    return `<div class="cp-roles">${jobs.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="cp-roles cp-ranges">${esc(ranges.join(ranges.length > 2 ? " · " : " & "))}</div>`;
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
    ${roleLines()}
    ${thumbsHTML()}`;
  el("mast").style.setProperty("--class-color", color);
  document.body.classList.add("ry-e-col", "ry-v-t1", "ry-glow", "ry-k-airfam");
  // (The Sun Cleric tight guard retired with the two-register lines, 2026-08-10:
  // the jobs line alone fits full-size at 390 for every class.)

  // One-line name law (RULED 2026-08-10, design-pass round 1): the class name
  // never wraps, at any width. Measure the rendered name and scale only one
  // that overflows — the same self-correcting idea as the role-line guard.
  const nameEl = el("mast").querySelector("h1");
  const fitName = () => {
    if (!nameEl) return;
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
  // The codex fills after this runs, so the scrollbar can arrive late and
  // narrow the h1 without a resize event. The observer re-fits on any size
  // change; the frame and load re-checks close the remaining timing window.
  if (window.ResizeObserver) new ResizeObserver(fitName).observe(nameEl);
  requestAnimationFrame(fitName);
  window.addEventListener("load", fitName);

  // Blocked-CDN fallback (RULED 2026-08-10, design-pass round 4): managed
  // networks block i.ytimg.com, so a thumb whose image fails marks its anchor
  // .noimg and class-page.css renders it as a labeled link instead. A load
  // error can fire before this wiring runs; complete-but-broken imgs
  // (naturalWidth 0) are caught by the explicit check.
  const wireThumbs = () => document.querySelectorAll(
    ".ry-thumb img, .ph-thumb img, .guide-row img").forEach(img => {
    if (img.dataset.fb) return;
    img.dataset.fb = "1";
    const fail = () => img.closest("a").classList.add("noimg");
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });
  wireThumbs();
  new MutationObserver(wireThumbs).observe(el("codex"), { childList: true, subtree: true });

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



  // Chronomancer: three concentric clock faces, one per spec — ten ticks, four
  // quadrant notches, scattered shards — hands deliberately unaligned. The center
  // loop is Rewind, the only thing the clocks share (packet: seal_concept, batch 1).
  const cmNodes = [
    { id: "chronomancer/infinite", name: "Infinite", verb: "RAMP", tag: "10", x: 73, y: 66 },
    { id: "chronomancer/artificer", name: "Artificer", verb: "INVEST", tag: "FRAGMENTS", x: 347, y: 66 },
    { id: "chronomancer/time", name: "Time", verb: "TUNE", tag: "4 AEONS", x: 210, y: 206 },
  ];
  const CM_DEFS = `<defs>
      <filter id="cmGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const cmNodeSvg = (s, ny, vy) => `<g class="cd-node cm-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="cm-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const CM_DESKTOP = `<title id="cm-seal-title">Three clocks with unaligned hands, sharing only the Rewind at their center</title>
    ${CM_DEFS}
    <circle class="cm-ring" cx="210" cy="108" r="38"/><circle class="cm-ring" cx="210" cy="108" r="53"/><circle class="cm-ring" cx="210" cy="108" r="68"/><line class="cm-tick" x1="210.0" y1="75.0" x2="210.0" y2="70.0"/><line class="cm-tick" x1="229.4" y1="81.3" x2="232.3" y2="77.3"/><line class="cm-tick" x1="241.4" y1="97.8" x2="246.1" y2="96.3"/><line class="cm-tick" x1="241.4" y1="118.2" x2="246.1" y2="119.7"/><line class="cm-tick" x1="229.4" y1="134.7" x2="232.3" y2="138.7"/><line class="cm-tick" x1="210.0" y1="141.0" x2="210.0" y2="146.0"/><line class="cm-tick" x1="190.6" y1="134.7" x2="187.7" y2="138.7"/><line class="cm-tick" x1="178.6" y1="118.2" x2="173.9" y2="119.7"/><line class="cm-tick" x1="178.6" y1="97.8" x2="173.9" y2="96.3"/><line class="cm-tick" x1="190.6" y1="81.3" x2="187.7" y2="77.3"/><line class="cm-notch" x1="210.0" y1="63.0" x2="210.0" y2="55.0"/><line class="cm-notch" x1="255.0" y1="108.0" x2="263.0" y2="108.0"/><line class="cm-notch" x1="210.0" y1="153.0" x2="210.0" y2="161.0"/><line class="cm-notch" x1="165.0" y1="108.0" x2="157.0" y2="108.0"/><path class="cm-shard" d="M233.3 40.1 L236.5 44.1 L233.3 48.1 L230.10000000000002 44.1 Z"/><path class="cm-shard" d="M275.7 86.4 L278.9 90.4 L275.7 94.4 L272.5 90.4 Z"/><path class="cm-shard" d="M262.1 147.7 L265.3 151.7 L262.1 155.7 L258.90000000000003 151.7 Z"/><path class="cm-shard" d="M186.7 167.9 L189.89999999999998 171.9 L186.7 175.9 L183.5 171.9 Z"/><path class="cm-shard" d="M143.0 115.8 L146.2 119.8 L143.0 123.8 L139.8 119.8 Z"/><path class="cm-shard" d="M171.0 48.3 L174.2 52.3 L171.0 56.3 L167.8 52.3 Z"/><line class="cm-hand" x1="229.7" y1="94.2" x2="239.5" y2="87.4"/><line class="cm-hand" x1="184.9" y1="137.9" x2="177.2" y2="147.1"/><line class="cm-hand" x1="183.0" y1="61.2" x2="177.0" y2="50.8"/><circle class="cm-core" cx="210" cy="108" r="7"/>
    <path class="cm-link" d="M162 82 L102 70"/><path class="cm-link" d="M258 82 L318 70"/>
    <path class="cm-link" d="M210 176 L210 177"/>
    <text class="cm-center-label" x="210" y="104" text-anchor="middle">THREE CLOCKS</text>
    <text class="cm-center-sub" x="210" y="116" text-anchor="middle">REWIND · THE CLONE AT 40 s</text>
    <text class="cm-legend" x="16" y="22">HANDS DISAGREE · NO SHARED BAR</text>
    ${cmNodes.map(s => cmNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const CM_PHONE_NODES = cmNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const CM_PHONE = `<title id="cm-seal-title">Three clocks with unaligned hands, sharing only the Rewind at their center</title>
    ${CM_DEFS}
    <circle class="cm-ring" cx="210" cy="94" r="32"/><circle class="cm-ring" cx="210" cy="94" r="45"/><circle class="cm-ring" cx="210" cy="94" r="58"/><line class="cm-tick" x1="210.0" y1="67.0" x2="210.0" y2="62.0"/><line class="cm-tick" x1="225.9" y1="72.2" x2="228.8" y2="68.1"/><line class="cm-tick" x1="235.7" y1="85.7" x2="240.4" y2="84.1"/><line class="cm-tick" x1="235.7" y1="102.3" x2="240.4" y2="103.9"/><line class="cm-tick" x1="225.9" y1="115.8" x2="228.8" y2="119.9"/><line class="cm-tick" x1="210.0" y1="121.0" x2="210.0" y2="126.0"/><line class="cm-tick" x1="194.1" y1="115.8" x2="191.2" y2="119.9"/><line class="cm-tick" x1="184.3" y1="102.3" x2="179.6" y2="103.9"/><line class="cm-tick" x1="184.3" y1="85.7" x2="179.6" y2="84.1"/><line class="cm-tick" x1="194.1" y1="72.2" x2="191.2" y2="68.1"/><line class="cm-notch" x1="210.0" y1="57.0" x2="210.0" y2="49.0"/><line class="cm-notch" x1="247.0" y1="94.0" x2="255.0" y2="94.0"/><line class="cm-notch" x1="210.0" y1="131.0" x2="210.0" y2="139.0"/><line class="cm-notch" x1="173.0" y1="94.0" x2="165.0" y2="94.0"/><path class="cm-shard" d="M229.8 35.5 L233.0 39.5 L229.8 43.5 L226.60000000000002 39.5 Z"/><path class="cm-shard" d="M266.0 75.0 L269.2 79.0 L266.0 83.0 L262.8 79.0 Z"/><path class="cm-shard" d="M254.4 127.30000000000001 L257.6 131.3 L254.4 135.3 L251.20000000000002 131.3 Z"/><path class="cm-shard" d="M190.2 144.5 L193.39999999999998 148.5 L190.2 152.5 L187.0 148.5 Z"/><path class="cm-shard" d="M152.9 100.1 L156.1 104.1 L152.9 108.1 L149.70000000000002 104.1 Z"/><path class="cm-shard" d="M176.7 42.5 L179.89999999999998 46.5 L176.7 50.5 L173.5 46.5 Z"/><line class="cm-hand" x1="224.7" y1="83.7" x2="234.6" y2="76.8"/><line class="cm-hand" x1="190.1" y1="117.7" x2="182.4" y2="126.9"/><line class="cm-hand" x1="188.0" y1="55.9" x2="182.0" y2="45.5"/><circle class="cm-core" cx="210" cy="94" r="7"/>
    <path class="cm-link" d="M168 72 L102 62"/><path class="cm-link" d="M252 72 L318 62"/>
    <path class="cm-link" d="M210 152 L210 149"/>
    <text class="cm-center-label" x="210" y="90" text-anchor="middle">THREE CLOCKS</text>
    <text class="cm-center-sub" x="210" y="102" text-anchor="middle">REWIND · THE CLONE AT 40 s</text>
    <text class="cm-legend" x="14" y="218">HANDS DISAGREE · NO SHARED BAR</text>
    ${CM_PHONE_NODES.map(s => cmNodeSvg(s, 33, 44)).join("")}`;


  // Starcaller: the empty socket — Scattered Stars never sit with the caster. Four
  // lances run outward to starred enemy rings, one per spec, each tagged with what
  // consumption pays back (packet: seal_concept, batch 1).
  const scNodes = [
    { id: "starcaller/moon-guard", name: "Moon Guard", verb: "SWEEP", tag: "8", x: 73, y: 64 },
    { id: "starcaller/moon-priest", name: "Moon Priest", verb: "REAP", tag: "5", x: 347, y: 64 },
    { id: "starcaller/sentinel", name: "Sentinel", verb: "COUNT", tag: "8TH", x: 73, y: 196 },
    { id: "starcaller/warden", name: "Warden", verb: "CHAIN", tag: "4→6", x: 347, y: 196 },
  ];
  const SC_DEFS = `<defs>
      <filter id="scGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const scNodeSvg = (s, ny, vy) => `<g class="cd-node sc-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="sc-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const scLance = (sx, sy, nx, ny, mx, my) => `<path class="sc-lance" d="M${sx} ${sy} L${nx} ${ny}"/>
      <circle class="sc-enemy" cx="${mx}" cy="${my}" r="10"/>
      <g class="sc-star" transform="translate(${{mx}} ${{my}}) scale(1)"><path d="M0 -8 L2.2 -2.2 L8 0 L2.2 2.2 L0 8 L-2.2 2.2 L-8 0 L-2.2 -2.2 Z"/></g>`;
  const SC_DESKTOP = `<title id="sc-seal-title">Scattered Stars: an empty socket, four lances planted on the enemy and dragged home</title>
    ${SC_DEFS}
    <circle class="sc-socket" cx="210" cy="118" r="15"/>
    ${[0,1,2,3].map(i => {
      const n = scNodes[i];
      const mx = 210 + (n.x - 210) * 0.55, my = 118 + (n.y - 118) * 0.55;
      return `<path class="sc-lance" d="M210 118 L${n.x} ${n.y}"/>
        <circle class="sc-enemy" cx="${mx}" cy="${my}" r="10"/>
        <g class="sc-star" transform="translate(${mx} ${my})"><path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/></g>`;
    }).join("")}
    <text class="sc-threshold" x="210" y="34" text-anchor="middle">4 · THEIRS</text>
    <text class="sc-threshold" x="210" y="230" text-anchor="middle">SPEND · YOURS</text>
    <text class="sc-center-label" x="210" y="152" text-anchor="middle">SCATTERED STARS</text>
    <text class="sc-center-sub" x="210" y="164" text-anchor="middle">SPEND TO BE PAID · 30 s</text>
    <text class="sc-legend" x="16" y="22">STARS LIVE ON THE ENEMY</text>
    ${scNodes.map(s => scNodeSvg(s, 42, 54)).join("")}`;
  const SC_PHONE_NODES = scNodes.map(s => ({ ...s, y: s.y < 150 ? 56 : 167 }));
  const SC_PHONE = `<title id="sc-seal-title">Scattered Stars: an empty socket, four lances planted on the enemy and dragged home</title>
    ${SC_DEFS}
    <circle class="sc-socket" cx="210" cy="110" r="13"/>
    ${[0,1,2,3].map(i => {
      const n = SC_PHONE_NODES[i];
      const mx = 210 + (n.x - 210) * 0.55, my = 110 + (n.y - 110) * 0.55;
      return `<path class="sc-lance" d="M210 110 L${n.x} ${n.y}"/>
        <circle class="sc-enemy" cx="${mx}" cy="${my}" r="9"/>
        <g class="sc-star" transform="translate(${mx} ${my})"><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/></g>`;
    }).join("")}
    <text class="sc-threshold" x="210" y="26" text-anchor="middle">4 · THEIRS</text>
    <text class="sc-threshold" x="210" y="196" text-anchor="middle">SPEND · YOURS</text>
    <text class="sc-center-label" x="210" y="138" text-anchor="middle">SCATTERED STARS</text>
    <text class="sc-center-sub" x="210" y="149" text-anchor="middle">SPEND TO BE PAID · 30 s</text>
    <text class="sc-legend" x="14" y="20">STARS LIVE ON THE ENEMY</text>
    ${SC_PHONE_NODES.map(s => scNodeSvg(s, 33, 44)).join("")}`;


  // Sun Cleric: a sun on the horizon rule — Solar Power builds below the line, the
  // Dawn window burns above it, ten rays as the Fulfillment counter (packet, batch 2).
  const suNodes = [
    { id: "sun-cleric/piety", name: "Piety", verb: "ALTERNATE", tag: "2 STATES", x: 73, y: 64 },
    { id: "sun-cleric/blessings", name: "Blessings", verb: "RELAY", tag: "5 ALLIES", x: 347, y: 64 },
    { id: "sun-cleric/seraphim", name: "Seraphim", verb: "HARDEN", tag: "5 × 2%", x: 73, y: 196 },
    { id: "sun-cleric/valkyrie", name: "Valkyrie", verb: "DOUBLE", tag: "5 × 10%", x: 347, y: 196 },
  ];
  const SU_DEFS = `<defs>
      <radialGradient id="suSun"><stop offset="0" stop-color="#fff3c9"/><stop offset=".55" stop-color="#ffd54f"/><stop offset="1" stop-color="#7a5c14"/></radialGradient>
      <filter id="suGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const suNodeSvg = (s, ny, vy) => `<g class="cd-node su-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="su-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const suRays = (cx, cy, r1, r2) => Array.from({ length: 10 }, (_, i) => {
    const a = Math.PI * (1.08 + (i * 0.86) / 9);
    const x1 = cx + r1 * Math.cos(a), y1 = cy + r1 * Math.sin(a);
    const x2 = cx + r2 * Math.cos(a), y2 = cy + r2 * Math.sin(a);
    return `<line class="su-ray" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join("");
  const suSun = (cx, cy, r) => `
    <path class="su-upper" d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z"/>
    <path class="su-lower" d="M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx + r} ${cy} Z"/>`;
  const SU_DESKTOP = `<title id="su-seal-title">Dawn on the horizon: Solar Power builds below the line, ten Fulfillments burn above it</title>
    ${SU_DEFS}
    <line class="su-horizon" x1="120" y1="118" x2="300" y2="118"/>
    ${suSun(210, 118, 34)}${suRays(210, 118, 40, 52)}
    <text class="su-threshold" x="130" y="98" text-anchor="middle">SOLAR · BUILD</text>
    <text class="su-threshold" x="290" y="44" text-anchor="middle">10 · FULFILL</text>
    <path class="su-link" d="M176 96 L102 72"/><path class="su-link" d="M244 96 L318 72"/>
    <path class="su-link" d="M176 140 L102 188"/><path class="su-link" d="M244 140 L318 188"/>
    <text class="su-center-label" x="210" y="168" text-anchor="middle">DAWN</text>
    <text class="su-center-sub" x="210" y="180" text-anchor="middle">ONE VOW · TEN FULFILLMENTS · 1 MIN</text>
    <text class="su-legend" x="16" y="22">THE LINE IS WHERE BUILDING STOPS</text>
    ${suNodes.map(s => suNodeSvg(s, 42, 54)).join("")}`;
  const SU_PHONE_NODES = suNodes.map(s => ({ ...s, y: s.y < 150 ? 56 : 167 }));
  const SU_PHONE = `<title id="su-seal-title">Dawn on the horizon: Solar Power builds below the line, ten Fulfillments burn above it</title>
    ${SU_DEFS}
    <line class="su-horizon" x1="130" y1="106" x2="290" y2="106"/>
    ${suSun(210, 106, 28)}${suRays(210, 106, 33, 44)}
    <text class="su-threshold" x="136" y="88" text-anchor="middle">SOLAR · BUILD</text>
    <text class="su-threshold" x="286" y="42" text-anchor="middle">10 · FULFILL</text>
    <path class="su-link" d="M182 88 L102 64"/><path class="su-link" d="M238 88 L318 64"/>
    <path class="su-link" d="M182 124 L102 160"/><path class="su-link" d="M238 124 L318 160"/>
    <text class="su-center-label" x="210" y="148" text-anchor="middle">DAWN</text>
    <text class="su-center-sub" x="210" y="159" text-anchor="middle">ONE VOW · TEN FULFILLMENTS</text>
    <text class="su-legend" x="14" y="20">THE LINE IS WHERE BUILDING STOPS</text>
    ${SU_PHONE_NODES.map(s => suNodeSvg(s, 33, 44)).join("")}`;

  // Templar: the Oath Chain as a clock of links — one snapped open and spilling,
  // one welded shut, a sweep hand running the timer down (packet, batch 2).
  const tpNodes = [
    { id: "templar/crusader", name: "Crusader", verb: "RENEW", tag: "+3s", x: 73, y: 66 },
    { id: "templar/zealot", name: "Zealot", verb: "TALLY", tag: "10", x: 347, y: 66 },
    { id: "templar/oathkeeper", name: "Oathkeeper", verb: "KEEP", tag: "KEEP", x: 210, y: 206 },
  ];
  const TP_DEFS = `<defs>
      <filter id="tpGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const tpNodeSvg = (s, ny, vy) => `<g class="cd-node tp-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="tp-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const tpChain = (cx, cy, r, n) => Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n - Math.PI / 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    const rot = (a * 180 / Math.PI + 90).toFixed(1);
    if (i === 2) return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">
      <path class="tp-link open" d="M-8 -3 A 8 6 0 0 1 8 -3"/><path class="tp-link open" d="M-8 3 A 8 6 0 0 0 8 3"/>
      <line class="tp-spill" x1="0" y1="6" x2="0" y2="20"/></g>`;
    if (i === 8) return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})">
      <ellipse class="tp-link weld" rx="8" ry="6"/><line class="tp-weldbar" x1="-5" y1="0" x2="5" y2="0"/></g>`;
    return `<ellipse class="tp-link" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})" rx="8" ry="6"/>`;
  }).join("");
  const TP_DESKTOP = `<title id="tp-seal-title">The Oath Chain: a clock of sworn links — break them for payoff, or keep every one</title>
    ${TP_DEFS}
    ${tpChain(210, 112, 58, 12)}
    <line class="tp-hand" x1="210" y1="112" x2="243" y2="74"/>
    <circle class="tp-hub" cx="210" cy="112" r="5"/>
    <text class="tp-threshold" x="118" y="34" text-anchor="middle">HOLD · BUFF</text>
    <text class="tp-threshold" x="302" y="34" text-anchor="middle">BREAK · PAYOFF</text>
    <path class="tp-linkline" d="M160 86 L102 72"/><path class="tp-linkline" d="M260 86 L318 72"/>
    <path class="tp-linkline" d="M210 170 L210 177"/>
    <text class="tp-center-label" x="210" y="132" text-anchor="middle">OATH CHAIN</text>
    <text class="tp-center-sub" x="210" y="144" text-anchor="middle">THE TIMER RUNS · OATH FLOW +2 s</text>
    <text class="tp-legend" x="16" y="22">EVERY LINK IS A BUFF YOU WEAR</text>
    ${tpNodes.map(s => tpNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const TP_PHONE_NODES = tpNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const TP_PHONE = `<title id="tp-seal-title">The Oath Chain: a clock of sworn links — break them for payoff, or keep every one</title>
    ${TP_DEFS}
    ${tpChain(210, 96, 46, 12)}
    <line class="tp-hand" x1="210" y1="96" x2="237" y2="65"/>
    <circle class="tp-hub" cx="210" cy="96" r="4"/>
    <text class="tp-threshold" x="118" y="26" text-anchor="middle">HOLD · BUFF</text>
    <text class="tp-threshold" x="302" y="26" text-anchor="middle">BREAK · PAYOFF</text>
    <path class="tp-linkline" d="M170 76 L102 62"/><path class="tp-linkline" d="M250 76 L318 62"/>
    <path class="tp-linkline" d="M210 142 L210 149"/>
    <text class="tp-center-label" x="210" y="114" text-anchor="middle">OATH CHAIN</text>
    <text class="tp-center-sub" x="210" y="125" text-anchor="middle">OATH FLOW +2 s</text>
    <text class="tp-legend" x="14" y="20">EVERY LINK IS A BUFF YOU WEAR</text>
    ${TP_PHONE_NODES.map(s => tpNodeSvg(s, 33, 44)).join("")}`;


  // Ranger: the drawn bowstring — five notches to full draw, where the arrow forks
  // into a heavy head (harder) and a second-ruled shaft (longer) (packet, batch 2).
  const rgNodes = [
    { id: "ranger/farstrider", name: "Farstrider", verb: "CALL", tag: "+2", x: 73, y: 66 },
    { id: "ranger/archery", name: "Archery", verb: "EXTEND", tag: "4s", x: 347, y: 66 },
    { id: "ranger/brigand", name: "Brigand", verb: "MARK", tag: "8s", x: 210, y: 206 },
  ];
  const RG_DEFS = `<defs>
      <filter id="rgGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <marker id="rgArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#aad372"/></marker>
    </defs>`;
  const rgNodeSvg = (s, ny, vy) => `<g class="cd-node rg-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="rg-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const RG_DESKTOP = `<title id="rg-seal-title">Advantage as a drawn bowstring: five notches to full draw, then harder or longer</title>
    ${RG_DEFS}
    <path class="rg-limb" d="M86 82 Q 210 46 334 82"/>
    <path class="rg-string" d="M86 88 L210 138 L334 88"/>
    ${[1,2,3,4,5].map(i => {
      const t = i / 5.5, x = 86 + (210 - 86) * t, y = 88 + (138 - 88) * t;
      return `<line class="rg-notch${i === 5 ? " full" : ""}" x1="${(x - 4).toFixed(1)}" y1="${(y - 6).toFixed(1)}" x2="${(x + 4).toFixed(1)}" y2="${(y + 2).toFixed(1)}"/>`;
    }).join("")}
    <path class="rg-shaft heavy" d="M210 138 L262 106" marker-end="url(#rgArr)"/>
    <path class="rg-shaft long" d="M210 138 L330 138"/>
    ${[0,1,2,3].map(i => `<line class="rg-sec" x1="${240 + i * 24}" y1="134" x2="${240 + i * 24}" y2="142"/>`).join("")}
    <text class="rg-threshold" x="140" y="40" text-anchor="middle">5 · HARDER</text>
    <text class="rg-threshold" x="286" y="40" text-anchor="middle">5 · LONGER</text>
    <text class="rg-center-label" x="210" y="170" text-anchor="middle">ADVANTAGE</text>
    <text class="rg-center-sub" x="210" y="182" text-anchor="middle">FIVE NOTCHES · FULL DRAW</text>
    <text class="rg-legend" x="16" y="22">EVERY SHOT DRAWS THE STRING</text>
    ${rgNodes.map(s => rgNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const RG_PHONE_NODES = rgNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const RG_PHONE = `<title id="rg-seal-title">Advantage as a drawn bowstring: five notches to full draw, then harder or longer</title>
    ${RG_DEFS}
    <path class="rg-limb" d="M100 70 Q 210 42 320 70"/>
    <path class="rg-string" d="M100 76 L210 118 L320 76"/>
    ${[1,2,3,4,5].map(i => {
      const t = i / 5.5, x = 100 + (210 - 100) * t, y = 76 + (118 - 76) * t;
      return `<line class="rg-notch${i === 5 ? " full" : ""}" x1="${(x - 4).toFixed(1)}" y1="${(y - 5).toFixed(1)}" x2="${(x + 4).toFixed(1)}" y2="${(y + 2).toFixed(1)}"/>`;
    }).join("")}
    <path class="rg-shaft heavy" d="M210 118 L254 92" marker-end="url(#rgArr)"/>
    <path class="rg-shaft long" d="M210 118 L316 118"/>
    ${[0,1,2].map(i => `<line class="rg-sec" x1="${238 + i * 24}" y1="114" x2="${238 + i * 24}" y2="122"/>`).join("")}
    <text class="rg-threshold" x="140" y="32" text-anchor="middle">5 · HARDER</text>
    <text class="rg-threshold" x="286" y="32" text-anchor="middle">5 · LONGER</text>
    <text class="rg-center-label" x="210" y="146" text-anchor="middle">ADVANTAGE</text>
    <text class="rg-center-sub" x="210" y="157" text-anchor="middle">FIVE NOTCHES · FULL DRAW</text>
    <text class="rg-legend" x="14" y="20">EVERY SHOT DRAWS THE STRING</text>
    ${RG_PHONE_NODES.map(s => rgNodeSvg(s, 33, 44)).join("")}`;

  // Felsworn: two crossed glaives, paired notches climbing to six, and the Inner
  // Demon aperture burning open where the blades cross (packet, batch 2).
  const fsNodes = [
    { id: "felsworn/slayer", name: "Slayer", verb: "CLEAVE", tag: "3E", x: 73, y: 66 },
    { id: "felsworn/infernal", name: "Infernal", verb: "CASCADE", tag: "20E", x: 347, y: 66 },
    { id: "felsworn/tyrant", name: "Tyrant", verb: "BRACE", tag: "20%", x: 210, y: 206 },
  ];
  const FS_DEFS = `<defs>
      <radialGradient id="fsEye"><stop offset="0" stop-color="#e6ffb0"/><stop offset=".5" stop-color="#a95be0"/><stop offset="1" stop-color="#1d0f28"/></radialGradient>
      <filter id="fsGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const fsNodeSvg = (s, ny, vy) => `<g class="cd-node fs-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="fs-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const fsPairs = (x1, y1, x2, y2) => [0.3, 0.5, 0.7].map(t => {
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    const dx = (y2 - y1), dy = -(x2 - x1);
    const n = Math.hypot(dx, dy), ux = dx / n * 6, uy = dy / n * 6;
    return `<line class="fs-pair" x1="${(x - ux).toFixed(1)}" y1="${(y - uy).toFixed(1)}" x2="${(x + ux).toFixed(1)}" y2="${(y + uy).toFixed(1)}"/>
      <line class="fs-pair" x1="${(x - ux + (x2-x1)/n*7).toFixed(1)}" y1="${(y - uy + (y2-y1)/n*7).toFixed(1)}" x2="${(x + ux + (x2-x1)/n*7).toFixed(1)}" y2="${(y + uy + (y2-y1)/n*7).toFixed(1)}"/>`;
  }).join("");
  const FS_DESKTOP = `<title id="fs-seal-title">Felfury on crossed glaives: three pairs to six, and Inner Demon burning open at the crossing</title>
    ${FS_DEFS}
    <line class="fs-glaive" x1="126" y1="46" x2="294" y2="178"/>
    <line class="fs-glaive" x1="294" y1="46" x2="126" y2="178"/>
    ${fsPairs(210, 112, 132, 51)}${fsPairs(210, 112, 288, 51)}
    <path class="fs-eye" d="M210 88 C 222 100 222 124 210 136 C 198 124 198 100 210 88 Z"/>
    <circle class="fs-pupil" cx="210" cy="112" r="4"/>
    <text class="fs-threshold" x="118" y="34" text-anchor="middle">2 · SPEND</text>
    <text class="fs-threshold" x="302" y="34" text-anchor="middle">6 · OPEN</text>
    <path class="fs-link" d="M150 65 L102 66"/><path class="fs-link" d="M270 65 L318 66"/>
    <path class="fs-link" d="M210 168 L210 177"/>
    <text class="fs-center-label" x="210" y="160" text-anchor="middle">FELFURY</text>
    <text class="fs-center-sub" x="210" y="172" text-anchor="middle">SIX BANKED OPENS THE DEMON · 50 ENERGY BACK</text>
    <text class="fs-legend" x="16" y="22">SPEND IN PAIRS · CRITS HOLD IT OPEN</text>
    ${fsNodes.map(s => fsNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const FS_PHONE_NODES = fsNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const FS_PHONE = `<title id="fs-seal-title">Felfury on crossed glaives: three pairs to six, and Inner Demon burning open at the crossing</title>
    ${FS_DEFS}
    <line class="fs-glaive" x1="140" y1="42" x2="280" y2="152"/>
    <line class="fs-glaive" x1="280" y1="42" x2="140" y2="152"/>
    ${fsPairs(210, 97, 146, 47)}${fsPairs(210, 97, 274, 47)}
    <path class="fs-eye" d="M210 77 C 220 87 220 107 210 117 C 200 107 200 87 210 77 Z"/>
    <circle class="fs-pupil" cx="210" cy="97" r="3.4"/>
    <text class="fs-threshold" x="118" y="28" text-anchor="middle">2 · SPEND</text>
    <text class="fs-threshold" x="302" y="28" text-anchor="middle">6 · OPEN</text>
    <path class="fs-link" d="M158 60 L102 58"/><path class="fs-link" d="M262 60 L318 58"/>
    <path class="fs-link" d="M210 140 L210 149"/>
    <text class="fs-center-label" x="210" y="136" text-anchor="middle">FELFURY</text>
    <text class="fs-center-sub" x="210" y="147" text-anchor="middle">SIX BANKED OPENS THE DEMON</text>
    <text class="fs-legend" x="14" y="20">SPEND IN PAIRS · CRITS HOLD IT OPEN</text>
    ${FS_PHONE_NODES.map(s => fsNodeSvg(s, 33, 44)).join("")}`;


  // Barbarian: a segmented iron Energy gauge with one wedge gap — Enrage — cut at
  // its crown; every spec's line passes through the gap (packet, batch 3).
  const baNodes = [
    { id: "barbarian/brutality", name: "Brutality", verb: "HOARD", tag: "2× ENERGY", x: 73, y: 66 },
    { id: "barbarian/headhunting", name: "Headhunting", verb: "RESET", tag: "3 AXES", x: 347, y: 66 },
    { id: "barbarian/ancestry", name: "Ancestry", verb: "POUR", tag: "TANKARD", x: 210, y: 206 },
  ];
  const BA_DEFS = `<defs>
      <filter id="baGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const baNodeSvg = (s, ny, vy) => `<g class="cd-node ba-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="ba-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const baRing = (cx, cy, r) => Array.from({ length: 10 }, (_, i) => {
    const a0 = -78 + i * 33.6, a1 = a0 + 26;
    const p0 = [cx + r * Math.cos(a0 * Math.PI / 180), cy + r * Math.sin(a0 * Math.PI / 180)];
    const p1 = [cx + r * Math.cos(a1 * Math.PI / 180), cy + r * Math.sin(a1 * Math.PI / 180)];
    return `<path class="ba-seg" d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}"/>`;
  }).join("");
  const BA_DESKTOP = `<title id="ba-seal-title">The Energy gauge with one gap: Enrage, and everything worth having beyond it</title>
    ${BA_DEFS}
    ${baRing(210, 122, 56)}
    <line class="ba-gapedge" x1="200" y1="68" x2="204" y2="82"/>
    <line class="ba-gapedge" x1="220" y1="68" x2="216" y2="82"/>
    <text class="ba-pct" x="210" y="92" text-anchor="middle">−30%</text>
    <path class="ba-link" d="M206 64 L96 70"/><path class="ba-link" d="M214 64 L324 70"/>
    <path class="ba-link" d="M210 64 C 260 40, 300 120, 210 177"/>
    <text class="ba-threshold" x="118" y="34" text-anchor="middle">ONE BAR · ENERGY</text>
    <text class="ba-threshold" x="300" y="34" text-anchor="middle">ONE SWITCH · ENRAGED</text>
    <text class="ba-center-label" x="210" y="126" text-anchor="middle">ENERGY</text>
    <text class="ba-center-sub" x="210" y="138" text-anchor="middle">ENRAGE OPENS THE GAP</text>
    <text class="ba-legend" x="16" y="22">HODIR'S WRATH REFILLS THE BAR</text>
    ${baNodes.map(s => baNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const BA_PHONE_NODES = baNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const BA_PHONE = `<title id="ba-seal-title">The Energy gauge with one gap: Enrage, and everything worth having beyond it</title>
    ${BA_DEFS}
    ${baRing(210, 104, 44)}
    <line class="ba-gapedge" x1="202" y1="62" x2="205" y2="73"/>
    <line class="ba-gapedge" x1="218" y1="62" x2="215" y2="73"/>
    <text class="ba-pct" x="210" y="83" text-anchor="middle">−30%</text>
    <path class="ba-link" d="M206 58 L96 60"/><path class="ba-link" d="M214 58 L324 60"/>
    <path class="ba-link" d="M210 58 C 254 38, 288 106, 210 149"/>
    <text class="ba-threshold" x="118" y="28" text-anchor="middle">ONE BAR · ENERGY</text>
    <text class="ba-threshold" x="300" y="28" text-anchor="middle">ONE SWITCH · ENRAGED</text>
    <text class="ba-center-label" x="210" y="108" text-anchor="middle">ENERGY</text>
    <text class="ba-center-sub" x="210" y="119" text-anchor="middle">ENRAGE OPENS THE GAP</text>
    <text class="ba-legend" x="14" y="20">HODIR'S WRATH REFILLS THE BAR</text>
    ${BA_PHONE_NODES.map(s => baNodeSvg(s, 33, 44)).join("")}`;

  // Bloodmage: a two-chambered heart drawn in one vein — the Mortal chamber hollow,
  // the Cursed chamber filled — with beaded vessels running to each spec (packet, batch 3).
  const bmNodes = [
    { id: "bloodmage/sanguine", name: "Sanguine", verb: "OVERDRAW", tag: "THIRST 10", x: 73, y: 64 },
    { id: "bloodmage/accursed", name: "Accursed", verb: "PROLONG", tag: "SHARDS 8", x: 347, y: 64 },
    { id: "bloodmage/fleshweaver", name: "Fleshweaver", verb: "LINK", tag: "POOL 10", x: 73, y: 196 },
    { id: "bloodmage/eternal", name: "Eternal", verb: "TRADE", tag: "THREAT 80%", x: 347, y: 196 },
  ];
  const BM_DEFS = `<defs>
      <filter id="bmGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const bmNodeSvg = (s, ny, vy) => `<g class="cd-node bm-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="bm-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const bmVessel = (x1, y1, x2, y2) => {
    const beads = [0.4, 0.6, 0.8].map(t => {
      const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
      return `<circle class="bm-bead" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`;
    }).join("");
    return `<path class="bm-vessel" d="M${x1} ${y1} L${x2} ${y2}"/>` + beads;
  };
  const BM_DESKTOP = `<title id="bm-seal-title">A two-chambered heart: the Mortal chamber hollow, the Cursed chamber filled, vessels beaded with each spec's counter</title>
    ${BM_DEFS}
    <path class="bm-heart mortal" d="M208 90 C 178 74 156 96 162 122 C 166 142 190 152 208 148 Z"/>
    <path class="bm-heart cursed" d="M212 90 C 242 74 264 96 258 122 C 254 142 230 152 212 148 Z"/>
    ${bmVessel(176, 96, 100, 72)}${bmVessel(244, 96, 320, 72)}
    ${bmVessel(176, 138, 100, 180)}${bmVessel(244, 138, 320, 180)}
    <text class="bm-threshold" x="118" y="34" text-anchor="middle">HEALTH · PAID</text>
    <text class="bm-threshold" x="302" y="34" text-anchor="middle">RAGE · EARNED</text>
    <text class="bm-center-label" x="210" y="170" text-anchor="middle">RAGE</text>
    <text class="bm-center-sub" x="210" y="182" text-anchor="middle">HEALTH IS THE SECOND COST</text>
    <text class="bm-legend" x="16" y="22">ONE CURSE · A FORM PER SPEC</text>
    ${bmNodes.map(s => bmNodeSvg(s, 42, 54)).join("")}`;
  const BM_PHONE_NODES = bmNodes.map(s => ({ ...s, y: s.y < 150 ? 56 : 167 }));
  const BM_PHONE = `<title id="bm-seal-title">A two-chambered heart: the Mortal chamber hollow, the Cursed chamber filled, vessels beaded with each spec's counter</title>
    ${BM_DEFS}
    <path class="bm-heart mortal" d="M208 78 C 182 64 164 82 169 104 C 172 120 192 129 208 126 Z"/>
    <path class="bm-heart cursed" d="M212 78 C 238 64 256 82 251 104 C 248 120 228 129 212 126 Z"/>
    ${bmVessel(180, 84, 104, 64)}${bmVessel(240, 84, 316, 64)}
    ${bmVessel(180, 118, 104, 152)}${bmVessel(240, 118, 316, 152)}
    <text class="bm-threshold" x="118" y="26" text-anchor="middle">HEALTH · PAID</text>
    <text class="bm-threshold" x="302" y="26" text-anchor="middle">RAGE · EARNED</text>
    <text class="bm-center-label" x="210" y="146" text-anchor="middle">RAGE</text>
    <text class="bm-center-sub" x="210" y="157" text-anchor="middle">HEALTH IS THE SECOND COST</text>
    <text class="bm-legend" x="14" y="20">ONE CURSE · A FORM PER SPEC</text>
    ${BM_PHONE_NODES.map(s => bmNodeSvg(s, 33, 44)).join("")}`;


  // Necromancer: the crypt floor from above — a ring of grave niches (1, 2, and 3
  // slots wide) around the sunken center; the roster IS the resource (packet, final batch).
  const ncNodes = [
    { id: "necromancer/death", name: "Death", verb: "CULTIVATE", tag: "15", x: 73, y: 66 },
    { id: "necromancer/rime", name: "Rime", verb: "FREEZE", tag: "FROZEN", x: 347, y: 66 },
    { id: "necromancer/animation", name: "Animation", verb: "MARSHAL", tag: "+3 LF", x: 210, y: 206 },
  ];
  const NC_DEFS = `<defs>
      <filter id="ncGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const ncNodeSvg = (s, ny, vy) => `<g class="cd-node nc-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="nc-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const ncNiches = (cx, cy, r) => {
    const widths = [1, 2, 1, 3, 1, 2, 1, 1];
    let a = -90;
    return widths.map(w => {
      const span = w * 16, mid = a + span / 2;
      a += span + 14;
      const rad = mid * Math.PI / 180;
      const x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      return `<rect class="nc-niche w${w}" x="${(x - w * 5).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="${w * 10}" height="12" rx="2"
        transform="rotate(${(mid + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join("");
  };
  const NC_DESKTOP = `<title id="nc-seal-title">The crypt floor: grave niches one, two, and three slots wide around the sunken center</title>
    ${NC_DEFS}
    <circle class="nc-floor" cx="210" cy="114" r="52"/>
    <circle class="nc-center" cx="210" cy="114" r="24"/>
    ${ncNiches(210, 114, 52)}
    <text class="nc-threshold" x="112" y="34" text-anchor="middle">LIFE FORCE · HELD</text>
    <text class="nc-threshold" x="306" y="34" text-anchor="middle">RUNIC POWER · SPENT</text>
    <path class="nc-link" d="M164 88 L102 72"/><path class="nc-link" d="M256 88 L318 72"/>
    <path class="nc-link" d="M210 166 L210 177"/>
    <text class="nc-center-label" x="210" y="110" text-anchor="middle">LIFE FORCE</text>
    <text class="nc-center-sub" x="210" y="122" text-anchor="middle">GHOUL 1 · MAGE 2 · GARGOYLE 3</text>
    <text class="nc-legend" x="16" y="22">THE ROSTER IS THE RESOURCE</text>
    ${ncNodes.map(s => ncNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const NC_PHONE_NODES = ncNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const NC_PHONE = `<title id="nc-seal-title">The crypt floor: grave niches one, two, and three slots wide around the sunken center</title>
    ${NC_DEFS}
    <circle class="nc-floor" cx="210" cy="98" r="42"/>
    <circle class="nc-center" cx="210" cy="98" r="19"/>
    ${ncNiches(210, 98, 42)}
    <text class="nc-threshold" x="112" y="26" text-anchor="middle">LIFE FORCE · HELD</text>
    <text class="nc-threshold" x="306" y="26" text-anchor="middle">RUNIC POWER · SPENT</text>
    <path class="nc-link" d="M172 76 L102 62"/><path class="nc-link" d="M248 76 L318 62"/>
    <path class="nc-link" d="M210 140 L210 149"/>
    <text class="nc-center-label" x="210" y="94" text-anchor="middle">LIFE FORCE</text>
    <text class="nc-center-sub" x="210" y="106" text-anchor="middle">GHOUL 1 · MAGE 2 · GARGOYLE 3</text>
    <text class="nc-legend" x="14" y="20">THE ROSTER IS THE RESOURCE</text>
    ${NC_PHONE_NODES.map(s => ncNodeSvg(s, 33, 44)).join("")}`;

  // Primalist: a split geode filled to a Rage line, one fault running edge to edge —
  // the shared Seismic cooldown — with a fissure per spec (packet, final batch).
  const prNodes = [
    { id: "primalist/primal", name: "Primal", verb: "REND", tag: "2", x: 73, y: 64 },
    { id: "primalist/geomancy", name: "Geomancy", verb: "AMASS", tag: "15", x: 347, y: 64 },
    { id: "primalist/life", name: "Life", verb: "SPLIT", tag: "20%", x: 73, y: 196 },
    { id: "primalist/mountain-king", name: "Mountain King", verb: "DEFLECT", tag: "5", x: 347, y: 196 },
  ];
  const PR_DEFS = `<defs>
      <linearGradient id="prRage" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#bc784c"/><stop offset="1" stop-color="#e8b489"/></linearGradient>
      <filter id="prGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const prNodeSvg = (s, ny, vy) => `<g class="cd-node pr-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="pr-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const PR_DESKTOP = `<title id="pr-seal-title">A split geode filled to the Rage line, one Seismic fault through it, a fissure per spec</title>
    ${PR_DEFS}
    <path class="pr-fault" d="M115 116 L305 116"/>
    <path class="pr-geode" d="M170 78 L250 78 L278 106 L266 148 L210 160 L154 148 L142 106 Z"/>
    <path class="pr-ragefill" d="M150 122 L270 122 L266 148 L210 160 L154 148 Z"/>
    <path class="pr-facet" d="M170 78 L210 116 L250 78 M142 106 L210 116 L278 106"/>
    <path class="pr-fissure" d="M142 112 C 120 96, 112 84, 100 74"/>
    <path class="pr-fissure" d="M278 112 C 300 96, 308 84, 320 74"/>
    <path class="pr-fissure" d="M148 124 C 124 146, 114 160, 102 172"/>
    <path class="pr-fissure" d="M272 124 C 296 146, 306 160, 318 172"/>
    <text class="pr-threshold" x="118" y="34" text-anchor="middle">BEAR · STRIKE</text>
    <text class="pr-threshold" x="302" y="34" text-anchor="middle">HAWK · CAST</text>
    <text class="pr-center-label" x="210" y="188" text-anchor="middle">RAGE</text>
    <text class="pr-center-sub" x="210" y="200" text-anchor="middle">ONE FAULT · EVERY SPEC BENDS IT</text>
    <text class="pr-legend" x="16" y="22">ONE BOON AT A TIME</text>
    ${prNodes.map(s => prNodeSvg(s, 42, 54)).join("")}`;
  const PR_PHONE_NODES = prNodes.map(s => ({ ...s, y: s.y < 150 ? 56 : 167 }));
  const PR_PHONE = `<title id="pr-seal-title">A split geode filled to the Rage line, one Seismic fault through it, a fissure per spec</title>
    ${PR_DEFS}
    <path class="pr-fault" d="M118 102 L302 102"/>
    <path class="pr-geode" d="M178 68 L242 68 L266 92 L256 128 L210 138 L164 128 L154 92 Z"/>
    <path class="pr-ragefill" d="M160 108 L260 108 L256 128 L210 138 L164 128 Z"/>
    <path class="pr-facet" d="M178 68 L210 102 L242 68 M154 92 L210 102 L266 92"/>
    <path class="pr-fissure" d="M154 98 C 132 84, 124 74, 108 66"/>
    <path class="pr-fissure" d="M266 98 C 288 84, 296 74, 312 66"/>
    <path class="pr-fissure" d="M160 110 C 136 130, 126 142, 110 152"/>
    <path class="pr-fissure" d="M260 110 C 284 130, 294 142, 310 152"/>
    <text class="pr-threshold" x="118" y="26" text-anchor="middle">BEAR · STRIKE</text>
    <text class="pr-threshold" x="302" y="26" text-anchor="middle">HAWK · CAST</text>
    <text class="pr-center-label" x="210" y="160" text-anchor="middle">RAGE</text>
    <text class="pr-center-sub" x="210" y="171" text-anchor="middle">ONE FAULT · EVERY SPEC BENDS IT</text>
    <text class="pr-legend" x="14" y="20">ONE BOON AT A TIME</text>
    ${PR_PHONE_NODES.map(s => prNodeSvg(s, 33, 44)).join("")}`;


  // Pyromancer: a brazier in cross-section — countable Ember coals in the bowl,
  // Heat rising as ticks that never fall back (packet, final batch).
  const pyNodes = [
    { id: "pyromancer/flameweaving", name: "Flameweaving", verb: "RESERVE", tag: "BANK", x: 73, y: 66 },
    { id: "pyromancer/incineration", name: "Incineration", verb: "RIPEN", tag: "BURNS", x: 347, y: 66 },
    { id: "pyromancer/draconic", name: "Draconic", verb: "INVOKE", tag: "×5", x: 210, y: 206 },
  ];
  const PY_DEFS = `<defs>
      <radialGradient id="pyCoal"><stop offset="0" stop-color="#ffd1a3"/><stop offset=".55" stop-color="#ff6638"/><stop offset="1" stop-color="#391309"/></radialGradient>
      <filter id="pyGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const pyNodeSvg = (s, ny, vy) => `<g class="cd-node py-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="py-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const pyHeat = (cx, base, n) => Array.from({ length: n }, (_, i) =>
    `<line class="py-heat" x1="${cx - 8 + (i % 2) * 16}" y1="${base - i * 11}" x2="${cx + 2 + (i % 2) * 16 - 10}" y2="${base - i * 11}"
      transform="rotate(${(i % 2 ? 8 : -8)} ${cx} ${base - i * 11})"/>`).join("");
  const PY_DESKTOP = `<title id="py-seal-title">The brazier: countable Embers in the bowl, Heat rising and never falling back</title>
    ${PY_DEFS}
    <path class="py-bowl" d="M158 128 A 52 40 0 0 0 262 128 L252 148 A 60 30 0 0 1 168 148 Z"/>
    ${[0,1,2,3,4].map(i => `<circle class="py-coal" cx="${182 + i * 14}" cy="${132 + (i % 2) * 6}" r="6"/>`).join("")}
    ${pyHeat(210, 108, 5)}
    <text class="py-threshold" x="118" y="34" text-anchor="middle">1 · EMBER OUT</text>
    <text class="py-threshold" x="302" y="34" text-anchor="middle">25% · HEAT IN</text>
    <path class="py-link" d="M164 110 L102 72"/><path class="py-link" d="M256 110 L318 72"/>
    <path class="py-link" d="M210 152 L210 177"/>
    <text class="py-center-label" x="210" y="176" text-anchor="middle">EMBERS · HEAT</text>
    <text class="py-center-sub" x="210" y="188" text-anchor="middle">SPEND ONE · THE OTHER RISES</text>
    <text class="py-legend" x="16" y="22">FLAMECASTING · 5% HASTE ×5</text>
    ${pyNodes.map(s => pyNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const PY_PHONE_NODES = pyNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const PY_PHONE = `<title id="py-seal-title">The brazier: countable Embers in the bowl, Heat rising and never falling back</title>
    ${PY_DEFS}
    <path class="py-bowl" d="M166 112 A 44 32 0 0 0 254 112 L246 128 A 50 24 0 0 1 174 128 Z"/>
    ${[0,1,2,3,4].map(i => `<circle class="py-coal" cx="${186 + i * 12}" cy="${115 + (i % 2) * 5}" r="5"/>`).join("")}
    ${pyHeat(210, 94, 4)}
    <text class="py-threshold" x="118" y="28" text-anchor="middle">1 · EMBER OUT</text>
    <text class="py-threshold" x="302" y="28" text-anchor="middle">25% · HEAT IN</text>
    <path class="py-link" d="M172 96 L102 62"/><path class="py-link" d="M248 96 L318 62"/>
    <path class="py-link" d="M210 132 L210 149"/>
    <text class="py-center-label" x="210" y="152" text-anchor="middle">EMBERS · HEAT</text>
    <text class="py-center-sub" x="210" y="163" text-anchor="middle">SPEND ONE · THE OTHER RISES</text>
    <text class="py-legend" x="14" y="20">FLAMECASTING · 5% HASTE ×5</text>
    ${PY_PHONE_NODES.map(s => pyNodeSvg(s, 33, 44)).join("")}`;

  // Runemaster: the chisel on the blade — a sword laid flat, the chisel at its
  // fuller, struck sparks scattering unevenly (packet, final batch).
  const rmNodes = [
    { id: "runemaster/runic", name: "Runic", verb: "BRAND", tag: "BRAND", x: 73, y: 66 },
    { id: "runemaster/arcane", name: "Arcane", verb: "ESCALATE", tag: "GLYPH ×3", x: 347, y: 66 },
    { id: "runemaster/riftblade", name: "Riftblade", verb: "BEAT", tag: "3RD", x: 210, y: 206 },
  ];
  const RM_DEFS = `<defs>
      <filter id="rmGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const rmNodeSvg = (s, ny, vy) => `<g class="cd-node rm-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="rm-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const rmSparks = (cx, cy) => [[-26,-18,3],[14,-26,2.5],[30,-10,3],[-14,-30,2],[38,-24,2],[-34,-6,2.5],[8,-38,2.5]].map(([dx,dy,r]) =>
    `<circle class="rm-spark" cx="${cx + dx}" cy="${cy + dy}" r="${r}"/>`).join("");
  const RM_DESKTOP = `<title id="rm-seal-title">The chisel on the blade: engravings struck as scattered sparks, never an even ring</title>
    ${RM_DEFS}
    <path class="rm-blade" d="M96 132 L306 132 L330 138 L306 144 L96 144 Z"/>
    <line class="rm-fuller" x1="106" y1="138" x2="300" y2="138"/>
    <path class="rm-chisel" d="M210 132 L258 76"/>
    <path class="rm-chiselhead" d="M252 68 L266 82"/>
    ${rmSparks(210, 128)}
    <text class="rm-threshold" x="118" y="34" text-anchor="middle">−10% · ALWAYS</text>
    <text class="rm-threshold" x="302" y="34" text-anchor="middle">+100% · 6 SEC</text>
    <path class="rm-link" d="M140 118 L102 72"/><path class="rm-link" d="M280 118 L318 72"/>
    <path class="rm-link" d="M210 148 L210 177"/>
    <text class="rm-center-label" x="210" y="168" text-anchor="middle">ENGRAVINGS</text>
    <text class="rm-center-sub" x="210" y="180" text-anchor="middle">A CHANCE YOU BUY UP · ZENITH ×2</text>
    <text class="rm-legend" x="16" y="22">WRITE FIRST · RELEASE SECOND</text>
    ${rmNodes.map(s => rmNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const RM_PHONE_NODES = rmNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const RM_PHONE = `<title id="rm-seal-title">The chisel on the blade: engravings struck as scattered sparks, never an even ring</title>
    ${RM_DEFS}
    <path class="rm-blade" d="M110 114 L296 114 L318 120 L296 126 L110 126 Z"/>
    <line class="rm-fuller" x1="120" y1="120" x2="292" y2="120"/>
    <path class="rm-chisel" d="M210 114 L252 66"/>
    <path class="rm-chiselhead" d="M246 59 L258 71"/>
    ${rmSparks(210, 110)}
    <text class="rm-threshold" x="118" y="28" text-anchor="middle">−10% · ALWAYS</text>
    <text class="rm-threshold" x="302" y="28" text-anchor="middle">+100% · 6 SEC</text>
    <path class="rm-link" d="M148 102 L102 62"/><path class="rm-link" d="M272 102 L318 62"/>
    <path class="rm-link" d="M210 128 L210 149"/>
    <text class="rm-center-label" x="210" y="146" text-anchor="middle">ENGRAVINGS</text>
    <text class="rm-center-sub" x="210" y="157" text-anchor="middle">A CHANCE YOU BUY UP · ZENITH ×2</text>
    <text class="rm-legend" x="14" y="20">WRITE FIRST · RELEASE SECOND</text>
    ${RM_PHONE_NODES.map(s => rmNodeSvg(s, 33, 44)).join("")}`;


  // Venomancer: two fang punctures — the only shared thing — with four segmented
  // venom ducts running outward, one per form (packet, final batch).
  const vnNodes = [
    { id: "venomancer/venom", name: "Venom", verb: "FESTER", tag: "GROWTH 10", x: 73, y: 64 },
    { id: "venomancer/stalking", name: "Stalking", verb: "STALK", tag: "MARKS 5", x: 347, y: 64 },
    { id: "venomancer/fortitude", name: "Fortitude", verb: "SHED", tag: "FLESH 10", x: 73, y: 196 },
    { id: "venomancer/vizier", name: "Vizier", verb: "PRIME", tag: "VIGIL 5", x: 347, y: 196 },
  ];
  const VN_DEFS = `<defs>
      <filter id="vnGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const vnNodeSvg = (s, ny, vy) => `<g class="cd-node vn-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="vn-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const vnDuct = (x1, y1, x2, y2, n) => Array.from({ length: n }, (_, i) => {
    const t = 0.25 + (i * 0.6) / n;
    const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    return `<circle class="vn-seg" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/>`;
  }).join("") + `<path class="vn-ductline" d="M${x1} ${y1} L${x2} ${y2}"/>`;
  const VN_DESKTOP = `<title id="vn-seal-title">Two fangs, four venom ducts: each form counts its own segments outward</title>
    ${VN_DEFS}
    <path class="vn-fang" d="M198 92 C 194 108 198 122 206 132 C 204 116 204 102 208 94 Z"/>
    <path class="vn-fang" d="M222 92 C 226 108 222 122 214 132 C 216 116 216 102 212 94 Z"/>
    ${vnDuct(196, 104, 104, 70, 5)}${vnDuct(224, 104, 316, 70, 5)}
    ${vnDuct(198, 122, 104, 190, 5)}${vnDuct(222, 122, 316, 190, 5)}
    <text class="vn-threshold" x="118" y="34" text-anchor="middle">2 VENOMS · SHARED</text>
    <text class="vn-threshold" x="300" y="34" text-anchor="middle">EACH FORM · ITS OWN</text>
    <text class="vn-center-label" x="210" y="162" text-anchor="middle">FORMS · STACKS</text>
    <text class="vn-center-sub" x="210" y="174" text-anchor="middle">THE FANGS ARE THE ONLY SHARED THING</text>
    <text class="vn-legend" x="16" y="22">TWO VENOMS · ALWAYS ON</text>
    ${vnNodes.map(s => vnNodeSvg(s, 42, 54)).join("")}`;
  const VN_PHONE_NODES = vnNodes.map(s => ({ ...s, y: s.y < 150 ? 56 : 167 }));
  const VN_PHONE = `<title id="vn-seal-title">Two fangs, four venom ducts: each form counts its own segments outward</title>
    ${VN_DEFS}
    <path class="vn-fang" d="M200 80 C 196 94 200 106 206 114 C 205 100 205 88 209 82 Z"/>
    <path class="vn-fang" d="M220 80 C 224 94 220 106 214 114 C 215 100 215 88 211 82 Z"/>
    ${vnDuct(198, 90, 106, 62, 4)}${vnDuct(222, 90, 314, 62, 4)}
    ${vnDuct(200, 106, 106, 162, 4)}${vnDuct(220, 106, 314, 162, 4)}
    <text class="vn-threshold" x="118" y="28" text-anchor="middle">2 VENOMS · SHARED</text>
    <text class="vn-threshold" x="300" y="28" text-anchor="middle">EACH FORM · ITS OWN</text>
    <text class="vn-center-label" x="210" y="140" text-anchor="middle">FORMS · STACKS</text>
    <text class="vn-center-sub" x="210" y="151" text-anchor="middle">THE FANGS ARE THE SHARED THING</text>
    <text class="vn-legend" x="14" y="20">TWO VENOMS · ALWAYS ON</text>
    ${VN_PHONE_NODES.map(s => vnNodeSvg(s, 33, 44)).join("")}`;

  // Witch Doctor: the loa mask with five spirit-wisps on one cord — a fetish
  // necklace, the fifth wisp lit as the cap (packet, final batch).
  const wdNodes = [
    { id: "witch-doctor/voodoo", name: "Voodoo", verb: "SNAP", tag: "THREADS", x: 73, y: 66 },
    { id: "witch-doctor/shadowhunting", name: "Shadowhunting", verb: "GATHER", tag: "HUNGER", x: 347, y: 66 },
    { id: "witch-doctor/brewing", name: "Brewing", verb: "MIX", tag: "CAULDRON", x: 210, y: 206 },
  ];
  const WD_DEFS = `<defs>
      <filter id="wdGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const wdNodeSvg = (s, ny, vy) => `<g class="cd-node wd-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="wd-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const wdWisps = (cx, cy, spread) => [0,1,2,3,4].map(i => {
    const x = cx - spread * 2 + i * spread;
    const y = cy + Math.abs(i - 2) * -6 + 12;
    return `<line class="wd-cordlet" x1="${x}" y1="${y - 8}" x2="${x}" y2="${y}"/>
      <circle class="wd-wisp${i === 4 ? " lit" : ""}" cx="${x}" cy="${y + 6}" r="${5 + i * 0.7}"/>`;
  }).join("");
  const WD_DESKTOP = `<title id="wd-seal-title">The loa mask and its fetish cord: five spirit-wisps, the fifth lit as the cap</title>
    ${WD_DEFS}
    <path class="wd-mask" d="M186 50 C 178 76 180 96 210 108 C 240 96 242 76 234 50 C 222 42 198 42 186 50 Z"/>
    <ellipse class="wd-maskeye" cx="199" cy="72" rx="5" ry="7"/>
    <ellipse class="wd-maskeye" cx="221" cy="72" rx="5" ry="7"/>
    <line class="wd-maskline" x1="210" y1="84" x2="210" y2="98"/>
    <path class="wd-cord" d="M162 112 Q 210 142 258 112"/>
    ${wdWisps(210, 118, 22)}
    <text class="wd-threshold" x="118" y="34" text-anchor="middle">HOLD · IT SCALES</text>
    <text class="wd-threshold" x="302" y="34" text-anchor="middle">5 · UNLEASH</text>
    <path class="wd-link" d="M172 78 L102 70"/><path class="wd-link" d="M248 78 L318 70"/>
    <path class="wd-link" d="M210 146 L210 177"/>
    <text class="wd-center-label" x="210" y="162" text-anchor="middle">SPIRITS</text>
    <text class="wd-center-sub" x="210" y="173" text-anchor="middle">EACH ONE FEEDS YOU · 12 s</text>
    <text class="wd-legend" x="16" y="22">A SECOND VALUE BESIDE THE STACK</text>
    ${wdNodes.map(s => wdNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const WD_PHONE_NODES = wdNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const WD_PHONE = `<title id="wd-seal-title">The loa mask and its fetish cord: five spirit-wisps, the fifth lit as the cap</title>
    ${WD_DEFS}
    <path class="wd-mask" d="M190 38 C 183 60 185 78 210 88 C 235 78 237 60 230 38 C 220 31 200 31 190 38 Z"/>
    <ellipse class="wd-maskeye" cx="201" cy="56" rx="4" ry="6"/>
    <ellipse class="wd-maskeye" cx="219" cy="56" rx="4" ry="6"/>
    <line class="wd-maskline" x1="210" y1="66" x2="210" y2="78"/>
    <path class="wd-cord" d="M168 92 Q 210 118 252 92"/>
    ${wdWisps(210, 96, 19)}
    <text class="wd-threshold" x="118" y="28" text-anchor="middle">HOLD · IT SCALES</text>
    <text class="wd-threshold" x="302" y="28" text-anchor="middle">5 · UNLEASH</text>
    <path class="wd-link" d="M178 64 L102 60"/><path class="wd-link" d="M242 64 L318 60"/>
    <path class="wd-link" d="M210 128 L210 149"/>
    <text class="wd-center-label" x="210" y="136" text-anchor="middle">SPIRITS</text>
    <text class="wd-center-sub" x="210" y="147" text-anchor="middle">EACH ONE FEEDS YOU · 12 s</text>
    <text class="wd-legend" x="14" y="20">A SECOND VALUE BESIDE THE STACK</text>
    ${WD_PHONE_NODES.map(s => wdNodeSvg(s, 33, 44)).join("")}`;

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
  // Guardian: formations as a war-banner between two stances — a tight TOWER grid
  // and a spread LINE rank — with the three specs standing in formation below.
  // No shared class bar: each node carries its own meter mark (10 · 3 · 3, from v3).
  const gdNodes = [
    { id: "guardian/vanguard", name: "Vanguard", verb: "BLOCK", meter: "10", x: 73, y: 200 },
    { id: "guardian/inspiration", name: "Inspiration", verb: "RALLY", meter: "3", x: 210, y: 200 },
    { id: "guardian/gladiator", name: "Gladiator", verb: "DUEL", meter: "3", x: 347, y: 200 },
  ];
  const GD_DEFS = `<defs>
      <linearGradient id="gdBanner" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffb257"/><stop offset=".6" stop-color="#c96a1c"/><stop offset="1" stop-color="#5c2f0e"/></linearGradient>
      <filter id="gdGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const gdDots = (cx, cy, kind, gap) => kind === "tower"
    ? [-1, 0, 1].flatMap(r => [-1, 0, 1].map(c =>
        `<circle class="gd-dot" cx="${cx + c * gap}" cy="${cy + r * gap}" r="2.6"/>`)).join("")
    : [-2, -1, 0, 1, 2].map(c =>
        `<circle class="gd-dot" cx="${cx + c * gap}" cy="${cy}" r="2.6"/>`).join("");
  const gdNodeSvg = (s, ny, vy) => `<g class="cd-node gd-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="gd-meter" text-anchor="middle" y="18">${s.meter}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const GD_DESKTOP = `<title id="gd-seal-title">Formations between Tower and Line, with each Guardian spec running its own meter</title>
    ${GD_DEFS}
    <line class="gd-axis" x1="96" y1="96" x2="324" y2="96"/>
    <path class="gd-pole" d="M210 52 L210 132"/>
    <path class="gd-pennant" d="M210 54 L258 67 L210 82 Z"/>
    <path class="gd-link" d="M210 134 L73 200"/><path class="gd-link" d="M210 134 L210 200"/>
    <path class="gd-link" d="M210 134 L347 200"/>
    ${gdDots(118, 96, "tower", 11)}${gdDots(302, 96, "line", 11)}
    <text class="gd-threshold" x="118" y="132" text-anchor="middle">TOWER · GUARD</text>
    <text class="gd-threshold" x="302" y="132" text-anchor="middle">LINE · MARCH</text>
    <text class="gd-center-label" x="210" y="156" text-anchor="middle">FORMATIONS</text>
    <text class="gd-center-sub" x="210" y="168" text-anchor="middle">EACH SPEC ITS OWN METER</text>
    <text class="gd-legend" x="16" y="22">THE LINE HOLDS EVERYONE</text>
    ${gdNodes.map(s => gdNodeSvg(s, 42, 54)).join("")}`;
  const GD_PHONE_NODES = gdNodes.map(s => ({ ...s, y: 174 }));
  const GD_PHONE = `<title id="gd-seal-title">Formations between Tower and Line, with each Guardian spec running its own meter</title>
    ${GD_DEFS}
    <line class="gd-axis" x1="100" y1="76" x2="320" y2="76"/>
    <path class="gd-pole" d="M210 36 L210 110"/>
    <path class="gd-pennant" d="M210 38 L248 48 L210 61 Z"/>
    <path class="gd-link" d="M210 112 L73 174"/><path class="gd-link" d="M210 112 L210 174"/>
    <path class="gd-link" d="M210 112 L347 174"/>
    ${gdDots(118, 76, "tower", 10)}${gdDots(302, 76, "line", 10)}
    <text class="gd-threshold" x="118" y="110" text-anchor="middle">TOWER · GUARD</text>
    <text class="gd-threshold" x="302" y="110" text-anchor="middle">LINE · MARCH</text>
    <text class="gd-center-label" x="210" y="130" text-anchor="middle">FORMATIONS</text>
    <text class="gd-center-sub" x="210" y="141" text-anchor="middle">EACH SPEC ITS OWN METER</text>
    <text class="gd-legend" x="14" y="20">THE LINE HOLDS EVERYONE</text>
    ${GD_PHONE_NODES.map(s => gdNodeSvg(s, 33, 44)).join("")}`;

  // Witch Hunter: one shared Rage vial at the center of a hunter's diamond, four
  // corner specs each carrying its own layer tag (audited: Rage in all four specs;
  // Tonics restore it class-wide; the layers are the specs' own marks and stacks).
  const whNodes = [
    { id: "witch-hunter/boltslinger", name: "Boltslinger", verb: "UNLOAD", layer: "BOLTS", x: 73, y: 64 },
    { id: "witch-hunter/houndmaster", name: "Houndmaster", verb: "LOOSE", layer: "HOUNDS", x: 347, y: 64 },
    { id: "witch-hunter/black-knight", name: "Black Knight", verb: "RIPOSTE", layer: "BRANDS", x: 73, y: 196 },
    { id: "witch-hunter/inquisition", name: "Inquisition", verb: "BALANCE", layer: "DAWN·DUSK", x: 347, y: 196 },
  ];
  const WH_DEFS = `<defs>
      <radialGradient id="whFire"><stop offset="0" stop-color="#f4e8a0"/><stop offset=".5" stop-color="#abd473"/><stop offset="1" stop-color="#1c2611"/></radialGradient>
      <filter id="whGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const whFlask = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})">
      <rect class="wh-neck" x="-7" y="-34" width="14" height="12" rx="2"/>
      <line class="wh-cork" x1="-9" y1="-34" x2="9" y2="-34"/>
      <circle class="wh-body" r="21" cy="2"/>
      <path class="wh-fire" d="M0 12 C-9 4 -6 -8 0 -16 C6 -8 9 4 0 12 Z"/></g>`;
  const whNodeSvg = (s, ny, vy) => `<g class="cd-node wh-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="wh-layer" text-anchor="middle" y="18">${s.layer}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const WH_DESKTOP = `<title id="wh-seal-title">One shared Rage beneath four Witch Hunter layers</title>
    ${WH_DEFS}
    <path class="wh-diamond" d="M210 42 L338 128 L210 214 L82 128 Z"/>
    ${whNodes.map(s => `<path class="wh-link" d="M210 128 L${s.x} ${s.y}"/>`).join("")}
    ${whFlask(210, 118, 1)}
    <text class="wh-threshold" x="210" y="32" text-anchor="middle">ONE RAGE · SHARED</text>
    <text class="wh-legend" x="16" y="22">VAULT · TRAP · TONIC</text>
    <text class="wh-center-label" x="210" y="160" text-anchor="middle">RAGE</text>
    <text class="wh-center-sub" x="210" y="172" text-anchor="middle">TONICS REFILL IT</text>
    ${whNodes.map(s => whNodeSvg(s, 42, 54)).join("")}`;
  const WH_PHONE_NODES = whNodes.map(s => ({ ...s, y: s.y < 100 ? 58 : 172 }));
  const WH_PHONE = `<title id="wh-seal-title">One shared Rage beneath four Witch Hunter layers</title>
    ${WH_DEFS}
    <path class="wh-diamond" d="M210 36 L326 112 L210 188 L94 112 Z"/>
    ${WH_PHONE_NODES.map(s => `<path class="wh-link" d="M210 112 L${s.x} ${s.y}"/>`).join("")}
    ${whFlask(210, 104, .85)}
    <text class="wh-threshold" x="210" y="24" text-anchor="middle">ONE RAGE · SHARED</text>
    <text class="wh-legend" x="14" y="20">VAULT · TRAP · TONIC</text>
    <text class="wh-center-label" x="210" y="140" text-anchor="middle">RAGE</text>
    <text class="wh-center-sub" x="210" y="151" text-anchor="middle">TONICS REFILL IT</text>
    ${WH_PHONE_NODES.map(s => whNodeSvg(s, 33, 44)).join("")}`;

  // Stormbringer: the Static column as a spark gap — a graduated 0–100 column, the
  // Supercharged band glowing above 70, a barbed cap at 100 where the arc turns on
  // the caster. Spec taps at their own heights (packet: seal_concept, batch 1).
  const sbNodes = [
    { id: "stormbringer/lightning", name: "Lightning", verb: "DISCHARGE", tag: "ALL", x: 73, y: 66 },
    { id: "stormbringer/maelstrom", name: "Maelstrom", verb: "COMPOUND", tag: "6", x: 347, y: 66 },
    { id: "stormbringer/wind", name: "Wind", verb: "FEED", tag: "10", x: 347, y: 196 },
  ];
  const SB_DEFS = `<defs>
      <linearGradient id="sbBand" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#bfe0ff"/><stop offset="1" stop-color="#4da2ff"/></linearGradient>
      <filter id="sbGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const sbNodeSvg = (s, ny, vy) => `<g class="cd-node sb-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="sb-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const sbColumn = (x, top, bot, band) => {
    const ticks = Array.from({ length: 9 }, (_, i) => {
      const y = bot - (i + 1) * (bot - top) / 10;
      return `<line class="sb-tick" x1="${x - 9}" y1="${y.toFixed(1)}" x2="${x - 5}" y2="${y.toFixed(1)}"/>`;
    }).join("");
    return `<rect class="sb-col" x="${x - 6}" y="${top}" width="12" height="${bot - top}" rx="2"/>
      <rect class="sb-band" x="${x - 6}" y="${top}" width="12" height="${band - top}" rx="2"/>${ticks}
      <path class="sb-cap" d="M${x - 12} ${top - 2} L${x - 6} ${top - 9} L${x} ${top - 2} L${x + 6} ${top - 9} L${x + 12} ${top - 2}"/>
      <path class="sb-bolt" d="M${x} ${bot - 4} L${x - 4} ${bot - 34} L${x + 3} ${bot - 32} L${x - 2} ${bot - 62} L${x + 4} ${bot - 59} L${x - 1} ${bot - 86}"/>`;
  };
  const SB_DESKTOP = `<title id="sb-seal-title">Static as a spark gap: supercharged above 70, the storm turns at 100</title>
    ${SB_DEFS}
    ${sbColumn(210, 54, 190, 95)}
    <text class="sb-threshold" x="153" y="46" text-anchor="middle">100 · STUN</text>
    <text class="sb-threshold" x="153" y="90" text-anchor="middle">70 · SUPERCHARGE</text>
    <line class="sb-mark" x1="158" y1="95" x2="204" y2="95"/>
    <path class="sb-tap" d="M204 60 L102 66"/>
    <path class="sb-tap" d="M216 84 L318 66"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<line class="sb-tick" x1="${252 + i * 11}" y1="${79 - i * 2}" x2="${252 + i * 11}" y2="${87 - i * 2}"/>`).join("")}
    <path class="sb-tap" d="M216 150 C 260 150, 268 178, 318 190"/>
    <circle class="sb-orb" cx="268" cy="162" r="8"/>
    <text class="sb-center-label" x="210" y="214" text-anchor="middle">STATIC</text>
    <text class="sb-center-sub" x="210" y="226" text-anchor="middle">SPEND BEFORE 100</text>
    ${sbNodes.map(s => sbNodeSvg(s, s.y > 150 ? 42 : 42, s.y > 150 ? 54 : 54)).join("")}`;
  const SB_PHONE_NODES = sbNodes.map(s => ({ ...s, y: s.y > 150 ? 172 : 58 }));
  const SB_PHONE = `<title id="sb-seal-title">Static as a spark gap: supercharged above 70, the storm turns at 100</title>
    ${SB_DEFS}
    ${sbColumn(210, 44, 158, 78)}
    <text class="sb-threshold" x="153" y="36" text-anchor="middle">100 · STUN</text>
    <text class="sb-threshold" x="153" y="72" text-anchor="middle">70 · SUPERCHARGE</text>
    <line class="sb-mark" x1="160" y1="78" x2="204" y2="78"/>
    <path class="sb-tap" d="M204 50 L102 58"/>
    <path class="sb-tap" d="M216 70 L318 58"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<line class="sb-tick" x1="${250 + i * 11}" y1="${68 - i * 1.5}" x2="${250 + i * 11}" y2="${75 - i * 1.5}"/>`).join("")}
    <path class="sb-tap" d="M216 128 C 258 128, 266 156, 318 168"/>
    <circle class="sb-orb" cx="264" cy="140" r="7"/>
    <text class="sb-center-label" x="210" y="180" text-anchor="middle">STATIC</text>
    <text class="sb-center-sub" x="210" y="191" text-anchor="middle">SPEND BEFORE 100</text>
    ${SB_PHONE_NODES.map(s => sbNodeSvg(s, 33, 44)).join("")}`;


  // Reaper: the scythe-ring soul ladder — a broken blade ring with nine notches in
  // three arcs, a middle band of three soul marks, and the Infusion halo crowning
  // the gap (packet: seal_concept, batch 1).
  const rpNodes = [
    { id: "reaper/harvest", name: "Harvest", verb: "EXECUTE", tag: "35%", x: 73, y: 66 },
    { id: "reaper/soul", name: "Soul", verb: "FLOOD", tag: "2 FRAG", x: 347, y: 66 },
    { id: "reaper/domination", name: "Domination", verb: "MUSTER", tag: "3 SOULS", x: 210, y: 206 },
  ];
  const RP_DEFS = `<defs>
      <filter id="rpGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;
  const rpNodeSvg = (s, ny, vy) => `<g class="cd-node rp-node" data-cd-spec="${s.id}" role="button" tabindex="0" transform="translate(${s.x} ${s.y})">
      <circle class="node-ring" r="29"/><circle class="node-dot" r="4"/>
      <text class="rp-tag" text-anchor="middle" y="18">${s.tag}</text>
      <text class="node-name" text-anchor="middle" y="${ny}">${s.name}</text>
      <text class="node-verb" text-anchor="middle" y="${vy}">${s.verb}</text></g>`;
  const RP_DESKTOP = `<title id="rp-seal-title">The soul ladder: nine notches, three souls, one Infusion crown</title>
    ${RP_DEFS}
    <line class="rp-haft" x1="162" y1="196" x2="258" y2="28"/>
    <path class="rp-ring" d="M231.2 53.7 A62 62 0 1 1 188.8 53.7"/>
    <line class="rp-notch" x1="252.9" y1="76.0" x2="257.5" y2="72.1"/><line class="rp-notch" x1="265.8" y1="107.1" x2="271.8" y2="106.6"/><line class="rp-notch" x1="258.5" y1="140.0" x2="263.7" y2="143.0"/><line class="rp-notch" x1="229.2" y1="164.6" x2="231.2" y2="170.3"/><line class="rp-notch" x1="195.5" y1="166.1" x2="194.0" y2="171.9"/><line class="rp-notch" x1="167.1" y1="148.0" x2="162.5" y2="151.9"/><line class="rp-notch" x1="154.0" y1="112.0" x2="148.0" y2="112.0"/><line class="rp-notch" x1="164.1" y1="79.9" x2="159.2" y2="76.4"/><line class="rp-notch" x1="190.8" y1="59.4" x2="188.8" y2="53.7"/>
    <circle class="rp-band" cx="210" cy="112" r="40"/>
    <path class="rp-soul" d="M244.6 126.0 L249.6 132.0 L244.6 138.0 L239.6 132.0 Z"/><path class="rp-soul" d="M175.4 126.0 L180.4 132.0 L175.4 138.0 L170.4 132.0 Z"/><path class="rp-soul" d="M210.0 66.0 L215.0 72.0 L210.0 78.0 L205.0 72.0 Z"/>
    <path class="rp-halo" d="M162.4 55.3 A74 74 0 0 1 257.6 55.3"/>
    <path class="rp-link" d="M160 90 L102 70"/><path class="rp-link" d="M260 90 L318 70"/>
    <path class="rp-link" d="M210 174 L210 177"/>
    <text class="rp-threshold" x="140" y="34" text-anchor="middle">3 · HOLD</text>
    <text class="rp-threshold" x="280" y="34" text-anchor="middle">3 · SPEND</text>
    <text class="rp-center-label" x="210" y="108" text-anchor="middle">SOUL LADDER</text>
    <text class="rp-center-sub" x="210" y="121" text-anchor="middle">FRAGMENTS → SOULS → INFUSION</text>
    <text class="rp-legend" x="16" y="22">REAP · CONVERT · CROWN</text>
    ${rpNodes.map(s => rpNodeSvg(s, s.y > 150 ? 38 : 42, s.y > 150 ? 50 : 54)).join("")}`;
  const RP_PHONE_NODES = rpNodes.map(s => ({ ...s, y: s.y > 150 ? 178 : 58 }));
  const RP_PHONE = `<title id="rp-seal-title">The soul ladder: nine notches, three souls, one Infusion crown</title>
    ${RP_DEFS}
    <line class="rp-haft" x1="168" y1="168" x2="252" y2="26"/>
    <path class="rp-ring" d="M227.8 47.1 A52 52 0 1 1 192.2 47.1"/>
    <line class="rp-notch" x1="245.2" y1="66.4" x2="249.8" y2="62.6"/><line class="rp-notch" x1="255.8" y1="92.0" x2="261.8" y2="91.5"/><line class="rp-notch" x1="249.8" y1="119.0" x2="255.0" y2="122.0"/><line class="rp-notch" x1="225.7" y1="139.2" x2="227.8" y2="144.9"/><line class="rp-notch" x1="198.1" y1="140.4" x2="196.5" y2="146.2"/><line class="rp-notch" x1="174.8" y1="125.6" x2="170.2" y2="129.4"/><line class="rp-notch" x1="164.0" y1="96.0" x2="158.0" y2="96.0"/><line class="rp-notch" x1="172.3" y1="69.6" x2="167.4" y2="66.2"/><line class="rp-notch" x1="194.3" y1="52.8" x2="192.2" y2="47.1"/>
    <circle class="rp-band" cx="210" cy="96" r="33"/>
    <path class="rp-soul" d="M238.6 106.5 L243.6 112.5 L238.6 118.5 L233.6 112.5 Z"/><path class="rp-soul" d="M181.4 106.5 L186.4 112.5 L181.4 118.5 L176.4 112.5 Z"/><path class="rp-soul" d="M210.0 57.0 L215.0 63.0 L210.0 69.0 L205.0 63.0 Z"/>
    <path class="rp-halo" d="M170.1 48.5 A62 62 0 0 1 249.9 48.5"/>
    <path class="rp-link" d="M164 78 L102 62"/><path class="rp-link" d="M256 78 L318 62"/>
    <path class="rp-link" d="M210 148 L210 149"/>
    <text class="rp-threshold" x="140" y="26" text-anchor="middle">3 · HOLD</text>
    <text class="rp-threshold" x="280" y="26" text-anchor="middle">3 · SPEND</text>
    <text class="rp-center-label" x="210" y="93" text-anchor="middle">SOUL LADDER</text>
    <text class="rp-center-sub" x="210" y="105" text-anchor="middle">FRAGMENTS → SOULS → INFUSION</text>
    <text class="rp-legend" x="14" y="20">REAP · CONVERT · CROWN</text>
    ${RP_PHONE_NODES.map(s => rpNodeSvg(s, 33, 44)).join("")}`;

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
  } else if (cSlug === "guardian") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-gd-seal" aria-label="Guardian class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="gd-seal-title">${GD_DESKTOP}</svg></div>`);
  } else if (cSlug === "witch-hunter") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-wh-seal" aria-label="Witch Hunter class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="wh-seal-title">${WH_DESKTOP}</svg></div>`);
  } else if (cSlug === "venomancer") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-vn-seal" aria-label="Venomancer class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="vn-seal-title">${VN_DESKTOP}</svg></div>`);
  } else if (cSlug === "witch-doctor") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-wd-seal" aria-label="Witch Doctor class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="wd-seal-title">${WD_DESKTOP}</svg></div>`);
  } else if (cSlug === "pyromancer") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-py-seal" aria-label="Pyromancer class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="py-seal-title">${PY_DESKTOP}</svg></div>`);
  } else if (cSlug === "runemaster") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-rm-seal" aria-label="Runemaster class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="rm-seal-title">${RM_DESKTOP}</svg></div>`);
  } else if (cSlug === "necromancer") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-nc-seal" aria-label="Necromancer class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="nc-seal-title">${NC_DESKTOP}</svg></div>`);
  } else if (cSlug === "primalist") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-pr-seal" aria-label="Primalist class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="pr-seal-title">${PR_DESKTOP}</svg></div>`);
  } else if (cSlug === "barbarian") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-ba-seal" aria-label="Barbarian class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="ba-seal-title">${BA_DESKTOP}</svg></div>`);
  } else if (cSlug === "bloodmage") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-bm-seal" aria-label="Bloodmage class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="bm-seal-title">${BM_DESKTOP}</svg></div>`);
  } else if (cSlug === "ranger") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-rg-seal" aria-label="Ranger class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="rg-seal-title">${RG_DESKTOP}</svg></div>`);
  } else if (cSlug === "felsworn") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-fs-seal" aria-label="Felsworn class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="fs-seal-title">${FS_DESKTOP}</svg></div>`);
  } else if (cSlug === "sun-cleric") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-su-seal" aria-label="Sun Cleric class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="su-seal-title">${SU_DESKTOP}</svg></div>`);
  } else if (cSlug === "templar") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-tp-seal" aria-label="Templar class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="tp-seal-title">${TP_DESKTOP}</svg></div>`);
  } else if (cSlug === "starcaller") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-sc-seal" aria-label="Starcaller class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="sc-seal-title">${SC_DESKTOP}</svg></div>`);
  } else if (cSlug === "chronomancer") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-cm-seal" aria-label="Chronomancer class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="cm-seal-title">${CM_DESKTOP}</svg></div>`);
  } else if (cSlug === "reaper") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-rp-seal" aria-label="Reaper class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="rp-seal-title">${RP_DESKTOP}</svg></div>`);
  } else if (cSlug === "stormbringer") {
    el("mast").classList.add("cd-with-seal");
    el("mast").insertAdjacentHTML("beforeend",
      `<div class="cd-stage cd-seal ry-reseal cd-sb-seal" aria-label="Stormbringer class engine diagram">
        <svg viewBox="0 0 420 260" role="img" aria-labelledby="sb-seal-title">${SB_DESKTOP}</svg></div>`);
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
    "guardian/vanguard": "bank", "guardian/inspiration": "wheel", "guardian/gladiator": "wheel",
    "witch-hunter/boltslinger": "wheel", "witch-hunter/houndmaster": "bank",
    "witch-hunter/black-knight": "wheel", "witch-hunter/inquisition": "pips",
    "stormbringer/lightning": "spike", "stormbringer/maelstrom": "pips", "stormbringer/wind": "wheel",
    "reaper/domination": "bank", "reaper/harvest": "spike", "reaper/soul": "wave",
    "chronomancer/infinite": "wave", "chronomancer/artificer": "bank", "chronomancer/time": "pips",
    "starcaller/moon-guard": "wheel", "starcaller/moon-priest": "bank",
    "starcaller/sentinel": "pips", "starcaller/warden": "wave",
    "sun-cleric/piety": "wheel", "sun-cleric/blessings": "wheel",
    "sun-cleric/seraphim": "stack", "sun-cleric/valkyrie": "wave",
    "templar/crusader": "bank", "templar/oathkeeper": "bank", "templar/zealot": "pips",
    "ranger/farstrider": "wheel", "ranger/archery": "pips", "ranger/brigand": "wave",
    "felsworn/slayer": "wheel", "felsworn/infernal": "spike", "felsworn/tyrant": "bank",
    "barbarian/brutality": "bank", "barbarian/headhunting": "wheel", "barbarian/ancestry": "stack",
    "bloodmage/sanguine": "bank", "bloodmage/accursed": "pips", "bloodmage/eternal": "wheel", "bloodmage/fleshweaver": "bank",
    "necromancer/animation": "wheel", "necromancer/death": "stack", "necromancer/rime": "wheel",
    "primalist/primal": "wheel", "primalist/geomancy": "bank", "primalist/life": "wave", "primalist/mountain-king": "pips",
    "pyromancer/flameweaving": "bank", "pyromancer/incineration": "wave", "pyromancer/draconic": "wheel",
    "runemaster/runic": "wheel", "runemaster/arcane": "pips", "runemaster/riftblade": "wheel",
    "venomancer/venom": "pips", "venomancer/stalking": "bank", "venomancer/fortitude": "bank", "venomancer/vizier": "pips",
    "witch-doctor/voodoo": "bank", "witch-doctor/shadowhunting": "pips", "witch-doctor/brewing": "wheel",
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
      bullets: ["most of the fight is the climb to full Insanity",
        "the payoff is one short window that also hurts you",
        "miss it and the climb was wasted"],
      eyes: "your Insanity bar · your zone placement",
    },
    "cultist/corruption": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Corruption rhythm: DoT ticks never stop, medium beam payoffs repeat, refreshes sit between them, Insanity drifts toward a choice">
        <defs><marker id="ryArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
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
      bullets: ["no big moment, and no off switch",
        "damage rolls in repeating waves",
        "dropping the damage-over-time carpet stops the engine"],
      eyes: "debuff timers across the pack",
    },
    "tinker/demolition": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Demolition rhythm: layers of deployables stack, everything overlaps in one window, then the machine idles and gets rebuilt">
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
      bullets: ["assemble the layers before the fight matters",
        "fire everything in one overlapping window",
        "layers only pay off on the same pack"],
      eyes: "your machines' ground · the pack stacking into them",
    },
    "knight-of-xoroth/hellfire": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Hellfire rhythm: Demonfire stacks climb to six, one unleash window with Rain of Chaos and Hellfire Form, then the climb restarts">
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
      bullets: ["every strike adds a stack; six is a full bar",
        "spend at six and Rain of Chaos falls for 9 seconds",
        "your demon form lasts 15 seconds and speeds the climb"],
      eyes: "your stack count · the form timer",
    },
    "knight-of-xoroth/war": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="War rhythm: one closed loop — Gore charges fill the bar, spending powers up the next Gores, a free Meatsaw refills the bar and the loop returns to build">
        <defs><marker id="kxArrW" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="kx-charge" cx="150" cy="84" r="8"/><circle class="kx-charge" cx="182" cy="84" r="8"/>
        <text class="ph" x="166" y="116" text-anchor="middle">BUILD</text>
        <text class="ph2" x="166" y="130" text-anchor="middle">Gore ×2 · 8 s</text>
        <path class="branch" d="M200 74 C 280 40, 380 36, 452 48" marker-end="url(#kxArrW)"/>
        <text class="ph2" x="325" y="30" text-anchor="middle">feeds the bar</text>
        <path class="refresh" d="M467 58 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="480" y="98" text-anchor="middle">SPEND</text>
        <text class="ph2" x="480" y="112" text-anchor="middle">a Gore charge returns</text>
        <path class="branch" d="M508 52 C 570 40, 630 42, 692 56" marker-end="url(#kxArrW)"/>
        <rect class="kx-window" x="700" y="42" width="190" height="64" rx="2"/>
        <text class="kx-window-lab" x="795" y="68" text-anchor="middle">BOOST WINDOW</text>
        <text class="ph2" x="795" y="86" text-anchor="middle" fill="#f3cdd4">GORES +25% · 12 s</text>
        <path class="branch" d="M795 110 C 700 158, 300 160, 166 100" marker-end="url(#kxArrW)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">FREE MEATSAW · THE BAR REFILLS</text>
      </svg>`,
      bullets: ["Gore strikes fill the bar — you hold two charges of Gore",
        "spending the bar powers up your next two Gores for 12 seconds",
        "the power-up ends with a free Meatsaw, and the bar refills"],
      eyes: "Gore's two charges · the power-up timer",
    },
    "knight-of-xoroth/defiance": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Defiance rhythm: blocks bank imps, active imps guard you, sacrificing them cashes the guard into healing and an absorb, then the bank rebuilds">
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
      bullets: ["every block can add an imp to your guard",
        "standing imps soak damage for you",
        "sacrifice them and they become healing plus a shield"],
      eyes: "your imp count · the damage coming in",
    },
    "guardian/vanguard": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Vanguard rhythm: blocks stack Paragon toward ten, Heavy Blow transforms into Paragon Smash, then the bank rebuilds">
        <line class="thr" x1="14" y1="44" x2="500" y2="44"/><text class="thr-lab" x="14" y="38">10 · the mark</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="gd-line" d="M40 124 L120 124 L120 108 L210 108 L210 90 L310 90 L310 72 L470 72"/>
        <path class="gd-shield" d="M154 96 h14 v9 a7 7 0 0 1 -14 0 Z"/>
        <path class="gd-shield" d="M248 78 h14 v9 a7 7 0 0 1 -14 0 Z"/>
        <path class="gd-shield" d="M356 60 h14 v9 a7 7 0 0 1 -14 0 Z"/><path class="gd-shield" d="M382 60 h14 v9 a7 7 0 0 1 -14 0 Z"/>
        <rect class="gd-window" x="560" y="48" width="200" height="78" rx="2"/>
        <text class="gd-window-lab" x="660" y="76" text-anchor="middle">PARAGON SMASH</text>
        <text class="ph2" x="660" y="94" text-anchor="middle" fill="#ffe0c2">Heavy Blow transforms at ten</text>
        <path class="gd-line" d="M800 124 L860 124 L860 110 L930 110 L930 96 L965 96"/>
        <text class="ph" x="230" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">blocks stack Paragon · Energy returns</text>
        <text class="ph" x="880" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["every block stacks Paragon and hands Energy back",
        "at ten stacks, Heavy Blow transforms into Paragon Smash",
        "raising your shield arms a cooldown-free Heavy Blow"],
      eyes: "your Paragon count · the next hit to block",
    },
    "guardian/inspiration": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Inspiration rhythm: Ballads build Tempo to three, Sound of War rings for nearby allies, Hero's March keeps it ringing, and the count restarts">
        <defs><marker id="gdArrI" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="gd-pip" cx="120" cy="88" r="7"/><circle class="gd-pip" cx="150" cy="88" r="7"/><circle class="gd-pip" cx="180" cy="88" r="7"/>
        <text class="ph" x="150" y="118" text-anchor="middle">BUILD</text>
        <text class="ph2" x="150" y="132" text-anchor="middle">Ballads · Tempo ×3</text>
        <path class="branch" d="M200 78 C 270 46, 350 42, 420 54" marker-end="url(#gdArrI)"/>
        <circle class="gd-burst" cx="465" cy="70" r="14"/><circle class="gd-burst faint" cx="465" cy="70" r="24"/>
        <text class="ph" x="465" y="112" text-anchor="middle">SOUND OF WAR</text>
        <text class="ph2" x="465" y="126" text-anchor="middle">allies' next hit gains magic damage</text>
        <path class="branch" d="M495 60 C 560 44, 620 46, 680 58" marker-end="url(#gdArrI)"/>
        <rect class="gd-window" x="690" y="44" width="200" height="64" rx="2"/>
        <text class="gd-window-lab" x="790" y="70" text-anchor="middle">HERO'S MARCH</text>
        <text class="ph2" x="790" y="88" text-anchor="middle" fill="#ffe0c2">15 s · your autos keep it ringing</text>
        <path class="branch" d="M790 112 C 700 158, 260 160, 136 100" marker-end="url(#gdArrI)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE COUNT RESTARTS</text>
      </svg>`,
      bullets: ["your strikes become Ballads, and Ballads build Tempo",
        "three Tempo casts Sound of War — nearby allies' next hit gains magic damage",
        "Hero's March keeps the song ringing for 15 seconds"],
      eyes: "your Tempo count · who is standing near you",
    },
    "guardian/gladiator": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Gladiator rhythm: Ram builds Glory to three, the next Ram hits harder, and the short wheel turns again; a net sets up Centurion Strike crits">
        <defs><marker id="gdArrG" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="gd-pip" cx="130" cy="84" r="7"/><circle class="gd-pip" cx="160" cy="84" r="7"/><circle class="gd-pip" cx="190" cy="84" r="7"/>
        <text class="ph" x="160" y="114" text-anchor="middle">BUILD</text>
        <text class="ph2" x="160" y="128" text-anchor="middle">Ram builds Glory · ×3</text>
        <path class="branch" d="M210 74 C 300 40, 400 38, 480 50" marker-end="url(#gdArrG)"/>
        <path class="refresh" d="M497 60 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="510" y="100" text-anchor="middle">NET</text>
        <text class="ph2" x="510" y="114" text-anchor="middle">Centurion Strike crits</text>
        <path class="branch" d="M538 54 C 600 42, 650 44, 706 56" marker-end="url(#gdArrG)"/>
        <rect class="gd-window" x="716" y="42" width="180" height="64" rx="2"/>
        <text class="gd-window-lab" x="806" y="68" text-anchor="middle">BOOSTED RAM</text>
        <text class="ph2" x="806" y="86" text-anchor="middle" fill="#ffe0c2">at three Glory</text>
        <path class="branch" d="M806 110 C 710 158, 270 158, 146 98" marker-end="url(#gdArrG)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BUILD THREE · CASH · AGAIN</text>
      </svg>`,
      bullets: ["Ram builds Glory — at three, the next Ram hits harder",
        "a thrown net makes Centurion Strike crit",
        "the wheel is short: build three, cash, and again"],
      eyes: "your Glory count · the net window",
    },
    "witch-hunter/boltslinger": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Boltslinger rhythm: extra shots build Rage, Damnation converts the bar into damage, and Twilight Frenzy is a moving firing channel">
        <defs><marker id="whArrB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="wh-bolt" d="M120 84 l22 6 l-22 6 Z"/><path class="wh-bolt" d="M154 84 l22 6 l-22 6 Z"/><path class="wh-bolt" d="M188 84 l22 6 l-22 6 Z"/>
        <text class="ph" x="165" y="118" text-anchor="middle">BUILD</text>
        <text class="ph2" x="165" y="132" text-anchor="middle">extra shots build Rage</text>
        <path class="branch" d="M230 78 C 300 44, 390 40, 460 52" marker-end="url(#whArrB)"/>
        <path class="refresh" d="M477 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="490" y="100" text-anchor="middle">DAMNATION</text>
        <text class="ph2" x="490" y="114" text-anchor="middle">the bar becomes damage</text>
        <path class="branch" d="M518 56 C 580 44, 630 46, 686 58" marker-end="url(#whArrB)"/>
        <rect class="wh-window" x="696" y="44" width="200" height="64" rx="2"/>
        <text class="wh-window-lab" x="796" y="70" text-anchor="middle">TWILIGHT FRENZY</text>
        <text class="ph2" x="796" y="88" text-anchor="middle" fill="#e4f2cd">a firing channel you can move in</text>
        <path class="branch" d="M796 112 C 700 158, 260 160, 140 100" marker-end="url(#whArrB)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE HUNT CONTINUES</text>
      </svg>`,
      bullets: ["your shots can double-fire, and the extra bolts build Rage",
        "Damnation turns the whole bar into one hit",
        "Twilight Frenzy is a firing channel you can move in"],
      eyes: "your Rage bar · the pack in front of you",
    },
    "witch-hunter/houndmaster": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Houndmaster rhythm: the pack fights beside you, Shadowblast feeds it Shadow Rage, and Decimate turns the hounds loose for twenty seconds">
        <defs><marker id="whArrH" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${impGlyph(130, 86)}${impGlyph(165, 86)}${impGlyph(200, 86)}
        <text class="ph" x="165" y="118" text-anchor="middle">THE PACK</text>
        <text class="ph2" x="165" y="132" text-anchor="middle">a Shadowhound is permanent · more can join</text>
        <path class="branch" d="M230 78 C 300 44, 390 40, 460 52" marker-end="url(#whArrH)"/>
        <path class="refresh" d="M477 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="490" y="100" text-anchor="middle">FEED</text>
        <text class="ph2" x="490" y="114" text-anchor="middle">Shadowblast grants Shadow Rage</text>
        <path class="branch" d="M518 56 C 580 44, 630 46, 686 58" marker-end="url(#whArrH)"/>
        <rect class="wh-window" x="696" y="44" width="200" height="64" rx="2"/>
        <text class="wh-window-lab" x="796" y="70" text-anchor="middle">DECIMATE</text>
        <text class="ph2" x="796" y="88" text-anchor="middle" fill="#e4f2cd">20 s · the pack turns loose</text>
        <path class="branch" d="M796 112 C 700 158, 260 160, 140 100" marker-end="url(#whArrH)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE PACK REGROUPS</text>
      </svg>`,
      bullets: ["a Shadowhound fights beside you; more can join the pack",
        "Shadowblast feeds your hound Shadow Rage",
        "Decimate turns the pack loose for 20 seconds"],
      eyes: "your hounds · the target they are on",
    },
    "witch-hunter/black-knight": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Black Knight rhythm: parries return health and Rage, an avoided hit unlocks Desecrate, and the brands hold threat">
        <defs><marker id="whArrK" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="wh-parry" d="M140 70 L190 104 M190 70 L140 104"/>
        <text class="ph" x="165" y="126" text-anchor="middle">PARRY</text>
        <text class="ph2" x="165" y="140" text-anchor="middle">health and Rage return</text>
        <path class="branch" d="M225 80 C 300 46, 390 42, 460 54" marker-end="url(#whArrK)"/>
        <path class="refresh" d="M477 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="490" y="100" text-anchor="middle">AVOID</text>
        <text class="ph2" x="490" y="114" text-anchor="middle">a dodged hit opens the door</text>
        <path class="branch" d="M518 56 C 580 44, 630 46, 686 58" marker-end="url(#whArrK)"/>
        <rect class="wh-window" x="696" y="44" width="200" height="64" rx="2"/>
        <text class="wh-window-lab" x="796" y="70" text-anchor="middle">DESECRATE</text>
        <text class="ph2" x="796" y="88" text-anchor="middle" fill="#e4f2cd">area damage, unlocked by avoidance</text>
        <path class="branch" d="M796 112 C 700 158, 260 160, 140 108" marker-end="url(#whArrK)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE BRANDS HOLD THREAT</text>
      </svg>`,
      bullets: ["parries hand you health and Rage back",
        "avoid a hit and Desecrate unlocks",
        "your ability damage brands the target with high threat"],
      eyes: "incoming swings · the Desecrate unlock",
    },
    "witch-hunter/inquisition": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Inquisition rhythm: fire builds Dawn and physical builds Dusk, both climb to twenty, and Cycle of Despair consumes them for six seconds of power">
        <line class="thr" x1="14" y1="44" x2="500" y2="44"/><text class="thr-lab" x="14" y="38">20 · both meters</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="wh-dawn" d="M60 112 L440 52"/>
        <path class="wh-dusk" d="M60 122 L440 64"/>
        <circle class="wh-sun" cx="150" cy="98" r="5"/><circle class="wh-sun" cx="260" cy="80" r="5"/><circle class="wh-sun" cx="370" cy="63" r="5"/>
        <rect class="wh-moon" x="196" y="97" width="8" height="8" rx="1"/><rect class="wh-moon" x="306" y="80" width="8" height="8" rx="1"/><rect class="wh-moon" x="412" y="63" width="8" height="8" rx="1"/>
        <rect class="wh-window" x="540" y="48" width="220" height="78" rx="2"/>
        <text class="wh-window-lab" x="650" y="76" text-anchor="middle">CYCLE OF DESPAIR</text>
        <text class="ph2" x="650" y="94" text-anchor="middle" fill="#e4f2cd">consumes both at 20 · six seconds of power</text>
        <path class="wh-dawn" d="M800 122 L950 100"/>
        <path class="wh-dusk" d="M800 126 L950 108"/>
        <text class="ph" x="250" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">fire builds Dawn · steel builds Dusk</text>
        <text class="ph" x="875" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["fire damage builds Dawn; physical damage builds Dusk",
        "at 20 of each, Cycle of Despair consumes both for six seconds of power",
        "keep Flames of Sin burning while you work"],
      eyes: "both stack counts · the six-second window",
    },
    "stormbringer/lightning": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Lightning rhythm: Static climbs toward 100, supercharged above 70, then Arm of Thorim empties the whole bar before the stun">
        <line class="thr" x1="14" y1="32" x2="986" y2="32"/><text class="thr-lab" x="14" y="26">100 · stun</text>
        <line class="thr" x1="14" y1="62" x2="986" y2="62"/><text class="thr-lab" x="14" y="56">70 · supercharge</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="sb-climb" d="M20 122 L150 104 L180 108 L300 82 L330 86 L450 58 L480 61 L520 48 L520 126 Z"/>
        <rect class="sb-window" x="560" y="36" width="200" height="90" rx="2"/>
        <text class="sb-window-lab" x="660" y="66" text-anchor="middle">EMPTY THE BAR</text>
        <text class="ph2" x="660" y="84" text-anchor="middle" fill="#cfe6ff">Arm of Thorim spends all Static</text>
        <text class="ph2" x="660" y="98" text-anchor="middle" fill="#cfe6ff">more held · harder it hits</text>
        <path class="sb-climb" d="M800 122 L900 108 L960 100 L960 126 Z"/>
        <text class="ph" x="260" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="260" y="160" text-anchor="middle">Forked Lightning · 5 Static per enemy hit</text>
        <text class="ph" x="500" y="80" text-anchor="middle">HOLD</text>
        <text class="ph" x="880" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["Forked Lightning bounces to four enemies and gives 5 Static for each one hit",
        "above 70 your spells run Supercharged; at 100 the storm stuns you",
        "Arm of Thorim empties the whole bar — the more you held, the harder it hits"],
      eyes: "the Static bar nearing 100 · the cast bar stretching",
    },
    "stormbringer/maelstrom": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Maelstrom rhythm: Shock builds Conductive stacks to six beside the Static bar, then Torrential Wrath spends 50 Static to consume all six">
        <line class="thr" x1="14" y1="44" x2="500" y2="44"/><text class="thr-lab" x="14" y="38">6 · Conductive</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="sb-climb2" d="M60 118 L440 60"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<circle class="sb-pip" cx="${90 + i * 65}" cy="${113 - i * 9.4}" r="6"/>`).join("")}
        <path class="sb-climb2 dim" d="M60 124 L440 96"/>
        <rect class="sb-window" x="540" y="48" width="220" height="78" rx="2"/>
        <text class="sb-window-lab" x="650" y="76" text-anchor="middle">TORRENTIAL WRATH</text>
        <text class="ph2" x="650" y="94" text-anchor="middle" fill="#cfe6ff">50 Static · consumes all six stacks</text>
        <path class="sb-climb2" d="M800 122 L950 100"/>
        <text class="ph" x="250" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">Shock stacks Conductive · Static climbs beneath</text>
        <text class="ph" x="875" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["Shock builds Conductive up to six stacks, each lasting a minute",
        "Torrential Wrath spends 50 Static and consumes all six at once",
        "Stormflow drains 20 Static into an eight-second storm beam"],
      eyes: "your Conductive count · the Static bar under it",
    },
    "stormbringer/wind": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Wind rhythm: the Air Elemental feeds Static back, Unshackle spends 50 to empower it, and every later spend extends the window">
        <defs><marker id="sbArrW" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="sb-orb2" cx="160" cy="80" r="16"/><circle class="sb-orb2 faint" cx="160" cy="80" r="26"/>
        <text class="ph" x="160" y="126" text-anchor="middle">THE ELEMENTAL</text>
        <text class="ph2" x="160" y="140" text-anchor="middle">its damage feeds you 2 Static</text>
        <path class="branch" d="M200 70 C 280 42, 380 38, 460 50" marker-end="url(#sbArrW)"/>
        <path class="refresh" d="M477 60 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="490" y="98" text-anchor="middle">SPEND</text>
        <text class="ph2" x="490" y="112" text-anchor="middle">shield 40 · haste 20</text>
        <path class="branch" d="M518 54 C 580 42, 630 44, 686 56" marker-end="url(#sbArrW)"/>
        <rect class="sb-window" x="696" y="42" width="200" height="64" rx="2"/>
        <text class="sb-window-lab" x="796" y="68" text-anchor="middle">UNSHACKLE</text>
        <text class="ph2" x="796" y="86" text-anchor="middle" fill="#cfe6ff">50 Static · +25% pet damage · 15 s</text>
        <path class="branch" d="M796 110 C 700 158, 260 160, 176 100" marker-end="url(#sbArrW)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">EACH LATER SPEND ADDS 3 SECONDS</text>
      </svg>`,
      bullets: ["your Air Elemental stacks Invigoration to ten — 3% more pet damage each",
        "the pet's damage feeds 2 Static back to you",
        "Unshackle spends 50 Static: the pet hits 25% harder for 15 seconds",
        "every later Static spend adds 3 seconds to the window"],
      eyes: "the pet's Invigoration stacks · the Unshackle timer",
    },
    "reaper/domination": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Domination rhythm: Reaped Souls bank to three, the held bank guards you, then Spectral Scythe spends it all">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">3 · souls held</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="rp-line" d="M40 124 L130 124 L130 98 L250 98 L250 70 L460 70"/>
        <path class="rp-souldmk" d="M190 92 L196 98 L190 104 L184 98 Z"/>
        <path class="rp-souldmk" d="M310 64 L316 70 L310 76 L304 70 Z"/>
        <path class="rp-souldmk" d="M370 64 L376 70 L370 76 L364 70 Z"/>
        <text class="ph" x="180" y="146" text-anchor="middle">BANK</text>
        <text class="ph2" x="180" y="160" text-anchor="middle">Dreadwake hands you a whole Soul</text>
        <text class="ph" x="380" y="48" text-anchor="middle">HOLD · GUARDED</text>
        <rect class="rp-window" x="560" y="48" width="210" height="78" rx="2"/>
        <text class="rp-window-lab" x="665" y="76" text-anchor="middle">SPECTRAL SCYTHE</text>
        <text class="ph2" x="665" y="94" text-anchor="middle" fill="#dde4ea">one scythe per Soul held · 20 s</text>
        <path class="rp-line" d="M810 124 L890 124 L890 108 L960 108"/>
        <text class="ph" x="880" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["Dreadwake skips the fragment step — a whole Reaped Soul per cast",
        "holding three Souls cuts physical damage 10% and heals 1% every 2 seconds",
        "Spectral Scythe spends the whole bank: one scythe per Soul, for 20 seconds"],
      eyes: "your Soul count · the ten-second guard window",
    },
    "reaper/harvest": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Harvest rhythm: Slaughter only fires below 35% target health; Extinction lifts that gate for ten seconds">
        <defs><marker id="rpArrH" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <line class="rp-gate" x1="470" y1="40" x2="470" y2="126"/>
        <text class="thr-lab" x="470" y="32" text-anchor="middle">35% · the gate</text>
        <path class="rp-line dim" d="M40 100 L440 100"/>
        <text class="ph" x="230" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">fragments tick · Slaughter stays locked</text>
        <rect class="rp-window" x="510" y="48" width="230" height="78" rx="2"/>
        <text class="rp-window-lab" x="625" y="76" text-anchor="middle">EXECUTE</text>
        <text class="ph2" x="625" y="94" text-anchor="middle" fill="#dde4ea">Slaughter earns a Soul per strike</text>
        <path class="branch" d="M310 84 C 380 44, 470 40, 540 44" marker-end="url(#rpArrH)"/>
        <text class="ph2" x="420" y="56" text-anchor="middle">EXTINCTION · 10 s lifts the gate</text>
        <text class="ph" x="860" y="146" text-anchor="middle">…AND THE LADDER CLIMBS</text>
      </svg>`,
      bullets: ["Slaughter earns Souls, but only on a target below 35% health",
        "Extinction lifts that rule for ten seconds",
        "Crow's Harvest takes up to three Fragments off one swing"],
      eyes: "the target's health bar · whether Extinction is up",
    },
    "reaper/soul": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Soul rhythm: stalk quietly, then Endbringer floods the ladder with whole Souls for fifteen seconds">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="rp-line dim" d="M40 110 L360 110"/>
        <text class="ph" x="190" y="146" text-anchor="middle">STALK</text>
        <text class="ph2" x="190" y="160" text-anchor="middle">Dirge · 2 Fragments a swing</text>
        <rect class="rp-window" x="420" y="40" width="280" height="86" rx="2"/>
        <text class="rp-window-lab" x="560" y="68" text-anchor="middle">ENDBRINGER · 15 s</text>
        <path class="rp-wave" d="M440 122 Q 500 60 560 122 Q 620 60 680 122"/>
        <text class="ph2" x="560" y="88" text-anchor="middle" fill="#dde4ea">Dirge pours 3 Souls a cast · +30% · heals 75%</text>
        <path class="rp-line dim" d="M760 110 L960 110"/>
        <text class="ph" x="860" y="146" text-anchor="middle">RESET</text>
        <text class="ph2" x="860" y="160" text-anchor="middle">Shade slips away</text>
      </svg>`,
      bullets: ["Dirge feeds the ladder double: two Fragments a swing",
        "Endbringer runs 15 seconds — Dirge pours three whole Souls per cast",
        "a critical Murder tops the ladder with an extra Soul"],
      eyes: "the Endbringer timer · your Fragment count",
    },
    "chronomancer/infinite": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Infinite rhythm: damage-over-time ticks launch spikes, each spike speeds the next Chromatic Shard, the spiral tightens toward ten stacks">
        <defs><marker id="cmArrI" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="cm-coil" cx="200" cy="84" r="46"/>
        <circle class="cm-coil" cx="212" cy="84" r="31"/>
        <circle class="cm-coil hot" cx="222" cy="84" r="17"/>
        <text class="ph" x="200" y="150" text-anchor="middle">THE SPIRAL</text>
        <text class="ph2" x="200" y="164" text-anchor="middle">ticks launch spikes · each pass is faster</text>
        <path class="branch" d="M270 70 C 350 40, 440 38, 520 50" marker-end="url(#cmArrI)"/>
        <rect class="cm-window" x="540" y="44" width="250" height="78" rx="2"/>
        <text class="cm-window-lab" x="665" y="72" text-anchor="middle">SHARD AT SPEED</text>
        <text class="ph2" x="665" y="90" text-anchor="middle" fill="#d8f2fb">10 stacks · each cuts cast time 10% · 30 s</text>
        <text class="ph2" x="665" y="106" text-anchor="middle" fill="#d8f2fb">Melt Reality ticks every 3 s for 30</text>
        <text class="ph" x="880" y="150" text-anchor="middle">KEEP IT TURNING</text>
      </svg>`,
      bullets: ["your damage-over-time effects do the work; there is no big opener",
        "Melt Reality ticks every 3 seconds for 30, spreading a fifth of each tick nearby",
        "ticks launch spikes, and each spike shortens your next Chromatic Shard by 10% — ten deep",
        "damaging casts pull your cooldowns forward"],
      eyes: "your damage-over-time timers · your Shard stacks",
    },
    "chronomancer/artificer": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Artificer rhythm: wand attacks bank Echo Fragments, and every Fragment spent buys damage or seconds in the Continuum window">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="cm-line" d="M40 124 L110 124 L110 110 L190 110 L190 96 L270 96 L270 82 L400 82"/>
        <path class="cm-shard big" d="M150 100 L156 107 L150 114 L144 107 Z"/>
        <path class="cm-shard big" d="M230 86 L236 93 L230 100 L224 93 Z"/>
        <path class="cm-shard big" d="M310 72 L316 79 L310 86 L304 79 Z"/>
        <text class="ph" x="200" y="146" text-anchor="middle">BANK</text>
        <text class="ph2" x="200" y="160" text-anchor="middle">every wand attack banks a Fragment</text>
        <rect class="cm-window" x="500" y="44" width="270" height="82" rx="2"/>
        <text class="cm-window-lab" x="635" y="72" text-anchor="middle">CONTINUUM WINDOW</text>
        <text class="ph2" x="635" y="90" text-anchor="middle" fill="#d8f2fb">3 s base + 5 s per Fragment spent</text>
        <text class="ph2" x="635" y="106" text-anchor="middle" fill="#d8f2fb">or Shatter Echo: +40% per Fragment</text>
        <path class="cm-line" d="M810 124 L890 124 L890 110 L960 110"/>
        <text class="ph" x="885" y="146" text-anchor="middle">REBUILD</text>
      </svg>`,
      bullets: ["wand attacks are the generator — each one banks an Echo Fragment",
        "spend them on Shatter Echo: 40% harder per Fragment consumed",
        "or buy time: a Continuum spell runs 5 seconds longer per Fragment",
        "only one Continuum runs at a time — the bank buys one window"],
      eyes: "your Fragment count · the Continuum timer",
    },
    "chronomancer/time": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Time rhythm: one Aeon is active at a time and rewrites Epoch, while casts stack Endless Sands toward five">
        <defs><marker id="cmArrT" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="cm-dial" cx="180" cy="80" r="38"/>
        <line class="cm-notch" x1="180" y1="42" x2="180" y2="52"/>
        <line class="cm-notch" x1="218" y1="80" x2="208" y2="80"/>
        <line class="cm-notch" x1="180" y1="118" x2="180" y2="108"/>
        <line class="cm-notch lit" x1="142" y1="80" x2="152" y2="80"/>
        <text class="ph" x="180" y="146" text-anchor="middle">THE DIAL</text>
        <text class="ph2" x="180" y="160" text-anchor="middle">one Aeon active · it rewrites Epoch</text>
        <path class="branch" d="M240 70 C 330 40, 430 38, 510 50" marker-end="url(#cmArrT)"/>
        <rect class="cm-window" x="530" y="44" width="260" height="78" rx="2"/>
        <text class="cm-window-lab" x="660" y="72" text-anchor="middle">ENDLESS SANDS</text>
        <text class="ph2" x="660" y="90" text-anchor="middle" fill="#d8f2fb">5 stacks · each cuts 20% off Reverse Wound</text>
        <text class="ph2" x="660" y="106" text-anchor="middle" fill="#d8f2fb">Resilience: fast · Protection: shields</text>
        <text class="ph" x="880" y="150" text-anchor="middle">RETUNE</text>
      </svg>`,
      bullets: ["one Aeon is active at a time, and it rewrites what Epoch does",
        "Aeon of Resilience is the fast one: 25% less cast time, 10% less mana",
        "Aeon of Protection is the slow one: 30% of the heal becomes a shield",
        "Epoch casts stack Endless Sands — each cuts 20% off your next Reverse Wound, up to five"],
      eyes: "which Aeon is active · your Endless Sands stacks",
    },
    "venomancer/venom": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Venom rhythm: grow Fungal Growth to ten, and Mycosis lands harder for every stack">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">10 · Fungal Growth</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        ${[0,1,2,3,4].map(i => `<circle class="vn-pip" cx="${100 + i * 75}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <text class="ph" x="230" y="146" text-anchor="middle">FESTER</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">+2% periodic damage each</text>
        <rect class="vn-window" x="520" y="48" width="270" height="78" rx="2"/>
        <text class="vn-window-lab" x="655" y="76" text-anchor="middle">10 FUNGAL GROWTH</text>
        <text class="ph2" x="655" y="94" text-anchor="middle" fill="#d9f7db">Mycosis hits 20% harder per stack</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REGROW</text>
      </svg>`,
      bullets: ["Your Shadow and Nature damage grows fungus on the target: 35% chance per hit, up to ten stacks",
        "Each stack adds 2% to your periodic damage there, and it falls off after 30 seconds",
        "Mycosis is the payoff: it deals 20% more damage for every stack sitting on the target",
        "Area comes on a delay: Decay hits up to five enemies at a spot and drops a mushroom that blows 2 seconds later"],
      eyes: "the fungus stack on your target and your poison timers",
    },
    "venomancer/stalking": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Stalking rhythm: bank five Brood Marks in Spider Form, then spend them before they fall away">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">5 · Brood Marks</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4].map(i => `<circle class="vn-pip${i === 4 ? " lit" : ""}" cx="${100 + i * 70}" cy="${112 - i * 14}" r="6"/>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">STALK</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">the web fills, mark by mark</text>
        <rect class="vn-window" x="540" y="48" width="260" height="78" rx="2"/>
        <text class="vn-window-lab" x="670" y="76" text-anchor="middle">5 MARKS · SPIDER FORM</text>
        <text class="ph2" x="670" y="94" text-anchor="middle" fill="#d9f7db">Facemelter and Widowmaker scale per mark</text>
        <text class="ph" x="890" y="146" text-anchor="middle">RESPIN</text>
      </svg>`,
      bullets: ["Basic bites build the bank: Venom Fang leaves a mark for 15 seconds, up to five",
        "Finishers only work in Spider Form, and they consume the marks — more marks, bigger hit",
        "Widowmaker also cuts the target's incoming healing by 50% for 8 seconds",
        "Serpent Lord is the reach option: it adds 10 yards to some of those finishers"],
      eyes: "your Brood Mark count and the 15-second timer",
    },
    "venomancer/fortitude": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Fortitude rhythm: carry Exposed Flesh to ten, and the shed pays protection for as long as it held">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">10 · Exposed Flesh</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="vn-debt" d="M60 122 L420 60 L420 126 L60 126 Z"/>
        <text class="ph" x="230" y="146" text-anchor="middle">CARRY</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">the wound ledger fills</text>
        <rect class="vn-window" x="540" y="48" width="250" height="78" rx="2"/>
        <text class="vn-window-lab" x="665" y="76" text-anchor="middle">CLEAR AT 10</text>
        <text class="ph2" x="665" y="94" text-anchor="middle" fill="#d9f7db">−20% damage taken · up to 15 s at full</text>
        <text class="ph" x="890" y="146" text-anchor="middle">CARRY AGAIN</text>
      </svg>`,
      bullets: ["Getting hit fills the bar: each hostile attack has a 50% chance to add Exposed Flesh, and each stack hands you 10 Rage",
        "Holding stacks costs you 3% more physical damage taken each, up to ten",
        "Regrow Exoskeleton clears the whole bar for −20% damage taken, 5 seconds plus 1 per stack",
        "Expulsion is the other exit: the same stacks become poison damage around you instead"],
      eyes: "your Exposed Flesh count and your Rage",
    },
    "venomancer/vizier": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Vizier rhythm: prime the Vigil across five heals, each one landing stronger">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">5 heals · 2 charges</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4].map(i => `<circle class="vn-pip" cx="${100 + i * 70}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">PRIME</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">the countdown runs as you heal</text>
        <rect class="vn-window" x="540" y="48" width="260" height="78" rx="2"/>
        <text class="vn-window-lab" x="670" y="76" text-anchor="middle">SHADRA'S VIGIL</text>
        <text class="ph2" x="670" y="94" text-anchor="middle" fill="#d9f7db">+10% to each of five heals · Alkahest +9 s</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REPRIME</text>
      </svg>`,
      bullets: ["Prime before you heal: Serpent's Fang adds 10% to the target's next five periodic heals",
        "Alkahest holds two charges on a 12-second recharge; each one heals and adds 9 seconds to a running heal-over-time",
        "Mending Mist reaches up to eight allies within 30 yards — one player reported it out-healed most of their other heals"],
      eyes: "your two Alkahest charges and the time left on Shadra's Prayer",
    },
    "witch-doctor/voodoo": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Voodoo rhythm: store ten seconds of damage in the Threads, then Hexfire snaps it all at once">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="wd-thread" d="M60 110 C 140 90 220 122 300 96 C 340 84 380 92 420 84"/>
        <text class="ph" x="230" y="146" text-anchor="middle">STORE</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">the Threads hold 10 seconds of damage</text>
        <rect class="wd-window" x="540" y="48" width="250" height="78" rx="2"/>
        <text class="wd-window-lab" x="665" y="76" text-anchor="middle">HEXFIRE SNAP</text>
        <text class="ph2" x="665" y="94" text-anchor="middle" fill="#d2f5e6">it all lands at once · +1 Spirit</text>
        <text class="ph" x="890" y="146" text-anchor="middle">RESTRING</text>
      </svg>`,
      bullets: ["your damage leaves Threads on the enemy that quietly store part of it for 10 seconds",
        "Hexfire snaps the Threads early — the stored damage lands at once and you collect a Spirit",
        "every Spirit you hold adds 5% crit chance to Bad Juju, so the stack is worth keeping between snaps"],
      eyes: "the Thread timer · your Spirit count",
    },
    "witch-doctor/shadowhunting": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Shadowhunting rhythm: Spirits and Hunger climb side by side toward the Eclipse">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">5 · the cap</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="wh-dawn" d="M60 112 L440 52"/>
        <path class="wh-dusk" d="M60 122 L440 64"/>
        ${[0,1,2].map(i => `<circle class="wd-pip" cx="${150 + i * 110}" cy="${98 - i * 17}" r="5"/>`).join("")}
        <text class="ph" x="250" y="146" text-anchor="middle">GATHER</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">Spirits held · Hunger beside them</text>
        <rect class="wd-window" x="540" y="48" width="250" height="78" rx="2"/>
        <text class="wd-window-lab" x="665" y="76" text-anchor="middle">SPIRIT ECLIPSE</text>
        <text class="ph2" x="665" y="94" text-anchor="middle" fill="#d2f5e6">unleashes every held Spirit · five is the cap</text>
        <text class="ph" x="890" y="146" text-anchor="middle">GATHER AGAIN</text>
      </svg>`,
      bullets: ["Reclamation collects a Spirit and can be cast while you move, so the stack grows on the run",
        "Spirit Eclipse unleashes every Spirit you hold — five is the cap",
        "each active Spirit adds 5% to Malefic Arrow's damage",
        "going stealth stacks Voodoo Hunger, up to ten, for your next arrow"],
      eyes: "your Spirit count · the stealth window",
    },
    "witch-doctor/brewing": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Brewing rhythm: mix the Ingredients, and the Cauldron makes the party's healing land stronger">
        <defs><marker id="wdArrB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2].map(i => `<circle class="wd-pip" cx="${120 + i * 40}" cy="84" r="7"/>`).join("")}
        <text class="ph" x="160" y="118" text-anchor="middle">MIX</text>
        <text class="ph2" x="160" y="132" text-anchor="middle">brewed Ingredients, ready to pour</text>
        <path class="branch" d="M240 74 C 340 42, 450 40, 540 52" marker-end="url(#wdArrB)"/>
        <rect class="wd-window" x="560" y="44" width="250" height="82" rx="2"/>
        <text class="wd-window-lab" x="685" y="72" text-anchor="middle">VOODOO CAULDRON · 15 s</text>
        <text class="ph2" x="685" y="90" text-anchor="middle" fill="#d2f5e6">allies' healing received +20%</text>
        <path class="branch" d="M685 126 C 570 160, 250 160, 148 100" marker-end="url(#wdArrB)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BREW THE NEXT POT</text>
      </svg>`,
      bullets: ["you prepare Ingredients in a Cauldron first — only one of each can be active",
        "Potion Toss changes its effect to match whatever Ingredients are brewed",
        "Voodoo Cauldron drops a healing area for 15 seconds and raises allies' healing received by 20%",
        "healing with Loa's Brew shaves a second off your potion cooldowns"],
      eyes: "your active Ingredients · where the Cauldron sits",
    },
    "pyromancer/flameweaving": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Flameweaving rhythm: the Array banks an Ember every three seconds while Cinderheart doubles the Heat">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3].map(i => `<circle class="py-pip" cx="${100 + i * 50}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <text class="ph" x="190" y="146" text-anchor="middle">RESERVE</text>
        <text class="ph2" x="190" y="160" text-anchor="middle">the bank fills while you heal</text>
        <rect class="py-window" x="480" y="44" width="300" height="82" rx="2"/>
        <text class="py-window-lab" x="630" y="72" text-anchor="middle">SUNSTRIDER ARRAY · 15 s</text>
        <text class="ph2" x="630" y="90" text-anchor="middle" fill="#ffdcc9">1 Ember every 3 s · Cinderheart Heat doubled</text>
        <text class="ph" x="890" y="146" text-anchor="middle">RESERVE AGAIN</text>
      </svg>`,
      bullets: ["Embers sit in a bank until something goes wrong, and there is no fixed order to spend them in",
        "Ember Touch on a planted fire erupts it, healing 12 allies within 30 yards",
        "Healing feeds Heat as much as damage does — your Phoenix alone generates 5 Heat when it heals",
        "Sunstrider Array hands you an Ember every 3 seconds for 15 seconds, which is the window to overspend"],
      eyes: "your Ember count and the Phoenix's remaining minute",
    },
    "pyromancer/incineration": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Incineration rhythm: let the burns mature, then Fired Up makes the spenders instant while the refunds flow">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="wave" d="M80 126 Q 160 66 240 126 Z"/>
        <path class="wave" d="M260 126 Q 340 66 420 126 Z"/>
        <text class="ph" x="250" y="146" text-anchor="middle">RIPEN</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">the burns mature on the target</text>
        <rect class="py-window" x="500" y="44" width="290" height="82" rx="2"/>
        <text class="py-window-lab" x="645" y="72" text-anchor="middle">FIRED UP · 15 s</text>
        <text class="ph2" x="645" y="90" text-anchor="middle" fill="#ffdcc9">spenders instant · 30% cost refund · +20% crit</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REPLANT THE BURNS</text>
      </svg>`,
      bullets: ["Your burns do the storing — Ignite runs 21 seconds and generates 10 Heat on every tick",
        "Pyroclasm spends one Ember and eats every burn on the target for double their total periodic damage",
        "The take scales with how long those burns have already been running, so the wait is the decision",
        "Fired Up makes Ember spenders instant for 15 seconds and refunds their cost 30% of the time"],
      eyes: "how long the burns have run, and whether you are holding an Ember",
    },
    "pyromancer/draconic": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Draconic rhythm: five Embers call the Invocation, and every Heat generated pulls its cooldown closer">
        <defs><marker id="pyArrD" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2,3,4].map(i => `<circle class="py-pip${i === 4 ? " lit" : ""}" cx="${110 + i * 32}" cy="84" r="7"/>`).join("")}
        <text class="ph" x="174" y="118" text-anchor="middle">FIVE EMBERS</text>
        <text class="ph2" x="174" y="132" text-anchor="middle">every Heat pulls the cooldown 3% closer</text>
        <path class="branch" d="M280 74 C 370 42, 460 40, 540 52" marker-end="url(#pyArrD)"/>
        <rect class="py-window" x="560" y="44" width="240" height="82" rx="2"/>
        <text class="py-window-lab" x="680" y="72" text-anchor="middle">DRACONIC INVOCATION</text>
        <text class="ph2" x="680" y="90" text-anchor="middle" fill="#ffdcc9">the dragon takes the field</text>
        <path class="branch" d="M680 126 C 570 160, 250 160, 160 100" marker-end="url(#pyArrD)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">GATHER FIVE AGAIN</text>
      </svg>`,
      bullets: ["Generating Heat shaves 3% off Draconic Invocation's cooldown, once per second",
        "That cooldown pays out 5 Embers at once instead of one at a time",
        "Consuming Embers has a 30% chance to reset two big attacks and make the next one instant and free for 10 seconds",
        "Draconic Aspect raises spell damage and critical damage, and marks everything you hit while it runs"],
      eyes: "Draconic Invocation's cooldown and your Ember count",
    },
    "runemaster/runic": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Runic rhythm: brand the target for eight seconds, and the next Runeblade erupts onto everyone nearby">
        <defs><marker id="rmArrR" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="refresh" d="M130 84 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="143" y="122" text-anchor="middle">BRAND</text>
        <text class="ph2" x="143" y="136" text-anchor="middle">the mark opens · 8 s</text>
        <path class="branch" d="M210 70 C 310 40, 430 38, 530 50" marker-end="url(#rmArrR)"/>
        <rect class="rm-window" x="550" y="44" width="250" height="82" rx="2"/>
        <text class="rm-window-lab" x="675" y="72" text-anchor="middle">MARKED · 8 s</text>
        <text class="ph2" x="675" y="90" text-anchor="middle" fill="#d7e2ff">the next Runeblade erupts onto the pack</text>
        <path class="branch" d="M675 126 C 560 160, 250 160, 150 100" marker-end="url(#rmArrR)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BRAND AGAIN</text>
      </svg>`,
      bullets: ["Runic Brand marks one target for 8 seconds",
        "The next Runeblade on that target explodes for 121 + 18.5% attack power to nearby enemies",
        "Primordial Blast restores three charges, so the spend side rarely runs dry",
        "A 35% chance on your casts resets the brand, letting you mark again before the window ends"],
      eyes: "the 8-second mark, and your charge count",
    },
    "runemaster/arcane": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Arcane rhythm: sequence three glyphs upward, then Glyphic Ruin releases the active one">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">3 · the sequence</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2].map(i => `<rect class="rm-glyph" x="${120 + i * 90}" y="${100 - i * 22}" width="20" height="20" rx="3"/>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">ESCALATE</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">glyph on glyph, in order</text>
        <rect class="rm-window" x="520" y="48" width="270" height="78" rx="2"/>
        <text class="rm-window-lab" x="655" y="76" text-anchor="middle">RELEASE · ACTIVE GLYPH</text>
        <text class="ph2" x="655" y="94" text-anchor="middle" fill="#d7e2ff">Glyphic Ruin adds full spell power on top</text>
        <text class="ph" x="890" y="146" text-anchor="middle">RESEQUENCE</text>
      </svg>`,
      bullets: ["Either of your two builder casts starts the ladder with a Frost glyph",
        "Casting again while a glyph is up steps you to Flame, then to Arcane",
        "Glyphic Ruin spends the active glyph and adds 82 + 100% spell power of its own",
        "Thaumaturgy releases the same glyph, so the ladder has two exits"],
      eyes: "which glyph is active, and your release cast",
    },
    "runemaster/riftblade": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Riftblade rhythm: count the beat — every third Runeblade lands harder and transforms the next cast">
        <defs><marker id="rmArrB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2].map(i => `<circle class="rm-pip${i === 2 ? " lit" : ""}" cx="${130 + i * 40}" cy="84" r="8"/>`).join("")}
        <text class="ph" x="170" y="118" text-anchor="middle">THE BEAT</text>
        <text class="ph2" x="170" y="132" text-anchor="middle">one · two · THREE</text>
        <path class="branch" d="M250 74 C 350 42, 450 40, 540 52" marker-end="url(#rmArrB)"/>
        <rect class="rm-window" x="560" y="44" width="250" height="82" rx="2"/>
        <text class="rm-window-lab" x="685" y="72" text-anchor="middle">EVERY 3RD RUNEBLADE</text>
        <text class="ph2" x="685" y="90" text-anchor="middle" fill="#d7e2ff">+30% damage · the next cast transforms · 15 s</text>
        <path class="branch" d="M685 126 C 570 160, 250 160, 158 100" marker-end="url(#rmArrB)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">COUNT AGAIN</text>
      </svg>`,
      bullets: ["Two of your other casts refresh a Runeblade charge, so the count keeps moving",
        "Smolder makes your next three swings strike an extra time for 30% of the damage dealt",
        "Every third Runeblade deals 30% more damage and returns 388 + 30% attack power as mana",
        "That third cast also transforms your next one into Surging Slash if you use it within 15 seconds"],
      eyes: "your place in the count of three, and the 15-second transform window",
    },
    "necromancer/animation": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Animation rhythm: fill the roster, command it, and Deadly Bond can make the next Command free">
        <defs><marker id="ncArrA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <rect class="nc-slot" x="110" y="76" width="18" height="14" rx="2"/>
        <rect class="nc-slot" x="134" y="76" width="34" height="14" rx="2"/>
        <rect class="nc-slot" x="174" y="76" width="50" height="14" rx="2"/>
        <text class="ph" x="168" y="118" text-anchor="middle">FILL THE ROSTER</text>
        <text class="ph2" x="168" y="132" text-anchor="middle">Ghoul 1 · Mage 2 · Gargoyle 3</text>
        <path class="branch" d="M260 74 C 350 42, 440 40, 520 52" marker-end="url(#ncArrA)"/>
        <path class="refresh" d="M537 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="550" y="100" text-anchor="middle">COMMAND</text>
        <text class="ph2" x="550" y="114" text-anchor="middle">Runic Power spends here</text>
        <path class="branch" d="M578 56 C 630 46, 670 48, 716 58" marker-end="url(#ncArrA)"/>
        <rect class="nc-window" x="726" y="44" width="190" height="78" rx="2"/>
        <text class="nc-window-lab" x="821" y="72" text-anchor="middle">DEADLY BOND · 6 s</text>
        <text class="ph2" x="821" y="90" text-anchor="middle" fill="#dfe8cd">30% chance the next Command is free</text>
        <path class="branch" d="M821 126 C 700 160, 270 160, 158 100" marker-end="url(#ncArrA)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE ARMY MARCHES ON</text>
      </svg>`,
      bullets: ["Life Force is a standing budget, not a bar that refills. Raise: Ghoul occupies 1 of it and the largest undead occupy 3",
        "Commands are the button the whole spec pays off on. Deadly Bond gives a 30% chance your next Command within 6 seconds is free",
        "Everything gets cheaper as you go: Grave Mastery cuts the cost of Animate, Raise, and Command spells by 20%",
        "March of the Dead sends the undead forward to explode on contact and slows survivors by 70% for 3 seconds"],
      eyes: "your Life Force budget and the free-Command proc",
    },
    "necromancer/death": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Death rhythm: grow the diseases toward fifteen, and below twenty percent they hit twice as hard">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">15 · diseases</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <rect class="brick" x="60" y="112" width="200" height="12" rx="1"/>
        <rect class="brick" x="90" y="98" width="170" height="12" rx="1"/>
        <rect class="brick" x="120" y="84" width="140" height="12" rx="1"/>
        <rect class="brick" x="150" y="70" width="110" height="12" rx="1"/>
        <text class="ph" x="160" y="146" text-anchor="middle">CULTIVATE</text>
        <text class="ph2" x="160" y="160" text-anchor="middle">the garden of rot grows</text>
        <rect class="nc-window" x="520" y="44" width="270" height="82" rx="2"/>
        <text class="nc-window-lab" x="655" y="72" text-anchor="middle">TARGET BELOW 20%</text>
        <text class="ph2" x="655" y="90" text-anchor="middle" fill="#dfe8cd">diseases and Crypt Swarm deal 100% more</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REPLANT</text>
      </svg>`,
      bullets: ["Crypt Plague is the stack you grow: 10 at first, and a later passive allows 5 more",
        "Casting a Command on a diseased enemy applies Expunge, which raises your disease damage on that target by 10% and stacks twice",
        "Virulency refreshes and copies every disease on the target, and you can use it again within 10 seconds to infest a second enemy",
        "The payoff is late, not early: your diseases deal 100% more damage to enemies below 20% health"],
      eyes: "your Crypt Plague stack count and the target's health bar",
    },
    "necromancer/rime": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Rime rhythm: freeze the target for four seconds, land Glacial Impact, and the Runic Power comes back">
        <defs><marker id="ncArrR" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="refresh" d="M130 84 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="143" y="122" text-anchor="middle">FREEZE</text>
        <text class="ph2" x="143" y="136" text-anchor="middle">the gate opens for 4 seconds</text>
        <path class="branch" d="M210 70 C 310 40, 430 38, 530 50" marker-end="url(#ncArrR)"/>
        <rect class="nc-window" x="550" y="44" width="250" height="82" rx="2"/>
        <text class="nc-window-lab" x="675" y="72" text-anchor="middle">FROZEN · 4 s</text>
        <text class="ph2" x="675" y="90" text-anchor="middle" fill="#dfe8cd">Glacial Impact lands · 20 Runic Power back</text>
        <path class="branch" d="M675 126 C 560 160, 250 160, 150 100" marker-end="url(#ncArrR)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">FREEZE AGAIN</text>
      </svg>`,
      bullets: ["Frozen is the gate. Glacial Impact will not fire unless the target is Frozen",
        "Ice Barrage entombs the target for 4 seconds when it finishes, which is how you open that gate",
        "Commands feed the freeze back, with a 20% chance to reset Ice Barrage and make your next cast free within 15 seconds",
        "The payoff pays you back, generating 20 Runic Power so the loop can start again"],
      eyes: "the Frozen timer and your Runic Power bar",
    },
    "primalist/primal": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Primal rhythm: keep the two-stack bleed running, and claws and rushes hit harder while it holds">
        <defs><marker id="prArrP" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="pr-pip" cx="130" cy="84" r="7"/><circle class="pr-pip" cx="162" cy="84" r="7"/>
        <text class="ph" x="146" y="118" text-anchor="middle">REND</text>
        <text class="ph2" x="146" y="132" text-anchor="middle">the 2-stack bleed · 12 s</text>
        <path class="branch" d="M230 74 C 330 42, 450 40, 540 52" marker-end="url(#prArrP)"/>
        <rect class="pr-window" x="560" y="44" width="240" height="82" rx="2"/>
        <text class="pr-window-lab" x="680" y="72" text-anchor="middle">BLEEDING TARGET</text>
        <text class="ph2" x="680" y="90" text-anchor="middle" fill="#f2ddca">+15% claw and rush damage while it holds</text>
        <path class="branch" d="M680 126 C 570 160, 250 160, 152 100" marker-end="url(#prArrP)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">KEEP IT OPEN</text>
      </svg>`,
      bullets: ["Two of your weapon attacks apply the same bleed, and it stacks twice on the target for 12 seconds",
        "Rylak's Bite holds 2 charges on a 10-second recharge, and your smash refreshes one of them, so the wheel keeps turning",
        "Against a bleeding target your claw and rush attacks deal 15% more damage — the bleed is the gate, not the payoff",
        "The pet holds enemy attention while you heal yourself, which is why players call this the forgiving leveling route"],
      eyes: "the bleed on your target and your Rylak's Bite charges",
    },
    "primalist/geomancy": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Geomancy rhythm: bank fifteen Earthshaping, then Terrasurge consumes the whole bank">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">15 · Earthshaping</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        <text class="ph" x="230" y="146" text-anchor="middle">AMASS</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">stone on stone</text>
        <rect class="pr-window" x="520" y="48" width="270" height="78" rx="2"/>
        <text class="pr-window-lab" x="655" y="76" text-anchor="middle">TERRASURGE</text>
        <text class="ph2" x="655" y="94" text-anchor="middle" fill="#f2ddca">consumes the bank · +5% stone damage after</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REBANK</text>
      </svg>`,
      bullets: ["Casting your earth spells adds stacks; the bank climbs to 15 and each stack adds 1% spell haste for 20 seconds",
        "Every Seismic cast pushes that 20-second timer back by 4 seconds, so the bank rarely empties mid-fight",
        "Terrasurge spends the whole bank at once — the fuller the bank, the bigger the payout, at 5% per stack",
        "A 10% chance on stack generation resets your earth cooldown early, so the window can arrive off-schedule"],
      eyes: "your Earthshaping count and the 20-second stack timer",
    },
    "primalist/life": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Life rhythm: one wave splits into damage and healing, and the next Hand costs half for eight seconds">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="pr-splitline" d="M80 90 L200 90 M200 90 L290 62 M200 90 L290 118"/>
        <circle class="pr-pip" cx="80" cy="90" r="7"/>
        <text class="ph2" x="330" y="58" text-anchor="middle">the hurt</text>
        <text class="ph2" x="330" y="124" text-anchor="middle">the heal</text>
        <text class="ph" x="185" y="146" text-anchor="middle">SPLIT</text>
        <text class="ph2" x="185" y="160" text-anchor="middle">one action, two outputs</text>
        <rect class="pr-window" x="520" y="48" width="280" height="78" rx="2"/>
        <text class="pr-window-lab" x="660" y="76" text-anchor="middle">AFTER THE WAVE</text>
        <text class="ph2" x="660" y="94" text-anchor="middle" fill="#f2ddca">next Hand of the Earthmother −50% Rage · 8 s</text>
        <text class="ph" x="890" y="146" text-anchor="middle">WAVE AGAIN</text>
      </svg>`,
      bullets: ["Your melee swings pay twice: 20% of the damage you deal lands as healing on nearby allies",
        "Seismic Wave is the group beat — it heals up to 8 allies and damages enemies in a 25-yard radius",
        "Casting that wave makes your next Hand of the Earthmother cost 50% less Rage, for 8 seconds",
        "Grovekeeper's Presence adds 1% chance to hit for the whole party and raid, so the seat pays even between heals"],
      eyes: "your Rage bar and the 8-second discount after the wave",
    },
    "primalist/mountain-king": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Mountain King rhythm: hold five Earth's Rage, and Call of the Mountain pays parry and reduction while it stands">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">5 · Earth's Rage</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4].map(i => `<circle class="pr-pip${i === 4 ? " lit" : ""}" cx="${100 + i * 70}" cy="${112 - i * 14}" r="6"/>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">HOLD</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">the mountain gathers</text>
        <rect class="pr-window" x="540" y="48" width="260" height="78" rx="2"/>
        <text class="pr-window-lab" x="670" y="76" text-anchor="middle">CALL OF THE MOUNTAIN</text>
        <text class="ph2" x="670" y="94" text-anchor="middle" fill="#f2ddca">+5% parry · −5% damage taken while held</text>
        <text class="ph" x="890" y="146" text-anchor="middle">HOLD FAST</text>
      </svg>`,
      bullets: ["Getting missed feeds you: each avoided attack returns 5 Rage and shaves 1 second off your earth cooldown",
        "Quake holds 2 charges on an 8-second recharge, so you can double up on a fresh pull",
        "Stacks climb to 5 and then hold there; the fifth grants Call of the Mountain, +5% parry and -5% damage taken",
        "Unyielding Form adds 3% parry and 3% dodge, and raises your Armor from mail and plate by 25%"],
      eyes: "your Quake charges and the 5-stack gate",
    },
    "barbarian/brutality": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Brutality rhythm: hoard a doubled Energy pool, then below 35% health Decapitate spends up to one hundred of it">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">the doubled pool</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        <text class="ph" x="230" y="146" text-anchor="middle">HOARD</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">Smash restores 25% of the pool</text>
        <rect class="ba-window" x="520" y="44" width="270" height="82" rx="2"/>
        <text class="ba-window-lab" x="655" y="72" text-anchor="middle">BELOW 35% HEALTH</text>
        <text class="ph2" x="655" y="90" text-anchor="middle" fill="#ecd9be">Decapitate spends up to 100 Energy</text>
        <text class="ph2" x="655" y="106" text-anchor="middle" fill="#ecd9be">a killing blow refunds the whole bar</text>
        <text class="ph" x="890" y="146" text-anchor="middle">NEXT TARGET</text>
      </svg>`,
      bullets: ["The level 10 passive doubles your maximum Energy, so there is twice as much to hold onto",
        "Smash pays you back hard — it restores 25% of your maximum Energy",
        "Below 35% target health, Decapitate turns every leftover point of Energy into extra damage, up to 100 Energy",
        "A kill blow with Decapitate refunds 100% of your maximum Energy, so a finished target funds the next one"],
      eyes: "your Energy bar and the target's health as it nears 35%",
    },
    "barbarian/headhunting": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Headhunting rhythm: throws reset the spears, spears thrown while Enraged refill the axes, and the wheel turns">
        <defs><marker id="baArrH" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="wh-bolt" d="M120 84 l22 6 l-22 6 Z"/><path class="wh-bolt" d="M154 84 l22 6 l-22 6 Z"/>
        <text class="ph" x="150" y="118" text-anchor="middle">THROW</text>
        <text class="ph2" x="150" y="132" text-anchor="middle">30% chance to reset the Spears</text>
        <path class="branch" d="M230 74 C 320 42, 420 40, 500 52" marker-end="url(#baArrH)"/>
        <path class="refresh" d="M517 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="530" y="100" text-anchor="middle">SPEAR · ENRAGED</text>
        <path class="branch" d="M558 56 C 620 44, 660 46, 706 58" marker-end="url(#baArrH)"/>
        <rect class="ba-window" x="716" y="44" width="200" height="78" rx="2"/>
        <text class="ba-window-lab" x="816" y="72" text-anchor="middle">3 AXES BACK</text>
        <text class="ph2" x="816" y="90" text-anchor="middle" fill="#ecd9be">next 3 casts cost half · 12 s</text>
        <path class="branch" d="M816 126 C 700 160, 260 160, 150 100" marker-end="url(#baArrH)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THROW AGAIN</text>
      </svg>`,
      bullets: ["Throw Weapon is the filler, and it has a 30% chance to reset your Spear cooldowns",
        "Berserker Axe needs you Enraged, and it holds 3 charges on an 8-second recharge",
        "Spears thrown while Enraged hand all 3 axe charges back and make your next 3 casts cost 50% less Energy, for 12 seconds",
        "Gutspiller's bleed adds an extra Guts Spilled hit every 6 seconds, so it wants to stay on the target"],
      eyes: "your Enrage timer and your Berserker Axe charges",
    },
    "barbarian/ancestry": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Ancestry rhythm: the Tankard fills on its own clock, and emptying it is the trigger that pays the party">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="ba-tankard" d="M110 70 L110 118 L190 118 L190 70 M190 82 C 206 82 206 106 190 106"/>
        <path class="ba-fill" d="M116 96 L184 96 L184 114 L116 114 Z"/>
        <text class="ph" x="150" y="146" text-anchor="middle">FILL</text>
        <text class="ph2" x="150" y="160" text-anchor="middle">1 stack every 2 seconds · on its own clock</text>
        <rect class="ba-window" x="480" y="40" width="300" height="86" rx="2"/>
        <text class="ba-window-lab" x="630" y="68" text-anchor="middle">TANKARD EMPTIED</text>
        <text class="ph2" x="630" y="86" text-anchor="middle" fill="#ecd9be">a 12-yard frost cone opens</text>
        <text class="ph2" x="630" y="102" text-anchor="middle" fill="#ecd9be">party +95 attack or spell power · 15 s</text>
        <text class="ph" x="890" y="146" text-anchor="middle">IT FILLS AGAIN</text>
      </svg>`,
      bullets: ["The Tankard fills on its own clock — 1 stack every 2 seconds, whether or not you are swinging",
        "Emptying it is the trigger, not the cost: Breath of The North is only usable after you empty the Tankard",
        "Splash Zone turns that same empty into a party buff worth 95 attack or spell power for 15 seconds",
        "Ale of The God-King eats stacks to empower your Honored Ancestor and comes back sooner the more it eats"],
      eyes: "your Tankard's Fill Level and your Honored Ancestor",
    },
    "bloodmage/sanguine": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Sanguine rhythm: bank Thirst past its cap, and at ten Insatiable pays more per stack until the cash-out clears both">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">10 · Thirst</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4,5].map(i => `<circle class="bm-pip${i > 3 ? " over" : ""}" cx="${90 + i * 62}" cy="${112 - i * 13}" r="6"/>`).join("")}
        <text class="ph" x="230" y="146" text-anchor="middle">OVERDRAW</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">the bank runs past its cap</text>
        <rect class="bm-window" x="540" y="44" width="250" height="82" rx="2"/>
        <text class="bm-window-lab" x="665" y="72" text-anchor="middle">10 THIRST · INSATIABLE</text>
        <text class="ph2" x="665" y="90" text-anchor="middle" fill="#e2e2fb">+10% Vampiric Fang damage per stack</text>
        <text class="ph2" x="665" y="106" text-anchor="middle" fill="#e2e2fb">the cash-out clears Thirst and Insatiable</text>
        <text class="ph" x="890" y="146" text-anchor="middle">THIRST AGAIN</text>
      </svg>`,
      bullets: ["Spells that cost health add Thirst, and each stack shortens your casts and raises the health price",
        "At ten stacks you turn Insatiable, which keeps draining 30% of your damage until Thirst ends",
        "Vampiric Fang spends the whole stack for +10% damage per Thirst, then clears Thirst and Insatiable",
        "Cash out at nine stacks or more and your Cursed Form lasts 5 seconds longer"],
      eyes: "the Thirst counter and the Insatiable drain",
    },
    "bloodmage/accursed": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Accursed rhythm: the Cursed Form runs thirty seconds and every Assault stretches it, until Veinburst spends all eight Shards">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <rect class="bm-window" x="80" y="56" width="380" height="56" rx="2"/>
        <text class="bm-window-lab" x="230" y="80" text-anchor="middle">CURSED FORM · 30 s</text>
        <text class="ph2" x="230" y="98" text-anchor="middle" fill="#e2e2fb">every Assault adds 3 seconds</text>
        ${[0,1,2].map(i => `<line class="bm-stretch" x1="${462 + i * 16}" y1="66" x2="${462 + i * 16}" y2="102"/>`).join("")}
        <text class="ph" x="270" y="146" text-anchor="middle">STRETCH THE WINDOW</text>
        <rect class="bm-window hot" x="620" y="48" width="200" height="78" rx="2"/>
        <text class="bm-window-lab" x="720" y="76" text-anchor="middle">VEINBURST</text>
        <text class="ph2" x="720" y="94" text-anchor="middle" fill="#e2e2fb">all eight Blood Shards at once</text>
        <text class="ph" x="910" y="146" text-anchor="middle">RE-CURSE</text>
      </svg>`,
      bullets: ["The form gives you attack power from Agility and rewrites what your melee attacks do",
        "Aortic Assault adds 3 seconds to the form you are already in, so spend it inside the window",
        "Shadow damage builds Blood Shards up to eight, plus one more when it critically strikes",
        "Veinburst expends every shard at once, so reach eight before you fire it"],
      eyes: "the form timer and the shard count",
    },
    "bloodmage/eternal": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Eternal rhythm: the tank's bargain — less damage dealt for far more threat, held as long as the curse holds">
        <defs><marker id="bmArrE" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="refresh" d="M120 84 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="133" y="122" text-anchor="middle">TRADE</text>
        <text class="ph2" x="133" y="136" text-anchor="middle">−10% damage dealt</text>
        <path class="branch" d="M200 70 C 300 40, 420 38, 520 50" marker-end="url(#bmArrE)"/>
        <rect class="bm-window" x="540" y="44" width="260" height="82" rx="2"/>
        <text class="bm-window-lab" x="670" y="72" text-anchor="middle">+80% THREAT</text>
        <text class="ph2" x="670" y="90" text-anchor="middle" fill="#e2e2fb">+50% more from blood spells</text>
        <text class="ph2" x="670" y="106" text-anchor="middle" fill="#e2e2fb">held as long as Eternal Curse is up</text>
        <path class="branch" d="M670 126 C 560 160, 240 160, 140 100" marker-end="url(#bmArrE)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE BARGAIN HOLDS</text>
      </svg>`,
      bullets: ["The form trades 10% of your damage for 80% more threat, and health-cost spells add 50% more on top",
        "Rotclaw holds two charges, hits everything nearby, generates Rage, and leaves a bleed behind",
        "Critical strikes and Howl spells trigger Call of the Darkwing, which strikes the target and heals you",
        "Auto-attack criticals shave a second off several of your defensive cooldowns, so keep swinging"],
      eyes: "your 5-second taunt and the Darkwing triggers",
    },
    "bloodmage/fleshweaver": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Fleshweaver rhythm: pool Vitality to ten, then Rage-cost Mortal spells consume the whole pool, empowered">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">10 · the pool</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        ${[0,1,2,3,4].map(i => `<circle class="bm-pip" cx="${100 + i * 75}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <text class="ph" x="230" y="146" text-anchor="middle">POOL</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">healing links feed the pool</text>
        <rect class="bm-window" x="520" y="48" width="270" height="78" rx="2"/>
        <text class="bm-window-lab" x="655" y="76" text-anchor="middle">10 POOLED · EMPOWERED</text>
        <text class="ph2" x="655" y="94" text-anchor="middle" fill="#e2e2fb">Rage-cost Mortal spells consume all ten</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REPOOL</text>
      </svg>`,
      bullets: ["Dark Liturgy heals one ally and bounces its mark to as many as 10 more nearby",
        "While the mark is up, Bloodbolt and your Cursed Form attacks heal everyone carrying it for 3 seconds",
        "Spells that cost health bank Pooled Vitality, up to ten stacks",
        "A Rage-cost Mortal Form spell eats all ten stacks at once to come out empowered"],
      eyes: "who still carries the mark and your Pooled Vitality stacks",
    },
    "ranger/farstrider": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Farstrider rhythm: every fifth shot is a Falconstrike, a Horn calls it early, and the party keeps pace">
        <defs><marker id="rgArrF" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2,3,4].map(i => `<circle class="rg-pip${i === 4 ? " lit" : ""}" cx="${110 + i * 34}" cy="84" r="7"/>`).join("")}
        <text class="ph" x="178" y="118" text-anchor="middle">COUNT SHOTS</text>
        <text class="ph2" x="178" y="132" text-anchor="middle">every 5th is a Falconstrike · pays 2 Advantage</text>
        <path class="branch" d="M280 74 C 360 42, 450 40, 530 52" marker-end="url(#rgArrF)"/>
        <rect class="rg-window" x="550" y="44" width="240" height="78" rx="2"/>
        <text class="rg-window-lab" x="670" y="72" text-anchor="middle">FALCONSTRIKE</text>
        <text class="ph2" x="670" y="90" text-anchor="middle" fill="#e7f3d2">a Horn calls it now, ahead of the count</text>
        <path class="branch" d="M670 126 C 560 160, 270 160, 186 100" marker-end="url(#rgArrF)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">THE COUNT RESTARTS</text>
      </svg>`,
      bullets: ["Every fifth Quick Shot inside 15 seconds transforms, and the transformed shot pays 2 Advantage instead of 1",
        "Blowing a Horn jumps the count straight to that transformed shot and puts a Dragonhawk in the fight for 15 seconds",
        "Woodland Arrow pulls 15 seconds off that cooldown, so the shortcut comes back sooner",
        "Battle Screech gives nearby party and raid members attack or spell power for 15 seconds"],
      eyes: "your shot count toward the fifth, and the Horn cooldown",
    },
    "ranger/archery": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Archery rhythm: Advantage stacks buy Skirmish seconds, four per stack, and a full five refresh it further">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">5 · full draw</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        ${[0,1,2,3,4].map(i => `<circle class="rg-pip${i === 4 ? " lit" : ""}" cx="${100 + i * 75}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <rect class="rg-window" x="520" y="48" width="260" height="78" rx="2"/>
        <text class="rg-window-lab" x="650" y="76" text-anchor="middle">SKIRMISH · 4 s PER STACK</text>
        <text class="ph2" x="650" y="94" text-anchor="middle" fill="#e7f3d2">15% crit · 25% cheaper Focus · five refresh +5 s</text>
        <text class="ph" x="250" y="146" text-anchor="middle">DRAW</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">basic attacks notch the string</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REDRAW</text>
      </svg>`,
      bullets: ["The column on the left is Advantage — Quick Shot adds one stack each time it lands",
        "Spend the stacks on Skirmish and the window runs 4 seconds longer for every one",
        "Inside that window you crit 15% more often and every Focus cost drops 25%",
        "Precision Shot rides the same stacks, hitting harder for each one and firing from a great distance"],
      eyes: "your stack count, and the time left on Skirmish",
    },
    "ranger/brigand": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Brigand rhythm: two tracks on one timeline — the mark runs eight seconds while Advantage spenders land harder inside it">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <rect class="rg-track top" x="80" y="62" width="380" height="14" rx="2"/>
        <text class="ph2" x="270" y="56" text-anchor="middle">THE MARK · 8 s</text>
        <rect class="rg-track bot" x="120" y="92" width="90" height="14" rx="2"/>
        <rect class="rg-track bot" x="240" y="92" width="90" height="14" rx="2"/>
        <rect class="rg-track bot" x="360" y="92" width="90" height="14" rx="2"/>
        <text class="ph2" x="270" y="120" text-anchor="middle">spenders land inside it · +25%</text>
        <rect class="rg-window" x="560" y="48" width="230" height="78" rx="2"/>
        <text class="rg-window-lab" x="675" y="76" text-anchor="middle">MARKED · 8 s</text>
        <text class="ph2" x="675" y="94" text-anchor="middle" fill="#e7f3d2">in and out before it fades</text>
        <text class="ph" x="250" y="146" text-anchor="middle">OVERLAP</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">keep the spend inside the mark</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REMARK</text>
      </svg>`,
      bullets: ["The lower track is Advantage — Wild Strike adds one stack each time it lands",
        "The band above is the mark, and Flank opens it for 8 seconds",
        "Anything you spend Advantage on inside that band deals 25% more damage",
        "Assault reads your stack count on top of that, but only against a low-health target"],
      eyes: "the 8-second mark, and your stack count",
    },
    "felsworn/slayer": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Slayer rhythm: spend Felfury in pairs, crit to keep Inner Demon open, and the refunds keep the wheel turning">
        <defs><marker id="fsArrS" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2].map(i => `<g transform="translate(${120 + i * 44} 84)"><line class="fs-spair" x1="-5" y1="-8" x2="-5" y2="8"/><line class="fs-spair" x1="5" y1="-8" x2="5" y2="8"/></g>`).join("")}
        <text class="ph" x="164" y="118" text-anchor="middle">PAIRS</text>
        <text class="ph2" x="164" y="132" text-anchor="middle">three pairs bank six Felfury</text>
        <path class="branch" d="M260 74 C 350 42, 440 40, 520 52" marker-end="url(#fsArrS)"/>
        <rect class="fs-window" x="540" y="44" width="250" height="78" rx="2"/>
        <text class="fs-window-lab" x="665" y="72" text-anchor="middle">INNER DEMON</text>
        <text class="ph2" x="665" y="90" text-anchor="middle" fill="#ecdcf9">+10% dodge and crit damage · crits refund 3 Energy</text>
        <text class="ph2" x="665" y="106" text-anchor="middle" fill="#ecdcf9">spender crits add 1 s each</text>
        <path class="branch" d="M665 126 C 560 160, 270 160, 172 100" marker-end="url(#fsArrS)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BANK SIX AGAIN</text>
      </svg>`,
      bullets: ["Glaive attacks fill the bar, and Annihilan Strike alone pays two Felfury",
        "Critical strikes do double duty: an extra Felfury, plus off-hand damage on up to five nearby enemies",
        "Spend two Felfury on Azzinoth's Assault, which has a 30% chance not to consume them",
        "Inside Inner Demon, every melee critical strike refunds 3 Energy"],
      eyes: "Felfury reaching two, and whether your last strike crit",
    },
    "felsworn/infernal": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Infernal rhythm: one hit branches into more — Fel Fireball adds a Felstrike, and three spells refund twenty Energy each inside Inner Demon">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="fs-branchline" d="M80 90 L200 90 M200 90 L280 62 M200 90 L280 90 M200 90 L280 118"/>
        <circle class="fs-bnode" cx="80" cy="90" r="7"/>
        <circle class="fs-bnode" cx="280" cy="62" r="5"/><circle class="fs-bnode" cx="280" cy="90" r="5"/><circle class="fs-bnode" cx="280" cy="118" r="5"/>
        <text class="ph" x="180" y="146" text-anchor="middle">CASCADE</text>
        <text class="ph2" x="180" y="160" text-anchor="middle">one cast branches into more hits</text>
        <rect class="fs-window" x="520" y="44" width="260" height="78" rx="2"/>
        <text class="fs-window-lab" x="650" y="72" text-anchor="middle">INNER DEMON</text>
        <text class="ph2" x="650" y="90" text-anchor="middle" fill="#ecdcf9">Fel Fireball adds a Felstrike</text>
        <text class="ph2" x="650" y="106" text-anchor="middle" fill="#ecdcf9">Ruin · Sunder · Felwrath refund 20 Energy each</text>
        <text class="ph" x="890" y="146" text-anchor="middle">CHAIN ON</text>
      </svg>`,
      bullets: ["Damage-over-time ticks and critical strikes both hand back Felfury while you keep casting",
        "Bane of Chaos pays one Felfury up front, and its ticks can speed up your next three casts",
        "Ruin consumes two Felfury and deals extra damage while the window is open",
        "Open Inner Demon and three of your spells start refunding 20 Energy each"],
      eyes: "Felfury reaching two, and how much Inner Demon time is left",
    },
    "felsworn/tyrant": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Tyrant rhythm: bank Felfury behind dodges, then Inner Demon braces you and the leech pays it back">
        <line class="thr" x1="14" y1="44" x2="480" y2="44"/><text class="thr-lab" x="14" y="38">6 · banked</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="kx-climb" d="M60 122 L400 58"/>
        ${[0,1,2].map(i => `<g transform="translate(${140 + i * 90} ${104 - i * 15})"><line class="fs-spair" x1="-5" y1="-8" x2="-5" y2="8"/><line class="fs-spair" x1="5" y1="-8" x2="5" y2="8"/></g>`).join("")}
        <text class="ph" x="230" y="146" text-anchor="middle">BANK</text>
        <text class="ph2" x="230" y="160" text-anchor="middle">dodges feed Energy back while it builds</text>
        <rect class="fs-window" x="520" y="48" width="260" height="78" rx="2"/>
        <text class="fs-window-lab" x="650" y="76" text-anchor="middle">INNER DEMON · BRACED</text>
        <text class="ph2" x="650" y="94" text-anchor="middle" fill="#ecdcf9">-10% damage taken · Carve leeches 20%</text>
        <text class="ph" x="890" y="146" text-anchor="middle">REBANK</text>
      </svg>`,
      bullets: ["Felrend pays one Felfury and strikes everything within six yards",
        "Carve spends two Felfury after a 2.5-second channel, and a longer channel hits harder",
        "Every Felfury spend pulls three defensive cooldowns 1 second closer",
        "Burning Hatred instantly hands you six Felfury and leeches melee damage for 15 seconds"],
      eyes: "the Inner Demon timer, and Felfury reaching two before a channel",
    },
    "sun-cleric/piety": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Piety rhythm: Sunrise and Sunset alternate, each swap resets the other state's signature cast, and Solar Concord rides the Dawn window">
        <defs><marker id="suArrP" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <path class="su-half lit" d="M120 84 A40 40 0 0 1 200 84 Z"/>
        <path class="su-half" d="M120 92 A40 40 0 0 0 200 92 Z"/>
        <text class="ph" x="160" y="130" text-anchor="middle">ALTERNATE</text>
        <text class="ph2" x="160" y="144" text-anchor="middle">Sunrise ↔ Sunset · each swap resets the other</text>
        <path class="branch" d="M250 74 C 340 42, 440 40, 520 52" marker-end="url(#suArrP)"/>
        <rect class="su-window" x="540" y="44" width="240" height="78" rx="2"/>
        <text class="su-window-lab" x="660" y="72" text-anchor="middle">SOLAR CONCORD · 15 s</text>
        <text class="ph2" x="660" y="90" text-anchor="middle" fill="#ffedbe">resets Horusath Blast in Sunrise, Rapture in Sunset</text>
        <path class="branch" d="M660 126 C 560 160, 260 160, 176 112" marker-end="url(#suArrP)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">SWAP AGAIN</text>
      </svg>`,
      bullets: ["The state you land in is chosen by the school of the spell you cast after Dawn, not by a button",
        "You are never in both states; entering one locks out the other until the next swap",
        "Scorch Marks arrives on a 40% chance and makes your next Radiant Flame cost no mana and tick 50% faster",
        "Solar Concord runs 15 seconds and resets a different cooldown depending on which state you are standing in"],
      eyes: "which state is lit, and your Scorch Marks proc",
    },
    "sun-cleric/blessings": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Blessings rhythm: Fulfillments route outward to five allies, and Solar Invigoration amplifies the healing they take">
        <defs><marker id="suArrB" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        <circle class="su-hub" cx="160" cy="84" r="12"/>
        ${[0,1,2,3,4].map(i => {
          const a = -Math.PI/2 + (i - 2) * 0.5;
          const x = 160 + 62 * Math.cos(a), y = 84 + 62 * Math.sin(a);
          return `<line class="su-relay" x1="160" y1="84" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/><circle class="su-ally" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
        }).join("")}
        <text class="ph" x="160" y="130" text-anchor="middle">RELAY</text>
        <text class="ph2" x="160" y="144" text-anchor="middle">each Fulfillment lands on the party</text>
        <path class="branch" d="M250 74 C 340 42, 440 40, 520 52" marker-end="url(#suArrB)"/>
        <rect class="su-window" x="540" y="44" width="250" height="78" rx="2"/>
        <text class="su-window-lab" x="665" y="72" text-anchor="middle">SOLAR INVIGORATION · 15 s</text>
        <text class="ph2" x="665" y="90" text-anchor="middle" fill="#ffedbe">allies take 20% more healing · their casts Shine</text>
        <path class="branch" d="M665 126 C 560 160, 260 160, 176 108" marker-end="url(#suArrB)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BACK TO THE BUILD</text>
      </svg>`,
      bullets: ["Only one ally carries your Blessing at a time, and the Blessing talents act through that ally with either protection or a frontal hit",
        "For 15 seconds your allies take 20% more healing, and their own direct damage casts Shine for you no more than once every 2 seconds",
        "A talent chains that one step further, so an effective heal there fires Illumination at most once every 6 seconds",
        "Every Vow Fulfillment also drops Sunlight on up to 5 allies within 40 yards, lowest health first"],
      eyes: "your Blessed ally, and the Solar Invigoration timer",
    },
    "sun-cleric/seraphim": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Seraphim rhythm: Fulfillments stack block value, and Seraphic Bulwark doubles it for five blocks or ten seconds">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <rect class="brick" x="60" y="112" width="190" height="12" rx="1"/>
        <rect class="brick" x="90" y="98" width="160" height="12" rx="1"/>
        <rect class="brick" x="120" y="84" width="130" height="12" rx="1"/>
        <rect class="brick" x="150" y="70" width="100" height="12" rx="1"/>
        <rect class="brick" x="180" y="56" width="70" height="12" rx="1"/>
        <text class="ph" x="160" y="146" text-anchor="middle">STACK</text>
        <text class="ph2" x="160" y="160" text-anchor="middle">5 Fulfillments · 2% block value each</text>
        <rect class="su-window" x="480" y="44" width="280" height="82" rx="2"/>
        <text class="su-window-lab" x="620" y="72" text-anchor="middle">SERAPHIC BULWARK</text>
        <text class="ph2" x="620" y="90" text-anchor="middle" fill="#ffedbe">+100% block value · 5 blocks or 10 s</text>
        <text class="ph2" x="620" y="106" text-anchor="middle" fill="#ffedbe">2 charges · 25 s recharge</text>
        <text class="ph" x="880" y="146" text-anchor="middle">RESTACK</text>
      </svg>`,
      bullets: ["Every Vow Fulfillment adds 2% block chance for 15 seconds, stacking up to five times",
        "Dawnbreak scales with your block value, so raising block raises your damage and not only your safety",
        "Seraphic Bulwark doubles block value for 5 blocks or 10 seconds, with 2 charges on a 25-second recharge",
        "Avoiding an attack has a 20% chance to make your next Illumination instant and free, within 15 seconds"],
      eyes: "your block-chance stacks, and Seraphic Bulwark charges",
    },
    "sun-cleric/valkyrie": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Valkyrie rhythm: Fulfillments stack Sunslam ten percent at a time, and the slam lands only inside Dawn">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4].map(i => `<circle class="su-pip" cx="${100 + i * 60}" cy="${112 - i * 12}" r="6"/>`).join("")}
        <text class="ph" x="220" y="146" text-anchor="middle">BUILD</text>
        <text class="ph2" x="220" y="160" text-anchor="middle">+10% Sunslam per Fulfillment · 5 stacks</text>
        <rect class="su-window" x="500" y="40" width="280" height="86" rx="2"/>
        <text class="su-window-lab" x="640" y="66" text-anchor="middle">SUNSLAM · DAWN ONLY</text>
        <path class="wave" d="M530 122 Q 570 62 610 122 Z"/>
        <path class="wave" d="M620 122 Q 660 62 700 122 Z"/>
        <text class="ph2" x="640" y="86" text-anchor="middle" fill="#ffedbe">hits every second for 4 s · 1 s stun</text>
        <text class="ph" x="890" y="146" text-anchor="middle">WAIT FOR DAWN</text>
      </svg>`,
      bullets: ["Auto attacks generate 1 Solar Power each and hit 10% harder while your Vow is up",
        "Valkyr's Grip lets you wield a two-handed weapon in each hand and adds 6% to your chance to hit",
        "Inside the window, melee ability damage triggers an attack with each weapon",
        "Each Vow Fulfillment raises Sunslam damage by 10% for 1 minute, stacking five times"],
      eyes: "the Dawn count, and your Sunslam stacks",
    },
    "templar/crusader": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Crusader rhythm: hold Oaths on the running chain, Argent Blade renews it, Righteous Tempest spends every Oath at once">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2].map(i => `<ellipse class="tp-slink" cx="${110 + i * 46}" cy="${92 - i * 8}" rx="12" ry="9"/>`).join("")}
        <text class="ph" x="180" y="146" text-anchor="middle">HOLD THE CHAIN</text>
        <text class="ph2" x="180" y="160" text-anchor="middle">each Oath held is a buff · Argent Blade +3 s</text>
        <rect class="tp-window" x="500" y="44" width="280" height="82" rx="2"/>
        <text class="tp-window-lab" x="640" y="72" text-anchor="middle">RIGHTEOUS TEMPEST</text>
        <text class="ph2" x="640" y="90" text-anchor="middle" fill="#ffdcec">consumes every held Oath · a three-second whirl</text>
        <text class="ph2" x="640" y="106" text-anchor="middle" fill="#ffdcec">Templar Rituals drags enemies in 15 yd</text>
        <text class="ph" x="890" y="146" text-anchor="middle">SWEAR AGAIN</text>
      </svg>`,
      bullets: ["Basic strikes bank Oaths, and the finisher spends every one you are holding",
        "Argent Blade buys time: it heals you for the damage it deals and adds three seconds to the Oath Chain",
        "Melee damage has a 10% chance to reset Argent Blade and cut its Energy cost in half",
        "Righteous Tempest whirls for three seconds and pulls enemies within 15 yards into it"],
      eyes: "the Oath Chain timer and your Argent Blade reset",
    },
    "templar/oathkeeper": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Oathkeeper rhythm: Oaths are never spent, the Libram fills with delayed damage, and the wipe removes most of it">
        <line class="thr" x1="14" y1="44" x2="500" y2="44"/><text class="thr-lab" x="14" y="38">the Libram fills</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="tp-debt" d="M40 122 L440 60 L440 126 L40 126 Z"/>
        <text class="ph" x="220" y="146" text-anchor="middle">KEEP</text>
        <text class="ph2" x="220" y="160" text-anchor="middle">Oaths stay welded · damage arrives delayed</text>
        <rect class="tp-window" x="540" y="48" width="240" height="78" rx="2"/>
        <text class="tp-window-lab" x="660" y="76" text-anchor="middle">LIBRAM WIPE</text>
        <text class="ph2" x="660" y="94" text-anchor="middle" fill="#ffdcec">removes 70% of the delayed damage</text>
        <text class="ph" x="890" y="146" text-anchor="middle">IT FILLS AGAIN</text>
      </svg>`,
      bullets: ["Your Oath Breakers do not spend Oaths here — you keep every one and its buff stays up",
        "40% of the direct damage you take is held back and dealt to you over the next eight seconds",
        "Reading a Libram wipes 70% of that held damage, and each Oath Breaker cuts four seconds off the Libram cooldown",
        "Sacred Swing unlocks only after you avoid an attack, so dodging and parrying feed your offence"],
      eyes: "your delayed-damage bar and the Libram cooldown",
    },
    "templar/zealot": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Zealot rhythm: count Zealotry triggers to ten, and Chastise transforms into Divine Fury">
        <line class="thr" x1="14" y1="44" x2="520" y2="44"/><text class="thr-lab" x="14" y="38">10 · the tally</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4,5,6,7,8,9].map(i => `<circle class="tp-pip${i === 9 ? " lit" : ""}" cx="${70 + i * 44}" cy="${116 - i * 8}" r="6"/>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">TALLY</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">Righteous Upheaval carries +3% per trigger</text>
        <rect class="tp-window" x="580" y="48" width="220" height="78" rx="2"/>
        <text class="tp-window-lab" x="690" y="76" text-anchor="middle">TEN TRIGGERS</text>
        <text class="ph2" x="690" y="94" text-anchor="middle" fill="#ffdcec">Chastise becomes Divine Fury</text>
        <text class="ph" x="900" y="146" text-anchor="middle">COUNT AGAIN</text>
      </svg>`,
      bullets: ["Your off-hand auto attacks do the counting — each one triggers Zealotry",
        "Every trigger during the current Oath Chain adds 3% damage to Righteous Upheaval",
        "At ten triggers, Chastise upgrades into a stronger area strike",
        "Melee hits restore Energy, and a critical strike restores more"],
      eyes: "your Zealotry count and the Oath Chain timer",
    },
    "starcaller/moon-guard": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Moon Guard rhythm: Starburst marks the pack, spending stars pulls Starsweep back three seconds each, and bigger packs spin the loop faster">
        <defs><marker id="scArrG" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
        ${[0,1,2,3,4].map(i => `<g class="sc-star" transform="translate(${118 + i * 30} 84)"><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/></g>`).join("")}
        <text class="ph" x="178" y="116" text-anchor="middle">MARK</text>
        <text class="ph2" x="178" y="130" text-anchor="middle">Starburst · up to 8 enemies</text>
        <path class="branch" d="M270 74 C 350 42, 440 40, 520 52" marker-end="url(#scArrG)"/>
        <path class="refresh" d="M537 62 l13 -13 l13 13 l-13 13 Z"/>
        <text class="ph" x="550" y="100" text-anchor="middle">SPEND</text>
        <text class="ph2" x="550" y="114" text-anchor="middle">−3 s Starsweep per star</text>
        <path class="branch" d="M578 56 C 630 46, 670 48, 716 58" marker-end="url(#scArrG)"/>
        <rect class="sc-window" x="726" y="44" width="180" height="64" rx="2"/>
        <text class="sc-window-lab" x="816" y="70" text-anchor="middle">STARSWEEP</text>
        <text class="ph2" x="816" y="88" text-anchor="middle" fill="#efeaff">back sooner the more you marked</text>
        <path class="branch" d="M816 112 C 700 158, 280 160, 156 96" marker-end="url(#scArrG)"/>
        <text class="ph2" x="310" y="156" text-anchor="middle">BIGGER PACKS SPIN IT FASTER</text>
      </svg>`,
      bullets: ["every hit lands a star — Starburst marks up to eight enemies at once",
        "spending stars pulls Starsweep's cooldown down 3 seconds each",
        "Blanket of Stars doubles block chance and value for 8 seconds"],
      eyes: "stars on the pack · Starsweep's cooldown",
    },
    "starcaller/moon-priest": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Moon Priest rhythm: stars held on enemies become healing on consumption, and the eclipse Moonflow reaps every enemy in forty yards">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3].map(i => `<g class="sc-star" transform="translate(${110 + i * 55} ${112 - i * 12})"><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/></g>`).join("")}
        <path class="cm-line" d="M85 118 L290 66"/>
        <text class="ph" x="180" y="146" text-anchor="middle">HOLD THE STARS</text>
        <text class="ph2" x="180" y="160" text-anchor="middle">Huntress Shot lands two extra</text>
        <rect class="sc-window" x="440" y="40" width="300" height="86" rx="2"/>
        <text class="sc-window-lab" x="590" y="66" text-anchor="middle">MOONFLOW ECLIPSE · 40 YD</text>
        <path class="kx-heal" d="M470 122 C 520 66 660 66 710 122 Z"/>
        <text class="ph2" x="590" y="86" text-anchor="middle" fill="#efeaff">each star consumed heals up to 5 allies</text>
        <text class="ph" x="880" y="146" text-anchor="middle">RESEED</text>
      </svg>`,
      bullets: ["stars you consume are the heal — up to five allies around the target",
        "Huntress Shot lands two extra stars, loading several heals at once",
        "the eclipse Moonflow has no cooldown and reaches 40 yards"],
      eyes: "stars held on enemies · the eclipse window",
    },
    "starcaller/sentinel": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Sentinel rhythm: every star consumed counts up, every third shot becomes a barrage, and the eighth star supercharges Starcall">
        <line class="thr" x1="14" y1="44" x2="520" y2="44"/><text class="thr-lab" x="14" y="38">the 8th star</text>
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        ${[0,1,2,3,4,5,6,7].map(i => `<circle class="sc-pip${i === 7 ? " lit" : ""}" cx="${80 + i * 52}" cy="${116 - i * 10}" r="6"/>`).join("")}
        <text class="ph2" x="186" y="70" text-anchor="middle">every 3rd shot → Barrage</text>
        <rect class="sc-window" x="580" y="48" width="220" height="78" rx="2"/>
        <text class="sc-window-lab" x="690" y="76" text-anchor="middle">EVERY 8TH STAR</text>
        <text class="ph2" x="690" y="94" text-anchor="middle" fill="#efeaff">next Starcall +50% · 8% mana per star</text>
        <text class="ph" x="900" y="146" text-anchor="middle">COUNT AGAIN</text>
        <text class="ph" x="250" y="146" text-anchor="middle">COUNT</text>
        <text class="ph2" x="250" y="160" text-anchor="middle">each star also trims Starcall 1.5 s</text>
      </svg>`,
      bullets: ["Starfire Shot consumes stars and restores 8% of your mana per star",
        "every third shot upgrades into Starfire Barrage",
        "every eighth star makes the next Starcall hit 50% harder"],
      eyes: "the eighth-star count · the third-shot beat",
    },
    "starcaller/warden": {
      svg: `<svg viewBox="0 0 1000 168" role="img" aria-label="Warden rhythm: apply and consume alternate inside the same seconds, and star damage can make the next Astral Blade free">
        <line class="ax" x1="14" y1="126" x2="986" y2="126"/>
        <path class="sc-churn" d="M40 118 L90 74 L140 118 L190 74 L240 118 L290 74 L340 118 L390 74 L440 118"/>
        ${[0,1,2,3].map(i => `<g class="sc-star" transform="translate(${90 + i * 100} 74)"><path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"/></g>`).join("")}
        <text class="ph" x="240" y="146" text-anchor="middle">CHURN</text>
        <text class="ph2" x="240" y="160" text-anchor="middle">build and spend in the same seconds</text>
        <rect class="sc-window" x="540" y="44" width="250" height="78" rx="2"/>
        <text class="sc-window-lab" x="665" y="72" text-anchor="middle">FREE ASTRAL BLADE</text>
        <text class="ph2" x="665" y="90" text-anchor="middle" fill="#efeaff">zeroes a strike that drains 25% max mana</text>
        <text class="ph2" x="665" y="106" text-anchor="middle" fill="#efeaff">Fan of Knives · −2 s per star spent</text>
        <text class="ph" x="890" y="146" text-anchor="middle">NO PAUSE</text>
      </svg>`,
      bullets: ["critical strikes add stars — a critical Starsunder lands an extra one",
        "star damage can make your next Astral Blade free, a strike that drains 25% of your mana",
        "there is no holding phase: you build and spend in the same seconds"],
      eyes: "stars on the target · the free-blade proc",
    },
  };

  // Authored-to-fit phone redraws (S2): same topology, fewer labels, no scroll.
  const PHONE_STRIPS = {
    "cultist/godblade": `<svg viewBox="0 0 380 214" role="img" aria-label="Godblade rhythm, phone: build, hold at 60, one burst window at 100 that also endangers you, then rebuild">
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
    "knight-of-xoroth/hellfire": `<svg viewBox="0 0 380 230" role="img" aria-label="Hellfire rhythm, phone ladder: embers climb to six, a full-width unleash window, then the climb restarts">
      <defs><marker id="kxArrHp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="kx-climb" d="M20 78 L152 50"/>
      ${stripEmber(28, 76, .7)}${stripEmber(52, 71, .78)}${stripEmber(76, 66, .86)}
      ${stripEmber(100, 61, .94)}${stripEmber(124, 56, 1.02)}${stripEmber(148, 51, 1.2, true)}
      <text class="ph2" x="148" y="72" text-anchor="middle">6</text>
      <text class="ph" x="165" y="56" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="70" text-anchor="start">+1 a strike</text>
      <path class="branch" d="M44 88 L44 112" marker-end="url(#kxArrHp)"/>
      <rect class="kx-window" x="28" y="122" width="200" height="56" rx="2"/>
      <text class="kx-window-lab" x="128" y="146" text-anchor="middle">UNLEASH AT SIX</text>
      <text class="ph2" x="128" y="164" text-anchor="middle" fill="#f3cdd4">Rain of Chaos · 9 s — Form 15 s</text>
      <path class="branch" d="M234 150 C 356 144, 374 58, 250 36" marker-end="url(#kxArrHp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">the climb restarts</text>
    </svg>`,
    "knight-of-xoroth/war": `<svg viewBox="0 0 380 250" role="img" aria-label="War rhythm, phone: a ladder — Gore charges build, spending powers up the next Gores, and a free Meatsaw returns the loop to the top">
      <defs><marker id="kxArrWp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="kx-charge" cx="44" cy="48" r="7"/><circle class="kx-charge" cx="70" cy="48" r="7"/>
      <text class="ph" x="96" y="44" text-anchor="start">BUILD</text>
      <text class="ph2" x="96" y="58" text-anchor="start">Gore ×2 · 8 s</text>
      <path class="branch" d="M56 62 L56 88" marker-end="url(#kxArrWp)"/>
      <path class="refresh" d="M45 110 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="96" y="106" text-anchor="start">SPEND</text>
      <text class="ph2" x="96" y="120" text-anchor="start">a Gore charge returns</text>
      <path class="branch" d="M56 126 L56 152" marker-end="url(#kxArrWp)"/>
      <rect class="kx-window" x="28" y="162" width="200" height="52" rx="2"/>
      <text class="kx-window-lab" x="128" y="184" text-anchor="middle">BOOST WINDOW</text>
      <text class="ph2" x="128" y="202" text-anchor="middle" fill="#f3cdd4">GORES +25% · 12 s</text>
      <path class="branch" d="M234 189 C 356 182, 374 64, 250 44" marker-end="url(#kxArrWp)"/>
      <text class="ph2" x="190" y="232" text-anchor="middle">free Meatsaw · the bar refills</text>
    </svg>`,
    "knight-of-xoroth/defiance": `<svg viewBox="0 0 380 252" role="img" aria-label="Defiance rhythm, phone ladder: blocks raise imps, standing imps guard you, cashing the guard heals, then the bank refills">
      <defs><marker id="kxArrDp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="kx-line" d="M20 70 L58 70 L58 60 L98 60 L98 50 L136 50"/>
      ${impGlyph(78, 52)}${impGlyph(117, 42)}
      <text class="ph" x="165" y="54" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="68" text-anchor="start">blocks raise imps</text>
      <path class="branch" d="M44 82 L44 106" marker-end="url(#kxArrDp)"/>
      ${impGlyph(38, 124)}${impGlyph(70, 124)}${impGlyph(102, 124)}${impGlyph(134, 124)}
      <text class="ph" x="165" y="120" text-anchor="start">HOLD</text>
      <text class="ph2" x="165" y="134" text-anchor="start">standing imps soak damage</text>
      <path class="branch" d="M44 140 L44 164" marker-end="url(#kxArrDp)"/>
      <rect class="kx-window" x="28" y="174" width="200" height="54" rx="2"/>
      <text class="kx-window-lab" x="128" y="194" text-anchor="middle">CASH THE GUARD</text>
      <text class="ph2" x="128" y="212" text-anchor="middle" fill="#f3cdd4">imps → healing + a shield</text>
      <path class="branch" d="M234 201 C 356 194, 374 60, 250 38" marker-end="url(#kxArrDp)"/>
      <text class="ph2" x="190" y="244" text-anchor="middle">the bank refills</text>
    </svg>`,
    "guardian/vanguard": `<svg viewBox="0 0 380 230" role="img" aria-label="Vanguard rhythm, phone ladder: blocks stack Paragon toward ten, Heavy Blow transforms at ten, then the bank rebuilds">
      <defs><marker id="gdArrVp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="gd-line" d="M20 76 L58 76 L58 64 L98 64 L98 52 L136 52"/>
      <path class="gd-shield" d="M71 52 h12 v8 a6 6 0 0 1 -12 0 Z"/>
      <path class="gd-shield" d="M110 40 h12 v8 a6 6 0 0 1 -12 0 Z"/>
      <text class="ph" x="165" y="56" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="70" text-anchor="start">blocks stack Paragon</text>
      <path class="branch" d="M44 88 L44 112" marker-end="url(#gdArrVp)"/>
      <rect class="gd-window" x="28" y="122" width="200" height="56" rx="2"/>
      <text class="gd-window-lab" x="128" y="146" text-anchor="middle">PARAGON SMASH</text>
      <text class="ph2" x="128" y="164" text-anchor="middle" fill="#ffe0c2">Heavy Blow transforms at ten</text>
      <path class="branch" d="M234 150 C 356 144, 374 58, 250 36" marker-end="url(#gdArrVp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">the bank refills</text>
    </svg>`,
    "guardian/inspiration": `<svg viewBox="0 0 380 252" role="img" aria-label="Inspiration rhythm, phone ladder: Ballads build Tempo to three, Sound of War rings, Hero's March keeps it ringing, and the count restarts">
      <defs><marker id="gdArrIp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="gd-pip" cx="36" cy="48" r="7"/><circle class="gd-pip" cx="64" cy="48" r="7"/><circle class="gd-pip" cx="92" cy="48" r="7"/>
      <text class="ph" x="165" y="44" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Ballads · Tempo ×3</text>
      <path class="branch" d="M44 62 L44 86" marker-end="url(#gdArrIp)"/>
      <circle class="gd-burst" cx="44" cy="112" r="11"/><circle class="gd-burst faint" cx="44" cy="112" r="19"/>
      <text class="ph" x="165" y="108" text-anchor="start">SOUND OF WAR</text>
      <text class="ph2" x="165" y="122" text-anchor="start">allies hit harder</text>
      <path class="branch" d="M44 138 L44 162" marker-end="url(#gdArrIp)"/>
      <rect class="gd-window" x="28" y="172" width="200" height="54" rx="2"/>
      <text class="gd-window-lab" x="128" y="192" text-anchor="middle">HERO'S MARCH</text>
      <text class="ph2" x="128" y="210" text-anchor="middle" fill="#ffe0c2">15 s · autos keep it ringing</text>
      <path class="branch" d="M234 199 C 356 192, 374 60, 250 38" marker-end="url(#gdArrIp)"/>
      <text class="ph2" x="190" y="244" text-anchor="middle">the count restarts</text>
    </svg>`,
    "guardian/gladiator": `<svg viewBox="0 0 380 230" role="img" aria-label="Gladiator rhythm, phone ladder: Ram builds Glory to three, the boosted Ram lands, and the wheel turns again">
      <defs><marker id="gdArrGp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="gd-pip" cx="36" cy="48" r="7"/><circle class="gd-pip" cx="64" cy="48" r="7"/><circle class="gd-pip" cx="92" cy="48" r="7"/>
      <text class="ph" x="165" y="44" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Ram builds Glory · ×3</text>
      <path class="branch" d="M44 62 L44 86" marker-end="url(#gdArrGp)"/>
      <path class="refresh" d="M33 108 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="104" text-anchor="start">NET</text>
      <text class="ph2" x="165" y="118" text-anchor="start">Centurion Strike crits</text>
      <path class="branch" d="M44 122 L44 146" marker-end="url(#gdArrGp)"/>
      <rect class="gd-window" x="28" y="156" width="200" height="54" rx="2"/>
      <text class="gd-window-lab" x="128" y="176" text-anchor="middle">BOOSTED RAM</text>
      <text class="ph2" x="128" y="194" text-anchor="middle" fill="#ffe0c2">at three Glory</text>
      <path class="branch" d="M234 183 C 356 176, 374 56, 250 36" marker-end="url(#gdArrGp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">the wheel turns again</text>
    </svg>`,
    "witch-hunter/boltslinger": `<svg viewBox="0 0 380 250" role="img" aria-label="Boltslinger rhythm, phone ladder: extra shots build Rage, Damnation converts the bar, Twilight Frenzy is the moving channel">
      <defs><marker id="whArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wh-bolt" d="M28 42 l20 6 l-20 6 Z"/><path class="wh-bolt" d="M58 42 l20 6 l-20 6 Z"/><path class="wh-bolt" d="M88 42 l20 6 l-20 6 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="58" text-anchor="start">extra shots build Rage</text>
      <path class="branch" d="M44 62 L44 86" marker-end="url(#whArrBp)"/>
      <path class="refresh" d="M33 108 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="104" text-anchor="start">DAMNATION</text>
      <text class="ph2" x="165" y="118" text-anchor="start">the bar becomes damage</text>
      <path class="branch" d="M44 122 L44 146" marker-end="url(#whArrBp)"/>
      <rect class="wh-window" x="28" y="156" width="200" height="54" rx="2"/>
      <text class="wh-window-lab" x="128" y="176" text-anchor="middle">TWILIGHT FRENZY</text>
      <text class="ph2" x="128" y="194" text-anchor="middle" fill="#e4f2cd">a channel you can move in</text>
      <path class="branch" d="M234 183 C 356 176, 374 56, 250 36" marker-end="url(#whArrBp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">the hunt continues</text>
    </svg>`,
    "witch-hunter/houndmaster": `<svg viewBox="0 0 380 250" role="img" aria-label="Houndmaster rhythm, phone ladder: the pack fights beside you, Shadowblast feeds it, Decimate turns the hounds loose">
      <defs><marker id="whArrHp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${impGlyph(38, 48)}${impGlyph(70, 48)}${impGlyph(102, 48)}
      <text class="ph" x="165" y="44" text-anchor="start">THE PACK</text>
      <text class="ph2" x="165" y="58" text-anchor="start">more hounds can join</text>
      <path class="branch" d="M44 62 L44 86" marker-end="url(#whArrHp)"/>
      <path class="refresh" d="M33 108 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="104" text-anchor="start">FEED</text>
      <text class="ph2" x="165" y="118" text-anchor="start">Shadowblast · Shadow Rage</text>
      <path class="branch" d="M44 122 L44 146" marker-end="url(#whArrHp)"/>
      <rect class="wh-window" x="28" y="156" width="200" height="54" rx="2"/>
      <text class="wh-window-lab" x="128" y="176" text-anchor="middle">DECIMATE</text>
      <text class="ph2" x="128" y="194" text-anchor="middle" fill="#e4f2cd">20 s · the pack turns loose</text>
      <path class="branch" d="M234 183 C 356 176, 374 56, 250 36" marker-end="url(#whArrHp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">the pack regroups</text>
    </svg>`,
    "witch-hunter/black-knight": `<svg viewBox="0 0 380 250" role="img" aria-label="Black Knight rhythm, phone ladder: parries return health and Rage, an avoided hit unlocks Desecrate, the brands hold threat">
      <defs><marker id="whArrKp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wh-parry" d="M30 38 L60 60 M60 38 L30 60"/>
      <text class="ph" x="165" y="44" text-anchor="start">PARRY</text>
      <text class="ph2" x="165" y="58" text-anchor="start">health and Rage return</text>
      <path class="branch" d="M44 68 L44 90" marker-end="url(#whArrKp)"/>
      <path class="refresh" d="M33 110 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="106" text-anchor="start">AVOID</text>
      <text class="ph2" x="165" y="120" text-anchor="start">a dodge opens the door</text>
      <path class="branch" d="M44 124 L44 146" marker-end="url(#whArrKp)"/>
      <rect class="wh-window" x="28" y="156" width="200" height="54" rx="2"/>
      <text class="wh-window-lab" x="128" y="176" text-anchor="middle">DESECRATE</text>
      <text class="ph2" x="128" y="194" text-anchor="middle" fill="#e4f2cd">unlocked by avoidance</text>
      <path class="branch" d="M234 183 C 356 176, 374 56, 250 36" marker-end="url(#whArrKp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">the brands hold threat</text>
    </svg>`,
    "witch-hunter/inquisition": `<svg viewBox="0 0 380 250" role="img" aria-label="Inquisition rhythm, phone ladder: Dawn and Dusk climb to twenty, Cycle of Despair consumes both for six seconds">
      <defs><marker id="whArrIp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wh-dawn" d="M24 62 L146 40"/>
      <path class="wh-dusk" d="M24 74 L146 52"/>
      <circle class="wh-sun" cx="70" cy="53" r="4.5"/><rect class="wh-moon" x="100" y="55" width="7" height="7" rx="1"/>
      <text class="ph" x="165" y="40" text-anchor="start">BUILD</text>
      <text class="ph2" x="165" y="54" text-anchor="start">fire builds Dawn</text>
      <text class="ph2" x="165" y="67" text-anchor="start">steel builds Dusk</text>
      <path class="branch" d="M44 86 L44 110" marker-end="url(#whArrIp)"/>
      <text class="thr-lab" x="34" y="130" text-anchor="start">20 · both</text>
      <path class="branch" d="M44 136 L44 148" marker-end="url(#whArrIp)"/>
      <rect class="wh-window" x="28" y="156" width="200" height="54" rx="2"/>
      <text class="wh-window-lab" x="128" y="176" text-anchor="middle">CYCLE OF DESPAIR</text>
      <text class="ph2" x="128" y="194" text-anchor="middle" fill="#e4f2cd">consumes both · 6 s of power</text>
      <path class="branch" d="M234 183 C 356 176, 374 56, 250 36" marker-end="url(#whArrIp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">the meters restart</text>
    </svg>`,
    "stormbringer/lightning": `<svg viewBox="0 0 380 230" role="img" aria-label="Lightning rhythm, phone ladder: Static climbs supercharged toward 100, then Arm of Thorim empties the bar">
      <defs><marker id="sbArrLp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="sb-climb" d="M20 78 L150 48 L150 80 L20 80 Z"/>
      <text class="ph" x="165" y="52" text-anchor="start">BUILD · HOLD</text>
      <text class="ph2" x="165" y="66" text-anchor="start">supercharged above 70</text>
      <path class="branch" d="M44 90 L44 112" marker-end="url(#sbArrLp)"/>
      <rect class="sb-window" x="28" y="122" width="200" height="56" rx="2"/>
      <text class="sb-window-lab" x="128" y="146" text-anchor="middle">EMPTY THE BAR</text>
      <text class="ph2" x="128" y="164" text-anchor="middle" fill="#cfe6ff">Arm of Thorim · all Static</text>
      <path class="branch" d="M234 150 C 356 144, 374 58, 250 36" marker-end="url(#sbArrLp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">the climb restarts</text>
    </svg>`,
    "stormbringer/maelstrom": `<svg viewBox="0 0 380 230" role="img" aria-label="Maelstrom rhythm, phone ladder: Conductive stacks to six, then Torrential Wrath consumes all of them">
      <defs><marker id="sbArrMp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle class="sb-pip" cx="${34 + i * 24}" cy="${64 - i * 3}" r="6"/>`).join("")}
      <text class="ph" x="200" y="48" text-anchor="start">BUILD</text>
      <text class="ph2" x="200" y="62" text-anchor="start">Shock · six stacks</text>
      <path class="branch" d="M44 84 L44 108" marker-end="url(#sbArrMp)"/>
      <rect class="sb-window" x="28" y="118" width="200" height="56" rx="2"/>
      <text class="sb-window-lab" x="128" y="142" text-anchor="middle">TORRENTIAL WRATH</text>
      <text class="ph2" x="128" y="160" text-anchor="middle" fill="#cfe6ff">50 Static · all six at once</text>
      <path class="branch" d="M234 146 C 356 140, 374 56, 250 36" marker-end="url(#sbArrMp)"/>
      <text class="ph2" x="190" y="192" text-anchor="middle">the stacks rebuild</text>
    </svg>`,
    "stormbringer/wind": `<svg viewBox="0 0 380 250" role="img" aria-label="Wind rhythm, phone ladder: the elemental feeds Static, spends flow back into the pet, Unshackle extends with each spend">
      <defs><marker id="sbArrWp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="sb-orb2" cx="44" cy="50" r="12"/><circle class="sb-orb2 faint" cx="44" cy="50" r="20"/>
      <text class="ph" x="165" y="44" text-anchor="start">THE ELEMENTAL</text>
      <text class="ph2" x="165" y="58" text-anchor="start">feeds you 2 Static</text>
      <path class="branch" d="M44 76 L44 98" marker-end="url(#sbArrWp)"/>
      <path class="refresh" d="M33 120 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="116" text-anchor="start">SPEND</text>
      <text class="ph2" x="165" y="130" text-anchor="start">shield 40 · haste 20</text>
      <path class="branch" d="M44 134 L44 156" marker-end="url(#sbArrWp)"/>
      <rect class="sb-window" x="28" y="166" width="200" height="54" rx="2"/>
      <text class="sb-window-lab" x="128" y="186" text-anchor="middle">UNSHACKLE</text>
      <text class="ph2" x="128" y="204" text-anchor="middle" fill="#cfe6ff">+25% pet damage · 15 s</text>
      <path class="branch" d="M234 193 C 356 186, 374 58, 250 36" marker-end="url(#sbArrWp)"/>
      <text class="ph2" x="190" y="238" text-anchor="middle">each later spend adds 3 seconds</text>
    </svg>`,
    "reaper/domination": `<svg viewBox="0 0 380 230" role="img" aria-label="Domination rhythm, phone ladder: bank three Souls, the bank guards you, Spectral Scythe spends it all">
      <defs><marker id="rpArrDp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="rp-souldmk" d="M36 48 L43 55 L36 62 L29 55 Z"/>
      <path class="rp-souldmk" d="M66 48 L73 55 L66 62 L59 55 Z"/>
      <path class="rp-souldmk" d="M96 48 L103 55 L96 62 L89 55 Z"/>
      <text class="ph" x="165" y="46" text-anchor="start">BANK · HOLD</text>
      <text class="ph2" x="165" y="60" text-anchor="start">three Souls guard you</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#rpArrDp)"/>
      <rect class="rp-window" x="28" y="110" width="200" height="56" rx="2"/>
      <text class="rp-window-lab" x="128" y="134" text-anchor="middle">SPECTRAL SCYTHE</text>
      <text class="ph2" x="128" y="152" text-anchor="middle" fill="#dde4ea">one scythe per Soul · 20 s</text>
      <path class="branch" d="M234 138 C 356 132, 374 54, 250 34" marker-end="url(#rpArrDp)"/>
      <text class="ph2" x="190" y="184" text-anchor="middle">the bank refills</text>
    </svg>`,
    "reaper/harvest": `<svg viewBox="0 0 380 230" role="img" aria-label="Harvest rhythm, phone ladder: the 35% gate, Extinction lifts it, Slaughter executes">
      <defs><marker id="rpArrHp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <line class="rp-gate" x1="44" y1="36" x2="44" y2="64"/>
      <text class="ph" x="165" y="44" text-anchor="start">THE GATE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Slaughter needs 35% health</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#rpArrHp)"/>
      <path class="refresh" d="M33 122 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="118" text-anchor="start">EXTINCTION</text>
      <text class="ph2" x="165" y="132" text-anchor="start">lifts the gate · 10 s</text>
      <path class="branch" d="M44 136 L44 158" marker-end="url(#rpArrHp)"/>
      <rect class="rp-window" x="28" y="168" width="200" height="54" rx="2"/>
      <text class="rp-window-lab" x="128" y="188" text-anchor="middle">EXECUTE</text>
      <text class="ph2" x="128" y="206" text-anchor="middle" fill="#dde4ea">a Soul per Slaughter</text>
      <path class="branch" d="M234 195 C 356 188, 374 56, 250 36" marker-end="url(#rpArrHp)"/>
      <text class="ph2" x="300" y="226" text-anchor="middle">the ladder climbs</text>
    </svg>`,
    "reaper/soul": `<svg viewBox="0 0 380 230" role="img" aria-label="Soul rhythm, phone ladder: stalk, then Endbringer floods the ladder for fifteen seconds">
      <defs><marker id="rpArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="rp-line dim" d="M20 52 L140 52"/>
      <text class="ph" x="165" y="44" text-anchor="start">STALK</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Dirge · 2 Fragments a swing</text>
      <path class="branch" d="M44 68 L44 92" marker-end="url(#rpArrSp)"/>
      <rect class="rp-window" x="28" y="102" width="200" height="66" rx="2"/>
      <text class="rp-window-lab" x="128" y="124" text-anchor="middle">ENDBRINGER · 15 s</text>
      <path class="rp-wave" d="M44 162 Q 86 122 128 162 Q 170 122 212 162"/>
      <text class="ph2" x="128" y="142" text-anchor="middle" fill="#dde4ea">3 Souls a cast · +30%</text>
      <path class="branch" d="M234 135 C 356 128, 374 54, 250 34" marker-end="url(#rpArrSp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">Shade slips away · reset</text>
    </svg>`,
    "chronomancer/infinite": `<svg viewBox="0 0 380 230" role="img" aria-label="Infinite rhythm, phone ladder: the DoT spiral tightens, each spike speeds the next Shard toward ten stacks">
      <defs><marker id="cmArrIp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="cm-coil" cx="60" cy="58" r="28"/>
      <circle class="cm-coil" cx="67" cy="58" r="18"/>
      <circle class="cm-coil hot" cx="73" cy="58" r="9"/>
      <text class="ph" x="165" y="48" text-anchor="start">THE SPIRAL</text>
      <text class="ph2" x="165" y="62" text-anchor="start">each pass is faster</text>
      <path class="branch" d="M44 92 L44 116" marker-end="url(#cmArrIp)"/>
      <rect class="cm-window" x="28" y="126" width="200" height="56" rx="2"/>
      <text class="cm-window-lab" x="128" y="150" text-anchor="middle">SHARD AT SPEED</text>
      <text class="ph2" x="128" y="168" text-anchor="middle" fill="#d8f2fb">10 stacks · -10% cast each</text>
      <path class="branch" d="M234 154 C 356 148, 374 58, 250 36" marker-end="url(#cmArrIp)"/>
      <text class="ph2" x="190" y="200" text-anchor="middle">keep the ticks turning</text>
    </svg>`,
    "chronomancer/artificer": `<svg viewBox="0 0 380 230" role="img" aria-label="Artificer rhythm, phone ladder: wand attacks bank Fragments, the Continuum window spends them for seconds">
      <defs><marker id="cmArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="cm-shard big" d="M36 50 L43 58 L36 66 L29 58 Z"/>
      <path class="cm-shard big" d="M66 50 L73 58 L66 66 L59 58 Z"/>
      <path class="cm-shard big" d="M96 50 L103 58 L96 66 L89 58 Z"/>
      <text class="ph" x="165" y="48" text-anchor="start">BANK</text>
      <text class="ph2" x="165" y="62" text-anchor="start">a Fragment per wand attack</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#cmArrAp)"/>
      <rect class="cm-window" x="28" y="114" width="200" height="60" rx="2"/>
      <text class="cm-window-lab" x="128" y="136" text-anchor="middle">CONTINUUM WINDOW</text>
      <text class="ph2" x="128" y="152" text-anchor="middle" fill="#d8f2fb">3 s + 5 s per Fragment</text>
      <text class="ph2" x="128" y="166" text-anchor="middle" fill="#d8f2fb">or +40% Shatter Echo each</text>
      <path class="branch" d="M234 144 C 356 138, 374 56, 250 36" marker-end="url(#cmArrAp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">the bank refills</text>
    </svg>`,
    "chronomancer/time": `<svg viewBox="0 0 380 230" role="img" aria-label="Time rhythm, phone ladder: the Aeon dial sets the mode, Endless Sands stacks toward five">
      <defs><marker id="cmArrTp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="cm-dial" cx="48" cy="54" r="22"/>
      <line class="cm-notch" x1="48" y1="32" x2="48" y2="38"/>
      <line class="cm-notch" x1="70" y1="54" x2="64" y2="54"/>
      <line class="cm-notch" x1="48" y1="76" x2="48" y2="70"/>
      <line class="cm-notch lit" x1="26" y1="54" x2="32" y2="54"/>
      <text class="ph" x="165" y="48" text-anchor="start">THE DIAL</text>
      <text class="ph2" x="165" y="62" text-anchor="start">one Aeon rewrites Epoch</text>
      <path class="branch" d="M44 84 L44 108" marker-end="url(#cmArrTp)"/>
      <rect class="cm-window" x="28" y="118" width="200" height="56" rx="2"/>
      <text class="cm-window-lab" x="128" y="142" text-anchor="middle">ENDLESS SANDS</text>
      <text class="ph2" x="128" y="160" text-anchor="middle" fill="#d8f2fb">5 stacks · -20% Reverse Wound</text>
      <path class="branch" d="M234 146 C 356 140, 374 56, 250 36" marker-end="url(#cmArrTp)"/>
      <text class="ph2" x="190" y="200" text-anchor="middle">retune, and the sands rebuild</text>
    </svg>`,
    "venomancer/venom": `<svg viewBox="0 0 380 230" role="img" aria-label="Venom rhythm, phone ladder: grow the rot to ten, Mycosis scales with it">
      <defs><marker id="vnArrVp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="vn-pip" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">FESTER</text>
      <text class="ph2" x="185" y="58" text-anchor="start">+2% periodic each</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#vnArrVp)"/>
      <rect class="vn-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="vn-window-lab" x="128" y="130" text-anchor="middle">10 FUNGAL GROWTH</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#d9f7db">Mycosis +20% per stack</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#vnArrVp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">regrow</text>
    </svg>`,
    "venomancer/stalking": `<svg viewBox="0 0 380 230" role="img" aria-label="Stalking rhythm, phone ladder: five marks in Spider Form, spent before they fade">
      <defs><marker id="vnArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="vn-pip${i === 4 ? " lit" : ""}" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">STALK</text>
      <text class="ph2" x="185" y="58" text-anchor="start">mark by mark</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#vnArrSp)"/>
      <rect class="vn-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="vn-window-lab" x="128" y="130" text-anchor="middle">5 MARKS · SPIDER FORM</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#d9f7db">spenders scale per mark</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#vnArrSp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">respin the web</text>
    </svg>`,
    "venomancer/fortitude": `<svg viewBox="0 0 380 230" role="img" aria-label="Fortitude rhythm, phone ladder: carry the Flesh to ten, and the shed protects you">
      <defs><marker id="vnArrFp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="vn-debt" d="M20 66 L140 44 L140 68 L20 68 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">CARRY</text>
      <text class="ph2" x="165" y="58" text-anchor="start">the ledger fills to ten</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#vnArrFp)"/>
      <rect class="vn-window" x="28" y="114" width="200" height="58" rx="2"/>
      <text class="vn-window-lab" x="128" y="136" text-anchor="middle">CLEAR AT 10</text>
      <text class="ph2" x="128" y="154" text-anchor="middle" fill="#d9f7db">−20% taken · up to 15 s</text>
      <path class="branch" d="M234 143 C 356 136, 374 54, 250 34" marker-end="url(#vnArrFp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">carry again</text>
    </svg>`,
    "venomancer/vizier": `<svg viewBox="0 0 380 230" role="img" aria-label="Vizier rhythm, phone ladder: prime the Vigil across five heals">
      <defs><marker id="vnArrZp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="vn-pip" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">PRIME</text>
      <text class="ph2" x="185" y="58" text-anchor="start">five heals · two charges</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#vnArrZp)"/>
      <rect class="vn-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="vn-window-lab" x="128" y="130" text-anchor="middle">SHADRA'S VIGIL</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#d9f7db">+10% to each heal</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#vnArrZp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">reprime</text>
    </svg>`,
    "witch-doctor/voodoo": `<svg viewBox="0 0 380 230" role="img" aria-label="Voodoo rhythm, phone ladder: store the damage in the Threads, then snap it">
      <defs><marker id="wdArrVp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wd-thread" d="M20 58 C 55 46 90 62 125 50"/>
      <text class="ph" x="165" y="44" text-anchor="start">STORE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">10 seconds in the Threads</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#wdArrVp)"/>
      <rect class="wd-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="wd-window-lab" x="128" y="130" text-anchor="middle">HEXFIRE SNAP</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#d2f5e6">it all lands at once · +1 Spirit</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#wdArrVp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">restring</text>
    </svg>`,
    "witch-doctor/shadowhunting": `<svg viewBox="0 0 380 230" role="img" aria-label="Shadowhunting rhythm, phone ladder: Spirits and Hunger climb together toward the Eclipse">
      <defs><marker id="wdArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wh-dawn" d="M20 60 L140 42"/>
      <path class="wh-dusk" d="M20 70 L140 52"/>
      <text class="ph" x="165" y="44" text-anchor="start">GATHER</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Spirits · Hunger beside them</text>
      <path class="branch" d="M44 82 L44 106" marker-end="url(#wdArrSp)"/>
      <rect class="wd-window" x="28" y="116" width="200" height="58" rx="2"/>
      <text class="wd-window-lab" x="128" y="138" text-anchor="middle">SPIRIT ECLIPSE</text>
      <text class="ph2" x="128" y="156" text-anchor="middle" fill="#d2f5e6">every held Spirit · cap five</text>
      <path class="branch" d="M234 145 C 356 138, 374 54, 250 34" marker-end="url(#wdArrSp)"/>
      <text class="ph2" x="190" y="198" text-anchor="middle">gather again</text>
    </svg>`,
    "witch-doctor/brewing": `<svg viewBox="0 0 380 230" role="img" aria-label="Brewing rhythm, phone ladder: mix the Ingredients, the Cauldron strengthens the party's healing">
      <defs><marker id="wdArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<circle class="wd-pip" cx="${38 + i * 30}" cy="52" r="6.5"/>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">MIX</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Ingredients, ready to pour</text>
      <path class="branch" d="M44 70 L44 94" marker-end="url(#wdArrBp)"/>
      <rect class="wd-window" x="28" y="104" width="200" height="58" rx="2"/>
      <text class="wd-window-lab" x="128" y="126" text-anchor="middle">VOODOO CAULDRON</text>
      <text class="ph2" x="128" y="144" text-anchor="middle" fill="#d2f5e6">healing received +20% · 15 s</text>
      <path class="branch" d="M234 133 C 356 126, 374 52, 250 34" marker-end="url(#wdArrBp)"/>
      <text class="ph2" x="190" y="186" text-anchor="middle">brew the next pot</text>
    </svg>`,
    "pyromancer/flameweaving": `<svg viewBox="0 0 380 230" role="img" aria-label="Flameweaving rhythm, phone ladder: the Array banks Embers while Cinderheart doubles Heat">
      <defs><marker id="pyArrFp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3].map(i => `<circle class="py-pip" cx="${34 + i * 26}" cy="${56 - i * 3}" r="5.5"/>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">RESERVE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">the bank fills as you heal</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#pyArrFp)"/>
      <rect class="py-window" x="28" y="106" width="200" height="60" rx="2"/>
      <text class="py-window-lab" x="128" y="128" text-anchor="middle">SUNSTRIDER ARRAY</text>
      <text class="ph2" x="128" y="144" text-anchor="middle" fill="#ffdcc9">1 Ember / 3 s · 15 s</text>
      <text class="ph2" x="128" y="158" text-anchor="middle" fill="#ffdcc9">Cinderheart Heat doubled</text>
      <path class="branch" d="M234 136 C 356 130, 374 52, 250 34" marker-end="url(#pyArrFp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">reserve again</text>
    </svg>`,
    "pyromancer/incineration": `<svg viewBox="0 0 380 230" role="img" aria-label="Incineration rhythm, phone ladder: ripen the burns, then Fired Up makes everything instant">
      <defs><marker id="pyArrIp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wave" d="M20 66 Q 50 38 80 66 Z"/>
      <path class="wave" d="M88 66 Q 118 38 148 66 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">RIPEN</text>
      <text class="ph2" x="165" y="58" text-anchor="start">the burns mature</text>
      <path class="branch" d="M44 78 L44 102" marker-end="url(#pyArrIp)"/>
      <rect class="py-window" x="28" y="112" width="200" height="60" rx="2"/>
      <text class="py-window-lab" x="128" y="134" text-anchor="middle">FIRED UP · 15 s</text>
      <text class="ph2" x="128" y="150" text-anchor="middle" fill="#ffdcc9">instant spenders · 30% refund</text>
      <text class="ph2" x="128" y="164" text-anchor="middle" fill="#ffdcc9">+20% crit</text>
      <path class="branch" d="M234 142 C 356 136, 374 54, 250 34" marker-end="url(#pyArrIp)"/>
      <text class="ph2" x="190" y="194" text-anchor="middle">replant the burns</text>
    </svg>`,
    "pyromancer/draconic": `<svg viewBox="0 0 380 230" role="img" aria-label="Draconic rhythm, phone ladder: five Embers call the Invocation, Heat pulls it closer">
      <defs><marker id="pyArrDp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="py-pip${i === 4 ? " lit" : ""}" cx="${34 + i * 26}" cy="52" r="6"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">FIVE EMBERS</text>
      <text class="ph2" x="185" y="58" text-anchor="start">Heat pulls it 3% closer</text>
      <path class="branch" d="M44 70 L44 94" marker-end="url(#pyArrDp)"/>
      <rect class="py-window" x="28" y="104" width="200" height="58" rx="2"/>
      <text class="py-window-lab" x="128" y="126" text-anchor="middle">DRACONIC INVOCATION</text>
      <text class="ph2" x="128" y="144" text-anchor="middle" fill="#ffdcc9">the dragon takes the field</text>
      <path class="branch" d="M234 133 C 356 126, 374 52, 250 34" marker-end="url(#pyArrDp)"/>
      <text class="ph2" x="190" y="186" text-anchor="middle">gather five again</text>
    </svg>`,
    "runemaster/runic": `<svg viewBox="0 0 380 230" role="img" aria-label="Runic rhythm, phone ladder: brand the target, the next Runeblade erupts">
      <defs><marker id="rmArrRp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="refresh" d="M33 52 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">BRAND</text>
      <text class="ph2" x="165" y="58" text-anchor="start">the mark opens · 8 s</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#rmArrRp)"/>
      <rect class="rm-window" x="28" y="106" width="200" height="58" rx="2"/>
      <text class="rm-window-lab" x="128" y="128" text-anchor="middle">MARKED · 8 s</text>
      <text class="ph2" x="128" y="146" text-anchor="middle" fill="#d7e2ff">the next Runeblade erupts</text>
      <path class="branch" d="M234 135 C 356 128, 374 52, 250 34" marker-end="url(#rmArrRp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">brand again</text>
    </svg>`,
    "runemaster/arcane": `<svg viewBox="0 0 380 230" role="img" aria-label="Arcane rhythm, phone ladder: three glyphs in sequence, then release the active one">
      <defs><marker id="rmArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<rect class="rm-glyph" x="${28 + i * 34}" y="${52 - i * 6}" width="16" height="16" rx="3"/>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">ESCALATE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">glyph on glyph, in order</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#rmArrAp)"/>
      <rect class="rm-window" x="28" y="110" width="200" height="58" rx="2"/>
      <text class="rm-window-lab" x="128" y="132" text-anchor="middle">RELEASE</text>
      <text class="ph2" x="128" y="150" text-anchor="middle" fill="#d7e2ff">Glyphic Ruin · full spell power</text>
      <path class="branch" d="M234 139 C 356 132, 374 54, 250 34" marker-end="url(#rmArrAp)"/>
      <text class="ph2" x="190" y="192" text-anchor="middle">resequence</text>
    </svg>`,
    "runemaster/riftblade": `<svg viewBox="0 0 380 230" role="img" aria-label="Riftblade rhythm, phone ladder: count the beat to the third Runeblade">
      <defs><marker id="rmArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<circle class="rm-pip${i === 2 ? " lit" : ""}" cx="${38 + i * 30}" cy="52" r="7"/>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">THE BEAT</text>
      <text class="ph2" x="165" y="58" text-anchor="start">one · two · THREE</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#rmArrBp)"/>
      <rect class="rm-window" x="28" y="106" width="200" height="58" rx="2"/>
      <text class="rm-window-lab" x="128" y="128" text-anchor="middle">EVERY 3RD RUNEBLADE</text>
      <text class="ph2" x="128" y="146" text-anchor="middle" fill="#d7e2ff">+30% · the next cast transforms</text>
      <path class="branch" d="M234 135 C 356 128, 374 52, 250 34" marker-end="url(#rmArrBp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">count again</text>
    </svg>`,
    "necromancer/animation": `<svg viewBox="0 0 380 250" role="img" aria-label="Animation rhythm, phone ladder: fill the roster, command it, Deadly Bond can make one free">
      <defs><marker id="ncArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <rect class="nc-slot" x="24" y="44" width="14" height="11" rx="2"/>
      <rect class="nc-slot" x="44" y="44" width="26" height="11" rx="2"/>
      <rect class="nc-slot" x="76" y="44" width="38" height="11" rx="2"/>
      <text class="ph" x="165" y="42" text-anchor="start">FILL</text>
      <text class="ph2" x="165" y="56" text-anchor="start">Ghoul 1 · Mage 2 · Gargoyle 3</text>
      <path class="branch" d="M44 64 L44 88" marker-end="url(#ncArrAp)"/>
      <path class="refresh" d="M33 110 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="106" text-anchor="start">COMMAND</text>
      <text class="ph2" x="165" y="120" text-anchor="start">Runic Power spends here</text>
      <path class="branch" d="M44 124 L44 148" marker-end="url(#ncArrAp)"/>
      <rect class="nc-window" x="28" y="158" width="200" height="56" rx="2"/>
      <text class="nc-window-lab" x="128" y="182" text-anchor="middle">DEADLY BOND · 6 s</text>
      <text class="ph2" x="128" y="200" text-anchor="middle" fill="#dfe8cd">30% chance: next one free</text>
      <path class="branch" d="M234 186 C 356 180, 374 56, 250 36" marker-end="url(#ncArrAp)"/>
      <text class="ph2" x="190" y="238" text-anchor="middle">the army marches on</text>
    </svg>`,
    "necromancer/death": `<svg viewBox="0 0 380 230" role="img" aria-label="Death rhythm, phone ladder: grow the diseases, then below twenty percent they double">
      <defs><marker id="ncArrDp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <rect class="brick" x="20" y="58" width="100" height="9" rx="1"/>
      <rect class="brick" x="34" y="46" width="72" height="9" rx="1"/>
      <rect class="brick" x="48" y="34" width="44" height="9" rx="1"/>
      <text class="ph" x="165" y="44" text-anchor="start">CULTIVATE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">15 diseases, growing</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#ncArrDp)"/>
      <rect class="nc-window" x="28" y="110" width="200" height="58" rx="2"/>
      <text class="nc-window-lab" x="128" y="132" text-anchor="middle">TARGET BELOW 20%</text>
      <text class="ph2" x="128" y="150" text-anchor="middle" fill="#dfe8cd">they deal 100% more</text>
      <path class="branch" d="M234 139 C 356 132, 374 54, 250 34" marker-end="url(#ncArrDp)"/>
      <text class="ph2" x="190" y="192" text-anchor="middle">replant</text>
    </svg>`,
    "necromancer/rime": `<svg viewBox="0 0 380 230" role="img" aria-label="Rime rhythm, phone ladder: freeze for four seconds, land the impact, the power comes back">
      <defs><marker id="ncArrRp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="refresh" d="M33 52 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">FREEZE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">the gate opens · 4 s</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#ncArrRp)"/>
      <rect class="nc-window" x="28" y="106" width="200" height="58" rx="2"/>
      <text class="nc-window-lab" x="128" y="128" text-anchor="middle">FROZEN · 4 s</text>
      <text class="ph2" x="128" y="146" text-anchor="middle" fill="#dfe8cd">Glacial Impact · 20 RP back</text>
      <path class="branch" d="M234 135 C 356 128, 374 52, 250 34" marker-end="url(#ncArrRp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">freeze again</text>
    </svg>`,
    "primalist/primal": `<svg viewBox="0 0 380 230" role="img" aria-label="Primal rhythm, phone ladder: keep the bleed running, claws hit harder while it holds">
      <defs><marker id="prArrPp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="pr-pip" cx="36" cy="50" r="6"/><circle class="pr-pip" cx="62" cy="50" r="6"/>
      <text class="ph" x="165" y="44" text-anchor="start">REND</text>
      <text class="ph2" x="165" y="58" text-anchor="start">2-stack bleed · 12 s</text>
      <path class="branch" d="M44 68 L44 92" marker-end="url(#prArrPp)"/>
      <rect class="pr-window" x="28" y="102" width="200" height="58" rx="2"/>
      <text class="pr-window-lab" x="128" y="124" text-anchor="middle">BLEEDING TARGET</text>
      <text class="ph2" x="128" y="142" text-anchor="middle" fill="#f2ddca">+15% claws and rushes</text>
      <path class="branch" d="M234 131 C 356 124, 374 52, 250 34" marker-end="url(#prArrPp)"/>
      <text class="ph2" x="190" y="184" text-anchor="middle">keep it open</text>
    </svg>`,
    "primalist/geomancy": `<svg viewBox="0 0 380 230" role="img" aria-label="Geomancy rhythm, phone ladder: bank fifteen Earthshaping, Terrasurge consumes it">
      <defs><marker id="prArrGp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="kx-climb" d="M20 72 L140 46"/>
      <text class="ph" x="165" y="44" text-anchor="start">AMASS</text>
      <text class="ph2" x="165" y="58" text-anchor="start">to fifteen</text>
      <path class="branch" d="M44 84 L44 108" marker-end="url(#prArrGp)"/>
      <rect class="pr-window" x="28" y="118" width="200" height="56" rx="2"/>
      <text class="pr-window-lab" x="128" y="142" text-anchor="middle">TERRASURGE</text>
      <text class="ph2" x="128" y="160" text-anchor="middle" fill="#f2ddca">the whole bank at once</text>
      <path class="branch" d="M234 146 C 356 140, 374 54, 250 34" marker-end="url(#prArrGp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">rebank</text>
    </svg>`,
    "primalist/life": `<svg viewBox="0 0 380 230" role="img" aria-label="Life rhythm, phone ladder: the wave splits into hurt and heal, and the next Hand costs half">
      <defs><marker id="prArrLp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="pr-splitline" d="M20 54 L66 54 M66 54 L104 40 M66 54 L104 68"/>
      <circle class="pr-pip" cx="20" cy="54" r="5"/>
      <text class="ph" x="165" y="44" text-anchor="start">SPLIT</text>
      <text class="ph2" x="165" y="58" text-anchor="start">one action, two outputs</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#prArrLp)"/>
      <rect class="pr-window" x="28" y="114" width="200" height="58" rx="2"/>
      <text class="pr-window-lab" x="128" y="136" text-anchor="middle">AFTER THE WAVE</text>
      <text class="ph2" x="128" y="154" text-anchor="middle" fill="#f2ddca">next Hand −50% Rage · 8 s</text>
      <path class="branch" d="M234 143 C 356 136, 374 54, 250 34" marker-end="url(#prArrLp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">wave again</text>
    </svg>`,
    "primalist/mountain-king": `<svg viewBox="0 0 380 230" role="img" aria-label="Mountain King rhythm, phone ladder: hold five Earth's Rage and the mountain pays you">
      <defs><marker id="prArrMp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="pr-pip${i === 4 ? " lit" : ""}" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">HOLD</text>
      <text class="ph2" x="185" y="58" text-anchor="start">five Earth's Rage</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#prArrMp)"/>
      <rect class="pr-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="pr-window-lab" x="128" y="130" text-anchor="middle">CALL OF THE MOUNTAIN</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#f2ddca">+5% parry · −5% taken</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#prArrMp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">hold fast</text>
    </svg>`,
    "barbarian/brutality": `<svg viewBox="0 0 380 230" role="img" aria-label="Brutality rhythm, phone ladder: hoard the doubled pool, then Decapitate spends it below 35%">
      <defs><marker id="baArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="kx-climb" d="M20 72 L140 46"/>
      <text class="ph" x="165" y="44" text-anchor="start">HOARD</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Smash restores 25%</text>
      <path class="branch" d="M44 84 L44 108" marker-end="url(#baArrBp)"/>
      <rect class="ba-window" x="28" y="118" width="200" height="58" rx="2"/>
      <text class="ba-window-lab" x="128" y="140" text-anchor="middle">BELOW 35% HEALTH</text>
      <text class="ph2" x="128" y="158" text-anchor="middle" fill="#ecd9be">Decapitate · up to 100 Energy</text>
      <path class="branch" d="M234 147 C 356 140, 374 54, 250 34" marker-end="url(#baArrBp)"/>
      <text class="ph2" x="190" y="200" text-anchor="middle">a kill refunds the bar</text>
    </svg>`,
    "barbarian/headhunting": `<svg viewBox="0 0 380 250" role="img" aria-label="Headhunting rhythm, phone ladder: throw, spear while Enraged, three axes come back">
      <defs><marker id="baArrHp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="wh-bolt" d="M28 46 l20 6 l-20 6 Z"/><path class="wh-bolt" d="M58 46 l20 6 l-20 6 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">THROW</text>
      <text class="ph2" x="165" y="58" text-anchor="start">30% chance to reset Spears</text>
      <path class="branch" d="M44 66 L44 90" marker-end="url(#baArrHp)"/>
      <path class="refresh" d="M33 112 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="108" text-anchor="start">SPEAR · ENRAGED</text>
      <path class="branch" d="M44 126 L44 150" marker-end="url(#baArrHp)"/>
      <rect class="ba-window" x="28" y="160" width="200" height="56" rx="2"/>
      <text class="ba-window-lab" x="128" y="184" text-anchor="middle">3 AXES BACK</text>
      <text class="ph2" x="128" y="202" text-anchor="middle" fill="#ecd9be">next 3 casts half cost · 12 s</text>
      <path class="branch" d="M234 188 C 356 182, 374 56, 250 36" marker-end="url(#baArrHp)"/>
      <text class="ph2" x="190" y="240" text-anchor="middle">throw again</text>
    </svg>`,
    "barbarian/ancestry": `<svg viewBox="0 0 380 230" role="img" aria-label="Ancestry rhythm, phone ladder: the Tankard fills on its own clock, and the pour pays the party">
      <defs><marker id="baArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="ba-tankard" d="M26 38 L26 70 L74 70 L74 38 M74 46 C 86 46 86 62 74 62"/>
      <path class="ba-fill" d="M30 56 L70 56 L70 67 L30 67 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">FILL</text>
      <text class="ph2" x="165" y="58" text-anchor="start">1 stack every 2 s</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#baArrAp)"/>
      <rect class="ba-window" x="28" y="114" width="200" height="60" rx="2"/>
      <text class="ba-window-lab" x="128" y="136" text-anchor="middle">TANKARD EMPTIED</text>
      <text class="ph2" x="128" y="152" text-anchor="middle" fill="#ecd9be">12-yd cone · party +95 power</text>
      <text class="ph2" x="128" y="166" text-anchor="middle" fill="#ecd9be">for 15 seconds</text>
      <path class="branch" d="M234 144 C 356 138, 374 54, 250 34" marker-end="url(#baArrAp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">it fills again</text>
    </svg>`,
    "bloodmage/sanguine": `<svg viewBox="0 0 380 230" role="img" aria-label="Sanguine rhythm, phone ladder: overdraw Thirst past its cap, Insatiable pays per stack">
      <defs><marker id="bmArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="bm-pip${i > 2 ? " over" : ""}" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">OVERDRAW</text>
      <text class="ph2" x="185" y="58" text-anchor="start">past the cap, on purpose</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#bmArrSp)"/>
      <rect class="bm-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="bm-window-lab" x="128" y="130" text-anchor="middle">10 THIRST · INSATIABLE</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#e2e2fb">+10% Vampiric Fang per stack</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#bmArrSp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">the cash-out clears both</text>
    </svg>`,
    "bloodmage/accursed": `<svg viewBox="0 0 380 230" role="img" aria-label="Accursed rhythm, phone ladder: stretch the Cursed Form with Assaults, then Veinburst spends all eight Shards">
      <defs><marker id="bmArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <rect class="bm-window" x="20" y="38" width="120" height="34" rx="2"/>
      <line class="bm-stretch" x1="126" y1="42" x2="126" y2="68"/><line class="bm-stretch" x1="134" y1="42" x2="134" y2="68"/>
      <text class="ph" x="165" y="46" text-anchor="start">STRETCH</text>
      <text class="ph2" x="165" y="60" text-anchor="start">30 s + 3 per Assault</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#bmArrAp)"/>
      <rect class="bm-window hot" x="28" y="114" width="200" height="56" rx="2"/>
      <text class="bm-window-lab" x="128" y="138" text-anchor="middle">VEINBURST</text>
      <text class="ph2" x="128" y="156" text-anchor="middle" fill="#e2e2fb">all eight Shards at once</text>
      <path class="branch" d="M234 142 C 356 136, 374 54, 250 34" marker-end="url(#bmArrAp)"/>
      <text class="ph2" x="190" y="194" text-anchor="middle">re-curse</text>
    </svg>`,
    "bloodmage/eternal": `<svg viewBox="0 0 380 230" role="img" aria-label="Eternal rhythm, phone ladder: trade damage for threat and hold the bargain">
      <defs><marker id="bmArrEp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="refresh" d="M33 52 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">TRADE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">−10% damage dealt</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#bmArrEp)"/>
      <rect class="bm-window" x="28" y="106" width="200" height="60" rx="2"/>
      <text class="bm-window-lab" x="128" y="128" text-anchor="middle">+80% THREAT</text>
      <text class="ph2" x="128" y="144" text-anchor="middle" fill="#e2e2fb">+50% more from blood spells</text>
      <text class="ph2" x="128" y="158" text-anchor="middle" fill="#e2e2fb">while the curse holds</text>
      <path class="branch" d="M234 136 C 356 130, 374 52, 250 34" marker-end="url(#bmArrEp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">the bargain holds</text>
    </svg>`,
    "bloodmage/fleshweaver": `<svg viewBox="0 0 380 230" role="img" aria-label="Fleshweaver rhythm, phone ladder: pool Vitality to ten, then empowered Mortal spells consume it">
      <defs><marker id="bmArrFp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="bm-pip" cx="${34 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">POOL</text>
      <text class="ph2" x="185" y="58" text-anchor="start">healing links feed it</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#bmArrFp)"/>
      <rect class="bm-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="bm-window-lab" x="128" y="130" text-anchor="middle">10 POOLED · EMPOWERED</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#e2e2fb">Mortal spells consume all ten</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#bmArrFp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">repool</text>
    </svg>`,
    "ranger/farstrider": `<svg viewBox="0 0 380 230" role="img" aria-label="Farstrider rhythm, phone ladder: count to the fifth shot, or a Horn calls the Falconstrike early">
      <defs><marker id="rgArrFp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="rg-pip${i === 4 ? " lit" : ""}" cx="${34 + i * 26}" cy="52" r="6"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">COUNT</text>
      <text class="ph2" x="185" y="58" text-anchor="start">every 5th shot · 2 Advantage</text>
      <path class="branch" d="M44 70 L44 94" marker-end="url(#rgArrFp)"/>
      <rect class="rg-window" x="28" y="104" width="200" height="56" rx="2"/>
      <text class="rg-window-lab" x="128" y="128" text-anchor="middle">FALCONSTRIKE</text>
      <text class="ph2" x="128" y="146" text-anchor="middle" fill="#e7f3d2">a Horn calls it early</text>
      <path class="branch" d="M234 132 C 356 126, 374 52, 250 34" marker-end="url(#rgArrFp)"/>
      <text class="ph2" x="190" y="186" text-anchor="middle">the count restarts</text>
    </svg>`,
    "ranger/archery": `<svg viewBox="0 0 380 230" role="img" aria-label="Archery rhythm, phone ladder: stacks buy Skirmish seconds, a full five refresh it further">
      <defs><marker id="rgArrAp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="rg-pip${i === 4 ? " lit" : ""}" cx="${34 + i * 26}" cy="${58 - i * 4}" r="6"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">DRAW</text>
      <text class="ph2" x="185" y="58" text-anchor="start">basic attacks notch it</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#rgArrAp)"/>
      <rect class="rg-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="rg-window-lab" x="128" y="130" text-anchor="middle">SKIRMISH</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#e7f3d2">4 s per stack · five refresh +5 s</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#rgArrAp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">redraw</text>
    </svg>`,
    "ranger/brigand": `<svg viewBox="0 0 380 230" role="img" aria-label="Brigand rhythm, phone ladder: the mark runs eight seconds, spenders land harder inside it">
      <defs><marker id="rgArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <rect class="rg-track top" x="20" y="44" width="120" height="10" rx="2"/>
      <rect class="rg-track bot" x="32" y="60" width="34" height="10" rx="2"/>
      <rect class="rg-track bot" x="76" y="60" width="34" height="10" rx="2"/>
      <text class="ph" x="165" y="46" text-anchor="start">OVERLAP</text>
      <text class="ph2" x="165" y="60" text-anchor="start">spend inside the mark</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#rgArrBp)"/>
      <rect class="rg-window" x="28" y="114" width="200" height="56" rx="2"/>
      <text class="rg-window-lab" x="128" y="138" text-anchor="middle">MARKED · 8 s</text>
      <text class="ph2" x="128" y="156" text-anchor="middle" fill="#e7f3d2">Advantage spenders +25%</text>
      <path class="branch" d="M234 142 C 356 136, 374 54, 250 34" marker-end="url(#rgArrBp)"/>
      <text class="ph2" x="190" y="194" text-anchor="middle">in, out, and remark</text>
    </svg>`,
    "felsworn/slayer": `<svg viewBox="0 0 380 230" role="img" aria-label="Slayer rhythm, phone ladder: three pairs bank six, Inner Demon opens, crits hold it">
      <defs><marker id="fsArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<g transform="translate(${40 + i * 32} 52)"><line class="fs-spair" x1="-4" y1="-7" x2="-4" y2="7"/><line class="fs-spair" x1="4" y1="-7" x2="4" y2="7"/></g>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">PAIRS</text>
      <text class="ph2" x="165" y="58" text-anchor="start">three pairs bank six</text>
      <path class="branch" d="M44 70 L44 94" marker-end="url(#fsArrSp)"/>
      <rect class="fs-window" x="28" y="104" width="200" height="60" rx="2"/>
      <text class="fs-window-lab" x="128" y="126" text-anchor="middle">INNER DEMON</text>
      <text class="ph2" x="128" y="142" text-anchor="middle" fill="#ecdcf9">crits refund 3 Energy</text>
      <text class="ph2" x="128" y="156" text-anchor="middle" fill="#ecdcf9">spender crits add 1 s</text>
      <path class="branch" d="M234 134 C 356 128, 374 52, 250 34" marker-end="url(#fsArrSp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">bank six again</text>
    </svg>`,
    "felsworn/infernal": `<svg viewBox="0 0 380 230" role="img" aria-label="Infernal rhythm, phone ladder: casts cascade into more hits, Inner Demon refunds the spells">
      <defs><marker id="fsArrIp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="fs-branchline" d="M24 54 L70 54 M70 54 L108 40 M70 54 L108 54 M70 54 L108 68"/>
      <circle class="fs-bnode" cx="24" cy="54" r="5"/>
      <circle class="fs-bnode" cx="108" cy="40" r="4"/><circle class="fs-bnode" cx="108" cy="54" r="4"/><circle class="fs-bnode" cx="108" cy="68" r="4"/>
      <text class="ph" x="165" y="44" text-anchor="start">CASCADE</text>
      <text class="ph2" x="165" y="58" text-anchor="start">one cast branches into more</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#fsArrIp)"/>
      <rect class="fs-window" x="28" y="114" width="200" height="60" rx="2"/>
      <text class="fs-window-lab" x="128" y="136" text-anchor="middle">INNER DEMON</text>
      <text class="ph2" x="128" y="152" text-anchor="middle" fill="#ecdcf9">three spells refund</text>
      <text class="ph2" x="128" y="166" text-anchor="middle" fill="#ecdcf9">20 Energy each</text>
      <path class="branch" d="M234 144 C 356 138, 374 54, 250 34" marker-end="url(#fsArrIp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">chain on</text>
    </svg>`,
    "felsworn/tyrant": `<svg viewBox="0 0 380 230" role="img" aria-label="Tyrant rhythm, phone ladder: bank six behind dodges, then brace inside Inner Demon">
      <defs><marker id="fsArrTp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<g transform="translate(${40 + i * 32} ${56 - i * 4})"><line class="fs-spair" x1="-4" y1="-7" x2="-4" y2="7"/><line class="fs-spair" x1="4" y1="-7" x2="4" y2="7"/></g>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">BANK</text>
      <text class="ph2" x="165" y="58" text-anchor="start">dodges feed Energy back</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#fsArrTp)"/>
      <rect class="fs-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="fs-window-lab" x="128" y="130" text-anchor="middle">INNER DEMON · BRACED</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#ecdcf9">-10% taken · Carve leeches 20%</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#fsArrTp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">rebank</text>
    </svg>`,
    "sun-cleric/piety": `<svg viewBox="0 0 380 230" role="img" aria-label="Piety rhythm, phone ladder: alternate Sunrise and Sunset, Solar Concord rides the window">
      <defs><marker id="suArrPp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="su-half lit" d="M24 54 A22 22 0 0 1 68 54 Z"/>
      <path class="su-half" d="M24 60 A22 22 0 0 0 68 60 Z"/>
      <text class="ph" x="165" y="46" text-anchor="start">ALTERNATE</text>
      <text class="ph2" x="165" y="60" text-anchor="start">each swap resets the other</text>
      <path class="branch" d="M44 82 L44 106" marker-end="url(#suArrPp)"/>
      <rect class="su-window" x="28" y="116" width="200" height="56" rx="2"/>
      <text class="su-window-lab" x="128" y="140" text-anchor="middle">SOLAR CONCORD</text>
      <text class="ph2" x="128" y="158" text-anchor="middle" fill="#ffedbe">15 s · signature casts reset</text>
      <path class="branch" d="M234 144 C 356 138, 374 56, 250 36" marker-end="url(#suArrPp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">swap again</text>
    </svg>`,
    "sun-cleric/blessings": `<svg viewBox="0 0 380 230" role="img" aria-label="Blessings rhythm, phone ladder: Fulfillments route to five allies, Solar Invigoration amplifies them">
      <defs><marker id="suArrBp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <circle class="su-hub" cx="44" cy="54" r="9"/>
      ${[0,1,2].map(i => {
        const a = -Math.PI/2 + (i - 1) * 0.6;
        const x = 44 + 38 * Math.cos(a), y = 54 + 38 * Math.sin(a);
        return `<line class="su-relay" x1="44" y1="54" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/><circle class="su-ally" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`;
      }).join("")}
      <text class="ph" x="165" y="46" text-anchor="start">RELAY</text>
      <text class="ph2" x="165" y="60" text-anchor="start">5 allies per Fulfillment</text>
      <path class="branch" d="M44 96 L44 118" marker-end="url(#suArrBp)"/>
      <rect class="su-window" x="28" y="128" width="200" height="56" rx="2"/>
      <text class="su-window-lab" x="128" y="152" text-anchor="middle">SOLAR INVIGORATION</text>
      <text class="ph2" x="128" y="170" text-anchor="middle" fill="#ffedbe">+20% healing taken · 15 s</text>
      <path class="branch" d="M234 156 C 356 150, 374 58, 250 36" marker-end="url(#suArrBp)"/>
      <text class="ph2" x="190" y="204" text-anchor="middle">back to the build</text>
    </svg>`,
    "sun-cleric/seraphim": `<svg viewBox="0 0 380 230" role="img" aria-label="Seraphim rhythm, phone ladder: stack block value, then Seraphic Bulwark doubles it">
      <defs><marker id="suArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <rect class="brick" x="20" y="58" width="90" height="9" rx="1"/>
      <rect class="brick" x="32" y="46" width="66" height="9" rx="1"/>
      <rect class="brick" x="44" y="34" width="42" height="9" rx="1"/>
      <text class="ph" x="165" y="44" text-anchor="start">STACK</text>
      <text class="ph2" x="165" y="58" text-anchor="start">2% block value each · ×5</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#suArrSp)"/>
      <rect class="su-window" x="28" y="110" width="200" height="60" rx="2"/>
      <text class="su-window-lab" x="128" y="132" text-anchor="middle">SERAPHIC BULWARK</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#ffedbe">+100% block · 5 blocks or 10 s</text>
      <text class="ph2" x="128" y="162" text-anchor="middle" fill="#ffedbe">2 charges · 25 s recharge</text>
      <path class="branch" d="M234 140 C 356 134, 374 54, 250 34" marker-end="url(#suArrSp)"/>
      <text class="ph2" x="190" y="192" text-anchor="middle">restack</text>
    </svg>`,
    "sun-cleric/valkyrie": `<svg viewBox="0 0 380 230" role="img" aria-label="Valkyrie rhythm, phone ladder: stack Sunslam through Fulfillments, slam inside Dawn">
      <defs><marker id="suArrVp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4].map(i => `<circle class="su-pip" cx="${32 + i * 26}" cy="${58 - i * 4}" r="5.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">BUILD</text>
      <text class="ph2" x="185" y="58" text-anchor="start">+10% Sunslam each · ×5</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#suArrVp)"/>
      <rect class="su-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="su-window-lab" x="128" y="130" text-anchor="middle">SUNSLAM · DAWN ONLY</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#ffedbe">every second for 4 s · 1 s stun</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#suArrVp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">wait for the next Dawn</text>
    </svg>`,
    "templar/crusader": `<svg viewBox="0 0 380 230" role="img" aria-label="Crusader rhythm, phone ladder: hold the chain, renew it, then the whirl spends every Oath">
      <defs><marker id="tpArrCp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<ellipse class="tp-slink" cx="${38 + i * 32}" cy="${52 - i * 4}" rx="10" ry="7"/>`).join("")}
      <text class="ph" x="165" y="44" text-anchor="start">HOLD</text>
      <text class="ph2" x="165" y="58" text-anchor="start">Argent Blade adds 3 s</text>
      <path class="branch" d="M44 74 L44 98" marker-end="url(#tpArrCp)"/>
      <rect class="tp-window" x="28" y="108" width="200" height="58" rx="2"/>
      <text class="tp-window-lab" x="128" y="130" text-anchor="middle">RIGHTEOUS TEMPEST</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#ffdcec">every Oath · a 3 s whirl</text>
      <path class="branch" d="M234 137 C 356 130, 374 54, 250 34" marker-end="url(#tpArrCp)"/>
      <text class="ph2" x="190" y="190" text-anchor="middle">swear again</text>
    </svg>`,
    "templar/oathkeeper": `<svg viewBox="0 0 380 230" role="img" aria-label="Oathkeeper rhythm, phone ladder: Oaths stay, the Libram fills, the wipe clears most of it">
      <defs><marker id="tpArrOp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="tp-debt" d="M20 64 L140 40 L140 66 L20 66 Z"/>
      <text class="ph" x="165" y="44" text-anchor="start">KEEP</text>
      <text class="ph2" x="165" y="58" text-anchor="start">damage arrives delayed</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#tpArrOp)"/>
      <rect class="tp-window" x="28" y="114" width="200" height="56" rx="2"/>
      <text class="tp-window-lab" x="128" y="138" text-anchor="middle">LIBRAM WIPE</text>
      <text class="ph2" x="128" y="156" text-anchor="middle" fill="#ffdcec">removes 70% of the debt</text>
      <path class="branch" d="M234 142 C 356 136, 374 54, 250 34" marker-end="url(#tpArrOp)"/>
      <text class="ph2" x="190" y="194" text-anchor="middle">it fills again</text>
    </svg>`,
    "templar/zealot": `<svg viewBox="0 0 380 230" role="img" aria-label="Zealot rhythm, phone ladder: tally ten triggers, Chastise becomes Divine Fury">
      <defs><marker id="tpArrZp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4,5,6,7,8,9].map(i => `<circle class="tp-pip${i === 9 ? " lit" : ""}" cx="${26 + i * 14}" cy="${56 - i * 1.5}" r="4.5"/>`).join("")}
      <text class="ph" x="185" y="44" text-anchor="start">TALLY</text>
      <text class="ph2" x="185" y="58" text-anchor="start">+3% per trigger counted</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#tpArrZp)"/>
      <rect class="tp-window" x="28" y="106" width="200" height="56" rx="2"/>
      <text class="tp-window-lab" x="128" y="130" text-anchor="middle">TEN TRIGGERS</text>
      <text class="ph2" x="128" y="148" text-anchor="middle" fill="#ffdcec">Chastise → Divine Fury</text>
      <path class="branch" d="M234 134 C 356 128, 374 52, 250 34" marker-end="url(#tpArrZp)"/>
      <text class="ph2" x="190" y="188" text-anchor="middle">count again</text>
    </svg>`,
    "starcaller/moon-guard": `<svg viewBox="0 0 380 230" role="img" aria-label="Moon Guard rhythm, phone ladder: mark the pack, spend stars, Starsweep returns sooner">
      <defs><marker id="scArrGp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<g class="sc-star" transform="translate(${36 + i * 28} 52)"><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/></g>`).join("")}
      <text class="ph" x="165" y="46" text-anchor="start">MARK</text>
      <text class="ph2" x="165" y="60" text-anchor="start">Starburst · up to 8</text>
      <path class="branch" d="M44 72 L44 96" marker-end="url(#scArrGp)"/>
      <path class="refresh" d="M33 118 l11 -11 l11 11 l-11 11 Z"/>
      <text class="ph" x="165" y="114" text-anchor="start">SPEND</text>
      <text class="ph2" x="165" y="128" text-anchor="start">−3 s Starsweep per star</text>
      <path class="branch" d="M44 132 L44 154" marker-end="url(#scArrGp)"/>
      <rect class="sc-window" x="28" y="164" width="200" height="54" rx="2"/>
      <text class="sc-window-lab" x="128" y="184" text-anchor="middle">STARSWEEP</text>
      <text class="ph2" x="128" y="202" text-anchor="middle" fill="#efeaff">sooner with every mark</text>
      <path class="branch" d="M234 191 C 356 184, 374 56, 250 36" marker-end="url(#scArrGp)"/>
      <text class="ph2" x="190" y="228" text-anchor="middle">bigger packs spin it faster</text>
    </svg>`,
    "starcaller/moon-priest": `<svg viewBox="0 0 380 230" role="img" aria-label="Moon Priest rhythm, phone ladder: hold stars on enemies, the eclipse reaps them as healing">
      <defs><marker id="scArrPp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2].map(i => `<g class="sc-star" transform="translate(${36 + i * 28} ${56 - i * 5})"><path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/></g>`).join("")}
      <text class="ph" x="165" y="46" text-anchor="start">HOLD THE STARS</text>
      <text class="ph2" x="165" y="60" text-anchor="start">Huntress Shot lands two extra</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#scArrPp)"/>
      <rect class="sc-window" x="28" y="110" width="200" height="66" rx="2"/>
      <text class="sc-window-lab" x="128" y="130" text-anchor="middle">MOONFLOW ECLIPSE</text>
      <path class="kx-heal" d="M44 170 C 74 132 154 132 184 170 Z"/>
      <text class="ph2" x="128" y="146" text-anchor="middle" fill="#efeaff">5 allies healed per star · 40 yd</text>
      <path class="branch" d="M234 143 C 356 136, 374 54, 250 34" marker-end="url(#scArrPp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">reseed the pack</text>
    </svg>`,
    "starcaller/sentinel": `<svg viewBox="0 0 380 230" role="img" aria-label="Sentinel rhythm, phone ladder: count consumed stars to eight, the eighth supercharges Starcall">
      <defs><marker id="scArrSp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      ${[0,1,2,3,4,5,6,7].map(i => `<circle class="sc-pip${i === 7 ? " lit" : ""}" cx="${28 + i * 17}" cy="${58 - i * 2}" r="5"/>`).join("")}
      <text class="ph" x="185" y="46" text-anchor="start">COUNT</text>
      <text class="ph2" x="185" y="60" text-anchor="start">8% mana per star spent</text>
      <path class="branch" d="M44 76 L44 100" marker-end="url(#scArrSp)"/>
      <text class="ph2" x="34" y="120" text-anchor="start">every 3rd shot → Barrage</text>
      <path class="branch" d="M44 128 L44 150" marker-end="url(#scArrSp)"/>
      <rect class="sc-window" x="28" y="160" width="200" height="54" rx="2"/>
      <text class="sc-window-lab" x="128" y="180" text-anchor="middle">EVERY 8TH STAR</text>
      <text class="ph2" x="128" y="198" text-anchor="middle" fill="#efeaff">next Starcall +50%</text>
      <path class="branch" d="M234 187 C 356 180, 374 56, 250 36" marker-end="url(#scArrSp)"/>
      <text class="ph2" x="190" y="226" text-anchor="middle">count again</text>
    </svg>`,
    "starcaller/warden": `<svg viewBox="0 0 380 230" role="img" aria-label="Warden rhythm, phone ladder: apply and consume in the same seconds; star damage can make the next Astral Blade free">
      <defs><marker id="scArrWp" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8d8678"/></marker></defs>
      <path class="sc-churn" d="M20 66 L48 42 L76 66 L104 42 L132 66"/>
      <text class="ph" x="165" y="46" text-anchor="start">CHURN</text>
      <text class="ph2" x="165" y="60" text-anchor="start">build and spend at once</text>
      <path class="branch" d="M44 80 L44 104" marker-end="url(#scArrWp)"/>
      <rect class="sc-window" x="28" y="114" width="200" height="60" rx="2"/>
      <text class="sc-window-lab" x="128" y="136" text-anchor="middle">FREE ASTRAL BLADE</text>
      <text class="ph2" x="128" y="152" text-anchor="middle" fill="#efeaff">zeroes a 25%-mana strike</text>
      <text class="ph2" x="128" y="166" text-anchor="middle" fill="#efeaff">Fan of Knives · −2 s per star</text>
      <path class="branch" d="M234 144 C 356 138, 374 56, 250 36" marker-end="url(#scArrWp)"/>
      <text class="ph2" x="190" y="196" text-anchor="middle">no pause — the churn continues</text>
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
      <div class="ry-lab"><span></span><span>drawn from research · not a rotation guide</span></div>
      ${art}
      <div class="ry-reads">
        <div><div class="ry-bullets-lab">How to read it</div>
          <ul class="ry-bullets">${d.bullets.map(b => `<li>${b}</li>`).join("")}</ul></div>
        <p class="ry-eyes">👁 watch: ${d.eyes}
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
    "guardian": { desktop: ["0 0 420 260", GD_DESKTOP], phone: ["0 0 420 224", GD_PHONE] },
    "witch-hunter": { desktop: ["0 0 420 260", WH_DESKTOP], phone: ["0 0 420 224", WH_PHONE] },
    "stormbringer": { desktop: ["0 0 420 260", SB_DESKTOP], phone: ["0 0 420 224", SB_PHONE] },
    "reaper": { desktop: ["0 0 420 260", RP_DESKTOP], phone: ["0 0 420 224", RP_PHONE] },
    "chronomancer": { desktop: ["0 0 420 260", CM_DESKTOP], phone: ["0 0 420 224", CM_PHONE] },
    "starcaller": { desktop: ["0 0 420 260", SC_DESKTOP], phone: ["0 0 420 224", SC_PHONE] },
    "sun-cleric": { desktop: ["0 0 420 260", SU_DESKTOP], phone: ["0 0 420 224", SU_PHONE] },
    "templar": { desktop: ["0 0 420 260", TP_DESKTOP], phone: ["0 0 420 224", TP_PHONE] },
    "ranger": { desktop: ["0 0 420 260", RG_DESKTOP], phone: ["0 0 420 224", RG_PHONE] },
    "felsworn": { desktop: ["0 0 420 260", FS_DESKTOP], phone: ["0 0 420 224", FS_PHONE] },
    "barbarian": { desktop: ["0 0 420 260", BA_DESKTOP], phone: ["0 0 420 224", BA_PHONE] },
    "bloodmage": { desktop: ["0 0 420 260", BM_DESKTOP], phone: ["0 0 420 224", BM_PHONE] },
    "necromancer": { desktop: ["0 0 420 260", NC_DESKTOP], phone: ["0 0 420 224", NC_PHONE] },
    "primalist": { desktop: ["0 0 420 260", PR_DESKTOP], phone: ["0 0 420 224", PR_PHONE] },
    "pyromancer": { desktop: ["0 0 420 260", PY_DESKTOP], phone: ["0 0 420 224", PY_PHONE] },
    "runemaster": { desktop: ["0 0 420 260", RM_DESKTOP], phone: ["0 0 420 224", RM_PHONE] },
    "venomancer": { desktop: ["0 0 420 260", VN_DESKTOP], phone: ["0 0 420 224", VN_PHONE] },
    "witch-doctor": { desktop: ["0 0 420 260", WD_DESKTOP], phone: ["0 0 420 224", WD_PHONE] },
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
