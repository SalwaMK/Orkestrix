CREATE TABLE `tools` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'local' NOT NULL,
	`tool_name` text NOT NULL,
	`cost` integer NOT NULL,
	`billing_cycle` text NOT NULL,
	`renewal_date` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`is_ai_tool` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text NOT NULL
);
