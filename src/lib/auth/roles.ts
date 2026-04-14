/**
 * Papéis de usuário do sistema.
 *
 * Centraliza os valores para evitar magic strings espalhados pelo código.
 * Use sempre estas constantes nas comparações de papel — nunca strings literais.
 */
export const PAPEIS = {
  ADMINISTRADOR: "administrador",
  GERENTE: "gerente",
  USUARIO: "usuario",
} as const;

export type Papel = (typeof PAPEIS)[keyof typeof PAPEIS];
