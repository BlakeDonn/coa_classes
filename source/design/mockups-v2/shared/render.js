// Shared render helpers for mockups-v2 concepts.
window.MockUI = (() => {
  "use strict";
  const P = window.COA_PROFILES;

  const esc = v => String(v ?? "").replace(/[&<>'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[c]);

  const srcBadge = s =>
    `<span class="src src-${s}" title="${esc(P.sourceHelp[s])}">${esc(P.sourceLabels[s])}</span>`;

  const meter5 = v =>
    `<span class="meter5" aria-label="${v} of 5">${[1,2,3,4,5].map(i => `<i class="${i <= v ? "on" : ""}"></i>`).join("")}</span>`;

  const facetRow = (name, cell) =>
    `<div class="facet-row"><span class="facet-name">${esc(name)}</span>
      <div class="facet-track"><div class="facet-fill" style="width:${cell.v * 20}%"></div></div>
      ${srcBadge(cell.s)}</div>`;

  const TRAIT_NAMES = {
    pace: "Pace", mobility: "Mobility", setup: "Setup need", burst: "Burst",
    sustain: "Sustain", pets: "Pet reliance", dots: "DoT reliance", control: "Control",
    solo: "Solo comfort", group: "Group responsibility"
  };
  const FACET_NAMES = {
    buttons: "Buttons", tracking: "Tracking", setup: "Setup",
    reactive: "Reactive calls", punishment: "Mistake punishment"
  };

  const traitList = spec =>
    Object.entries(TRAIT_NAMES).map(([k, label]) => facetRow(label, spec.traits[k])).join("");

  const complexityList = spec =>
    Object.entries(FACET_NAMES).map(([k, label]) => facetRow(label, spec.complexity[k])).join("");

  const likeList = (items) =>
    `<ul style="margin:0;padding-left:17px">${items.map(i =>
      `<li style="color:var(--muted);font-size:12.5px;margin:3px 0">${esc(i.t)} ${srcBadge(i.s)}</li>`).join("")}</ul>`;

  const videoBlock = spec => spec.video === null
    ? `<div class="video-block"><strong>No verified video for ${esc(spec.name)}</strong>
        <p>The August 5 snapshot contains no video whose creator, title, and date we could verify.
        We never invent one. When a verified video exists, it appears here with creator, title, date, and a verification note.</p></div>`
    : `<div class="evi-card"><strong>${esc(spec.video.title)}</strong>
        <p>${esc(spec.video.creator)} · ${esc(spec.video.date)} · ${esc(spec.video.verified)}</p>
        <a href="${esc(spec.video.url)}" target="_blank" rel="noreferrer">Watch ↗</a></div>`;

  const evidenceBlock = spec => {
    const e = spec.evidence;
    const build = e.builds
      ? `<strong>${e.builds} recent community build${e.builds === 1 ? "" : "s"}</strong>
         <p>Top documented: ${esc(e.topTitle)} (updated ${esc(e.updated)})</p>
         <a href="${esc(e.topUrl)}" target="_blank" rel="noreferrer">Open community build ↗</a>`
      : `<strong>No submitted builds captured</strong>
         <p>A documentation gap, not evidence of weakness.</p>`;
    return `<div class="evi-card">${build}<p style="margin-top:8px">${srcBadge("reports")} ${esc(e.reportNote)}</p></div>`;
  };

  const legend = () =>
    `<div class="src-legend">Evidence tiers:
      ${srcBadge("data")} <span>${esc(P.sourceHelp.data)}</span>
      ${srcBadge("reports")} <span>${esc(P.sourceHelp.reports)}</span>
      ${srcBadge("inference")} <span>${esc(P.sourceHelp.inference)}</span></div>`;

  // Full detail body used inside dialogs / panels.
  const detailHTML = spec => `
    <div style="--accent:${spec.color}">
      <header style="padding:30px 32px 22px;background:linear-gradient(125deg,color-mix(in srgb,${spec.color} 16%,#11151d),#11151d);border-bottom:1px solid var(--line)">
        <div class="p-kicker">${esc(spec.klass)} · ${esc(spec.role)} · ${esc(spec.range)}</div>
        <h2 style="margin:4px 0 8px;font-size:33px;letter-spacing:-.04em">${esc(spec.name)}</h2>
        <p style="margin:0;color:#c0c7d2;font-size:14px">${esc(spec.oneLiner)}</p>
      </header>
      <div style="padding:22px 32px 34px;display:grid;gap:20px">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
          <div><h3 class="p-kicker" style="margin:0 0 8px">You'll probably enjoy it if</h3>${likeList(spec.enjoy)}</div>
          <div><h3 class="p-kicker" style="margin:0 0 8px;color:var(--red)">Probably frustrating if</h3>${likeList(spec.avoid)}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px">
          <div><h3 class="p-kicker" style="margin:0 0 6px">Playstyle profile</h3>${traitList(spec)}</div>
          <div><h3 class="p-kicker" style="margin:0 0 6px">Complexity, decomposed</h3>${complexityList(spec)}
            <p style="color:var(--dim);font-size:11px;margin:8px 0 0">Five separate dimensions - not one difficulty score.</p></div>
        </div>
        <div><h3 class="p-kicker" style="margin:0 0 6px">Does it change at higher levels?</h3>
          <div class="evi-card"><p style="margin:0">${esc(spec.shift.t)} ${srcBadge(spec.shift.s)}</p></div></div>
        <div><h3 class="p-kicker" style="margin:0 0 6px">Current evidence</h3>${evidenceBlock(spec)}</div>
        <div><h3 class="p-kicker" style="margin:0 0 6px">Recent video</h3>${videoBlock(spec)}</div>
        ${legend()}
      </div>
    </div>`;

  // Comparison tray manager. capacity 3; onChange(ids) fires after every change.
  function makeTray(onChange) {
    const ids = [];
    return {
      ids,
      toggle(id) {
        const i = ids.indexOf(id);
        if (i >= 0) ids.splice(i, 1);
        else if (ids.length < 3) ids.push(id);
        onChange(ids);
      },
      remove(id) { const i = ids.indexOf(id); if (i >= 0) ids.splice(i, 1); onChange(ids); },
      has: id => ids.includes(id)
    };
  }

  return { P, esc, srcBadge, meter5, facetRow, traitList, complexityList, likeList,
           videoBlock, evidenceBlock, legend, detailHTML, makeTray,
           TRAIT_NAMES, FACET_NAMES };
})();
