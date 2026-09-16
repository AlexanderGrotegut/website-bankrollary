# Bankrollary

Bankrollary ist ein responsives Bankroll-Diary für Poker, Sports Betting,
Casino, Blackjack, Roulette und Slots. Sessions, Bankroll-Buchungen und
Auswertungen werden pro Account und Währung getrennt gespeichert.

## Stack

- Next.js 16, React 19, TypeScript und Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL mit Prisma
- Recharts und Vitest

## Lokale Einrichtung

1. `npm install`
2. `.env.example` nach `.env.local` kopieren und Werte eintragen.
3. In Supabase E-Mail/Passwort unter Authentication aktivieren.
4. Datenbankmigration ausführen: `npm run db:migrate`
5. Entwicklungsserver starten: `npm run dev`

Die Migration liegt unter `prisma/migrations`. `DATABASE_URL` verwendet den
Supabase Transaction Pooler, `DIRECT_URL` den Session Pooler oder die direkte
Verbindung. Zugangsdaten niemals committen.

## Vercel, Supabase und IONOS verbinden

### 1. Vercel Production-Variablen

Unter **Project → Settings → Environment Variables** jeweils für Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Publishable/Anon Key, niemals Service Role)
- `NEXT_PUBLIC_APP_URL=https://deine-domain.de`
- `DATABASE_URL` (Supabase Transaction Pooler)
- `DIRECT_URL` (Supabase Session Pooler oder Direct Connection)

Danach einen neuen Production-Deploy starten. Der Build generiert den Prisma
Client, führt aber bewusst keine Datenbankmigration automatisch aus.

### 2. Supabase Auth

Unter **Authentication → URL Configuration**:

- Site URL: `https://deine-domain.de`
- Redirect URL: `https://deine-domain.de/auth/callback`

Wenn `www.deine-domain.de` ebenfalls verwendet wird, die Callback-URL dafür
zusätzlich erlauben. E-Mail-Templates müssen auf die konfigurierte Site URL
verweisen.

### 3. IONOS-Domain

Die Domain zuerst in Vercel unter **Settings → Domains** hinzufügen. Danach bei
IONOS exakt die von Vercel angezeigten DNS-Einträge setzen. Üblicherweise ist
das ein A-Record für die Hauptdomain und ein CNAME für `www`. Widersprüchliche
alte A-, AAAA- oder CNAME-Records entfernen. Sobald Vercel die Domain als
gültig markiert, wird TLS automatisch eingerichtet.

### 4. Production-Migration

Vor dem ersten Aufruf einmal mit den Production-Datenbankvariablen ausführen:

```bash
npm run db:migrate
```

## Befehle

- `npm run dev` – lokale Entwicklung
- `npm run lint` – ESLint
- `npm test` – Unit-Tests
- `npm run build` – Prisma Client und Production-Build
- `npm run db:migrate` – vorhandene Migrationen anwenden

## Sicherheitsmodell

Supabase verwaltet Registrierung, Sitzungen und Passwort-Reset. Sämtliche
App-Routen und mutierenden Server-Actions erfordern eine gültige Sitzung.
Prisma-Abfragen begrenzen Nutzerdaten immer über die Supabase-User-ID.
Unterschiedliche Währungen werden nicht ohne Wechselkurs zusammengerechnet.
