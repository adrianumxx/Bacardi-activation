# Portale prenotazioni attivazioni Bacardi

Mini portale B2B per clienti: catalogo trimestrale, requisiti e idoneità, uscita verso **Microsoft Bookings** (Outlook).

## Stack

- Next.js 14 (App Router) + TypeScript strict
- Tailwind + shadcn/ui
- Supabase (Auth magic link + Postgres + RLS)
- Zod (validazione runtime)

## Deploy (Vercel)

In **Project → Settings → Environment Variables** aggiungi almeno:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (es. `https://tuo-progetto.vercel.app`)

Poi fai **Redeploy**. Se mancano, l’app reindirizza a `/configurazione` invece di mostrare l’errore generico.

## Setup locale

### Opzione A — Supabase CLI (consigliato dopo il primo login)

1. Genera un **Access Token** (Dashboard Supabase → Account → Access Tokens).
2. Nella root del repo: `npx supabase login --token "..."` poi `npx supabase link --project-ref <ref>` (vedi anche `supabase/LINK.txt`).
3. Applica le migrazioni remote: `npm run db:remote:push` (equivalente a `supabase db push`).

### Opzione B — Solo SQL Editor

Esegui nell’ordine i file in `supabase/migrations/` (vedi ordine dettagliato in `supabase/LINK.txt`). Per il **catalogo senza login**, usa anche `supabase/scripts/ensure_public_catalog_anon.sql` se mancano grant/policy `anon`.

### Variabili e Auth

1. Crea un progetto su [Supabase](https://supabase.com) e collega l’app con URL + anon key in `.env.local` (vedi `.env.example`).

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
npm run db:remote:push   # dopo supabase login + link (vedi supabase/LINK.txt)
```

## Note brand

I token colore in `src/app/globals.css` sono ispirati ai colori Bacardi più noti (rosso `#BC2432`, nero `#0C0A09`). Allinea i valori finali al **brand kit ufficiale** interno.
