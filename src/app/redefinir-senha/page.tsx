"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────
   Conteúdo separado para isolar o useSearchParams
   (obrigatório para o Suspense do Next.js App Router)
───────────────────────────────────────────────────────── */
function RedefinirSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  type ViewState = "trocando" | "linkInvalido" | "form" | "sucesso";
  const [view, setView] = useState<ViewState>("trocando");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /*
   * O Route Handler /auth/callback já trocou o code por uma sessão via cookies.
   * Aqui só verificamos se a sessão existe e se chegou flag de erro.
   */
  useEffect(() => {
    const erroParam = searchParams.get("erro");

    if (erroParam === "link_invalido") {
      setView("linkInvalido");
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setView("form");
      } else {
        setView("linkInvalido");
      }
    });
  }, [searchParams]);

  const handleRedefinir = async () => {
    setErro(null);

    if (!novaSenha || novaSenha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: novaSenha });

      if (error) throw error;

      setView("sucesso");

      // Redireciona para minha conta após 3 segundos (sessão já está ativa após o reset)
      setTimeout(() => router.push("/minha-conta"), 3000);
    } catch {
      setErro("Não foi possível redefinir a senha. Solicite um novo link.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Estado: trocando code ── */
  if (view === "trocando") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-8 h-8 border-2 border-brand-black/20 border-t-brand-black rounded-full animate-spin" />
        <p className="text-sm text-brand-black/60">Validando link...</p>
      </div>
    );
  }

  /* ── Estado: link inválido ou expirado ── */
  if (view === "linkInvalido") {
    return (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-brand-black mb-2">
            Link inválido ou expirado
          </h2>
          <p className="text-sm text-brand-black/60 leading-relaxed">
            Este link de redefinição é inválido ou já expirou. Solicite um novo
            para continuar.
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="rounded-full px-5 text-sm mt-2 hover:scale-[1.02]"
        >
          <Link href="/esqueceu-senha">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  /* ── Estado: senha redefinida com sucesso ── */
  if (view === "sucesso") {
    return (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-brand-black mb-2">
            Senha redefinida!
          </h2>
          <p className="text-sm text-brand-black/60 leading-relaxed">
            Sua senha foi atualizada com sucesso. Você será redirecionado para
            sua conta em instantes.
          </p>
        </div>

        <Link
          href="/minha-conta"
          className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors duration-200 mt-1"
        >
          Ir para minha conta agora
        </Link>
      </div>
    );
  }

  /* ── Estado: formulário de nova senha ── */
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-brand-black mb-2">
        Criar nova senha
      </h1>
      <p className="text-sm text-brand-black/60 mb-6">
        Escolha uma senha segura com pelo menos 8 caracteres.
      </p>

      <div className="space-y-4">
        {erro && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600 font-medium">{erro}</p>
          </div>
        )}

        {/* Nova senha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-black">
            Nova senha
          </label>
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => { setNovaSenha(e.target.value); setErro(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleRedefinir()}
              className="w-full border border-brand-gray-mid/60 rounded-xl px-4 py-3 pr-11 text-sm text-brand-black bg-brand-gray-light placeholder:text-brand-black/30 focus:outline-none focus:ring-2 focus:ring-brand-black/10 transition"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black/70 transition-colors"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmar senha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-black">
            Confirmar nova senha
          </label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => { setConfirmarSenha(e.target.value); setErro(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleRedefinir()}
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
          onClick={handleRedefinir}
          disabled={loading}
          size="sm"
          className="rounded-full px-5 text-sm hover:scale-[1.02]"
        >
          {loading ? "Salvando..." : "Salvar senha"}
        </Button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Page wrapper — layout idêntico ao login
───────────────────────────────────────────────────────── */
export default function RedefinirSenhaPage() {
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
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-8 h-8 border-2 border-brand-black/20 border-t-brand-black rounded-full animate-spin" />
                <p className="text-sm text-brand-black/60">Carregando...</p>
              </div>
            }
          >
            <RedefinirSenhaContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
