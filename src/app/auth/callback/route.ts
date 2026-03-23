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

  // Sanitiza `next`: aceita apenas caminhos relativos começando com "/"
  // e rejeita URLs relativas de protocolo ("//evil.com") para evitar open redirect.
  const rawNext = searchParams.get("next") ?? "/redefinir-senha";
  const safePath = /^\/(?!\/)/.test(rawNext) ? rawNext : "/redefinir-senha";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(safePath, origin);
      return NextResponse.redirect(redirectUrl.toString());
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Falha → redireciona para redefinir-senha com flag de erro
  return NextResponse.redirect(`${origin}/redefinir-senha?erro=link_invalido`);
}
