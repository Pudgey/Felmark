# Journal: Codex Skill Packaging

**Date**: 2026-03-30
**Agent**: codex-main
**Tags**: codex, skills, conductor, tooling

## Context
Converted the repo-local `.codex/skills` wrappers into real folder-based Codex skills so they can be discovered as actual skills instead of plain markdown notes.

## Discovery
- The repo already had 24 `.codex/skills/*.md` wrappers, but that shape is not the real Codex skill format.
- Discoverable Codex skills need `skill-name/SKILL.md` with YAML frontmatter.
- UI-facing surfacing is driven by `agents/openai.yaml`, and the default prompt needs to explicitly mention `$skill-name`.

## What Worked
- Reusing the existing wrapper content avoided rewriting the skills themselves.
- Generating `agents/openai.yaml` for each skill produced consistent metadata quickly.
- Validation against the system `quick_validate.py` script confirmed all 24 packaged skills were structurally valid.

## What Didn't Work
- The repo's `.codex/skills` path was not writable in the sandbox and required escalated filesystem access for the conversion.

## Future Guidance
- If a skill exists only as `.codex/skills/<name>.md`, it may be usable as documentation but not necessarily discoverable as a real Codex skill.
- Add future repo-local skills as `.codex/skills/<name>/SKILL.md` plus `agents/openai.yaml`, not as flat markdown files.
- If the skill list still does not refresh immediately in the UI, reload the workspace or start a fresh Codex session so it re-reads the packaged skill folders.
