# Platform Inspector Strategy — Chrome Extension → Web App

> **Created**: 2026-03-28
> **Status**: Research Complete — Awaiting Decision
> **Origin**: MV3Phoenix Playbook → Salesforce Inspector model applied to other platforms

---

## The Model

Salesforce Inspector proved the playbook:
- Free Chrome extension → 400K users, 4.82 stars
- Power-user data inspector for a platform with a clunky admin UI
- Now rebuilt as "Salesforce Inspector Reloaded" (50K+ users)
- Serves admins/devs earning $100K-$150K/yr who need to inspect records, run queries, export data, view metadata

**The formula**: Clunky admin UI + wealthy users + good APIs + no dominant extension = opportunity.

---

## Platform Rankings

| Rank | Platform | Gap Score | Ecosystem | User Salary | Platform Spend | Existing Tools |
|------|----------|-----------|-----------|-------------|----------------|----------------|
| 1 | **NetSuite** | 9.5/10 | 43K orgs, 219 countries | $74-149K | $50-500K+/yr | 45+ fragmented, no unified inspector |
| 2 | **HubSpot** | 8.5/10 | 289K customers, 200K+ certified | $60-120K | $600-43K/yr | Nearly zero dev/admin extensions |
| 3 | **Zendesk** | 7.0/10 | 185K businesses | $60-100K | $20-100K/yr | Basic utils only, no inspector |
| 4 | **ServiceNow** | 6.5/10 | 7.7K (80%+ Fortune 500) | $108-178K | $100K-1M+/yr | SN Utils dominates (100K users, free) |
| 5 | **SAP** | 5.5/10 | 440K+ customers | $80-160K | $100K-2M+/yr | Module-specific, extremely fragmented |
| 6 | **Jira/Atlassian** | 5.0/10 | 300K companies | $70-130K | $10-100K/yr | Decent existing tools |
| 7 | **Shopify** | 4.0/10 | 4.8M merchants | Varies | $30-2K/yr | Modern UI, decent tools exist |

---

## Deep Dive: Top 3 Platforms

### 1. NetSuite Inspector (HIGHEST OPPORTUNITY)

**Why the gap exists:**
- UI universally hated — "horrible, unintuitive piece of crap" (Reddit)
- 45+ Chrome extensions exist but all single-purpose and fragmented
- NetSuite Field Explorer has 40K users doing just ONE thing (showing field names)
- Oracle doesn't invest in developer tooling
- Niche enough that indie hackers overlook it, large enough (43K enterprise orgs) to build a real business

**Admin/Developer pain points:**
- Slow, clunky interface requiring deep configuration for simple tasks
- Performance degrades as data grows
- Reporting is inconsistent with clunky filter behavior
- Over-customization creates maintenance nightmares
- No good way to inspect records, run queries, or browse metadata quickly

