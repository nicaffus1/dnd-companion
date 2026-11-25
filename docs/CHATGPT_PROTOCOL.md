# ChatGPT protocol
Copy selected roll results, character state and campaign context. Versioned JSON update envelope: schemaVersion, campaignId, characterId, baseRevision, changes and unique import ID. Validate IDs, permissions, references, duplicates and state; preview changes and apply approved changes transactionally with undo. No direct API needed.

## Phase 10 world context
The read-only world export uses format dnd-companion-world, schemaVersion 1, campaign, baseRevision, records, relationships and monsterReferences. IDs are stable and campaign-scoped. Monster references contain ID, name and source, not full imported content. This is not an update envelope; reviewed transactional import is Phase 11.
