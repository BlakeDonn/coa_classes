/* The ruled class card (Atlas grammar §4, "THE CARD IS CLOSED").
   Composition: medal · name · jobs line · range line · tagline (keyword glow) ·
   engine blurb · ✦ computed facts · doors (queue icon + name + archetype tag +
   range) · video corner.

   CRESTS ARE SKIPPED (user ruling, 2026-08-10): the build-hub crest sprite is not
   shipped until rights confirm, so the medal renders the class glyph instead.
   Every ✦ fact is computed live from the roster — no fact, no bullet.

   Loads after explorer-data.js, profile-render.js and authored-copy.js. */
window.COA_CARDS = (() => {
  "use strict";

  const R = window.COA_RENDER, COPY = window.COA_COPY;
  if (!R || !COPY) throw new Error("profile-render.js and authored-copy.js must load first");
  const { data, esc, CLASS_GLYPHS } = R;

  // ---------- class rollups ----------
  const byClass = new Map();
  for (const s of data.specs) {
    if (!byClass.has(s.klass)) byClass.set(s.klass,
      { name: s.klass, color: s.color, glyph: CLASS_GLYPHS[s.klass] || "✦", specs: [] });
    byClass.get(s.klass).specs.push(s);
  }
  // Alphabetical: no ordering that could read as rank.
  const classes = [...byClass.values()].sort((a, b) => a.name.localeCompare(b.name));
  const classByName = Object.fromEntries(classes.map(c => [c.name, c]));

  // ---------- computed ✦ facts ----------
  const roleRangeTotal = (role, range) =>
    data.specs.filter(s => s.roles.includes(role) && s.range.includes(range)).length;
  const meleeHealersTotal = roleRangeTotal("Healer", "Melee");
  const meleeSupportTotal = roleRangeTotal("Support", "Melee");
  const NWORD = { 3: "Three", 4: "Four" };

  // Rarity rule: a bullet must be interesting, so common patterns rank low and the
  // playstyles line only appears when the jobs line hasn't already said it.
  function factsFor(c) {
    const out = [];
    // True-support rule (ruled 2026-08-09, strict everywhere): the jobs counting
    // ignores Support on specs that also heal. Doors are untouched.
    const distinctRoles = [...new Set(c.specs.flatMap(s =>
      s.roles.filter(r => r !== "Support" || !s.roles.includes("Healer"))))];
    const distinctFams = [...new Set(c.specs.map(s => s.atlas))];
    const n = c.specs.length;
    const mh = c.specs.find(s => s.roles.includes("Healer") && s.range.includes("Melee"));
    if (mh) out.push(["Melee healer option", `${mh.name}: ${meleeHealersTotal} of 70 specs heal from melee range.`]);
    const ms = c.specs.find(s => s.roles.includes("Support") && s.range.includes("Melee"));
    if (ms && meleeSupportTotal <= 4)
      out.push(["Melee support option", `${ms.name}: ${meleeSupportTotal} of 70 specs support from melee range.`]);
    if (distinctRoles.length === 4) out.push([`Four specs, four different jobs`,
      `Roles across the specs: ${distinctRoles.join(", ")}.`]);
    if (c.specs.every(s => s.roles.length === 1 && s.roles[0] === "Damage"))
      out.push([`All ${(NWORD[n] || n).toLowerCase()} specs share one calling: damage`,
        `Every ${c.name} spec's only role is Damage.`]);
    if (c.specs.every(s => s.range.length === 1 && s.range[0] === "Melee"))
      out.push(["Every spec fights in melee", "No ranged or hybrid option anywhere in the class."]);
    if (c.specs.every(s => s.range.length === 1 && s.range[0] === "Ranged"))
      out.push(["Every spec fights from range", "No melee or hybrid option anywhere in the class."]);
    if (out.length < 2 && distinctRoles.length === 3 && n === 3)
      out.push([`Three specs, three different jobs`, `Roles: ${distinctRoles.join(", ")}.`]);
    if (!out.some(f => f[0].includes("jobs")) && out.length < 2 && distinctFams.length === n && n === 4)
      out.push([`Four specs, four different playstyles`,
        `Each spec sits in a different playstyle family: ${distinctFams.map(f =>
          (data.families.find(x => x.id === f) || { name: f }).name).join(", ")}.`]);
    return out.slice(0, 2);
  }

  // ---------- role coupling: the HD queue icons (Atlas grammar §4, round 8) ----------
  // 64px frames of WoW's UI-LFG-ICON-ROLES via the canonical interface-art mirror.
  // Support = the texture's green flag, matching the gold-rim style.
  const ROLE_ICON = { Damage: "generated-assets/lfg-damage.png", Tank: "generated-assets/lfg-tank.png",
    Healer: "generated-assets/lfg-healer.png", Support: "generated-assets/lfg-flag.png" };
  const roleImgs = roles => `<span class="rimg" data-tipname="${esc(roles.join(" + "))}"
    data-tip="${esc("Role" + (roles.length > 1 ? "s" : "") + ": " + roles.join(", "))}">${roles.map(r =>
    `<img src="${ROLE_ICON[r]}" alt="${esc(r)}">`).join("")}</span>`;

  // ---------- doors ----------
  function doorHTML(s) {
    const mid = COPY.MICRO[s.id];
    return `<button data-open="${s.id}">${roleImgs(s.roles)}<span class="nm">${esc(s.name)}</span>
      ${mid ? `<span class="mid">${esc(mid)}</span>` : ""}<span class="rs">${esc(s.range.join(" · "))}</span></button>`;
  }
  const doorsHTML = c => `<div class="cl-specrows">${c.specs.map(doorHTML).join("")}</div>`;

  // ---------- video corner ----------
  const videoId = c => {
    const s = c.specs.find(s => (s.media || {}).classVideo);
    return s ? s.media.classVideo : null;
  };
  function cornerHTML(c) {
    const id = videoId(c);
    if (!id) return "";
    return `<a class="cl-thumb" href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank"
      rel="noreferrer" aria-label="${esc(c.name)} class highlight video">
      <img src="https://i.ytimg.com/vi/${esc(id)}/mqdefault.jpg" alt="" loading="lazy">
      <span class="play">▶</span><span class="cap">Class highlight</span></a>`;
  }

  // ---------- sub lines: jobs (true-support rule), then range on its own line ----------
  const RANGES = ["Melee", "Hybrid", "Ranged"];
  const JOBS = ["Damage", "Tank", "Healer", "Support"];
  function subLines(c) {
    const jobs = JOBS.filter(r => c.specs.some(s => r === "Support"
      ? s.roles.includes("Support") && !s.roles.includes("Healer")
      : s.roles.includes(r)));
    const ranges = RANGES.filter(r => c.specs.some(s => s.range.includes(r)));
    return `<div class="cl-sub">${jobs.map(esc).join(" · ")}</div>
      <div class="cl-sub cl-sub-range">${ranges.join(ranges.length > 2 ? " · " : " &amp; ")}</div>`;
  }

  // Tagline with the ruled keyword glow. Absent copy renders no line at all.
  function taglineHTML(name, cls = "cl-tagline", kwCls = "kw") {
    const tag = COPY.TAGLINES[name];
    if (!tag) return "";
    return `<div class="${cls}">${esc(tag.t).replace(esc(tag.kw),
      `<span class="${kwCls}">${esc(tag.kw)}</span>`)}</div>`;
  }

  // A real class icon for the medal: the class's first defining-talent art (the recorded
  // ability-icon fallback while crests await rights). Glyph only when no icon exists.
  function classIcon(c) {
    const ic = c.specs.find(s => s.media.icons[0])?.media.icons[0];
    return ic ? `<img src="generated-assets/skill-icons/${esc(ic.icon)}.jpg" alt="" loading="lazy">` : c.glyph;
  }

  // ---------- the card ----------
  function composeCard(c) {
    const eng = COPY.ENGINES[c.name];
    const facts = factsFor(c);
    const hasThumb = !!videoId(c);
    return `<article class="plate cl-card${hasThumb ? " has-thumb" : ""}" style="--class-color:${c.color}">
      <div class="cl-top"><span class="cl-medal">${classIcon(c)}</span>
        <div><h3>${esc(c.name)}</h3>${subLines(c)}</div>
        ${cornerHTML(c)}</div>
      ${taglineHTML(c.name)}
      ${eng ? `<div class="cl-engine"><span class="lab">${esc(eng.lab)}</span><p>${esc(eng.p)}</p></div>` : ""}
      ${facts.length ? `<ul class="cl-rare">${facts.map(f =>
        `<li data-tipname="${esc(f[0])}" data-tip="${esc(f[1])}"><span class="mark">✦</span>${esc(f[0])}</li>`).join("")}</ul>` : ""}
      <div class="cl-div"></div>
      ${doorsHTML(c)}
    </article>`;
  }

  // A click inside these never opens a door — they are tooltips or the video link.
  const isNotDoor = target => !!(target.closest(".rimg") || target.closest(".cl-rare li")
    || target.closest("a.cl-thumb") || target.closest(".famname") || target.closest(".vb"));

  return { classes, classByName, composeCard, factsFor, subLines, taglineHTML,
    roleImgs, doorsHTML, doorHTML, cornerHTML, videoId, ROLE_ICON, isNotDoor };
})();
