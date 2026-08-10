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
    "Barbarian": { t: "The ancestors are watching. Give them a show.", kw: "ancestors", draft: false },
    "Bloodmage": { t: "Blood remembers what mana forgets.", kw: "Blood", draft: true },
    "Chronomancer": { t: "Reality is a rough draft.", kw: "draft", draft: false },
    "Felsworn": { t: "The demon is not a metaphor.", kw: "demon", draft: false },
    "Necromancer": { t: "The dead work for you now.", kw: "dead", draft: true },
    "Primalist": { t: "The wild does not negotiate.", kw: "wild", draft: true },
    "Pyromancer": { t: "Everything burns. Some things burn twice.", kw: "burns", draft: true },
    "Ranger": { t: "Every step is part of the aim.", kw: "aim", draft: false },
    "Reaper": { t: "Everything owes you a soul.", kw: "soul", draft: true },
    "Runemaster": { t: "Power, spelled correctly.", kw: "spelled", draft: false },
    "Starcaller": { t: "The stars aim back.", kw: "stars", draft: true },
    "Stormbringer": { t: "Hold the charge. Not too long.", kw: "charge", draft: true },
    "Sun Cleric": { t: "Dawn breaks. So does everything else.", kw: "Dawn", draft: true },
    "Templar": { t: "An oath is a weapon you keep.", kw: "oath", draft: true },
    "Venomancer": { t: "Patience is a poison too.", kw: "poison", draft: true },
    "Witch Doctor": { t: "The best curses are homemade.", kw: "curses", draft: false },
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
    "Barbarian": { lab: "The engine — Energy", p: "Every Barbarian runs on Energy; Enrage unlocks its gated attacks and cuts global cooldowns by 30%." },
    "Bloodmage": { lab: "The engine — Rage and blood", p: "Every Bloodmage runs on Rage with health as the second cost; each spec turns Blood Curse into its own Cursed Form." },
    "Chronomancer": { lab: "The engine — three clocks", p: "Each spec runs its own clock — DoT ramps, Echo Fragments, or Aeons — and Rewind is just the safety net." },
    "Felsworn": { lab: "The engine — Felfury", p: "Build Felfury, spend it in pairs, and open Inner Demon with six banked — the window where spending pays you back." },
    "Necromancer": { lab: "The engine — Life Force and Runic Power", p: "Every Necromancer runs on two pools: Life Force that holds the army standing, Runic Power that you spend on Commands." },
    "Primalist": { lab: "The engine — Rage", p: "Every Primalist runs on Rage, and every spec bends the same shared Seismic cooldown." },
    "Pyromancer": { lab: "The engine — Embers and Heat", p: "Every Pyromancer runs two resources: Embers you bank and spend, and Heat that pays out the moment you generate it." },
    "Ranger": { lab: "The engine — Advantage", p: "Every Ranger builds Advantage from basic attacks, then spends up to five stacks to increase an ability's damage or duration." },
    "Reaper": { lab: "The engine — the soul ladder", p: "Every Reaper climbs the same ladder: three Fragments to a Soul, three Souls to an Infusion." },
    "Runemaster": { lab: "The engine — engravings", p: "Weapon Engravings land on a trigger chance you buy up with cooldowns; each spec counts its own sequence on top." },
    "Starcaller": { lab: "The engine — Scattered Stars", p: "Every spec pins Scattered Stars onto enemies, then consumes them for its own payoff." },
    "Stormbringer": { lab: "The engine — Static", p: "Static climbs as you cast: above 70 your spells supercharge, at 100 the storm turns on you." },
    "Sun Cleric": { lab: "The engine — Dawn", p: "Solar Power builds between Dawns; inside a Dawn window your actions become Vows instead." },
    "Templar": { lab: "The engine — Oaths", p: "Oaths are buffs you hold on a running chain; Oath Breakers spend them, except for the Oathkeeper, who keeps every one." },
    "Venomancer": { lab: "The engine — forms and stacks", p: "Each spec fights in its own form and builds its own stacks; two active Venoms are the only layer they share." },
    "Witch Doctor": { lab: "The engine — Spirits", p: "Collected Spirits stack to five: hold them and every payoff scales, or unleash the whole stack at once." },
  };

  // ---------- full class-page engine paragraphs (class-page grammar §1) ----------
  // The ruled 2–4 sentence shape: serif-italic lede, then the body naming the
  // resource, the loop, and the class tension. Only authored classes appear here;
  // the rest fall back to the one-sentence ENGINES blurb above.
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
    // Body RULED 2026-08-10 (design-pass round 2, the shape-bar exemplar):
    // lede + two sentences, game words first (build/spend/stacks). Facts trace
    // to the landed digest, including duration scaling ("Lasts 3 sec for each
    // Demonfire consumed"; Suffuse +2s per stack) and the three 6-stack riders.
    "knight-of-xoroth": {
      label: "The engine — Demonfire",
      lede: "Every Knight runs on Demonfire, fed by demons and blood.",
      text: "Build Demonfire stacks, then spend them to increase an ability's damage or duration. At six stacks, certain abilities trigger an additional effect.",
    },
    guardian: {
      label: "The engine — formations",
      lede: "Formations set the stance; Energy, Motivation, and per-spec stacks do the work.",
      text: "Each spec builds its own stacks and spends them at its own mark: ten Paragon, three Tempo, or three Glory. Blocks restore Energy, and Motivating Strike grants Motivation that abilities consume for added effects.",
    },
    "witch-hunter": {
      label: "The engine — Rage",
      lede: "Every Hunter runs on Rage; each spec layers its own marks and stacks on top.",
      text: "Build Rage from your own attacks and spend it on your spec's payoffs; Tonics restore it. The layer on top is the spec's own: Slinging Bolts, Shadowhounds, Shadow Brands, or Dawn and Dusk.",
    },
    necromancer: {
      label: "The engine — Life Force and Runic Power",
      lede: "Every Necromancer runs on two pools: Life Force that holds the army standing, Runic Power that you spend on Commands.",
      text: "Generate Runic Power with Crypt Swarm and Flesh to Worms, then spend it on Commands that order the undead. Life Force caps the army: a Ghoul occupies 1, a Skeletal Mage 2, a Gargoyle 3.",
    },
    primalist: {
      label: "The engine — Rage",
      lede: "Every Primalist runs on Rage, and every spec bends the same shared Seismic cooldown.",
      text: "Generate Rage with Geode Barrage and Seismic abilities, then spend it on your spec's kit. Only one Boon is active: Bear adds 10% Rage from auto attacks, Hawk cuts costs by 10%.",
    },
    barbarian: {
      label: "The engine — Energy",
      lede: "Every Barbarian runs on Energy; Enrage unlocks its gated attacks and cuts global cooldowns by 30%.",
      text: "Energy pays for everything and comes back in bursts — Hodir's Wrath restores the full bar. While Enraged, global cooldowns drop 30% and the gated attacks open up.",
    },
    bloodmage: {
      label: "The engine — Rage and blood",
      lede: "Every Bloodmage runs on Rage with health as the second cost; each spec turns Blood Curse into its own Cursed Form.",
      text: "Strikes and health-cost spells generate Rage; each spec banks its own counter on top — ten Thirst, ten Pooled Vitality, or eight Blood Shards. The kit splits into Mortal Form spells and Cursed Form abilities.",
    },
    ranger: {
      label: "The engine — Advantage",
      lede: "Every Ranger builds Advantage from basic attacks, then spends up to five stacks to increase an ability's damage or duration.",
      text: "Quick Shot and Wild Strike each generate 1 Advantage; Readiness generates 20 Focus every 5 seconds to cover costs. At 5 stacks certain abilities add a further effect — mana back, a cooldown cut, or party haste.",
    },
    felsworn: {
      label: "The engine — Felfury",
      lede: "Build Felfury, spend it in pairs, and open Inner Demon with six banked — the window where spending pays you back.",
      text: "Abilities spend Energy; critical strikes, dodges, and Felfury spenders feed it back. Inner Demon with six Felfury banked restores 50 Energy, and spender crits extend the window by 1 second.",
    },
    "sun-cleric": {
      label: "The engine — Dawn",
      lede: "Solar Power builds between Dawns; inside a Dawn window your actions become Vows instead.",
      text: "Dawn runs 1 minute: your next 10 damaging or healing abilities trigger your Vow's Fulfillment, at most once per second. Only one Vow is active, so every Fulfillment in the window comes from the same Vow.",
    },
    templar: {
      label: "The engine — Oaths",
      lede: "Oaths are buffs you hold on a running chain; Oath Breakers spend them, except for the Oathkeeper, who keeps every one.",
      text: "Strikes grant Oaths, and each held Oath is a buff — Righteous Lunge's adds 10% to damage and healing. Oath Breakers consume them for payoff before the chain runs out; Oath Flow adds two seconds.",
    },
    starcaller: {
      label: "The engine — Scattered Stars",
      lede: "Every spec pins Scattered Stars onto enemies, then consumes them for its own payoff.",
      text: "Apply Scattered Stars with your attacks and spells; they stack 4 times and last 30 seconds. Every star consumed pays back mana or cooldown, which feeds the next application.",
    },
    chronomancer: {
      label: "The engine — three clocks",
      lede: "Each spec runs its own clock — DoT ramps, Echo Fragments, or Aeons — and Rewind is just the safety net.",
      text: "Build the spec's own meter, then spend it on time itself. A consumed Echo Fragment adds 5 seconds to a Continuum spell, and an Endless Sands stack cuts 20% from your next Reverse Wound.",
    },
    reaper: {
      label: "The engine — the soul ladder",
      lede: "Every Reaper climbs the same ladder: three Fragments to a Soul, three Souls to an Infusion.",
      text: "Reap generates a Soul Fragment and Runic Power; the ladder converts three and three upward. The rungs pay on their own: holding three Souls guards you, and Spectral Scythe spends them.",
    },
    stormbringer: {
      label: "The engine — Static",
      lede: "Static climbs as you cast: above 70 your spells supercharge, at 100 the storm turns on you.",
      text: "Generate Static as you cast, then spend it: Conjure Storm depletes 50 and Arm of Thorim depletes all of it. Stay above 70 for the Supercharged effects, and spend before 100 — reaching it stuns you.",
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
    "knight-of-xoroth/hellfire": ["Unleash", "Bank Demonfire to six and cash it as fire; a full Flames of Xoroth calls down Rain of Chaos."],
    "knight-of-xoroth/war": ["Cycle", "Spend Demonfire to refresh Gore's charges — stacks turn back into strikes, and the loop keeps turning."],
    "knight-of-xoroth/defiance": ["Stoke", "Shieldgore and your beckoned imps feed the fire two stacks at a time — defense fills the bar."],
    "guardian/vanguard": ["Block", "Blocks pay you: Energy returns, Paragon stacks toward ten, and High Guard arms a cooldown-free Heavy Blow."],
    "guardian/inspiration": ["Rally", "Your strikes become Ballads; three Tempo casts Sound of War, and nearby allies hit harder."],
    "guardian/gladiator": ["Duel", "Build Glory to three and cash it on Ram; a thrown net sets up Centurion Strike crits."],
    "witch-hunter/boltslinger": ["Unload", "Extra bolts build Rage; Damnation converts the bar into one payoff hit."],
    "witch-hunter/houndmaster": ["Loose", "Hounds fight beside you; Shadowblast feeds them Shadow Rage, and Decimate turns them loose."],
    "witch-hunter/black-knight": ["Riposte", "Defense pays: parries restore health and Rage, and an avoided hit unlocks Desecrate."],
    "witch-hunter/inquisition": ["Balance", "Fire builds Dawn and steel builds Dusk; at twenty of each, Cycle of Despair consumes both."],
    "necromancer/animation": ["Marshal", "Fill the Life Force roster and command it; Deadly Bond can make the next Command free."],
    "necromancer/death": ["Cultivate", "Grow the diseases to fifteen; below 20% health they and Crypt Swarm hit twice as hard."],
    "necromancer/rime": ["Freeze", "Freeze the target for four seconds; Glacial Impact lands and hands back 20 Runic Power."],
    "primalist/primal": ["Rend", "Keep the two-stack bleed running; claws and rushes hit 15% harder while it holds."],
    "primalist/geomancy": ["Amass", "Bank fifteen Earthshaping, then Terrasurge consumes it all."],
    "primalist/life": ["Split", "One wave, two outputs — and the next Hand of the Earthmother costs half for eight seconds."],
    "primalist/mountain-king": ["Deflect", "Hold five Earth's Rage: Call of the Mountain pays parry and damage reduction while it stands."],
    "barbarian/brutality": ["Hoard", "Twice the Energy pool, held for one purpose: below 35% health, Decapitate spends up to 100 of it."],
    "barbarian/headhunting": ["Reset", "Spears thrown while Enraged hand back all three axe charges and halve your next casts' cost."],
    "barbarian/ancestry": ["Pour", "The Tankard fills on its own clock; emptying it is the trigger, and the party drinks too."],
    "bloodmage/sanguine": ["Overdraw", "Bank Thirst past its cap — at ten, Insatiable pays 10% more Vampiric Fang damage per stack."],
    "bloodmage/accursed": ["Prolong", "The Cursed Form runs 30 seconds, and every Assault adds three more."],
    "bloodmage/eternal": ["Trade", "Eternal Curse trades 10% of your damage for 80% more threat — the tank's bargain."],
    "bloodmage/fleshweaver": ["Link", "Pool Vitality to ten, then your Rage-cost Mortal spells consume the whole pool, empowered."],
    "ranger/farstrider": ["Call", "Every fifth shot is a Falconstrike; a Horn calls it early, and the party keeps pace."],
    "ranger/archery": ["Extend", "Skirmish runs 4 seconds longer per stack spent — a full five refresh it further."],
    "ranger/brigand": ["Mark", "Mark the target for 8 seconds; your Advantage spenders hit it 25% harder."],
    "felsworn/slayer": ["Cleave", "Spend in pairs and crit: melee crits inside Inner Demon refund 3 Energy a swing."],
    "felsworn/infernal": ["Cascade", "One hit branches into more — Fel Fireball adds a Felstrike, and three spells refund 20 Energy each."],
    "felsworn/tyrant": ["Brace", "Inside Inner Demon you take 10% less, and Carve leeches a fifth of its damage back."],
    "sun-cleric/piety": ["Alternate", "Sunrise and Sunset trade places; each swap resets the other state's signature cast."],
    "sun-cleric/blessings": ["Relay", "Your Fulfillments route outward — Solar Invigoration makes five allies take 20% more healing."],
    "sun-cleric/seraphim": ["Harden", "Fulfillments stack block value; Seraphic Bulwark doubles it for five blocks."],
    "sun-cleric/valkyrie": ["Double", "Each Fulfillment stacks 10% onto Sunslam, five deep — Dawn is your burst window."],
    "templar/crusader": ["Renew", "Argent Blade adds three seconds to the chain; Righteous Tempest spends every held Oath at once."],
    "templar/oathkeeper": ["Keep", "Oath Breakers no longer consume your Oaths; the Libram holds your delayed damage instead."],
    "templar/zealot": ["Tally", "Ten Zealotry triggers transform Chastise into Divine Fury; the count is the rhythm."],
    "starcaller/moon-guard": ["Sweep", "Starburst marks up to eight enemies; spending their stars pulls Starsweep back 3 seconds each."],
    "starcaller/moon-priest": ["Reap", "Stars you consume become healing — up to five allies around the target, every time."],
    "starcaller/sentinel": ["Count", "Every star consumed restores mana and counts up; the eighth makes Starcall hit 50% harder."],
    "starcaller/warden": ["Chain", "Build and spend in the same seconds; star damage can make your next Astral Blade free."],
    "chronomancer/infinite": ["Ramp", "Damage-over-time ticks launch spikes, and each spike cuts Chromatic Shard's cast time — ten stacks deep."],
    "chronomancer/artificer": ["Invest", "Wand attacks bank Echo Fragments; every Fragment spent buys more damage or more seconds."],
    "chronomancer/time": ["Tune", "One Aeon is active at a time and rewrites what Epoch does; its casts stack Endless Sands."],
    "reaper/domination": ["Muster", "Bank Reaped Souls to three: the bank guards you while it stands, and Spectral Scythe spends it all."],
    "reaper/harvest": ["Execute", "Slaughter earns Souls only below 35% health; Extinction lifts that gate for ten seconds."],
    "reaper/soul": ["Flood", "Dirge feeds the ladder two Fragments a swing; inside Endbringer it pours whole Souls instead."],
    "stormbringer/lightning": ["Discharge", "Run the bar as high as you dare, then Arm of Thorim empties all of it — damage rising with the Static held."],
    "stormbringer/maelstrom": ["Compound", "Shock builds Conductive to six; Torrential Wrath spends 50 Static to consume all six at once."],
    "stormbringer/wind": ["Feed", "Your Air Elemental generates Static as it fights, and you spend it straight back into the pet and the party."],
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
