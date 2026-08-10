/* Guided pilot renderer — the ratified Anatomy grammar. Deliberately
   display-only: recommendation relationships arrive precomputed in COA_GUIDED
   and are never scored, totalled, or sorted here. One panel grammar serves both
   surfaces — lit by a scenario it is the Guided Verdict, unlit it is the Class
   Ledger. */
(() => {
  "use strict";

  const D = window.COA_GUIDED;
  const R = window.COA_RENDER;
  if (!D || !R) throw new Error("Guided data or shared renderer failed to load.");
  const { esc, classSlug, specById } = R;
  const visual = state => D.schema.visual_eligibility[state] || D.schema.visual_eligibility.unknown;
  const pilotById = Object.fromEntries(D.pilots.map(pilot => [pilot.id, pilot]));

  function siteSpec(pilot, spec) { return specById[`${pilot.id}/${spec.id}`]; }
  function evidence(state) {
    const item = visual(state);
    return `<span class="guided-evidence" data-evidence="${esc(state)}"><b>${esc(item.badge)}</b><span>${esc(item.treatment)}</span></span>`;
  }
  function specLink(klass, spec, label) {
    const known = specById[`${klass}/${spec.id}`];
    const slug = known ? classSlug(known) : klass;
    return `<a href="class.html?c=${esc(slug)}&from=guided#${esc(spec.id)}">${label}</a>`;
  }
  // Node → arrow → node. The evidence chip rides each arrow; the caption
  // repeats every edge sentence as visible text so the chips are never the
  // only channel.
  function chain(edges) {
    const links = edges.map((edge, index) =>
      `${index === 0 ? `<span class="cnode">${esc(edge.from)}</span>` : ""}` +
      `<span class="carrow">→${evidence(edge.state)}</span><span class="cnode">${esc(edge.to)}</span>`).join("");
    return `<div class="chain">${links}</div>
      <p class="chain-cap">${edges.map(edge => esc(edge.text)).join(" ")}</p>`;
  }
  // Engine Room drawer. Real disclosure control: every branch carries one.
  // Default-open set — chain drawers everywhere, the lead's kit drawer on
  // guided.html, and every drawer on class.html (allDrawers).
  function drawer(spec, label, allDrawers) {
    if (spec.loop.kind === "dependency_card") {
      return `<details class="anat-drawer" open><summary>Engine Room — qualified dependency</summary>${chain(spec.loop.edges)}</details>`;
    }
    const open = (allDrawers || label === "lead") ? " open" : "";
    return `<details class="anat-drawer"${open}><summary>Engine Room — unordered kit</summary>
      <div class="guided-tiles">${spec.kit_tiles.map(tile => `<span class="guided-tile">${esc(tile)}</span>`).join("")}</div>
      <p class="anat-note">${esc(spec.loop.reason)}</p></details>`;
  }
  function branch(pilot, spec, entry, allDrawers) {
    const rel = entry && entry.specs.find(item => item.id === spec.id);
    const label = rel ? rel.relationship : null;
    const stateClass = label ? ` is-${label === "unknown" ? "unknown_rel" : esc(label)}` : "";
    // The tag text always names the state; dimming is never the only channel.
    const tag = label ? ` <span class="anat-tag ${esc(label)}">${esc(label.replace(/_/g, " "))}</span>` : "";
    const reason = rel ? `<p class="anat-reason">${esc(rel.reason)}</p>` : "";
    return `<div class="anat-spec${stateClass}">
      <h4>${specLink(pilot.id, spec, esc(spec.name))}${tag}</h4>${reason}
      <div class="anat-facts"><span>${esc(spec.roles.value.join(" / "))}</span>${evidence(spec.roles.state)}
        <span>${esc(spec.range.value || "range unknown")}</span>${evidence(spec.range.state)}
        <span>${esc(spec.payoff.value.join(", "))}</span>${evidence(spec.payoff.state)}</div>
      ${drawer(spec, label, allDrawers)}</div>`;
  }
  function panel(pilot, entry, allDrawers) {
    const site = siteSpec(pilot, pilot.specs[0]);
    const head = entry
      ? `lead score ${esc(entry.lead_score)} · flexibility ${esc(entry.flexibility)}`
      : `${pilot.specs.length} specs · no scenario`;
    const caution = entry ? `<p class="anat-note anat-caution">Flexibility may only break recorded ties.</p>` : "";
    return `<article class="anat-class" style="--cc:${esc(site?.color || "var(--anat-gold)")}">
      <div class="anat-head"><h3>${esc(pilot.name)}</h3><span>${head}</span></div>
      <div class="anat-chassis">${esc(pilot.shared_chassis.value)}${evidence(pilot.shared_chassis.state)}</div>
      <div class="anat-branches">${pilot.specs.map(spec => branch(pilot, spec, entry, allDrawers)).join("")}</div>
      <p class="anat-note">Branches show which specs share the chassis. Order carries no meaning.</p>${caution}
    </article>`;
  }
  function renderScenario(index) {
    const scenario = index === null ? null : D.recommendations.scenarios[index];
    const target = document.getElementById("guided-verdict");
    if (target) {
      target.innerHTML = scenario
        ? scenario.classes.map(entry => panel(pilotById[entry.id], entry, false)).join("")
        : D.pilots.map(pilot => panel(pilot, null, false)).join("");
    }
    const title = document.getElementById("scenario-title");
    if (title) title.textContent = scenario ? scenario.title : "No scenario — every pilot class and spec, unlit.";
    const current = scenario ? String(index) : "browse";
    document.querySelectorAll("[data-scenario]").forEach(button => {
      const active = button.dataset.scenario === current;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  function renderGuidedPage() {
    const bar = document.getElementById("scenario-bar");
    if (!bar) return;
    D.recommendations.scenarios.forEach((scenario, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.scenario = index;
      button.textContent = scenario.title;
      button.addEventListener("click", () => renderScenario(index));
      bar.appendChild(button);
    });
    const pill = document.createElement("button");
    pill.type = "button";
    pill.dataset.scenario = "browse";
    pill.textContent = "No scenario · browse";
    pill.addEventListener("click", () => renderScenario(null));
    bar.appendChild(pill);
    renderScenario(0);
  }
  function renderEngineRoom() {
    const target = document.getElementById("engine-room");
    if (!target) return;
    const klass = new URLSearchParams(location.search).get("c") || "chronomancer";
    const pilot = pilotById[klass];
    if (!pilot) return;
    target.hidden = false;
    target.innerHTML = `<div class="guided-engine-head"><span class="guided-kicker">Guided pilot</span><h2>${esc(pilot.name)} Engine Room</h2><p>${esc(pilot.shared_chassis.value)}</p></div>
      <div class="guided-engine-panel">${panel(pilot, null, true)}</div>`;
  }

  renderGuidedPage();
  renderEngineRoom();
})();
