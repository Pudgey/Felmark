# Deep Debug

## Mission

Find the **actual root cause** of a complex issue and propose the **smallest safe fix**
with **evidence**, **validation**, and a **regression guard**.

This skill is for problems where basic debugging has stalled or where the visible
failure is likely downstream from the real cause.

---

## Use this skill when

Invoke Deep Debug for issues such as:

- crashes, watchdog terminations, ANRs, or unexplained exits
- hangs, freezes, jank, dropped frames, or long main-thread stalls
- memory leaks, memory growth, or lifecycle/ownership issues
- decoding, parsing, serialization, or schema mismatch failures
- recursive handlers, render loops, re-entrancy, retry storms, or feedback cycles
- race conditions, deadlocks, lock contention, or ordering bugs
- stale cache, storage corruption, service worker issues, or persistence bugs
- release-only, optimized, minified, obfuscated, or environment-specific failures
- cross-layer bugs involving API, model decode, state, rendering, and background work
- hybrid issues involving web content inside native shells such as `WKWebView` or Android `WebView`

---

## Do not use this skill for

Do **not** invoke this skill for:

- trivial syntax errors
- obvious one-line fixes already proven by the failing line
- simple linting, formatting, or build issues with known causes
- routine refactors with no failure evidence

---

## Required mindset

Follow these rules throughout the investigation:

1. **Do not guess.** Every conclusion must be tied to evidence.
2. **Do not patch blindly.** A plausible fix is not enough.
3. **Separate symptom from cause.** The visible failure is often downstream.
4. **Preserve evidence.** Keep raw logs, payloads, traces, stack frames, device info, and timestamps.
5. **Change one variable at a time.**
6. **Prefer native platform diagnostics before custom logging.**
7. **Prove the fix.** The issue is not resolved until the evidence matches the hypothesis.
8. **Leave a guardrail behind.** Add a test, assertion, monitor, or benchmark.

---

## Inputs to collect first

Gather as much of the following as possible before debugging:

- platform: `web`, `iOS`, `Android`, or `hybrid`
- symptom: exact failure description
- build context: debug/release, app version, browser version, OS version, device model
- runtime surface: native screen, browser page, PWA, `WKWebView`, Android `WebView`, background task
- reproducibility: always, intermittent, rare
- reproduction steps
- first known bad version or recent changes
- logs, traces, crash reports, screenshots, screen recordings, raw payloads
- whether the issue is local-only, staging-only, or production-only
- suspected subsystem boundaries

If some of this is missing, proceed with best-effort assumptions and label them clearly.

---

## Debugging workflow

### Step 1: Frame the issue

Start by writing a short issue brief:

- what is failing
- where it appears
- when it appears
- how often it reproduces
- what changed recently
- what successful resolution would look like

### Step 2: Build a reproduction matrix

Test whether the issue varies by:

- debug vs release
- device, OS, browser, or app version
- simulator/emulator vs physical device
- cold start vs warm start
- fresh install vs existing storage/cache
- account, user role, feature flag, or data set
- network quality or offline state
- foreground vs background resume
- timing, retries, or concurrency load

Use the matrix to narrow scope before changing code.

### Step 3: Classify the primary failure type

Pick the dominant failure mode:

- crash
- hang or freeze
- jank or performance degradation
- UI or state logic bug
- network or data bug
- memory leak or memory growth
- decoding or parsing issue
- storage or cache corruption
- race condition or concurrency bug
- release-only or transformed-build bug
- hybrid bridge or embedded-web issue

### Step 4: Define the observability plan

Choose the minimum evidence needed to prove or reject hypotheses:

- breakpoints, exception breakpoints, symbolic breakpoints
- watchpoints or variable tracking
- structured logs with timestamps and correlation IDs
- network inspection or captured failing requests
- raw response payloads before parsing
- memory graphs, heap snapshots, allocation timelines
- performance traces or flame charts
- crash reports, ANR traces, hang reports
- state transition logs
- before/after comparisons of passing and failing runs

### Step 5: Run the hypothesis loop

For each hypothesis:

1. state the hypothesis clearly
2. define what evidence should appear if it is true
3. collect the evidence
4. mark it as:
   - supported
   - weakened
   - disproven
5. keep only the strongest surviving hypotheses

Do not keep adding fixes to compensate for uncertainty.

### Step 6: Isolate the boundary

Use one or more of these strategies:

- reduce to a minimal repro
- replay captured payloads instead of live data
- disable subsystems one at a time
- binary search recent changes
- compare passing and failing traces side by side
- swap async flow to a controlled sync flow only for diagnosis
- compare fresh storage/cache to dirty storage/cache
- force a single code path via feature flags or test fixtures

