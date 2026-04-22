"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { validarCpf, sanitizarCpf, validarUuid } from "@/lib/utils/validators";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/types/actions";
export type { ActionResult };

export type ClientePayload = {
  nome_cliente: string;
  cpf: string;
  telefone_cliente: string | null;
  email_cliente: string | null;
  // EndereÃ§o (opcional â€” enviar todos ou nenhum)
  cep?: string;
  logradouro?: string;
  numero_logradouro?: number;
  complemento_logradouro?: string | null;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

// â”€â”€â”€ ValidaÃ§Ã£o server-side â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function sanitizarTelefone(tel: string): string {
  return tel.replace(/\D/g, "");
}

function validarInputs(payload: ClientePayload): ActionResult {
  const { nome_cliente, cpf, telefone_cliente, email_cliente } = payload;

  if (!nome_cliente.trim()) return { error: "O nome do cliente Ã© obrigatÃ³rio." };
  if (nome_cliente.trim().length > 255)
    return { error: "Nome: mÃ¡ximo de 255 caracteres." };
  if (!validarCpf(cpf)) return { error: "CPF invÃ¡lido. Informe os 11 dÃ­gitos." };
  if (telefone_cliente && sanitizarTelefone(telefone_cliente).length > 20)
    return { error: "Telefone invÃ¡lido." };
  if (email_cliente && email_cliente.trim().length > 255)
    return { error: "E-mail: mÃ¡ximo de 255 caracteres." };
  if (
    email_cliente &&
    email_cliente.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_cliente.trim())
  )
    return { error: "E-mail invÃ¡lido." };

  // ValidaÃ§Ã£o do endereÃ§o: se qualquer campo estiver preenchido, valida todos
  const temEndereco = payload.cep || payload.logradouro || payload.bairro || payload.cidade || payload.estado;
  if (temEndereco) {
    if (!payload.cep || !/^\d{5}-\d{3}$/.test(payload.cep))
      return { error: "CEP invÃ¡lido." };
    if (!payload.logradouro?.trim())
      return { error: "O logradouro Ã© obrigatÃ³rio." };
    if (!payload.numero_logradouro || payload.numero_logradouro <= 0)
      return { error: "O nÃºmero do logradouro Ã© invÃ¡lido." };
    if (!payload.bairro?.trim())
      return { error: "O bairro Ã© obrigatÃ³rio." };
    if (!payload.cidade?.trim())
      return { error: "A cidade Ã© obrigatÃ³ria." };
    if (!payload.estado || payload.estado.length !== 2)
      return { error: "Informe a UF." };
  }
}

