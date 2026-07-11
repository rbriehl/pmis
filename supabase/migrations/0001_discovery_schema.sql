-- Discovery module — Supabase schema, constraints, and Row-Level Security.
--
-- Model: per-student workspaces. Each authenticated user owns their own rows
-- (owner_id = auth.uid()). Instructors (profiles.is_instructor = true) may READ
-- every student's rows but may only edit their own. Sample rows are seeded per
-- user by the app on first login (is_sample = true).
--
-- Run this once in the Supabase SQL editor (see supabase/README.md).
-- Safe to re-run: guarded with IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY.

-- ---------------------------------------------------------------- profiles
-- One row per auth user; flags instructors. Auto-created on signup by trigger.
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  is_instructor boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Optional allowlist: emails added here become instructors automatically on signup.
create table if not exists public.instructor_emails (
  email text primary key
);

-- Create a profile automatically when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_instructor)
  values (
    new.id,
    new.email,
    exists (select 1 from public.instructor_emails e where lower(e.email) = lower(new.email))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: is the current user an instructor?
create or replace function public.is_instructor()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (select p.is_instructor from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- Keep updated_at fresh on any row change.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ------------------------------------------------------------- org_units
create table if not exists public.org_units (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users (id) on delete cascade,
  unit_function      text not null,
  role_title         text not null,
  headcount          integer check (headcount is null or headcount >= 0),
  reports_to         text,
  transaction_volume text check (transaction_volume in ('Low','Medium','High')),
  stakeholder_type   text check (stakeholder_type in ('Decision-maker','Doer','Sponsor')),
  primary_processes  text,
  notes              text,
  is_sample          boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ----------------------------------------------------------- initiatives
create table if not exists public.initiatives (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users (id) on delete cascade,
  name            text not null,
  owning_function text,
  sponsor         text,
  use_case        text not null,
  tool            text,
  build_or_buy    text check (build_or_buy in ('Build','Buy')),
  status          text check (status in ('Production','Pilot','Abandoned','Shadow IT')),
  adoption        text check (adoption in ('Low','Medium','High')),
  value_delivered text,
  annual_spend    text,
  is_sample       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ----------------------------------------------------------- pain_points
create table if not exists public.pain_points (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users (id) on delete cascade,
  description        text not null,
  affected_function  text,
  who_affected       text,
  frequency          text check (frequency in ('Daily','Weekly','Monthly','Quarterly')),
  impact             text check (impact in ('Low','Medium','High')),
  automatability     text check (automatability in ('Low','Medium','High')),
  current_workaround text,
  root_cause         text,
  is_sample          boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Indexes for the common per-owner lookups.
create index if not exists org_units_owner_idx   on public.org_units (owner_id);
create index if not exists initiatives_owner_idx on public.initiatives (owner_id);
create index if not exists pain_points_owner_idx on public.pain_points (owner_id);

-- updated_at triggers
drop trigger if exists touch_org_units   on public.org_units;
drop trigger if exists touch_initiatives on public.initiatives;
drop trigger if exists touch_pain_points on public.pain_points;
create trigger touch_org_units   before update on public.org_units   for each row execute function public.touch_updated_at();
create trigger touch_initiatives before update on public.initiatives for each row execute function public.touch_updated_at();
create trigger touch_pain_points before update on public.pain_points for each row execute function public.touch_updated_at();

-- ---------------------------------------------------- Row-Level Security
alter table public.profiles    enable row level security;
alter table public.org_units   enable row level security;
alter table public.initiatives enable row level security;
alter table public.pain_points enable row level security;

-- instructor_emails: RLS on with NO policies -> unreachable via anon/authenticated
-- keys, so a student can't read the allowlist or self-promote to instructor. The
-- signup trigger (security definer) and the SQL editor (service_role) still access it.
alter table public.instructor_emails enable row level security;

-- profiles: a user sees their own profile; instructors see all.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_instructor());

-- For each discovery table: owner has full CRUD on own rows; instructors read all.
do $$
declare t text;
begin
  foreach t in array array['org_units','initiatives','pain_points']
  loop
    execute format('drop policy if exists %I on public.%I;', t || '_select', t);
    execute format('drop policy if exists %I on public.%I;', t || '_insert', t);
    execute format('drop policy if exists %I on public.%I;', t || '_update', t);
    execute format('drop policy if exists %I on public.%I;', t || '_delete', t);

    execute format($f$create policy %I on public.%I
      for select using (owner_id = auth.uid() or public.is_instructor());$f$, t || '_select', t);
    execute format($f$create policy %I on public.%I
      for insert with check (owner_id = auth.uid());$f$, t || '_insert', t);
    execute format($f$create policy %I on public.%I
      for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());$f$, t || '_update', t);
    execute format($f$create policy %I on public.%I
      for delete using (owner_id = auth.uid());$f$, t || '_delete', t);
  end loop;
end $$;
