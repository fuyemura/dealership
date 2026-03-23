"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type ViewState = "form" | "enviado";

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("form");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpa o intervalo ao desmontar
  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const iniciarCooldown = (segundos: number) => {
    setCooldown(segundos);
    cooldownRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleEnviar = async () => {
    setErro(null);

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
      });

      if (error) {
        // Detecta rate limit: "you can only request this after X seconds"
        const match = error.message.match(/(\d+)\s*seconds?/i);
        if (match) {
          iniciarCooldown(parseInt(match[1], 10));
        } else {
          setErro("Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.");
        }
        return;
      }

      setView("enviado");
    } catch {
      setErro("Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-soft flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-brand-gray-mid/40">
        <div className="page-container h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-brand-black font-display text-base sm:text-lg tracking-tight"
          >
            <span className="flex items-center gap-0.5" aria-hidden="true">
              <span className="flex flex-col gap-0.5">
                <span className="block w-2 h-2 bg-brand-black rounded-[2px]" />
                <span className="block w-2 h-2 bg-brand-black/40 rounded-[2px]" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="block w-2 h-2 bg-brand-black/40 rounded-[2px]" />
                <span className="block w-2 h-2 bg-brand-black rounded-[2px]" />
              </span>
            </span>
            <span className="font-semibold">Uyemura Tech</span>
          </Link>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-brand-black hover:text-brand-black hover:bg-brand-black/5 text-xs sm:text-sm"
          >
            <Link href="/login">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Link>
          </Button>
        </div>
      </header>

      {/* Card */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-10 py-10">

          {view === "form" ? (
            <>
              <h1 className="font-display text-2xl font-semibold text-brand-black mb-2">
                Esqueceu a senha?
              </h1>
              <p className="text-sm text-brand-black/60 mb-6">
                Informe seu e-mail e enviaremos um link para você criar uma nova senha.
              </p>

              <div className="space-y-4">
                {cooldown > 0 && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                    <p className="text-sm text-amber-700 font-medium">
                      Aguarde <span className="tabular-nums font-bold">{cooldown}s</span> antes de solicitar novamente.
                    </p>
                  </div>
                )}
                {erro && cooldown === 0 && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-600 font-medium">{erro}</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-brand-black">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErro(null); }}
                    onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
                    placeholder="seu@email.com"
                    className="w-full border border-brand-gray-mid/60 rounded-xl px-4 py-3 text-sm text-brand-black bg-brand-gray-light placeholder:text-brand-black/30 focus:outline-none focus:ring-2 focus:ring-brand-black/10 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors duration-200"
                >
                  Voltar ao login
                </Link>
                <Button
                  onClick={handleEnviar}
                  disabled={loading || cooldown > 0}
                  size="sm"
                  className="rounded-full px-5 text-sm hover:scale-[1.02]"
                >
                  {loading ? "Enviando..." : cooldown > 0 ? `Aguarde ${cooldown}s` : "Enviar link"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center gap-4">
                {/* Ícone de e-mail */}
                <div className="w-14 h-14 rounded-full bg-brand-black/5 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-brand-black/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-semibold text-brand-black mb-2">
                    Verifique seu e-mail
                  </h2>
                  <p className="text-sm text-brand-black/60 leading-relaxed">
                    Enviamos um link de redefinição para{" "}
                    <span className="font-medium text-brand-black">{email}</span>.
                    Abra o e-mail e clique no link para criar uma nova senha.
                  </p>
                </div>

                <p className="text-xs text-brand-black/40 mt-2">
                  Não recebeu? Verifique a pasta de spam ou{" "}
                  <button
                    onClick={() => setView("form")}
                    className="underline underline-offset-2 hover:text-brand-black/60 transition-colors"
                  >
                    tente novamente
                  </button>
                  .
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-gray-mid/30 text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors duration-200"
                >
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
