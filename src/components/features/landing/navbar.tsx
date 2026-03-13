import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarMobile } from "./navbar-mobile";

const NAV_LINKS = [
  { href: "/#inicio", label: "Início" },
  { href: "/#quem-somos", label: "Quem Somos" },
  { href: "/#como-funciona", label: "Como Funciona" },
  { href: "/#precos", label: "Preços" },
] as const;

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-gray-mid/40">
      <nav className="page-container h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-black font-display text-base sm:text-lg tracking-tight"
        >
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="flex flex-col gap-0.5">
              <span className="block w-2 h-2 bg-brand-black rounded-[2px]" />
              <span className="block w-2 h-2 bg-brand-black/40 rounded-[2px]" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="block w-2 h-2 bg-brand-black/40 rounded-[2px]" />
              <span className="block w-2 h-2 bg-brand-black rounded-[2px]" />
            </span>
          </span>
          <span className="font-semibold">Uyemura Tech</span>
        </Link>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link text-brand-black/70 hover:text-brand-black text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons desktop */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-brand-black hover:text-brand-black hover:bg-brand-black/5 text-xs sm:text-sm"
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full px-4 sm:px-5 text-xs sm:text-sm hover:scale-[1.02]"
          >
            <Link href="/cadastro">Criar uma conta</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <NavbarMobile links={NAV_LINKS} />
      </nav>
    </header>
  );
}
