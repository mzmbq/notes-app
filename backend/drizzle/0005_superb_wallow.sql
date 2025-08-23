ALTER TABLE "tag" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "tag" ADD COLUMN "author_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;