import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/showroom-veiculos.webp"
          alt="Concessionária de veículos de luxo"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay gradiente — ajustado para menos escuro */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-6 sm:mb-8 animate-fade-up hover:bg-white/10 transition-colors duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8f015] animate-pulse" />
            <span className="text-white/80 text-xs font-medium tracking-widest uppercase">
              Plataforma para concessionárias
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4 sm:mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}
          >
            Junte-se à{" "}
            <span className="relative inline-block">
              Uyemura Tech
              <span
                className="absolute -bottom-1 left-0 h-1 bg-[#e8f015] rounded-full animate-fade-up"
                style={{
                  width: "100%",
                  animationDelay: "0.5s",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              />
            </span>
            .
          </h1>

          {/* Subtítulo */}
          <p
            className="text-white/70 text-base sm:text-lg lg:text-xl font-light leading-relaxed mb-8 sm:mb-10 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}
          >
            Você está pronto para revolucionar a experiência da sua loja de veículos?
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0a0a0a] font-semibold rounded-full px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 transition-all duration-300 hover:bg-white/95 hover:shadow-lg hover:shadow-white/20 group"
            >
              <Link href="/cadastro">
                Criar conta grátis
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white hover:text-white hover:bg-white/15 border border-white/25 rounded-full px-6 sm:px-8 text-sm sm:text-base h-11 sm:h-12 font-medium transition-all duration-300"
            >
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="h-px flex-1 max-w-16 bg-white/20" />
            <div className="flex items-center gap-8 text-white/50 text-sm">
              <span>Cadastro rápido</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>QR Code exclusivo</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Sem app</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seta de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs tracking-widest uppercase font-medium">
          deslizar para baixo
        </span>
        <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
