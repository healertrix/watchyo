ALTER TABLE "restaurants" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;