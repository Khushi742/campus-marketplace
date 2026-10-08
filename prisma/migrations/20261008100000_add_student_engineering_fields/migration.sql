ALTER TABLE "User"
ADD COLUMN "usn" TEXT,
ADD COLUMN "degree" TEXT,
ADD COLUMN "branch" TEXT;

CREATE UNIQUE INDEX "User_usn_key" ON "User"("usn");
