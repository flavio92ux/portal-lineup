-- Migration: Create Reviews tables for Payload CMS
-- This script creates all necessary tables for the Reviews collection

-- Create enum for reviews availability if not exists
DO $$ BEGIN
    CREATE TYPE "enum_reviews_offers_availability" AS ENUM('InStock', 'OutOfStock', 'PreOrder', 'Discontinued');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for reviews status if not exists  
DO $$ BEGIN
    CREATE TYPE "enum_reviews_status" AS ENUM('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for _reviews_v status if not exists
DO $$ BEGIN
    CREATE TYPE "enum__reviews_v_version_status" AS ENUM('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main reviews table
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "subtitle" varchar,
    "hero_image_id" integer,
    "product_name" varchar,
    "product_brand" varchar,
    "product_image_id" integer,
    "product_description" varchar,
    "offers_price" numeric,
    "offers_affiliate_url" varchar,
    "offers_availability" "enum_reviews_offers_availability" DEFAULT 'InStock',
    "rating" numeric NOT NULL,
    "content" jsonb,
    "meta_title" varchar,
    "meta_description" varchar,
    "meta_keywords" varchar[],
    "published_at" timestamp(3) with time zone,
    "slug" varchar,
    "slug_lock" boolean DEFAULT true,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_reviews_status" DEFAULT 'draft'
);

-- Reviews pros array table
CREATE TABLE IF NOT EXISTS "reviews_pros" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "text" varchar NOT NULL
);

-- Reviews cons array table
CREATE TABLE IF NOT EXISTS "reviews_cons" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "text" varchar NOT NULL
);

-- Reviews populated authors table
CREATE TABLE IF NOT EXISTS "reviews_populated_authors" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "name" varchar,
    "slug" varchar,
    "avatar_id" integer
);

-- Reviews relationships table (for categories, authors, relatedPosts, relatedReviews)
CREATE TABLE IF NOT EXISTS "reviews_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "posts_id" integer,
    "reviews_id" integer,
    "categories_id" integer,
    "users_id" integer
);

-- Reviews texts table (for searchable text fields)
CREATE TABLE IF NOT EXISTS "reviews_texts" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "text" varchar
);

-- Versions table for reviews
CREATE TABLE IF NOT EXISTS "_reviews_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_title" varchar NOT NULL,
    "version_subtitle" varchar,
    "version_hero_image_id" integer,
    "version_product_name" varchar,
    "version_product_brand" varchar,
    "version_product_image_id" integer,
    "version_product_description" varchar,
    "version_offers_price" numeric,
    "version_offers_affiliate_url" varchar,
    "version_offers_availability" "enum_reviews_offers_availability" DEFAULT 'InStock',
    "version_rating" numeric,
    "version_content" jsonb,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "version_meta_keywords" varchar[],
    "version_published_at" timestamp(3) with time zone,
    "version_slug" varchar,
    "version_slug_lock" boolean DEFAULT true,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__reviews_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean,
    "autosave" boolean
);

-- Versions pros table
CREATE TABLE IF NOT EXISTS "_reviews_v_version_pros" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_uuid" varchar,
    "text" varchar
);

-- Versions cons table
CREATE TABLE IF NOT EXISTS "_reviews_v_version_cons" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_uuid" varchar,
    "text" varchar
);

-- Versions populated authors table
CREATE TABLE IF NOT EXISTS "_reviews_v_version_populated_authors" (
    "id" varchar PRIMARY KEY NOT NULL,
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_uuid" varchar,
    "name" varchar,
    "slug" varchar,
    "avatar_id" integer
);

-- Versions relationships table
CREATE TABLE IF NOT EXISTS "_reviews_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "posts_id" integer,
    "reviews_id" integer,
    "categories_id" integer,
    "users_id" integer
);

-- Versions texts table
CREATE TABLE IF NOT EXISTS "_reviews_v_texts" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "text" varchar
);

-- Add foreign key constraints for reviews table
DO $$ BEGIN
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_image_id_media_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for reviews_pros
DO $$ BEGIN
    ALTER TABLE "reviews_pros" ADD CONSTRAINT "reviews_pros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for reviews_cons
