"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarMobileProps {
  links: readonly NavLink[];
}

export function NavbarMobile({ links }: NavbarMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-[#0a0a0a] p-1.5 rounded-md hover:bg-[#0a0a0a]/5 transition-colors"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 px-6 py-6 flex flex-col gap-5 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[#0a0a0a]/80 hover:text-[#0a0a0a] text-base font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
            <Button
              asChild
              variant="ghost"
              className="w-full text-[#0a0a0a] hover:text-[#0a0a0a] hover:bg-[#0a0a0a]/5 justify-center"
            >
              <Link href="/entrar" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90 font-semibold rounded-full"
            >
              <Link href="/cadastro" onClick={() => setOpen(false)}>
                Criar uma conta
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
