"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | undefined;

export interface VeiculoFormData {
  placa: string;
  renavam: string;
  numero_chassi: string;
  marca_veiculo_id: string;
  modelo_veiculo_id: string;
  combustivel_veiculo_id: string;
  cambio_veiculo_id: string;
  direcao_veiculo_id: string;
  situacao_veiculo_id: string;
  ano_fabricacao: number;
  ano_modelo: number;
  cor_veiculo: string;
  quantidade_portas: number;
  quilometragem: number;
  vidro_eletrico: boolean;
  trava_eletrica: boolean;
  laudo_aprovado: boolean;
  data_compra: string;
  preco_compra: number;
  preco_venda: number | null;
  data_venda: string | null;
  data_entrega: string | null;
  descricao: string | null;
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

const PLACA_REGEX = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

function validarDados(data: VeiculoFormData): ActionResult {
  const placa = data.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!PLACA_REGEX.test(placa))
    return { error: "Placa inválida. Use o formato ABC1234 ou ABC1D23." };

  const renavam = data.renavam.replace(/\D/g, "");
  if (renavam.length !== 11)
    return { error: "RENAVAM deve ter exatamente 11 dígitos." };

  if (!data.numero_chassi.trim() || data.numero_chassi.length > 20)
    return { error: "Número do chassi inválido (máximo 20 caracteres)." };

  if (!data.marca_veiculo_id) return { error: "Selecione a marca." };
  if (!data.modelo_veiculo_id) return { error: "Selecione o modelo." };
  if (!data.combustivel_veiculo_id) return { error: "Selecione o tipo de combustível." };
  if (!data.cambio_veiculo_id) return { error: "Selecione a transmissão." };
  if (!data.direcao_veiculo_id) return { error: "Selecione o tipo de direção." };
  if (!data.situacao_veiculo_id) return { error: "Selecione a situação do veículo." };

  if (data.ano_fabricacao < 1900 || data.ano_fabricacao > new Date().getFullYear() + 1)
    return { error: "Ano de fabricação inválido." };
  if (data.ano_modelo < 1900 || data.ano_modelo > new Date().getFullYear() + 2)
    return { error: "Ano do modelo inválido." };

  if (!data.cor_veiculo.trim() || data.cor_veiculo.length > 20)
    return { error: "Cor inválida (máximo 20 caracteres)." };

  if (data.quantidade_portas < 1 || data.quantidade_portas > 10)
    return { error: "Quantidade de portas inválida." };

  if (data.quilometragem < 0)
    return { error: "Quilometragem inválida." };

  if (!data.data_compra)
    return { error: "Data de compra é obrigatória." };

  if (data.preco_compra <= 0)
    return { error: "Preço de compra inválido." };

  if (data.descricao && data.descricao.length > 1000)
    return { error: "Descrição: máximo de 1000 caracteres." };
}

// ─── Criar veículo ────────────────────────────────────────────────────────────

export async function criarVeiculo(data: VeiculoFormData): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const placa = data.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const renavam = data.renavam.replace(/\D/g, "");

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo")
    .insert({
      empresa_id: usuarioAtual.empresa_id,
      placa,
      renavam,
      numero_chassi: data.numero_chassi.trim().toUpperCase(),
      marca_veiculo_id: data.marca_veiculo_id,
      modelo_veiculo_id: data.modelo_veiculo_id,
      combustivel_veiculo_id: data.combustivel_veiculo_id,
      cambio_veiculo_id: data.cambio_veiculo_id,
      direcao_veiculo_id: data.direcao_veiculo_id,
      situacao_veiculo_id: data.situacao_veiculo_id,
      ano_fabricacao: data.ano_fabricacao,
      ano_modelo: data.ano_modelo,
      cor_veiculo: data.cor_veiculo.trim(),
      quantidade_portas: data.quantidade_portas,
      quilometragem: data.quilometragem,
      vidro_eletrico: data.vidro_eletrico,
      trava_eletrica: data.trava_eletrica,
      laudo_aprovado: data.laudo_aprovado,
      data_compra: data.data_compra,
      preco_compra: data.preco_compra,
      preco_venda: data.preco_venda ?? null,
      data_venda: data.data_venda ?? null,
      data_entrega: data.data_entrega ?? null,
      descricao: data.descricao?.trim() || null,
      criado_por: usuarioAtual.id,
      atualizado_por: usuarioAtual.id,
    });

  if (error) {
    if (error.code === "23505") {
      if (error.message.includes("placa"))
        return { error: "Já existe um veículo com esta placa cadastrado." };
      if (error.message.includes("chassi"))
        return { error: "Já existe um veículo com este número de chassi." };
    }
    return { error: "Erro ao cadastrar o veículo. Tente novamente." };
  }

  revalidatePath("/veiculos");
  redirect("/veiculos");
}

