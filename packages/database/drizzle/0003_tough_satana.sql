ALTER TABLE "form_responses" ALTER COLUMN "ip_address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "response_answers" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "response_answers" DROP COLUMN "updated_at";