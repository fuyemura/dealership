import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Route Handler de callback OAuth/PKCE do Supabase.
 *
 * Fluxo do reset de senha:
 * 1. resetPasswordForEmail() redireciona para este endpoint com ?code=XXX
 * 2. Aqui trocamos o code por uma sessão no servidor (cookies funcionam corretamente)
 * 3. Redirecionamos o usuário para a página de redefinição de senha
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/redefinir-senha";

  // Valida que next é um path interno para prevenir open-redirect.
  // new URL(rawNext, origin) resolve o caminho em relação à origem; se o resultado
  // tiver uma origem diferente (ex.: "//evil.com", "https://evil.com"), descarta.
  const safeNext = (() => {
    try {
      const resolved = new URL(rawNext, origin);
      if (resolved.origin !== origin) return "/redefinir-senha";
      return resolved.pathname + resolved.search + resolved.hash;
    } catch {
      return "/redefinir-senha";
    }
  })();

  if (code) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("[auth/callback] Supabase env vars ausentes.");
      return NextResponse.redirect(`${origin}/redefinir-senha?erro=link_invalido`);
    }

    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }

      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    } catch (err) {
      console.error("[auth/callback] Erro inesperado ao trocar code por sessão:", err);
    }
  }

  // Falha → redireciona para redefinir-senha com flag de erro
  return NextResponse.redirect(`${origin}/redefinir-senha?erro=link_invalido`);
}
