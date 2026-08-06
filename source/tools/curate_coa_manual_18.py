"""Apply the manually researched 2026-08-06 deep pass for 18 CoA profiles.

The prose and ratings in SPECS are hand-authored from the talent snapshot, captured
Build Hub guides, and the source ledger.  The serializer only keeps the repetitive
schema and claim wiring consistent across profiles.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
R = ROOT / "reports" / "coa-specs" / "research-v2"
CONTEXTS = ("leveling_10_29", "leveling_30_49", "level_50_60", "boss", "dungeon_aoe", "pvp")
AXES = ("core_actions", "state_tracking", "setup_burden", "reactive_decisions", "execution", "failure_cost")


def P(identity, loop, play, context, complexity, evidence, fit, sentiment, gaps):
    return {
        "identity": identity, "loop": loop, "play": play, "context": context,
        "complexity": complexity, "evidence": evidence, "fit": fit,
        "sentiment": sentiment, "gaps": gaps,
    }


SPECS = {}


def add(spec_id, **kwargs):
    SPECS[spec_id] = P(**kwargs)


def researched(spec_id, identity, one_line, mechanics, failures, stages, modes, axes,
               talents, sources, observations, build, performance, fit, sentiment, gaps):
    """Register a fully authored profile while expanding its six-context schema."""
    st, aoe, move, defense, utility = mechanics[1:]
    context = [
        (stages[0], modes[0][0], modes[0][1]),
        (stages[1], modes[1][0], modes[1][1]),
        (stages[2], modes[2][0], modes[2][1]),
        (f"On bosses, {st}", modes[3][0], modes[3][1]),
        (f"In dungeons, {aoe}", modes[4][0], modes[4][1]),
        (f"In PvP, {move} {defense}", modes[5][0], modes[5][1]),
    ]
    complexity = []
    for reason, values in axes:
        complexity.append((reason, values))
    add(spec_id, identity=(identity, one_line), loop=(*mechanics, failures), play=None,
        context=context, complexity=complexity,
        evidence={"talents":talents, "sources":sources, "observations":observations,
                  "build":build, "performance":performance}, fit=fit,
        sentiment=sentiment, gaps=gaps)


LOADS = {
 "easy": ["low-moderate","moderate","moderate","moderate","moderate","moderate-high"],
 "medium": ["moderate","moderate-high","high","moderate-high","high","high"],
 "high": ["moderate-high","high","high","high","high","high"],
}
def ax(load, *reasons):
    return [(reason, LOADS[load]) for reason in reasons]


def deep(spec_id, identity, one_line, mechanics, failures, stages, strengths, cautions,
         axis_reasons, load, talents, sources, observations, build, performance,
         enjoy, avoid, sentiment, gaps):
    modes=[]
    for i in range(6):
        modes.append((strengths[i], cautions[i]))
    researched(spec_id, identity, one_line, mechanics, failures, stages, modes,
               ax(load, *axis_reasons), talents, sources, observations, build,
               performance, (enjoy, avoid), sentiment, gaps)


add("cultist/godblade",
 identity=("A Void-infused two-handed bruiser who deliberately flirts with madness, tears open damaging zones, and turns a full Insanity bar into a dangerous burst form.", "Build Insanity, establish Rift and tentacle pressure, then decide whether the target and incoming damage justify crossing 100 for Voidborne and repeated Hammer or Entropic Slam payoffs."),
 loop=("Use weapon attacks and Cultist abilities to climb toward the Insanity threshold, establish Rift and summoned pressure, then spend the short Voidborne window on Rifted Hammer of Twilight and the correct single-target or multi-target strike. PvE practice can embrace 100 Insanity; PvP practice generally treats it as a timed risk.", "Current build guidance favors Rifted Hammer of Twilight on cooldown and Entropic Slam or Hammer follow-ups, with a slow heavy two-hander magnifying the large hits.", "Build Insanity while a pull gathers, place Rift and tentacle effects where the pack will remain, then use Hammer and Entropic Slam. The payoff is large but loses value when a tank drags the pack away.", "Melee range and ground-bound summons make moving enemies costly. Mounted and Cultist control tools help reconnect, but target swaps can strand a prepared Rift.", "Voidborne can provide a burst and stun-immune window; Cultist absorbs, fears, and healing tools cover emergencies. At 100 Insanity the extra damage taken makes defense part of the burst decision.", "Empire's Grasp, fear effects, healing denial, and Cultist utility matter beyond raw damage, particularly against healers.", ["Crossing 100 Insanity without a kill or defensive plan exposes the player to the same amplified damage that fuels the burst.", "Dropping Rift, Hammer, or tentacles before the target is stationary wastes a large share of the planned window.", "Spending or suppressing Insanity too conservatively in PvE can miss the spec's defining damage state."]),
 play=None,
 context=[
  ("A heavy melee builder with early Rift and Hand of N'Zoth pieces, but without the full transformation payoff.", ["Readable large hits", "Early zone identity"], ["Incomplete Insanity economy", "Limited recovery after a bad pull"]),
  ("The weapon-and-madness loop becomes coherent: bank Insanity while gathering, then line up Rift, Hammer, and Voidborne.", ["Strong pack burst", "Distinct risk-reward rhythm"], ["Zone placement matters", "Melee downtime delays the window"]),
  ("A deliberate high-risk bruiser that can sit near 100 or cross it for enormous PvE pressure, while PvP demands much stricter timing.", ["Large burst ceiling", "Strong anti-healer utility"], ["Full Insanity amplifies incoming damage", "Current optimal PvE priority is build-specific"]),
  ("Prepare Insanity and Rift before committing the big Hammer sequence, then keep melee uptime through the transformation.", ["Controllable burst timing", "Good durable-target payoff"], ["Forced movement can waste the zone", "A failed 100-Insanity window is expensive"]),
  ("Gather, prebuild, plant the void zone, and detonate the pack with Hammer and Slam.", ["High stacked-pack payoff", "Useful grip and control"], ["Moving tanks break setup", "Risk rises when many enemies hit during 100 Insanity"]),
  ("A burst bruiser that threatens healers through huge hits and healing denial, but must enter madness only when crowd control and return damage are accounted for.", ["Explosive multi-target moments", "Meaningful anti-heal utility"], ["Can be kited outside cooldowns", "Bad Insanity timing is punishable"]),
 ],
 complexity=[
  ("The regular bar combines melee generators, Rift, Hammer, a spender, summons, utility, and a transformation cooldown.", ["moderate", "moderate-high", "moderate-high", "moderate", "high", "high"]),
  ("Insanity amount, Voidborne duration, Rift location, summoned-zone duration, and healing-denial opportunities all compete for attention.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Meaningful damage begins before the payoff through Insanity banking and zone placement.", ["moderate", "moderate-high", "high", "high", "high", "high"]),
  ("The player must choose between staying safe below the threshold and crossing it for damage, while reacting to target movement.", ["low-moderate", "moderate-high", "high", "moderate", "high", "high"]),
  ("Melee uptime and keeping enemies inside Rift and Hammer coverage determine whether the planned burst lands.", ["moderate", "moderate-high", "high", "high", "high", "high"]),
  ("A mistimed 100-Insanity window simultaneously wastes offensive setup and increases incoming damage.", ["moderate", "high", "high", "high", "high", "high"]),
 ],
 evidence={"talents":["Rift", "Hammer of Twilight", "Voidborne", "Entropic Slam", "Book of N'Zoth", "Twilight Domination"], "sources":["reddit:cultist-dps-2026-07-08", "reddit:cultist-pvp-2026-08-01", "reddit:cultist-heretic-2026-07-29"], "observations":[("pve-insanity-window", "Current PvE players describe intentionally reaching 100 Insanity for the damage-done amplification, then spamming the AoE slam and Rifted Hammer while accepting the matching increase to damage taken."), ("pvp-burst-window", "Current PvP advice describes Godblade as cooldown-dependent but capable of mauling several players when its 100-Insanity burst is timed correctly; healing absorption is singled out as valuable against healers."), ("gear-and-priority", "The captured Big Bonk guide recommends a slow large two-hander, prioritizes Rifted Hammer of Twilight, and distinguishes safer PvP Insanity management from aggressive PvE use.")], "build":"The captured Godblade Big Bonk guide documents Rifted Hammer on cooldown, PvE Insanity prebuilding, Entropic Slam for packs, and alternative N'Zoth cooldown packages rather than one universal setup.", "performance":"The July damage compilation lists 4,127 DPS and the August inventory lists 169 Mythic records. These establish activity and a rough sample only, not comparative power."},
 fit=(["You enjoy visibly risky burst windows instead of a flat melee priority.", "You want a heavy-weapon fighter with zones, summons, grips, and anti-heal utility."], ["You dislike taking extra damage as the price of maximum throughput.", "You want damage that follows a moving target without setup loss."]),
 sentiment=("Players praise the huge visual and numerical payoff when a prepared Rift, Hammer, and full-Insanity window connect.", "The common frustration is feeling weak or kiteable outside cooldowns, especially before the level-60 package is assembled.", "Reports range from top-damage PvE anecdotes to PvP complaints about being fragile; neither side controls for gear, bracket, or matchup."),
 gaps=["No verified current full-encounter rotation video.", "The exact safe Insanity threshold and best N'Zoth package vary by content and build."])

add("cultist/corruption",
 identity=("A mobile C'Thun affliction caster who carpets targets in Darkwither, grows an eye-and-beam network, and turns accumulated Insanity into escalating void pressure.", "Apply and preserve Darkwither, use periodic damage to accelerate Obliteration Beam and Gaze, then choose between controlled 60-Insanity pressure and a Wrath-heavy 100-Insanity state."),
 loop=("Open with Darkwither, establish Tentacle and C'Thun effects, fire Obliteration Beam and Gaze as the DoTs accelerate them, and use Psychic Suppression or Horrorbolt while refreshing rather than tunneling one target. Sanity Tap converts the resource back into mana when the danger window permits.", "The captured PvP sequence is Darkwither, Tentacle, Obliteration Beam, Gaze, then Psychic Suppression; longer PvE fights add refresh discipline and Wrath of the Black Empire decisions.", "Spread Darkwither, tab-refresh it, use Eldritch Devastation when enough enemies are grouped, and exploit beam and Gaze cooldowns. Multi-DoT pressure is the point rather than a single instant nuke.", "Many core spells can be applied while repositioning, but channels, hard-cast Wrath, and placed tentacles still punish abrupt target changes.", "Grasp, fear, Void Shield, Corrupt Mind, Abyssal Ward, and Hallucination give a broad control and survival kit; it is strong only if woven between DoT refreshes.", "Cultist fears, slows, healing denial, and pressure across several targets create disruption even before a kill.", ["Letting Darkwither expire breaks the periodic-damage engine that feeds beam pressure.", "Accidentally reaching 100 Insanity can expose the caster before Wrath or defensive tools are ready.", "Tunneling one target wastes the spec's ability to spread pressure and shorten cooldowns across a pack."]),
 play=None,
 context=[
  ("A DoT caster whose rotation becomes more manageable after the earliest levels, but whose full beam and Insanity network is not yet present.", ["Mobile damage application", "Early control access"], ["Ramp feels incomplete", "Mana and Insanity habits are still forming"]),
  ("Darkwither spread, Tentacle, Beam, Gaze, and Sanity Tap form a real multi-target pressure loop.", ["Strong sustained pressure", "Good kiting toolkit"], ["Many effects to refresh", "Burst is setup-dependent"]),
  ("A mature affliction controller balancing DoT coverage, beam cadence, mana conversion, and whether to approach the dangerous Wrath state.", ["Excellent multi-target pressure", "Deep utility"], ["High tracking load", "Few current PvE optimization sources"]),
  ("Maintain the full periodic package and convert its ticks into repeated beam and eye payoffs without clipping refreshes.", ["Durable-target ramp", "Mobile maintenance"], ["Short phases erase setup value", "Resource mistakes compound over time"]),
  ("Tag widely, stabilize Darkwither coverage, then channel or detonate only after the tank has settled the pack.", ["Natural multi-target design", "AoE fear and control"], ["Fast packs may die during setup", "Tab management is demanding"]),
  ("A spread-pressure caster that kites with Grasp and fears while cycling Beam, Gaze, and Suppression across vulnerable targets.", ["Strong disruption", "Pressure survives target swaps"], ["Channels invite interrupts", "Plate does not remove caster burst vulnerability"]),
 ],
 complexity=[
  ("The practical bar includes several DoTs, Beam, Gaze, Tentacle, a filler or suppression spell, Sanity Tap, and numerous control tools.", ["moderate", "moderate-high", "high", "moderate-high", "high", "high"]),
  ("Darkwither duration, multiple target coverage, Insanity, mana, beam cadence, and summoned effects are all live states.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Damage ramps through DoT coverage and placed C'Thun effects before the beam or Wrath payoff arrives.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Refresh timing, target count, interrupts, mana, and the safety of approaching 100 Insanity change the next action.", ["moderate", "high", "high", "high", "high", "high"]),
  ("The player must tab efficiently, preserve channels, and kite without allowing the periodic engine to collapse.", ["moderate", "moderate-high", "high", "high", "high", "high"]),
  ("Dropped DoTs or an uncontrolled Insanity transition delay both resource recovery and damage payoff.", ["moderate", "high", "high", "high", "high", "high"]),
 ],
 evidence={"talents":["Darkwither", "Obliteration Beam", "Gaze", "Horrorbolt", "Wrath of the Black Empire", "Sanity Tap"], "sources":["reddit:cultist-dps-2026-07-08", "reddit:cultist-heretic-2026-07-29", "reddit:cultist-pvp-2026-08-01"], "observations":[("leveling-transition", "A current player who used Corruption in beta says the rotation became more manageable after level 15, supporting a real early-level transition without establishing endgame strength."), ("pvp-spread-priority", "The captured PvP and leveling guide recommends spreading Darkwither, refreshing across targets, then using Tentacle, Obliteration Beam, Gaze, and Psychic Suppression rather than tunneling one opponent."), ("insanity-control", "The same guide aims for roughly 60 Insanity for a damage benefit, uses Sanity Tap for mana, and treats 100 Insanity plus Wrath of the Black Empire as a deliberate state rather than an accidental overflow.")], "build":"The captured Corruption PvP and leveling build supplies explicit single-target, spread-pressure, kiting, defensive, and Insanity-management priorities, but does not claim an optimized raid rotation.", "performance":"The July compilation lists 3,500 DPS and the August inventory lists only 31 Mythic records, a particularly thin and uncontrolled sample."},
 fit=(["You like multi-DoT pressure whose ticks accelerate larger eye and beam effects.", "You want a caster with enough fears, slows, shields, and mana tools to make many small decisions."], ["You want immediate burst on every new target.", "You dislike tab-target upkeep, channels, or a second resource that can become dangerous."]),
 sentiment=("Players who enjoy Corruption emphasize its strong spread pressure, Cultist utility, and increasingly coherent loop after the earliest levels.", "Documentation is sparse, and the setup can feel clunky when targets die before Darkwither and beam interactions mature.", "PvP praise and the small PvE performance sample answer different questions; the profile does not treat either as a universal verdict."),
 gaps=["No current detailed PvE boss guide.", "Exact beam cooldown acceleration and ideal Wrath cadence need live combat verification."])

add("cultist/heretic",
 identity=("A Yogg-Saron battle healer who marks allies with Black Blood, converts melee aggression into healing, and shifts between sustained damage-healing and large forbidden rituals.", "Keep Black Blood active, bind Abyssal Covenant to the ally who needs your damage conversion, maintain melee ability flow for free Mending and Dark Prophet healing, then use Herald or Forbidden Ritual for planned danger."),
 loop=("Apply Malevolence to damage enemies and place Black Blood on allies, select the tank or priority ally with Abyssal Covenant, then cycle melee abilities so every third one grants instant Eldritch Mending while Dark Prophet and damage conversion carry background healing. Refresh Black Blood deliberately because duration behavior matters.", "Blade of the Empire is a priority strike; use Entropic Slam on larger packs and Hammer of Twilight on one target, while managing Sanity for Malevolence, utility, and Herald preparation.", "Malevolence reaches the party, Yogg summons and damage conversion scale with active enemies, and Forbidden Ritual plus Void Shield supplies a planned group-protection answer.", "The melee build loses healing when separated from enemies. A caster-oriented PvP build trades some conversion output for plate, shield, and reliable access while being kited.", "Void Shield, Dark Veil, Hand of Yogg-Saron, Forbidden Ritual, and Cultist control provide several emergency layers rather than one conventional heal cooldown.", "Black Blood coverage, Hand of Yogg-Saron, Abyssal Covenant, presence choices, shields, and damage contribution make Heretic a high-agency group healer.", ["Allowing Black Blood to expire removes a major healing layer; the captured guide warns that normal applications do not simply refresh it.", "Losing melee uptime starves damage conversion and the every-third-ability Mending cadence.", "Entering a heavy-damage pull without Sanity banked for Herald, shields, or ritual leaves the healer with weaker recovery options."]),
 play=None,
 context=[
  ("An unusually aggressive healer whose early damage and bubbles can feel powerful, though the complete conversion engine is not yet online.", ["Strong solo sustain", "Damage while supporting allies"], ["Resource habits are unfamiliar", "Melee access can be inconsistent"]),
  ("Black Blood, Covenant, Dark Prophet, and free Mending turn the spec into a genuine melee-healing rotation.", ["Active dungeon healing", "Useful damage contribution"], ["Buff duration must be learned", "Group movement can break uptime"]),
  ("A layered battle healer managing party-wide Black Blood, one priority Covenant target, presence choice, Sanity, Herald, and ritual windows.", ["Broad healing toolkit", "High hybrid ceiling"], ["Many interacting systems", "PvP may favor a different caster setup"]),
  ("Sustain Black Blood and the melee conversion engine, then reserve Herald or ritual tools for predictable damage rather than panic-casting them late.", ["Excellent active sustain", "Damage and healing share actions"], ["Downtime reduces both outputs", "Buff-refresh errors accumulate"]),
  ("Damage the pack to heal the group, use Malevolence for coverage, and choose between continued aggression and a shield or ritual response.", ["Strong multi-target conversion", "Flexible emergency layers"], ["Requires safe melee access", "High visual and state load"]),
  ("Usually choose between a safer caster shield setup and the riskier melee engine; control, absorbs, and Black Blood can produce large swing moments.", ["Excellent utility", "Can contribute pressure while healing"], ["Melee version is kiteable", "Caster and melee gearing advice diverges"]),
 ],
 complexity=[
  ("The healer uses damage abilities, Malevolence, Covenant, Mending, shields, ritual tools, presence choices, and conventional utility.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Black Blood coverage and remaining duration, every-third-melee cadence, Covenant target, Sanity, Herald, presence, and defensive timers all matter.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Reliable healing begins with Black Blood and Covenant assignment before the damage loop or emergency window.", ["moderate", "high", "high", "high", "high", "high"]),
  ("The correct answer can be more damage, a free Mending, a shield, Hand, ritual, or a change in presence depending on incoming damage.", ["moderate", "high", "high", "high", "high", "high"]),
  ("The melee version must maintain contact and precise buff refreshes while still performing healer triage.", ["moderate", "high", "high", "high", "high", "high"]),
  ("A missed Black Blood refresh or broken melee chain can remove several healing sources at once.", ["moderate", "high", "high", "high", "high", "high"]),
 ],
 evidence={"talents":["Malevolence", "Black Blood", "Abyssal Covenant", "Dark Prophet", "Forbidden Ritual", "Herald of the Depths", "Hand of Yogg"], "sources":["reddit:cultist-heretic-2026-07-29", "reddit:cultist-pvp-2026-08-01", "reddit:easy-specs-roster-2026-08-03"], "observations":[("melee-healing-engine", "The captured Mythic-plus guide attributes a large share of healing to Dark Prophet, keeps Black Blood on the party, binds Abyssal Covenant to the tank, and uses damage to drive healing rather than treating attacks as downtime filler."), ("black-blood-refresh", "The guide explicitly warns that Black Blood duration does not refresh normally: it recommends stacking Malevolence and reapplying shortly before expiration, making buff timing a real failure point."), ("pvp-build-split", "Current PvP advice distinguishes a melee healer that requires enemy uptime from a caster-oriented plate-and-shield setup that gives up some aggression for more reliable battleground healing.")], "build":"The captured Cultist Healer M+ Ready guide provides a full dungeon loop, presence choices, emergency tools, Sanity guidance, and Crit then Strength or attack-power gearing; it is the strongest direct Heretic source in the snapshot.", "performance":"Healers are absent from the DPS compilation; 275 Mythic records indicate comparatively substantial representation but do not measure healing quality."},
 fit=(["You want healing to come from an actual melee damage rotation rather than passive atonement alone.", "You enjoy assigning buffs and selecting among several emergency layers."], ["You want a low-tracking reactive healer.", "You dislike losing healing because a boss moves out of melee or an ally buff expires."]),
 sentiment=("Players repeatedly praise Heretic's theme, solo durability, serviceable damage, and fistweaver-like group healing.", "Its resource load and requirement for cooperation or melee uptime make it harder than its raw early strength suggests.", "Some PvP reports describe enormous damage and absorb output, while others emphasize kite vulnerability; build and content explain much of the disagreement."),
 gaps=["No controlled healing-log breakdown across the melee and caster variants.", "Some build-described effects need live verification after recent patches."])

add("cultist/dreadnought",
 identity=("An eldritch shield tank who holds a dangerous Insanity floor, ricochets Twilight Shieldtoss through packs, and layers block retaliation with large temporary void absorbs.", "Establish threat with Shieldtoss and Gaze, climb above roughly 60 Insanity for defensive talents, tap only enough Sanity to recover mana, and rotate Dreadnought or Void shields before damage lands."),
 loop=("Open with Twilight Shieldtoss and C'Thun pressure, build Insanity into the range that powers defensive talents, then alternate active shields and block-driven retaliation. Use Sanity Tap frequently enough to sustain mana without falling through the useful Insanity floor.", "On one target, preserve threat through Shieldtoss, Gaze, and retaliation while aligning the larger absorb forms with predictable hits; damage is secondary to keeping the resource cycle stable.", "Shieldtoss, Gaze, summoned entities, and being struck by many enemies create strong pack feedback, but each extra target also increases the punishment for missing a shield window.", "Ranged Shieldtoss helps initiate and reconnect. Summons and ground effects are less responsive to moving packs, and the tank must avoid tapping resources while relocating under pressure.", "Block scaling, retaliation, Dreadnought Shield, Void Shield, absorbs, and summoned defenses form an active layered kit rather than passive armor alone.", "Cultist grips, fears, ranged pickup tools, and eldritch summons supply unusual tank control and visual presence.", ["Tapping below the useful Insanity threshold sacrifices defensive bonuses and can start a mana-versus-survival spiral.", "Spamming every available button early drains mana; current players recommend a compact Shieldtoss-and-Gaze base until later passives arrive.", "Using a large absorb after the hit wastes the spec's strongest mitigation and leaves the next event uncovered."]),
 play=None,
 context=[
  ("A flavorful but resource-starved shield tank; current level-20 players report drinking after only a few enemies even while attempting Sanity Tap.", ["Clear shield-toss identity", "Good early pack pickup"], ["Severe mana pressure", "Defensive Insanity talents are incomplete"]),
  ("Mana passives and lower instant costs begin to stabilize the cycle, making the intended high-Insanity tank loop more practical.", ["Better sustained pulls", "More complete absorb rotation"], ["Still requires disciplined tapping", "Cannot spam the entire kit"]),
  ("A resource-sensitive active tank that keeps Insanity high, taps down only as needed, and plans several absorbs around incoming damage.", ["Strong thematic mitigation", "Good pack tools"], ["Mana complaints persist for some players", "Low off-role damage"]),
  ("Maintain the resource floor and pre-shield large hits while Shieldtoss and retaliation preserve threat.", ["Predictable active mitigation", "Ranged reconnect"], ["Late shield timing is costly", "Few detailed raid reports"]),
  ("Many attackers feed block and retaliation effects, creating a satisfying pack loop once threat and mana are stable.", ["Strong visual AoE tanking", "Multiple control tools"], ["Large pulls accelerate mana errors", "Summons may lag moving packs"]),
  ("A durable disruption tank with grips, fears, shields, and ranged pickup, but a resource mistake can be exploited immediately.", ["Control-rich frontline", "Large absorb swings"], ["Mana and Insanity are vulnerable to pressure", "Limited current PvP evidence"]),
 ],
 complexity=[
  ("The tank combines Shieldtoss, Gaze, retaliation, summons, Sanity Tap, several absorbs, and broad Cultist control.", ["moderate", "moderate-high", "high", "high", "high", "high"]),
  ("Mana, Insanity floor, shield durations, block-driven effects, threat, and summon state must be monitored together.", ["high", "high", "high", "high", "high", "high"]),
  ("Defensive value depends on entering damage with sufficient Insanity and an absorb already active.", ["moderate", "high", "high", "high", "high", "high"]),
  ("The player continually decides whether the next global should recover mana, add threat, control a target, or prepare mitigation.", ["moderate", "high", "high", "high", "high", "high"]),
  ("Shield timing and economical button use matter more than a long damage rotation.", ["moderate", "moderate-high", "high", "high", "high", "high"]),
  ("Falling low on both mana and Insanity can remove threat, mitigation, and recovery at the same time.", ["high", "high", "high", "high", "high", "high"]),
 ],
 evidence={"talents":["Twilight Shieldtoss", "Dreadnought", "Void Shield", "Sanity Tap", "Gaze", "Block"], "sources":["reddit:dreadnought-mana-2026-07-23", "reddit:cultist-dreadnought-2026-07-20", "reddit:tank-weapons-2026-08-01"], "observations":[("early-mana-pressure", "Multiple current Dreadnought players report severe early mana pressure; one beta tester says a level-30 passive helps but does not remove the underlying management problem."), ("resource-practice", "Current advice is to build near 100 Insanity, use Sanity Tap down toward roughly 60 for mana, and avoid unnecessary abilities so the tank retains talent bonuses while sustaining the pull."), ("late-resource-tools", "Players identify later talents that lower instant-cast costs or scale costs with Insanity, so the level-20 experience should not be projected unchanged onto level 60.")], "build":"The leading captured Dreadnought build supplies a talent configuration and WeakAura but almost no rotation prose, so it is useful for build presence and tracked states rather than priority claims.", "performance":"The compilation's 1,032 tank/off-role DPS and 51 Mythic records are not a tank-quality score and should not be compared directly with damage specs."},
 fit=(["You enjoy active shield timing and a tank resource that must be deliberately kept in a beneficial band.", "You want a sword-and-board tank with eldritch summons and ranged pack pickup."], ["You want carefree early-level mana or a purely passive mitigation model.", "You dislike trimming buttons from a rotation to protect resource stability."]),
 sentiment=("Fans praise the Void shield fantasy and the satisfying block-and-retaliation loop once later resource tools arrive.", "The dominant concrete complaint is mana, especially before the level-30-to-40 cost talents, along with low damage anecdotes.", "Some players call the spec durable and enjoyable while comparison threads call it underrepresented or inferior; the evidence is too sparse to resolve a tank ranking."),
 gaps=["No current detailed endgame tank guide.", "Mitigation uptime and mana stability need direct level-60 log or video verification."])

researched("knight-of-xoroth/hellfire", "A mounted infernal spellblade fighting beside a Greater Imp, banking Hellfire Embers and turning them into a temporary demon-form barrage.", "Maintain pet and fire effects, build Embers through Cinderblade and infernal attacks, then enter Hellfire Form when the target count and cooldown package can repay it.",
 ("Coordinate Greater Imp attacks, Cinderblade, Pestilence and seeking flames to build Embers; transform and spend the window on form-enhanced strikes and summons.", "Keep the pet connected, maintain the relevant wound or fire effects, and align Form rather than drifting it into movement.", "Infernal Strikes, seeking flames, Pestilence and summons cover packs once they are grouped; the mid-level AoE conversion is a major breakpoint.", "Mounted Combat and ranged fire effects soften melee downtime, but pet travel and a misplaced Form still cost output.", "KoX self-healing, Pestilence choices, control and mounted escape give the hybrid several answers without making it a tank.", "Pestilence modes, grips and the Greater Imp add group control and sustained pressure."),
 ["Entering Hellfire Form with low Embers or before the pack settles wastes its payoff.","Losing the Greater Imp removes damage and interactions until it reconnects.","Trying to maintain every fire, pet and melee effect can delay the actual spender."],
 ("Early Cinderblade and imp play hints at the hybrid but lacks the complete form.","The AoE conversion and mounted tools make the spellblade feel powerful in the 30s.","Late talents turn pet, Embers, form and summons into a layered burst engine."),
 [(["Pet-backed soloing","Hybrid reach"],["Form incomplete","Pet travel"]),(["Strong AoE unlock","Mounted mobility"],["More states to track","Setup can be misread"]),(["Flexible ST/AoE","Distinct transformation"],["High tracking","Sparse endgame guides"]),(["Sustained pet pressure","Planned burst"],["Movement wastes Form","Pet uptime matters"]),(["Wide fire coverage","Good stacked burst"],["Tank movement breaks zones","Ramp can be late"]),(["Mounted chase","Mixed-range pressure"],["Pets can be controlled","Form is telegraphed"])],
 ax("high","The active bar combines melee strikes, fire spells, pet commands, Pestilence, Form and summons.","Embers, Hellfire Form, pet state, procs, DoTs and summon timers overlap.","The burst requires pet uptime, Embers and a settled target before transformation.","Target count and movement decide whether to remain hybrid or commit Form.","Melee contact, pet pathing and short proc windows must all be preserved.","A bad Form loses both banked Embers and cooldown alignment."),
 ["Hellfire Embers","Hellfire Form","Greater Imp","Cinderblade","Infernal Strikes","Unbound Inferno"],["reddit:kox-question-2026-07-11"],
 [("midlevel-power","A level-37 Hellfire player reports a large power increase from the AoE talent package and uses two Mounted Combat charges for questing and world PvP."),("hybrid-load","Current discussion and the captured build both show that Hellfire's output is distributed across melee attacks, fire effects, a permanent imp and a transformation rather than one short rotation."),("scaling-uncertainty","Players dispute whether KoX falls after 50; the available thread supplies anecdotes, not a controlled Hellfire endgame comparison.")],
 "The captured balanced M+ build is explicitly designed for both AoE and single target and confirms the pet/Form package, but does not prove one universal priority.","The July list reports 3,810 DPS and 41 Mythic records, both uncontrolled.",
 (["You want a melee caster with a meaningful pet and transformation.","You enjoy adapting one engine between boss and pack damage."],["You dislike pet state or temporary forms.","You want a clean weapon-only priority."]),
 ("Players praise its mid-level power, mounted flavor and ability to cover both packs and bosses.","Pet, proc and Form layers can feel busy or inconsistent when targets move.","Claims that KoX falls off conflict with positive War and Hellfire anecdotes and lack normalized data."),["No verified level-60 Hellfire rotation video.","Pet contribution and Form cadence need log validation."])

researched("knight-of-xoroth/war", "A two-handed demonic executioner who stacks wounds with Gore and Mutilation, changes Pestilence for the matchup, and cashes six stacks into Skulltaker.", "Build six wound or frenzy stacks, preserve Sever when its heal matters, then choose Skulltaker for immediate pressure or Meatsaw for sustained PvE payoff.",
 ("Apply Gore and the chosen wound tools, reach six stacks, and use Skulltaker; Pestilence and Unleash are adjusted for damage, healing or anti-heal needs.","Skulltaker is the practical burst finisher; Meatsaw gains value when the target lives long enough for the channel or repeated damage.","Bleeds, Burning Blade and cleaving finishers reward stable packs, though the loop remains more direct than Hellfire.","Mounted Combat, chains and snare tools help connect, but current PvP players say many classes can reapply slows or escape.","Hellborn self-healing, Sever and Unleash can be reserved for survival rather than spent automatically.","Pestilence can switch toward healing pressure or anti-heal, and chains create pickup utility."),
 ["Spending stacks on the wrong finisher loses either immediate kill pressure or durable-target value.","Using Sever or Unleash before incoming damage removes important self-healing.","Failing to swap Pestilence for a healer matchup wastes a core utility advantage."],
 ("A straightforward wound builder and heavy finisher appears early.","More Pestilence and survival choices make the priority situational.","At 60 the core remains readable, but matchup-specific spender and healing decisions deepen it."),
 [(["Clear heavy hits","Simple builder-finisher"],["Limited early sustain","Melee reach"]),(["Strong dungeon cleave","More self-healing"],["Stack economy matters","Can be slowed"]),(["Large finisher payoff","Useful mode choices"],["Melee dependent","Builds diverge"]),(["Stable wound ramp","Heavy boss finishers"],["Meatsaw needs uptime","Forced movement delays stacks"]),(["Good cleave","Fast execute cycles"],["Short packs reduce ramp","Target swaps lose wounds"]),(["2-3k finisher anecdotes","Anti-heal option"],["Kiteable","Must reserve heals"])],
 ax("medium","The core damage bar is compact, but Pestilence, healing reserves and alternate finishers add situational buttons.","Wound stacks, bleeds, Pestilence mode and self-heal availability are the main states.","War needs stacks before its named finisher but little ground setup.","The next spender changes with target lifetime, healer presence and incoming damage.","Melee uptime and landing Skulltaker at six stacks are the principal execution checks.","A premature finisher or wasted self-heal costs an entire stack cycle."),
 ["Gore","Mutilation","Skulltaker","Meatsaw","Pestilence","Hellborn"],["reddit:kox-question-2026-07-11"],
 [("six-stack-priority","A level-60 War player describes using Gore and related attacks to reach six stacks, then prioritizing Skulltaker, especially in short PvP fights."),("content-finisher-split","The same player largely reserves Meatsaw for PvE and saves Sever or Unleash for healing in PvP, demonstrating content-specific priorities."),("pestilence-choice","Current advice normally uses the healing Pestilence but swaps to the death or healing-absorb option against healers and Cultists.")],
 "The captured single-target boss build confirms a dedicated durable-target War setup rather than the PvP-only Skulltaker priority.","The July list reports 4,198 DPS and 209 Mythic records; neither controls gear or encounter.",
 (["You want KoX flavor with the clearest conventional melee loop.","You enjoy saving offensive-looking buttons for survival or matchup utility."],["You dislike stack builders or melee uptime.","You want summons and transformation to dominate the rotation."]),
 ("Players praise the dopamine of large Skulltaker crits and report solid PvE and battleground damage.","Chains and mounted tools do not fully solve kiting at 60.","War's positive anecdotes do not settle broader claims that KoX scales poorly after 50."),["No controlled War priority comparison.","Exact finisher breakpoints need logs."])

researched("knight-of-xoroth/defiance", "A block-and-retaliation fire tank whose imps, Abyssal and attackers feed Rage into shields, rebukes and unusually strong self-healing.", "Pull with ranged fire and summons, let blocks and hits generate the engine, then spend Rage on mitigation or repeatable healing while commanding pets and keeping threat spread.",
 ("Establish imp and Abyssal pressure, use block-triggered retaliation for threat, and convert Rage into the heal, shield or mitigation needed for the next damage event.","Single-target threat is reported strong; keep the no-cooldown heal and major cooldowns available rather than over-spending Rage.","Many attackers generate abundant Rage, enabling repeated healing and easy fire threat once the pack is gathered.","Mounted Combat and ranged pet or fire actions give better pickup than a purely stationary block tank.","Players report a persistent HoT, a minute heal, a large shield, damage reduction and a nearby-enemy heal that can refill health on large pulls.","Imps, Abyssal, grips, rebukes and group mitigation make the tank more than a passive shield wall."),
 ["Dumping Rage into damage before a spike removes the resource needed for mitigation or healing.","Pet pathing or premature summons can complicate a pull.","Small-target encounters generate less attacker-fed Rage than mass pulls."],
 ("The block shell appears before its full pet-healing network.","More attackers begin to feel like fuel rather than only danger.","Late Defiance becomes a nuanced priority tank with several viable talent packages."),
 [(["Readable block tank","Ranged pull tools"],["Incomplete sustain","Pet setup"]),(["Strong large-pull healing","Easy AoE threat"],["Resource varies by attackers","More buttons"]),(["Exceptional sustain reports","Flexible talents"],["Above-average priority load","Sparse neutral evidence"]),(["Strong single-target threat","Layered cooldowns"],["Less Rage from one attacker","Cooldown timing"]),(["Attackers fuel healing","Broad AoE"],["Overpulls still punish late shields","Pet placement"]),(["Good mobility","Repeatable sustain"],["Control can disrupt pets","Resource denial matters"])],
 ax("high","Defiance combines threat attacks, pet commands, Rage heals, a HoT, shields, damage reduction, Mounted Combat and control.","Rage, block triggers, pet state, HoT, shield and mitigation timers overlap.","Summons and the defensive layer should be established before the pull peaks.","Rage can become damage, healing or mitigation depending on attacker count and health.","The priority is smooth but requires timely defensive spending and pet-aware positioning.","Over-spending Rage can remove several recovery options at once."),
 ["Rebuke","Hellfire Imp","Abyssal","Soul Furnace","Block","Defiance"],["reddit:kox-defiance-2026-08-04","reddit:tank-weapons-2026-08-01"],
 [("self-sustain-kit","A current level-57 player reports no dungeon or solo deaths and another lists a persistent HoT, instant heal, shield, reduction cooldown and a heal scaling with nearby enemies."),("priority-feel","A recent tank comparison calls Defiance's priority slightly above average rather than extreme, praising smooth imp interactions and meaningful talent options."),("pack-resource-loop","Current accounts say being hit by many enemies supplies enough Rage for repeated healing, explaining why its large-pull sustain can feel stronger than its single-target resource flow.")],
 "The captured top-logs-based Defiance build documents one current tank setup, but its title is not independent proof that it is optimal.","The 1,704 off-role DPS and 70 Mythic records do not measure tank survivability.",
 (["You want active self-healing and pets inside a shield-tank loop.","You enjoy attackers becoming a resource source."],["You want a pet-free or passive tank.","You dislike choosing between threat and survival spenders."]),
 ("Recent players are unusually enthusiastic about its smooth priority, sustain and talent flexibility.","Pet management and a larger active bar remain genuine costs.","The strong August sustain reports conflict with older comparisons calling Defiance inferior, plausibly because of level and familiarity."),["No controlled mitigation logs.","Pet behavior and Rage flow need boss-specific verification."])


deep("pyromancer/flameweaving","A Phoenix healer who plants Roaring Pyres, turns critical healing and Heat into Inferno procs, and can die into a mana-restored Spirit of the Phoenix.","Position persistent fire-healing, use Cleansing Flames and Kindle for efficient coverage, then spend Emberheart and Phoenix tools before damage overwhelms the field.",
 ("Maintain Pyres and efficient direct healing, build Heat through critical effects, and turn Inferno or Emberheart windows into area recovery.","Keep durable-target healing efficient with Kindle, shields and Phoenix support rather than repeatedly replacing stationary effects.","Cleansing Flames and Roaring Pyres cover stacked groups; cone aim and placement make party geometry central.","Two movement abilities correct positioning, but placed Pyres still punish scattering.","Burn Impurities removes magic and disease, Cauterize covers bleeds, and Spirit of the Phoenix supplies a cheat death and mana reset.","Combat resurrection, Innervate, Fear Ward and movement support give exceptional healer utility."),
 ["A misplaced Pyre wastes healing and Heat generation.","Holding Emberheart until allies collapse reduces preventive value.","Using Spirit of the Phoenix for routine mana leaves no cheat death."],
 ("Cleansing Flames makes early healing and soloing direct.","Pyres, Heat and critical interactions add positioning and proc rhythm.","The complete Phoenix package is a mobile, utility-rich area healer."),
 [["Easy cone coverage","Solo damage"],["Pyre network","Movement"],["Deep utility","Recovery"],["Efficient sustain","Cheat death"],["Stacked healing","Area damage"],["Mobility","Dispels"]],[["Cone aim","Mana"],["Ground placement","Procs"],["Many cooldowns","Scattered allies"],["Relocating Pyres","Planning"],["Tank movement","Split party"],["Interrupts","Telegraphed position"]],
 ("Direct heals, cone healing, Pyres, Phoenixes, cleanses and utility create a broad bar.","Heat, Inferno, Pyre locations, Emberheart and Phoenix cooldowns overlap.","Persistent effects must be placed before damage.","Proc state and party geometry decide the next response.","Cone aim and placement are the main mechanical checks.","Bad placement can remove healing from several allies."),"medium",
 ["Roaring Pyre","Phoenix","Emberheart","Cleansing Flames","Spirit of the Phoenix","Burn Impurities"],["reddit:flameweaving-healer-2026-07-06","reddit:easy-specs-roster-2026-08-03"],
 [("utility-package","Players document magic, disease and bleed removal, combat resurrection, Innervate, Fear Ward and two movement abilities."),("cone-healing","Cleansing Flames is described as both a strong dungeon cone heal and useful leveling damage."),("phoenix-recovery","Spirit of the Phoenix reportedly returns the healer with full mana on a ten-minute cooldown.")],"The captured Phoenix Healer build supports the Pyre/Phoenix identity but cannot prove one universal priority.","Healers have no DPS entry; 186 Mythic records show use, not quality.",["You want a visually loud area healer with unusual utility.","You enjoy ground placement and cone geometry."],["You want only target-frame healing.","You dislike stationary effects."],("Players call it accessible, powerful and unusually fun.","Scattered groups undermine placed healing.","Ease describes the floor while full utility creates a higher ceiling."),["No verified healing breakdown.","Pyre cadence needs live testing."])

deep("pyromancer/incineration","A mobile Ignite specialist who layers long burns and detonates their stored value with Explode or Pyroclasm.","Apply Ignite and Infernus, build Heat and periodic coverage, then use Fired Up before consuming stored damage at the profitable moment.",
 ("Maintain burns, use instant Ember spenders under Fired Up, and detonate only after enough periodic value accumulates.","Durable targets reward full DoT coverage and delayed Pyroclasm.","Spread burns and use resets, though players describe AoE as weaker than Draconic.","Ignite and instant spenders permit kiting; detonation setup constrains swaps.","Control and mobile damage support kiting more than durability.","Sustained burns and dispel punishment create pressure."),
 ["Early Pyroclasm consumption sharply reduces payoff.","Target swaps discard ramp.","Fired Up without Embers wastes burst."],
 ("Ignite establishes a readable fire loop.","Fired Up creates mobile burst with growing DoT interaction.","Late talents raise the detonation ceiling and timing demand."),
 [["Mobile Ignite","Clear theme"],["Instant burst","Kiting"],["High ST ceiling","Optimization"],["Ramp","Detonation"],["DoT spread","Pressure"],["Quick burst","Mobility"]],[["Incomplete ramp","Few effects"],["Clunky for some","AoE lags"],["Timing","Bugs"],["Phase changes","Early consume"],["Short packs","AoE"],["Pre-Heat","Dispels"]],
 ("Burns, spenders, Explode, Pyroclasm and Fired Up form the bar.","DoTs, stored damage, Heat, Embers and refunds overlap.","Detonation requires periodic setup.","Refunds and target lifetime alter consumption timing.","Mobility lowers cast friction but not timing demand.","Premature consumption erases a ramp cycle."),"high",
 ["Ignite","Infernus","Combustion","Fired Up","Pyroclasm","Explode"],["reddit:pyromancer-comparison-2026-07-22"],
 [("feel-conflict","Players split between calling Incineration clunky and calling its DoT-heavy burst the ultimate fire-mage experience."),("detonation-ceiling","Discussion identifies detonation timing as major optimization because Pyroclasm value changes with stored damage."),("mobility-and-pvp","A player reports strong 1v1 mobility but awkward pre-Heat through self-healing.")],"The captured Explode ST build documents one detonation setup, not an AoE guide.","The July list reports 5,044 DPS and 65 Mythic records without normalization.",["You enjoy DoT ramp ending in one huge explosion.","You want mobile pressure."],["You want instant swaps or effortless AoE.","You dislike holding payoff."],("Fans praise huge numbers and classic fire fantasy.","Others find the ramp clunky.","Recent fixes make launch verdicts provisional."),["No post-patch guide.","Storage math needs testing."])

deep("pyromancer/draconic","A dragon-aspect caster cycling Earth, Time, Magic and Deathwing effects while cooldown reduction drives repeated elemental spectacle.","Enter the dragon package around 30, build Embers with Dragon's Wrath, then exploit Echo of Nozdormu and instant Pillars.",
 ("Cycle aspects, Dragon's Wrath and spenders while Nozdormu shortens major effects.","Aim cooldown reduction at the best durable-target spell.","Pillars, breath and aspects create the reported AoE jump.","Form and instant spenders improve flow, though some dislike the visual.","Control and movement combine with form bonuses without making a tank.","Aspect effects add varied magical pressure."),
 ["Reducing the wrong cooldown delays the window.","Poor Ember timing loses Pillar resets.","Treating aspects as identical misses their roles."],
 ("Early play lacks the defining form.","Level 30 is the clearest reported power and feel transition.","Late aspects broaden a fast elemental priority."),
 [["Simple start","Fire basics"],["Level-30 spike","AoE"],["Spectacle","Flow"],["Cooldown cycling","Burst"],["Coverage","Resets"],["Mobility","Variety"]],[["Delayed identity","Few aspects"],["Form appearance","New states"],["No build guide","Interactions"],["Wrong reduction","Movement"],["Clutter","Cooldowns"],["Telegraphed form","Fragility"]],
 ("Aspect spells, spenders and Dragon's Wrath create a broad priority.","Embers, form, reduction and resets overlap.","Setup is resource and cooldown alignment.","Resets change the next cast.","Fast instants raise pace.","Misallocated reductions delay connected cooldowns."),"medium",
 ["Dragon's Wrath","Echo of Nozdormu","Pillars of Flame","Dragon Form","Embers","Deathwing"],["reddit:pyromancer-comparison-2026-07-22"],
 [("level30-transition","Multiple players report a major damage and flow jump after switching at 30, especially in AoE."),("form-preference","Players praise the buff but some dislike the forced appearance."),("relative-feel","Comparisons call Draconic smoother while Incineration fans prefer DoTs and ST burst.")],"No Draconic build existed in the snapshot, so no priority is inferred.","The July list reports 3,980 DPS and 77 Mythic records, conflicting with leveling impressions but not covering the same context.",["You want a visible transformation and cooldown tricks.","You enjoy elemental procs."],["You dislike forms.","You want settled documentation."],("Players praise the level-30 jump and AoE.","The form visual and guide gap frustrate.","Performance and leveling anecdotes remain unresolved."),["No captured build.","Aspect priorities need verification."])

def lift(spec_id, one_line, sources, observations, early, mid, late, build, performance, praise, frustration):
    slug=spec_id.replace("/","--"); old=json.loads((R/"overlays"/f"{slug}.json").read_text(encoding="utf-8"))["set"]
    m=old["mechanics"]; ident=old["identity"]["fantasy"]; failures=[x["text"] for x in m["failure_modes"]]
    while len(failures)<3: failures.append("Losing setup before payoff forces another recovery cycle.")
    strengths=[["Core identity","Readable payoff"],["Complete engine","Better coverage"],["Late package","Higher ceiling"],["Durable payoff","Repeatable loop"],["Pack tools","Utility"],["Control","Pressure"]]
    cautions=[["Incomplete kit","Sparse guidance"],["More states","Unlock dependent"],["Unsettled priority","Tracking"],["Movement","Repeated errors"],["Short packs","Position"],["Disruption","Defense"]]
    aoe=f"For multiple targets, {one_line} The current evidence particularly constrains this through: {observations[1][1]}"
    reasons=(f"The active bar follows this loop: {m['core_loop']}",f"Resources and target conditions from {m['single_target']} must be tracked.",f"Multi-target payoff follows this evidence-backed pattern: {aoe}","Target count, movement and pressure alter the next action.",f"Execution depends on {m['movement_and_target_switching']}",failures[0])
    prof=json.loads((R/"profiles"/f"{slug}.json").read_text(encoding="utf-8")); talents=[c["text"].split(":",1)[0] for c in prof["claims"] if c["kind"]=="structural"][:6]
    deep(spec_id,ident,one_line,(m["core_loop"],m["single_target"],aoe,m["movement_and_target_switching"],m["defense_and_control"],m["group_utility"]),failures,(early,mid,late),strengths,cautions,reasons,"medium",talents,sources,observations,build,performance,["You want this exact fantasy and decision loop.","You enjoy a cadence that changes with late talents."],["You want the complete rotation immediately.","You dislike setup loss to movement."],(praise,frustration,"Power anecdotes, popularity and subjective fun remain separate evidence."),["No verified current full-rotation video.","Priority breakpoints remain unverified."])

lift("ranger/archery","Build Advantage with Quick Shot, empower Precision Shot, then choose Deadshot, Brutal Shot or late Incendiary payoff.",["reddit:ranger-status-2026-07-10","reddit:ranger-archery-2026-07-22"],[("level57-breakpoint","Players repeatedly identify Incendiary Shot at 57 as when Archery finally feels complete on long fights."),("leveling-friction","Levelers report weak questing, limited AoE, low mobility and scarce self-healing before that point."),("parse-caveat","High parses were disputed because players reported a permanent critical effect that should be conditional.")],"Early Quick Shot and Precision Shot lack pack coverage.","Quivers and Advantage deepen ST while AoE stays awkward.","Incendiary Shot completes the boss marksman.","The captured PvE build documents a boss setup.","5,682 DPS and 230 records are confounded by a reported crit bug.","Long-fight single-target payoff is praised.","The level-57 wait and weak leveling dominate complaints.")
lift("ranger/brigand","Stack poison, bleeds and Advantage, then cash conditions into Viper's Bite or Skullpiercer while Outmaneuver controls distance.",["reddit:ranger-brigand-2026-07-07","reddit:ranger-status-2026-07-10","reddit:ranger-archery-2026-07-22"],[("early-aoe-gap","Level-33 players report no meaningful AoE before Quill."),("leveling-comparison","Later discussion calls Brigand smoother because Quills and Wild Strikes remove the Ranger dead zone."),("endgame-conflict","Reports range from very low damage to claims Brigand is decent at 60; neither is normalized.")],"Early rogue strikes lack pack tools.","Quill removes the worst AoE gap.","Late condition finishers complete the skirmisher.","The leading build is PvP dagger Brigand, not universal PvE.","2,865 DPS and 35 records are thin.","Rogue fantasy and post-Quill flow are praised.","Condition dependence and disputed damage frustrate.")
lift("sun-cleric/piety","Alternate Sunrise and Sunset through Dawn, cast the matching Holy or Fire mini-rotation, then exploit Rapture and Horusath procs.",["reddit:sun-cleric-questions-2026-07-18","reddit:sun-cleric-complexity-2026-08-01"],[("alternating-schools","Players explain Dawn must alternate Sunrise and Sunset, each requiring the matching school."),("complexity-growth","A Piety player needed several WeakAuras before the better-boomkin loop clicked around 40."),("level60-ramp","A level-60 player praises strong, easy ramp once the complete kit exists.")],"Early alternation precedes proc tools.","Vows turn each stance into a short sequence.","Late Piety is a high-tracking dual-school caster.","The captured build is PvP burst, not settled PvE.","4,458 DPS and 83 records are uncontrolled.","Rapture impact and theme are praised.","Stance, Vow and Dawn tracking reject simplicity.")
lift("sun-cleric/blessings","Keep Bless on the priority ally, use Illumination, Shine and Daybreak for triage, and fulfill Vows for mana and amplification.",["reddit:sun-cleric-questions-2026-07-18","reddit:easy-specs-roster-2026-08-03"],[("basic-priority","Advice names Illumination as large, Shine as fast, Daybreak as instant and Bless as the tank anchor."),("mana-breakpoint","Players report rough early mana and major improvement near 30 from Blessed-target refunds."),("buff-layer","The direct-heal floor is easy while Vows and ally amplification add ceiling.")],"Early healing is simple but mana constrained.","The Blessed refund creates the sustain transition.","Late Blessings adds buffs without losing its conventional core.","The captured dungeon build documents direct healing.","No healer DPS; 130 records show use only.","It is recommended as a clear conventional healer.","Early mana and background buffs surprise.")
lift("sun-cleric/seraphim","Build Intellect-scaled block through Dawnbreak and Gavels, use instant Illumination, and time Solar Invocation for magic danger.",["reddit:tank-weapons-2026-08-01","reddit:sun-cleric-complexity-2026-08-01"],[("prot-paladin-feel","Players compare Seraphim favorably to older protection paladin designs."),("early-squishiness","A Stockades leveler reports fragility; replies note many tanks lack tools before 25 to 30."),("hybrid-value","The kit provides party healing and group magic mitigation alongside block.")],"Early block tools can feel fragile.","Instant healing stabilizes active tanking.","Late Seraphim combines block, healing and magic mitigation.","The captured AoE build documents pack play.","1,775 off-role DPS and 94 records do not rank survival.","The holy shield-tank feel is praised.","Early fragility and thin evidence frustrate.")
lift("sun-cleric/valkyrie","Generate Radiant Marks, align Dawn and Judgment, then spend on Glorious Execution and Sunslam while attacks restore mana.",["reddit:sun-cleric-questions-2026-07-18","reddit:sun-cleric-complexity-2026-08-01"],[("relative-simplicity","Players call Valkyrie simpler than Piety while still combining cooldowns for peak damage."),("aoe-breakpoint","A player identifies roughly 30 and the AoE aura as the pack-clearing breakpoint."),("tracking-tool","A level-36 WeakAura tracks Marks, Dawn, Sunslam and major cooldowns.")],"Early heavy attacks have conflicting reports.","The level-30 aura creates pack momentum.","Late Judgment windows deepen the direct melee core.","The M+ build includes a guide but was labeled old after changes.","3,804 DPS and 187 records are uncontrolled.","Sunslam impact and paladin fantasy are praised.","Rapid patches stale guides and missed Marks hurt.")
lift("tinker/demolition","Layer Napalm and oil, deploy after the tank stacks enemies, then turn Sparked and Ready into instant rockets and explosive rounds.",["reddit:tinker-status-2026-07-09","reddit:tinker-enjoyers-2026-07-12","reddit:tinker-procs-2026-07-20"],[("proc-breakpoint","Players identify Sparked and Ready plus the level-30 Spider Mine package as the instant-rocket transition."),("pack-dependency","Advice says turret placement after gathering is essential; moving packs sharply reduce damage."),("damage-profile","Reports praise AoE and call single target weaker, while aggregate damage is high.")],"Early bombs precede the proc engine.","Spider mines and rockets define mid-level flow.","Factories and drones create a high-load AoE job.","The captured PvE build documents one explosive setup.","5,551 DPS and 141 records are uncontrolled.","Huge dungeon pulls and gadget spectacle are praised.","Single target, dead zone and moving tanks frustrate.")
lift("tinker/invention","Select a gun augment, maintain Nanobots, place and overcharge the correct beacon, then use Zap and Medkit for recovery.",["reddit:tinker-status-2026-07-09","reddit:tinker-enjoyers-2026-07-12","reddit:tinker-invention-2026-07-16"],[("healing-loop","A detailed summary describes Nanobots, instant spells, passive gun damage and beacons as the normal floor."),("beacon-choice","Players swap health, resource and defensive beacons and overcharge them; Replenishment anchors mana."),("leveling-flexibility","Levelers report safe questing through pet, turret, long HoT and Intellect scaling.")],"Early pet and repair tools enable safe soloing.","Radiator, Nanobots and beacons create the dungeon engine near 30.","Late Invention is prepared area support with many devices.","The leading build emphasizes Nanobots and explosive support.","No healer DPS; 116 records indicate use only.","Chill healing, passive damage and utility are praised.","Beacon placement and gadget overload frustrate.")

def talent_ids(profile, keywords):
    found = []
    for keyword in keywords:
        for claim in profile["claims"]:
            if claim["kind"] == "structural" and keyword.lower() in claim["text"].lower():
                if claim["id"] not in found:
                    found.append(claim["id"])
                break
    if len(found) < 3:
        found.extend(c["id"] for c in profile["claims"] if c["kind"] == "structural" and c["id"] not in found)
    return found[:8]


def item(text, claim_ids):
    return {"text": text, "claim_ids": claim_ids}


def scope(levels, content, mode="general"):
    return {"levels": levels, "content": [content], "build_or_mode": [mode]}


def make_overlay(spec_id, d):
    slug = spec_id.replace("/", "--")
    profile = json.loads((R / "profiles" / f"{slug}.json").read_text(encoding="utf-8"))
    old = json.loads((R / "overlays" / f"{slug}.json").read_text(encoding="utf-8"))
    tids = talent_ids(profile, d["evidence"]["talents"])
    observed_ids = [f"observed:{spec_id}:{name}" for name, _ in d["evidence"]["observations"]]
    build_id = f"observed:{spec_id}:build-practice"
    perf_id = f"observed:{spec_id}:performance-context"
    identity_id = f"inference:{spec_id}:playstyle-identity"
    failure_id = f"inference:{spec_id}:failure-cost"
    all_core = tids + observed_ids + [build_id, identity_id]

    contexts = {}
    for name, values in zip(CONTEXTS, d["context"]):
        feel, strengths, cautions = values
        contexts[name] = {
            "feel": feel,
            "strengths": strengths,
            "cautions": cautions,
            "claim_ids": (tids[:4] + observed_ids + [identity_id])[:10],
        }

    complexity = {}
    for axis, axis_data in zip(AXES, d["complexity"]):
        reason, values = axis_data
        complexity[axis] = {}
        for context_name, value in zip(CONTEXTS, values):
            suffix = {
                "leveling_10_29": "The early kit exposes only part of that demand.",
                "leveling_30_49": "The middle talent rows make that interaction regular rather than occasional.",
                "level_50_60": "Late talents complete the interaction and raise its ceiling.",
                "boss": "A durable target makes repeated precision matter.",
                "dungeon_aoe": "Changing pack size and lifetime add another constraint.",
                "pvp": "Enemy disruption makes the same task less predictable.",
            }[context_name]
            complexity[axis][context_name] = {
                "value": value,
                "reason": f"{reason} {suffix}",
                "claim_ids": (tids[:3] + observed_ids + [failure_id])[:8],
            }

    claims = []
    for name, text in d["evidence"]["observations"]:
        claims.append({
            "id": f"observed:{spec_id}:{name}", "kind": "observed", "text": text,
            "source_ids": d["evidence"]["sources"], "scope": scope("leveling_10_60", "community_reported_play"),
            "confidence": "moderate", "conflicts_with": [],
            "notes": "Manually separated from structural talent evidence; player reports remain anecdotal.",
        })
    snap = profile.get("community_build_snapshot", {})
    source_ids = snap.get("source_ids", [])
    if isinstance(source_ids, str):
        source_ids = source_ids.split()
    claims.append({
        "id": build_id, "kind": "observed",
        "text": d["evidence"]["build"], "source_ids": source_ids,
        "scope": scope("level_50_60", "community_build_snapshot", "documented_build"),
        "confidence": "medium", "conflicts_with": [],
        "notes": "The guide documents one current way to play; it is not treated as proof of optimality.",
    })
    perf = profile.get("performance_signal_ids", [])
    claims.append({
        "id": perf_id, "kind": "observed", "text": d["evidence"]["performance"],
        "source_ids": ["reddit:dps-aggregate-2026-07-25", "reddit:class-statistics-2026-08-02"],
        "scope": scope("level_60", "uncontrolled_performance_signals"), "confidence": "low",
        "conflicts_with": [], "notes": "Do not convert this into a tier ranking.",
    })
    claims.extend([
        {"id": identity_id, "kind": "inference", "text": d["identity"][0], "source_ids": [],
         "derived_from_claim_ids": tids[:4] + observed_ids[:2], "scope": scope("all", "all"),
         "confidence": "medium-high", "conflicts_with": [], "notes": "Descriptive playstyle classification, not an official label."},
        {"id": failure_id, "kind": "inference", "text": d["loop"][6][0], "source_ids": [],
         "derived_from_claim_ids": tids[:5] + observed_ids, "scope": scope("all", "all"),
         "confidence": "medium", "conflicts_with": [], "notes": "Direction is supported; exact throughput cost is not measured."},
    ])

    family = old["set"]["identity"]
    return {
        "baseline": f"{slug}.json",
        "set": {
            "identity": {
                "fantasy": d["identity"][0], "one_line": d["identity"][1],
                "primary_family": family["primary_family"], "also_fits": family["also_fits"],
                "playstyle_tags": family["playstyle_tags"], "claim_ids": tids[:4] + observed_ids[:2] + [identity_id],
            },
            "mechanics": {
                "core_loop": d["loop"][0], "single_target": d["loop"][1], "aoe": d["loop"][2],
                "movement_and_target_switching": d["loop"][3], "defense_and_control": d["loop"][4],
                "group_utility": d["loop"][5],
                "failure_modes": [item(text, [failure_id] + tids[:3]) for text in d["loop"][6]],
                "claim_ids": all_core,
            },
            "contexts": contexts, "complexity": complexity,
            "fit": {
                "enjoy_if": [item(x, [identity_id] + tids[:2]) for x in d["fit"][0]],
                "avoid_if": [item(x, [failure_id] + observed_ids[:1]) for x in d["fit"][1]],
            },
            "sentiment": {
                "praise": [{"theme": d["sentiment"][0], "claim_ids": observed_ids + [build_id]}],
                "frustrations": [{"theme": d["sentiment"][1], "claim_ids": observed_ids + [failure_id]}],
                "contested": [{"theme": d["sentiment"][2], "claim_ids": observed_ids + [perf_id]}],
            },
            "performance_signal_ids": perf or [perf_id],
            "coverage": {
                "mechanical": "manual_talent_and_build_interpretation", "community": "manual_recent_source_review",
                "performance": "limited_uncontrolled", "video": "searched_none_verified",
                "overall_confidence": "medium", "gaps": d["gaps"],
            },
        },
        "level_band_updates": {
            "leveling_10_19": {"observed_loop": d["context"][0][0], "observed_changes": d["context"][0][2]},
            "leveling_20_29": {"observed_loop": d["context"][0][0], "observed_changes": d["context"][0][2]},
            "leveling_30_39": {"observed_loop": d["context"][1][0], "observed_changes": d["context"][1][2]},
            "leveling_40_49": {"observed_loop": d["context"][1][0], "observed_changes": d["context"][1][2]},
            "level_50_60": {"observed_loop": d["context"][2][0], "observed_changes": d["context"][2][2]},
        },
        "append_claims": claims,
    }


def main():
    expected = 18
    if len(SPECS) != expected:
        raise SystemExit(f"Expected {expected} manually curated specs, found {len(SPECS)}")
    for spec_id, data in SPECS.items():
        slug = spec_id.replace("/", "--")
        out = R / "overlays" / f"{slug}.json"
        out.write_text(json.dumps(make_overlay(spec_id, data), indent=2) + "\n", encoding="utf-8")
        print(spec_id)


if __name__ == "__main__":
    main()
