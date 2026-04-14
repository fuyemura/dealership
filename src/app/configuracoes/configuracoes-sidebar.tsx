"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const allNavItems = [
  { label: "Usuários",       href: "/configuracoes/usuarios",   adminOnly: true  },
  { label: "Empresa",        href: "/configuracoes/empresa",    adminOnly: true  },
  { label: "Tipos de Custo", href: "/configuracoes/custos",    adminOnly: false },
  { label: "Assinatura",     href: "/configuracoes/assinatura", adminOnly: false },
];

export default function ConfiguracoesSidebar({
  mobile = false,
  isAdmin = false,
}: {
  mobile?: boolean;
  isAdmin?: boolean;
}) {
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-black text-brand-white"
                  : "text-brand-gray-text hover:text-brand-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="p-4 space-y-0.5">
      <p className="section-label px-2 mb-4">Configurações</p>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-gray-soft text-brand-black"
                : "text-brand-gray-text hover:text-brand-black hover:bg-brand-gray-soft/70"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
