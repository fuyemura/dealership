"use server";

import { revalidatePath } from "next/cache";
import { getUsuarioAutorizado } from "@/lib/auth/guards";

export type ActionResult = { error: string } | undefined;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ManutencaoFormData {
  custo_id: string;
  valor_manutencao: number;
  data_conclusao: string;
  situacao_manutencao_id: string;
  obs_manutencao: string | null;
}

// ─── Validação ────────────────────────────────────────────────────────────────

function validarDados(data: ManutencaoFormData): ActionResult {
  if (!data.custo_id) return { error: "Selecione o tipo de custo." };
  if (!data.valor_manutencao || data.valor_manutencao <= 0)
    return { error: "Informe um valor maior que zero." };
  if (!data.data_conclusao) return { error: "Informe a data." };
  if (!data.situacao_manutencao_id) return { error: "Selecione a situação." };
  if (data.obs_manutencao && data.obs_manutencao.length > 500)
    return { error: "Observações: máximo de 500 caracteres." };
}

// ─── Criar manutenção ─────────────────────────────────────────────────────────

export async function criarManutencao(
  veiculoId: string,
  data: ManutencaoFormData
): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  // Verifica posse do veículo
  const { data: veiculo } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select("id")
    .eq("id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!veiculo) return { error: "Veículo não encontrado." };

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .insert({
      veiculo_id: veiculoId,
      empresa_id: usuarioAtual.empresa_id,
      custo_id: data.custo_id,
      valor_manutencao: data.valor_manutencao,
      data_conclusao: data.data_conclusao,
      situacao_manutencao_id: data.situacao_manutencao_id,
      obs_manutencao: data.obs_manutencao?.trim() || null,
      criado_por: usuarioAtual.id,
    });

  if (error) return { error: "Erro ao registrar o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
  revalidatePath(`/veiculos/${veiculoId}`);
}

// ─── Atualizar manutenção ─────────────────────────────────────────────────────

export async function atualizarManutencao(
  veiculoId: string,
  manutencaoId: string,
  data: ManutencaoFormData
): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .update({
      custo_id: data.custo_id,
      valor_manutencao: data.valor_manutencao,
      data_conclusao: data.data_conclusao,
      situacao_manutencao_id: data.situacao_manutencao_id,
      obs_manutencao: data.obs_manutencao?.trim() || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", manutencaoId)
    .eq("veiculo_id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao atualizar o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
  revalidatePath(`/veiculos/${veiculoId}`);
}

// ─── Excluir manutenção ───────────────────────────────────────────────────────

export async function excluirManutencao(
  veiculoId: string,
  manutencaoId: string
): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .delete()
    .eq("id", manutencaoId)
    .eq("veiculo_id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao excluir o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
  revalidatePath(`/veiculos/${veiculoId}`);
}
