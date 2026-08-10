/* The spec-profile modal — P1 slim quick-look (Choose grammar §4, LOCKED).
   One screen: identity, archetype tag, demand pips, ✓/✕, defining talents.
   The nine folds live on the class page only; this register sells that page with
   an emphasized exit chip beside the spec name (7px gap under the row, × corner
   reserved by CSS). Built only from researched fields — gaps stay absent.

   CRESTS ARE SKIPPED (user ruling, 2026-08-10): the chip's crest slot renders the
   class glyph until crest rights confirm. */
window.COA_SLIM = (() => {
  "use strict";

  const R = window.COA_RENDER, COPY = window.COA_COPY;
  if (!R || !COPY) throw new Error("profile-render.js and authored-copy.js must load first");
  const { esc, famById, classSlug, glyph } = R;

  const classHref = s => `class.html?c=${classSlug(s)}#${s.id.split("/")[1]}`;

  // The emphasized class-page exit — RULED form: crest + "View class page" in text.
  // The crest slot falls back to the class glyph while crests are skipped.
  function exitHTML(s) {
    return `<a class="slim-exit-chip" href="${classHref(s)}"
      data-tipname="${esc(s.klass)}" data-tip="The full class page — engine, specializations, evidence.">
      <span class="slim-crest" aria-hidden="true">${glyph(s)}</span>View class page<span class="arr">⇢</span></a>`;
  }

  function slimHTML(s) {
    const bc = R.bestCtx(s) || "boss";
    const feel = s.contexts[bc]?.feel || "";
    const micro = COPY.MICRO[s.id];
    const stats = Object.entries(R.AXIS_LABELS).map(([k, label]) => {
      const c = R.cxCell(s, k, bc);
      return c ? `<span class="stat">${label}${R.pips(R.CX_ORDINAL[c.v] || 0)}</span>` : "";
    }).filter(Boolean).join("");
    const yes = s.fit.enjoy.slice(0, 2).map(i => i.t);
    const no = s.fit.avoid.slice(0, 2).map(i => i.t);
    const icons = s.media.icons.length ? `<div class="icon-strip">${s.media.icons.map(i =>
      `<img src="https://coabuildhub.com/skill-icons/${esc(i.icon)}.jpg" alt="${esc(i.name)}" loading="lazy"
         data-tipname="${esc(i.name)}" data-tip="${esc(i.tip)}">`).join("")}
      <span class="cap">Defining talents — hover or tap to read</span></div>` : "";
    return `<div class="slim" style="--class-color:${s.color}">
      <header class="d-head ${s.enriched ? "q-c" : "q-w"}">
        <div class="slim-h2row"><h2>${esc(s.name)}</h2>${exitHTML(s)}</div>
        <div class="d-meta"><span>${esc(s.klass)}</span><span>${[...s.roles, ...s.range].map(esc).join(" · ")}</span>
          <span>${esc(famById[s.atlas].name)}</span>
          <span class="wb-q ${s.enriched ? "c" : "w"}">${s.enriched ? "Curated · " + esc(s.confidence) : "Research in progress"}</span></div>
        ${micro ? `<span class="slim-tag">${esc(micro)}</span>` : ""}
        <p class="d-flavor">"${esc(s.fantasy || s.oneLine)}"</p>
        ${feel ? `<p class="d-feel">${esc(feel)}</p>` : ""}
      </header>
      <div class="d-stats">${stats}</div>
      ${(yes.length || no.length) ? `<div class="d-verdicts">
        <div>${yes.map(t => `<p class="v-yes">✓ ${esc(t)}</p>`).join("")}</div>
        <div>${no.map(t => `<p class="v-no">✕ ${esc(t)}</p>`).join("")}</div>
      </div>` : ""}
      ${icons}
      <div class="slim-foot"><span>${R.CTX_LABELS[bc]} context · qualitative labels, relative among researched CoA specs</span></div>
    </div>`;
  }

  return { slimHTML, exitHTML };
})();
