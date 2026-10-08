DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'Listing' AND column_name = 'userId'
    ) THEN
        ALTER TABLE "Listing" ALTER COLUMN "userId" DROP NOT NULL;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema() AND table_name = 'Listing' AND column_name = 'imageUrl'
    ) THEN
        ALTER TABLE "Listing" ALTER COLUMN "imageUrl" DROP NOT NULL;
    END IF;
END $$;
