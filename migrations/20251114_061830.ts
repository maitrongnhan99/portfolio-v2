import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Note: Data conversion should be done separately before running this migration
  // This migration only changes the column types from varchar to jsonb
  await db.execute(sql`
   ALTER TABLE "projects" ALTER COLUMN "challenges" SET DATA TYPE jsonb USING "challenges"::jsonb;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_challenges" SET DATA TYPE jsonb USING "version_challenges"::jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ALTER COLUMN "challenges" SET DATA TYPE varchar;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_challenges" SET DATA TYPE varchar;`)
}
