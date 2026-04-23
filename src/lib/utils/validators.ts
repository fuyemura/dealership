/**
 * Valida um CPF brasileiro (com ou sem formatação).
 * Rejeita sequências homogêneas (ex: 111.111.111-11) e verifica os
 * dois dígitos verificadores.
 */
export function validarCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (factor: number) => {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) {
      sum += parseInt(digits[i]) * (factor - i);
    }
    const rem = (sum * 10) % 11;
    return rem === 10 || rem === 11 ? 0 : rem;
  };

  return calc(10) === parseInt(digits[9]) && calc(11) === parseInt(digits[10]);
}

/**
 * Remove todos os caracteres não numéricos de um CPF.
 */
export function sanitizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Valida se uma string é um UUID v4 no formato padrão.
 * Use antes de enviar IDs ao banco para prevenir injection e falhas silenciosas.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validarUuid(id: string): boolean {
  return UUID_REGEX.test(id);
}
