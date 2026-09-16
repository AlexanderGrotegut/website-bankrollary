# Bankrollary

Bankrollary is a responsive bankroll diary for Poker, Sports Betting,
Blackjack, Roulette, Slots, Stocks and user-defined game types. Sessions,
bankroll transactions and analytics are private to each account.

## Features

- Session tracking with automatic P/L, duration, ROI and hourly rate
- Running sessions that can be completed later
- Weekly, monthly, yearly and all-time analytics
- User-defined platforms and game types
- Multiple currencies kept separate by default
- Optional immutable EUR/foreign-currency snapshots using Frankfurter/ECB
- Starting balances, deposits and withdrawals
- Search, filters, editing and CSV export

When currency conversion is enabled for a session, the daily ECB exchange rate
is fetched when the session is completed. The rate and converted buy-in,
cash-out and P/L are stored permanently. Historical values never change when
the live rate or the user's default currency changes.

## Stack

- Next.js 16, React 19, TypeScript and Tailwind CSS
- Supabase Auth and PostgreSQL
- Prisma, Recharts and Vitest

## Local setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and enter the required values.
3. Enable email/password authentication in Supabase.
4. Apply migrations with `npm run db:migrate`.
5. Start the app with `npm run dev`.

`DATABASE_URL` uses the Supabase transaction pooler. `DIRECT_URL` uses the
session pooler or direct connection. Never commit credentials.

## Vercel production setup

Add these Production environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable/anon key, never service role)
- `NEXT_PUBLIC_APP_URL=https://www.bankrollary.com`
- `DATABASE_URL` (Supabase transaction pooler)
- `DIRECT_URL` (Supabase session pooler or direct connection)

The build generates Prisma Client but intentionally does not run database
migrations. Apply every new migration once before using the corresponding
deployment:

```bash
npm run db:migrate
```

In Supabase Authentication URL Configuration, set the site URL and allow
`https://www.bankrollary.com/auth/callback`.

## Commands

- `npm run dev` – local development
- `npm run lint` – ESLint
- `npm test` – unit tests
- `npm run build` – Prisma Client and production build
- `npm run db:migrate` – apply existing migrations

## Security model

Supabase handles registration, sessions and password resets. Every application
route and mutating server action requires a valid session. Prisma queries scope
private records by the Supabase user ID. Row Level Security blocks direct Data
API access to application tables; the app accesses them only server-side.
