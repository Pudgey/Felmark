---
name: secure
description: Full security audit checklist for the INDEP Flutter app -- auth, Firestore, storage, client data, input validation, network, local storage, dependencies.
---

# Secure -- Security Audit Checklist

Comprehensive security audit for the INDEP Flutter app. Run all 8 steps, log findings with severity, produce a report.

References:
- `dev/conductor/standards/AUTH_HARDENING.md` (auth gate, session lifecycle, account management)
- `indep_app/firestore.rules` / `indep_app/storage.rules`
- `indep_app/CLAUDE.md` (architecture overview)

Severity Levels:
- **P1**: Exploitable now. Data leakage, auth bypass, credential exposure. Fix before any release.
- **P2**: Exploitable under conditions. Session issues, missing validation, broad rules. Fix before beta.
- **P3**: Defense-in-depth. Best practices, future-proofing. Fix before production.

---

## Step 1: Auth Security Audit

Cross-reference: `dev/conductor/standards/AUTH_HARDENING.md` Phase 1-4.

### 1.1: Auth Gate Integrity (P1)

**Scan**:
```bash
grep -n 'isLoggedIn\|isConfigured\|cityId\|hasFavorite\|isLoading' lib/routing/app_router.dart
grep -rn 'context\.go\|context\.push' lib/screens/ lib/widgets/
grep -rn 'FirebaseAuth\.instance\.currentUser' lib/screens/ lib/widgets/
grep -n "path: '" lib/routing/app_router.dart lib/routing/modules/*.dart
```

- [ ] 5-tier redirect order: Loading > Unauth > Unconfigured > No City > No Favorites > Set Up
- [ ] No route allows unauthenticated access except `/auth/*`
- [ ] No screen checks `FirebaseAuth.instance.currentUser` directly (all auth via gate)
- [ ] `GoRouter.errorBuilder` defined (no default red screen)
- [ ] Tier 0 loading has a timeout (AUTH_HARDENING.md 1.1)

### 1.2: Session Management (P1)

**Scan**:
```bash
grep -rn 'signOut\|cleanLogout' lib/
grep -rn 'SharedPreferences.*clear\|prefs\.remove\|prefs\.clear' lib/
grep -rn 'deleteToken\|unsubscribeFromTopic' lib/
grep -rn 'ref\.keepAlive\|keepAlive()' lib/providers/
```

- [ ] Logout clears FCM token from Firestore and unsubscribes city topics BEFORE `signOut()`
- [ ] SharedPreferences cleared (or user keys removed) on logout
- [ ] `keepAlive` providers with user data are invalidated on logout
- [ ] Active Firestore streams cancelled on logout
- [ ] No `context.go('/auth/login')` after signOut -- auth gate handles routing
- [ ] Sign out > sign in as different user: zero stale data

### 1.3: Re-Auth & Double-Tap (P2)

**Scan**:
```bash
grep -rn 'deleteUser\|deleteAccount\|updatePassword\|reauthenticate' lib/
grep -rn '_isSubmitting\|_isLoading\|_inProgress' lib/screens/auth/
grep -rn 'signInWithEmail\|createAccount\|signInWithGoogle\|signInWithApple' lib/screens/auth/
```

- [ ] Account deletion requires re-authentication
- [ ] Password/email change requires re-authentication
- [ ] All auth screens have `_isSubmitting` guard with `try/finally` and `mounted` check
- [ ] Google/Apple sign-in buttons have submission guards

---

## Step 2: Firestore Rules Audit

### 2.1: Open Collections (P1)

**Scan**:
```bash
cat firestore.rules
grep -n 'if true\|if request.auth != null' firestore.rules
grep -rn "\.collection('" lib/repositories/ lib/data/
grep -n 'match /' firestore.rules
```

- [ ] Every app collection has a `match` block in rules -- no gaps
- [ ] No `allow read, write: if true`
- [ ] User-private subcollections (`favorites`, `notifications`) require `request.auth.uid == userId`
- [ ] `conversations` + `messages` restrict to participants only
- [ ] No orphan rules for deleted collections

