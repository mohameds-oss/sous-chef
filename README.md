# Sous-Chef

An intelligent cooking assistant: find recipes from ingredients you already have, or search by
name, then follow a guided step-by-step cooking mode with serving scaling, unit conversion, and
built-in timers.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) + **Tailwind CSS v4**
- **Prisma 7** + **Postgres** (portable driver adapter — works with Neon, Vercel Postgres,
  Supabase, Railway, or any standard Postgres instance)
- Custom session auth (bcrypt password hashing + signed JWT cookies via `jose`) — no third-party
  auth provider required
- 93 recipes with full ingredient lists, steps, tips, nutrition, and substitutions in
  `src/data/recipes/`

## Getting started

You need a Postgres database to run this locally — either a local Postgres install, or a free
instance from [Neon](https://neon.tech) / [Supabase](https://supabase.com).

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — your Postgres connection string
- `SESSION_SECRET` — generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Then:

```bash
npx prisma generate
npx prisma db push

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email

No email provider is required to try the app. Signup/verification/password-reset emails are
stored in the database and viewable at **`/dev/inbox`**. To send real email, set `RESEND_API_KEY`
(and optionally `EMAIL_FROM`) in `.env` — see `src/lib/mailer.ts`.

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo), then
   [import it into Vercel](https://vercel.com/new) — it auto-detects Next.js, no config needed.
2. In the new project, go to **Storage → Create Database → Postgres** (Neon-backed) and connect
   it to the project. This sets a Postgres connection string as an env var automatically.
3. In **Settings → Environment Variables**, make sure `DATABASE_URL` is set to that connection
   string (rename/copy it if Vercel's integration used a different variable name), and add:
   - `SESSION_SECRET` — a random 32-byte hex string (generate as above)
   - `NEXT_PUBLIC_APP_URL` — your deployed URL (e.g. `https://your-app.vercel.app`), so
     verification/reset email links point at the right place
   - `RESEND_API_KEY` / `EMAIL_FROM` — optional, for real outgoing email instead of `/dev/inbox`
4. Push the schema to the new database once: run `DATABASE_URL="<your connection string>" npx
   prisma db push` from your machine (or add it as a one-off Vercel build step).
5. Redeploy. That's it — every push to the connected branch auto-deploys.

## Scripts

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` / `npm run typecheck`
- `npm run validate-recipes` — sanity-checks the recipe database (count, unique ids, required
  fields)
- `npx tsx scripts/audit-recipes.ts` — cross-checks dietary tags against ingredients, nutrition
  macro math, and basic timing/ingredient sanity
- `npm run smoke` — Playwright smoke test covering signup → email verification → ingredient
  search → save recipe → guided cooking → meal planner (requires the app running on
  `localhost:3000`)
