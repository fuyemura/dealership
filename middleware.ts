import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware de autenticação + Content-Security-Policy.
 *
 * Fluxo:
 * 1. Gera nonce por requisição (produção) e monta CSP dinâmico.
 * 2. Atualiza o cookie de sessão do Supabase (refresh token silencioso).
 * 3. Se a rota é protegida e não há sessão → redireciona para /login.
 * 4. Se já está logado e tenta acessar /login → redireciona para /dashboard.
 */

const protectedPrefixes = ["/dashboard", "/veiculos", "/perfil", "/configuracoes", "/clientes", "/financeiro"];

const isProd = process.env.NODE_ENV === "production";

// ─── CSP ──────────────────────────────────────────────────────────────────────
// Produção: nonce por requisição — elimina unsafe-inline e unsafe-eval.
// Dev: unsafe-inline + unsafe-eval mantidos para compatibilidade com HMR/source maps.

function buildCsp(nonce: string): string {
  const scriptSrc = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://wdapi2.com.br https://viacep.com.br",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase env vars ausentes: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  // Nonce por requisição em produção; vazio em dev
  const nonce = isProd ? Buffer.from(crypto.randomUUID()).toString("base64") : "";
  const csp = buildCsp(nonce);

  // Propaga o nonce ao Next.js para que ele adicione nonce nos <script> inline gerados
  const requestHeaders = new Headers(request.headers);
  if (nonce) requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

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
          // Preserva requestHeaders (com nonce) na recriação da resposta
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
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
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("Content-Security-Policy", csp);
    return redirectResponse;
  }

  // Já logado tentando acessar /login → dashboard
  if (pathname === "/login" && user) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(accountUrl);
    redirectResponse.headers.set("Content-Security-Policy", csp);
    return redirectResponse;
  }

  supabaseResponse.headers.set("Content-Security-Policy", csp);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
