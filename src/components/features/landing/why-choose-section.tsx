"use client";

import { GitBranch, Lightbulb, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: GitBranch,
    title: "Eficiência Encontra Inovação",
    description:
      "Automatize a apresentação dos seus produtos, economize tempo com cadastros e ofereça uma experiência moderna, rápida e intuitiva que destaca sua empresa da concorrência.",
  },
  {
    icon: Lightbulb,
    title: "Venda mais com menos esforço.",
    description:
      "Inove sua operação com um sistema inteligente que conecta seus produtos ao público, 24 horas por dia, mesmo quando você estiver offline.",
  },
  {
    icon: QrCode,
    title: "Soluções Modernas",
    description:
      "A Uyemura Tech oferece um sistema completo de digitalização para veículos em estoque. Nosso principal serviço é a geração de QR Codes inteligentes, que levam o cliente direto para uma página com todos os dados do carro ou moto — sem precisar baixar apps.",
  },
];

export function WhyChooseSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(1); // start highlighted on second card

  return (
    <section id="quem-somos" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6b6b66] mb-3 block">
            Diferenciais
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] leading-tight">
            Por que escolher a Uyemura Tech?
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard
              key={benefit.title}
              benefit={benefit}
              index={index}
              isActive={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(1)}
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
  onHover: () => void;
  onLeave: () => void;
}

function BenefitCard({
  benefit,
  index,
  isActive,
  onHover,
  onLeave,
}: BenefitCardProps) {
  const Icon = benefit.icon;

  // highlight only if this card is active (hovered)
  const isHighlighted = isActive;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`
        relative rounded-2xl p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 transition-all duration-300
        ${
          isHighlighted
            ? "bg-[#0a0a0a] text-white shadow-2xl shadow-black/20 scale-[1.02]"
            : "bg-[#f5f5f3] text-[#0a0a0a]"
        }
      `}
    >
      {/* Ícone */}
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300
          ${
            isHighlighted
              ? "bg-[#e8f015]"
              : "bg-[#0a0a0a]/8"
          }
        `}
      >
        <Icon
          size={22}
          className={
            isHighlighted
              ? "text-[#0a0a0a]"
              : "text-[#0a0a0a]"
          }
          strokeWidth={1.75}
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-3">
        <h3
          className={`
          font-display text-lg sm:text-xl font-bold leading-snug
          ${isHighlighted ? "text-white" : "text-[#0a0a0a]"}
        `}
        >
          {benefit.title}
        </h3>
        <p
          className={`
          text-xs sm:text-sm leading-relaxed
          ${
            isHighlighted
              ? "text-white/65"
              : "text-[#6b6b66]"
          }
        `}
        >
          {benefit.description}
        </p>
      </div>

      {/* Número decorativo */}
      <span
        className={`
        absolute top-6 right-6 sm:right-8 font-display text-6xl sm:text-7xl font-bold select-none pointer-events-none transition-colors duration-300
        ${
          isHighlighted
            ? "text-white/5"
            : "text-[#0a0a0a]/5"
        }
      `}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}
