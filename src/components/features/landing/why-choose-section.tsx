"use client";

import { useState } from "react";
import { GitBranch, Lightbulb, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BENEFITS, type Benefit } from "@/content/landing";

// Mapa de iconName (string do content) → componente Lucide
const ICON_MAP: Record<Benefit["iconName"], LucideIcon> = {
  "git-branch": GitBranch,
  "lightbulb":  Lightbulb,
  "qr-code":    QrCode,
};

export function WhyChooseSection() {
  const [activeIndex, setActiveIndex] = useState<number>(1);

  return (
    <section id="quem-somos" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="page-container">
        <header className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="section-label">Diferenciais</span>
          <h2 className="section-title">
            Por que escolher a Uyemura Tech?
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={index}
              isActive={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface BenefitCardProps {
  benefit: Benefit;
  index: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function BenefitCard({
  benefit,
  index,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: BenefitCardProps) {
  const Icon = ICON_MAP[benefit.iconName];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative rounded-2xl p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 transition-all duration-300",
        isActive
          ? "bg-brand-black text-white shadow-2xl shadow-black/20 scale-[1.02]"
          : "bg-brand-gray-soft text-brand-black"
      )}
    >
      {/* Ícone */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
          isActive ? "bg-brand-accent" : "bg-brand-black/8"
        )}
      >
        <Icon size={22} className="text-brand-black" strokeWidth={1.75} />
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-3">
        <h3
          className={cn(
            "font-display text-lg sm:text-xl font-bold leading-snug",
            isActive ? "text-white" : "text-brand-black"
          )}
        >
          {benefit.title}
        </h3>
        <p
          className={cn(
            "text-xs sm:text-sm leading-relaxed",
            isActive ? "text-white/65" : "text-brand-gray-text"
          )}
        >
          {benefit.description}
        </p>
      </div>

      {/* Número decorativo */}
      <span
        className={cn(
          "absolute top-6 right-6 sm:right-8 font-display text-6xl sm:text-7xl font-bold select-none pointer-events-none transition-colors duration-300",
          isActive ? "text-white/5" : "text-brand-black/5"
        )}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
