#!/usr/bin/env python3
"""Generate honest curated overlays for the remaining CoA roster.

The detailed hand-authored overlays remain untouched. This helper completes the
roster with explicit structural interpretation, indexed community evidence, and
confidence limits. It intentionally does not turn sparse sources into rotations.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "reports" / "coa-specs" / "research-v2"


# id: family, also-fits, fantasy, enjoy-if, avoid-if, failure mode, movement note,
# and six contextual complexity positions in schema order.
CURATION = {
    "barbarian/brutality": ("heavy-execute-brawler", ["cleave-melee", "self-sustain-melee"], "A massive-weapon berserker who builds Fury through crushing swings and Whirls, then turns wounded enemies into execute fuel.", "You want weighty melee hits, cleave, self-sustain, and a pronounced execute phase.", "You dislike melee downtime or damage that depends on the enemy entering execute range.", "Losing melee contact or mistiming the sub-35-percent cash-out wastes the momentum built before it.", "Mostly conventional melee pursuit, with uptime more important than intricate movement tech.", ["moderate", "moderate", "low", "moderate", "moderate", "moderate-high"]),
    "barbarian/headhunting": ("mobile-physical-thrower", ["bleed-ranged", "single-target-hunter"], "A fully mobile axe, spear, and javelin hunter who strips armor, stacks blood effects, and overwhelms one target with rapid throws.", "You want physical ranged attacks with full mobility and strong single-target pressure.", "You want large-scale AoE or dislike maintaining armor reduction and bleeds.", "Splitting throws across low-priority enemies weakens its armor-shred and blood-stacking payoff.", "One of its defining strengths is attacking while moving, though target discipline still matters.", ["moderate", "moderate-high", "moderate", "moderate", "moderate", "moderate"]),
    "barbarian/ancestry": ("pet-raid-support", ["buff-window-support", "melee-commander"], "A frost-and-ale warleader who fights beside an Honored Ancestor and turns kegs, cries, totems, and clan rituals into party-wide offense.", "You want a permanent ancestral companion and a large offensive-support toolkit.", "You want a small personal rotation or dislike managing buffs for other players.", "Poorly timed War Cry, totem, keg, or Warband windows can waste more group value than a missed personal attack.", "Primarily melee, with the ancestor and support effects preserving some value during movement.", ["high", "high", "high", "high", "moderate", "high"]),
    "witch-doctor/voodoo": ("delayed-burst-dot-caster", ["summon-caster", "setup-caster"], "A voodoo puppeteer who layers curses and Shadow damage, stores part of that pain in Threads, then releases it through clones, spirits, and delayed detonations.", "You enjoy DoT setup, stored-damage windows, summons, and large delayed payoffs.", "You want immediate damage, simple AoE, or forgiving mana and cooldown management.", "Detonating before curses and stored damage mature, or after targets die, collapses the intended payoff.", "Ranged kiting and slows help, but setup attached to enemies makes rapid target changes costly.", ["high", "high", "moderate-high", "moderate-high", "moderate", "high"]),
    "witch-doctor/brewing": ("modular-alchemist-healer", ["prepared-healer", "utility-support"], "A battlefield alchemist who combines Ingredients, Bases, and Mojos to change what every Cauldron and Potion Toss does.", "You want a flexible healer whose preparation changes healing, shielding, damage, and utility.", "You want direct plug-and-play healing without recipe or placement decisions.", "Bringing the wrong recipe or placing the Cauldron poorly can make the available buttons answer the wrong problem.", "Hybrid range and throwable tools support movement, while persistent devices reward planned placement.", ["high", "high", "high", "high", "moderate-high", "high"]),
    "witch-doctor/shadowhunting": ("spirit-cycle-archer", ["mobile-ranged", "summon-burster"], "A bow-and-voodoo hunter who reclaims Spirits through arrows, then spends them on eclipses, glaives, wards, and frenzied summons.", "You want mobile ranged damage with a visible Spirit cycle, self-healing, and summon bursts.", "You dislike hybrid scaling, summon management, or balancing builders against several spenders.", "Overspending Spirits before Eclipse or summon windows leaves the hybrid kit without its burst engine.", "Mobile bow attacks, wards, and kiting tools make it active at range.", ["moderate-high", "high", "moderate", "moderate-high", "high", "moderate-high"]),
    "felsworn/slayer": ("crit-glaive-rusher", ["high-apm-melee", "mobile-cleaver"], "A fast glaive fighter who builds Felfury, turns critical strikes into off-hand cleave, and rushes between targets with demonic momentum.", "You want mobile, crit-driven melee with strong AoE and rapid inputs.", "You dislike energy-style tracking, combo states, or a fragile leveling period.", "Capping Felfury, dropping the critical-strike feedback loop, or spending mobility carelessly interrupts its cleave engine.", "Charges and Chaos Rush provide excellent contact tools and contribute to the spec's high execution pace.", ["moderate-high", "high", "moderate", "moderate-high", "high", "moderate-high"]),
    "felsworn/infernal": ("shadowflame-feedback-caster", ["crit-caster", "dot-burster"], "A Shadowflame caster whose critical strikes create more burns, refunds, and Inner Demon pressure until the rotation becomes a self-feeding inferno.", "You want a crit-scaling caster with DoTs and an accelerating proc loop.", "You dislike output that feels weak when procs or Felfury control go poorly.", "Missed critical feedback or poor Felfury routing can starve several linked damage and refund effects at once.", "Ranged play offers normal caster spacing, with less evidence for exceptional movement freedom.", ["moderate", "high", "moderate", "moderate-high", "moderate", "moderate-high"]),
    "felsworn/tyrant": ("avoidance-demonic-tank", ["aggressive-tank", "dual-wield-tank"], "A dual-two-handed demonic fortress that converts avoidance into armor and resistance, then leeches through incoming pressure.", "You want an aggressive, visually imposing tank with avoidance conversion and self-healing.", "You want a conventional shield tank or dislike tracking avoidance and retaliation states.", "Overlapping Tyrannical Resolve, leech, and mitigation windows can leave a later hit uncovered despite the spec's reported durability.", "Hybrid demonic tools aid contact, but its core durability comes from active melee aggression.", ["moderate", "high", "moderate", "high", "moderate-high", "high"]),
    "witch-hunter/boltslinger": ("mobile-crossbow-cleaver", ["cast-while-moving", "trap-controller"], "A crossbow gunner who fires Darkslayer while moving, floods packs with extra bolts, and controls space with traps.", "You want easy-to-read, highly mobile dungeon AoE and strong trap control.", "You need durable solo play or consistent output on small pulls.", "Small packs do not feed Twilight Frenzy well, while defensive mistakes are punished by weak survivability.", "Cast-while-moving attacks are a defining strength and make repositioning unusually forgiving.", ["low-moderate", "moderate", "low", "moderate", "moderate", "moderate-high"]),
    "witch-hunter/black-knight": ("tonic-blade-tank", ["leech-tank", "party-redirect-tank"], "A dark parry tank who changes Dawn Blade through Tonics, sustains with Noctis and Grasp, and takes allies' pain through Gaze.", "You want an active self-healing tank with weapon-state choices and party damage redirection.", "You want passive mitigation or dislike sequencing Tonics before specialized blade attacks.", "Using the wrong Tonic or redirecting party damage without a prepared barrier and leech answer can compound danger quickly.", "Hybrid reach and grips support control, but blade sequencing still demands melee contact.", ["moderate-high", "high", "moderate-high", "high", "moderate-high", "high"]),
    "witch-hunter/inquisition": ("duality-piano-melee", ["proc-melee", "pvp-pursuer"], "A Dawn-and-Dusk inquisitor who juggles Fire, Holy, Shadow, and Physical attacks before cashing Purity and Wickedness into violent judgments.", "You want a busy proc-heavy melee kit with duality states, control, and PvP pursuit.", "You dislike skill bloat, piano rotations, or tracking several schools and stack types.", "A mismatched Dawn or Dusk action, dropped Flames of Sin, or ignored proc can break a long chain of setup.", "Its pursuit and control kit is PvP-shaped, but using it well adds substantial execution burden.", ["high", "high", "moderate-high", "high", "high", "high"]),
    "stormbringer/lightning": ("turret-static-caster", ["builder-spender-caster", "planned-burst-caster"], "A lightning artillery caster who builds Static and Electrical Charge, marks with Volt, and opens no-depletion Thorim windows from planned stationary phases.", "You want a direct elemental builder-spender with rewarding turret windows and dramatic lightning bursts.", "You dislike standing still to build power or having burst shaped by hard-cast setup.", "Moving before Electrical Charge matures or spending Static outside the intended Thorim window weakens the burst cycle.", "A lightning dash provides repositioning, but maximum charge explicitly rewards standing still.", ["moderate", "moderate-high", "moderate", "moderate", "moderate-high", "moderate-high"]),
    "stormbringer/wind": ("battlefield-mobility-support", ["position-controller", "raid-buff-support"], "An Air Elemental commander who moves allies and enemies through gates, pulls, rescues, and zephyrs while opening major offensive windows.", "You want support gameplay built around positioning, rescue tools, and party burst windows.", "You want personal damage to be the primary success measure or dislike responsibility for other players' positioning.", "A misplaced gate, pull, or rescue can disrupt the group, while overlapping Surge and Tempest windows wastes scarce support value.", "Movement is the spec's identity: gates, evacuation, pulls, and freedom effects reshape the battlefield.", ["high", "high", "high", "high", "high", "high"]),
    "stormbringer/maelstrom": ("conductive-object-caster", ["stack-caster", "battlefield-summoner"], "A Frost-and-Nature storm caster who builds Conductive stacks through Brine and surrounds targets with orbs, spheres, clouds, and elementals before cashing out.", "You want layered battlefield objects, stack management, and Frost-Nature burst.", "You want the more direct Lightning rotation or dislike tracking objects attached to several targets.", "Consuming Conductive stacks at the wrong time or leaving orbs and clouds behind on a dead target wastes layered setup.", "Ranged positioning is flexible, but placed objects and target setup make movement planning important.", ["high", "high", "moderate-high", "high", "moderate-high", "high"]),
    "knight-of-xoroth/hellfire": ("pet-form-spellblade", ["proc-hybrid", "summon-cleaver"], "A demonic spellblade who fights beside a Greater Imp, builds Hellfire Embers, enters Hellfire Form, and mixes Cinderblade with seeking flames and infernal summons.", "You want a melee-caster hybrid with a meaningful pet, transformation, and both single-target and AoE tools.", "You dislike pet, form, proc, and resource layers competing for attention.", "Entering Hellfire Form with poor Ember, pet, or summon alignment wastes the transformation's overlapping payoffs.", "Hybrid reach and demonic effects preserve some damage during movement, but Cinderblade still rewards melee contact.", ["high", "high", "moderate-high", "moderate-high", "moderate-high", "high"]),
    "knight-of-xoroth/war": ("two-handed-wound-bruiser", ["bleed-melee", "heavy-cleaver"], "A direct demonic destroyer who carves Gore and Mutilation wounds, builds frenzy, and ends them with Burning Blade and massive two-handed finishers.", "You want the most conventional KoX damage spec, with wounds, heavy weapons, and clear boss and cleave payoffs.", "You dislike melee uptime dependence or maintaining bleeds before the large hit.", "Losing contact or consuming wounds before the intended heavy strike reduces both frenzy and finisher value.", "Conventional melee pursuit with fewer movement layers than Hellfire.", ["moderate", "moderate", "low-moderate", "moderate", "moderate", "moderate-high"]),
    "knight-of-xoroth/defiance": ("summon-retaliation-tank", ["block-tank", "fire-tank"], "A Fire retaliation knight whose blocks command Hellfire Imps and an Abyssal, feeding rebukes, shields, and a soul furnace.", "You want active mitigation, strong AoE threat, and summons that participate in the tank loop.", "You want a simple shield tank without pet commands and layered cooldown priorities.", "Poor summon commands or overlapping rebukes, shields, and furnace effects can leave the next pressure spike unanswered.", "AoE threat is strong, but current players specifically cite mobility and priority complexity as considerations.", ["high", "high", "moderate-high", "high", "moderate-high", "high"]),
    "ranger/archery": ("advantage-marksman", ["precision-ranged", "readable-builder-spender"], "A familiar marksman who uses Quick Shot to gain Advantage, empowers Precision Shot, and layers quivers, bleeds, and piercing finishers.", "You want a readable Hunter-like ranged loop with precision windows and strong current PvE representation.", "You want unusual resources or constant free movement without aimed-shot planning.", "Spending Advantage on the wrong shot or losing an empowered Precision window lowers an otherwise forgiving cycle.", "Ranged skirmishing is supported, although its larger aimed finishers still reward planned positioning.", ["low-moderate", "moderate", "low", "moderate", "moderate", "low-moderate"]),
    "ranger/brigand": ("teleport-debuff-rogue", ["position-melee", "pvp-ambusher"], "A dirty-fighting ranger who stacks bleeds and poison, teleports through danger, and uses Advantage finishers before snapping back to safety.", "You want rogue-like melee with decoys, teleports, debuff setup, and positional cash-outs.", "You want strong early AoE or dislike position and target-condition dependence.", "Using Outmaneuver or a finisher before the required debuffs and position are established wastes both offense and escape.", "Teleports and the Outmaneuver return create exceptional mobility with corresponding positional execution demands.", ["moderate-high", "high", "moderate", "high", "high", "high"]),
    "pyromancer/flameweaving": ("persistent-object-healer", ["crit-healer", "movement-support-healer"], "A phoenix healer who places Roaring Pyres, rides critical healing and Heat, and turns Emberheart into a fiery cheat-death recovery phase.", "You want area healing, persistent phoenix objects, movement support, and dramatic emergency recovery.", "You want purely direct healing or dislike predicting where allies will stand.", "A misplaced Pyre or poorly timed Emberheart leaves persistent healing outside the event it was meant to answer.", "Movement support is a strength, while object placement rewards anticipating the group's path.", ["moderate-high", "high", "moderate-high", "high", "moderate-high", "high"]),
    "pyromancer/incineration": ("stored-ignite-detonator", ["dot-caster", "high-ceiling-burster"], "An Ignite specialist who layers burns, stores Heat and periodic damage, then decides exactly when Pyroclasm should consume or duplicate the stack.", "You want DoT pressure with a high-skill detonation payoff and meaningful timing optimization.", "You dislike waiting for stored damage or being heavily punished for an early detonation.", "Premature Pyroclasm consumption can erase a large amount of stored damage and sharply reduce the window.", "Ranged DoTs preserve pressure while moving, but the detonation decision remains target-bound.", ["moderate-high", "high", "moderate", "high", "moderate", "high"]),
    "pyromancer/draconic": ("dragon-aspect-caster", ["cooldown-caster", "mobile-burst-caster"], "A dragon-aspect mage who layers Earth, Time, Magic, and Deathwing effects while Nozdormu accelerates cooldowns and Wrath turns Heat into Embers.", "You want a mobile multi-aspect dragon caster that changes substantially while leveling.", "You need a well-documented current rotation or dislike several elemental and cooldown layers.", "Using the wrong aspect payoff or missing cooldown reductions can desynchronize a rotation that public guides have not yet settled.", "Current players praise mobility, though the exact live interaction set has also produced bug reports.", ["high", "high", "moderate-high", "high", "moderate-high", "high"]),
    "cultist/godblade": ("void-hybrid-bruiser", ["insanity-melee", "zone-summoner"], "A Void-infused weapon fighter who converts intellect into force, opens rifts and tentacle zones, then enters N'Zoth-fueled Voidborne burst.", "You want hybrid gearing, heavy Void weapons, summoned zones, and an Insanity transformation.", "You dislike healing-denial tradeoffs or keeping enemies inside tentacle and rift zones.", "Poor Insanity timing or enemies leaving summoned zones reduces both weapon and N'Zoth payoff.", "Melee contact and zone placement both matter, making moving targets especially costly.", ["moderate-high", "high", "moderate-high", "moderate-high", "moderate-high", "high"]),
    "cultist/corruption": ("beam-ramp-dot-caster", ["insanity-caster", "setup-caster"], "A C'Thun caster who stacks Darkwither and Horrorbolt pressure until periodic damage feeds escalating Gazes, beams, portals, and Wrath casts.", "You want uninterrupted ranged ramp, DoTs, and increasingly large beam windows.", "You want immediate burst or frequently change targets before setup matures.", "Target swaps, interrupted channels, or poor Insanity control break the periodic-damage feedback that accelerates its beams.", "Ranged setup provides space, but portals and target-bound ramp make relocation costly.", ["high", "high", "moderate-high", "moderate", "moderate-high", "high"]),
    "cultist/heretic": ("melee-damage-healer", ["single-ally-support", "hybrid-healer"], "A Yogg-Saron battle healer whose Malevolence hurts enemies while Black Blood and melee criticals restore allies, with Hand support focused on one chosen partner.", "You want an aggressive melee healer with strong single-ally support and hybrid build options.", "You want a conventional ranged healer or dislike healing that depends on offensive contact.", "Losing melee contact or placing Hand and Black Blood value on the wrong ally reduces both damage and healing throughput.", "Melee range is part of the healing engine, so encounter movement can interrupt more than personal damage.", ["high", "high", "moderate-high", "high", "high", "high"]),
    "cultist/dreadnought": ("insanity-shield-tank", ["block-tank", "summon-tank"], "An eldritch shield tank who builds Insanity through retaliation, throws Twilight shields, and cycles giant Dreadnought and Void absorbs with summoned entities.", "You want an active block tank with huge absorb forms, Insanity timing, and tentacle spectacle.", "You want passive armor or dislike cycling forms, absorbs, and summoned effects.", "Entering a shield form with poor Insanity or overlapping the two absorb cycles can expose the following damage event.", "Shield toss and summons support pack control, while the defensive cycle remains player-centered.", ["high", "high", "moderate-high", "high", "moderate", "high"]),
    "sun-cleric/piety": ("dual-school-sequence-caster", ["stance-caster", "burst-caster"], "A sunrise-and-sunset caster who alternates Holy and Fire to build opposing sides, then releases Scorch, Ray, Rapture, and Sun Down payoffs.", "You want deliberate school sequencing and large solar cash-outs rather than one-school spam.", "You dislike stance-like alternation or tracking two empowerment directions.", "Repeating the wrong school or cashing out before both sides are prepared weakens the entire sunrise-sunset sequence.", "Ranged play offers space, but its best sequence may involve hard-cast and school-order commitments.", ["high", "high", "moderate", "moderate-high", "moderate-high", "high"]),
    "sun-cleric/blessings": ("buff-rich-direct-healer", ["approachable-healer", "ally-engine-support"], "A radiant healer who combines direct Sunlight and Cascade recovery with Vows and Blessings that turn allies into healing or damage engines.", "You want an approachable direct-healing core with a large buff and ally-selection ceiling.", "You want a damage-first healer or dislike maintaining Vows and target-specific blessings.", "Putting Triumph or another major Blessing on the wrong ally can waste more value than a missed filler heal.", "Hybrid range and conventional healing tools make movement relatively forgiving.", ["moderate", "moderate-high", "moderate", "high", "moderate", "moderate-high"]),
    "sun-cleric/seraphim": ("healing-block-tank", ["intellect-tank", "party-mitigation-tank"], "An angelic block tank who scales with Intellect, swings Dawnbreak and Gavels, casts instant Illumination, and protects the party from magical damage.", "You want active tanking blended with meaningful party healing and support cooldowns.", "You want a purely selfish tank or dislike watching allies while managing block states.", "Using instant Illumination or Solar Invocation for routine damage can leave the party without its needed recovery or magic answer.", "Melee tank positioning combines with party-aware support targeting.", ["moderate-high", "high", "moderate", "high", "moderate-high", "high"]),
    "sun-cleric/valkyrie": ("solar-proc-warrior", ["dual-wield-melee", "execution-window-melee"], "A solar weapon fighter who builds Radiant Marks, leaps and grips through packs, and turns Glorious Execution and Sunslam procs into Holy burst.", "You want mobile martial Holy combat with marks, executions, and detailed current PvE build options.", "You dislike rapidly changing builds or proc-heavy weapon optimization.", "Missing a Radiant Mark or Glorious Execution window can strand mana and proc value until the next setup.", "Leaps, grips, and pursuit tools make it a mobile melee spec with active target control.", ["moderate-high", "high", "moderate-high", "moderate-high", "high", "moderate-high"]),
    "tinker/demolition": ("deployable-explosives-caster", ["high-load-ranged", "ground-setup-dps"], "A battlefield engineer who overlaps bombs, napalm, rockets, turrets, drones, factories, and oil until the whole pull becomes one explosive machine.", "You want visually busy ranged AoE with deployables and a very high optimization ceiling.", "You dislike ground placement, overlapping cooldown plans, or many simultaneous objects.", "Poor placement or staggered deployable cooldowns can make several explosive multipliers miss the same pack.", "Ranged attacks allow space, but factories, oil, turrets, and napalm anchor damage to locations.", ["high", "high", "high", "high", "moderate-high", "high"]),
    "tinker/invention": ("device-area-healer", ["prepared-healer", "emergency-toolbox"], "A gadget medic who surrounds allies with beacons, nanobots, batteries, cleansers, Bandage Gun fire, and emergency repair devices.", "You want prepared area support and a large toolbox of recovery and utility devices.", "You want a small direct-heal kit or dislike tracking placed devices and batteries.", "Placing beacons or stations where the group cannot use them leaves emergency repairs carrying the entire event.", "Hybrid range helps reposition, while persistent support devices reward anticipating movement.", ["high", "high", "high", "high", "moderate-high", "high"]),
    "venomancer/venom": ("fungal-rot-caster", ["affliction-caster", "utility-dot-caster"], "A fungal rot caster who spreads Wilt, spores, snakes, and disease, then uses Sepsis Bloom to control and detonate the infected field.", "You want Affliction-like multi-target pressure with fungal summons and druid-like utility.", "You want immediate burst or dislike maintaining several periodic effects.", "Blooming before the DoT network matures, or after targets split, wastes both control and delayed damage.", "Ranged DoTs preserve pressure while moving, but the infection network is target-bound.", ["moderate-high", "high", "moderate", "moderate-high", "moderate", "high"]),
    "venomancer/stalking": ("spider-ambush-executor", ["position-melee", "pvp-controller"], "A spider-form ambusher who applies corrosive toxins through bites, burrows into pursuit, and detonates venom during execute pressure.", "You want a positional monster-form melee spec with pursuit, control, and single-target payoff.", "You need reliable AoE, dislike form dependence, or want a currently well-regarded leveling experience.", "Failed combo-point generation, lost contact, or a reported mechanic bug can prevent the toxin payback entirely.", "Burrow and pursuit create strong access, but the spec remains highly position-dependent.", ["moderate-high", "high", "moderate", "high", "high", "high"]),
    "venomancer/vizier": ("hot-network-healer", ["form-healer", "poison-conversion-healer"], "A poison-to-medicine healer who builds Mycelial and Mist networks, extracts harmful effects, and enters Vizier Form for sustained recovery.", "You want healing-over-time networks, unusual poison conversion, utility, and a battle resurrection.", "You want sturdy direct healing or are uncomfortable with a reported form-related fragility bug.", "Falling behind the HoT network or entering a bugged or poorly timed form can leave little immediate recovery.", "Hybrid range and persistent healing aid movement, although form safety is currently disputed.", ["moderate-high", "high", "moderate-high", "high", "moderate", "high"]),
    "reaper/harvest": ("execute-sustain-scythe", ["pvp-pursuer", "bleed-brawler"], "An aggressive scythe executioner who builds fragments through Doomrend and Reap, sustains through violence, and accelerates into Blood Frenzy and execute range.", "You want chase, self-healing, large-pull sustain, and a forceful execute phase.", "You dislike melee uptime or a spec whose strongest reputation may be PvP rather than PvE.", "Missing soul-charge setup or losing contact during Blood Frenzy reduces both healing and execute pressure.", "Chase tools support PvP contact and large-pull aggression.", ["moderate-high", "moderate-high", "moderate", "high", "high", "moderate-high"]),
    "reaper/soul": ("spectral-state-skirmisher", ["debuff-melee", "pvp-reset-burster"], "A ghostly skirmisher who moves through Deathchaser and Limbo states, marks a Gravesite, and lets Soulrot and shades mature before the spectral payoff.", "You want spectral mobility, delayed debuffs, area marks, and PvP reset play.", "You want a direct melee rotation without states, shades, or delayed damage.", "Leaving the Gravesite, mistiming Limbo, or consuming Reaped Souls before Soulrot matures wastes the spectral setup.", "Spectral states create high mobility and reset potential with corresponding positional demands.", ["high", "high", "moderate-high", "high", "high", "high"]),
    "reaper/domination": ("soul-summon-avoidance-tank", ["pack-sustain-tank", "spectral-knight"], "A spectral knight who generates souls through Dreadwake, summons wardens and scythes, and turns avoidance and active pack pressure into healing and mitigation.", "You want a summon-assisted tank that grows stronger while actively fighting large packs.", "You want passive defenses or dislike tracking souls, summons, Painmail, and Bolstered Form.", "Entering Bolstered Form with poor soul state or losing pack activity can remove the healing engine just as pressure rises.", "Hybrid reach, summoned scythes, and pack-centered sustain aid control while rewarding continuous activity.", ["high", "high", "moderate-high", "high", "moderate-high", "high"]),
}


# Qualitative general-context positions for the 31 detailed overlays. Existing
# context-specific values always win; these are only inserted when an axis has
# no authored non-unknown value at all.
DETAILED_AXIS_DEFAULTS = {
    "bloodmage/accursed": ["moderate-high", "high", "moderate", "moderate-high", "high", "high"],
    "bloodmage/eternal": ["moderate", "moderate-high", "low-moderate", "high", "moderate", "high"],
    "bloodmage/fleshweaver": ["high", "high", "high", "high", "moderate", "high"],
    "bloodmage/sanguine": ["moderate-high", "high", "moderate-high", "moderate-high", "moderate", "high"],
    "chronomancer/artificer": ["moderate-high", "high", "moderate", "high", "high", "high"],
    "chronomancer/infinite": ["moderate", "moderate-high", "moderate", "moderate-high", "moderate", "moderate-high"],
    "chronomancer/time": ["moderate", "high", "moderate", "high", "moderate", "high"],
    "guardian/gladiator": ["high", "moderate-high", "high", "high", "high", "high"],
    "guardian/inspiration": ["high", "high", "high", "high", "high", "high"],
    "guardian/vanguard": ["low-moderate", "moderate", "low", "moderate-high", "moderate", "high"],
    "necromancer/animation": ["moderate", "high", "high", "moderate-high", "moderate", "moderate-high"],
    "necromancer/death": ["moderate-high", "high", "moderate", "moderate-high", "moderate", "high"],
    "necromancer/rime": ["moderate-high", "moderate-high", "moderate", "moderate-high", "moderate-high", "high"],
    "primalist/geomancy": ["moderate-high", "high", "moderate", "moderate-high", "moderate", "high"],
    "primalist/life": ["high", "high", "moderate-high", "high", "high", "high"],
    "primalist/mountain-king": ["moderate-high", "high", "moderate", "high", "moderate-high", "high"],
    "primalist/primal": ["moderate", "moderate-high", "moderate", "moderate-high", "moderate", "moderate"],
    "ranger/farstrider": ["moderate", "moderate", "low-moderate", "moderate", "moderate-high", "moderate"],
    "runemaster/arcane": ["high", "high", "moderate-high", "high", "moderate-high", "high"],
    "runemaster/riftblade": ["moderate", "high", "moderate", "moderate-high", "high", "moderate-high"],
    "runemaster/runic": ["moderate", "moderate-high", "moderate-high", "moderate-high", "moderate", "moderate"],
    "starcaller/moon-guard": ["moderate", "moderate-high", "moderate", "high", "moderate", "high"],
    "starcaller/moon-priest": ["high", "moderate-high", "moderate-high", "high", "moderate-high", "high"],
    "starcaller/sentinel": ["low-moderate", "moderate", "low", "moderate", "moderate-high", "low-moderate"],
    "starcaller/warden": ["low-moderate", "moderate-high", "moderate", "moderate-high", "high", "moderate"],
    "templar/crusader": ["low-moderate", "moderate", "low-moderate", "moderate", "moderate", "low-moderate"],
    "templar/oathkeeper": ["moderate", "high", "moderate", "high", "moderate", "high"],
    "templar/zealot": ["moderate-high", "high", "moderate-high", "moderate-high", "high", "moderate-high"],
    "tinker/mechanics": ["moderate", "high", "high", "moderate-high", "moderate-high", "high"],
    "venomancer/fortitude": ["moderate", "high", "moderate", "high", "moderate", "high"],
    "witch-hunter/houndmaster": ["moderate-high", "high", "moderate-high", "moderate-high", "moderate-high", "high"],
}


# Atlas shelf assignment. Values use the six mockup-v2 family ids. The first
# value is primary; the remainder are honest cross-links. Micro-archetypes are
# preserved separately as playstyle_tags.
FEEL_FAMILY_ASSIGNMENTS = {
    "barbarian/brutality": ["marksmen", "duelists", "planners"],
    "barbarian/headhunting": ["marksmen", "duelists"],
    "barbarian/ancestry": ["strategists", "commanders"],
    "bloodmage/accursed": ["duelists", "sequencers"],
    "bloodmage/eternal": ["strategists", "sequencers"],
    "bloodmage/fleshweaver": ["strategists", "planners"],
    "bloodmage/sanguine": ["planners", "sequencers"],
    "chronomancer/artificer": ["sequencers", "duelists"],
    "chronomancer/infinite": ["planners", "sequencers"],
    "chronomancer/time": ["strategists", "sequencers"],
    "cultist/godblade": ["sequencers", "planners"],
    "cultist/corruption": ["planners", "sequencers"],
    "cultist/heretic": ["strategists", "duelists"],
    "cultist/dreadnought": ["strategists", "commanders", "sequencers"],
    "felsworn/slayer": ["duelists", "sequencers"],
    "felsworn/infernal": ["planners", "sequencers"],
    "felsworn/tyrant": ["strategists", "duelists"],
    "guardian/gladiator": ["duelists", "sequencers"],
    "guardian/inspiration": ["strategists", "sequencers"],
    "guardian/vanguard": ["strategists", "marksmen"],
    "knight-of-xoroth/hellfire": ["commanders", "sequencers"],
    "knight-of-xoroth/war": ["marksmen", "planners"],
    "knight-of-xoroth/defiance": ["commanders", "strategists"],
    "necromancer/animation": ["commanders", "strategists"],
    "necromancer/death": ["planners", "sequencers"],
    "necromancer/rime": ["sequencers", "planners"],
    "primalist/geomancy": ["sequencers", "planners"],
    "primalist/life": ["strategists", "duelists"],
    "primalist/mountain-king": ["strategists", "sequencers"],
    "primalist/primal": ["commanders", "duelists"],
    "pyromancer/flameweaving": ["strategists", "planners"],
    "pyromancer/incineration": ["planners", "sequencers"],
    "pyromancer/draconic": ["sequencers", "planners"],
    "ranger/archery": ["marksmen"],
    "ranger/brigand": ["duelists", "sequencers"],
    "ranger/farstrider": ["strategists", "commanders"],
    "reaper/harvest": ["duelists", "marksmen"],
    "reaper/soul": ["duelists", "planners"],
    "reaper/domination": ["commanders", "strategists"],
    "runemaster/arcane": ["sequencers", "planners"],
    "runemaster/riftblade": ["duelists", "sequencers"],
    "runemaster/runic": ["sequencers", "duelists"],
    "starcaller/moon-guard": ["strategists", "sequencers"],
    "starcaller/moon-priest": ["strategists", "planners"],
    "starcaller/sentinel": ["marksmen"],
    "starcaller/warden": ["duelists", "sequencers"],
    "stormbringer/lightning": ["marksmen", "sequencers"],
    "stormbringer/wind": ["strategists"],
    "stormbringer/maelstrom": ["planners", "sequencers"],
    "sun-cleric/piety": ["sequencers", "planners"],
    "sun-cleric/blessings": ["strategists", "marksmen"],
    "sun-cleric/seraphim": ["strategists", "sequencers"],
    "sun-cleric/valkyrie": ["duelists", "sequencers"],
    "templar/crusader": ["marksmen", "sequencers"],
    "templar/oathkeeper": ["strategists", "marksmen"],
    "templar/zealot": ["sequencers", "duelists"],
    "tinker/demolition": ["planners", "commanders"],
    "tinker/invention": ["strategists", "commanders"],
    "tinker/mechanics": ["commanders", "sequencers"],
    "venomancer/venom": ["planners", "sequencers"],
    "venomancer/stalking": ["duelists", "planners"],
    "venomancer/vizier": ["strategists", "planners"],
    "venomancer/fortitude": ["strategists", "commanders"],
    "witch-doctor/voodoo": ["planners", "commanders"],
    "witch-doctor/brewing": ["strategists", "planners"],
    "witch-doctor/shadowhunting": ["sequencers", "duelists", "commanders"],
    "witch-hunter/boltslinger": ["marksmen", "duelists"],
    "witch-hunter/black-knight": ["strategists", "sequencers"],
    "witch-hunter/houndmaster": ["commanders", "strategists"],
    "witch-hunter/inquisition": ["sequencers", "duelists"],
}


AXES = ("core_actions", "state_tracking", "setup_burden", "reactive_decisions", "execution", "failure_cost")


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def claim_name(claim: dict) -> str:
    return claim["text"].split(":", 1)[0].strip()


def source_theme_text(sources: list[dict]) -> str:
    themes = []
    for source in sources:
        themes.extend(source.get("themes", []))
    unique = list(dict.fromkeys(themes))
    return ", ".join(unique[:8]) if unique else "current playstyle and role impressions"


def write_overlay(packet: dict) -> None:
    spec_id = packet["spec"]["id"]
    if spec_id not in CURATION:
        return
    slug = packet["baseline_path"].split("/")[-1].removesuffix(".json")
    target = RESEARCH / "overlays" / f"{slug}.json"
    if target.exists():
        return

    profile = read_json(RESEARCH / packet["baseline_path"])
    family, also, fantasy, enjoy, avoid, failure, movement, values = CURATION[spec_id]
    claims = profile["claims"]
    talent_ids = [c["id"] for c in claims if c["id"].startswith("talent:")]
    first_ids = talent_ids[:3]
    last_ids = talent_ids[-3:]
    first_names = [claim_name(c) for c in claims if c["id"] in first_ids]
    last_names = [claim_name(c) for c in claims if c["id"] in last_ids]
    source_rows = packet.get("recent_direct_sources", [])
    source_ids = [s["id"] for s in source_rows]
    build = packet.get("community_build_snapshot") or {}
    performance = packet.get("performance_signals") or {}
    roles = packet["spec"].get("roles", [])
    ranges = packet["spec"].get("range", [])
    theme_text = source_theme_text(source_rows)
    community_claim = f"observed:{spec_id}:community-signal"
    build_claim = f"observed:{spec_id}:build-snapshot"
    performance_claim = f"observed:{spec_id}:performance"
    identity_claim = f"inference:{spec_id}:identity"
    failure_claim = f"inference:{spec_id}:failure-cost"

    defensive_names = [claim_name(c) for c in claims if any(k in c["text"].lower() for k in ("heal", "guard", "shield", "ward", "barrier", "parry", "block", "armor", "resist"))][:5]
    utility_names = [claim_name(c) for c in claims if any(k in c["text"].lower() for k in ("silenc", "stun", "slow", "root", "ally", "party", "raid", "interrupt", "cleanse", "dispel"))][:5]
    defense_text = f"Its structural defensive package includes {', '.join(defensive_names)}." if defensive_names else "Its defensive and control package is present in the talent structure but lacks a current detailed guide."
    utility_text = f"Group or control tools include {', '.join(utility_names)}." if utility_names else "Current evidence does not establish unusually strong group utility beyond the role's baseline tools."

    confidence = "medium" if source_ids and build.get("count", 0) else "medium-low"
    community_level = "moderate_indexed" if len(source_ids) >= 2 or build.get("count", 0) >= 2 else "thin_indexed"
    perf_ids = [performance_claim] if performance else []
    early_ids = first_ids + ([community_claim] if source_ids else [])
    late_ids = last_ids + ([build_claim] if build.get("count", 0) else []) + perf_ids

    complexity = {}
    for axis, value in zip(AXES, values):
        complexity[axis] = {
            "general": {
                "value": value,
                "reason": f"This {family.replace('-', ' ')} profile is rated {value} on {axis.replace('_', ' ')} from its structural loop and the limits of current community evidence.",
                "claim_ids": [identity_claim] + ([community_claim] if source_ids else []),
            }
        }

    append_claims = []
    if source_ids:
        limitations = " ".join(s.get("limitations", "") for s in source_rows if s.get("limitations"))
        append_claims.append({
            "id": community_claim, "kind": "observed",
            "text": f"Recent direct sources for {packet['spec']['name']} discuss {theme_text}. These themes establish current points of attention but do not by themselves prove an optimal rotation or comparative rank.",
            "source_ids": source_ids,
            "scope": {"levels": "leveling_10_60", "content": ["community_reported_contexts"], "build_or_mode": ["general"]},
            "confidence": "medium" if len(source_ids) >= 2 else "low-moderate", "conflicts_with": [],
            "notes": limitations[:700] or "Indexed community evidence remains context dependent."
        })
    if build.get("count", 0):
        append_claims.append({
            "id": build_claim, "kind": "observed",
            "text": f"The captured Build Hub inventory contains {build['count']} {packet['spec']['name']} build(s); the leading entry is titled '{build.get('top_title')}'. This proves a current community build exists but does not independently validate its rotation or optimality.",
            "source_ids": build.get("source_ids", []),
            "scope": {"levels": "level_50_60", "content": ["community_build_snapshot"], "build_or_mode": ["documented_builds"]},
            "confidence": "medium", "conflicts_with": [], "notes": "Build inventory evidence is descriptive, not a ranking."
        })
    if performance:
        dps = performance.get("reported_dps")
        records = performance.get("mythic_upload_records")
        dps_text = f" reports {dps:,} DPS in the source's {performance.get('dps_context', 'unspecified')} context" if isinstance(dps, (int, float)) else " supplies no DPS value for this role"
        append_claims.append({
            "id": performance_claim, "kind": "observed",
            "text": f"The July community compilation{dps_text}, and the August Mythic inventory lists {records} record(s). Neither signal is normalized for gear, encounter, role contribution, or player selection.",
            "source_ids": ["reddit:dps-aggregate-2026-07-25", "reddit:class-statistics-2026-08-02"],
            "scope": {"levels": "level_60", "content": ["pve_unspecified", "mythic_dungeons"], "build_or_mode": [performance.get("dps_context", "unspecified")]},
            "confidence": "low", "conflicts_with": [], "notes": performance.get("label_mapping", "Performance context is incomplete; do not use as a tier rank.")
        })
    append_claims.extend([
        {
            "id": identity_claim, "kind": "inference", "text": fantasy,
            "source_ids": [], "derived_from_claim_ids": first_ids + last_ids,
            "scope": {"levels": "all", "content": ["all"], "build_or_mode": ["all"]},
            "confidence": "high", "conflicts_with": [], "notes": "Curated playstyle classification from current structural data."
        },
        {
            "id": failure_claim, "kind": "inference", "text": failure,
            "source_ids": [], "derived_from_claim_ids": (first_ids + last_ids + ([community_claim] if source_ids else [])),
            "scope": {"levels": "all", "content": ["all"], "build_or_mode": ["all"]},
            "confidence": "medium", "conflicts_with": [], "notes": "Failure-mode interpretation; exact thresholds require live verification."
        }
    ])

    source_claim_ids = ([community_claim] if source_ids else []) + ([build_claim] if build.get("count", 0) else [])
    overlay = {
        "baseline": f"{slug}.json",
        "set": {
            "identity": {"fantasy": fantasy, "primary_family": family, "also_fits": also},
            "mechanics": {
                "core_loop": packet["structural_summary"],
                "single_target": f"On durable targets, the structural path grows from {', '.join(first_names)} toward {', '.join(last_names)}. A precise priority remains limited to the captured build and community evidence.",
                "aoe": f"Pack play follows the same core identity, with current indexed source themes emphasizing {theme_text}. Where those sources conflict or stay silent, the profile does not invent an AoE ranking.",
                "movement_and_target_switching": movement,
                "defense_and_control": defense_text,
                "group_utility": utility_text,
                "failure_modes": [{"text": failure, "claim_ids": [failure_claim]}],
            },
            "contexts": {
                "leveling_10_29": {"feel": f"The early identity begins with {', '.join(first_names)} before the full late-game engine is available.", "strengths": [fantasy, f"Core role: {'/'.join(roles)}"], "cautions": ["Early play should not be treated as the level-60 rotation", "Recent leveling evidence may be sparse"], "claim_ids": early_ids},
                "level_50_60": {"feel": f"Late talents add {', '.join(last_names)}, completing the intended {family.replace('-', ' ')} shape.", "strengths": [f"Current Build Hub entries: {build.get('count', 0)}", f"Mythic records: {performance.get('mythic_upload_records', 'not captured')}", f"Range: {'/'.join(ranges)}"], "cautions": ["Performance signals are uncontrolled", "Exact priority is not asserted without a detailed current guide"], "claim_ids": late_ids},
            },
            "complexity": complexity,
            "fit": {"enjoy_if": [{"text": enjoy, "claim_ids": [identity_claim]}], "avoid_if": [{"text": avoid, "claim_ids": [failure_claim]}]},
            "sentiment": {
                "praise": [{"theme": f"Current indexed discussion and builds most strongly support the {family.replace('-', ' ')} identity and themes of {theme_text}.", "claim_ids": source_claim_ids or [identity_claim]}],
                "frustrations": [{"theme": f"The clearest risk is: {failure}", "claim_ids": [failure_claim]}],
                "contested": [{"theme": "Structural intent, current build practice, and community sentiment are kept separate because the available evidence does not justify resolving them into one verdict.", "claim_ids": source_claim_ids + [identity_claim]}],
            },
            "performance_signal_ids": perf_ids,
            "coverage": {"mechanical": "curated_structural_interpretation", "community": community_level, "performance": "limited_uncontrolled" if performance else "missing", "video": "searched_none_verified", "overall_confidence": confidence, "gaps": ["A current detailed rotation guide or direct live-play cross-check is still needed.", "Context-specific complexity values should be refined when stronger evidence arrives."]},
        },
        "level_band_updates": {
            "leveling_10_19": {"observed_loop": f"Begin with {', '.join(first_names)} and the initial {family.replace('-', ' ')} identity.", "observed_changes": ["This is structural early-level interpretation, not a claimed optimal rotation."]},
            "level_50_60": {"observed_loop": f"Integrate {', '.join(last_names)} into the established core.", "observed_changes": ["Late talents complete or deepen the identity; current play evidence remains separately labeled."]},
        },
        "append_claims": append_claims,
    }
    target.write_text(json.dumps(overlay, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def complete_detailed_complexity_axes(packet: dict) -> bool:
    spec_id = packet["spec"]["id"]
    values = DETAILED_AXIS_DEFAULTS.get(spec_id)
    if values is None:
        return False
    slug = packet["baseline_path"].split("/")[-1].removesuffix(".json")
    target = RESEARCH / "overlays" / f"{slug}.json"
    overlay = read_json(target)
    complexity = overlay.setdefault("set", {}).setdefault("complexity", {})
    append_claims = overlay.get("append_claims", [])
    identity_claim = next(
        (claim["id"] for claim in append_claims if claim["id"].endswith(":identity")),
        append_claims[0]["id"] if append_claims else None,
    )
    changed = False
    for axis, value in zip(AXES, values):
        existing = complexity.get(axis, {})
        has_known = any(
            isinstance(entry, dict) and entry.get("value") not in (None, "unknown")
            for entry in existing.values()
        ) if isinstance(existing, dict) else False
        if has_known:
            continue
        claim_ids = [identity_claim] if identity_claim else []
        complexity.setdefault(axis, {})["general"] = {
            "value": value,
            "reason": f"The detailed curated profile places general {axis.replace('_', ' ')} at {value}; context-specific evidence remains more authoritative where present.",
            "claim_ids": claim_ids,
        }
        changed = True
    if changed:
        target.write_text(json.dumps(overlay, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed


def normalize_feel_family(packet: dict) -> bool:
    spec_id = packet["spec"]["id"]
    families = FEEL_FAMILY_ASSIGNMENTS.get(spec_id)
    if not families:
        return False
    slug = packet["baseline_path"].split("/")[-1].removesuffix(".json")
    target = RESEARCH / "overlays" / f"{slug}.json"
    overlay = read_json(target)
    identity = overlay.setdefault("set", {}).setdefault("identity", {})
    current_primary = identity.get("primary_family")
    current_also = identity.get("also_fits", [])
    tags = list(dict.fromkeys(identity.get("playstyle_tags", []) + ([current_primary] if current_primary and current_primary not in FEEL_FAMILY_ASSIGNMENTS.get(spec_id, []) else []) + [tag for tag in current_also if tag not in families]))
    changed = (
        identity.get("primary_family") != families[0]
        or identity.get("also_fits") != families[1:]
        or identity.get("playstyle_tags") != tags
    )
    if not changed:
        return False
    identity["primary_family"] = families[0]
    identity["also_fits"] = families[1:]
    identity["playstyle_tags"] = tags
    target.write_text(json.dumps(overlay, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return True


def main() -> None:
    packets = read_json(RESEARCH / "evidence-packets.json")["packets"]
    before = len(list((RESEARCH / "overlays").glob("*.json")))
    for packet in packets:
        write_overlay(packet)
    completed_axes = sum(complete_detailed_complexity_axes(packet) for packet in packets)
    normalized_families = sum(normalize_feel_family(packet) for packet in packets)
    after = len(list((RESEARCH / "overlays").glob("*.json")))
    print(f"Generated {after - before} remaining overlays; completed missing axes in {completed_axes} detailed overlays; normalized {normalized_families} feel families; {after} overlays now present.")


if __name__ == "__main__":
    main()
