"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import type { VeiculoFormData } from "@/lib/schemas/veiculo";

export type ActionResult = { error: string } | undefined;
export type { VeiculoFormData } from "@/lib/schemas/veiculo";

// Tipo utilitário local para o cliente Supabase retornado pelo guard
type SupabaseClient = Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>;

// ─── Validação server-side ────────────────────────────────────────────────────
// Verifica se uma placa já existe no estoque da empresa
export async function verificarPlacaExistente(
  placa: string
): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const placaNormalizada = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const { data } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select("id")
    .eq("placa", placaNormalizada)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .maybeSingle();

  if (data) {
    return {
      error: `A placa ${placaNormalizada} já está cadastrada no seu estoque.`,
    };
  }
}
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

  // Compara apenas a parte calendário (YYYY-MM-DD) para evitar off-by-one de timezone.
  // new Date("YYYY-MM-DD") interpreta como UTC midnight; construir a data local
  // garante que "hoje" seja avaliado no fuso do servidor, não em UTC.
  const [dcAno, dcMes, dcDia] = data.data_compra.split("-").map(Number);
  const dataCompraLocal = new Date(dcAno, dcMes - 1, dcDia);
  const hojeLocal = new Date();
  hojeLocal.setHours(0, 0, 0, 0);
  if (dataCompraLocal > hojeLocal)
    return { error: "Data de compra não pode ser futura." };

  if (data.preco_compra <= 0)
    return { error: "Preço de compra inválido." };

  if (data.descricao && data.descricao.length > 1000)
    return { error: "Descrição: máximo de 1000 caracteres." };

  if (data.quantidade_dias_garantia != null) {
    const dias = data.quantidade_dias_garantia;
    if (!Number.isFinite(dias) || !Number.isInteger(dias) || dias < 0 || dias > 3650)
      return { error: "Dias de garantia deve ser um inteiro entre 0 e 3650." };
  }
}

// ─── Criar veículo ────────────────────────────────────────────────────────────

// Helper: busca o ID de "Vendido" e valida campos obrigatórios condicionalmente
async function validarCamposVenda(
  supabase: SupabaseClient,
  data: VeiculoFormData
): Promise<ActionResult> {
  const { data: situacaoVendido } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id")
    .eq("grupo_dominio", "situacao_veiculo")
    .ilike("nome_dominio", "vendido")
    .maybeSingle();

  if (!situacaoVendido || data.situacao_veiculo_id !== situacaoVendido.id) return;

  if (!data.preco_venda || data.preco_venda <= 0)
    return { error: "Informe o preço de venda." };
  if (!data.data_venda)
    return { error: "Informe a data de venda." };
}

function calcularDataFimGarantia(
  dataVenda: string | null,
  dias: number | null
): string | null {
  if (!dataVenda || !dias || dias <= 0) return null;
  const [ano, mes, dia] = dataVenda.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function criarVeiculo(data: VeiculoFormData): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  // Validação condicional: campos de venda obrigatórios quando situação = Vendido
  const vendaError = await validarCamposVenda(supabase, data);
  if (vendaError) return vendaError;

  const placa = data.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const renavam = data.renavam.replace(/\D/g, "");

  const { data: novoVeiculo, error } = await supabase
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
      quantidade_dias_garantia: data.quantidade_dias_garantia ?? null,
      data_fim_garantia: calcularDataFimGarantia(data.data_venda ?? null, data.quantidade_dias_garantia ?? null),
      descricao: data.descricao?.trim() || null,
      criado_por: usuarioAtual.id,
      atualizado_por: usuarioAtual.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      if (error.details.includes("placa"))
        return { error: "Já existe um veículo com esta placa cadastrado." };
      if (error.details.includes("chassi"))
        return { error: "Já existe um veículo com este número de chassi." };
    }
    return { error: "Erro ao cadastrar o veículo. Tente novamente." };
  }

  revalidatePath("/veiculos");
  redirect(`/veiculos/${novoVeiculo.id}?novo=1`);
}

// ─── Atualizar veículo ────────────────────────────────────────────────────────

