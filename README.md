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
4. For a **new, empty database**, apply migrations and generate Prisma Client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Install packages and start the app:

   ```bash
   npm install
   npm run dev
   ```

For the existing pre-Prisma Campus Marketplace database, take a Supabase backup
before changing the schema. Prisma cannot deploy the initial migration directly
to a non-empty database, so apply and baseline the compatibility migration once:

```bash
npx prisma db execute --file prisma/migrations/20261008090000_initial_schema/migration.sql
npx prisma migrate resolve --applied 20261008090000_initial_schema
npx prisma migrate deploy
```

The compatibility migration retains legacy listing columns and the `Wishlist`
table, copies existing wishlist entries into `Favorite`, and adds the fields
used by the current app. A follow-up migration makes unused legacy listing
columns optional for new rows without removing any existing listing data.

## Google sign-in

Sign-in and account creation use Google OAuth; verification emails are not sent. Only Google accounts with a verified `@nmit.ac.in` address are accepted. After first sign-in, students provide their USN, degree, and engineering branch.

1. Create an OAuth 2.0 **Web application** client in Google Cloud Console and configure the OAuth consent screen.
2. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. For production, add `https://YOUR_DOMAIN/api/auth/callback/google`.
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`, along with `NEXTAUTH_URL` and `NEXTAUTH_SECRET`. Use the public HTTPS URL for `NEXTAUTH_URL` in production.
4. Restart the local server after changing environment variables.

The callback checks both Google's verified-email claim and the exact `@nmit.ac.in` domain; a Google account with another domain cannot create or sign into an account.

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
`DIRECT_URL`. Apply migrations against that database before directing traffic.
For a non-empty legacy database, use the baseline procedure above:

```bash
npx prisma migrate deploy
npm run build
```

The initial migration is for a new database. For an existing database created outside Prisma Migrate, inspect and baseline its actual schema before applying migrations; do not run the initial migration against existing tables.
