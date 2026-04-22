import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de autenticação.
 *
 * Fluxo:
 * 1. Atualiza o cookie de sessão do Supabase (refresh token silencioso).
 * 2. Se a rota é protegida e não há sessão → redireciona para /login.
 * 3. Se já está logado e tenta acessar /login → redireciona para /dashboard.
 */

// Centralizado aqui para evitar duplicação no bloco de env vars ausentes
const protectedPrefixes = ["/dashboard", "/veiculos", "/perfil", "/configuracoes", "/clientes", "/financeiro"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Sem as env vars o createClient() lançaria erro em qualquer rota.
    // Falha de forma consistente com 500 para deixar a misconfiguração visível.
    console.error("Supabase env vars ausentes: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

  // Já logado tentando acessar /login → dashboard
  if (pathname === "/login" && user) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = "/dashboard";
    return NextResponse.redirect(accountUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
