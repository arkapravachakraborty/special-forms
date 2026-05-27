CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'EMAIL', 'PASSWORD', 'YES_NO', 'NUMBER');--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(55) NOT NULL,
	"description" varchar(255),
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false,
	"index" numeric,
	"type" "field_type_enum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;