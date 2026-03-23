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
  const nextParam = searchParams.get("next");
  const defaultPath = "/redefinir-senha";

  // Valida/normaliza o parâmetro `next` para evitar open-redirect.
  let safeNextPath = defaultPath;
  if (nextParam && nextParam.startsWith("/")) {
    try {
      const candidateUrl = new URL(nextParam, origin);
      if (candidateUrl.origin === origin) {
        // Mantém apenas path+search+hash para garantir que o origin não seja alterado.
        safeNextPath = candidateUrl.pathname + candidateUrl.search + candidateUrl.hash;
      }
    } catch {
      // Em caso de erro na construção da URL, usa o path padrão.
      safeNextPath = defaultPath;
    }
  }

  if (code) {
    const supabase = await createClient();
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    } catch (err) {
      console.error("[auth/callback] Supabase client or exchangeCodeForSession threw:", err);
    }
  }

  // Falha → redireciona para redefinir-senha com flag de erro
  return NextResponse.redirect(`${origin}/redefinir-senha?erro=link_invalido`);
}
