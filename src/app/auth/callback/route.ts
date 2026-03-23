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

  // Sanitiza `next` em duas camadas para evitar open redirect:
  //   1ª — regex: aceita somente caminhos começando com "/" mas não "//"
  //        (URLs relativas de protocolo como "//evil.com" são rejeitadas).
  //   2ª — parsing: constrói a URL candidate com new URL(rawNext, origin) e
  //        compara candidate.origin === origin, garantindo que qualquer
  //        sequência malformada (ex.: next=@evil.com, next=/%0aevil.com) que
  //        escape a regex ainda seja bloqueada pelo parser nativo.
  const rawNext = searchParams.get("next") ?? "/redefinir-senha";
  const fallback = new URL("/redefinir-senha", origin);

  let safeRedirectUrl: URL;
  if (/^\/(?!\/)/.test(rawNext)) {
    const candidate = new URL(rawNext, origin);
    safeRedirectUrl = candidate.origin === origin ? candidate : fallback;
  } else {
    safeRedirectUrl = fallback;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Sinaliza explicitamente que a sessão foi estabelecida via password-reset.
      // A página /redefinir-senha usa esse param para distinguir o fluxo de
      // recovery de uma sessão normal, sem depender do evento PASSWORD_RECOVERY
      // (que não é disparado no fluxo PKCE server-side).
      safeRedirectUrl.searchParams.set("type", "recovery");
      return NextResponse.redirect(safeRedirectUrl.toString());
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Falha → redireciona para redefinir-senha com flag de erro
  return NextResponse.redirect(new URL("/redefinir-senha?erro=link_invalido", origin).toString());
}
