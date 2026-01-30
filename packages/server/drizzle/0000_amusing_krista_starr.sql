CREATE SCHEMA "startup-stack";
--> statement-breakpoint
CREATE TABLE "startup-stack"."sample" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "startup-stack"."sample_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "sample_email_unique" UNIQUE("email")
);
