"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | undefined;

// ─── Helper interno ───────────────────────────────────────────────────────────

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

  return { supabase, usuarioAtual, papel };
}

// ─── Validação server-side ────────────────────────────────────────────────────

function validarCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  // Rejeita sequências homogêneas (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (factor: number) => {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) {
      sum += parseInt(digits[i]) * (factor - i);
    }
    const rem = (sum * 10) % 11;
    return rem === 10 || rem === 11 ? 0 : rem;
  };

  return calc(10) === parseInt(digits[9]) && calc(11) === parseInt(digits[10]);
}

function sanitizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

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

  if (papel !== "administrador") {
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
