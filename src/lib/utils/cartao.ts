/**
 * Identifica a bandeira para o domínio `bandeira_cartao` (nome_dominio como no seed).
 */
export function detectarBandeiraCartao(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (!d.length) return "Visa";
  if (d.startsWith("4")) return "Visa";
  if (d.startsWith("34") || d.startsWith("37")) return "Amex";
  const p2 = parseInt(d.slice(0, 2), 10);
  const p4 = parseInt(d.slice(0, 4), 10);
  if ((p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720)) return "Mastercard";
  if (d.startsWith("606282")) return "Hipercard";
  // Faixas Elo comuns (lista não exaustiva)
  if (
    d.startsWith("401178") ||
    d.startsWith("431274") ||
    d.startsWith("438935") ||
    d.startsWith("451416") ||
    d.startsWith("4576") ||
    d.startsWith("504175") ||
    d.startsWith("627780") ||
    d.startsWith("636297") ||
    d.startsWith("636368") ||
    (d.startsWith("650") && p4 >= 6500 && p4 <= 6505)
  ) {
    return "Elo";
  }
  return "Visa";
}
