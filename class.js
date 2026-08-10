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
