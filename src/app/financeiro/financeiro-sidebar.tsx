"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Resultado do Período", href: "/financeiro"              },
  { label: "Lucratividade",        href: "/financeiro/lucratividade" },
  { label: "Despesas",             href: "/financeiro/despesas"     },
  { label: "Categorias",           href: "/financeiro/categorias"   },
];

export default function FinanceiroSidebar({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/financeiro"
              ? pathname === "/financeiro"
              : pathname.startsWith(item.href);
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
      <p className="section-label px-2 mb-4">Financeiro</p>
      {navItems.map((item) => {
        const isActive =
          item.href === "/financeiro"
            ? pathname === "/financeiro"
            : pathname.startsWith(item.href);
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
