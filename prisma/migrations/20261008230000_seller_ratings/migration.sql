CREATE TABLE "SellerRating" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerRating_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SellerRating_rating_range_check" CHECK ("rating" BETWEEN 1 AND 5),
    CONSTRAINT "SellerRating_no_self_rating_check" CHECK ("sellerId" <> "reviewerId")
);

CREATE UNIQUE INDEX "SellerRating_sellerId_reviewerId_key" ON "SellerRating"("sellerId", "reviewerId");
CREATE INDEX "SellerRating_sellerId_idx" ON "SellerRating"("sellerId");

ALTER TABLE "SellerRating" ADD CONSTRAINT "SellerRating_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SellerRating" ADD CONSTRAINT "SellerRating_reviewerId_fkey"
    FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
