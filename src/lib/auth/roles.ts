/**
 * Papéis de usuário existentes no domínio `papel_usuario`.
 * Valores são normalizados para minúsculas (o banco armazena com inicial maiúscula).
 */
export const PAPEIS = {
  ADMINISTRADOR: "administrador",
  GERENTE: "gerente",
  USUARIO: "usuario",
} as const;

export type Papel = (typeof PAPEIS)[keyof typeof PAPEIS];
