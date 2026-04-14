/**
 * Guards de autenticação compartilhados entre Server Actions.
 *
 * Elimina a duplicação do padrão auth+empresa_id presente em múltiplos
 * arquivos actions.ts. Cada guard retorna o cliente Supabase, o usuário
 * atual (com empresa_id) e o papel normalizado (lowercase).
 *
 * — getUsuarioAutorizado : qualquer usuário autenticado com empresa ativa
 * — getAdminAutorizado   : somente papel "administrador"
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PAPEIS } from "./roles";

export interface UsuarioAtual {
  id: string;
  empresa_id: string;
}

export async function getUsuarioAutorizado() {
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

  const papel =
    (usuarioAtual.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio?.toLowerCase() ?? "";

  return { supabase, usuarioAtual: usuarioAtual as UsuarioAtual, papel };
}

export async function getAdminAutorizado() {
  const result = await getUsuarioAutorizado();
  if (result.papel !== PAPEIS.ADMINISTRADOR) redirect("/dashboard");
  return result;
}
