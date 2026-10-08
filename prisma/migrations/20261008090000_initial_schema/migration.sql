DO $$
BEGIN
    CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'SOLD');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "bio" TEXT,
    "campus" TEXT,
    "avatar" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "id" TEXT,
ADD COLUMN IF NOT EXISTS "name" TEXT,
ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "campus" TEXT,
ADD COLUMN IF NOT EXISTS "avatar" TEXT,
ADD COLUMN IF NOT EXISTS "phone" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "User"
SET "name" = COALESCE(NULLIF("name", ''), NULLIF(split_part("email", '@', 1), ''), "id"),
    "updatedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP)
WHERE "name" IS NULL OR "name" = '' OR "updatedAt" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Listing_sellerId_fkey"
        FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "Listing"
ADD COLUMN IF NOT EXISTS "id" TEXT,
ADD COLUMN IF NOT EXISTS "title" TEXT,
ADD COLUMN IF NOT EXISTS "description" TEXT,
ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "category" TEXT,
ADD COLUMN IF NOT EXISTS "condition" TEXT NOT NULL DEFAULT 'Used',
ADD COLUMN IF NOT EXISTS "location" TEXT NOT NULL DEFAULT 'NMIT Campus',
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS "sellerId" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'Listing' AND column_name = 'userId'
    ) THEN
        EXECUTE 'UPDATE "Listing" SET "sellerId" = "userId" WHERE "sellerId" IS NULL';
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'Listing' AND column_name = 'imageUrl'
    ) THEN
        EXECUTE 'UPDATE "Listing" SET "imageUrls" = CASE WHEN "imageUrl" IS NULL OR "imageUrl" = '''' THEN ARRAY[]::TEXT[] ELSE ARRAY["imageUrl"] END WHERE cardinality("imageUrls") = 0';
    END IF;
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'Listing' AND column_name = 'isSold'
    ) THEN
        EXECUTE 'UPDATE "Listing" SET "status" = CASE WHEN "isSold" THEN ''SOLD''::"ListingStatus" ELSE ''ACTIVE''::"ListingStatus" END';
    END IF;
END $$;

ALTER TABLE "Listing"
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "condition" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "imageUrls" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "sellerId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Favorite_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_listingId_fkey"
        FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "Favorite"
ADD COLUMN IF NOT EXISTS "id" TEXT,
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "listingId" TEXT;

DO $$
BEGIN
    IF to_regclass(format('%I.%I', current_schema(), 'Wishlist')) IS NOT NULL
       AND EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_schema = current_schema() AND table_name = 'Wishlist' AND column_name = 'userId'
       )
       AND EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_schema = current_schema() AND table_name = 'Wishlist' AND column_name = 'listingId'
       ) THEN
        EXECUTE 'INSERT INTO "Favorite" ("id", "userId", "listingId") SELECT "id", "userId", "listingId" FROM "Wishlist" ON CONFLICT DO NOTHING';
    END IF;
END $$;

ALTER TABLE "Favorite"
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "listingId" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_listingId_key" ON "Favorite"("userId", "listingId");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Listing_sellerId_fkey') THEN
        ALTER TABLE "Listing"
        ADD CONSTRAINT "Listing_sellerId_fkey"
        FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_userId_fkey') THEN
        ALTER TABLE "Favorite"
        ADD CONSTRAINT "Favorite_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Favorite_listingId_fkey') THEN
        ALTER TABLE "Favorite"
        ADD CONSTRAINT "Favorite_listingId_fkey"
        FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
