# Supabase Migration Plan

Migrate from localStorage → Supabase. Forge is the only layer that touches persistence, so the migration is surgical: swap `StateUpdater` internals, nothing else changes.

---

## Current state

```
React useState → forge services → StateUpdater → setState + localStorage
```

## Target state

```
React useState → forge services → StateUpdater → Supabase + local cache
```

The dashboard, editor, sidebar, terminal, and all components remain untouched. Only `StateUpdater` implementation changes.

---

## Database schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, from Supabase Auth |
| email | text | unique |
| name | text | |
| avatar_url | text | nullable |
| created_at | timestamptz | default now() |

### `workspaces`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK (uid) |
| user_id | uuid | FK → users.id |
| client | text | client name |
| avatar | text | single char |
| avatar_bg | text | hex color |
| contact | text | nullable |
| rate | text | nullable |
| personal | boolean | default false |
| position | int | for ordering |
| created_at | timestamptz | |

### `projects`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK (uid) |
| workspace_id | text | FK → workspaces.id |
| name | text | |
| status | text | active/review/paused/completed/overdue |
| due | date | nullable |
| amount | text | display string like "$2,400" |
| progress | int | 0-100 |
| pinned | boolean | default false |
| position | int | for ordering within workspace |
| created_at | timestamptz | |

### `blocks`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK (uid) |
| project_id | text | FK → projects.id |
| type | text | BlockType |
| content | text | HTML content |
| checked | boolean | for todos |
| data | jsonb | graphData, deliverableData, etc. — all optional block data |
| position | int | order within document |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `archived_projects`
| Column | Type | Notes |
|--------|------|-------|
| id | serial | PK |
| user_id | uuid | FK → users.id |
| project | jsonb | full Project snapshot |
| workspace_id | text | original workspace |
| workspace_name | text | for display |
| archived_at | timestamptz | |

### `comments`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK |
| project_id | text | FK → projects.id |
| block_id | text | nullable — which block it's on |
| user_id | uuid | FK → users.id |
| content | text | |
| created_at | timestamptz | |

### `activities`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK |
| project_id | text | FK → projects.id |
| block_id | text | nullable |
| type | text | edit/comment/status/etc. |
| user_id | uuid | FK → users.id |
| data | jsonb | activity-specific data |
| created_at | timestamptz | |

### `shares`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK (share link ID) |
| project_id | text | FK → projects.id |
| user_id | uuid | FK → users.id |
| blocks | jsonb | snapshot of blocks at share time |
| pin | text | nullable, hashed |
| expires_at | timestamptz | nullable |
| views | int | default 0 |
| last_viewed_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Row-level security (RLS)

Every table gets RLS enabled. Policy pattern:

```sql
-- Users can only read/write their own data
CREATE POLICY "Users own their workspaces"
  ON workspaces FOR ALL
  USING (user_id = auth.uid());

-- Same for projects (via workspace ownership)
CREATE POLICY "Users own their projects"
  ON projects FOR ALL
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE user_id = auth.uid()
  ));

-- Blocks via project ownership
CREATE POLICY "Users own their blocks"
  ON blocks FOR ALL
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN workspaces w ON p.workspace_id = w.id
    WHERE w.user_id = auth.uid()
  ));

-- Shares: owner can manage, anyone with link can read
CREATE POLICY "Owner manages shares"
  ON shares FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Public can read shares"
  ON shares FOR SELECT
  USING (true);  -- PIN check happens in API route
```

---

## Migration steps

### Phase 1: Auth (1 session)
1. `npm install @supabase/supabase-js`
2. Create Supabase project, get URL + anon key
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
4. Create `src/lib/supabase.ts` — client singleton
5. Build login/signup page (email + password, or magic link)
6. Protect dashboard route — redirect to login if no session

### Phase 2: Schema (1 session)
1. Run SQL migrations in Supabase dashboard (create tables above)
2. Enable RLS on all tables
3. Add policies

### Phase 3: Forge adapter (1-2 sessions)
1. Create `src/forge/adapters/supabase.ts` — implements `StateUpdater` against Supabase
2. Keep `src/forge/adapters/local.ts` — current localStorage implementation (fallback)
3. Update `page.tsx` to use Supabase adapter when authenticated, local when not
4. Pattern:

```typescript
// src/forge/adapters/supabase.ts
export function createSupabaseUpdater(supabase: SupabaseClient, userId: string): StateUpdater {
  return {
    getState: async () => {
      // Query all tables, assemble ForgeState
    },
    setWorkspaces: async (fn) => {
      // Read current → apply fn → upsert changed rows
    },
    // ... same for all other setters
  };
}
```

5. The key insight: forge services don't change. Only the `StateUpdater` implementation swaps.

### Phase 4: Real-time (1 session)
1. Subscribe to Supabase Realtime on `blocks` and `comments` tables
2. When another user changes a block → update local state
3. This enables: client portal live comments, team collaboration, multi-device sync

### Phase 5: Migrate share system (1 session)
1. Move in-memory share `Map` → `shares` table
2. Update `/api/share` routes to query Supabase
3. Share page (`/share/[id]`) reads from database instead of in-memory

### Phase 6: Migrate Wire + AI (1 session)
1. Move Wire cache from localStorage → server-side cache or Supabase
2. AI generation can optionally save generated blocks directly to a project

---

## Data migration (existing localStorage users)

When a user first authenticates:
1. Check localStorage for existing data
2. If found, bulk-insert into Supabase under their new user ID
3. Clear localStorage
4. Show "Your data has been synced to the cloud" toast

This is a one-time migration. After that, localStorage is only used as an offline cache.

---

## What doesn't change

- All React components
- All block renderers
- All CSS
- Editor.tsx
- Sidebar.tsx
- Rail.tsx
- All forge service functions
- All API routes (except share, which moves to Supabase)
- Terminal commands
- AI generation

The migration is invisible to the UI. Same app, real database.

---

## Cost estimate

Supabase free tier:
- 500 MB database
- 50,000 monthly active users
- 2 GB file storage
- Unlimited API requests

For MVP/beta: $0/month. For production: Pro plan at $25/month covers everything until ~10,000 users.
