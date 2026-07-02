# Porting PMIS to the Internal Work Environment

This guide takes the PMIS app from this zip to a running internal deployment
with no public-cloud or public-internet dependencies. It is written so that a
person or a coding agent (Codex, etc.) can follow it step by step.

## What this app is

Next.js 16 (App Router, TypeScript) + Ant Design UI + Supabase for database.
In the personal/public deployment it runs at https://e-unify.ai/pmis via
Vercel + a Cloudflare Worker proxy. Internally, Docker + nginx replace both.

## Prerequisites (confirm with IT before starting)

1. **Docker + Docker Compose** on a Linux VM (or an internal Kubernetes/OpenShift
   cluster — the image from `deploy/Dockerfile` works there too).
2. **npm registry access.** The build runs `npm ci`. If npmjs.org is blocked,
   an internal mirror (Artifactory/Nexus) must proxy it. Set the registry in
   `deploy/Dockerfile` where marked.
3. **Docker image access.** Base images needed: `node:24-alpine`,
   `nginx:1.27-alpine`, optionally `postgres:17-alpine`, plus the Supabase
   stack images if choosing Option A below. If Docker Hub is blocked, IT
   mirrors these into the internal registry and you update image names.
4. **Internal DNS record** for the placeholder domain (e.g.
   `pmis.yourcorp.internal`) pointing at the VM.
5. **TLS certificate** for that name from the internal CA (for the nginx
   HTTPS block).

## Steps

### 1. Get the code into internal Git
Unzip, then import into the internal Git server (GitLab, Gitea, GitHub
Enterprise). Everything after this happens from that internal repo.

### 2. Configure
- `cp deploy/.env.example deploy/.env` and fill in values.
- Edit `deploy/nginx.conf`: set `server_name` to the real internal domain.

### 3. Build and run
```
cd deploy
docker compose up -d --build
```
Visit http://<vm-or-domain>/pmis — the app should load.

### 4. Database — pick one

**Option A — self-hosted Supabase (least code change).**
The app already talks to Supabase via `@supabase/supabase-js`. Supabase
publishes an official self-host Docker Compose stack (Postgres + Auth +
REST + Studio). IT mirrors its images, runs the stack on the same VM or a
neighbor, and `NEXT_PUBLIC_SUPABASE_URL` in `deploy/.env` points at it.
The SQL schema (when added under `supabase/migrations/`) runs in its
Studio SQL editor, same as the cloud version.

**Option B — plain Postgres (fewer moving parts, more code work).**
Uncomment the `db` service in `docker-compose.yml`. Then replace the
`supabase-js` calls in `src/` with Next.js API routes that query Postgres
directly (e.g. with the `pg` package). Choose this if IT balks at running
the multi-container Supabase stack.

### 5. Replace the demo login (required before real use)
`src/context/AuthContext.tsx` contains a hardcoded demo user
(admin@e-unify.ai / pmis2025) visible to anyone who can read the bundle.
Replace with one of:
- Supabase Auth (works self-hosted, pairs with Option A), or
- corporate SSO (Keycloak / AD FS / SAML) if IT provides it.

### 6. Updates
Until CI/CD exists: `git pull && docker compose up -d --build` on the VM.
Later, an internal pipeline (GitLab CI, Jenkins) can do the same on merge.

## Files in deploy/
- `Dockerfile` — multi-stage build, standalone Next.js output
- `docker-compose.yml` — app + nginx (+ optional Postgres)
- `nginx.conf` — serves the app under /pmis, replaces the Cloudflare Worker
- `.env.example` — all configuration, commented
