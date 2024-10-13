alter table "public"."components" disable row level security;

alter table "public"."sites" add column "twitter_id_str" text;

alter table "public"."sites" disable row level security;


