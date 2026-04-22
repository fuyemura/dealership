"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminAutorizado } from "@/lib/auth/guards";
import { validarCpf, sanitizarCpf } from "@/lib/utils/validators";

export type ActionResult = { error: string } | undefined;


// ─── Validação server-side ────────────────────────────────────────────────────


// ─── Convidar novo usuário ────────────────────────────────────────────────────

export async function convidarUsuario(
  nomeUsuario: string,
  email: string,
  cpf: string,
  papelUsuarioId: string
): Promise<ActionResult> {
  // Validação server-side
  if (!nomeUsuario.trim())
    return { error: "O nome é obrigatório." };
  if (nomeUsuario.trim().length > 255)
    return { error: "Nome: máximo de 255 caracteres." };
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return { error: "E-mail inválido." };
  if (!validarCpf(cpf))
    return { error: "CPF inválido. Informe os 11 dígitos." };
  if (!papelUsuarioId)
    return { error: "Selecione um papel para o usuário." };

  const { supabase, usuarioAtual } = await getAdminAutorizado();
  const adminClient = createAdminClient();
  const cpfSanitizado = sanitizarCpf(cpf);

  // Verificar duplicidade de CPF na empresa
  const { data: cpfExistente } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .eq("cpf", cpfSanitizado)
    .maybeSingle();

  if (cpfExistente) return { error: "Já existe um usuário com este CPF." };

  // Criar usuário no Supabase Auth via convite (envia e-mail automaticamente)
  const { data: authData, error: authError } =
    await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/redefinir-senha`,
    });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já está cadastrado no sistema." };
    }
    return { error: "Não foi possível enviar o convite. Tente novamente." };
  }

  // Inserir na tabela usuario scoped à empresa
  const { error: dbError } = await supabase
    .schema("dealership")
    .from("usuario")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      auth_id: authData.user.id,
      email_usuario: email.trim().toLowerCase(),
      cpf: cpfSanitizado,
      nome_usuario: nomeUsuario.trim(),
      papel_usuario_id: papelUsuarioId,
    });

  if (dbError) {
    // Reverter: excluir o usuário do Auth para não deixar órfão
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(authData.user.id);
    if (deleteError) {
      console.error("[convidarUsuario] falha ao reverter usuário órfão no Auth:", authData.user.id, deleteError.message);
    }

    if (dbError.code === "23505") {
      return { error: "Este e-mail ou CPF já existe na empresa." };
    }
    return { error: "Erro ao cadastrar o usuário. Tente novamente." };
  }

  redirect("/configuracoes/usuarios");
}

// ─── Atualizar usuário ────────────────────────────────────────────────────────

export async function atualizarUsuario(
  id: string,
  nomeUsuario: string,
  cpf: string,
  papelUsuarioId: string
): Promise<ActionResult> {
  if (!nomeUsuario.trim())
    return { error: "O nome é obrigatório." };
  if (nomeUsuario.trim().length > 255)
    return { error: "Nome: máximo de 255 caracteres." };
  if (!validarCpf(cpf))
    return { error: "CPF inválido. Informe os 11 dígitos." };
  if (!papelUsuarioId)
    return { error: "Selecione um papel para o usuário." };

  const { supabase, usuarioAtual } = await getAdminAutorizado();
  const cpfSanitizado = sanitizarCpf(cpf);

  // Verificar duplicidade de CPF na empresa (excluindo o próprio usuário)
  const { data: cpfExistente } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .eq("cpf", cpfSanitizado)
    .neq("id", id)
    .maybeSingle();

  if (cpfExistente)
    return { error: "Já existe outro usuário com este CPF." };

  const { error } = await supabase
    .schema("dealership")
    .from("usuario")
    .update({
      nome_usuario: nomeUsuario.trim(),
      cpf: cpfSanitizado,
      papel_usuario_id: papelUsuarioId,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id); // isolamento por empresa

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  revalidatePath("/configuracoes/usuarios");
  redirect("/configuracoes/usuarios");
}

// ─── Excluir usuário ──────────────────────────────────────────────────────────

export async function excluirUsuario(id: string): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getAdminAutorizado();

  // Impede auto-exclusão
  if (id === usuarioAtual.id) {
    return { error: "Você não pode excluir sua própria conta." };
  }

  // Busca auth_id para excluir do Supabase Auth em seguida
  const { data: alvo } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("auth_id")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id) // isolamento por empresa
    .single();

  if (!alvo) return { error: "Usuário não encontrado." };

  // 1. Remove da tabela dealer.usuario
  const { error: dbError } = await supabase
    .schema("dealership")
    .from("usuario")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (dbError) return { error: "Erro ao excluir. Tente novamente." };

  // 2. Remove do Supabase Auth (best-effort: não reverte se falhar)
  const adminClient = createAdminClient();
  await adminClient.auth.admin.deleteUser(alvo.auth_id);

  redirect("/configuracoes/usuarios");
}