DO $$ BEGIN
    ALTER TABLE "reviews_cons" ADD CONSTRAINT "reviews_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for reviews_populated_authors
DO $$ BEGIN
    ALTER TABLE "reviews_populated_authors" ADD CONSTRAINT "reviews_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews_populated_authors" ADD CONSTRAINT "reviews_populated_authors_avatar_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for reviews_rels
DO $$ BEGIN
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "reviews_rels" ADD CONSTRAINT "reviews_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for reviews_texts
DO $$ BEGIN
    ALTER TABLE "reviews_texts" ADD CONSTRAINT "reviews_texts_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v
DO $$ BEGIN
    ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_hero_image_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_product_image_id_fk" FOREIGN KEY ("version_product_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v_version_pros
DO $$ BEGIN
    ALTER TABLE "_reviews_v_version_pros" ADD CONSTRAINT "_reviews_v_version_pros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_reviews_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v_version_cons
DO $$ BEGIN
    ALTER TABLE "_reviews_v_version_cons" ADD CONSTRAINT "_reviews_v_version_cons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_reviews_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v_version_populated_authors
DO $$ BEGIN
    ALTER TABLE "_reviews_v_version_populated_authors" ADD CONSTRAINT "_reviews_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_reviews_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v_version_populated_authors" ADD CONSTRAINT "_reviews_v_version_populated_authors_avatar_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v_rels
DO $$ BEGIN
    ALTER TABLE "_reviews_v_rels" ADD CONSTRAINT "_reviews_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "_reviews_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v_rels" ADD CONSTRAINT "_reviews_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v_rels" ADD CONSTRAINT "_reviews_v_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v_rels" ADD CONSTRAINT "_reviews_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "_reviews_v_rels" ADD CONSTRAINT "_reviews_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints for _reviews_v_texts
DO $$ BEGIN
    ALTER TABLE "_reviews_v_texts" ADD CONSTRAINT "_reviews_v_texts_parent_id_fk" FOREIGN KEY ("parent_id") REFERENCES "_reviews_v"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "reviews_slug_idx" ON "reviews" ("slug");
CREATE INDEX IF NOT EXISTS "reviews_created_at_idx" ON "reviews" ("created_at");
CREATE INDEX IF NOT EXISTS "reviews_updated_at_idx" ON "reviews" ("updated_at");
CREATE INDEX IF NOT EXISTS "reviews__status_idx" ON "reviews" ("_status");

CREATE INDEX IF NOT EXISTS "reviews_rels_order_idx" ON "reviews_rels" ("order");
CREATE INDEX IF NOT EXISTS "reviews_rels_parent_idx" ON "reviews_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "reviews_rels_path_idx" ON "reviews_rels" ("path");

CREATE INDEX IF NOT EXISTS "_reviews_v_parent_idx" ON "_reviews_v" ("parent_id");
CREATE INDEX IF NOT EXISTS "_reviews_v_version_slug_idx" ON "_reviews_v" ("version_slug");
CREATE INDEX IF NOT EXISTS "_reviews_v_created_at_idx" ON "_reviews_v" ("created_at");
CREATE INDEX IF NOT EXISTS "_reviews_v_updated_at_idx" ON "_reviews_v" ("updated_at");
CREATE INDEX IF NOT EXISTS "_reviews_v_latest_idx" ON "_reviews_v" ("latest");
CREATE INDEX IF NOT EXISTS "_reviews_v_autosave_idx" ON "_reviews_v" ("autosave");

CREATE INDEX IF NOT EXISTS "_reviews_v_rels_order_idx" ON "_reviews_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_reviews_v_rels_parent_idx" ON "_reviews_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_reviews_v_rels_path_idx" ON "_reviews_v_rels" ("path");

-- Update payload_locked_documents_rels to include reviews_id column if not exists
DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Record this migration
INSERT INTO "payload_migrations" ("name", "batch", "created_at", "updated_at")
VALUES ('001_create_reviews_tables', 1, NOW(), NOW())
ON CONFLICT DO NOTHING;
