# Campus Marketplace

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the required values.
2. In Supabase, open **Connect** and configure:
   - `DATABASE_URL` with the **Transaction Pooler** URI (port `6543`) for the app's
     serverless Prisma Client connections.
   - `DIRECT_URL` with the **Session Pooler** URI (port `5432`) for Prisma CLI
     migrations when the local network cannot reach the IPv6 direct endpoint.
     The Direct connection URI also works when the environment supports IPv6.
3. Prisma CLI reads `.env` in this project. Before running Prisma CLI commands,
   make sure both database variables are available there; keep `.env` and
   `.env.local` out of version control.
4. Apply migrations and generate Prisma Client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Install packages and start the app:

   ```bash
   npm install
   npm run dev
   ```

## Email verification

Account creation requires an `@nmit.ac.in` address. Resend sends a single-use verification link that expires after one hour. Configure `RESEND_API_KEY` and `EMAIL_FROM` with a sender address verified in Resend, and set `NEXTAUTH_URL` to the exact app origin used in email links (HTTPS outside local development). Unverified accounts cannot sign in.

Never commit `.env.local` or expose provider keys in client-side variables.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Vercel deployment

Link the project with the Vercel dashboard and configure the production
environment variables from `.env.example`. Use Supabase's Transaction Pooler
URI for `DATABASE_URL`, and a reachable Direct or Session Pooler URI for
`DIRECT_URL`. Apply migrations against that database before directing traffic:

```bash
npx prisma migrate deploy
npm run build
```

The initial migration is for a new database. For an existing database created outside Prisma Migrate, inspect and baseline its actual schema before applying migrations; do not run the initial migration against existing tables.
