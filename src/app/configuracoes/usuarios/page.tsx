import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ─── Types ───────────────────────────────────────────────────────────────────
type PapelBadgeCfg = { label: string; className: string };

const papelConfig: Record<string, PapelBadgeCfg> = {
  administrador: {
    label: "Administrador",
    className: "bg-brand-black text-brand-white",
  },
  gerente: {
    label: "Gerente",
    className:
      "bg-status-warning-bg text-status-warning-text border border-status-warning-border",
  },
  usuario: {
    label: "Usuário",
    className:
      "bg-brand-gray-soft text-brand-gray-text border border-brand-gray-mid",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCpf(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function formatUltimoLogin(dateStr: string | null): string {
  if (!dateStr) return "Nunca";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);
  if (diffH < 1) return "Agora mesmo";
  if (diffH < 24) return `há ${diffH}h`;
  if (diffD === 1) return "há 1 dia";
  if (diffD < 30) return `há ${diffD} dias`;
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Componentes visuais ─────────────────────────────────────────────────────
function PapelBadge({ papel }: { papel: string }) {
  const cfg = papelConfig[papel] ?? {
    label: papel,
    className:
      "bg-brand-gray-soft text-brand-gray-text border border-brand-gray-mid",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function UsuariosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id, empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  // Somente administradores podem gerenciar usuários
  const papelAtual = (
    usuarioAtual.papel as unknown as { nome_dominio: string } | null
  )?.nome_dominio;
  if (papelAtual !== "administrador") redirect("/dashboard");

  const empresaId = usuarioAtual.empresa_id;

  const { data: empresa } = await supabase
    .schema("dealership")
    .from("empresa")
    .select("nome_fantasia_empresa, nome_legal_empresa")
    .eq("id", empresaId)
    .single();

  const nomeEmpresa =
    empresa?.nome_fantasia_empresa || empresa?.nome_legal_empresa || null;

  const { data: usuarios } = await supabase
    .schema("dealership")
    .from("usuario")
    .select(
      "id, nome_usuario, email_usuario, cpf, ultimo_login_em, papel:dominio!papel_usuario_id(nome_dominio)"
    )
    .eq("empresa_id", empresaId)
    .order("nome_usuario", { ascending: true });

  const lista = usuarios ?? [];

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Usuários
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {nomeEmpresa && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-gray-text bg-brand-gray-soft border border-brand-gray-mid/40 rounded-full px-2.5 py-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {nomeEmpresa}
              </span>
            )}
            <p className="text-sm text-brand-gray-text">
              {lista.length}{" "}
              {lista.length === 1
                ? "usuário cadastrado"
                : "usuários cadastrados"}
            </p>
          </div>
        </div>
        <Link
          href="/configuracoes/usuarios/novo"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconPlus /> Convidar Usuário
        </Link>
      </div>

      {/* Tabela */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-gray-mid/20">
                {["Nome", "E-mail", "CPF", "Papel", "Último acesso", ""].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-mid/20">
              {lista.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-brand-gray-text"
                  >
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : (
                lista.map((u) => {
                  const papelNome =
                    (u.papel as unknown as { nome_dominio: string } | null)
                      ?.nome_dominio ?? "";
                  const isCurrentUser = u.id === usuarioAtual.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-brand-gray-soft/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-medium text-brand-black whitespace-nowrap">
                        {u.nome_usuario}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs font-normal text-brand-gray-text">
                            (você)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text">
                        {u.email_usuario}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs tracking-wider text-brand-gray-text">
                        {formatCpf(u.cpf)}
                      </td>
                      <td className="px-6 py-3.5">
                        <PapelBadge papel={papelNome} />
                      </td>
                      <td className="px-6 py-3.5 text-xs text-brand-gray-text whitespace-nowrap">
                        {formatUltimoLogin(u.ultimo_login_em)}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/configuracoes/usuarios/${u.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                          Editar <IconArrowRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: cards */}
        <div className="sm:hidden divide-y divide-brand-gray-mid/20">
          {lista.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-gray-text">
              Nenhum usuário cadastrado.
            </p>
          ) : (
            lista.map((u) => {
              const papelNome =
                (u.papel as unknown as { nome_dominio: string } | null)?.nome_dominio ??
                "";
              const isCurrentUser = u.id === usuarioAtual.id;
              return (
                <div
                  key={u.id}
                  className="px-5 py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-brand-black">
                        {u.nome_usuario}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-brand-gray-text">
                          (você)
                        </span>
                      )}
                      <PapelBadge papel={papelNome} />
                    </div>
                    <span className="text-xs text-brand-gray-text truncate">
                      {u.email_usuario}
                    </span>
                    <span className="font-mono text-xs tracking-wider text-brand-gray-text/70">
                      {formatCpf(u.cpf)}
                    </span>
                    <span className="text-xs text-brand-gray-text">
                      Último acesso: {formatUltimoLogin(u.ultimo_login_em)}
                    </span>
                  </div>
                  <Link
                    href={`/configuracoes/usuarios/${u.id}`}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
                  >
                    Editar <IconArrowRight size={12} />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
