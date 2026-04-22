import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatData } from "@/lib/utils/formatters";

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconFolder({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoriasPage() {
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

  const papelAtual = (
    usuarioAtual.papel as unknown as { nome_dominio: string } | null
  )?.nome_dominio?.toLowerCase();
  if (papelAtual === "usuario") redirect("/dashboard");

  const { data: categorias } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select(
      "id, nome, descricao, criado_em, criado_por_usuario:usuario!criado_por(nome_usuario)"
    )
    .eq("empresa_id", usuarioAtual.empresa_id)
    .order("nome", { ascending: true });

  const lista = categorias ?? [];

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Categorias de Despesa
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            {lista.length}{" "}
            {lista.length === 1
              ? "categoria cadastrada"
              : "categorias cadastradas"}
          </p>
        </div>
        <Link
          href="/financeiro/categorias/nova"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconPlus /> Nova Categoria
        </Link>
      </div>

      {/* Estado vazio */}
      {lista.length === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconFolder size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhuma categoria cadastrada
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            Cadastre as categorias de despesa da sua empresa (ex: Energia
            Elétrica, Aluguel, Pessoal) para organizar os seus lançamentos.
          </p>
          <Link
            href="/financeiro/categorias/nova"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            <IconPlus /> Nova Categoria
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
                  {(["Categoria", "Descrição", "Criado em", "Criado por", "Ações"] as const).map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap"
                    >
                      <span className={col === "Ações" ? "sr-only" : ""}>{col}</span>
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
                        {c.nome}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text max-w-xs truncate">
                        {c.descricao ?? (
                          <span className="italic text-brand-gray-text/60">
                            Sem descrição
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                        {formatData(c.criado_em)}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                        {criadoPor}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/financeiro/categorias/${c.id}`}
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
                <div key={c.id} className="px-5 py-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{c.nome}</p>
                    {c.descricao && (
                      <p className="text-xs text-brand-gray-text mt-0.5 line-clamp-2">
                        {c.descricao}
                      </p>
                    )}
                    <p className="text-xs text-brand-gray-text/60 mt-1">
                      {formatData(c.criado_em)} · {criadoPor}
                    </p>
                  </div>
                  <Link
                    href={`/financeiro/categorias/${c.id}`}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
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
