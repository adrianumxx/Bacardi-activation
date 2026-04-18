-- Esegui in Supabase → SQL Editor (progetto remoto).
-- Idempotente: puoi rilanciarlo dopo errori o policy duplicate.
-- Serve per il catalogo pubblico senza login (lettura anon).

grant select on public.catalogs to anon;
grant select on public.activations to anon;

drop policy if exists "catalogs_select_visible_anon" on public.catalogs;
create policy "catalogs_select_visible_anon"
  on public.catalogs for select
  to anon
  using (
    status = 'active'
    and (current_date between starts_at and ends_at)
  );

drop policy if exists "activations_select_visible_anon" on public.activations;
create policy "activations_select_visible_anon"
  on public.activations for select
  to anon
  using (
    exists (
      select 1
      from public.catalogs c
      where c.id = activations.catalog_id
        and c.status = 'active'
        and (current_date between c.starts_at and c.ends_at)
    )
  );
