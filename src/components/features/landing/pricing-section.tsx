import { unstable_cache } from "next/cache";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PricingGrid } from "./_pricing-grid";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PlanoDB = {
  id: string;
  nome_plano: string;
  descricao_plano: string | null;
  preco_mensal: number;
  limite_veiculos: number;
  limite_usuarios: number;
  limite_fotos_veiculo: number;
  tem_qr_code: boolean;
  tem_relatorios: boolean;
  tem_suporte_prioritario: boolean;
};

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

// ─── Busca com cache ISR (1h) ─────────────────────────────────────────────────
// createAdminClient() usa a service role (server-only) e bypassa o RLS,
// evitando que a landing page dependa de sessão de usuário ou cookies.
// unstable_cache armazena o resultado no Data Cache do Next.js,
// revalidando automaticamente a cada hora sem bloquear requests.
// Em ambientes sem as env vars (ex: CI, preview sem secrets), retorna fallback estático.

const PLANOS_FALLBACK: PricingPlanDisplay[] = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 49,99",
    description: "Para revendas que estão começando a digitalizar o estoque.",
    features: ["Até 30 veículos", "Até 2 usuários", "Geração de QR Codes"],
    popular: false,
    cta: "Começar grátis",
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 99,99",
    description: "Para revendas em crescimento que precisam de mais recursos.",
    features: [
      "Até 100 veículos",
      "Até 5 usuários",
      "QR Codes personalizados",
      "Relatórios e analytics",
      "Suporte prioritário",
    ],
    popular: true,
    cta: "Começar grátis",
  },
  {
    id: "empresarial",
    name: "Empresarial",
    price: "R$ 199,99",
    description: "Para grandes operações sem limite de escala.",
    features: [
      "Veículos ilimitados",
      "Usuários ilimitados",
      "QR Codes premium",
      "Relatórios e analytics",
      "Suporte dedicado",
    ],
    popular: false,
    cta: "Começar grátis",
  },
];

const getPlanos = unstable_cache(
  async (): Promise<PricingPlanDisplay[]> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return PLANOS_FALLBACK;
    }

    try {
      const supabase = createAdminClient();

    const { data } = await supabase
      .schema("dealership")
      .from("plano")
      .select(
        `id, nome_plano, descricao_plano, preco_mensal,
         limite_veiculos, limite_usuarios, limite_fotos_veiculo,
         tem_qr_code, tem_relatorios, tem_suporte_prioritario`
      )
      .eq("plano_ativo", true)
      .order("preco_mensal", { ascending: true });

    const planos = (data ?? []) as PlanoDB[];

    // Marca o plano do meio como "Mais Popular" (ex: Premium em 3 planos)
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
    } catch {
      return PLANOS_FALLBACK;
    }
  },
  ["pricing-plans"],
  { revalidate: 3600, tags: ["pricing-plans"] }
);

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
