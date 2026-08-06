/* "Choose your class" — Oracle flow + honest scoring.
   Binding rules (design ruling 2026-08-06, Sol-approved):
   - Distance matching on the researched demand axes; a calm preference is a target, not a penalty.
   - Boss (single-target) endgame context only, and the results say so.
     (The 2026-08-06 enrichment replaced the old 'general' context with full per-context coverage.)
   - Playstyle family is a soft signal only.
   - Match score and evidence coverage are computed separately.
   - Missing cells are unknown — excluded from distance, counted against coverage.
   - Evidence tier moves confidence, never desirability.
   - No fit percentages; tiers are Strong / Plausible / Wildcard.
   - The opening vignette sets tone and scores nothing. */
window.COA_CHOOSE = (() => {
  "use strict";

  const R = window.COA_RENDER;
  const { data, famById, esc, glyph, classSlug } = R;

  // ---------- Questions ----------

  const QUESTIONS = [
    { id: "vignette", scene: "The Ambush", scored: false,
      q: "A pack of raiders bursts from the treeline. Your group scatters. What is your first instinct?",
      hint: "A tone-setter, not a test. This one is never scored.",
      choices: [
        { t: "Finish the plan", d: "I had effects layered three deep. I refuse to leave before the payoff." },
        { t: "Hold the line", d: "Someone has to stand in the doorway. It's me." },
        { t: "Find the wounded", d: "The fight is lost the moment my people start falling." },
        { t: "Move and flank", d: "The battle rewrites itself every second. So do I." },
      ] },
    { id: "role", q: "What role do you want to play?", hint: "A plain question. 'Any' is a real answer.",
      choices: [
        { t: "Damage", d: "The meters are honest and so am I.", v: "Damage" },
        { t: "Tank", d: "I am the fixed point the fight bends around.", v: "Tank" },
        { t: "Healer / Support", d: "Other people's best moments are my work.", v: "HealerSupport" },
        { t: "Any", d: "Read me and decide.", v: null },
      ] },
    { id: "range", q: "Melee or ranged?", hint: "Also a plain question.",
      choices: [
        { t: "Melee", d: "In their space, reading their feet.", v: "Melee" },
        { t: "Ranged", d: "The battlefield is a board I read from above.", v: "Ranged" },
        { t: "Any", d: "Wherever the right spec lives.", v: null },
      ] },
    { id: "payoff", q: "Where should your damage come from?", hint: "The shape of the payoff, not the size of it.",
      choices: [
        { t: "Long setups", d: "I build the bomb. Then I light it.", v: "setup" },
        { t: "Big windows", d: "Bank it, open the window, spend it in order.", v: "combo" },
        { t: "Steady pressure", d: "A rhythm I can hold under any pressure.", v: "steady" },
        { t: "Pets and machines", d: "My power stands next to me and hits things.", v: "commanders" },
      ] },
    { id: "load", q: "How busy do you want your hands and your head?",
      hint: "This maps to the researched demand axes, honestly.",
      choices: [
        { t: "Calm and readable", d: "Nothing collapses if I glance away.", v: 1.75 },
        { t: "Engaged", d: "Plates spinning, but I chose each plate.", v: 3.25 },
        { t: "Overloaded, gloriously", d: "If I'm not tracking five things I'm bored.", v: 4.75 },
      ] },
    { id: "cost", q: "How much should a mistake cost?", hint: "Failure cost is a real, researched axis.",
      choices: [
        { t: "Everything", d: "High stakes make the win real.", v: 4.75 },
        { t: "A window, not the fight", d: "Sting me, don't bury me.", v: 3.25 },
        { t: "Barely anything", d: "I'm here to relax and blow things up.", v: 1.75 },
      ] },
  ];

  // ---------- Scoring ----------

  const ORD = { "low": 1, "low-moderate": 2, "moderate": 3, "moderate-high": 4, "high": 5 };
  // All demand axes except failure_cost, which the mistake-cost answer targets directly.
  // ('sequencing' was retired by the enrichment pass; the roster now carries six axes.)
  const LOAD_AXES = ["core_actions", "state_tracking", "setup_burden",
                     "reactive_decisions", "execution"];

  function genCell(s, axis) { return (s.complexity[axis] || {}).boss || null; }

  function roleMatches(s, role) {
    if (!role) return true;
    if (role === "HealerSupport") return s.roles.includes("Healer") || s.roles.includes("Support");
    return s.roles.includes(role);
  }
  function rangeMatches(s, range) {
    if (!range) return true;
    return s.range.includes(range) || s.range.includes("Hybrid");
  }

  function scoreSpec(s, a) {
    // Axis targets from answered preference questions only.
    const targets = [];
    if (a.load != null) LOAD_AXES.forEach(ax => {
      // Choosing the setup playstyle is consenting to setup work, even at calm load.
      const t = (ax === "setup_burden" && a.payoff === "setup") ? Math.max(a.load, 3.25) : a.load;
      targets.push([ax, t]);
    });
    else if (a.payoff === "setup") targets.push(["setup_burden", 3.25]);
    if (a.cost != null) targets.push(["failure_cost", a.cost]);

    let distSum = 0, distN = 0, present = 0;
    const usedCells = [];
    for (const [ax, t] of targets) {
      const cell = genCell(s, ax);
      if (!cell) continue; // unknown, never zero or average
      present++;
      usedCells.push(cell);
      distSum += Math.abs((ORD[cell.v] || 3) - t);
      distN++;
    }
    const axisScore = distN ? 1 - (distSum / distN) / 3.25 : 0.5; // neutral when nothing answered
    const famBonus = a.payoff
      ? (s.atlas === a.payoff ? 0.12 : (s.alsoFits.some(f => f.atlas === a.payoff) ? 0.06 : 0))
      : 0;
    const match = Math.max(0, Math.min(1, 0.88 * axisScore + famBonus));

    const coverage = targets.length ? present / targets.length : 1;
    const strong = usedCells.filter(c => (c.tiers || []).some(t => t === "data" || t === "players")).length;
    const evidence = usedCells.length ? strong / usedCells.length : 0;
    let confidence = "Medium";
    if (coverage < 0.5 || (usedCells.length && evidence < 0.34) || s.confidence === "low") confidence = "Low";
    else if (coverage >= 0.75 && evidence >= 0.5) confidence = "High";
    return { match, coverage, evidence, confidence };
  }

  function reasonsFor(s, a, sc) {
    const out = [];
    if (a.payoff && (s.atlas === a.payoff || s.alsoFits.some(f => f.atlas === a.payoff)))
      out.push(`its ${famById[a.payoff].name} playstyle matches the payoff shape you chose`);
    if (a.load != null) {
      const cell = genCell(s, "state_tracking") || genCell(s, "core_actions");
      if (cell && Math.abs((ORD[cell.v] || 3) - a.load) <= 1)
        out.push(`its ${cell.v.replace(/-/g, " ")} tracking demand sits where you asked`);
    }
    if (a.cost != null) {
      const cell = genCell(s, "failure_cost");
      if (cell && Math.abs((ORD[cell.v] || 3) - a.cost) <= 1)
        out.push(`mistakes cost ${cell.v.replace(/-/g, " ")} here — the stakes you wanted`);
    }
    // Always give exactly two reasons: fill from honest, gameplay-grounded fallbacks.
    const fam = famById[s.atlas];
    const strength = (s.contexts.general || s.contexts.boss || {}).strengths?.[0];
    const fillers = [
      `it lives in the ${fam.name} family — ${fam.tagline.replace(/\.$/, "").toLowerCase()}`,
      strength ? `players report: ${strength.replace(/\.$/, "").toLowerCase()}` : "",
      `it fits the role and range you set, judged on the researched axes`,
    ].filter(Boolean);
    for (const f of fillers) {
      if (out.length >= 2) break;
      if (!out.includes(f)) out.push(f);
    }
    return out.slice(0, 2);
  }

  function tradeoffFor(s) {
    // Gameplay only — research thinness belongs in the confidence line, never here.
    const avoid = s.fit.avoid[0]?.t;
    if (avoid) return avoid;
    const caution = (s.contexts.general || s.contexts.boss || {}).cautions?.[0];
    if (caution) return caution;
    const fc = genCell(s, "failure_cost");
    return fc ? `failure cost runs ${fc.v.replace(/-/g, " ")} — mistakes are visible` : "trade-offs not yet researched";
  }

  function recommend(a) {
    const pool = data.specs.filter(s => roleMatches(s, a.role) && rangeMatches(s, a.range));
    const scored = pool.map(s => ({ s, ...scoreSpec(s, a) })).sort((x, y) => y.match - x.match);

    // Best spec per class, classes ranked by their best spec.
    const byClass = new Map();
    for (const r of scored) if (!byClass.has(r.s.klass)) byClass.set(r.s.klass, r);
    const classes = [...byClass.values()];

    // Ranking is by match alone — evidence never reorders results. Thin-evidence
    // picks keep their earned slot and are labeled Wildcard instead.
    return classes.slice(0, 3).map((r, i) => ({
      ...r,
      tier: r.confidence === "Low" ? "Wildcard" : (i === 0 ? "Strong match" : "Plausible match"),
    }));
  }

  // ---------- Oracle UI ----------

  const el = id => document.getElementById(id);
  let step = 0;
  let answers = { vignette: null, role: null, range: null, payoff: null, load: null, cost: null };

  function save() { try { sessionStorage.setItem("coaChoose", JSON.stringify({ step, answers })); } catch {} }
  function restore() {
    try {
      const raw = sessionStorage.getItem("coaChoose");
      if (!raw) return;
      const st = JSON.parse(raw);
      if (st && st.answers) { step = st.step; answers = { ...answers, ...st.answers }; }
    } catch {}
  }

  function drawQ() {
    const root = el("oracle");
    if (step >= QUESTIONS.length) return drawResults();
    const { scene, q, hint, choices } = QUESTIONS[step];
    root.innerHTML = `
      <div class="prog">${QUESTIONS.map((_, i) => `<span class="${i < step ? "done" : ""}"></span>`).join("")}</div>
      <p class="stepline">Question ${step + 1} of ${QUESTIONS.length}</p>
      ${scene ? `<div class="scene">Opening vignette · ${scene}</div>` : ""}
      <h2>${esc(q)}</h2><p class="hint">${esc(hint)}</p>
      <div class="choices">${choices.map((c, i) =>
        `<button data-i="${i}"><b>${esc(c.t)}</b>${esc(c.d)}</button>`).join("")}</div>
      <div class="navrow">${step > 0 ? `<button data-nav="back">← Back</button>` : ""}
        <button data-nav="skip">Skip — no preference</button></div>`;
    root.scrollIntoView({ block: "nearest" });
  }

  function resultCard(p) {
    const s = p.s;
    const tierCls = p.tier === "Strong match" ? "t-strong" : p.tier === "Wildcard" ? "t-wild" : "t-plaus";
    const reasons = reasonsFor(s, answers, p);
    const covPct = Math.round(p.coverage * 100);
    const conf = p.tier === "Wildcard"
      ? `Confidence: low — thinner research for this spec, so it is shown as a wildcard, not ranked down.`
      : `Confidence: ${p.confidence.toLowerCase()} — ${covPct}% of your scored axes are researched for this spec.`;
    return `<div class="rcard" style="--class-color:${s.color}">
      <span class="rtier ${tierCls}">${p.tier}</span>
      <a class="rname" href="class.html?c=${classSlug(s)}&from=choose#${s.id.split("/")[1]}">
        <span class="rglyph">${glyph(s)}</span>${esc(s.klass)}, led by ${esc(s.name)}</a>
      <div class="m-sub">${[...s.roles, ...s.range].map(esc).join(" · ")} · ${esc(famById[s.atlas].name)}</div>
      <p class="why"><em>Matched:</em> ${reasons.map(esc).join("; ")}.</p>
      <p class="trade"><em>Trade-off:</em> ${esc(tradeoffFor(s))}</p>
      <p class="conf">${conf}</p>
    </div>`;
  }

  function chipGroups() {
    return QUESTIONS.filter(qq => qq.scored !== false).map(qq => `
      <div class="chip-group"><span class="lab">${esc(qq.q)}</span>
        <div class="chips">${qq.choices.map((c, i) => {
          const on = answers[qq.id] === (c.v !== undefined ? c.v : i) && answers[qq.id] !== null;
          const isAny = c.v === null;
          const anyOn = isAny && answers[qq.id] === null;
          return `<button class="${(on || anyOn) ? "on" : ""}" data-chipq="${qq.id}" data-chipi="${i}">${esc(c.t)}</button>`;
        }).join("")}</div></div>`).join("");
  }

  function drawResults() {
    const picks = recommend(answers);
    el("oracle").innerHTML = `
      <div class="prog">${QUESTIONS.map(() => `<span class="done"></span>`).join("")}</div>
      <p class="stepline">The Atlas has read you</p>
      <h2>${picks.length ? "Three paths fit your answers" : "No spec fits those constraints"}</h2>
      <p class="hint">Scored on the researched demand axes · Boss (single-target) endgame context · relative among researched CoA specs · missing research shown, never guessed</p>
      <div class="result-list" id="results">${picks.map(resultCard).join("")
        || `<p class="hint">Loosen role or range below and the shortlist returns.</p>`}</div>
      <div class="adjust"><span class="adjhead">Adjust your answers — results update live</span>${chipGroups()}</div>
      <div class="navrow"><button data-nav="again">Ask again from the start</button></div>`;
  }

  function init() {
    const root = el("oracle");
    if (!root) return;
    restore();
    root.addEventListener("click", e => {
      const chip = e.target.closest("[data-chipq]");
      if (chip) {
        const qq = QUESTIONS.find(x => x.id === chip.dataset.chipq);
        const c = qq.choices[+chip.dataset.chipi];
        answers[qq.id] = c.v !== undefined ? c.v : +chip.dataset.chipi;
        save(); drawResults(); return;
      }
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.nav === "back") { step--; save(); return drawQ(); }
      if (b.dataset.nav === "skip") { answers[QUESTIONS[step].id] = null; step++; save(); return drawQ(); }
      if (b.dataset.nav === "again") {
        step = 0;
        answers = { vignette: null, role: null, range: null, payoff: null, load: null, cost: null };
        save(); return drawQ();
      }
      if (b.dataset.i !== undefined) {
        const qq = QUESTIONS[step];
        const c = qq.choices[+b.dataset.i];
        answers[qq.id] = qq.scored === false ? +b.dataset.i : (c.v !== undefined ? c.v : +b.dataset.i);
        step++; save(); drawQ();
      }
    });
    if (location.hash === "#results" && step >= QUESTIONS.length) drawResults();
    else drawQ();
  }

  if (typeof document !== "undefined" && document.readyState !== "loading") init();
  else if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", init);

  return { QUESTIONS, scoreSpec, recommend, reasonsFor, tradeoffFor };
})();
