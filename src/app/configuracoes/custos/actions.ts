"use server";

import { redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { validarUuid } from "@/lib/utils/validators";
import type { ActionResult } from "@/lib/types/actions";
export type { ActionResult };

// â”€â”€â”€ AÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€â”€ ValidaÃ§Ã£o server-side â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// NecessÃ¡ria mesmo com validaÃ§Ã£o client-side (Zod/RHF), pois server actions
// sÃ£o endpoints HTTP que podem ser chamados diretamente sem passar pelo cliente.

function validarInputs(
  nomeCusto: string,
  descricao: string | null
): ActionResult {
  const nome = nomeCusto.trim();
  if (!nome) return { error: "O nome do custo Ã© obrigatÃ³rio." };
  if (nome.length > 255) return { error: "Nome do custo: mÃ¡ximo de 255 caracteres." };
  if (descricao !== null && descricao.trim().length > 500)
    return { error: "DescriÃ§Ã£o: mÃ¡ximo de 500 caracteres." };
}

export async function criarCusto(
  nomeCusto: string,
  descricao: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nomeCusto, descricao);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_custo")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      nome_custo: nomeCusto.trim(),
      descricao: descricao?.trim() || null,
      criado_por: usuarioAtual.id,
    });

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  redirect("/configuracoes/custos");
}

export async function atualizarCusto(
  id: string,
  nomeCusto: string,
  descricao: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nomeCusto, descricao);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_custo")
    .update({
      nome_custo: nomeCusto.trim(),
      descricao: descricao?.trim() || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id); // garante isolamento por empresa

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  redirect("/configuracoes/custos");
}

export async function excluirCusto(id: string): Promise<ActionResult> {
  if (!validarUuid(id)) return { error: "ID invÃ¡lido." };

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  if (papel !== "administrador") {
    return { error: "Apenas administradores podem excluir tipos de custo." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_custo")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id); // garante isolamento por empresa

  if (error) {
    // FK violation: custo vinculado a manutenÃ§Ãµes
    if (error.code === "23503") {
      return {
        error:
          "Este tipo de custo estÃ¡ sendo utilizado em manutenÃ§Ãµes e nÃ£o pode ser excluÃ­do.",
      };
    }
    return { error: "Erro ao excluir. Tente novamente." };
  }

  redirect("/configuracoes/custos");
}
