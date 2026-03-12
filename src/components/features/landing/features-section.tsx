import Image from "next/image";
import { cn } from "@/lib/utils";
import { FEATURES, type Feature } from "@/content/landing";

export function FeaturesSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 lg:py-32 bg-brand-gray-soft overflow-visible">  
      <div className="page-container">
        <header className="mb-12 sm:mb-16 max-w-lg overflow-visible"> 
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">
            Tudo que você precisa, num só lu&#103;ar.
          </h2>
        </header>

        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-28">
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
        "grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center",
        feature.reversed && "lg:[&>*:first-child]:order-last"
      )}
    >
      {/* Texto */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gray-text">
          <span className="w-4 h-px bg-brand-gray-text" />
          {feature.tag}
        </span>

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-black leading-tight">
          {feature.title}
        </h3>

        <p className="text-brand-gray-text text-sm sm:text-base leading-relaxed max-w-sm">
          {feature.description}
        </p>

        {/* Linha decorativa */}
        <div className="mt-3 flex items-center gap-2">
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
