import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden grain-overlay">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-supercar.jpg"
          alt="Supercarros em showroom de luxo"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay escuro com gradiente central para legibilidade */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Linha decorativa acima */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="h-px w-16 bg-white/25" />
          <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
            Comece agora
          </span>
          <span className="h-px w-16 bg-white/25" />
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6 max-w-3xl mx-auto">
          Otimize seu negócio com{" "}
          <span className="relative">
            a nossa tecnologia
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#e8f015] rounded-full" />
          </span>
          .
        </h2>

        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Junte-se a centenas de concessionárias que já transformaram sua operação com a Uyemura Tech.
        </p>

        <Button
          asChild
          size="lg"
          className="bg-white text-[#0a0a0a] hover:bg-[#e8f015] font-bold rounded-full px-10 text-base h-14 transition-all duration-300 hover:scale-[1.03] group shadow-xl shadow-black/30"
        >
          <Link href="/cadastro">
            Comece Agora
            <ArrowRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </Button>

        {/* Indicadores de confiança */}
        <div className="mt-14 flex items-center justify-center gap-8 flex-wrap">
          {["Sem cartão de crédito", "Setup em minutos", "Suporte dedicado"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2 text-white/50 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8f015]" />
                {item}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
