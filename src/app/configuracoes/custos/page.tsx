import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatData } from "@/lib/utils/formatters";

// ─── Ícones ───────────────────────────────────────────────────────────────────
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

function IconTag({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function CustosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  // Somente administradores e gerentes podem gerenciar tipos de custo
  const papelAtual = (
    usuarioAtual.papel as unknown as { nome_dominio: string } | null
  )?.nome_dominio;
  if (papelAtual === "usuario") redirect("/dashboard");

  const empresaId = usuarioAtual.empresa_id;

  const { data: custos } = await supabase
    .schema("dealership")
    .from("veiculo_custo")
    .select("id, nome_custo, descricao, criado_em, criado_por_usuario:usuario!criado_por(nome_usuario)")
    .eq("empresa_id", empresaId)
    .order("nome_custo", { ascending: true });

  const lista = custos ?? [];

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Tipos de Custo
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            {lista.length}{" "}
            {lista.length === 1
              ? "tipo de custo cadastrado"
              : "tipos de custo cadastrados"}
          </p>
        </div>
        <Link
          href="/configuracoes/custos/novo"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconPlus /> Novo Tipo de Custo
        </Link>
      </div>

      {/* Vazio */}
      {lista.length === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconTag size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhum tipo de custo cadastrado
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            Cadastre os tipos de custo ou serviço de manutenção utilizados pela
            sua empresa (ex: Troca de pneu, Pintura, Revisão).
          </p>
          <Link
            href="/configuracoes/custos/novo"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            <IconPlus /> Novo Tipo de Custo
          </Link>
        </section>
      )}

      {/* Tabela */}
      {lista.length > 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray-mid/20">
                  {["Nome do custo", "Descrição", "Criado em", "Criado por", ""].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-mid/20">
                {lista.map((c) => {
                  const criadoPor =
                    (c.criado_por_usuario as unknown as { nome_usuario: string } | null)
                      ?.nome_usuario ?? "—";
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-brand-gray-soft/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 font-medium text-brand-black whitespace-nowrap">
                        {c.nome_custo}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text max-w-xs truncate">
                        {c.descricao ?? <span className="italic text-brand-gray-text/60">Sem descrição</span>}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                        {formatData(c.criado_em)}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                        {criadoPor}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/configuracoes/custos/${c.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                          Editar <IconArrowRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="sm:hidden divide-y divide-brand-gray-mid/20">
            {lista.map((c) => {
              const criadoPor =
                (c.criado_por_usuario as unknown as { nome_usuario: string } | null)
                  ?.nome_usuario ?? "—";
              return (
                <div
                  key={c.id}
                  className="px-5 py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">
                      {c.nome_custo}
                    </p>
                    {c.descricao && (
                      <p className="text-xs text-brand-gray-text line-clamp-2">
                        {c.descricao}
                      </p>
                    )}
                    <p className="text-xs text-brand-gray-text mt-0.5">
                      {formatData(c.criado_em)} · {criadoPor}
                    </p>
                  </div>
                  <Link
                    href={`/configuracoes/custos/${c.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
                  >
                    Editar <IconArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