### 2.2: Query-Rule Alignment (P2)

**Scan**:
```bash
grep -rn '\.where(\|\.orderBy(' lib/repositories/
cat firestore.indexes.json
grep -n 'request.resource.data\|hasAll\|hasOnly' firestore.rules
```

- [ ] Every `.where()` query is permitted by rules for that collection
- [ ] Compound queries have matching indexes in `firestore.indexes.json`
- [ ] `list` permission granted where app uses collection `.get()` (not just doc get)
- [ ] User profile writes validate `request.auth.uid == userId`
- [ ] Review writes prevent self-review; booking writes validate both UIDs

---

## Step 3: Storage Rules Audit

**Scan**:
```bash
cat storage.rules
grep -rn 'putFile\|putData\|uploadFile\|FirebaseStorage' lib/
grep -n 'contentType\|size\|request.resource' storage.rules
grep -rn 'allowedExtensions\|maxFileSize\|image_picker\|file_picker' lib/
```

- [ ] Uploads scoped to user paths (`users/{userId}/`) -- users write only their own path (P1)
- [ ] No wildcard write rules on root (P1)
- [ ] Rules restrict `contentType` to image MIME types (P2)
- [ ] Rules enforce max file size (e.g. `< 10MB`) (P2)
- [ ] Client-side validation mirrors server-side restrictions (P3)

---

## Step 4: Client-Side Data Protection

### 4.1: No Secrets in Code (P1)

**Scan**:
```bash
grep -rn 'apiKey\|api_key\|secret\|password\|token' lib/ --include='*.dart' | grep -v 'test\|mock\|//\|\.g\.dart'
grep -rn 'https://.*token=\|https://.*key=' lib/
cat .gitignore | grep -i 'env\|secret\|key\|credential\|google-services\|GoogleService'
```

- [ ] No API keys outside `lib/firebase_options.dart`
- [ ] No hardcoded passwords or secrets in `lib/`
- [ ] `.gitignore` covers `.env`, `*.keystore`, `*.jks`
- [ ] No third-party API keys committed (Stripe, Algolia, Maps)

### 4.2: No Sensitive Logs in Release (P1)

**Scan**:
```bash
grep -rn 'print(\|debugPrint(' lib/ --include='*.dart' | grep -v '\.g\.dart'
grep -rn 'kDebugMode' lib/ --include='*.dart'
grep -rn "print.*email\|print.*password\|print.*token\|print.*uid" lib/ --include='*.dart'
```

- [ ] All `print()`/`debugPrint()` wrapped in `if (kDebugMode)` or `assert()`
- [ ] No PII (email, phone, name), tokens, or UIDs logged outside debug mode
- [ ] `SeedFirestore` seeding gated behind debug mode

---

## Step 5: Input Validation Audit

### 5.1: User Input Sanitization (P2)

**Scan**:
```bash
grep -rn 'TextField\|TextFormField' lib/screens/ lib/widgets/ --include='*.dart' | grep -v '\.g\.dart\|//'
grep -rn 'validator:\|InputValidator' lib/screens/ lib/widgets/
grep -rn 'controller\.text' lib/screens/ lib/widgets/ | grep -v '//'
```

- [ ] All TextFields have `validator` or `onChanged` validation
- [ ] Display name, listing title/description, review text, message, bio all have max length
- [ ] No raw HTML rendering of user input
- [ ] Search queries trimmed before Firestore

### 5.2: Path & Deep Link Injection (P2)

**Scan**:
```bash
grep -rn '\.doc(\$\|\.collection(\$' lib/repositories/
grep -rn 'getInitialLink\|onLink\|dynamicLinks\|deepLink' lib/
grep -rn 'onMessageOpenedApp\|getInitialMessage' lib/
```

