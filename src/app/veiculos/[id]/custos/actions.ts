"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | undefined;

export interface ManutencaoFormData {
  custo_id: string;
  valor_manutencao: number;
  obs_manutencao: string | null;
  situacao_manutencao_id: string;
  data_conclusao: string;
}

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
    .select("id, empresa_id")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  return { supabase, usuarioAtual };
}

// ─── Validação server-side ────────────────────────────────────────────────────

function validar(data: ManutencaoFormData): ActionResult {
  if (!data.custo_id) return { error: "Selecione o tipo de custo." };
  if (!data.valor_manutencao || data.valor_manutencao <= 0)
    return { error: "Informe um valor de manutenção válido." };
  if (!data.data_conclusao) return { error: "Informe a data da manutenção." };
  if (!data.situacao_manutencao_id)
    return { error: "Selecione a situação da manutenção." };
  if (data.obs_manutencao && data.obs_manutencao.length > 500)
    return { error: "Observações: máximo de 500 caracteres." };
}

// ─── Criar manutenção ─────────────────────────────────────────────────────────
// Padrão: veiculoId é pré-fixado via .bind(null, id) no Server Component.

export async function criarManutencao(
  veiculoId: string,
  data: ManutencaoFormData
): Promise<ActionResult> {
  const err = validar(data);
  if (err) return err;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .insert({
      veiculo_id: veiculoId,
      custo_id: data.custo_id,
      empresa_id: usuarioAtual.empresa_id,
      valor_manutencao: data.valor_manutencao,
      obs_manutencao: data.obs_manutencao?.trim() || null,
      situacao_manutencao_id: data.situacao_manutencao_id,
      data_conclusao: data.data_conclusao,
      criado_por: usuarioAtual.id,
    });

  if (error) return { error: "Erro ao registrar o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
}

// ─── Atualizar manutenção ─────────────────────────────────────────────────────
// veiculoId é pré-fixado; id é o UUID da manutenção; data são os novos valores.

export async function atualizarManutencao(
  veiculoId: string,
  id: string,
  data: ManutencaoFormData
): Promise<ActionResult> {
  const err = validar(data);
  if (err) return err;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .update({
      custo_id: data.custo_id,
      valor_manutencao: data.valor_manutencao,
      obs_manutencao: data.obs_manutencao?.trim() || null,
      situacao_manutencao_id: data.situacao_manutencao_id,
      data_conclusao: data.data_conclusao,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao atualizar o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
}

// ─── Excluir manutenção ───────────────────────────────────────────────────────
// veiculoId é pré-fixado; id é o UUID da manutenção.

export async function excluirManutencao(
  veiculoId: string,
  id: string
): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo_manutencao")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao excluir o custo. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}/custos`);
}
