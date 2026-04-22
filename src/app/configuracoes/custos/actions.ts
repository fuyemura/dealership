"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | undefined;

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function getUsuarioAutorizado() {
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
      ?.nome_dominio ?? "";

  // Usuários comuns não têm acesso a esta área
  if (papel === "usuario") redirect("/dashboard");

  return { supabase, usuarioAtual, papel };
}

// ─── Ações ────────────────────────────────────────────────────────────────────

// ─── Validação server-side ────────────────────────────────────────────────────
// Necessária mesmo com validação client-side (Zod/RHF), pois server actions
// são endpoints HTTP que podem ser chamados diretamente sem passar pelo cliente.

function validarInputs(
  nomeCusto: string,
  descricao: string | null
): ActionResult {
  const nome = nomeCusto.trim();
  if (!nome) return { error: "O nome do custo é obrigatório." };
  if (nome.length > 255) return { error: "Nome do custo: máximo de 255 caracteres." };
  if (descricao !== null && descricao.trim().length > 500)
    return { error: "Descrição: máximo de 500 caracteres." };
}

export async function criarCusto(
  nomeCusto: string,
  descricao: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nomeCusto, descricao);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

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

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

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
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();

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
    // FK violation: custo vinculado a manutenções
    if (error.code === "23503") {
      return {
        error:
          "Este tipo de custo está sendo utilizado em manutenções e não pode ser excluído.",
      };
    }
    return { error: "Erro ao excluir. Tente novamente." };
  }

  redirect("/configuracoes/custos");
}
