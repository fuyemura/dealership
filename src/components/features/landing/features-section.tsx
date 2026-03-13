import Image from "next/image";
import { FEATURES } from "@/content/landing";

export function FeaturesSection() {
  const left = FEATURES[0];
  const right = FEATURES[1];

  return (
    <section id="como-funciona" className="py-8 sm:py-12 lg:py-16 bg-brand-gray-soft overflow-hidden">
      <div className="page-container">
        <header className="mb-6 max-w-lg">
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">
            Tudo que você precisa, num só lugar.
          </h2>
        </header>

        <div className="grid grid-cols-2 gap-5 lg:gap-7 items-start">

          {/* COLUNA ESQUERDA: texto + imagem */}
          <div className="flex flex-col gap-2">
            <div className="w-[85%] flex flex-col gap-3">
              <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-brand-black">
                {left.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-brand-gray-text">
                {left.description}
              </p>
            </div>

            <div className="relative w-[85%] aspect-[16/10] rounded-xl overflow-hidden shadow-md">
              <Image
                src={right.image}
                alt={right.imageAlt}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="40vw"
              />
            </div>
          </div>

          {/* COLUNA DIREITA: imagem + texto — subida com -mt */}
          <div className="flex flex-col gap-2 items-end -mt-16">
            <div className="relative w-[85%] aspect-[16/10] rounded-xl overflow-hidden shadow-md">
              <Image
                src={left.image}
                alt={left.imageAlt}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="40vw"
              />
            </div>

            <div className="w-[85%] flex flex-col gap-3">
              <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-brand-black">
                {right.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-brand-gray-text">
                {right.description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
