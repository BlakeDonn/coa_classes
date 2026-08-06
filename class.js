/* Dedicated class page: masthead + spec summary rail + full inline codex profile.
   URL contract: class.html?c=<class-slug>[&from=choose]#<spec-slug> */
(() => {
  "use strict";

  const R = window.COA_RENDER;
  const { data, esc, glyph, profileHTML, bestCtx } = R;

  // One-line editorial premises. Grounded in the roster's researched identities.
  const PREMISE = {
    "barbarian": "Rage is the engine. Every spec spends fury differently — on skulls, on trophies, or on the ancestors who answer.",
    "witch-doctor": "Spirits do the dirty work. Curses, brews, and loas — power borrowed from things best not named.",
    "felsworn": "A pact with fel power, paid in different coins: the hunt, the inferno, or the throne.",
    "witch-hunter": "Tools of a grim trade — bolts, hounds, black armor, and the Inquisition's writ.",
    "stormbringer": "The storm answers. Lightning, wind, and the maelstrom, aimed by mortal hands.",
    "knight-of-xoroth": "A dread knight of the burning legions — hellfire, warfare, and defiance made armor.",
    "guardian": "The shield decides the fight. Vanguard holds, Inspiration lifts, Gladiator answers.",
    "templar": "Faith with a blade's edge. Zeal, oaths, and crusade — conviction in three tempos.",
    "bloodmage": "Blood is the resource. Spend your own life, curse theirs, or weave flesh back together.",
    "ranger": "The wilds fight beside you — from far strides to true arrows to a brigand's knife.",
    "chronomancer": "Time itself is the resource. Every Chronomancer bends cooldowns, echoes, and epochs — they differ in whether the bent time burns, shoots, or heals.",
    "necromancer": "Death obeys. Rot it, freeze it, or raise it and march it forward.",
    "pyromancer": "Fire in every register — the weave that mends, the blaze that consumes, the dragon that endures.",
    "cultist": "Whispers from below, answered. Blades, corruption, heresy, and a dreadnought's bulk.",
    "starcaller": "The sky is an arsenal. Moonlight guards and heals; stars sentinel and hunt.",
    "sun-cleric": "The sun militant. Piety, blessing, seraphim wings, and a valkyrie's spear.",
    "tinker": "Machines do the hitting. Demolition, invention, and mechanics — genius as a weapon.",
    "venomancer": "Toxin is patient. Venom stacks, stalkers strike, fortitude endures, viziers mend.",
    "reaper": "The harvest never ends. Souls reaped, souls kept, souls bent to dominion.",
    "primalist": "The old world's strength — beasts, stone, living growth, and the mountain king's stand.",
    "runemaster": "Runes hold the power; order releases it. Carve, sequence, and step through the rift.",
  };

  const el = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const cSlug = params.get("c") || "chronomancer";
  const fromChoose = params.get("from") === "choose";

  const specs = data.specs.filter(s => s.id.split("/")[0] === cSlug);
  if (!specs.length) {
    document.body.innerHTML = `<p style="padding:40px;color:#cdcdcd">Unknown class. <a style="color:#c9aa71" href="index.html">Back to the Atlas</a>.</p>`;
    return;
  }
  const klass = specs[0].klass;
  const color = specs[0].color;

  document.title = `${klass} — CoA Atlas`;

  function roleChips() {
    const counts = {};
    specs.forEach(s => s.roles.forEach(r => { counts[r] = (counts[r] || 0) + 1; }));
    const ranges = [...new Set(specs.flatMap(s => s.range))];
    return [...Object.entries(counts).map(([r, n]) => n > 1 ? `${r} ×${n}` : r), ...ranges]
      .map(t => `<span>${esc(t)}</span>`).join("");
  }

  function bestFor(s) { return s.fit.enjoy[0]?.t || (s.contexts[bestCtx(s)]?.strengths || [])[0] || ""; }
  function cautionFor(s) { return s.fit.avoid[0]?.t || (s.contexts[bestCtx(s)]?.cautions || [])[0] || ""; }

  function railHTML(selId) {
    return specs.map(s => {
      const short = s.id.split("/")[1];
      const sel = s.id === selId;
      return `<button class="rail-card ${sel ? "sel" : ""}" role="tab" aria-selected="${sel}"
          id="tab-${short}" data-sel="${s.id}" style="--class-color:${s.color}">
        <b>${esc(s.name)}</b>
        <div class="m-sub">${[...s.roles, ...s.range].map(esc).join(" · ")}</div>
        <p class="clamp2">"${esc(s.fantasy || s.oneLine)}"</p>
        ${bestFor(s) ? `<p class="bestfor"><em>Best for:</em> ${esc(bestFor(s))}</p>` : ""}
        ${cautionFor(s) ? `<p class="caution"><em>Caution:</em> ${esc(cautionFor(s))}</p>` : ""}
      </button>`;
    }).join("");
  }

  function select(id, updateHash = true) {
    const s = specs.find(x => x.id === id) || specs[0];
    el("rail").innerHTML = railHTML(s.id);
    el("codex").innerHTML = profileHTML(s, { classLink: false });
    el("codex").setAttribute("aria-labelledby", "tab-" + s.id.split("/")[1]);
    if (updateHash) history.replaceState(null, "", location.pathname + location.search + "#" + s.id.split("/")[1]);
  }

  // Masthead
  el("mast").innerHTML = `
    <span class="glyph" aria-hidden="true">${glyph(specs[0])}</span>
    <div class="crumb"><a href="index.html">Atlas</a> / ${esc(klass)}
      ${fromChoose ? ` · <a href="choose.html#results">← Back to your results</a>` : ""}</div>
    <div class="kick">Class · ${specs.length} specializations</div>
    <h1>${esc(klass)}</h1>
    <p>${esc(PREMISE[cSlug] || "")}</p>
    <div class="cp-roles">${roleChips()}</div>`;
  el("mast").style.setProperty("--class-color", color);

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

  const wanted = cSlug + "/" + location.hash.slice(1);
  select(specs.some(s => s.id === wanted) ? wanted : specs[0].id, !!location.hash);
})();