// ─── Atualizar veículo ────────────────────────────────────────────────────────

export async function atualizarVeiculo(
  id: string,
  data: VeiculoFormData
): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const placa = data.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const renavam = data.renavam.replace(/\D/g, "");

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo")
    .update({
      placa,
      renavam,
      numero_chassi: data.numero_chassi.trim().toUpperCase(),
      marca_veiculo_id: data.marca_veiculo_id,
      modelo_veiculo_id: data.modelo_veiculo_id,
      combustivel_veiculo_id: data.combustivel_veiculo_id,
      cambio_veiculo_id: data.cambio_veiculo_id,
      direcao_veiculo_id: data.direcao_veiculo_id,
      situacao_veiculo_id: data.situacao_veiculo_id,
      ano_fabricacao: data.ano_fabricacao,
      ano_modelo: data.ano_modelo,
      cor_veiculo: data.cor_veiculo.trim(),
      quantidade_portas: data.quantidade_portas,
      quilometragem: data.quilometragem,
      vidro_eletrico: data.vidro_eletrico,
      trava_eletrica: data.trava_eletrica,
      laudo_aprovado: data.laudo_aprovado,
      data_compra: data.data_compra,
      preco_compra: data.preco_compra,
      preco_venda: data.preco_venda ?? null,
      data_venda: data.data_venda ?? null,
      data_entrega: data.data_entrega ?? null,
      descricao: data.descricao?.trim() || null,
      atualizado_por: usuarioAtual.id,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23505") {
      if (error.message.includes("placa"))
        return { error: "Já existe um veículo com esta placa cadastrado." };
      if (error.message.includes("chassi"))
        return { error: "Já existe um veículo com este número de chassi." };
    }
    return { error: "Erro ao atualizar o veículo. Tente novamente." };
  }

  revalidatePath("/veiculos");
  revalidatePath(`/veiculos/${id}`);
  redirect("/veiculos");
}

// ─── Excluir veículo ──────────────────────────────────────────────────────────

export async function excluirVeiculo(id: string): Promise<ActionResult> {
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();

  if (papel !== "administrador") {
    return { error: "Apenas administradores podem excluir veículos." };
  }

  const { error } = await supabase
    .schema("dealership")
    .from("veiculo")
    .delete()
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    return { error: "Erro ao excluir o veículo. Tente novamente." };
  }

  revalidatePath("/veiculos");
  redirect("/veiculos");
}

// ─── Gerar / recuperar QR Code ────────────────────────────────────────────────

export type QrCodeResult =
  | { error: string }
  | { url_publica: string; token_publica: string; total_visualizacoes: number };

export async function gerarQrCode(veiculoId: string): Promise<QrCodeResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  // Verifica se o veículo pertence à empresa
  const { data: veiculo } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select("id")
    .eq("id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!veiculo) return { error: "Veículo não encontrado." };

  // Verifica se já existe um QR Code
  const { data: existente } = await supabase
    .schema("dealership")
    .from("qr_code")
    .select("url_publica, token_publica, total_visualizacoes")
    .eq("veiculo_id", veiculoId)
    .maybeSingle();

  if (existente) {
    return {
      url_publica: existente.url_publica,
      token_publica: existente.token_publica,
      total_visualizacoes: existente.total_visualizacoes,
    };
  }

  // Gera novo token e URL pública
  const token = crypto.randomUUID();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://app.uyemuratech.com.br";
  const urlPublica = `${appUrl}/v/${token}`;

  const { error } = await supabase
    .schema("dealership")
    .from("qr_code")
    .insert({
      veiculo_id: veiculoId,
      url_publica: urlPublica,
      token_publica: token,
    });

  if (error) return { error: "Erro ao gerar o QR Code. Tente novamente." };

  revalidatePath(`/veiculos/${veiculoId}`);

  return {
    url_publica: urlPublica,
    token_publica: token,
    total_visualizacoes: 0,
  };
}
