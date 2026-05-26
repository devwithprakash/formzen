ALTER TABLE "forms" ALTER COLUMN "theme" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "theme" SET DEFAULT 'light'::text;--> statement-breakpoint
DROP TYPE "public"."form_theme";--> statement-breakpoint
CREATE TYPE "public"."form_theme" AS ENUM('light', 'dark', 'minimal', 'gradient');--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "theme" SET DEFAULT 'light'::"public"."form_theme";--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "theme" SET DATA TYPE "public"."form_theme" USING "theme"::"public"."form_theme";