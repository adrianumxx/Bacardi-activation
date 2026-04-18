import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { attributeSchemaPayload } from "@/lib/zod/catalog";
import { updateClientProfileAction } from "@/app/actions/profile";
import { getActiveCatalogForClient } from "@/lib/catalog/active";
import type { Json } from "@/types/database";

function parseSchema(raw: Json) {
  const parsed = attributeSchemaPayload.safeParse(raw);
  if (!parsed.success) return [];
  return parsed.data;
}

function readAttr(attrs: Json, key: string): unknown {
  if (!attrs || typeof attrs !== "object" || Array.isArray(attrs)) return undefined;
  return (attrs as Record<string, unknown>)[key];
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const catalog = await getActiveCatalogForClient();
  const schema = parseSchema(catalog?.attribute_schema ?? []);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: attrsRow } = await supabase
    .from("client_attributes")
    .select("attributes")
    .eq("profile_id", user.id)
    .maybeSingle();

  const attrs = attrsRow?.attributes ?? {};
  const saved = searchParams?.saved === "1";
  const error =
    typeof searchParams?.error === "string" ? searchParams.error : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profilo cliente</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Questi dati alimentano i requisiti delle attivazioni del catalogo attivo. Il catalogo
          definisce quali campi sono richiesti.
        </p>
      </div>

      {saved ? (
        <Card>
          <CardContent className="pt-6 text-sm">Profilo salvato.</CardContent>
        </Card>
      ) : null}
      {error ? (
        <Card>
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {!catalog ? (
        <Card>
          <CardHeader>
            <CardTitle>Nessun catalogo attivo</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Non è disponibile un catalogo nel periodo corrente. Quando sarà attivato, potrai
            compilare i campi richiesti qui.
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Anagrafica</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateClientProfileAction} className="space-y-6">
            <input type="hidden" name="attribute_schema" value={JSON.stringify(schema)} />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome referente</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name ?? ""}
                  placeholder="Mario Rossi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Ragione sociale / punto vendita</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  defaultValue={profile?.company_name ?? ""}
                  placeholder="Esempio Bar SRL"
                />
              </div>
            </div>

            {schema.length ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Dati per idoneità</div>
                  <div className="text-xs text-muted-foreground">
                    Catalogo: <span className="font-medium">{catalog?.name}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {schema.map((field) => {
                    const current = readAttr(attrs, field.key);
                    if (field.type === "boolean") {
                      const checked = Boolean(current);
                      return (
                        <label key={field.key} className="flex items-center gap-3 text-sm">
                          <input
                            className="h-4 w-4 accent-primary"
                            type="checkbox"
                            name={`attr__${field.key}`}
                            defaultChecked={checked}
                          />
                          <span>{field.label}</span>
                        </label>
                      );
                    }

                    if (field.type === "number") {
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`attr__${field.key}`}>{field.label}</Label>
                          <Input
                            id={`attr__${field.key}`}
                            name={`attr__${field.key}`}
                            type="number"
                            defaultValue={typeof current === "number" ? String(current) : ""}
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`attr__${field.key}`}>{field.label}</Label>
                        <Input
                          id={`attr__${field.key}`}
                          name={`attr__${field.key}`}
                          defaultValue={typeof current === "string" ? current : ""}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Il catalogo attivo non definisce ancora campi strutturati: contatta il team per
                aggiornare lo schema attributi.
              </p>
            )}

            <Button type="submit">Salva</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
