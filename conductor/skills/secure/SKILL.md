---
name: secure
description: Security audit checklist for Felmark's web app and extension: auth, authorization, secrets, inputs, storage, payments, and extension boundaries.
---

# Secure -- Security Audit Checklist

Run a focused security review on the requested surface. Felmark is a web app plus a Chrome extension shell, so the audit must cover browser concerns, backend trust boundaries, and extension permissions.

References:
- `AGENTS.md`
- `CLAUDE.md`
- Relevant code under `dashboard/src/`, `extension/`, and any Supabase or Stripe integration files

Severity levels:
- `P1`: exploitable now, blocks release
- `P2`: risky under realistic conditions, fix before public rollout
- `P3`: defense-in-depth or future hardening

---

## Step 1: Auth and Session Boundaries

Check:

- Auth-gated routes cannot render protected data before session confirmation
- Sign-out clears client state that should not survive user changes
- Privileged actions require a live authenticated user
- Session refresh failures degrade cleanly instead of exposing partial UI

Useful scans:

```bash
rg -n "supabase|auth|session|signOut|signIn|getUser" dashboard/src extension
rg -n "middleware|redirect|protected" dashboard/src
```

---

## Step 2: Authorization and Data Access

Check:

- Client code does not assume access control is enforced only in the UI
- Server actions, API routes, and Supabase access paths enforce ownership rules
- Shared resources and workspace data are filtered by the current user or team context
- No admin-only path is exposed by a hidden button alone

Inspect route handlers, server actions, and data helpers that create, read, update, or delete workspace data.

---

## Step 3: Secrets and Configuration

Check:

- No secret keys in committed code
- Public env vars contain only values intended for the browser
- Stripe, Supabase, and webhook secrets stay server-side
- Demo credentials or placeholder tokens are not shipped

Useful scans:

```bash
rg -n "secret|token|api[_-]?key|service_role|sk_live|sk_test" . --glob '!node_modules'
rg -n "NEXT_PUBLIC_|process\\.env|import\\.meta\\.env" dashboard/src extension
```

---

## Step 4: Input Handling and Injection Risk

Check:

- User-generated content is rendered safely
- Dangerous HTML injection paths are either absent or sanitized deliberately
- Search params, route params, and editor content are validated before server-side use
- File names, URLs, and share tokens are not trusted blindly

Focus on:

- Rich text or block rendering
- Search and filtering
- Share links
- Form submissions
- Any markdown or HTML conversion

---

## Step 5: Persistence and Storage

Check:

- Local storage does not hold secrets or impersonation-critical state
- Cached workspace data cannot leak across users
- Offline or queued writes are labeled and retried safely
- Exported files or shared artifacts do not include unintended private fields

Useful scans:

```bash
rg -n "localStorage|sessionStorage|indexedDB|chrome\\.storage" dashboard/src extension
rg -n "export|download|share|public" dashboard/src
```

---

## Step 6: Payments, Webhooks, and External Services

Check:

- Stripe flows create and verify state server-side
- Webhooks validate signatures
- Billing state is not trusted from browser input alone
- External callbacks fail closed, not open

If the target does not touch payments, say so and skip this section.

---

## Step 7: Extension Surface

For `extension/`, check:

- Permissions are minimal
- Remote URLs are intentional and fixed
- Message passing validates sender and payload shape
- No business logic or sensitive state lives only in the extension shell

The extension should remain a thin transport surface, not an alternate application core.

---

## Step 8: Logging and Error Exposure

Check:

- No sensitive data in client logs
- Raw backend errors are not shown directly to users
- Debug-only instrumentation is not effectively permanent

Useful scan:

```bash
rg -n "console\\.(log|error|warn)|throw new Error|TODO" dashboard/src extension
```

---

## Output Format

For each finding:

- ID
- Severity
- Surface
- Risk
- Evidence
- Recommended fix

Save substantial reports under `conductor/` if the audit is large enough to matter beyond the current turn.

---

## Done Criteria

- Every material trust boundary was checked
- Findings are prioritized by exploitability, not aesthetics
- Recommended fixes are concrete and scoped
- No stale mobile or Flutter-specific guidance remains
