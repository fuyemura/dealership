import { CadastroEmpresaStepForm } from "@/components/features/cadastro/cadastro-empresa-step-form";
import { CadastroStepper } from "@/components/features/cadastro/cadastro-stepper";
import Link from "next/link";

export const metadata = {
  title: "Dados da Empresa — Uyemura Tech",
};

export default function CadastroEmpresaPage() {
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
            href="/cadastro/pagamento"
            className="text-sm text-brand-gray-text hover:text-brand-black transition-colors"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="page-container max-w-5xl">
          <div className="mb-8">
            <span className="section-label">Cadastro</span>
            <h1 className="section-title">Empresa e Usuário Administrador</h1>
            <p className="mt-2 text-brand-gray-text text-sm sm:text-base">
              Complete os dados para criar o ambiente inicial da sua conta.
            </p>
          </div>

          <CadastroStepper currentStep={3} />
          <CadastroEmpresaStepForm />
        </div>
      </main>
    </div>
  );
}
