import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { criarCusto } from "../actions";
import { CustoForm } from "../_components/custo-form";

export default async function NovoCustoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  const papel =
    (usuarioAtual.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio?.toLowerCase() ?? "";
  if (papel === "usuario") redirect("/dashboard");

  return <CustoForm saveAction={criarCusto} />;
}
