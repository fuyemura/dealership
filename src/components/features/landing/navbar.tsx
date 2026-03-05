import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavbarMobile } from "./navbar-mobile";

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#quem-somos", label: "Quem Somos" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#precos", label: "Preços" },
] as const;

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-display font-700 text-lg tracking-tight"
        >
          {/* Ícone marca — grade de 4 quadrados estilizada */}
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="flex flex-col gap-0.5">
              <span className="block w-2 h-2 bg-white rounded-[2px]" />
              <span className="block w-2 h-2 bg-white/40 rounded-[2px]" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="block w-2 h-2 bg-white/40 rounded-[2px]" />
              <span className="block w-2 h-2 bg-white rounded-[2px]" />
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
                className="nav-link text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10 font-medium"
          >
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-white text-[#0a0a0a] hover:bg-white/90 font-semibold rounded-full px-5 transition-all duration-200 hover:scale-[1.02]"
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
