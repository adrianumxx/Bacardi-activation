-- Bacardi activations portal — schema + RLS

create extension if not exists "pgcrypto";

-- Profiles (1:1 auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'admin')),
  full_name text,
  company_name text,
  created_at timestamptz not null default now()
);

create table public.client_attributes (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  attributes jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.catalogs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at date not null,
  ends_at date not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  attribute_schema jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.activations (
  id uuid primary key default gen_random_uuid(),
  catalog_id uuid not null references public.catalogs (id) on delete cascade,
  type text not null check (type in ('ORDER_PROMO', 'ONSITE_EVENT')),
  title text not null,
  description text,
  product_name text,
  cocktail_name text,
  requirements jsonb not null default '{"rules":[]}'::jsonb,
  requirements_markdown text,
  bookings_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.booking_click_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  activation_id uuid not null references public.activations (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index activations_catalog_id_idx on public.activations (catalog_id);
create index booking_click_logs_profile_idx on public.booking_click_logs (profile_id);

-- New auth user → profile + empty attributes
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, company_name)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'company_name'
  );

  insert into public.client_attributes (profile_id, attributes)
  values (new.id, '{}'::jsonb);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.client_attributes enable row level security;
alter table public.catalogs enable row level security;
alter table public.activations enable row level security;
alter table public.booking_click_logs enable row level security;

-- Helper: current user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

grant usage on schema public to anon, authenticated;

-- profiles
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_self_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- client_attributes
create policy "client_attributes_select_self_or_admin"
  on public.client_attributes for select
  to authenticated
  using (profile_id = auth.uid() or public.is_admin());

create policy "client_attributes_update_self_or_admin"
  on public.client_attributes for update
  to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

create policy "client_attributes_insert_admin"
  on public.client_attributes for insert
  to authenticated
  with check (public.is_admin());

create policy "client_attributes_insert_self"
  on public.client_attributes for insert
  to authenticated
  with check (profile_id = auth.uid());

-- catalogs
create policy "catalogs_select_visible"
  on public.catalogs for select
  to authenticated
  using (
    public.is_admin()
    or (
      status = 'active'
      and (current_date between starts_at and ends_at)
    )
  );

create policy "catalogs_write_admin"
  on public.catalogs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- activations
create policy "activations_select_visible"
  on public.activations for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.catalogs c
      where c.id = activations.catalog_id
        and c.status = 'active'
        and (current_date between c.starts_at and c.ends_at)
    )
  );

create policy "activations_write_admin"
  on public.activations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- booking_click_logs
create policy "booking_logs_select_self_or_admin"
  on public.booking_click_logs for select
  to authenticated
  using (profile_id = auth.uid() or public.is_admin());

create policy "booking_logs_insert_self"
  on public.booking_click_logs for insert
  to authenticated
  with check (profile_id = auth.uid());
