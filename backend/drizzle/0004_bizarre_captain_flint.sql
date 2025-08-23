CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"text_color" varchar NOT NULL,
	"background_color" varchar NOT NULL
);
