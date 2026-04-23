import Link from "next/link";
import AppHeader from "@/components/layout/app-header";
import ConfiguracoesSidebar from "./configuracoes-sidebar";
import { getUsuarioAutorizado } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { papel } = await getUsuarioAutorizado();
  const temAcesso = papel === "administrador" || papel === "gerente";
  const isAdmin = papel === "administrador";

  if (!temAcesso) {
    return (
      <div className="min-h-screen overflow-x-clip flex flex-col bg-brand-gray-soft">
        <AppHeader activeSection="configuracoes" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-gray-soft flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-gray-text"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-black mb-2">
              Acesso Restrito
            </h1>
            <p className="text-sm text-brand-gray-text mb-8 leading-relaxed">
              Esta área é exclusiva para administradores e gerentes. Entre em
              contato com o administrador da sua empresa caso precise de acesso.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip flex flex-col bg-brand-gray-soft">
      <AppHeader activeSection="configuracoes" />

      <div className="flex flex-1 overflow-x-hidden">
        <aside className="hidden md:flex flex-col w-52 lg:w-60 shrink-0 border-r border-brand-gray-mid/40 bg-white">
          <ConfiguracoesSidebar isAdmin={isAdmin} />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="md:hidden border-b border-brand-gray-mid/40 bg-white overflow-x-auto">
            <ConfiguracoesSidebar mobile isAdmin={isAdmin} />
          </div>
          <main className="flex-1 min-w-0 px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}