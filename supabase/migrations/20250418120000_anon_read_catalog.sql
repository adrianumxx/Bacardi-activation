-- Public (anon) read of active quarterly catalog + activations for brochure pages.

create policy "catalogs_select_visible_anon"
  on public.catalogs for select
  to anon
  using (
    status = 'active'
    and (current_date between starts_at and ends_at)
  );

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
