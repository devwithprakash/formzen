CREATE TYPE "public"."form_theme" AS ENUM('light', 'dark', 'minimal', 'gradient', 'modern');--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "theme" "form_theme" DEFAULT 'light' NOT NULL;