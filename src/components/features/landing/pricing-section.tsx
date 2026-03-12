import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, type PricingPlan } from "@/content/landing";

export function PricingSection() {
  return (
    <section id="precos" className="py-16 sm:py-24 lg:py-32 bg-brand-gray-soft">
      <div className="page-container">
        <header className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="section-label">Planos</span>
          <h2 className="section-title">
            Simples e transparente.
          </h2>
          <p className="text-brand-gray-text text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Ideal para começar — 30 dias grátis inclusos em todos os planos.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-brand-gray-text text-sm">
            Dúvidas sobre os planos?{" "}
            <Link
              href="#contato"
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

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 sm:p-8 bg-white border-2 transition-all duration-300 hover:shadow-xl hover:shadow-black/5",
        plan.popular
          ? "border-brand-accent shadow-lg shadow-brand-accent/10 scale-[1.02]"
          : "border-brand-gray-mid/60 hover:border-brand-black/20"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-brand-accent text-brand-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-black mb-2">
          {plan.name}
        </h3>
        <p className="text-brand-gray-text text-sm mb-4">{plan.description}</p>

        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-black">
            {plan.price}
          </span>
          <span className="text-brand-gray-text text-sm font-medium">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className="text-brand-accent mt-0.5 flex-shrink-0"
              strokeWidth={2.5}
            />
            <span className="text-brand-gray-text text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          "w-full rounded-full font-semibold",
          plan.popular
            ? ""
            : "bg-white text-brand-black border-2 border-brand-black hover:bg-brand-black hover:text-white"
        )}
        variant={plan.popular ? "default" : "outline"}
      >
        <Link href="/cadastro">{plan.cta}</Link>
      </Button>
    </div>
  );
}
