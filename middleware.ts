import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de autenticação.
 *
 * Fluxo:
 * 1. Atualiza o cookie de sessão do Supabase (refresh token silencioso).
 * 2. Se a rota é protegida e não há sessão → redireciona para /login.
 * 3. Se já está logado e tenta acessar /login → redireciona para /minha-conta.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: não adicione lógica entre createServerClient e getUser().
  // Um erro aqui pode deixar o usuário deslogado acidentalmente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rotas protegidas — prefixos que exigem sessão ativa
  const protectedPrefixes = ["/dashboard", "/minha-conta", "/veiculos", "/perfil", "/assinatura", "/faturas"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Sem sessão em rota protegida → login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Preserva destino para redirecionar após login
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Já logado tentando acessar /login → minha conta
  if (pathname === "/login" && user) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = "/minha-conta";
    return NextResponse.redirect(accountUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Executa o middleware em todas as rotas EXCETO:
     * - arquivos estáticos (_next/static, _next/image, favicon, etc.)
     * - arquivos com extensão conhecida (svg, png, jpg…)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
