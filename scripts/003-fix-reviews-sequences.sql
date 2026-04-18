-- Fix sequences and ID auto-increment for versioned arrays in reviews

-- Add sequence for _reviews_v_version_pros id column
CREATE SEQUENCE IF NOT EXISTS "_reviews_v_version_pros_id_seq";
ALTER TABLE "_reviews_v_version_pros" 
  ALTER COLUMN "id" SET DEFAULT nextval('"_reviews_v_version_pros_id_seq"');
ALTER SEQUENCE "_reviews_v_version_pros_id_seq" OWNED BY "_reviews_v_version_pros"."id";

-- Add sequence for _reviews_v_version_cons id column
CREATE SEQUENCE IF NOT EXISTS "_reviews_v_version_cons_id_seq";
ALTER TABLE "_reviews_v_version_cons" 
  ALTER COLUMN "id" SET DEFAULT nextval('"_reviews_v_version_cons_id_seq"');
ALTER SEQUENCE "_reviews_v_version_cons_id_seq" OWNED BY "_reviews_v_version_cons"."id";

-- Add sequence for _reviews_v_version_populated_authors id column
CREATE SEQUENCE IF NOT EXISTS "_reviews_v_version_populated_authors_id_seq";
ALTER TABLE "_reviews_v_version_populated_authors" 
  ALTER COLUMN "id" SET DEFAULT nextval('"_reviews_v_version_populated_authors_id_seq"');
ALTER SEQUENCE "_reviews_v_version_populated_authors_id_seq" OWNED BY "_reviews_v_version_populated_authors"."id";

-- Add sequence for reviews_pros id column if not exists
CREATE SEQUENCE IF NOT EXISTS "reviews_pros_id_seq";
ALTER TABLE "reviews_pros" 
  ALTER COLUMN "id" SET DEFAULT nextval('"reviews_pros_id_seq"');
ALTER SEQUENCE "reviews_pros_id_seq" OWNED BY "reviews_pros"."id";

-- Add sequence for reviews_cons id column if not exists
CREATE SEQUENCE IF NOT EXISTS "reviews_cons_id_seq";
ALTER TABLE "reviews_cons" 
  ALTER COLUMN "id" SET DEFAULT nextval('"reviews_cons_id_seq"');
ALTER SEQUENCE "reviews_cons_id_seq" OWNED BY "reviews_cons"."id";

-- Add sequence for reviews_populated_authors id column if not exists
CREATE SEQUENCE IF NOT EXISTS "reviews_populated_authors_id_seq";
ALTER TABLE "reviews_populated_authors" 
  ALTER COLUMN "id" SET DEFAULT nextval('"reviews_populated_authors_id_seq"');
ALTER SEQUENCE "reviews_populated_authors_id_seq" OWNED BY "reviews_populated_authors"."id";
