import Link from "next/link";
import { PricingGrid } from "./_pricing-grid";
import { getPlanosAtivos, type PlanoDB } from "@/lib/plans/get-planos";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PricingPlanDisplay = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

export async function getPlanos(): Promise<PricingPlanDisplay[]> {
  const planos = await getPlanosAtivos();
  const popularIdx = Math.floor(planos.length / 2);

  return planos.map((p, i) => ({
    id: p.id,
    name: p.nome_plano,
    price: formatarPreco(p.preco_mensal),
    description: p.descricao_plano ?? "",
    features: mapearFeatures(p),
    popular: planos.length > 1 && i === popularIdx,
    cta: "Começar grátis",
  }));
}

// ─── Componente ───────────────────────────────────────────────────────────────

export async function PricingSection() {
  const plans = await getPlanos();

  return (
    <section id="precos" className="py-16 sm:py-24 lg:py-32 bg-brand-gray-soft">
      <div className="page-container">
        <header className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="section-label">Planos</span>
          <h2 className="section-title">Simples e transparente.</h2>
          <p className="text-brand-gray-text text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Ideal para começar — 30 dias grátis inclusos em todos os planos.
          </p>
        </header>

        {plans.length > 0 ? (
          <PricingGrid plans={plans} />
        ) : (
          <p className="text-center text-brand-gray-text text-sm">
            Planos disponíveis em breve.
          </p>
        )}

        <div className="text-center mt-12">
          <p className="text-brand-gray-text text-sm">
            Dúvidas sobre os planos?{" "}
            <Link
              href="/contato"
              className="text-brand-black hover:text-brand-accent font-medium transition-colors"
            >
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