- [ ] No user input used directly in Firestore doc/collection paths without sanitization
- [ ] Document IDs from user input validated (no `/`, `.`, `__`)
- [ ] Notification payloads validated before navigation
- [ ] Deep link paths validated against registered routes

---

## Step 6: Network Security

**Scan**:
```bash
grep -rn "http://" lib/ --include='*.dart' | grep -v 'localhost\|127\.0\.0\.1\|10\.0\.2\.2\|https://'
grep -i 'cleartextTraffic\|network.security' android/app/src/main/AndroidManifest.xml
grep -A5 'NSAppTransportSecurity' ios/Runner/Info.plist
```

- [ ] No hardcoded `http://` URLs in production code (P1)
- [ ] Android: `usesCleartextTraffic` is NOT `true` in release (P1)
- [ ] iOS: `NSAllowsArbitraryLoads` is `false` or absent (P1)
- [ ] Certificate pinning evaluation documented for production roadmap (P3)

---

## Step 7: Local Storage Security

**Scan**:
```bash
grep -rn 'SharedPreferences\|getString\|setString\|getBool\|setBool' lib/ --include='*.dart'
grep -rn "prefs\.set.*token\|prefs\.set.*password\|prefs\.set.*email" lib/
grep -rn 'CachedNetworkImage\|DefaultCacheManager\|getTemporaryDirectory' lib/
```

- [ ] No auth tokens in SharedPreferences (Firebase SDK manages tokens) (P2)
- [ ] No passwords or PII in SharedPreferences (P2)
- [ ] Acceptable: favorite IDs, UI prefs, cached city ID, onboarding flags
- [ ] SharedPreferences cleared on logout (cross-ref Step 1.2)
- [ ] Image cache cleared on logout or uses user-scoped keys (P3)

---

## Step 8: Dependency Audit

**Scan**:
```bash
cd /Users/donteennis/Indep/indep_app && flutter pub outdated
```

- [ ] Firebase packages (`firebase_auth`, `cloud_firestore`, `firebase_messaging`, `firebase_storage`) on recent stable (P3)
- [ ] No packages with known CVEs (check https://osv.dev) (P2)
- [ ] `flutter_riverpod` and `go_router` on stable versions (P3)
- [ ] No unused dependencies in `pubspec.yaml` (attack surface reduction) (P3)
- [ ] Dev deps in `dev_dependencies`, not `dependencies` (P3)

---

## Output Format

After all steps, save a report to `dev/audits/SECURITY_AUDIT_YYYY-MM-DD.md`:

```markdown
# Security Audit Report -- INDEP App
**Date**: YYYY-MM-DD  |  **Scope**: Steps 1-8

## Summary
| Severity | Count | Open | Fixed |
|----------|-------|------|-------|
| P1       | N     | N    | N     |
| P2       | N     | N    | N     |
| P3       | N     | N    | N     |

## Findings

### SEC-001: [Title]
- **Severity**: P1/P2/P3
- **Step**: 1.2 (Session Management)
- **File**: `lib/path/to/file.dart` line N
- **Description**: What is wrong
- **Evidence**: Code snippet or grep output
- **Fix**: What to do
- **Status**: Open / Fixed
```

---

## When to Run

- Before any public release (alpha, beta, production)
- After adding a new auth provider, Firestore collection, or file upload feature
- After adding a new third-party dependency
- Quarterly minimum

## Anti-Patterns

| Anti-Pattern | Do This Instead |
|-------------|----------------|
| Skip Firestore rules ("works in emulator") | Always test with deployed rules |
| Store tokens in SharedPreferences | Let Firebase SDK manage tokens |
| Log full documents in production | Log only doc IDs, use kDebugMode |
| `allow read, write: if true` temporarily | Write proper rules from the start |
| Trust client-side validation alone | Always validate in Firestore rules too |
| Skip re-auth for account deletion | Always require fresh credentials |
| Ignore `permission-denied` errors | Catch and trigger re-auth flow |
