"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type SignupPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  period?: string;
  popular?: boolean;
  features: string[];
};

export function PlanoSelecao({ plans }: { plans: SignupPlan[] }) {
  const router = useRouter();
  const defaultPlan = plans.find((p) => p.popular)?.id ?? plans[0]?.id ?? "";
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlan);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!selectedPlanId) return;
    setIsLoading(true);
    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
    if (selectedPlan) {
      sessionStorage.setItem(
        "signup:selectedPlan",
        JSON.stringify({
          id: selectedPlan.id,
          name: selectedPlan.name,
          price: selectedPlan.price,
          period: selectedPlan.period ?? "/mês",
        })
      );
    }
    await new Promise((r) => setTimeout(r, 300));
    router.push("/cadastro/pagamento");
  }

  return (
    <div className="space-y-8">
      {plans.length === 0 ? (
        <div className="rounded-xl border border-brand-gray-mid/50 bg-brand-white p-6 text-center text-sm text-brand-gray-text">
          Nenhum plano disponível no momento.
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={() => setSelectedPlanId(plan.id)}
          />
        ))}
      </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          className="text-brand-gray-text hover:text-brand-black"
          onClick={() => router.push("/")}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          disabled={isLoading || !selectedPlanId}
          onClick={handleSubmit}
          className="rounded-full px-6 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100"
        >
          {isLoading ? "Aguarde…" : "Continuar →"}
        </Button>
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: SignupPlan;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative rounded-2xl p-6 sm:p-8 bg-brand-white border-2 transition-all duration-150 flex flex-col text-left w-full cursor-pointer",
        isSelected
          ? "border-brand-accent shadow-lg shadow-brand-accent/10 scale-[1.02]"
          : "border-brand-gray-mid/60 hover:border-brand-black/20 shadow-none scale-100"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-brand-accent text-brand-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
            Mais Popular
          </span>
        </div>
      )}

      {/* Selected indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center",
          isSelected
            ? "border-brand-accent bg-brand-accent"
            : "border-brand-gray-mid bg-transparent"
        )}
      >
        {isSelected && (
          <Check size={12} className="text-brand-black" strokeWidth={3} />
        )}
      </div>

      <div className="text-center mb-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-black mb-2">
          {plan.name}
        </h3>
        <p className="text-brand-gray-text text-sm mb-4">{plan.description}</p>

        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-black">
            {plan.price}
          </span>
          <span className="text-brand-gray-text text-sm font-medium">{plan.period ?? "/mês"}</span>
        </div>
      </div>

      <ul className="space-y-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className="text-brand-accent mt-0.5 flex-shrink-0"
              strokeWidth={2.5}
            />
            <span className="text-sm text-brand-gray-text">{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