// â”€â”€â”€ Criar cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function criarCliente(payload: ClientePayload): Promise<ActionResult> {
  const validationError = validarInputs(payload);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();
  const admin = createAdminClient();
  const cpfSanitizado = sanitizarCpf(payload.cpf);

  // Criar localizacao se endereÃ§o fornecido
  let localizacao_id: string | null = null;
  const temEndereco = payload.cep && payload.logradouro && payload.bairro && payload.cidade && payload.estado;
  if (temEndereco) {
    const { data: loc, error: locError } = await admin
      .schema("dealership")
      .from("localizacao")
      .insert({
        cep: payload.cep!,
        logradouro: payload.logradouro!.trim(),
        numero_logradouro: payload.numero_logradouro!,
        complemento_logradouro: payload.complemento_logradouro?.trim() || null,
        bairro: payload.bairro!.trim(),
        cidade: payload.cidade!.trim(),
        estado: payload.estado!.toUpperCase(),
      })
      .select("id")
      .single();

    if (locError) return { error: "Erro ao salvar o endereÃ§o. Tente novamente." };
    localizacao_id = loc.id;
  }

  const { error } = await supabase
    .schema("dealership")
    .from("cliente")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      cpf: cpfSanitizado,
      nome_cliente: payload.nome_cliente.trim(),
      telefone_cliente: payload.telefone_cliente
        ? sanitizarTelefone(payload.telefone_cliente)
        : null,
      email_cliente: payload.email_cliente?.trim().toLowerCase() || null,
      localizacao_id,
      criado_por: usuarioAtual.id,
    });

  if (error) {
    // Cleanup: se localizacao foi criada, remove para evitar órfão
    if (localizacao_id) {
      await admin
        .schema("dealership")
        .from("localizacao")
        .delete()
        .eq("id", localizacao_id);
    }
    if (error.code === "23505")
      return { error: "JÃ¡ existe um cliente com este CPF cadastrado." };
    return { error: "Erro ao cadastrar o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

// â”€â”€â”€ Atualizar cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function atualizarCliente(
  id: string,
  payload: ClientePayload
): Promise<ActionResult> {
  const validationError = validarInputs(payload);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();
  const admin = createAdminClient();
  const cpfSanitizado = sanitizarCpf(payload.cpf);

  // Buscar localizacao_id atual do cliente
  const { data: clienteAtual } = await supabase
    .schema("dealership")
    .from("cliente")
    .select("localizacao_id")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  const localizacaoAtualId = (clienteAtual as { localizacao_id: string | null } | null)?.localizacao_id ?? null;

  const temEndereco = payload.cep && payload.logradouro && payload.bairro && payload.cidade && payload.estado;
  let localizacao_id: string | null = null;

  if (temEndereco) {
    const locData = {
      cep: payload.cep!,
      logradouro: payload.logradouro!.trim(),
      numero_logradouro: payload.numero_logradouro!,
      complemento_logradouro: payload.complemento_logradouro?.trim() || null,
      bairro: payload.bairro!.trim(),
      cidade: payload.cidade!.trim(),
      estado: payload.estado!.toUpperCase(),
      atualizado_em: new Date().toISOString(),
    };

    if (localizacaoAtualId) {
      // Atualizar localizacao existente
      const { error: locError } = await admin
        .schema("dealership")
        .from("localizacao")
        .update(locData)
        .eq("id", localizacaoAtualId);

      if (locError) return { error: "Erro ao atualizar o endereÃ§o. Tente novamente." };
      localizacao_id = localizacaoAtualId;
    } else {
      // Criar nova localizacao
      const { data: loc, error: locError } = await admin
        .schema("dealership")
        .from("localizacao")
        .insert(locData)
        .select("id")
        .single();

      if (locError) return { error: "Erro ao salvar o endereÃ§o. Tente novamente." };
      localizacao_id = loc.id;
    }
  } else if (localizacaoAtualId) {
    // EndereÃ§o removido: primeiro desvincula o cliente, depois exclui a localizacao
    const { error: updateVinculoError } = await supabase
      .schema("dealership")
      .from("cliente")
      .update({
        cpf: cpfSanitizado,
        nome_cliente: payload.nome_cliente.trim(),
        telefone_cliente: payload.telefone_cliente
          ? sanitizarTelefone(payload.telefone_cliente)
          : null,
        email_cliente: payload.email_cliente?.trim().toLowerCase() || null,
        localizacao_id: null,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("empresa_id", usuarioAtual.empresa_id);

    if (updateVinculoError) {
      if (updateVinculoError.code === "23505")
        return { error: "JÃ¡ existe um cliente com este CPF cadastrado." };
      return { error: "Erro ao atualizar o cliente. Tente novamente." };
    }

    const { error: deleteLocError } = await admin
      .schema("dealership")
      .from("localizacao")
      .delete()
      .eq("id", localizacaoAtualId);

    if (deleteLocError) {
      // NÃ£o bloqueia o fluxo â€” cliente jÃ¡ foi atualizado com sucesso
      console.error("Erro ao excluir localizaÃ§Ã£o Ã³rfÃ£:", deleteLocError.message);
    }

    revalidatePath("/clientes");
    redirect("/clientes");
  }

  const { error } = await supabase
    .schema("dealership")
    .from("cliente")
    .update({
      cpf: cpfSanitizado,
      nome_cliente: payload.nome_cliente.trim(),
      telefone_cliente: payload.telefone_cliente
        ? sanitizarTelefone(payload.telefone_cliente)
        : null,
      email_cliente: payload.email_cliente?.trim().toLowerCase() || null,
      localizacao_id,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23505")
      return { error: "JÃ¡ existe um cliente com este CPF cadastrado." };
    return { error: "Erro ao atualizar o cliente. Tente novamente." };
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

// â”€â”€â”€ Excluir cliente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function excluirCliente(id: string): Promise<ActionResult> {
  if (!validarUuid(id)) return { error: "ID invÃ¡lido." };

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  const admin = createAdminClient();

  if (papel !== PAPEIS.ADMINISTRADOR) {
    return { error: "Apenas administradores podem excluir clientes." };
  }

  // Buscar localizacao_id para excluir junto
  const { data: clienteAtual } = await supabase
    .schema("dealership")
    .from("cliente")
    .select("localizacao_id")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  const localizacaoId = (clienteAtual as { localizacao_id: string | null } | null)?.localizacao_id ?? null;

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
          "Este cliente possui vÃ­nculos com vendas e nÃ£o pode ser excluÃ­do.",
      };
    return { error: "Erro ao excluir o cliente. Tente novamente." };
  }

  // Excluir localizacao Ã³rfã apÃ³s remover o cliente
  if (localizacaoId) {
    await admin
      .schema("dealership")
      .from("localizacao")
      .delete()
      .eq("id", localizacaoId);
  }

  revalidatePath("/clientes");
  redirect("/clientes");
}

