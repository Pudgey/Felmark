---
name: "secure"
description: "Run a security audit on the specified target. Use when the user explicitly invokes $secure or asks for this workflow in Felmark."
---

# Secure — Security Audit

Run a security audit on the specified target.

Follow `conductor/skills/secure/PROTOCOL.md`.

## Checks
- Authentication and session management
- Authorization and access control
- Input validation and sanitization (XSS, injection)
- API security (CORS, rate limiting, exposed keys)
- Client-side data exposure (localStorage, cookies)
- Dependency vulnerabilities
- Network security (HTTPS, CSP headers)

Report findings with severity and remediation steps.

