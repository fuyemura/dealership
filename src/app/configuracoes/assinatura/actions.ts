"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminAutorizado } from "@/lib/auth/guards";

export type ActionResult = { error: string } | { success: true };

// ─── Ação ─────────────────────────────────────────────────────────────────────

export async function cancelarAssinatura(
  motivo: string
): Promise<ActionResult> {
  const motivoTrimmed = motivo.trim();
  if (!motivoTrimmed)
    return { error: "Selecione um motivo para o cancelamento." };
  if (motivoTrimmed.length > 500)
    return { error: "Motivo: máximo de 500 caracteres." };

  const { supabase, usuarioAtual } = await getAdminAutorizado();

  // Busca o ID do status "cancelada" na tabela de domínios
  const { data: dominioCancelada } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id")
    .eq("grupo_dominio", "situacao_assinatura")
    .eq("nome_dominio", "cancelada")
    .single();

  if (!dominioCancelada)
    return { error: "Erro interno. Tente novamente." };

  // UNIQUE (empresa_id) garante exatamente 1 registro por empresa
  const { data: assinaturaAtiva } = await supabase
    .schema("dealership")
    .from("assinatura")
    .select("id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .maybeSingle();

  if (!assinaturaAtiva)
    return { error: "Nenhuma assinatura encontrada." };

  const { error } = await supabase
    .schema("dealership")
    .from("assinatura")
    .update({
      situacao_assinatura_id: dominioCancelada.id,
      motivo_cancelamento: motivoTrimmed,
      data_cancelamento: new Date().toISOString().split("T")[0],
    })
    .eq("id", assinaturaAtiva.id);

  if (error)
    return { error: "Não foi possível cancelar a assinatura. Tente novamente." };

  revalidatePath("/configuracoes/assinatura");
  return { success: true };
}

// ─── Trocar plano ─────────────────────────────────────────────────────────────

export async function trocarPlano(planoId: string): Promise<ActionResult> {
  // Valida formato UUID para prevenir injection
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!planoId || !uuidRegex.test(planoId))
    return { error: "Plano inválido." };

  const { supabase, usuarioAtual } = await getAdminAutorizado();

  // Verifica se o plano existe e está ativo (previne troca para plano inativo/IDOR)
  const { data: plano } = await supabase
    .schema("dealership")
    .from("plano")
    .select("id")
    .eq("id", planoId)
    .eq("plano_ativo", true)
    .maybeSingle();

  if (!plano) return { error: "Plano não encontrado ou não disponível." };

  // UNIQUE (empresa_id) garante exatamente 1 registro por empresa
  const { data: assinaturaAtual } = await supabase
    .schema("dealership")
    .from("assinatura")
    .select("id, plano_id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .maybeSingle();

  if (!assinaturaAtual)
    return { error: "Nenhuma assinatura encontrada." };

  if (assinaturaAtual.plano_id === planoId)
    return { error: "Este já é o seu plano atual." };

  const { error } = await supabase
    .schema("dealership")
    .from("assinatura")
    .update({
      plano_id: planoId,
    })
    .eq("id", assinaturaAtual.id);

  if (error)
    return { error: "Não foi possível trocar de plano. Tente novamente." };

  revalidatePath("/configuracoes/assinatura");
  return { success: true };
}

// ─── Reativar assinatura ──────────────────────────────────────────────────────

export async function reativarAssinatura(planoId: string): Promise<ActionResult> {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!planoId || !uuidRegex.test(planoId))
    return { error: "Plano inválido." };

  const { supabase, usuarioAtual } = await getAdminAutorizado();

  // Verifica se o plano existe e está ativo (previne IDOR)
  const { data: plano } = await supabase
    .schema("dealership")
    .from("plano")
    .select("id")
    .eq("id", planoId)
    .eq("plano_ativo", true)
    .maybeSingle();

  if (!plano) return { error: "Plano não encontrado ou não disponível." };

  // Busca o ID do status "ativa" na tabela de domínios
  const { data: dominioAtiva } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id")
    .eq("grupo_dominio", "situacao_assinatura")
    .eq("nome_dominio", "ativa")
    .single();

  if (!dominioAtiva) return { error: "Erro interno. Tente novamente." };

  // Busca o registro único da empresa (UNIQUE empresa_id)
  const { data: assinatura } = await supabase
    .schema("dealership")
    .from("assinatura")
    .select("id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .maybeSingle();

  if (!assinatura)
    return { error: "Nenhuma assinatura encontrada." };

  // Calcula data_inicio e data_fim (+1 mês)
  const hoje = new Date();
  const dataInicio = hoje.toISOString().split("T")[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 1);
  const dataFimStr = dataFim.toISOString().split("T")[0];

  // Atualiza o registro existente — sem criar nova linha
  const { error } = await supabase
    .schema("dealership")
    .from("assinatura")
    .update({
      plano_id: planoId,
      situacao_assinatura_id: dominioAtiva.id,
      data_inicio: dataInicio,
      data_fim: dataFimStr,
      data_cancelamento: null,
      motivo_cancelamento: null,
    })
    .eq("id", assinatura.id);

  if (error)
    return { error: "Não foi possível reativar a assinatura. Tente novamente." };

  revalidatePath("/configuracoes/assinatura");
  return { success: true };
}
