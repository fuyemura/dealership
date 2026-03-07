import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Básico",
    price: "R$ 99",
    period: "/mês",
    description: "Perfeito para pequenas concessionárias",
    features: [
      "Até 50 veículos",
      "QR Codes básicos",
      "Dashboard simples",
      "Suporte por email",
    ],
    cta: "Começar grátis",
  },
  {
    name: "Profissional",
    price: "R$ 299",
    period: "/mês",
    description: "Para concessionárias em crescimento",
    features: [
      "Até 200 veículos",
      "QR Codes avançados",
      "Analytics completo",
      "Suporte prioritário",
      "Integração com CRM",
    ],
    popular: true,
    cta: "Começar teste grátis",
  },
  {
    name: "Enterprise",
    price: "R$ 599",
    period: "/mês",
    description: "Para grandes redes de concessionárias",
    features: [
      "Veículos ilimitados",
      "QR Codes premium",
      "Analytics avançado",
      "Suporte 24/7",
      "API completa",
      "Consultoria dedicada",
    ],
    cta: "Falar com vendas",
  },
];

export function PricingSection() {
  return (
    <section id="precos" className="py-16 sm:py-24 lg:py-32 bg-[#f5f5f3]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6b6b66] mb-3 block">
            Planos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] leading-tight">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-[#6b6b66] text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Comece pequeno e cresça conforme seu negócio. Todos os planos incluem 14 dias grátis.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-[#6b6b66] text-sm">
            Dúvidas sobre os planos?{" "}
            <a href="#contato" className="text-[#0a0a0a] hover:text-[#e8f015] font-medium transition-colors">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  return (
    <div
      className={`
        relative rounded-2xl p-6 sm:p-8 bg-white border-2 transition-all duration-300 hover:shadow-xl hover:shadow-black/5
        ${
          plan.popular
            ? "border-[#e8f015] shadow-lg shadow-[#e8f015]/10 scale-[1.02]"
            : "border-[#e8e8e8] hover:border-[#0a0a0a]/20"
        }
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#e8f015] text-[#0a0a0a] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
            Mais Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0a0a0a] mb-2">
          {plan.name}
        </h3>
        <p className="text-[#6b6b66] text-sm mb-4">{plan.description}</p>

        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-[#0a0a0a]">
            {plan.price}
          </span>
          <span className="text-[#6b6b66] text-sm font-medium">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <Check
              size={16}
              className="text-[#e8f015] mt-0.5 flex-shrink-0"
              strokeWidth={2.5}
            />
            <span className="text-[#6b6b66] text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className={`
          w-full py-3 px-6 rounded-full font-semibold text-sm transition-all duration-300
          ${
            plan.popular
              ? "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/90 hover:shadow-lg hover:shadow-black/20"
              : "bg-white text-[#0a0a0a] border-2 border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          }
        `}
      >
        {plan.cta}
      </button>
    </div>
  );
}