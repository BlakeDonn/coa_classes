/* Authored copy — the single source for every user-ruled sentence on the site.
   Extracted verbatim from the design-lab studies (card-study-2.js, rhythm-study.js)
   under the site-adoption slice, 2026-08-10. NOTHING here may be edited casually:
   every line is a user ruling recorded in the grammar contracts
   (class-page-grammar.md · atlas-page-grammar.md · choose-page-grammar.md).

   Absent, never invented: a class or spec with no entry renders its honest gap. */
window.COA_COPY = (() => {
  "use strict";

  // ---------- ×21 taglines (Atlas grammar §4; class-page grammar §1) ----------
  // One line at desktop width. `kw` is the single word carrying the ruled
  // class-color keyword glow — decoration only, never an information channel.
  // draft:true = verbiage not yet eyeballed by the user; the grounding is recorded
  // in the lab's GROUNDING map (card-study-2.js).
  const TAGLINES = {
    "Cultist": { t: "The whispers offer power. Will you listen?", kw: "whispers", draft: false },
    "Tinker": { t: "Build it. Deploy it. Keep the workshop running.", kw: "workshop", draft: true },
    "Witch Hunter": { t: "The hunt is holy. The tools are not.", kw: "hunt", draft: true },
    "Guardian": { t: "Hold the line. The line holds everyone.", kw: "line", draft: true },
    "Knight of Xoroth": { t: "Damnation rides with you.", kw: "Damnation", draft: true },
    "Barbarian": { t: "Fury of the north, fed by ale and ancestors.", kw: "north", draft: true },
    "Bloodmage": { t: "Blood remembers what mana forgets.", kw: "Blood", draft: true },
    "Chronomancer": { t: "Reality is a rough draft.", kw: "draft", draft: false },
    "Felsworn": { t: "The demon inside is load-bearing.", kw: "demon", draft: true },
    "Necromancer": { t: "The dead work for you now.", kw: "dead", draft: true },
    "Primalist": { t: "The wild does not negotiate.", kw: "wild", draft: true },
    "Pyromancer": { t: "Everything burns. Some things burn twice.", kw: "burns", draft: true },
    "Ranger": { t: "Every step is part of the aim.", kw: "aim", draft: true },
    "Reaper": { t: "Everything owes you a soul.", kw: "soul", draft: true },
    "Runemaster": { t: "Power, spelled correctly.", kw: "spelled", draft: true },
    "Starcaller": { t: "The stars aim back.", kw: "stars", draft: true },
    "Stormbringer": { t: "Hold the charge. Not too long.", kw: "charge", draft: true },
    "Sun Cleric": { t: "Dawn breaks. So does everything else.", kw: "Dawn", draft: true },
    "Templar": { t: "An oath is a weapon you keep.", kw: "oath", draft: true },
    "Venomancer": { t: "Patience is a poison too.", kw: "poison", draft: true },
    "Witch Doctor": { t: "Pain, prepared properly.", kw: "prepared", draft: true },
  };

  // ---------- ×21 engine blurbs (Atlas grammar §4 "E1") ----------
  // One cited sentence under the class-colored engine label. On the class page this
  // is the INTERIM masthead text for the 19 classes whose full engine paragraph
  // (2–4 sentences) has not been authored yet.
  const ENGINES = {
    "Cultist": { lab: "The engine — Insanity", p: "Every Cultist runs on Insanity, and it climbs as you act." },
    "Tinker": { lab: "The engine — temporary machines", p: "A Tinker's power stands on the field, not on the action bar." },
    "Witch Hunter": { lab: "The engine — Rage", p: "Every Hunter runs on Rage; each spec layers its own marks and stacks on top." },
    "Guardian": { lab: "The engine — formations", p: "Formations set the stance; Energy, Motivation, and per-spec stacks do the work." },
    "Knight of Xoroth": { lab: "The engine — Demonfire", p: "Every Knight runs on Demonfire, fed by demons and blood." },
    "Barbarian": { lab: "The engine — Energy", p: "Every Barbarian runs on Energy; Enrage speeds the whole kit up." },
    "Bloodmage": { lab: "The engine — blood", p: "The spells cost blood; spent health returns as Thirst and Rage." },
    "Chronomancer": { lab: "The engine — Timewalking", p: "Timewalking stores a past self, and Rewind returns you to it." },
    "Felsworn": { lab: "The engine — Felfury", p: "Build Felfury, spend it in pairs, and bank six to unleash Inner Demon." },
    "Necromancer": { lab: "The engine — Life Force", p: "Life Force raises your undead; Runic Power gives them their orders." },
    "Primalist": { lab: "The engine — Rage", p: "Every Primalist runs on Rage; one active Boon tunes how you earn and spend it." },
    "Pyromancer": { lab: "The engine — Embers and Heat", p: "Every Pyromancer runs on two gauges: Embers to spend, Heat that climbs as you cast." },
    "Ranger": { lab: "The engine — Advantage", p: "Every Ranger builds Advantage from basic attacks and spends it on scaled finishers." },
    "Reaper": { lab: "The engine — the soul ladder", p: "Every Reaper climbs the same ladder: three Fragments to a Soul, three Souls to an Infusion." },
    "Runemaster": { lab: "The engine — engravings", p: "Write first, release second: engravings on weapons, glyphs in sequence, brands on the target." },
    "Starcaller": { lab: "The engine — Scattered Stars", p: "Every spec pins Scattered Stars onto enemies, then consumes them for its own payoff." },
    "Stormbringer": { lab: "The engine — Static", p: "Static climbs as you cast: above 70 your spells supercharge, at 100 the storm turns on you." },
    "Sun Cleric": { lab: "The engine — Dawn", p: "Solar Power builds between Dawns; inside a Dawn window your actions become Vows instead." },
    "Templar": { lab: "The engine — Oaths", p: "Every Templar swears Oaths through strikes, then breaks them for the payoff." },
    "Venomancer": { lab: "The engine — Venoms", p: "You keep two active Venoms; they trigger from your casts and strikes." },
    "Witch Doctor": { lab: "The engine — Spirits", p: "Collected Spirits refund health and mana; each spec runs its own economy on top." },
  };

  // ---------- full class-page engine paragraphs (class-page grammar §1) ----------
  // The ruled 2–4 sentence shape: serif-italic lede, then the body naming the
  // resource, the loop, and the class tension. Only the two authored classes exist;
  // the other 19 fall back to the one-sentence ENGINES blurb above.
  const CLASS_ENGINE = {
    cultist: {
      label: "The engine — Insanity",
      lede: "Every Cultist runs on Insanity, and it climbs as you act.",
      text: "Near 60 it is steady power: strong enough to fuel your kit, safe enough to hold. Cross 100 and it pays out more, punishing you while it lasts.",
    },
    tinker: {
      label: "The engine — temporary machines",
      lede: "A Tinker's power stands on the field, not on the action bar.",
      text: "You build machines — bombs, turrets, beacons, a mech — deploy them where the fight will be, and keep them overlapping. The three specs point the same workshop at destruction, repair, or the pilot's seat.",
    },
  };

  // NOTE on the rare ✦ fragments (class-page grammar §1): they are NOT authored copy.
  // The rule is "every fragment must trace to a computable roster fact — no fact, no
  // bullet, never invented", so both the class page and the Atlas card compute them
  // live from the roster through COA_CARDS.factsFor. The design lab's hard-coded
  // Cultist pair is not carried over: its second line ("Four specs, four different
  // playstyles") is contradicted by the current roster, where Godblade and Corruption
  // share the Planners & Detonators family — three families across four specs.

  // ---------- verbs + glosses (class-page grammar §2) ----------
  // One word per spec, its relation to the engine. A verb must not need the seal
  // to parse: every verb ships with a plain gloss, surfaced as a tooltip.
  const VERBS = {
    "cultist/corruption": ["Spread", "Keep damage-over-time on every target; the engine is coverage."],
    "cultist/dreadnought": ["Endure", "Hold Insanity in a managed band and turn it into survival."],
    "cultist/heretic": ["Convert", "Turn melee aggression into healing for the group."],
    "cultist/godblade": ["Cross", "Push Insanity to 100 on purpose and fight inside the dangerous payoff state."],
    "tinker/demolition": ["Detonate", "Stack explosives and machines, then fire them in one overlapping window."],
    "tinker/invention": ["Restore", "Deploy healing machines where the group will need them."],
    "tinker/mechanics": ["Overclock", "Push your machines and combat suit past their limits."],
  };

  // ---------- authored spec-card copy (class-page grammar §3) ----------
  // Authored to fit, never clamped. Six of the seven blurbs and all ✓/✕ fragments
  // were verified against the v3 corpus (2026-08-10); Godblade's "cashing the full
  // bar" was KEPT by user ruling on its v2 kit grounding.
  const CARDS = {
    "cultist/godblade": {
      line: "A Void-infused bruiser courting madness on purpose, cashing the full bar in one perfect burst.",
      yes: "Visibly risky burst windows", no: "Extra damage buys the burst window" },
    "cultist/corruption": {
      line: "A mobile affliction caster who carpets whole packs in Darkwither and grows an eye-and-beam network.",
      yes: "Multi-DoT pressure that accelerates payoffs", no: "No instant burst on a new target" },
    "cultist/heretic": {
      line: "A Yogg-Saron battle healer who marks allies and turns real melee aggression into the group's healing.",
      yes: "Healing earned by a real melee rotation", no: "Demands tracking; not a reactive healer" },
    "cultist/dreadnought": {
      line: "An eldritch shield tank who rides a dangerous Insanity floor and keeps the madness in a working band.",
      yes: "Active shield timing, resource in hand", no: "Mitigation is never passive" },
    "tinker/demolition": {
      line: "An engineer layering bombs, napalm, turrets, and oil until the whole pull is one explosive machine.",
      yes: "Overlapping bombs, turrets, drones, and oil", no: "The complete rotation arrives late" },
    "tinker/invention": {
      line: "A gadget medic surrounding allies with beacons, nanobots, and batteries that hold the group together.",
      yes: "Prepared-area healing and recovery tools", no: "Placement mistakes carry the whole event" },
    "tinker/mechanics": {
      line: "An engineer who converts gunfire into Scrap, feeds it to machines, and climbs into the combat suit.",
      yes: "Several cooperating machines at once", no: "Pet, turret, and resource upkeep" },
  };

  // ---------- ×70 archetype tags (Atlas grammar §4 "M2") ----------
  // Authoring rule (user 2026-08-07): describe PLAYSTYLE, not fantasy — lore nouns
  // and flavor adjectives out, mechanics words in. Max 28 chars (phone-verified fit).
  const MICRO = {
    "cultist/corruption": "mobile DoT caster",
    "cultist/dreadnought": "retaliation shield tank",
    "cultist/heretic": "melee battle healer",
    "cultist/godblade": "2H burst bruiser",
    "tinker/demolition": "explosive burst engineer",
    "tinker/invention": "gadget field medic",
    "tinker/mechanics": "scrap-fueled combat engineer",
    "witch-hunter/boltslinger": "run-and-gun crossbow gunner",
    "witch-hunter/houndmaster": "pet pack marksman",
    "witch-hunter/black-knight": "tonic-switching parry tank",
    "witch-hunter/inquisition": "four-school burst caster",
    "guardian/vanguard": "shield-wall block tank",
    "guardian/inspiration": "tempo-stacking party buffer",
    "guardian/gladiator": "formation-switching duelist",
    "knight-of-xoroth/hellfire": "demon-form burst spellblade",
    "knight-of-xoroth/war": "2H wound-stack executioner",
    "knight-of-xoroth/defiance": "self-healing block tank",
    "barbarian/brutality": "2H execute bruiser",
    "barbarian/headhunting": "run-and-gun spear thrower",
    "barbarian/ancestry": "pet-partnered party buffer",
    "bloodmage/sanguine": "stack-banking burst caster",
    "bloodmage/accursed": "form-swapping burst brawler",
    "bloodmage/eternal": "life-leech avoidance tank",
    "bloodmage/fleshweaver": "atonement-style blood medic",
    "chronomancer/infinite": "self-feeding DoT caster",
    "chronomancer/artificer": "fragment-banking wand gunner",
    "chronomancer/time": "aeon-swapping blanket healer",
    "felsworn/slayer": "crit-cleave glaive fighter",
    "felsworn/infernal": "crit-chaining burn caster",
    "felsworn/tyrant": "dodge-to-armor leech tank",
    "necromancer/death": "disease-ramp execute caster",
    "necromancer/rime": "freeze-combo frost artillery",
    "necromancer/animation": "minion-army field commander",
    "primalist/primal": "pet-partnered bleed brawler",
    "primalist/geomancy": "state-upkeep stone caster",
    "primalist/life": "strike-to-heal party medic",
    "primalist/mountain-king": "proc-driven dual-wield tank",
    "pyromancer/incineration": "burn-banking burst caster",
    "pyromancer/flameweaving": "ember-banking burst healer",
    "pyromancer/draconic": "cooldown-cycling form caster",
    "ranger/farstrider": "horn-cycling party marksman",
    "ranger/archery": "long-range stack marksman",
    "ranger/brigand": "in-and-out bleed skirmisher",
    "reaper/harvest": "soul-stacking executioner",
    "reaper/soul": "hit-and-run stealth striker",
    "reaper/domination": "summon-backed sustain tank",
    "runemaster/runic": "brand-burst proc fighter",
    "runemaster/arcane": "combo-sequence glyph caster",
    "runemaster/riftblade": "fast-tempo upkeep skirmisher",
    "starcaller/moon-guard": "star-cycling block tank",
    "starcaller/moon-priest": "star-harvest area healer",
    "starcaller/sentinel": "star-detonating marksman",
    "starcaller/warden": "teleporting star skirmisher",
    "stormbringer/lightning": "turret-style burst caster",
    "stormbringer/wind": "ally-moving elemental buffer",
    "stormbringer/maelstrom": "channel-weaving stack caster",
    "sun-cleric/piety": "two-school swap caster",
    "sun-cleric/blessings": "vow-cycling blessing healer",
    "sun-cleric/seraphim": "instant-weaving block tank",
    "sun-cleric/valkyrie": "double-2H execute bruiser",
    "templar/zealot": "dual-wield combo fighter",
    "templar/oathkeeper": "damage-staggering parry tank",
    "templar/crusader": "whirlwind cleave fighter",
    "venomancer/venom": "field-infecting DoT caster",
    "venomancer/stalking": "mark-spending ambush fighter",
    "venomancer/fortitude": "hit-converting counter tank",
    "venomancer/vizier": "HoT-weaving form healer",
    "witch-doctor/voodoo": "damage-banking hex caster",
    "witch-doctor/brewing": "potion-combo area healer",
    "witch-doctor/shadowhunting": "run-and-gun spirit archer",
  };

  return { TAGLINES, ENGINES, CLASS_ENGINE, VERBS, CARDS, MICRO };
})();
