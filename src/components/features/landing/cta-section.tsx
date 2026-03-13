import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const TRUST_ITEMS = ["Com cartão de crédito", "Setup em minutos", "Suporte dedicado"] as const;

export function CtaSection() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden grain-overlay">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/showroom-veiculos-luxo.webp"
          alt="Showroom de veículos de luxo"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 page-container text-center">
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-10">
          <span className="h-px w-12 sm:w-16 bg-white/25" />
          <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
            Comece agora
          </span>
          <span className="h-px w-12 sm:w-16 bg-white/25" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-4 sm:mb-6 max-w-3xl mx-auto">
          Otimize seu negócio com{" "}
          <span className="relative">
            a nossa tecnologia
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-accent rounded-full" />
          </span>
          .
        </h2>

        <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
          Junte-se a centenas de revendas de veículos já transformaram sua operação com a Uyemura Tech.
        </p>

        <Button
          asChild
          size="lg"
          className="bg-white text-brand-black hover:bg-brand-accent hover:text-brand-black hover:shadow-2xl hover:shadow-white/50 hover:scale-[1.04] font-bold rounded-full px-8 sm:px-10 h-12 sm:h-14 shadow-lg group"
        >
          <Link href="/cadastro">
            Comece Agora
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
            />
          </Link>
        </Button>

        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 flex-wrap">
          {TRUST_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
