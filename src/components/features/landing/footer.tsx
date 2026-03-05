import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const FOOTER_NAV = [
  { href: "#inicio", label: "Início" },
  { href: "#quem-somos", label: "Sobre" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#precos", label: "Preços" },
  { href: "/contato", label: "Entre em Contato" },
] as const;

const FOOTER_LEGAL = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Serviço" },
  { href: "/direitos", label: "Informações de Direitos" },
] as const;

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Marca */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-semibold text-lg w-fit"
            >
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
              Uyemura Tech.
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Transformando Operações de concessionárias com tecnologia acessível e inovadora.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Navegação
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha de rodapé */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Uyemura Tech. Todos os direitos reservados.
          </p>
          <p className="text-white/25 text-xs">
            Feito com ♥ no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
