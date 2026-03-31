import { PagamentoForm } from "@/components/features/cadastro/pagamento-form";
import Link from "next/link";

export const metadata = {
  title: "Pagamento — Uyemura Tech",
};

export default function CadastroPagamentoPage() {
  return (
    <div className="min-h-screen bg-brand-gray-soft">
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

          <Link
            href="/cadastro/plano"
            className="text-sm text-brand-gray-text hover:text-brand-black transition-colors"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 flex items-start justify-center">
        <div className="page-container max-w-lg w-full">
          <div className="mb-8">
            <span className="section-label">Cadastro</span>
            <h1 className="section-title">Detalhes do Pagamento</h1>
            <p className="mt-2 text-brand-gray-text text-sm sm:text-base">
              Suas informações estão seguras e criptografadas.
            </p>
          </div>

          <PagamentoForm />
        </div>
      </main>
    </div>
  );
}
