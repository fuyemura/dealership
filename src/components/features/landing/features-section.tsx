import Image from "next/image";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

const FEATURES: Feature[] = [
  {
    id: "digitalizacao",
    tag: "Cadastro inteligente",
    title: "Digitalização rápida e inteligente",
    description:
      "Cadastre veículos em segundos usando a nossa tecnologia, gere QR Codes exclusivos e monitore todas as informações do seu estoque em tempo real.",
    image: "/images/veiculo-amarelo.webp",
    imageAlt: "Carro esportivo amarelo em showroom premium",
    reversed: false,
  },
  {
    id: "inventario",
    tag: "Gestão de estoque",
    title: "Controle total do seu inventário",
    description:
      "Transforme seu estoque em uma plataforma digital acessível, com QR Codes personalizados e métricas detalhadas para decisões mais ágeis.",
    image: "/images/frota-veiculos.webp",
    imageAlt: "Frota de veículos coloridos em uma concessionária moderna",
    reversed: true,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="como-funciona"
      className="py-16 sm:py-24 lg:py-32 bg-[#f5f5f3]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16 max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6b6b66] mb-3 block">
            Funcionalidades
          </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a0a0a] mb-2">
              Tudo que você precisa, num só lugar.
            </h2>
        </div>

        {/* Feature items */}
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-28">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center",
        feature.reversed && "lg:[&>*:first-child]:order-last"
      )}
    >
      {/* Texto */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6b6b66]">
          <span className="w-4 h-px bg-[#6b6b66]" />
          {feature.tag}
        </span>

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0a0a0a] leading-tight [padding-bottom:0.3em]">
          {feature.title}
        </h3>

        <p className="text-[#6b6b66] text-sm sm:text-base leading-relaxed max-w-sm">
          {feature.description}
        </p>

        {/* Decorative line */}
        <div className="mt-3 flex items-center gap-2">
          <span className="w-8 h-1 rounded-full bg-[#0a0a0a]" />
          <span className="w-2 h-1 rounded-full bg-[#d4d4d0]" />
          <span className="w-1.5 h-1 rounded-full bg-[#d4d4d0]" />
        </div>
      </div>

      {/* Imagem */}
      <div className="relative">
        {/* Moldura decorativa deslocada */}
        <div
          className={cn(
            "absolute w-full h-full rounded-2xl border-2 border-[#0a0a0a]/10",
            feature.reversed
              ? "-top-3 -left-3"
              : "-top-3 -right-3"
          )}
          aria-hidden="true"
        />
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
