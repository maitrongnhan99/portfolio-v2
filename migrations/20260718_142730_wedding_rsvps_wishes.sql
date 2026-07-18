-- Migration: wedding_rsvps_wishes (20260718_142730)
-- Creates the `rsvps` and `wishes` tables for the /my-wedding card,
-- plus the pending `projects.solutions` column from the current Payload config.
--
-- Run this ONCE against the Supabase (production) database, e.g. via the
-- Supabase SQL editor. It mirrors migrations/20260718_142730_wedding_rsvps_wishes.ts
-- and records itself in payload_migrations so `payload migrate` stays in sync.

BEGIN;

-- RSVP attendance enum
CREATE TYPE "public"."enum_rsvps_attending" AS ENUM ('yes', 'no');

-- Guest RSVP submissions (public create, admin read)
CREATE TABLE "rsvps" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "attending" "enum_rsvps_attending" NOT NULL,
  "guests" numeric DEFAULT 1,
  "message" varchar,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- Guestbook wishes (public create, only approved rows are publicly readable)
CREATE TABLE "wishes" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "message" varchar NOT NULL,
  "avatar" varchar,
  "approved" boolean DEFAULT false,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- Pending schema drift also captured by this migration
ALTER TABLE "projects" ADD COLUMN "solutions" jsonb;
ALTER TABLE "_projects_v" ADD COLUMN "version_solutions" jsonb;

-- Payload document-locking relationships for the new collections
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rsvps_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wishes_id" integer;

CREATE INDEX "rsvps_updated_at_idx" ON "rsvps" USING btree ("updated_at");
CREATE INDEX "rsvps_created_at_idx" ON "rsvps" USING btree ("created_at");
CREATE INDEX "wishes_updated_at_idx" ON "wishes" USING btree ("updated_at");
CREATE INDEX "wishes_created_at_idx" ON "wishes" USING btree ("created_at");

ALTER TABLE "payload_locked_documents_rels"
  ADD CONSTRAINT "payload_locked_documents_rels_rsvps_fk"
  FOREIGN KEY ("rsvps_id") REFERENCES "public"."rsvps"("id")
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "payload_locked_documents_rels"
  ADD CONSTRAINT "payload_locked_documents_rels_wishes_fk"
  FOREIGN KEY ("wishes_id") REFERENCES "public"."wishes"("id")
  ON DELETE cascade ON UPDATE no action;

CREATE INDEX "payload_locked_documents_rels_rsvps_id_idx"
  ON "payload_locked_documents_rels" USING btree ("rsvps_id");
CREATE INDEX "payload_locked_documents_rels_wishes_id_idx"
  ON "payload_locked_documents_rels" USING btree ("wishes_id");

-- Mark the migration as applied so `payload migrate` won't re-run it.
INSERT INTO "payload_migrations" ("name", "batch", "updated_at", "created_at")
VALUES (
  '20260718_142730_wedding_rsvps_wishes',
  (SELECT COALESCE(MAX("batch"), 0) + 1 FROM "payload_migrations"),
  now(),
  now()
);

COMMIT;
