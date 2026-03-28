import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria um cliente Supabase para uso em Server Components, Server Actions
 * e Route Handlers — lê/escreve cookies via next/headers.
 */
export async function createClient() {
  // Chamar cookies() ANTES da guarda de env vars é essencial:
  // o Next.js detecta rotas dinâmicas quando cookies() é invocado.
  // Se lançarmos um Error antes disso, o prerender falha em build time.
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Variáveis de ambiente ausentes: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll pode ser chamado de um Server Component (read-only).
            // O Middleware garante que a sessão já está atualizada.
          }
        },
      },
    }
  );
}
