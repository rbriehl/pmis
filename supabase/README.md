# Supabase setup for the Discovery module

This wires the Discovery tables (Org Chart, AI/Automation Initiatives, Pain Points)
to a shared Supabase database with **per-student workspaces** and **magic-link login**.

- Each signed-in user owns their own rows; students can't see or edit each other's work.
- Instructors (see step 4) can **read** every student's rows.
- Until the app is switched over (feature flag), production keeps using local storage —
  so these steps are safe to do ahead of time and change nothing live.

## 1. Create the project
1. Go to https://supabase.com → **New project** (free tier is fine).
2. Pick a name (e.g. `hdsr-pmis`) and a strong database password. Choose a region close to your class.
3. Wait for it to finish provisioning (~2 min).

## 2. Create the schema
1. In the project, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`migrations/0001_discovery_schema.sql`](./migrations/0001_discovery_schema.sql).
3. Click **Run**. You should see "Success. No rows returned." It creates the three
   tables, the `profiles`/`instructor_emails` tables, triggers, and Row-Level Security.

## 3. Turn on magic-link email login
1. **Authentication → Providers → Email**: make sure **Email** is enabled and
   **"Confirm email"** is on (magic link). No password needed.
2. **Authentication → URL Configuration**: add your app URLs to **Redirect URLs**:
   - `https://e-unify.ai/pmis`
   - `https://e-unify.ai/pmis/**`
   - (and your Vercel preview URL while testing)

## 4. Mark the instructors
So instructors can view all student work, add their emails to the allowlist —
anyone who signs up with an allowlisted email is flagged as an instructor automatically.

In **SQL Editor**, run (replace with real emails):

```sql
insert into public.instructor_emails (email) values
  ('instructor1@example.com'),
  ('instructor2@example.com')
on conflict (email) do nothing;
```

Already signed up before being allowlisted? Flip the flag directly:

```sql
update public.profiles set is_instructor = true
where lower(email) = lower('instructor1@example.com');
```

## 5. Give the app its keys
From **Settings → API**, copy:
- **Project URL** → env var `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → env var `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Use the **anon public** key only. **Never** put the `service_role` key in the app —
> it bypasses Row-Level Security.

Set both in **Vercel → Project → Settings → Environment Variables** (Preview first for
testing, then Production). The app also reads a flag `NEXT_PUBLIC_DISCOVERY_BACKEND`
(`local` = current behavior, `supabase` = shared DB) — we flip that to `supabase`
only after verifying on a preview deployment.

## Safety notes
- The schema is versioned here in git — don't hand-edit tables in the dashboard;
  add a new `NNNN_*.sql` migration instead so changes stay reviewable.
- Constraints reject bad data (required fields, and the dropdown values are enforced
  by `CHECK`), so a typo can't be saved.
