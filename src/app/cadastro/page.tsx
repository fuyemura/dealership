import { RegistroEmpresarialForm } from "@/components/features/cadastro/registro-empresarial-form";
import Link from "next/link";

export const metadata = {
  title: "Criar conta — Uyemura Tech",
  description: "Crie sua conta empresarial na Uyemura Tech.",
};

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-brand-gray-soft">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-white border-b border-brand-gray-mid/40">
        <div className="page-container h-14 sm:h-16 flex items-center justify-between">
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

          <p className="text-sm text-brand-gray-text">
            Já tem uma conta?{" "}
            <Link
              href="/entrar"
              className="text-brand-black font-medium underline underline-offset-4 hover:text-brand-black/70 transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16">
        <div className="page-container max-w-5xl">
          {/* Page title */}
          <div className="mb-8">
            <span className="section-label">Cadastro</span>
            <h1 className="section-title">Registro Empresarial</h1>
            <p className="mt-2 text-brand-gray-text text-sm sm:text-base">
              Preencha os dados da sua empresa para começar.
            </p>
          </div>

          <RegistroEmpresarialForm />
        </div>
      </main>
    </div>
  );
}
