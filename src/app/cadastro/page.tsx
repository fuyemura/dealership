import { PlanoSelecao } from "@/components/features/cadastro/plano-selecao";
import { CadastroStepper } from "@/components/features/cadastro/cadastro-stepper";
import type { SignupPlan } from "@/components/features/cadastro/plano-selecao";
import { getPlanosAtivos, type PlanoDB } from "@/lib/plans/get-planos";
import Link from "next/link";

export const metadata = {
  title: "Criar conta — Uyemura Tech",
  description: "Escolha seu plano e inicie sua assinatura na Uyemura Tech.",
};

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mapearFeatures(plano: PlanoDB): string[] {
  const features: string[] = [];
  if (plano.limite_veiculos === -1) {
    features.push("Veículos ilimitados");
  } else {
    features.push(`Até ${plano.limite_veiculos} veículos`);
  }
  if (plano.limite_usuarios === -1) {
    features.push("Usuários ilimitados");
  } else {
    features.push(`Até ${plano.limite_usuarios} usuários`);
  }
  if (plano.limite_fotos_veiculo === -1) {
    features.push("Fotos ilimitadas por veículo");
  } else {
    features.push(`Até ${plano.limite_fotos_veiculo} fotos por veículo`);
  }
  if (plano.tem_qr_code) features.push("Geração de QR Codes");
  if (plano.tem_relatorios) features.push("Relatórios e analytics");
  if (plano.tem_suporte_prioritario) features.push("Suporte prioritário");
  return features;
}

async function getSignupPlans(): Promise<SignupPlan[]> {
  const planos = await getPlanosAtivos();
  const popularIdx = Math.floor(planos.length / 2);

  return planos.map((plano, idx) => ({
    id: plano.id,
    name: plano.nome_plano,
    description: plano.descricao_plano ?? "",
    price: formatarPreco(plano.preco_mensal),
    period: "/mês",
    popular: planos.length > 1 && idx === popularIdx,
    features: mapearFeatures(plano),
  }));
}

export default async function CadastroPage() {
  const plans = await getSignupPlans();

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
              href="/login"
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
            <h1 className="section-title">Escolha seu Plano</h1>
            <p className="mt-2 text-brand-gray-text text-sm sm:text-base">
              Primeiro passo: selecione o plano ideal para o seu negócio.
            </p>
          </div>

          <CadastroStepper currentStep={1} />
          <PlanoSelecao plans={plans} />
        </div>
      </main>
    </div>
  );
}
