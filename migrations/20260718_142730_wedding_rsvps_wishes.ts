import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rsvps_attending" AS ENUM('yes', 'no');
  CREATE TABLE "rsvps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"attending" "enum_rsvps_attending" NOT NULL,
  	"guests" numeric DEFAULT 1,
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"avatar" varchar,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "projects" ADD COLUMN "solutions" jsonb;
  ALTER TABLE "_projects_v" ADD COLUMN "version_solutions" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rsvps_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wishes_id" integer;
  CREATE INDEX "rsvps_updated_at_idx" ON "rsvps" USING btree ("updated_at");
  CREATE INDEX "rsvps_created_at_idx" ON "rsvps" USING btree ("created_at");
  CREATE INDEX "wishes_updated_at_idx" ON "wishes" USING btree ("updated_at");
  CREATE INDEX "wishes_created_at_idx" ON "wishes" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rsvps_fk" FOREIGN KEY ("rsvps_id") REFERENCES "public"."rsvps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wishes_fk" FOREIGN KEY ("wishes_id") REFERENCES "public"."wishes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_rsvps_id_idx" ON "payload_locked_documents_rels" USING btree ("rsvps_id");
  CREATE INDEX "payload_locked_documents_rels_wishes_id_idx" ON "payload_locked_documents_rels" USING btree ("wishes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rsvps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "wishes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rsvps" CASCADE;
  DROP TABLE "wishes" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rsvps_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wishes_fk";
  
  DROP INDEX "payload_locked_documents_rels_rsvps_id_idx";
  DROP INDEX "payload_locked_documents_rels_wishes_id_idx";
  ALTER TABLE "projects" DROP COLUMN "solutions";
  ALTER TABLE "_projects_v" DROP COLUMN "version_solutions";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rsvps_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wishes_id";
  DROP TYPE "public"."enum_rsvps_attending";`)
}
