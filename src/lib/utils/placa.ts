/**
 * Serviço de consulta de dados de veículo por placa.
 *
 * Para trocar de provedor, edite apenas este arquivo:
 *  - Altere `buildUrl` para montar a URL do novo provedor.
 *  - Ajuste `normalizarResposta` para mapear os campos da nova API
 *    para o formato `PlacaResult` esperado pelo restante do sistema.
 *  - Se o novo provedor não precisar de token, remova a variável de ambiente
 *    e o guard `if (!token)` no route handler.
 *
 * Provedores alternativos conhecidos:
 *  - WDAPI2:      https://wdapi2.com.br/{placa}/{token}          (requer token)
 *  - ApiPlacas:   https://apiplacas.com.br/api/v1/{placa}/{token} (requer token)
 *  - Permanência: sem API pública gratuita amplamente disponível —
 *                 ao migrar, atualize apenas buildUrl e normalizarResposta.
 */

export interface PlacaResult {
  marca: string | null;
  modelo: string | null;
  ano_fabricacao: number | null;
  ano_modelo: number | null;
  cor: string | null;
  combustivel: string | null;
  renavam: string | null;
  chassi: string | null;
  valor_fipe: string | null;
}

// ─── Configuração do provedor ─────────────────────────────────────────────────

/**
 * Monta a URL de consulta para o provedor configurado.
 * @param placa  Placa normalizada (somente letras e dígitos, maiúscula).
 */
function buildUrl(placa: string): string {
  return `https://wdapi2.com.br/${placa}`;
}

/**
 * Mapeia a resposta bruta do provedor para PlacaResult.
 * Ajuste este mapeamento ao trocar de provedor.
 */
function normalizarResposta(raw: Record<string, unknown>): PlacaResult {
  return {
    marca:         (raw.MARCA        as string  | undefined) ?? null,
    modelo:        (raw.MODELO       as string  | undefined) ?? null,
    ano_fabricacao: raw.ano        ? Number(raw.ano)        : null,
    ano_modelo:     raw.anoModelo  ? Number(raw.anoModelo)  : null,
    cor:           (raw.cor          as string  | undefined) ?? null,
    combustivel:   (raw.combustivel  as string  | undefined) ?? null,
    renavam:       (raw.RENAVAM      as string  | undefined) ?? null,
    chassi:        (raw.CHASSI       as string  | undefined) ?? null,
    valor_fipe:    (raw.valor        as string  | undefined) ?? null,
  };
}

// ─── Tipos de retorno ─────────────────────────────────────────────────────────

export type ConsultaPlacaOk    = { ok: true;  data: PlacaResult };
export type ConsultaPlacaErro  = { ok: false; status: 404 | 502 | 500; error: string };
export type ConsultaPlacaResult = ConsultaPlacaOk | ConsultaPlacaErro;

// ─── Função pública ───────────────────────────────────────────────────────────

/**
 * Consulta os dados do veículo pelo provedor configurado.
 *
 * @param placa  Placa normalizada (somente letras e dígitos, maiúscula).
 * @param token  Token de autenticação (lido de env pelo chamador).
 * @returns      ConsultaPlacaResult com os dados ou um erro tipado.
 */
export async function consultarPlaca(
  placa: string,
  token: string
): Promise<ConsultaPlacaResult> {
  let res: Response;
  try {
    res = await fetch(buildUrl(placa), {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false, status: 500, error: "Erro ao consultar a placa. Verifique sua conexão e tente novamente." };
  }

  if (res.status === 404) {
    return { ok: false, status: 404, error: "Veículo não encontrado para esta placa." };
  }

  if (!res.ok) {
    return { ok: false, status: 502, error: "Erro ao consultar a placa. Tente novamente." };
  }

  let raw: Record<string, unknown>;
  try {
    raw = await res.json();
  } catch {
    return { ok: false, status: 502, error: "Resposta inválida do provedor de consulta de placa." };
  }
  return { ok: true, data: normalizarResposta(raw) };
}
