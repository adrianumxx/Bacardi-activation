# Portale prenotazioni attivazioni Bacardi

Mini portale B2B per clienti: catalogo trimestrale, requisiti e idoneità, uscita verso **Microsoft Bookings** (Outlook).

## Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind + shadcn/ui
- Supabase (Auth magic link + Postgres + RLS)
- Zod (validazione runtime)

## Setup locale

1. Crea un progetto su [Supabase](https://supabase.com) ed esegui la migrazione SQL in `supabase/migrations/20250418000000_init.sql` (SQL editor o CLI Supabase).

2. In Supabase Authentication → URL configuration, imposta:

- **Site URL**: `http://localhost:3000` (in prod: il dominio Vercel)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

3. Copia `.env.example` in `.env.local` e compila:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server: inviti admin)
- `NEXT_PUBLIC_SITE_URL` (es. `http://localhost:3000`)

4. Installa e avvia:

```bash
npm install
npm run dev
```

## Primo admin

Dopo il primo accesso con un utente, promuovi il ruolo admin direttamente in SQL (Supabase SQL editor):

```sql
update public.profiles
set role = 'admin'
where id = '<UUID utente da auth.users>';
```

## Microsoft Bookings

Per ogni attivazione, incolla nel pannello admin l’URL pubblico del servizio creato in Microsoft Bookings. Il pulsante lato cliente apre Bookings in una nuova scheda e registra un log di click nel database.

## Script

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Note brand

I token colore in `src/app/globals.css` sono ispirati ai colori Bacardi più noti (rosso `#BC2432`, nero `#0C0A09`). Allinea i valori finali al **brand kit ufficiale** interno.
