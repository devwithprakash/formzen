CREATE TYPE "public"."form_status" AS ENUM('public', 'unlisted', 'private');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status" DEFAULT 'private' NOT NULL;