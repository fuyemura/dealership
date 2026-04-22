/**
 * Tipo de retorno padrão para Server Actions do projeto.
 *
 * - `undefined` → operação bem-sucedida (ou seguida de redirect)
 * - `{ error: string }` → mensagem de erro para exibição ao usuário
 *
 * Importar de cá evita redefinição em cada arquivo de actions.
 */
export type ActionResult = { error: string } | undefined;
