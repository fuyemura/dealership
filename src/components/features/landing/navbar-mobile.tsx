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
        className="text-brand-black p-1.5 rounded-md hover:bg-brand-black/5 transition-colors"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-14 sm:top-16 left-0 right-0 bg-white border-b border-brand-gray-mid/40 px-6 py-6 flex flex-col gap-5 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-brand-black/80 hover:text-brand-black text-base font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-brand-gray-mid/40 flex flex-col gap-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-center"
            >
              <Link href="/login" onClick={() => setOpen(false)}>
                Entrar
              </Link>
            </Button>
            <Button
              asChild
              className="w-full rounded-full font-semibold"
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
