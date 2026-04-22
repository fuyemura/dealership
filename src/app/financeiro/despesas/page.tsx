import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatData } from "@/lib/utils/formatters";
import { BotaoReplicar } from "./_components/botao-replicar";
import { SeletorMes } from "./_components/seletor-mes";

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

function IconReceipt({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Gera lista dos últimos 12 meses no formato { value: "YYYY-MM", label: "Mês YYYY" } */
function gerarOpcoesMes() {
  const opcoes: { value: string; label: string }[] = [];
  const agora = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    opcoes.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return opcoes;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = {
  searchParams: Promise<{ mes?: string }>;
};

export default async function DespesasPage({ searchParams }: Props) {
  const { mes } = await searchParams;

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

  const empresaId = usuarioAtual.empresa_id;

  const opcoesMes = gerarOpcoesMes();
  const mesSelecionado = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : opcoesMes[0].value;

  // Calcula intervalo do mês selecionado
  const [anoStr, mesStr] = mesSelecionado.split("-");
  const dataInicio = `${mesSelecionado}-01`;
  const ultimoDia = new Date(Number(anoStr), Number(mesStr), 0).getDate();
  const dataFim = `${mesSelecionado}-${String(ultimoDia).padStart(2, "0")}`;

  // Busca despesas com filtro de mês
  const { data: despesas } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .select(
      "id, descricao, valor, data_despesa, recorrente, categoria:despesa_categoria!categoria_id(id, nome)"
    )
    .eq("empresa_id", empresaId)
    .gte("data_despesa", dataInicio)
    .lte("data_despesa", dataFim)
    .order("data_despesa", { ascending: false });
  const lista = despesas ?? [];

  // Total do período
  const totalPeriodo = lista.reduce((acc, d) => acc + Number(d.valor), 0);

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Despesas
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            {lista.length}{" "}
            {lista.length === 1 ? "lançamento" : "lançamentos"} ·{" "}
            <span className="font-medium text-brand-black">
              {formatMoeda(totalPeriodo)}
            </span>{" "}
            no período
          </p>
        </div>
        <Link
          href="/financeiro/despesas/nova"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconPlus /> Nova Despesa
        </Link>
      </div>

      {/* Filtro de mês: 3 pílulas rápidas + select para meses anteriores */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {opcoesMes.slice(0, 3).map((op) => (
          <Link
            key={op.value}
            href={`/financeiro/despesas?mes=${op.value}`}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border ${
              mesSelecionado === op.value
                ? "bg-brand-black text-brand-white border-brand-black"
                : "border-brand-gray-mid text-brand-gray-text hover:text-brand-black hover:border-brand-black/30"
            }`}
          >
            {op.label}
          </Link>
        ))}
        <SeletorMes
          opcoes={opcoesMes.slice(3)}
          mesSelecionado={mesSelecionado}
          basePath="/financeiro/despesas"
        />
      </div>

      {/* Estado vazio */}
      {lista.length === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconReceipt size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhuma despesa neste período
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            Registre as despesas operacionais da sua empresa para acompanhar o
            resultado do período.
          </p>
          <Link
            href="/financeiro/despesas/nova"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            <IconPlus /> Nova Despesa
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
                  {(["Data", "Categoria", "Descrição", "Valor", "Ações"] as const).map((col) => (
                    <th
                      key={col}
                      className={`px-6 py-3 text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap ${
                        col === "Valor" || col === "Ações" ? "text-right" : "text-left"
                      }`}
                    >
                      <span className={col === "Ações" ? "sr-only" : ""}>{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-mid/20">
                {lista.map((d) => {
                  const cat = d.categoria as unknown as { nome: string } | null;
                  return (
                    <tr key={d.id} className="hover:bg-brand-gray-soft/50 transition-colors">
                      <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                        {formatData(d.data_despesa)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40">
                          {cat?.nome ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-brand-black max-w-xs truncate">
                        <span className="flex items-center gap-2">
                          {d.descricao}
                          {d.recorrente && (
                            <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-brand-gray-soft text-brand-gray-text border border-brand-gray-mid/40">
                              Recorrente
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-medium text-brand-black tabular-nums whitespace-nowrap">
                        {formatMoeda(Number(d.valor))}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-4">
                          {d.recorrente && <BotaoReplicar id={d.id} />}
                          <Link
                            href={`/financeiro/despesas/${d.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity whitespace-nowrap"
                          >
                            Editar <IconArrowRight />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Rodapé com total */}
              <tfoot>
                <tr className="border-t-2 border-brand-gray-mid/30 bg-brand-gray-soft/40">
                  <td colSpan={3} className="px-6 py-3 text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                    Total do período
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-brand-black tabular-nums whitespace-nowrap">
                    {formatMoeda(totalPeriodo)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="sm:hidden divide-y divide-brand-gray-mid/20">
            {lista.map((d) => {
              const cat = d.categoria as unknown as { nome: string } | null;
              return (
                <div key={d.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brand-black truncate">
                        {d.descricao}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40">
                          {cat?.nome ?? "—"}
                        </span>
                        {d.recorrente && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-brand-gray-soft text-brand-gray-text border border-brand-gray-mid/40">
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="shrink-0 font-bold text-brand-black tabular-nums text-sm">
                      {formatMoeda(Number(d.valor))}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-brand-gray-text/60">{formatData(d.data_despesa)}</p>
                    <div className="flex items-center gap-4">
                      {d.recorrente && <BotaoReplicar id={d.id} />}
                      <Link
                        href={`/financeiro/despesas/${d.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
                      >
                        Editar <IconArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Total mobile */}
            <div className="px-5 py-3 bg-brand-gray-soft/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                Total do período
              </span>
              <span className="font-bold text-brand-black tabular-nums text-sm">
                {formatMoeda(totalPeriodo)}
              </span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
