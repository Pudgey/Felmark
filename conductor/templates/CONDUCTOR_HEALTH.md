# Conductor Health Check

> Run silently at session start. Only speak up if issues found.

## Checks

### 1. Handoff exists
- [ ] `HANDOFF.md` exists and was written within the last 7 days
- Action if missing: Note that no handoff context is available

### 2. Thoughts freshness
- [ ] No `ACTIVE` entries in `THOUGHTS.md` older than 4 hours
- Action if stale: Resolve or clear stale entries

### 3. Active context freshness
- [ ] `ACTIVE_CONTEXT.md` was updated within the last 14 days
- Action if stale: Regenerate from current project state

### 4. Standards review dates
- [ ] All standards have `Last Reviewed` and `Next Review` dates
- [ ] No standards past their review date
- Action if overdue: Notify user

### 5. Mission status
- [ ] No missions in "Active" status with no recent progress (>30 days)
- Action if stale: Flag for user review

### 6. Journal gaps
- [ ] At least one journal entry per week of active development
- Action if gap: Note the gap, don't block work

### 7. Skills sync
- [ ] Skills in conductor match skills in AI config directories
- Action if mismatch: Run sync script

### 8. Development Brief freshness
- [ ] `DEVELOPMENT_BRIEF.md` reflects current mission statuses
- Action if stale: Update milestone/mission statuses

### 9. Sprint board (if using agent-team)
- [ ] No claimed tasks older than 2 hours without DONE file
- Action if stale: Release stale claims

## Post-Creation Integrity Check

Run after creating any new standard, skill, or mission:

- [ ] New doc has proper frontmatter (version, created, review dates)
- [ ] New doc is referenced in DEVELOPMENT_BRIEF.md (if mission)
- [ ] New skill is synced to AI config directories
- [ ] No broken cross-references to the new doc
