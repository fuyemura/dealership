"use server";

import { redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";

export type ActionResult = { error: string } | undefined;

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export interface DespesaFormData {
  categoria_id: string;
  descricao: string;
  valor: number;
  data_despesa: string; // YYYY-MM-DD
  recorrente: boolean;
  observacao: string | null;
}

// ─── Validação ────────────────────────────────────────────────────────────────

function validarInputs(data: DespesaFormData): ActionResult {
  if (!data.categoria_id) return { error: "Selecione a categoria." };
  if (!data.descricao.trim()) return { error: "A descrição é obrigatória." };
  if (data.descricao.trim().length > 255)
    return { error: "Descrição: máximo de 255 caracteres." };
  if (!data.valor || data.valor <= 0)
    return { error: "Informe um valor maior que zero." };
  if (!data.data_despesa) return { error: "A data da despesa é obrigatória." };
  if (data.observacao && data.observacao.trim().length > 500)
    return { error: "Observação: máximo de 500 caracteres." };
}

// ─── Ações ────────────────────────────────────────────────────────────────────

export async function criarDespesa(
  data: DespesaFormData
): Promise<ActionResult> {
  const validationError = validarInputs(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  // Garante que a categoria pertence à empresa
  const { data: cat } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select("id")
    .eq("id", data.categoria_id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!cat) return { error: "Categoria inválida." };

  const { error } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .insert({
      empresa_id:   usuarioAtual.empresa_id,
      categoria_id: data.categoria_id,
      descricao:    data.descricao.trim(),
      valor:        data.valor,
      data_despesa: data.data_despesa,
      recorrente:   data.recorrente,
      observacao:   data.observacao?.trim() || null,
      criado_por:   usuarioAtual.id,
    });

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  redirect("/financeiro/despesas");
}

export async function atualizarDespesa(
  id: string,
  data: DespesaFormData
): Promise<ActionResult> {
  const validationError = validarInputs(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  // Garante que a categoria pertence à empresa
  const { data: cat } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select("id")
    .eq("id", data.categoria_id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!cat) return { error: "Categoria inválida." };

  const { error } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .update({
      categoria_id: data.categoria_id,
      descricao:    data.descricao.trim(),
      valor:        data.valor,
      data_despesa: data.data_despesa,
      recorrente:   data.recorrente,
      observacao:   data.observacao?.trim() || null,
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao salvar. Tente novamente." };

  redirect("/financeiro/despesas");
}

export async function excluirDespesa(id: string): Promise<ActionResult> {
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  if (papel !== PAPEIS.ADMINISTRADOR) {
    return { error: "Apenas administradores podem excluir despesas." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) return { error: "Erro ao excluir. Tente novamente." };

  redirect("/financeiro/despesas");
}

export async function replicarDespesa(id: string): Promise<ActionResult> {
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  // Busca a despesa original garantindo isolamento por empresa
  const { data: original } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .select("categoria_id, descricao, valor, recorrente, observacao")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!original) return { error: "Despesa não encontrada." };
  if (!original.recorrente) return { error: "Apenas despesas recorrentes podem ser replicadas." };

  // Data de competência = 1º dia do mês corrente
  const hoje = new Date();
  const primeiroDiaMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;

  // Verifica se já existe uma cópia para este mês (mesma descrição + categoria + empresa + mês)
  const anoMes = primeiroDiaMes.slice(0, 7); // YYYY-MM
  const { data: existente } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .select("id")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .eq("categoria_id", original.categoria_id)
    .eq("descricao", original.descricao)
    .gte("data_despesa", `${anoMes}-01`)
    .lte("data_despesa", `${anoMes}-31`)
    .maybeSingle();

  if (existente) {
    return { error: "Esta despesa já foi replicada para o mês atual." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .insert({
      empresa_id:   usuarioAtual.empresa_id,
      categoria_id: original.categoria_id,
      descricao:    original.descricao,
      valor:        original.valor,
      data_despesa: primeiroDiaMes,
      recorrente:   true,
      observacao:   original.observacao,
      criado_por:   usuarioAtual.id,
    });

  if (error) return { error: "Erro ao replicar. Tente novamente." };

  redirect("/financeiro/despesas");
}
