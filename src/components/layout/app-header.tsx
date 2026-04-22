import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";
import { getUsuarioAutorizado } from "@/lib/auth/guards";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ActiveSection =
  | "dashboard"
  | "veiculos"
  | "clientes"
  | "financeiro"
  | "configuracoes";

interface AppHeaderProps {
  activeSection: ActiveSection;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div
      className="grid grid-cols-2 gap-[3px] w-[18px] h-[18px] flex-shrink-0"
      aria-hidden="true"
    >
      <div className="rounded-[2px] bg-brand-black" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black" />
    </div>
  );
}

// ─── Header (Server Component) ────────────────────────────────────────────────

/**
 * Header de aplicação compartilhado entre todas as seções autenticadas.
 *
 * - Busca o usuário via `getUsuarioAutorizado()` (cacheado com React cache —
 *   deduplicado por request, sem roundtrips extras quando layouts chamam o guard).
 * - Exibe a navegação principal, filtrando "Financeiro" e "Configurações"
 *   para usuários com papel "usuario".
 * - Marca o item ativo via prop `activeSection`.
 */
export default async function AppHeader({ activeSection }: AppHeaderProps) {
  const { usuarioAtual, papel } = await getUsuarioAutorizado();

  const displayName = usuarioAtual.nome_usuario ?? "Usuário";
  const firstName = displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const temAcessoConfig = papel === "administrador" || papel === "gerente";

  const navItems = [
    { label: "Dashboard",     href: "/dashboard",     key: "dashboard"     },
    { label: "Veículos",      href: "/veiculos",      key: "veiculos"      },
    { label: "Clientes",      href: "/clientes",      key: "clientes"      },
    ...(temAcessoConfig
      ? [
          { label: "Financeiro",    href: "/financeiro",    key: "financeiro"    },
          { label: "Configurações", href: "/configuracoes", key: "configuracoes" },
        ]
      : []),
  ] as const;

  return (
    <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
      <div className="page-container h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Ir para a página inicial"
        >
          <LogoMark />
          <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
            Uyemura Tech
          </span>
        </Link>

        {/* Navegação principal (desktop) */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                activeSection === item.key
                  ? "text-brand-black"
                  : "text-brand-gray-text hover:text-brand-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Avatar + Sair */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black select-none"
              aria-hidden="true"
            >
              {initials}
            </div>
            <span className="text-sm font-medium text-brand-black">{firstName}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