The goal is to identify the narrowest boundary where correct behavior becomes incorrect.

### Step 7: Prove the root cause

A root cause is acceptable only if at least one of these is true:

- a minimal failing input reproduces the bug reliably
- a trace, report, or sanitizer identifies the bad path directly
- a causal loop or race timeline is demonstrated with evidence
- a minimal code/config change removes the bug for the reason predicted

### Step 8: Fix minimally

Apply the smallest safe change that addresses the actual cause.

Examples:

- guard an invalid state transition
- stop a re-entrant callback loop
- make a side effect idempotent
- move blocking work off the main/UI thread
- correct parsing assumptions or schema handling
- fix thread ownership or lifecycle ordering
- invalidate or migrate stale persisted data safely
- repair symbolication/source maps/build transforms
- remove lock ordering hazards

### Step 9: Validate broadly

Re-run:

- the original reproduction
- nearby flows that share the same subsystem
- slow network or offline conditions
- app background/foreground transitions
- low-memory or low-battery conditions where relevant
- release-like builds if the issue was release-only
- real-device verification if simulator/emulator behavior was misleading

### Step 10: Leave a durable safeguard

Add one or more of:

- automated test
- regression fixture
- schema validation
- assertion or invariant check
- telemetry event or crash marker
- performance benchmark
- alert or dashboard monitor

---

## Special playbooks

## A. Decoding / parsing / serialization

Use this playbook when data may be malformed, versioned, stale, or transformed incorrectly.

### Investigate

- capture the raw failing payload before any transformation
- compare a passing payload against a failing payload
- inspect every boundary:
  - bytes
  - text decoding
  - JSON or binary parsing
  - DTO/model decode
  - domain model mapping
  - state update
  - UI rendering
- check:
  - nullability
  - unknown enum values
  - date parsing
  - timezone assumptions
  - numeric precision
  - optional nesting
  - field renames
  - schema drift
  - compression/base64 assumptions
  - character encoding issues

### Fix patterns

- validate early at the first trustworthy boundary
- support unknown/forward-compatible values safely
- preserve raw input in diagnostics
- add a fixture for the failing payload
- avoid silently coercing invalid data unless explicitly intended

---

## B. Loop / re-entrancy / event storm

Use this playbook when the system appears to trigger itself repeatedly.

### Investigate

- add correlation IDs to each event/state transition
- count handler invocations
- log edges, not just values:
  - what triggered what
  - what state changed
  - which effect fired next
- inspect:
  - observers
  - subscriptions
  - state listeners
  - render side effects
  - retry logic
  - lifecycle hooks
  - navigation callbacks
  - bridge message handlers

Look specifically for cycles such as:

`state change -> effect -> state change -> effect`

### Fix patterns

- add idempotence
- break re-entrant paths
- debounce or coalesce repeated triggers
- move side effects out of render or observation paths
- gate retries with backoff and terminal conditions
- establish ownership for who is allowed to mutate the state

---

## C. Concurrency / race / deadlock

Use this playbook when the bug is timing-sensitive or intermittent.

### Investigate

- identify all threads, queues, executors, coroutines, tasks, or actors involved
- inspect all related stacks, not just the crashing thread
- check lock ordering and shared mutable state
- look for main-thread blocking waits
- stress the flow under slower or noisier timing
- use platform sanitizers and system traces early

### Fix patterns

- reduce or eliminate shared mutable state
- establish thread confinement
- move blocking work off the main/UI thread
- enforce consistent lock ordering
- remove wait cycles and nested waits
- make state changes atomic where required

---

## D. Release-only / optimized / transformed build issues

Use this playbook when debug works but production fails.

### Investigate

- verify source maps, symbols, and symbolication
- compare debug and release build flags
- inspect minification, obfuscation, tree-shaking, dead-code elimination, and inlining behavior
- inspect build-time environment injection and feature flags
- compare initialization order in debug vs release
- ensure the observed code matches the shipped artifact

### Fix patterns

- restore mapping/symbol visibility
- preserve required reflection or runtime metadata
- prevent unsafe optimization of required code paths
- align environment configuration across builds
- add release-like CI validation

---

## Platform-specific guidance

## Web

Use platform-native browser tooling first.

### Focus areas

- source maps and deployed code accuracy
- request/response correctness
- timing, long tasks, and rendering
- service worker behavior
- cache, cookies, local storage, session storage, IndexedDB
- memory growth after repeated flows
- mobile-specific reproduction on real devices

### Common deep-debug web patterns

