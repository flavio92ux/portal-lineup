-- Migration to fix NOT NULL constraints on reviews table
-- Payload CMS needs to create drafts with null values initially

-- Remove NOT NULL constraint from title
ALTER TABLE reviews ALTER COLUMN title DROP NOT NULL;

-- Remove NOT NULL constraint from rating (if exists)
ALTER TABLE reviews ALTER COLUMN rating DROP NOT NULL;

-- Also fix the versions table
ALTER TABLE _reviews_v ALTER COLUMN version_title DROP NOT NULL;
ALTER TABLE _reviews_v ALTER COLUMN version_rating DROP NOT NULL;
