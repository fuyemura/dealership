import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PAPEIS } from "./roles";

/**
 * Verifica autenticação e retorna o cliente Supabase, o registro `usuario`
 * e o papel normalizado (minúsculas) do usuário logado.
 *
 * Redireciona para /login se não autenticado ou sem empresa vinculada.
 *
 * Envolto em React.cache para deduplicar a chamada dentro do mesmo render:
 * layout + page fazem a mesma consulta e agora compartilham o resultado.
 */
export const getUsuarioAutorizado = cache(async function getUsuarioAutorizado() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id, empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  // Normaliza para minúsculas — o banco armazena com inicial maiúscula (ex.: "Administrador")
  const papel =
    (usuarioAtual.papel as { nome_dominio: string } | null)
      ?.nome_dominio?.toLowerCase() ?? "";

  return { supabase, usuarioAtual, papel };
});

/**
 * Verifica autenticação e exige papel de Administrador.
 * Redireciona para /login se não autenticado ou /dashboard se não for admin.
 */
export async function getAdminAutorizado() {
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();

  if (papel !== PAPEIS.ADMINISTRADOR) redirect("/dashboard");

  return { supabase, usuarioAtual };
}