- stale service worker or cached asset causing mixed versions
- race between hydration, fetch completion, and state initialization
- infinite render or effect loop
- event listener duplication after remounts
- source-map mismatch hiding the real failing line
- memory leaks from detached DOM nodes, closures, or retained listeners

### Expected moves

- verify the exact shipped bundle and source maps
- compare clean profile vs existing profile with storage
- inspect Application/Storage state when behavior looks stale
- use performance traces for jank instead of relying only on console output
- remote-debug on actual mobile devices when the issue is mobile-specific

---

## iOS

Favor Xcode-native diagnostics and Apple system reports.

### Focus areas

- crash reports and symbolication
- main-thread misuse
- memory ownership/lifecycle issues
- thread safety and race detection
- UI responsiveness and hangs
- field diagnostics from shipped builds

### Common deep-debug iOS patterns

- main-thread blocking during startup or navigation
- lifecycle mismatch causing retained controllers or leaked views
- decode failure due to schema drift or unexpected server enum values
- re-entrant state updates across delegates, notifications, and UI bindings
- release-only behavior due to timing differences or optimization

### Expected moves

- inspect crash and hang reports before changing code
- use Thread Sanitizer, Address Sanitizer, Main Thread Checker, and related diagnostics where appropriate
- use Instruments for CPU, memory, and responsiveness investigations
- use Memory Graph when leaked objects are suspected
- compare local debugging results with Organizer or field diagnostics when only production reproduces the issue

---

## Android

Favor Android Studio tooling and Android platform traces.

### Focus areas

- Logcat and exception context
- ANRs and UI thread blocking
- runtime view hierarchy and recomposition behavior
- network timeline and request inspection
- rendering performance and system traces
- production crash clustering and vitals

### Common deep-debug Android patterns

- main-thread disk or network work leading to ANRs
- lifecycle or configuration-change bugs
- stale persisted state causing inconsistent initialization
- excessive recomposition or invalidation loops
- thread contention or coroutine scope misuse
- WebView/native bridge issues that only appear on-device

### Expected moves

- inspect Logcat and stack traces before adding new logs
- treat ANRs as timing and main-thread problems first
- use bug reports, ANR traces, and system traces when exceptions are missing
- inspect runtime layout or Compose state behavior when UI is involved
- compare crash clusters or vitals variants instead of assuming one symptom equals one cause

---

## Hybrid app guidance

For `WKWebView`, Android `WebView`, or hybrid bridge issues:

- treat native and web logs as one timeline
- correlate bridge messages with a shared request or event ID
- verify which side initiated the loop or failure
- confirm whether the issue exists in standalone web and standalone native flows
- inspect WebView version, cache state, injected scripts, bridge message order, and app lifecycle transitions

---

## Evidence threshold

Before declaring the issue understood, ensure at least one of the following exists:

- a reliable minimal reproduction
- a captured failing payload or state snapshot
- a trace or report showing the bad path
- a tight comparison between passing and failing runs
- a minimal fix whose effect matches the predicted causal model

If none of these exist, do **not** claim the root cause is proven.

---

## Anti-patterns to avoid

Do not:

- guess the cause from a single stack frame
- rely on console output alone for timing bugs
- add many speculative fixes at once
- dismiss intermittent issues because they are hard to reproduce
- assume debug and release are equivalent
- assume simulator/emulator behavior matches real devices
- close the issue without a regression guard

---

## Output format

Every Deep Debug run must end with this structure:

### Root cause
One sentence describing the proven cause.

### Evidence
List the strongest observations that support it.

### Fix
Describe the smallest safe code or configuration change.

### Why this fix works
Explain the causal chain.

### Validation
State what was rerun and what passed.

### Regression guard
State the added test, assertion, monitor, or benchmark.

### Residual risk
State what remains uncertain or unproven.

---

## Invocation template

Use this template when invoking the skill:

**Invoke Deep Debug**

- Platform: `[web | iOS | Android | hybrid]`
- Surface: `[browser page | PWA | WKWebView | Android WebView | native screen | API boundary | background task]`
- Symptom: `[exact symptom]`
- Build context: `[debug/release, version, OS, device, browser if relevant]`
- Reproduction: `[steps and frequency]`
- Evidence: `[logs, crash reports, traces, screenshots, payloads]`
- Recent changes: `[commits, flags, SDK upgrades, backend changes]`
- Goal: `find and prove the root cause, then propose the smallest safe fix and a regression guard`

---

## Success criteria

This skill is successful only when it delivers:

- a root cause backed by evidence
- a minimally sufficient fix
- a clear explanation of why the fix works
- validation against the original failure and adjacent scenarios
- a durable regression safeguard
