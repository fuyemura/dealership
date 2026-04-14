"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { validarCpf, sanitizarCpf } from "@/lib/utils/validators";

export type ActionResult = { error: string } | undefined;

// ─── Validação server-side ────────────────────────────────────────────────────


function sanitizarTelefone(tel: string): string {
  return tel.replace(/\D/g, "");
}

function validarInputs(
  nome: string,
  cpf: string,
  telefone: string | null,
  email: string | null
): ActionResult {
  if (!nome.trim()) return { error: "O nome do cliente é obrigatório." };
  if (nome.trim().length > 255)
    return { error: "Nome: máximo de 255 caracteres." };
  if (!validarCpf(cpf)) return { error: "CPF inválido. Informe os 11 dígitos." };
  if (telefone && sanitizarTelefone(telefone).length > 20)
    return { error: "Telefone inválido." };
  if (email && email.trim().length > 255)
    return { error: "E-mail: máximo de 255 caracteres." };
  if (
    email &&
    email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  )
    return { error: "E-mail inválido." };
}

// ─── Criar cliente ────────────────────────────────────────────────────────────

export async function criarCliente(
  nome: string,
  cpf: string,
  telefone: string | null,
  email: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nome, cpf, telefone, email);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();
  const cpfSanitizado = sanitizarCpf(cpf);

  const { error } = await supabase
    .schema("dealership")
    .from("cliente")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      cpf: cpfSanitizado,
      nome_cliente: nome.trim(),
      telefone_cliente: telefone ? sanitizarTelefone(telefone) : null,
      email_cliente: email?.trim().toLowerCase() || null,
      criado_por: usuarioAtual.id,
    });

  if (error) {
    if (error.code === "23505")
      return { error: "Já existe um cliente com este CPF cadastrado." };
    return { error: "Erro ao cadastrar o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

// ─── Atualizar cliente ────────────────────────────────────────────────────────

export async function atualizarCliente(
  id: string,
  nome: string,
  cpf: string,
  telefone: string | null,
  email: string | null
): Promise<ActionResult> {
  const validationError = validarInputs(nome, cpf, telefone, email);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();
  const cpfSanitizado = sanitizarCpf(cpf);

  const { error } = await supabase
    .schema("dealership")
    .from("cliente")
    .update({
      cpf: cpfSanitizado,
      nome_cliente: nome.trim(),
      telefone_cliente: telefone ? sanitizarTelefone(telefone) : null,
      email_cliente: email?.trim().toLowerCase() || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23505")
      return { error: "Já existe um cliente com este CPF cadastrado." };
    return { error: "Erro ao atualizar o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

// ─── Excluir cliente ──────────────────────────────────────────────────────────

export async function excluirCliente(id: string): Promise<ActionResult> {
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();

  if (papel !== PAPEIS.ADMINISTRADOR) {
    return { error: "Apenas administradores podem excluir clientes." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("cliente")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23503")
      return {
        error:
          "Este cliente possui vínculos com vendas e não pode ser excluído.",
      };
    return { error: "Erro ao excluir o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}
