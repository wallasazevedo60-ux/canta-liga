CREATE TABLE "birds" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"name" text NOT NULL,
	"species" text NOT NULL,
	"ring_number" text,
	"photo_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"tournament_id" integer NOT NULL,
	"bird_id" integer NOT NULL,
	"paid" boolean DEFAULT false,
	"score" integer DEFAULT 0,
	"rank" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizer_id" integer NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"entry_fee" integer DEFAULT 0,
	"prizes" jsonb,
	"status" text DEFAULT 'aberto',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trainings" (
	"id" serial PRIMARY KEY NOT NULL,
	"bird_id" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"duration" integer NOT NULL,
	"song_count" integer DEFAULT 0,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'criador' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "birds" ADD CONSTRAINT "birds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_bird_id_birds_id_fk" FOREIGN KEY ("bird_id") REFERENCES "public"."birds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_bird_id_birds_id_fk" FOREIGN KEY ("bird_id") REFERENCES "public"."birds"("id") ON DELETE no action ON UPDATE no action;