export async function atualizarVeiculo(
  id: string,
  data: VeiculoFormData
): Promise<ActionResult> {
  const validationError = validarDados(data);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  // Validação condicional: campos de venda obrigatórios quando situação = Vendido
  const vendaError = await validarCamposVenda(supabase, data);
  if (vendaError) return vendaError;

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
      quantidade_dias_garantia: data.quantidade_dias_garantia ?? null,
      data_fim_garantia: calcularDataFimGarantia(data.data_venda ?? null, data.quantidade_dias_garantia ?? null),
      descricao: data.descricao?.trim() || null,
      atualizado_por: usuarioAtual.id,
    })
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id);

  if (error) {
    if (error.code === "23505") {
      if (error.details.includes("placa"))
        return { error: "Já existe um veículo com esta placa cadastrado." };
      if (error.details.includes("chassi"))
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

  if (papel !== PAPEIS.ADMINISTRADOR) {
    return { error: "Apenas administradores podem excluir veículos." };
  }

  // Exclui atomicamente todos os registros DB via RPC e retorna caminhos de Storage.
  // A exclusão do Storage ocorre após a transação DB para garantir consistência:
  // se o Storage falhar, o DB já está limpo (arquivos ficam órfãos, não o contrário).
  const { data: caminhos, error: rpcError } = await supabase
    .schema("dealership")
    .rpc("excluir_veiculo", {
      p_veiculo_id: id,
      p_empresa_id: usuarioAtual.empresa_id,
    });

  if (rpcError) {
    if (rpcError.message.includes("veiculo_nao_encontrado")) {
      return { error: "Veículo não encontrado." };
    }
    console.error("[excluirVeiculo] RPC error:", rpcError.message);
    return { error: "Erro ao excluir o veículo. Tente novamente." };
  }

  // Remove arquivos do Storage (best-effort: DB já está limpo)
  if (caminhos && (caminhos as string[]).length > 0) {
    const adminClient = createAdminClient();
    const { error: storageError } = await adminClient.storage
      .from(BUCKET)
      .remove(caminhos as string[]);
    if (storageError) {
      console.warn(
        "[excluirVeiculo] Falha ao remover arquivos do Storage (DB já limpo):",
        storageError.message
      );
    }
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
    .from("veiculo_qr_code")
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
    .from("veiculo_qr_code")
    .insert({
      veiculo_id: veiculoId,
      url_publica: urlPublica,
      token_publica: token,
    });

  if (error) return { error: "Erro ao gerar o QR Code. Tente novamente." };

  return {
    url_publica: urlPublica,
    token_publica: token,
    total_visualizacoes: 0,
  };
}

// ─── Upload de arquivo (foto ou laudo) ───────────────────────────────────────

const BUCKET = "veiculos";
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const TIPO_LAUDO = ["application/pdf"]; // array para facilitar adição futura de formatos
const MAX_SIZE_FOTO = 5 * 1024 * 1024;  // 5 MB
const MAX_SIZE_LAUDO = 10 * 1024 * 1024; // 10 MB

export async function uploadArquivoVeiculo(
  veiculoId: string,
  tipo: "foto" | "laudo",
  formData: FormData
): Promise<ActionResult> {
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

  const file = formData.get("arquivo") as File | null;
  if (!file || file.size === 0) return { error: "Nenhum arquivo selecionado." };

  const isFoto = tipo === "foto";
  const tiposAceitos = isFoto ? TIPOS_FOTO : TIPO_LAUDO;
  const maxSize = isFoto ? MAX_SIZE_FOTO : MAX_SIZE_LAUDO;

  if (!tiposAceitos.includes(file.type))
    return { error: isFoto ? "Formato inválido. Use JPEG, PNG ou WebP." : "Formato inválido. Use PDF." };
  if (file.size > maxSize)
    return { error: isFoto ? "Foto deve ter no máximo 5 MB." : "Laudo deve ter no máximo 10 MB." };

  // Resolve tipo_arquivo_id no domínio
  // O banco armazena com inicial maiúscula: 'Foto', 'Laudo'
  const nomeNoBanco = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  const { data: tipoArquivo } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id")
    .eq("grupo_dominio", "tipo_arquivo_veiculo")
    .eq("nome_dominio", nomeNoBanco)
    .single();
  if (!tipoArquivo) return { error: "Tipo de arquivo não configurado." };

  const adminClient = createAdminClient();

  // Se for laudo: remove o arquivo anterior antes de inserir o novo
  if (!isFoto) {
    const { data: laudoAnterior } = await supabase
      .schema("dealership")
      .from("veiculo_arquivo")
      .select("id, caminho_storage")
      .eq("veiculo_id", veiculoId)
      .eq("tipo_arquivo_id", tipoArquivo.id)
      .maybeSingle();

    if (laudoAnterior) {
      await adminClient.storage.from(BUCKET).remove([laudoAnterior.caminho_storage]);
      await supabase
        .schema("dealership")
        .from("veiculo_arquivo")
        .delete()
        .eq("id", laudoAnterior.id);
    }
  }

  // Faz upload para o Storage
  // Extão derivada do content-type validado — deterministic, imune a nomes de arquivo maliciosos
  const EXT_MAP: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
  };
  const ext = EXT_MAP[file.type];
  const uuid = crypto.randomUUID();
  const subpasta = isFoto ? "fotos" : "laudo";
  const caminho = `${usuarioAtual.empresa_id}/${veiculoId}/${subpasta}/${uuid}.${ext}`;

  const { error: storageError } = await adminClient.storage
    .from(BUCKET)
    .upload(caminho, file, { contentType: file.type, upsert: false });

  if (storageError) return { error: "Erro ao salvar o arquivo. Tente novamente." };

  const { data: { publicUrl } } = adminClient.storage.from(BUCKET).getPublicUrl(caminho);

  // Define ordem e se é principal (primeira foto = principal)
  let ordemExibicao = 0;
  let arquivoPrincipal = false;
  if (isFoto) {
    const { count } = await supabase
      .schema("dealership")
      .from("veiculo_arquivo")
      .select("id", { count: "exact", head: true })
      .eq("veiculo_id", veiculoId)
      .eq("tipo_arquivo_id", tipoArquivo.id);
    ordemExibicao = count ?? 0;
    // Nota: count + arquivoPrincipal é não-atômico. Para eliminar a race condition,
    // adicione uma constraint UNIQUE parcial no banco (WHERE arquivo_principal = true).
    arquivoPrincipal = ordemExibicao === 0;
  }

  // Insere registro no banco
  const { error: dbError } = await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .insert({
      veiculo_id: veiculoId,
      empresa_id: usuarioAtual.empresa_id,
      tipo_arquivo_id: tipoArquivo.id,
      url_arquivo: publicUrl,
      caminho_storage: caminho,
      tamanho_arquivo: file.size,
      arquivo_principal: arquivoPrincipal,
      ordem_exibicao: ordemExibicao,
      criado_por: usuarioAtual.id,
    });

  if (dbError) {
    // Rollback: remove o arquivo do storage se o insert falhar
    await adminClient.storage.from(BUCKET).remove([caminho]);
    return { error: "Erro ao registrar o arquivo. Tente novamente." };
  }

  revalidatePath(`/veiculos/${veiculoId}`);
  revalidatePath("/veiculos");
}

// ─── Excluir arquivo ──────────────────────────────────────────────────────────

export async function excluirArquivoVeiculo(
  veiculoId: string,
  arquivoId: string
): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { data: arquivo } = await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .select("id, caminho_storage, arquivo_principal, tipo_arquivo_id")
    .eq("id", arquivoId)
    .eq("veiculo_id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!arquivo) return { error: "Arquivo não encontrado." };

  const adminClient = createAdminClient();
  const { error: storageRemoveError } = await adminClient.storage.from(BUCKET).remove([arquivo.caminho_storage]);
  if (storageRemoveError) {
    // Arquivo já pode não existir no bucket; prosseguimos removendo o registro
    console.warn(`[excluirArquivoVeiculo] Falha ao remover do Storage: ${arquivo.caminho_storage}`, storageRemoveError.message);
  }

  const { error: deleteError } = await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .delete()
    .eq("id", arquivoId);

  if (deleteError) {
    return { error: "Erro ao excluir o arquivo. Tente novamente." };
  }

  // Se era a foto principal, promove a próxima foto
  if (arquivo.arquivo_principal) {
    const { data: proxima } = await supabase
      .schema("dealership")
      .from("veiculo_arquivo")
      .select("id")
      .eq("veiculo_id", veiculoId)
      .eq("empresa_id", usuarioAtual.empresa_id)
      .eq("tipo_arquivo_id", arquivo.tipo_arquivo_id)
      .order("ordem_exibicao", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (proxima) {
      await supabase
        .schema("dealership")
        .from("veiculo_arquivo")
        .update({ arquivo_principal: true })
        .eq("id", proxima.id);
    }
  }

  revalidatePath(`/veiculos/${veiculoId}`);
  revalidatePath("/veiculos");
}

// ─── Definir foto principal ───────────────────────────────────────────────────

export async function definirFotoPrincipal(
  veiculoId: string,
  arquivoId: string
): Promise<ActionResult> {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { data: arquivo } = await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .select("tipo_arquivo_id")
    .eq("id", arquivoId)
    .eq("veiculo_id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!arquivo) return { error: "Arquivo não encontrado." };

  // Remove o principal de todas as fotos deste veículo
  await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .update({ arquivo_principal: false })
    .eq("veiculo_id", veiculoId)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .eq("tipo_arquivo_id", arquivo.tipo_arquivo_id);

  // Define esta foto como principal
  await supabase
    .schema("dealership")
    .from("veiculo_arquivo")
    .update({ arquivo_principal: true })
    .eq("id", arquivoId);

  revalidatePath(`/veiculos/${veiculoId}`);
  revalidatePath("/veiculos");
}

