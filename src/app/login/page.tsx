"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setErro(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Autenticar via Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (authError || !data.user) {
        setErro("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
        return;
      }

      // 2. Verificar se o usuário existe na tabela usuario
      const { data: usuario, error: dbError } = await supabase
        .schema("dealership")
        .from("usuario")
        .select("id, nome_usuario, papel_usuario_id")
        .eq("auth_id", data.user.id)
        .single();

      if (dbError || !usuario) {
        // Autenticou no Auth mas não tem cadastro na tabela usuario
        await supabase.auth.signOut();
        setErro("Usuário não encontrado. Entre em contato com o administrador.");
        return;
      }

      // 3. Redirecionar para o dashboard (tela ainda a definir)
      router.push("/dashboard");

    } catch {
      setErro("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-soft flex flex-col">
      {/* Header — mesmo padrão da Navbar principal */}
      <header className="bg-white border-b border-brand-gray-mid/40">
        <div className="page-container h-14 sm:h-16 flex items-center justify-between">
          {/* Logo — idêntico ao da Navbar */}
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

          {/* Voltar ao site */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-brand-black hover:text-brand-black hover:bg-brand-black/5 text-xs sm:text-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Link>
          </Button>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-10 py-10">
          <h1 className="font-display text-2xl font-semibold text-brand-black mb-6">
            Login do Cliente
          </h1>

          <form
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            noValidate
            className="space-y-4"
          >
            {/* Mensagem de erro */}
            {erro && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3" role="alert">
                <p className="text-sm text-red-600 font-medium">{erro}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-brand-black">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErro(null); }}
                className="w-full border border-brand-gray-mid/60 rounded-xl px-4 py-3 text-sm text-brand-black bg-brand-gray-light placeholder:text-brand-black/30 focus:outline-none focus:ring-2 focus:ring-brand-black/10 transition"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="senha" className="text-sm font-medium text-brand-black">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); setErro(null); }}
                className="w-full border border-brand-gray-mid/60 rounded-xl px-4 py-3 text-sm text-brand-black bg-brand-gray-light placeholder:text-brand-black/30 focus:outline-none focus:ring-2 focus:ring-brand-black/10 transition"
              />
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/esqueceu-senha"
                className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors duration-200"
              >
                Esqueceu a senha?
              </Link>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="rounded-full px-5 text-sm hover:scale-[1.02]"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>

          {/* Criar conta */}
          <div className="mt-6 pt-4 border-t border-brand-gray-mid/30">
            <Link
              href="/cadastro"
              className="text-sm font-medium text-brand-black/70 hover:text-brand-black transition-colors duration-200"
            >
              Criar uma conta
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
