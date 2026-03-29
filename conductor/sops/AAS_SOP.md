# AAS — Three-Layer Independent Quality Review

> **Version**: 1.0
> **Created**: 2026-03-24

## Purpose

Three independent review layers that catch different failure modes. Each layer has a distinct perspective and cannot be influenced by the others.

## The Three Layers

### Layer 1: Advocate (Observe)
**Perspective**: Fresh eyes. What does the code actually do?

- Read the changed files without preconceptions
- List every observable behavior (not what it's supposed to do — what it does)
- Note anything surprising, inconsistent, or unclear
- Do NOT reference the task description or requirements yet

**Output**: Factual observation list.

### Layer 2: Adjudicate (Test Against Standards)
**Perspective**: The rulebook. Does the code meet standards?

- Compare observations against project standards and SOPs
- Check: naming conventions, error handling, memory safety, async patterns
- Check: test coverage expectations, documentation requirements
- Flag any deviation from established patterns

**Output**: Standards compliance report (pass/fail per rule).

### Layer 3: Suitability (Verify Truth, Hunt Hallucination)
**Perspective**: The skeptic. Is this actually correct?

- Verify that the code does what was requested (not more, not less)
- Hunt for hallucinated logic (code that looks right but doesn't work)
- Check edge cases: null, empty, error, concurrent, boundary
- Verify file paths, import paths, function signatures actually exist
- This is the final gate before human review

**Output**: Truth verification + final recommendation (ship / fix / block).

## When to Use

- Before any PR or merge
- After completing a mission (before marking Complete)
- When reviewing AI-generated code you didn't write
- When something "feels off" but you can't pinpoint why
