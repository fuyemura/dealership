import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

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

export default async function ClientesLayout({
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

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
        <div className="page-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
              Uyemura Tech
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            {[
              { label: "Dashboard",    href: "/dashboard",    active: false },
              { label: "Veículos",     href: "/veiculos",     active: false },
              { label: "Clientes",     href: "/clientes",     active: true  },
              ...(isAdmin
                ? [{ label: "Configurações", href: "/configuracoes", active: false }]
                : []),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
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
              <div
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black select-none"
              >
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

      {/* ── Conteúdo ──────────────────────────────────────────────────────── */}
      <main className="flex-1 page-container py-8 sm:py-12">{children}</main>
    </div>
  );
}
