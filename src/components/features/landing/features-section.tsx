import Image from "next/image";
import { cn } from "@/lib/utils";
import { FEATURES, type Feature } from "@/content/landing";

export function FeaturesSection() {
  return (
    <section id="como-funciona" className="py-8 sm:py-12 lg:py-16 bg-brand-gray-soft overflow-visible">  
      <div className="page-container">
        <header className="mb-8 sm:mb-12 max-w-lg overflow-visible"> 
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">
            Tudo que você precisa, num só lugar.
          </h2>
        </header>

        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureItem({ feature }: { feature: Feature }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center",
        feature.reversed && "lg:[&>*:first-child]:order-last"
      )}
    >
      {/* Texto */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gray-text">
          <span className="w-4 h-px bg-brand-gray-text" />
          {feature.tag}
        </span>

        <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-brand-black leading-tight">
          {feature.title}
        </h3>

        <p className="text-brand-gray-text text-xs sm:text-sm leading-relaxed max-w-sm">
          {feature.description}
        </p>

        {/* Linha decorativa */}
        <div className="mt-2 flex items-center gap-2">
          <span className="w-8 h-1 rounded-full bg-brand-black" />
          <span className="w-2 h-1 rounded-full bg-brand-gray-mid" />
          <span className="w-1.5 h-1 rounded-full bg-brand-gray-mid" />
        </div>
      </div>

      {/* Imagem */}
      <div className="relative">
        <div
          className={cn(
            "absolute w-full h-full rounded-2xl border-2 border-brand-black/10",
            feature.reversed ? "-top-3 -left-3" : "-top-3 -right-3"
          )}
          aria-hidden="true"
        />
        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
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
