CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(322) NOT NULL,
	"password" varchar(255) NOT NULL,
	"salt" varchar(128) NOT NULL,
	"created-at" timestamp DEFAULT now(),
	"updated-at" timestamp
);
