alter table "public"."components" add column "site_id" bigint;

alter table "public"."sites" drop column "react_file";

alter table "public"."sites" add column "aura_description" text;

alter table "public"."components" add constraint "components_site_id_fkey" FOREIGN KEY (site_id) REFERENCES sites(id) not valid;

alter table "public"."components" validate constraint "components_site_id_fkey";


