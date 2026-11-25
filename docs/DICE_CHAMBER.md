# Dice Chamber rebuild — Phase 1
Separate branch; original v1.0 preserved in legacy-1.0. New entry point uses numbered geometry and a compact rolling screen. Secure randomness remains from existing engine. Geometry tests cover face counts and target orientation. Percentile uses two d10s. Scripted animation only; physics, individual inspection, actual distinct animation styles, saved dice collections, damage grouping, presets/history, sounds and vibration are future phases. Preview does not access or mutate campaign database. Production remains main until explicitly approved. No personal data committed.

## Overhead revision
90-degree orthographic camera; charcoal/gold default with new preference key; felt-style CSS tray; metallic environment lighting and shadows; compact plus/minus selectors. Fixed-step gravity and approximate circular contact impulses with wall bounce and friction, not full polyhedral rigid-body physics. The secure engine still decides results, with orientation corrected during settling. No Phase 2 changes.

## Revision 3
Minimal borderless default, blue resin and bold white face numbers, empty initial tray. Cannon-es convex rigid bodies with gravity, friction and contact solver. A precomputed physical trajectory is rendered with a hull-preserving rotational symmetry chosen before playback to match the independently secure result. No end-of-roll orientation snap. The d4 uses the existing face-normal convention; verify real-world vertex readability on device. Up to 30 physical dice rendered, all numerical results retained. Phase 2 paused. Visual/mobile acceptance pending.

## Phase 2A — saved rolls
Authorized after Clarity approval. Preserve renderer and appearance settings. Independent roll rows with typed damage, flat values, per-row modes, folders, favorites, edit/duplicate/delete, local persistence and three copy formats; no grand total across attacks. Starter Brown Bear example and mixed damage. History, per-die reroll, automatic critical linking, backup and other later work remain separate. Prior unresolved physical appearance/accuracy issues are not claimed fixed.