**What the extension does:**
- Record inspector (view/edit any record's fields inline)
- SuiteQL query runner (SQL console for NetSuite)
- Script debugger & performance profiler
- Saved search export & bulk data tools
- Metadata browser (custom fields, workflows, scripts)

**Web app expansion:**
- Query history & saved queries (synced across team)
- Org health dashboard (unused fields, broken scripts, performance bottlenecks)
- Change audit logs & deployment tracking
- Team features: shared queries, org comparison tools

**Monetization:** $10-15/mo individual → $20-30/user/mo teams

**API feasibility:** Excellent. REST APIs, SuiteScript, SuiteQL for querying, SuiteCloud platform.

---

### 2. HubSpot Inspector (WIDEST GAP — RECOMMENDED START)

**Why the gap exists:**
- 289K paying customers, 200K+ certified professionals
- Almost ZERO dev/admin Chrome extensions exist
- Only one basic "shortcut" tool (Simple HubSpot Developer Extension)
- HubSpot's developer platform is brand new (2025-2026) — tooling hasn't caught up
- Admin pain is real and growing: workflows 3-5x slower after redesigns

**Admin/Developer pain points:**
- Workflows interface keeps getting worse with each redesign
- Campaign reporting is "weird," formula fields are "infuriating"
- Dashboard designer is "clunky"
- Aggressive caching makes testing changes frustrating
- Admin settings are hard to find
- API authentication errors are confusing

**What the extension does:**
- CRM record inspector (view all properties, associations, timeline in sidebar)
- Quick data queries (find records by any field without navigating clunky UI)
- API debugger (test endpoints, see responses, debug webhook payloads)
- Property/object schema browser
- Bulk export filtered data

**Web app expansion:**
- Data quality dashboard (duplicate detection, empty fields, stale deals)
- Workflow debugger & performance analytics
- Custom reporting beyond HubSpot's built-in dashboards
- Integration health monitoring
- Team collaboration features

**Monetization:** $10-20/mo individual → $15-25/user/mo teams

**API feasibility:** Excellent. Comprehensive REST APIs for CRM, contacts, deals, properties, associations. Modern, well-documented.

**Why start here:**
1. 289K customers vs 43K — bigger top of funnel
2. Zero competition — literally the first real admin/dev tool
3. HubSpot's developer platform is new — riding ecosystem growth
4. API is cleaner and more modern than NetSuite's
5. 200K certified professionals = built-in distribution (community, partner directory, certification forums)

---

### 3. ServiceNow Premium Inspector (UPGRADE PLAY)

**Why there's still room:**
- SN Utils exists (100K users, 4.9 stars) but is free, built by one dev
- Sourdough charges $5/mo and has buyers — proves willingness to pay
- 7,700 customers but 80%+ of Fortune 500 — deep-pocketed users
- ServiceNow devs earn $108K-$178K/yr

**Where SN Utils falls short:**
- No visual record relationship mapping
- Basic debugging (no AI-assisted analysis)
- No bulk data operations
- No performance profiling
- No team features

**What the premium extension does:**
- Visual record relationship mapping
- Advanced GlideRecord debugging with AI-assisted script analysis
- Bulk data operations
- Performance profiling per instance
- Team dashboards & shared configurations

**Monetization:** $15-25/user/mo — enterprise pricing

---

## Go-To-Market Strategy

### Phase 1: HubSpot Inspector (Months 1-3)
- Build MV3-native Chrome extension with core inspector features
- Free tier: record inspector, basic queries, schema browser
- Launch in HubSpot Community, ProductHunt, r/hubspot
- Target the 200K+ certified professionals through HubSpot partner channels

### Phase 2: Web App + Premium (Months 3-6)
- Add web dashboard: data quality, workflow analytics, team features
- Premium tier: $10-20/mo individual, $15-25/user/mo team
- Apply for HubSpot App Marketplace listing
- Content marketing: "HubSpot admin tips" blog targeting pain point keywords

### Phase 3: Multi-Platform Expansion (Months 6-12)
- Port the architecture to NetSuite (higher ARPU, enterprise contracts)
- Same extension → web app model, different platform adapters
- Position as a multi-platform admin tools company
- Consider ServiceNow premium play as third platform

### Revenue Targets
| Milestone | Users | Revenue |
|-----------|-------|---------|
| Month 3 | 5K free, 200 paid | $2-4K MRR |
| Month 6 | 20K free, 800 paid | $8-16K MRR |
| Month 12 (multi-platform) | 50K free, 2K paid | $25-50K MRR |

---

## Competitive Landscape

### HubSpot
| Tool | Type | Users | Gap |
|------|------|-------|-----|
| Simple HubSpot Developer Extension | Chrome ext | Small | Basic shortcuts only |
| HubSpot Developer Extension (Torreras) | GitHub | Small | Not in Chrome Web Store |
| **Nothing else exists** | — | — | Wide open |

### NetSuite
| Tool | Type | Users | Gap |
|------|------|-------|-----|
| NetSuite Field Explorer | Chrome ext | 40K | Only shows field names/IDs |
| NetSuite Utils | Chrome ext | Small | SuiteQL runner + basics, limited |
| SuiteScript Explorer | Chrome ext | Small | Script search only |
| **No unified inspector** | — | — | 45+ fragmented tools |

### ServiceNow
| Tool | Type | Users | Gap |
|------|------|-------|-----|
| SN Utils | Chrome ext | 100K | Free, dominant, but basic |
| Sourdough | Chrome ext | Small | $5/mo, monitoring focus |
| Next Experience Dev Tools | Official | — | UI Builder debugging only |

---

## Technical Considerations

**Shared architecture across platforms:**
- MV3 Chrome extension with Side Panel UI
- Content scripts inject inspector overlay on platform pages
- Platform-specific API adapters (HubSpot REST, NetSuite SuiteQL, ServiceNow GlideRecord)
- Local storage for recent queries/inspections
- Cloud sync for saved queries, team features, history

**MV3 compatibility:** All features are fully rebuildable under MV3. No webRequest dependency. Uses:
- Side Panel API for persistent inspector UI
- Content scripts for page overlay
- Service workers for API calls
- chrome.storage for local data
- Cloud backend for sync/team features

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Platform builds native tooling | Low-Med | High | Multi-platform diversification; platforms historically underinvest in admin tools |
| API access restricted | Low | High | Stay within documented API usage; apply for official marketplace listing |
| SN Utils adds paid tier | Medium | Med (ServiceNow only) | Differentiate on premium features (AI, visualization, team) |
| Low conversion free → paid | Medium | Medium | Nail the free experience first; premium = team + sync + analytics |
| Competing inspector launches | Medium | Medium | Speed to market + community building = moat |

---

## Decision Point

**Recommended path:** Start with HubSpot Inspector — widest gap, largest ecosystem, zero competition, cleanest APIs, natural web app expansion.

**Alternative path:** Start with NetSuite Inspector — smaller ecosystem but higher ARPU, deeper enterprise contracts, bigger individual deal sizes.

**Either way:** The extension is the acquisition channel. The web app is the business.

---

## Sources

- [HubSpot: 289K customers, $3.13B revenue](https://backlinko.com/hubspot-users)
- [NetSuite: 43K customers, 219 countries](https://www.capterra.com/p/135757/NetSuite/reviews/)
- [ServiceNow: 7.7K customers, 80%+ Fortune 500](https://cyntexa.com/blog/servicenow-statistics/)
- [SN Utils: 100K users, 4.9 stars](https://chrome-stats.com/d/jgaodbdddndbaijmcljdbglhpdhnjobg)
- [Sourdough: $5/mo ServiceNow tool](https://chromewebstore.google.com/detail/sourdough-servicenow-moni/bbalpiojmggfbkjlnldlkmmailaakpbh)
- [NetSuite Field Explorer: 40K users](https://chromewebstore.google.com/detail/netsuite-field-explorer/cekalaapeajnlhphgdpmngmollojdfnd)
- [Top 45 NetSuite Chrome Extensions](https://erppeers.com/netsuite-chrome-extensions/)
- [HubSpot Workflows complaints](https://community.hubspot.com/t5/Lists-Lead-Scoring-Workflows/Why-does-the-workflows-interface-keep-getting-worse/m-p/858271)
- [NetSuite Reddit reviews](https://www.reviewsreddit.com/netsuite)
- [Zendesk: 185K businesses](https://sqmagazine.co.uk/zendesk-statistics/)
- [Salesforce Inspector Reloaded: 50K+ users](https://chromewebstore.google.com/detail/salesforce-inspector-relo/hpijlohoihegkfehhibggnkbjhoemldh)
- [Kaspersky: 87M malicious extension downloads](https://usa.kaspersky.com/blog/dangerous-chrome-extensions-87-million/28561/)
- [Chrome Goldmine: expired extensions dataset](https://chromegoldmine.com/)
