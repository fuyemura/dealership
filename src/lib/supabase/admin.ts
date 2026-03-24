import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com Service Role Key.
 * NUNCA exponha este cliente ao browser — use somente em Server Actions
 * e Route Handlers que rodam exclusivamente no servidor.
 *
 * Utilizado para operações do Admin Auth API:
 *   - inviteUserByEmail (criar convite)
 *   - deleteUser (excluir usuário do Auth)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Variáveis de ambiente ausentes: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
