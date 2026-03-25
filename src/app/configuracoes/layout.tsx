import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";
import ConfiguracoesSidebar from "./configuracoes-sidebar";

function LogoMark() {
  return (
    <div className="grid grid-cols-2 gap-[3px] w-[18px] h-[18px] flex-shrink-0">
      <div className="rounded-[2px] bg-brand-black" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black" />
    </div>
  );
}

export default async function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("nome_usuario, empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  const displayName =
    usuario.nome_usuario || user.email?.split("@")[0] || "Usuário";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const papel = usuario.papel as unknown as { nome_dominio: string } | null;
  const isAdmin = papel?.nome_dominio === "administrador";

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-gray-soft">
        {/* Header */}
        <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
          <div className="page-container h-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
                Uyemura Tech
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black select-none">
                  {initials}
                </div>
                <span className="text-sm font-medium text-brand-black">{firstName}</span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* Acesso Restrito */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-gray-soft flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-gray-text"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-black mb-2">
              Acesso Restrito
            </h1>
            <p className="text-sm text-brand-gray-text mb-8 leading-relaxed">
              Esta área é exclusiva para administradores. Entre em contato com o
              administrador da sua empresa caso precise de acesso.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft">
      {/* Header */}
      <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
        <div className="page-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
              Uyemura Tech
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Dashboard",     href: "/dashboard",     active: false },
              { label: "Veículos",      href: "/veiculos",      active: false },
              { label: "Clientes",      href: "/clientes",      active: false },
              { label: "Configurações", href: "/configuracoes", active: true  },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  item.active
                    ? "text-brand-black"
                    : "text-brand-gray-text hover:text-brand-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black select-none">
                {initials}
              </div>
              <span className="text-sm font-medium text-brand-black">
                {firstName}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-x-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-52 lg:w-60 shrink-0 border-r border-brand-gray-mid/40 bg-white">
          <ConfiguracoesSidebar />
        </aside>

        {/* Content column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile tabs */}
          <div className="md:hidden border-b border-brand-gray-mid/40 bg-white overflow-x-auto">
            <ConfiguracoesSidebar mobile />
          </div>

          {/* Page content */}
          <main className="flex-1 min-w-0 px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
