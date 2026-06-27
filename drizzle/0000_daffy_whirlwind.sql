CREATE TABLE "communities" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon_name" text NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"pinned_teacher_ids" jsonb DEFAULT '[]'::jsonb,
	"discussion_feed" jsonb DEFAULT '[]'::jsonb,
	"qa_list" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"student_id" text NOT NULL,
	"teacher_name" text NOT NULL,
	"student_name" text NOT NULL,
	"subject" text NOT NULL,
	"date" text NOT NULL,
	"time_slot" text NOT NULL,
	"hourly_rate" real NOT NULL,
	"price" real NOT NULL,
	"platform_fee" real NOT NULL,
	"teacher_earnings" real NOT NULL,
	"status" text NOT NULL,
	"teacher_timezone" text NOT NULL,
	"student_timezone" text NOT NULL,
	"student_local_time" text NOT NULL,
	"teacher_local_time" text NOT NULL,
	"payment_captured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"timezone" text NOT NULL,
	"preferred_subjects" jsonb DEFAULT '[]'::jsonb,
	"bio" text,
	"hourly_rate" real,
	"qualifications" text,
	"rating" real,
	"reviews" jsonb DEFAULT '[]'::jsonb,
	"availability" jsonb DEFAULT '[]'::jsonb,
	"stripe_express_status" text DEFAULT 'unlinked',
	"joined_communities" jsonb DEFAULT '[]'::jsonb,
	"saved_teachers" jsonb DEFAULT '[]'::jsonb,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"avatar" text,
	"created_at" timestamp DEFAULT now()
);
