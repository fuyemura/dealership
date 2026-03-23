import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// ─── Ícones inline (SVG) ───────────────────────────────────────────────────
function IconUser() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function IconReceipt() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 2 2 3-2 3 2 2-2 3 2V2z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}

function LogoMark() {
  return (
    <div className="grid grid-cols-2 gap-[3px] w-[18px] h-[18px] flex-shrink-0">
      <div className="rounded-[2px] bg-brand-black" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black" />
    </div>
  );
}

// ─── Cards de navegação ────────────────────────────────────────────────────
// Veículos foi removido — acesso via Dashboard e nav header
const cards = [
  {
    icon: <IconUser />,
    title: "Perfil",
    description: "Edite informações pessoais e da empresa.",
    cta: "Editar Perfil",
    href: "/perfil",
  },
  {
    icon: <IconCreditCard />,
    title: "Assinatura",
    description: "Veja ou atualize seu plano atual.",
    cta: "Gerenciar Assinatura",
    href: "/assinatura",
  },
  {
    icon: <IconReceipt />,
    title: "Faturas",
    description: "Acesse seu histórico de cobranças e faturas.",
    cta: "Ver Faturas",
    href: "/faturas",
  },
];

// ─── Card de acesso rápido ─────────────────────────────────────────────────
function AccountCard({
  icon,
  title,
  description,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl border border-brand-gray-mid/30 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-brand-black">{icon}</div>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold text-brand-black">
          {title}
        </h2>
        <p className="text-sm text-brand-gray-text leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-2">
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2 hover:bg-brand-black/85 transition-colors duration-150"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

// ─── Botão de logout (Client Component) ───────────────────────────────────
// Separado para não tornar a page inteira client-side
import SignOutButton from "./sign-out-button";

// ─── Page (Server Component) ───────────────────────────────────────────────
export default async function MinhaContaPage() {
  const supabase = await createClient();

  // Verificação de segurança no servidor (o middleware já bloqueou antes,
  // mas é boa prática confirmar aqui também)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca o nome real da tabela dealership.usuario usando o auth_id
  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("nome_usuario, email_usuario")
    .eq("auth_id", user.id)
    .single();

  // Fallback seguro: nome da tabela → parte do e-mail do Auth → "Usuário"
  const displayName =
    usuario?.nome_usuario ||
    user.email?.split("@")[0] ||
    "Usuário";

  // Primeiras letras do nome para o avatar fallback
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  // Supabase Auth não armazena avatar — mantemos o fallback com iniciais
  const avatarUrl: string | undefined = undefined;

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft">
      {/* ── Header ── */}
      <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
        <div className="page-container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
              Uyemura Tech
            </span>
          </Link>

          {/* Lado direito: avatar + nome + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-brand-gray-mid/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-brand-black">
                Bem-vindo {displayName}
              </span>
            </div>

            {/* Server Action de logout — componente client isolado */}
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* ── Conteúdo ── */}
      <main className="flex-1 page-container py-10 sm:py-14">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
          Minha Conta
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {cards.map((card) => (
            <AccountCard key={card.title} {...card} />
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-brand-gray-mid/30">
        <div className="page-container h-14 flex items-center justify-between">
          <p className="text-xs text-brand-gray-text">
            © 2025 Uyemura Tech. Todos os direitos reservados.
          </p>
          <nav className="hidden sm:flex items-center gap-5">
            {["Política de Privacidade", "Termos de Serviço", "Contate-Nos"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-brand-gray-text hover:text-brand-black transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
