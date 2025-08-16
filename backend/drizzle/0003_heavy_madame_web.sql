ALTER TABLE "note" ALTER COLUMN "author_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "note" ALTER COLUMN "author_id" SET NOT NULL;