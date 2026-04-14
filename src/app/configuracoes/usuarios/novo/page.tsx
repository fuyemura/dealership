import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { convidarUsuario } from "../actions";
import { UsuarioForm } from "../_components/usuario-form";

export default async function NovoUsuarioPage() {
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

  // Somente administradores podem convidar usuários
  if (papel !== "administrador") redirect("/dashboard");

  const { data: papeis } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id, nome_dominio")
    .eq("grupo_dominio", "papel_usuario")
    .order("nome_dominio");

  return (
    <UsuarioForm
      saveAction={convidarUsuario}
      papeis={papeis ?? []}
    />
  );
}
