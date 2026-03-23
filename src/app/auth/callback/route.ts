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
  const rawNext = searchParams.get("next");

  // Valida o parâmetro `next` para evitar open-redirect: aceita apenas caminhos relativos.
  // Rejeita valores como "//@evil.com" que começam com "/" mas apontam para domínio externo.
  let next = "/redefinir-senha";
  if (rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    try {
      const candidate = new URL(rawNext, origin);
      if (candidate.origin === origin) {
        next = candidate.pathname + candidate.search + candidate.hash;
      }
    } catch {
      // Mantém o caminho padrão em caso de URL malformada
    }
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Falha → redireciona para redefinir-senha com flag de erro
  return NextResponse.redirect(new URL("/redefinir-senha?erro=link_invalido", origin));
}
