"use server";

import { redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { validarUuid } from "@/lib/utils/validators";
import type { ActionResult } from "@/lib/types/actions";
export type { ActionResult };

// â”€â”€â”€ ValidaÃ§Ã£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function validarInputs(nome: string, descricao: string | null): ActionResult {
  const nomeTrimmed = nome.trim();
  if (!nomeTrimmed) return { error: "O nome da categoria Ã© obrigatÃ³rio." };
  if (nomeTrimmed.length > 255)
    return { error: "Nome da categoria: mÃ¡ximo de 255 caracteres." };
  if (descricao !== null && descricao.trim().length > 500)
    return { error: "DescriÃ§Ã£o: mÃ¡ximo de 500 caracteres." };
}

// â”€â”€â”€ AÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function criarCategoria(
  nome: string,
  descricao: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nome, descricao);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const { error } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      nome: nome.trim(),
      descricao: descricao?.trim() || null,
      criado_por: usuarioAtual.id,
    });

  if (error) {
    if (error.code === "23505") {
      return { error: "JÃ¡ existe uma categoria com este nome." };
    }
    return { error: "Erro ao salvar. Tente novamente." };
  }

  redirect("/financeiro/categorias");
}

export async function atualizarCategoria(
  id: string,
  nome: string,
  descricao: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nome, descricao);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const { error } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .update({
      nome: nome.trim(),
      descricao: descricao?.trim() || null,
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23505") {
      return { error: "JÃ¡ existe uma categoria com este nome." };
    }
    return { error: "Erro ao salvar. Tente novamente." };
  }

  redirect("/financeiro/categorias");
}

export async function excluirCategoria(id: string): Promise<ActionResult> {
  if (!validarUuid(id)) return { error: "ID invÃ¡lido." };

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();

  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  if (papel !== PAPEIS.ADMINISTRADOR) {
    return { error: "Apenas administradores podem excluir categorias." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23503") {
      return {
        error:
          "Esta categoria estÃ¡ sendo utilizada em despesas e nÃ£o pode ser excluÃ­da.",
      };
    }
    return { error: "Erro ao excluir. Tente novamente." };
  }

  redirect("/financeiro/categorias");
}
