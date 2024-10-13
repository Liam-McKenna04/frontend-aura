alter table "public"."components" drop column "component_int_variable";

alter table "public"."components" add column "variant" text;

alter table "public"."components" add column "voting_array" text;

alter table "public"."sites" enable row level security;


