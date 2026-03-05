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
          src="/images/hero-dealership.jpg"
          alt="Concessionária de veículos de luxo"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay gradiente — escurece mais à esquerda para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8f015]" />
            <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
              Plataforma para concessionárias
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-up"
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
            className="text-white/70 text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}
          >
            Você está pronto para revolucionar a experiência da sua loja de veículos?
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0a0a0a] hover:bg-white/90 font-semibold rounded-full px-8 text-base h-12 transition-all duration-200 hover:scale-[1.02] group"
            >
              <Link href="/cadastro">
                Criar conta grátis
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white hover:text-white hover:bg-white/10 border border-white/30 rounded-full px-8 text-base h-12 font-medium"
            >
              <Link href="#como-funciona">Ver como funciona</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div
            className="mt-14 flex items-center gap-6 animate-fade-up"
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
          scroll
        </span>
        <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
