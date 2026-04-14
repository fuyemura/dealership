/**
 * Serviço de consulta de CEP.
 *
 * Para trocar de provedor, edite apenas este arquivo:
 *  - Altere `CEP_PROVIDER_URL` para a URL base do novo provedor.
 *  - Ajuste `normalizarResposta` para mapear os campos da nova API
 *    para o formato `CepResult` esperado pelo restante do sistema.
 *
 * Provedores alternativos conhecidos:
 *  - BrasilAPI:  https://brasilapi.com.br/api/cep/v1/{cep}
 *  - ApiCEP:     https://apicep.com/api-de-consulta/
 *  - OpenCEP:    https://opencep.com/v1/{cep}
 */

export interface CepResult {
  logradouro: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

// ─── Configuração do provedor ─────────────────────────────────────────────────

/** URL base. Use {cep} como placeholder para o CEP sem máscara. */
const CEP_PROVIDER_URL = "https://viacep.com.br/ws/{cep}/json/";

/** Mapeia a resposta bruta do provedor para CepResult. */
function normalizarResposta(data: Record<string, unknown>): CepResult | null {
  // ViaCEP retorna { erro: true } quando o CEP não é encontrado
  if (data.erro) return null;

  return {
    logradouro: (data.logradouro as string) || null,
    bairro:     (data.bairro     as string) || null,
    cidade:     (data.localidade as string) || null,  // ViaCEP usa "localidade"
    estado:     (data.uf         as string) || null,
  };
}

// ─── Função pública ───────────────────────────────────────────────────────────

/**
 * Consulta o CEP informado no provedor configurado.
 *
 * @param cep    Somente dígitos (8 caracteres).
 * @param signal AbortSignal opcional para cancelar a requisição.
 * @returns      CepResult com os campos preenchidos, ou null se não encontrado.
 * @throws       Lança erro em falha de rede (exceto AbortError).
 */
export async function consultarCep(
  cep: string,
  signal?: AbortSignal
): Promise<CepResult | null> {
  const url = CEP_PROVIDER_URL.replace("{cep}", cep);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`CEP provider error: ${res.status}`);

  const data: Record<string, unknown> = await res.json();
  return normalizarResposta(data);
}
