// Derived spec profiles for the mockups-v2 prototypes.
// Every scored value carries a source tag:
//   "data"      = August 5, 2026 talent/skill snapshot (structural fact)
//   "reports"   = July-August 2026 player reports (secondhand observation)
//   "inference" = our own judgment from the above (weakest tier)
// Scores are 1-5 descriptive positions, never quality rankings.
// No verified videos existed in the snapshot, so every video field is null.

window.COA_PROFILES = {
  generated: "2026-08-05",
  profiledCount: 12,
  totalSpecs: 70,
  coverageNote: "This prototype deeply profiles 12 of 70 specs. The remaining 58 would use the same schema in production.",
  sourceLabels: { data: "Data", reports: "Players", inference: "Inference" },
  sourceHelp: {
    data: "Structural fact from the August 5 talent and skill snapshot.",
    reports: "July-August 2026 player reports. Secondhand and possibly stale.",
    inference: "Our own judgment. The weakest evidence tier."
  },
  families: [
    {
      id: "planners",
      name: "Planners & Detonators",
      tagline: "Set the board, then cash out. Damage lives in DoTs, ramps, and timed payoffs.",
      feels: "You spend most of your attention preparing: layering periodic effects, aligning cooldowns, choosing the detonation moment. The reward is a payoff you built yourself. The cost is that interruptions and impatience destroy your work.",
      specIds: ["incineration", "infinite"]
    },
    {
      id: "sequencers",
      name: "Combo Sequencers",
      tagline: "Order matters more than speed. Resources become windows; windows become bursts.",
      feels: "You play a short repeating puzzle: generate a resource, open a window, spend in the right order. Getting the sequence right feels like landing a combo. Getting it wrong wastes the whole window.",
      specIds: ["artificer"]
    },
    {
      id: "commanders",
      name: "Commanders",
      tagline: "Your power stands next to you. Pets, armies, and machines do the hitting.",
      feels: "You direct rather than duel. The pet package carries steady damage while you position, command, and keep the engine running. It is forgiving moment to moment, and the depth lives in setup and build choices.",
      specIds: ["houndmaster", "mechanics", "animation"]
    },
    {
      id: "duelists",
      name: "Reactive Duelists",
      tagline: "Fast, mobile, position-hungry. You answer the fight in real time.",
      feels: "You live in the enemy's space, stacking conditions and snapping in and out of danger. Every fight is improvised. When your positioning reads are good you feel untouchable; when they are not, you get punished immediately.",
      specIds: ["brigand"]
    },
    {
      id: "marksmen",
      name: "Steady Marksmen",
      tagline: "Readable loops and consistent output. Low churn, low ceremony.",
      feels: "You run a clear builder-and-spender rhythm that you can hold under pressure. Nothing collapses if you get distracted for two seconds. The tradeoff is fewer dramatic highs.",
      specIds: ["sentinel", "archery"]
    },
    {
      id: "strategists",
      name: "Supportive Strategists",
      tagline: "The group is your instrument. Buffs, saves, and anticipation win fights.",
      feels: "Your best moments are other people's best moments. You anticipate damage, place buffs, and manage windows the rest of the group plays inside. High responsibility, high tracking, and your mistakes are visible to five other people.",
      specIds: ["time", "farstrider", "ancestry"]
    }
  ],
  specs: {
    incineration: {
      id: "incineration", name: "Incineration", klass: "Pyromancer", color: "#ff6638",
      role: "Damage", range: "Ranged", family: "planners",
      oneLiner: "Layer Ignites and Burns, build Heat, then choose the exact moment Pyroclasm consumes or duplicates everything you stored.",
      enjoy: [
        { t: "You like ramping damage you assembled yourself", s: "data" },
        { t: "You enjoy optimizing one big timing decision", s: "reports" },
        { t: "You want top-end mastery to matter a lot", s: "reports" }
      ],
      avoid: [
        { t: "You dislike being punished for firing early", s: "reports" },
        { t: "You want damage that survives target swaps and downtime", s: "inference" },
        { t: "You prefer instant gratification over setup", s: "inference" }
      ],
      traits: {
        pace: { v: 4, s: "inference" }, mobility: { v: 2, s: "inference" },
        setup: { v: 5, s: "data" }, burst: { v: 5, s: "data" }, sustain: { v: 3, s: "data" },
        pets: { v: 0, s: "data" }, dots: { v: 5, s: "data" }, control: { v: 1, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 3, s: "inference" }, tracking: { v: 4, s: "data" },
        setup: { v: 5, s: "data" }, reactive: { v: 3, s: "inference" }, punishment: { v: 5, s: "reports" }
      },
      shift: { t: "Players report substantial top-end optimization: detonation timing can change Pyroclasm damage by a large amount, so the ceiling rises sharply with mastery.", s: "reports" },
      evidence: { builds: 2, topTitle: "Incineration - Explode ST build", topUrl: "https://coabuildhub.com/build/ccf0c5cd-363d-4f24-9812-3d23f23fbc65", updated: "2026-08-03", reportNote: "July-August players call out punishment for premature Pyroclasm consumption." },
      video: null
    },
    infinite: {
      id: "infinite", name: "Infinite", klass: "Chronomancer", color: "#54d5f7",
      role: "Damage", range: "Ranged", family: "planners",
      oneLiner: "A DoT engine where Timerend ticks constantly shorten your own cooldowns, spiraling into Incarnation of Chaos burst phases.",
      enjoy: [
        { t: "You want your DoTs to accelerate the whole kit", s: "data" },
        { t: "You like volatile, escalating burst phases", s: "data" },
        { t: "You enjoy specs that reward long practice", s: "inference" }
      ],
      avoid: [
        { t: "You dislike heavy multi-DoT tracking", s: "reports" },
        { t: "You want the spec to play the same while leveling", s: "reports" },
        { t: "You need high mobility during damage windows", s: "inference" }
      ],
      traits: {
        pace: { v: 4, s: "inference" }, mobility: { v: 2, s: "inference" },
        setup: { v: 4, s: "data" }, burst: { v: 4, s: "data" }, sustain: { v: 4, s: "reports" },
        pets: { v: 0, s: "data" }, dots: { v: 5, s: "reports" }, control: { v: 2, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 4, s: "inference" }, tracking: { v: 5, s: "data" },
        setup: { v: 4, s: "data" }, reactive: { v: 3, s: "data" }, punishment: { v: 4, s: "inference" }
      },
      shift: { t: "Players report the spec is almost entirely DoT-based and that late talents materially change its Incarnation form loop. A low-level read is weak evidence for endgame feel.", s: "reports" },
      evidence: { builds: 1, topTitle: "Chronomancer Inf - PVE leveling to M+", topUrl: "https://coabuildhub.com/build/eb1748d8-859e-4a72-8b91-f89d5aa258c5", updated: "2026-07-21", reportNote: "Recent players describe an almost entirely DoT-based loop." },
      video: null
    },
    artificer: {
      id: "artificer", name: "Artificer", klass: "Chronomancer", color: "#54d5f7",
      role: "Damage", range: "Ranged", family: "sequencers",
      oneLiner: "Generate Echo Fragments with your wand, then spend them through Distortion spells inside short Discordance windows. Order beats speed.",
      enjoy: [
        { t: "You like combo systems where sequencing is the skill", s: "reports" },
        { t: "You want a chosen Continuum to change how you move and burst", s: "data" },
        { t: "You prefer deliberate play over button mashing", s: "reports" }
      ],
      avoid: [
        { t: "You dislike losing value for spending at the wrong moment", s: "inference" },
        { t: "You want a rotation you can run on autopilot", s: "inference" },
        { t: "You want DoTs or pets doing background work", s: "data" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 3, s: "data" },
        setup: { v: 4, s: "data" }, burst: { v: 4, s: "data" }, sustain: { v: 3, s: "inference" },
        pets: { v: 0, s: "data" }, dots: { v: 1, s: "data" }, control: { v: 2, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 3, s: "inference" }, tracking: { v: 4, s: "data" },
        setup: { v: 4, s: "data" }, reactive: { v: 3, s: "inference" }, punishment: { v: 4, s: "inference" }
      },
      shift: { t: "The chosen Continuum changes movement, AoE, or burst behavior, so two Artificers can feel meaningfully different. No player reports yet on how the feel changes at 50-60.", s: "data" },
      evidence: { builds: 1, topTitle: "silly wand spec for silly guys", topUrl: "https://coabuildhub.com/build/04e5f412-87ae-464d-af49-3a35f86119da", updated: "2026-08-04", reportNote: "Players describe sequencing as more important than raw button speed." },
      video: null
    },
    time: {
      id: "time", name: "Time", klass: "Chronomancer", color: "#54d5f7",
      role: "Healer", range: "Hybrid", family: "strategists",
      oneLiner: "A proactive healer whose Aeons re-shape the same core spells for throughput, protection, or damage support. You heal damage before it lands.",
      enjoy: [
        { t: "You like anticipating damage instead of reacting to it", s: "data" },
        { t: "You want one kit that flexes into three healing modes", s: "data" },
        { t: "You enjoy time-stasis utility and cooldown manipulation", s: "data" }
      ],
      avoid: [
        { t: "You want a reactive whack-a-mole healing style", s: "data" },
        { t: "You dislike remembering which mode is active", s: "inference" },
        { t: "You are new to healing and want a gentle first healer", s: "inference" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 3, s: "inference" },
        setup: { v: 5, s: "data" }, burst: { v: 2, s: "data" }, sustain: { v: 4, s: "data" },
        pets: { v: 0, s: "data" }, dots: { v: 0, s: "data" }, control: { v: 3, s: "data" },
        solo: { v: 2, s: "inference" }, group: { v: 5, s: "data" }
      },
      complexity: {
        buttons: { v: 4, s: "inference" }, tracking: { v: 4, s: "data" },
        setup: { v: 5, s: "data" }, reactive: { v: 4, s: "inference" }, punishment: { v: 4, s: "inference" }
      },
      shift: { t: "A Mythic+ guide was rewritten after a rework in early August, so the current feel is recent and may still be moving.", s: "reports" },
      evidence: { builds: 2, topTitle: "[UPDATED AFTER REWORK] Mythic+ Time guide", topUrl: "https://coabuildhub.com/build/d0ca993a-cdea-4318-8ca8-129dcb617a31", updated: "2026-08-04", reportNote: "The top guide was updated after a rework, which signals active change." },
      video: null
    },
    houndmaster: {
      id: "houndmaster", name: "Houndmaster", klass: "Witch Hunter", color: "#abd473",
      role: "Damage", range: "Ranged", family: "commanders",
      oneLiner: "A Shadowhound commander with smooth sustained boss damage. Unleash the hounds, run a calm priority loop, add traps when needed.",
      enjoy: [
        { t: "You want steady single-target damage without drama", s: "reports" },
        { t: "You like pets doing consistent background work", s: "data" },
        { t: "You value personal durability while learning content", s: "reports" }
      ],
      avoid: [
        { t: "You want big AoE moments", s: "reports" },
        { t: "You find pet management busywork annoying", s: "inference" },
        { t: "You want a high mechanical ceiling to chase", s: "inference" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 3, s: "inference" },
        setup: { v: 2, s: "data" }, burst: { v: 2, s: "reports" }, sustain: { v: 4, s: "reports" },
        pets: { v: 5, s: "data" }, dots: { v: 1, s: "data" }, control: { v: 2, s: "data" },
        solo: { v: 4, s: "reports" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 2, s: "inference" }, tracking: { v: 2, s: "inference" },
        setup: { v: 2, s: "data" }, reactive: { v: 2, s: "inference" }, punishment: { v: 2, s: "inference" }
      },
      shift: { t: "A July deep dive reported at least one pet talent still bugged at the time. Bug status changes without warning.", s: "reports" },
      evidence: { builds: 2, topTitle: "Houndmaster Deep Dive: Talents, Rotation, Macros, Tips.", topUrl: "https://coabuildhub.com/build/e4e89e4c-e64d-41df-b93a-62e7a56fc887", updated: "2026-07-30", reportNote: "July deep dive: smooth boss damage, good durability, average AoE, one bugged pet talent." },
      video: null
    },
    mechanics: {
      id: "mechanics", name: "Mechanics", klass: "Tinker", color: "#d9a441",
      role: "Damage", range: "Hybrid", family: "commanders",
      oneLiner: "Build a Mechsuit and Scrapmaw, upgrade them, overclock them. The depth is in the garage, not the rotation.",
      enjoy: [
        { t: "You like tinkering with builds more than executing rotations", s: "reports" },
        { t: "You want strong output from a calm, simple loop", s: "reports" },
        { t: "You enjoy commanding a machine instead of casting", s: "data" }
      ],
      avoid: [
        { t: "You get bored without moment-to-moment decisions", s: "reports" },
        { t: "You want your hands to be the skill expression", s: "inference" },
        { t: "You dislike specs whose difficulty label is disputed", s: "reports" }
      ],
      traits: {
        pace: { v: 2, s: "reports" }, mobility: { v: 2, s: "inference" },
        setup: { v: 4, s: "data" }, burst: { v: 2, s: "inference" }, sustain: { v: 4, s: "inference" },
        pets: { v: 5, s: "data" }, dots: { v: 0, s: "data" }, control: { v: 1, s: "data" },
        solo: { v: 4, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 1, s: "reports" }, tracking: { v: 1, s: "reports" },
        setup: { v: 3, s: "data" }, reactive: { v: 1, s: "reports" }, punishment: { v: 2, s: "inference" }
      },
      shift: { t: "Conflicting evidence: the old in-game label reportedly says expert, but current players say the effective damage loop can be nearly two buttons. We show both claims rather than resolving them.", s: "reports" },
      evidence: { builds: 3, topTitle: "Tinker Godlike DPS", topUrl: "https://coabuildhub.com/build/8cfab970-1e33-461b-bf61-3587b7d42a40", updated: "2026-08-01", reportNote: "Players report the complexity sits in setup and build choices, not buttons." },
      video: null
    },
    animation: {
      id: "animation", name: "Animation", klass: "Necromancer", color: "#8ca05b",
      role: "Damage", range: "Hybrid", family: "commanders",
      oneLiner: "The dedicated undead army tree. Spend Life Force on archers, abominations, and named undead, then march them where you point.",
      enjoy: [
        { t: "You want the full army-commander fantasy", s: "data" },
        { t: "You like strong results from simple current builds", s: "reports" },
        { t: "You want the best-documented spec in the pool", s: "data" }
      ],
      avoid: [
        { t: "You dislike screen clutter and many moving bodies", s: "inference" },
        { t: "You want personal spellwork to be the star", s: "data" },
        { t: "You worry simple-but-strong loops get rebalanced", s: "inference" }
      ],
      traits: {
        pace: { v: 2, s: "inference" }, mobility: { v: 2, s: "inference" },
        setup: { v: 3, s: "data" }, burst: { v: 2, s: "inference" }, sustain: { v: 4, s: "reports" },
        pets: { v: 5, s: "data" }, dots: { v: 1, s: "data" }, control: { v: 2, s: "data" },
        solo: { v: 4, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 2, s: "reports" }, tracking: { v: 3, s: "data" },
        setup: { v: 3, s: "data" }, reactive: { v: 2, s: "inference" }, punishment: { v: 2, s: "inference" }
      },
      shift: { t: "Recent discussion reports very high output from simple current builds, which may make the realized rotation easier than the intended summon roster suggests.", s: "reports" },
      evidence: { builds: 10, topTitle: "Competitive 1v1 Arena / BG Necromancer PvP Guide", topUrl: "https://coabuildhub.com/build/44c7dcf0-687e-4bc6-8052-b819dfdc1e90", updated: "2026-07-28", reportNote: "Ten recent builds - the most documented spec in the captured pool." },
      video: null
    },
    brigand: {
      id: "brigand", name: "Brigand", klass: "Ranger", color: "#aad372",
      role: "Damage", range: "Melee", family: "duelists",
      oneLiner: "A rogue-like dagger fighter: stack bleeds and dirty strikes in close, then Outmaneuver snaps you back to safety before the answer lands.",
      enjoy: [
        { t: "You love mobility, decoys, and teleports as core loop", s: "data" },
        { t: "You like reading fights and improvising in real time", s: "inference" },
        { t: "You want condition-stacking payoff finishers", s: "data" }
      ],
      avoid: [
        { t: "You dislike position-dependent damage", s: "data" },
        { t: "You want to stand still and execute a plan", s: "inference" },
        { t: "You get frustrated when mistakes punish instantly", s: "inference" }
      ],
      traits: {
        pace: { v: 5, s: "inference" }, mobility: { v: 5, s: "data" },
        setup: { v: 3, s: "data" }, burst: { v: 4, s: "data" }, sustain: { v: 3, s: "data" },
        pets: { v: 0, s: "data" }, dots: { v: 3, s: "data" }, control: { v: 3, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 4, s: "inference" }, tracking: { v: 3, s: "data" },
        setup: { v: 3, s: "data" }, reactive: { v: 5, s: "inference" }, punishment: { v: 4, s: "inference" }
      },
      shift: { t: "No specific player reports on leveling shift yet. The kit's position dependence is structural and unlikely to soften at 60.", s: "inference" },
      evidence: { builds: 5, topTitle: "Dagger \"Rogue\" Ranger PvP for BGs", topUrl: "https://coabuildhub.com/build/f90bd8a4-d012-477f-922d-3e6a3f8d9ed0", updated: "2026-08-05", reportNote: "Five recent builds, updated through August 5. PvP-leaning documentation." },
      video: null
    },
    sentinel: {
      id: "sentinel", name: "Sentinel", klass: "Starcaller", color: "#ded9ff",
      role: "Damage", range: "Ranged", family: "marksmen",
      oneLiner: "Apply Scattered Stars with Huntress Shot, spend them with Starfire Shot. Consistent single target from a loop you can hold under pressure.",
      enjoy: [
        { t: "You want a readable builder-and-spender rhythm", s: "reports" },
        { t: "You like consistent boss damage over spiky highs", s: "reports" },
        { t: "You prefer a calm learning curve right now", s: "reports" }
      ],
      avoid: [
        { t: "You get bored when the loop collapses to a few buttons", s: "reports" },
        { t: "You need strong AoE - its scaling is disputed", s: "reports" },
        { t: "You want proven, well-documented builds to copy", s: "data" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 3, s: "inference" },
        setup: { v: 1, s: "data" }, burst: { v: 2, s: "reports" }, sustain: { v: 4, s: "reports" },
        pets: { v: 0, s: "data" }, dots: { v: 0, s: "data" }, control: { v: 1, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 2, s: "reports" }, tracking: { v: 2, s: "inference" },
        setup: { v: 1, s: "data" }, reactive: { v: 2, s: "inference" }, punishment: { v: 2, s: "inference" }
      },
      shift: { t: "Players report the realized boss loop may collapse to a small builder/spender sequence despite a broader intended kit. The data and the reports genuinely disagree here.", s: "reports" },
      evidence: { builds: 0, topTitle: null, topUrl: null, updated: null, reportNote: "Zero submitted builds in the captured feed. That is a documentation gap, not proof of weakness." },
      video: null
    },
    archery: {
      id: "archery", name: "Archery", klass: "Ranger", color: "#aad372",
      role: "Damage", range: "Ranged", family: "marksmen",
      oneLiner: "A marksman using Quick Shot and Advantage to power Precision Shot, bleeds, and big piercing finishers. Familiar if you have played Hunter.",
      enjoy: [
        { t: "You want a loop familiar from WoW Hunter play", s: "reports" },
        { t: "You like skirmishing at range with clear windows", s: "data" },
        { t: "You want solid documentation to lean on", s: "data" }
      ],
      avoid: [
        { t: "You want something mechanically novel", s: "inference" },
        { t: "You want pets - this tree fights alone", s: "data" },
        { t: "You chase the highest possible ceiling", s: "inference" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 3, s: "data" },
        setup: { v: 2, s: "data" }, burst: { v: 3, s: "data" }, sustain: { v: 3, s: "data" },
        pets: { v: 0, s: "data" }, dots: { v: 3, s: "data" }, control: { v: 1, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 2, s: "data" }
      },
      complexity: {
        buttons: { v: 3, s: "inference" }, tracking: { v: 2, s: "inference" },
        setup: { v: 2, s: "data" }, reactive: { v: 2, s: "inference" }, punishment: { v: 2, s: "inference" }
      },
      shift: { t: "Described as comparatively readable. No reports of a major feel change at higher levels.", s: "reports" },
      evidence: { builds: 4, topTitle: "Archery - PvE", topUrl: "https://coabuildhub.com/build/1a626108-5840-4b3b-aaf7-33777a358433", updated: "2026-08-02", reportNote: "Four recent builds with steady updates." },
      video: null
    },
    farstrider: {
      id: "farstrider", name: "Farstrider", klass: "Ranger", color: "#aad372",
      role: "Support", range: "Ranged", family: "strategists",
      oneLiner: "A falcon-and-Dragonhawk commander whose Dream Flowers, Horns, and Command Aura make the whole party better - if your positioning holds up.",
      enjoy: [
        { t: "You want your value measured in the group's output", s: "data" },
        { t: "You like juggling pets, arrows, and buff timing", s: "reports" },
        { t: "You enjoy positioning as a core skill", s: "reports" }
      ],
      avoid: [
        { t: "You want your own damage meter to tell the story", s: "inference" },
        { t: "You dislike depending on teammates collecting your buffs", s: "reports" },
        { t: "You want a low-attention spec", s: "reports" }
      ],
      traits: {
        pace: { v: 4, s: "reports" }, mobility: { v: 3, s: "data" },
        setup: { v: 3, s: "data" }, burst: { v: 2, s: "inference" }, sustain: { v: 3, s: "inference" },
        pets: { v: 4, s: "data" }, dots: { v: 1, s: "data" }, control: { v: 2, s: "data" },
        solo: { v: 3, s: "inference" }, group: { v: 5, s: "reports" }
      },
      complexity: {
        buttons: { v: 4, s: "inference" }, tracking: { v: 4, s: "reports" },
        setup: { v: 3, s: "data" }, reactive: { v: 4, s: "reports" }, punishment: { v: 3, s: "inference" }
      },
      shift: { t: "A recent player calls it demanding because positioning, Horn timing, arrows, pets, and teammate reach all matter at once. That load likely grows in coordinated groups.", s: "reports" },
      evidence: { builds: 1, topTitle: "Farstrider Ranger Support Dps", topUrl: "https://coabuildhub.com/build/40b1536a-eca5-456f-813c-b50de9ee2540", updated: "2026-07-20", reportNote: "One recent build; the richest evidence is a single detailed player report." },
      video: null
    },
    ancestry: {
      id: "ancestry", name: "Ancestry", klass: "Barbarian", color: "#c79c6e",
      role: "Support", range: "Melee", family: "strategists",
      oneLiner: "A frost-and-ale warleader: Keg Smash, an Honored Ancestor at your side, and one of the clearest offensive-support toolkits in the game.",
      enjoy: [
        { t: "You want to amplify a melee-heavy group", s: "data" },
        { t: "You like owning many situational tools", s: "data" },
        { t: "You enjoy buff-window management as the skill", s: "data" }
      ],
      avoid: [
        { t: "You dislike large button counts", s: "data" },
        { t: "You want to top a personal damage meter", s: "inference" },
        { t: "You want the group to succeed without you tracking windows", s: "inference" }
      ],
      traits: {
        pace: { v: 3, s: "inference" }, mobility: { v: 2, s: "inference" },
        setup: { v: 3, s: "data" }, burst: { v: 3, s: "data" }, sustain: { v: 3, s: "inference" },
        pets: { v: 2, s: "data" }, dots: { v: 0, s: "data" }, control: { v: 1, s: "data" },
        solo: { v: 2, s: "inference" }, group: { v: 5, s: "data" }
      },
      complexity: {
        buttons: { v: 5, s: "data" }, tracking: { v: 4, s: "data" },
        setup: { v: 3, s: "data" }, reactive: { v: 3, s: "inference" }, punishment: { v: 3, s: "inference" }
      },
      shift: { t: "The cost of the kit is many situational buttons and buff-window management, and that cost is structural - it will not shrink at 60.", s: "data" },
      evidence: { builds: 1, topTitle: "Ancestry Barbarian", topUrl: "https://coabuildhub.com/build/d7224a9d-7c7e-4382-af9e-0fe3c8dec13a", updated: "2026-07-29", reportNote: "One recent build labeled support." },
      video: null
    }
  }
};
