"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { PricingPlanDisplay } from "./pricing-section";

export function PricingGrid({ plans }: { plans: PricingPlanDisplay[] }) {
  const defaultId = plans.find((p) => p.popular)?.id ?? plans[0]?.id ?? "";
  const [activePlanId, setActivePlanId] = useState<string>(defaultId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isActive={activePlanId === plan.id}
          onHover={() => setActivePlanId(plan.id)}
        />
      ))}
    </div>
  );
}

function PricingCard({
  plan,
  isActive,
  onHover,
}: {
  plan: PricingPlanDisplay;
  isActive: boolean;
  onHover: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        "relative rounded-2xl p-6 sm:p-8 bg-white border-2 transition-all duration-150 flex flex-col cursor-pointer",
        isActive
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

      <div className="text-center mb-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-black mb-2">
          {plan.name}
        </h3>
        <p className="text-brand-gray-text text-sm mb-4">{plan.description}</p>

        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display text-3xl sm:text-4xl font-bold text-brand-black">
            {plan.price}
          </span>
          <span className="text-brand-gray-text text-sm font-medium">/mês</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
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
          "w-full rounded-full font-semibold mt-auto transition-all duration-150",
          isActive
            ? "bg-brand-black text-white hover:bg-brand-black/90"
            : "bg-white text-brand-black border-2 border-brand-black hover:bg-brand-black hover:text-white"
        )}
      >
        <Link href="/contato">{plan.cta}</Link>
      </Button>
    </div>
  );
}
