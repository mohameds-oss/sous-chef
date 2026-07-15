# Sous-Chef

An intelligent cooking assistant: find recipes from ingredients you already have, or search by
name, then follow a guided step-by-step cooking mode with serving scaling, unit conversion, and
built-in timers.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) + **Tailwind CSS v4**
- **Prisma 7** + SQLite (swap the datasource/adapter for Postgres to deploy on serverless — see
  below)
- Custom session auth (bcrypt password hashing + signed JWT cookies via `jose`) — no third-party
  auth provider required
- 93 recipes with full ingredient lists, steps, tips, nutrition, and substitutions in
  `src/data/recipes/`

## Getting started

```bash
npm install
cp .env.example .env
# generate a real secret and paste it into .env:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

npx prisma generate
DATABASE_URL="file:./prisma/dev.db" npx prisma db push

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email

No email provider is required to try the app. Signup/verification/password-reset emails are
stored in the database and viewable at **`/dev/inbox`**. To send real email, set `RESEND_API_KEY`
(and optionally `EMAIL_FROM`) in `.env` — see `src/lib/mailer.ts`.

## Deploying with Postgres instead of SQLite

1. In `prisma/schema.prisma`, change the datasource `provider` to `"postgresql"`.
2. Swap the driver adapter in `src/lib/db.ts` (and `prisma.config.ts`) from
   `@prisma/adapter-better-sqlite3` to `@prisma/adapter-pg` (or your provider's adapter), pointing
   at your `DATABASE_URL`.
3. Run `npx prisma db push` (or set up migrations) against the new database.

## Scripts

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`
- `npx tsx scripts/validate-recipes.ts` — sanity-checks the recipe database (count, unique ids,
  required fields)
- `node scripts/e2e-smoke.mjs` — Playwright smoke test covering signup → email verification →
  ingredient search → save recipe → guided cooking → meal planner (requires the app running on
  `localhost:3000`)
