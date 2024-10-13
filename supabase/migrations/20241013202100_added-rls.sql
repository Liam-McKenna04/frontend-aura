alter table "public"."components" enable row level security;

create policy "Enable read access for all users"
on "public"."components"
as permissive
for select
to public
using (true);


create policy "Enable update access for all users"
on "public"."components"
as permissive
for update
to public
using (true);


create policy "Enable read access for all users"
on "public"."sites"
as permissive
for select
to public
using (true);



