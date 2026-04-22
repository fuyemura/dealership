import Link from "next/link";
import { redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { formatData } from "@/lib/utils/formatters";
import { SeletorMes } from "./lucratividade/_components/seletor-mes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPct(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + "%";
}

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

// ─── Tipos internos ───────────────────────────────────────────────────────────

type ManutencaoRaw = {
  valor_manutencao: number;
  situacao: { nome_dominio: string } | null;
};

type DespesaComCategoria = {
  valor: number;
  categoria: { nome: string } | null;
};

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconArrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = { searchParams: Promise<{ mes?: string }> };

export default async function ResultadoPeriodoPage({ searchParams }: Props) {
  const { mes } = await searchParams;
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const empresaId = usuarioAtual.empresa_id;

  const opcoesMes = gerarOpcoesMes();
  const mesSelecionado = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : opcoesMes[0].value;
  const [anoStr, mesStr] = mesSelecionado.split("-");
  const dataInicio = `${mesSelecionado}-01`;
  const ultimoDia = new Date(Number(anoStr), Number(mesStr), 0).getDate();
  const dataFim = `${mesSelecionado}-${String(ultimoDia).padStart(2, "0")}`;

  // ── Queries paralelas ────────────────────────────────────────────────────────

  const [{ data: despesasRaw }, { data: veiculosVendidosRaw }] = await Promise.all([
    supabase
      .schema("dealership")
      .from("empresa_despesa")
      .select("valor, categoria:despesa_categoria!categoria_id(nome)")
      .eq("empresa_id", empresaId)
      .gte("data_despesa", dataInicio)
      .lte("data_despesa", dataFim),

    supabase
      .schema("dealership")
      .from("veiculo")
      .select(`
        id, placa, preco_compra, preco_venda, data_venda,
        marca:veiculo_marca!marca_veiculo_id(nome),
        modelo:veiculo_modelo!modelo_veiculo_id(nome),
        manutencoes:veiculo_manutencao(
          valor_manutencao,
          situacao:dominio!situacao_manutencao_id(nome_dominio)
        )
      `)
      .eq("empresa_id", empresaId)
      .gte("data_venda", dataInicio)
      .lte("data_venda", dataFim)
      .not("preco_venda", "is", null)
      .order("data_venda", { ascending: false }),
  ]);

  // ── Cálculos ─────────────────────────────────────────────────────────────────

  const totalDespesas = (despesasRaw ?? []).reduce((acc, d) => acc + Number(d.valor), 0);

  const registrosVendidos = (veiculosVendidosRaw ?? []).map((v) => {
    const mans = (v.manutencoes as unknown as ManutencaoRaw[]) ?? [];
    const custoMans = mans
      .filter((m) => m.situacao?.nome_dominio === "Concluída")
      .reduce((acc, m) => acc + Number(m.valor_manutencao), 0);
    const totalInvestido = Number(v.preco_compra) + custoMans;
    const lucro = Number(v.preco_venda) - totalInvestido;
    return {
      id: v.id,
      placa: v.placa,
      marca: (v.marca as unknown as { nome: string } | null)?.nome ?? "",
      modelo: (v.modelo as unknown as { nome: string } | null)?.nome ?? "",
      dataVenda: v.data_venda as string,
      totalInvestido,
      precoVenda: Number(v.preco_venda),
      lucro,
    };
  });

  const receitaBruta = registrosVendidos.reduce((acc, r) => acc + r.precoVenda, 0);
  const cpv = registrosVendidos.reduce((acc, r) => acc + r.totalInvestido, 0);
  const lucroBruto = receitaBruta - cpv;
  const resultadoOperacional = lucroBruto - totalDespesas;

  // Despesas agrupadas por categoria
  const porCategoria: Record<string, number> = {};
  for (const d of (despesasRaw ?? []) as unknown as DespesaComCategoria[]) {
    const nome = d.categoria?.nome ?? "Sem categoria";
    porCategoria[nome] = (porCategoria[nome] ?? 0) + Number(d.valor);
  }
  const categoriasSorted = Object.entries(porCategoria).sort((a, b) => b[1] - a[1]);

  return (
    <>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
          Resultado do Período
        </h1>
        <p className="text-sm text-brand-gray-text mt-1">
          Lucro das vendas vs. despesas operacionais.
        </p>
      </div>

      {/* Filtro de mês: 3 pílulas rápidas + select para meses anteriores */}
      <div className="flex items-center gap-1.5 flex-wrap mb-8">
        {opcoesMes.slice(0, 3).map((op) => (
          <Link
            key={op.value}
            href={`/financeiro?mes=${op.value}`}
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
          basePath="/financeiro"
        />
      </div>

      {/* DRE do Período */}
      {(() => {
        const semDados = registrosVendidos.length === 0 && (despesasRaw ?? []).length === 0;
        const qVendas = registrosVendidos.length;
        const qDespesas = (despesasRaw ?? []).length;

        const linhas: {
          label: string;
          sub: string;
          valor: number;
          prefixo: "(−)" | "=" | null;
          destaque: boolean;
          positivo: boolean | undefined;
        }[] = [
          {
            label: "Receita Bruta",
            sub: qVendas === 0 ? "Nenhuma venda no período" : `${qVendas} veículo${qVendas !== 1 ? "s" : ""} vendido${qVendas !== 1 ? "s" : ""}`,
            valor: receitaBruta,
            prefixo: null,
            destaque: false,
            positivo: undefined,
          },
          {
            label: "Custo do Produto Vendido",
            sub: "Compra + manutenções concluídas",
            valor: cpv,
            prefixo: "(−)",
            destaque: false,
            positivo: undefined,
          },
          {
            label: "Lucro Bruto",
            sub: "Receita Bruta − CPV",
            valor: lucroBruto,
            prefixo: "=",
            destaque: true,
            positivo: semDados ? undefined : lucroBruto >= 0,
          },
          {
            label: "Despesas Operacionais",
            sub: qDespesas === 0 ? "Nenhuma despesa no período" : `${qDespesas} lançamento${qDespesas !== 1 ? "s" : ""}`,
            valor: totalDespesas,
            prefixo: "(−)",
            destaque: false,
            positivo: undefined,
          },
          {
            label: "Resultado Operacional",
            sub: "Lucro Bruto − Despesas",
            valor: resultadoOperacional,
            prefixo: "=",
            destaque: true,
            positivo: semDados ? undefined : resultadoOperacional >= 0,
          },
        ];

        return (
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-brand-gray-mid/20">
              <h2 className="font-display text-sm font-semibold text-brand-black">
                Demonstração do Resultado
              </h2>
            </div>
            <div className="divide-y divide-brand-gray-mid/20">
              {linhas.map((linha) => {
                const valorFmt =
                  linha.prefixo === "(−)"
                    ? `(${formatMoeda(linha.valor)})`
                    : formatMoeda(linha.valor);
                const valorClass =
                  semDados || linha.positivo === undefined
                    ? semDados ? "text-brand-gray-text" : "text-brand-black"
                    : linha.positivo
                    ? "text-status-success-text"
                    : "text-red-600";
                return (
                  <div
                    key={linha.label}
                    className={`flex items-center justify-between px-6 py-3.5${
                      linha.destaque ? " bg-brand-gray-soft/40" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className={`text-sm text-brand-black${linha.destaque ? " font-semibold" : ""}` }>
                        {linha.prefixo && (
                          <span className="mr-2 text-xs font-mono text-brand-gray-text/60">
                            {linha.prefixo}
                          </span>
                        )}
                        {linha.label}
                      </p>
                      <p className="text-xs text-brand-gray-text mt-0.5">{linha.sub}</p>
                    </div>
                    <p className={`shrink-0 ml-4 text-sm font-bold tabular-nums font-mono ${valorClass}`}>
                      {semDados ? "—" : valorFmt}
                    </p>
                  </div>
                );
              })}

              {/* Margem Operacional */}
              {(() => {
                const margem = receitaBruta > 0 ? (resultadoOperacional / receitaBruta) * 100 : null;
                const margemClass = semDados || margem === null
                  ? "text-brand-gray-text"
                  : margem >= 0
                  ? "text-status-success-text"
                  : "text-red-600";
                return (
                  <div className="flex items-center justify-between px-6 py-3.5 border-t-2 border-brand-gray-mid/30 bg-brand-gray-soft/40">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-black">Margem Operacional</p>
                      <p className="text-xs text-brand-gray-text mt-0.5">Resultado Operacional ÷ Receita Bruta</p>
                    </div>
                    <p className={`shrink-0 ml-4 text-sm font-bold tabular-nums font-mono ${margemClass}`}>
                      {semDados || margem === null ? "—" : formatPct(margem)}
                    </p>
                  </div>
                );
              })()}
            </div>
          </section>
        );
      })()}

      {/* Seção: veículos vendidos + despesas por categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Vendas do período */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-gray-mid/20 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-brand-black">
              Vendas do período
            </h2>
            <Link
              href={`/financeiro/lucratividade?mes=${mesSelecionado}`}
              className="inline-flex items-center gap-1 text-xs text-brand-gray-text hover:text-brand-black transition-colors"
            >
              Ver detalhes <IconArrow size={12} />
            </Link>
          </div>

          {registrosVendidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-brand-gray-text">
                Nenhum veículo vendido neste período.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-gray-mid/20">
              {registrosVendidos.map((r) => (
                <Link
                  key={r.id}
                  href={`/veiculos/${r.id}`}
                  className="flex items-center justify-between px-6 py-3.5 gap-4 hover:bg-brand-gray-soft/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-black font-mono group-hover:underline">{r.placa}</p>
                    <p className="text-xs text-brand-gray-text truncate">
                      {r.marca} {r.modelo} · {formatData(r.dataVenda)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-brand-black">
                    {formatMoeda(r.precoVenda)}
                  </p>
                </Link>
              ))}
              <div className="flex items-center justify-between px-6 py-3 bg-brand-gray-soft/40">
                <span className="text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                  Total
                </span>
                <span className="text-sm font-bold tabular-nums text-brand-black">
                  {formatMoeda(receitaBruta)}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Despesas por categoria */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-gray-mid/20 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-brand-black">
              Despesas por categoria
            </h2>
            <Link
              href={`/financeiro/despesas?mes=${mesSelecionado}`}
              className="inline-flex items-center gap-1 text-xs text-brand-gray-text hover:text-brand-black transition-colors"
            >
              Ver despesas <IconArrow size={12} />
            </Link>
          </div>

          {categoriasSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-brand-gray-text">
                Nenhuma despesa registrada neste período.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-gray-mid/20">
              {categoriasSorted.map(([nome, total]) => (
                <div key={nome} className="flex items-center justify-between px-6 py-3.5 gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-brand-black truncate">{nome}</p>
                    {/* Barra de progresso proporcional */}
                    <div className="mt-1.5 h-1 rounded-full bg-brand-gray-soft overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-gray-mid"
                        style={{ width: `${totalDespesas > 0 ? (total / totalDespesas) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-brand-black tabular-nums">
                      {formatMoeda(total)}
                    </p>
                    <p className="text-xs text-brand-gray-text">
                      {formatPct(totalDespesas > 0 ? (total / totalDespesas) * 100 : 0)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 py-3 bg-brand-gray-soft/40">
                <span className="text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                  Total
                </span>
                <span className="text-sm font-bold tabular-nums text-brand-black">
                  {formatMoeda(totalDespesas)}
                </span>
              </div>
            </div>
          )}
        </section>

      </div>
    </>
  );
}
