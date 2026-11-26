# Dice Chamber 2.0.0
An offline-capable, mobile-first polyhedral dice roller for tabletop roleplaying.
 
[Open Dice Chamber](https://nicaffus1.github.io/dnd-companion/)

## Getting started
- Choose dice and a modifier, then Roll dice. Advantage and disadvantage require one positive d20; critical doubles positive dice, not the modifier.
- Saved rolls supports independent attack and typed damage rows, favorites, folders, duplication, reordering and optional linked critical damage. Results are independent, not summed across damage types.
- Tap an individual die result to reroll it using secure randomness. Use Roll history to review, copy or repeat previous rolls.
- Settings includes appearance profiles, sound, vibration, animation, JSON backup and reviewed merge/replace restore.
- Open the app online once before going offline. Install using your browser menu, or Safari Share → Add to Home Screen on iOS.

## Data and limitations
Data remains in browser storage; download regular JSON backups. Clearing site data or using another browser/device can lose access to local records. Merge keeps current settings and existing duplicate IDs; replace restores the backup. Backup format remains version 1 for compatibility. History is limited to 500 entries. Rolls support up to 50 dice (25 base dice for critical); the visual tray displays at most 30 physical dice, while numeric results include all dice. Physical animation is a presentation of securely selected results, not the source of randomness. Glass and engraving are visual simulations. Vibration and install prompts depend on browser support; iOS generally does not support web vibration. Device-specific graphics performance and physical-device compatibility are not guaranteed.

## Development
Node 22: npm install, npm test, npm run dev, npm run build. CI runs regression tests and Chromium offline checks plus a reduced-motion browser smoke test in Chromium, Firefox and WebKit. These are automated browser engines, not physical device certification. Designated development branches promote only after successful tests and a fast-forward/current-tip check, then dispatch production verification on main. GitHub Pages must use GitHub Actions as its source.

Legacy 1.0.0 remains on the legacy-1.0 and release-1.0 branches; see [legacy release notes](docs/RELEASE_1.md).
