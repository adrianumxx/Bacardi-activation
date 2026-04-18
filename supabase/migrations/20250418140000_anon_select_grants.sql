-- Lettura pubblica catalogo/attivazioni: le policy RLS anon non bastano senza privilegio SELECT sulla tabella.

grant select on public.catalogs to anon;
grant select on public.activations to anon;
