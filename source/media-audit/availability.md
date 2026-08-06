# CoA card-media availability audit

Captured 2026-08-06. This is an availability inventory, not permission to imply that old media documents the current rotation.

## Complete reusable coverage

- **70 of 70 specs:** custom specialization talent icons are present in `snapshot/coa-current-data.json`. The tested delivery path is `https://coabuildhub.com/skill-icons/<icon>.jpg`.
- **21 of 21 classes, covering 70 of 70 specs:** Ascension published an official class-highlight video. These are class-fantasy references and can supply a thumbnail and “watch class highlight” link. They are older than the current patch and must not be labeled current spec guides.
- **4 of 70 specs:** a real spec-specific guide was verified from the captured Build Hub descriptions. These can replace the class-level fallback when their date and context are shown.
- **66 of 70 specs:** no verified spec-specific video in the captured Build Hub top-guide set. They retain the official class highlight and icon treatment, with no empty or invented spec-video link.

## Official class-highlight inventory

| Class | Video ID |
|---|---|
| Barbarian | `5VYpy1JEp4U` |
| Bloodmage | `4mEVTHzHkqY` |
| Chronomancer | `yvmzxxVsHZg` |
| Cultist | `g0NkjXMVSPA` |
| Felsworn | `7mcE4UtAxNs` |
| Guardian | `BkL3c6SoMPw` |
| Knight of Xoroth | `54rKyrsNqWM` |
| Necromancer | `rL775c4_X2s` |
| Primalist | `ukNiDWKWEtI` |
| Pyromancer | `eED_TiScjM8` |
| Ranger | `-YGIMTGsHD8` |
| Reaper | `rdCXdk3GgjI` |
| Runemaster | `mONxwNBrn-g` |
| Starcaller | `3YfxzGfnAKM` |
| Stormbringer | `W5C0-U3RvW8` |
| Sun Cleric | `LQ5kUApKG8w` |
| Templar | `zPLCEhx0tiI` |
| Tinker | `DzPERJxC7MQ` |
| Venomancer | `RSOJihG0_aQ` |
| Witch Doctor | `XnVFqU1XY6o` |
| Witch Hunter | `4opoBFzyvsU` |

## Verified captured spec-guide inventory

| Spec | Video | Creator | Context |
|---|---|---|---|
| Cultist / Heretic | `-rMi2co9cUE` | Zreula | Melee-healer guide |
| Templar / Crusader | `jraMdaePtLw` | RSTAR | General Crusader guide |
| Sun Cleric / Valkyrie | `IpDr4hiSI44`, `7TixqGYGt7A` | Hello Heroes Guild; Leonardo Calegário | Strength melee DPS and PvE/M+ |
| Reaper / Harvest | `AZBb9IE3WRo`, `mdpzCNOsgiw` | NxS mvm | PvP guide and gameplay commentary |

The Flameweaving build's YouTube link is Cascada's “Pyromania,” not a gameplay guide, and is intentionally excluded.

## Provenance rules for implementation

1. Label official class videos as older class-fantasy highlights, not current rotations.
2. Show creator, title, content context, and verification date for spec guides.
3. Use remote thumbnails and icons initially so provenance remains obvious; local caching requires a separate asset-policy decision.
4. Never fill a missing spec-video slot with an unrelated class video without changing the label.
