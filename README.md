# Campus Marketplace

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the required values.
2. Ensure PostgreSQL is running and `DATABASE_URL` points to the database.
3. Apply migrations and generate Prisma Client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. Install packages and start the app:

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

Link the project with the Vercel CLI or Vercel dashboard, configure all variables from `.env.example` in the Production environment, and use a reachable PostgreSQL database. Apply migrations against that database before directing traffic:

```bash
npx prisma migrate deploy
npm run build
```

The initial migration is for a new database. For an existing database created outside Prisma Migrate, inspect and baseline its actual schema before applying migrations; do not run the initial migration against existing tables.
