import Link from "next/link";
import { redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
import { formatData } from "@/lib/utils/formatters";
import { SeletorMes } from "./_components/seletor-mes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPct(valor: number): string {
  return (
    valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
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

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconTrending({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = { searchParams: Promise<{ mes?: string }> };

export default async function LucratividadePage({ searchParams }: Props) {
  const { mes } = await searchParams;
  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  if (papel === PAPEIS.USUARIO) redirect("/dashboard");

  const empresaId = usuarioAtual.empresa_id;

  const opcoesMes = gerarOpcoesMes();
  const mesSelecionado =
    mes && /^\d{4}-\d{2}$/.test(mes) ? mes : opcoesMes[0].value;
  const [anoStr, mesStr] = mesSelecionado.split("-");
  const dataInicio = `${mesSelecionado}-01`;
  const ultimoDia = new Date(Number(anoStr), Number(mesStr), 0).getDate();
  const dataFim = `${mesSelecionado}-${String(ultimoDia).padStart(2, "0")}`;

  // ── Query ─────────────────────────────────────────────────────────────────

  const { data: veiculosRaw } = await supabase
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
    .order("data_venda", { ascending: false });

  // ── Processamento ─────────────────────────────────────────────────────────

  const registros = (veiculosRaw ?? []).map((v) => {
    const mans = (v.manutencoes as ManutencaoRaw[]) ?? [];
    const custoMans = mans
      .filter((m) => m.situacao?.nome_dominio === "Concluída")
      .reduce((acc, m) => acc + Number(m.valor_manutencao), 0);
    const totalInvestido = Number(v.preco_compra) + custoMans;
    const precoVenda = Number(v.preco_venda);
    const lucro = precoVenda - totalInvestido;
    const margem = totalInvestido > 0 ? (lucro / totalInvestido) * 100 : 0;
    return {
      id: v.id,
      placa: v.placa as string,
      marca: (v.marca as { nome: string } | null)?.nome ?? "",
      modelo: (v.modelo as { nome: string } | null)?.nome ?? "",
      dataVenda: v.data_venda as string,
      precoCompra: Number(v.preco_compra),
      custoMans,
      totalInvestido,
      precoVenda,
      lucro,
      margem,
    };
  });

  // Totais
  const totalPrecoCompra   = registros.reduce((a, r) => a + r.precoCompra, 0);
  const totalCustoMans     = registros.reduce((a, r) => a + r.custoMans, 0);
  const totalInvestido     = registros.reduce((a, r) => a + r.totalInvestido, 0);
  const totalPrecoVenda    = registros.reduce((a, r) => a + r.precoVenda, 0);
  const totalLucro         = registros.reduce((a, r) => a + r.lucro, 0);
  const margemMedia        = totalInvestido > 0 ? (totalLucro / totalInvestido) * 100 : 0;

  return (
    <>
      {/* Breadcrumb */}
      <Link
        href={`/financeiro?mes=${mesSelecionado}`}
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Resultado do Período
      </Link>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Lucratividade
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            Veículos vendidos com cálculo de lucro por venda.
          </p>
        </div>
      </div>

      {/* Filtro de mês: 3 pílulas rápidas + select para meses anteriores */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {opcoesMes.slice(0, 3).map((op) => (
          <Link
            key={op.value}
            href={`/financeiro/lucratividade?mes=${op.value}`}
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
          basePath="/financeiro/lucratividade"
        />
      </div>

      {/* Estado vazio */}
      {registros.length === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconTrending size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhuma venda neste período
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs">
            Os dados de lucratividade aparecem aqui quando veículos são
            marcados como vendidos com data de venda no período selecionado.
          </p>
        </section>
      )}

      {/* Tabela */}
      {registros.length > 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray-mid/20">
                  {[
                    { label: "Veículo",        align: "left"  },
                    { label: "Data Venda",      align: "left"  },
                    { label: "Custo Compra",    align: "right" },
                    { label: "Manutenções",     align: "right" },
                    { label: "Total Investido", align: "right" },
                    { label: "Vendido por",     align: "right" },
                    { label: "Lucro",           align: "right" },
                    { label: "Margem",          align: "right" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`px-5 py-3 text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap ${
                        col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-mid/20">
                {registros.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-gray-soft/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/veiculos/${r.id}`}
                        className="group"
                      >
                        <p className="font-mono font-semibold text-brand-black group-hover:underline">
                          {r.placa}
                        </p>
                        <p className="text-xs text-brand-gray-text">
                          {r.marca} {r.modelo}
                        </p>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-brand-gray-text whitespace-nowrap">
                      {formatData(r.dataVenda)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-brand-black whitespace-nowrap">
                      {formatMoeda(r.precoCompra)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-brand-black whitespace-nowrap">
                      {r.custoMans > 0 ? formatMoeda(r.custoMans) : <span className="text-brand-gray-text">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-medium text-brand-black whitespace-nowrap">
                      {formatMoeda(r.totalInvestido)}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums text-brand-black whitespace-nowrap">
                      {formatMoeda(r.precoVenda)}
                    </td>
                    <td className={`px-5 py-3.5 text-right tabular-nums font-bold whitespace-nowrap ${
                      r.lucro >= 0 ? "text-status-success-text" : "text-red-600"
                    }`}>
                      {r.lucro >= 0 ? "+" : ""}{formatMoeda(r.lucro)}
                    </td>
                    <td className={`px-5 py-3.5 text-right tabular-nums whitespace-nowrap ${
                      r.margem >= 0 ? "text-status-success-text" : "text-red-600"
                    }`}>
                      {formatPct(r.margem)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-brand-gray-mid/30 bg-brand-gray-soft/40">
                  <td className="px-5 py-3 text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                    {registros.length} venda{registros.length !== 1 ? "s" : ""}
                  </td>
                  <td />
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-brand-black whitespace-nowrap">
                    {formatMoeda(totalPrecoCompra)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-brand-black whitespace-nowrap">
                    {formatMoeda(totalCustoMans)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-brand-black whitespace-nowrap">
                    {formatMoeda(totalInvestido)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-brand-black whitespace-nowrap">
                    {formatMoeda(totalPrecoVenda)}
                  </td>
                  <td className={`px-5 py-3 text-right tabular-nums font-bold whitespace-nowrap ${
                    totalLucro >= 0 ? "text-status-success-text" : "text-red-600"
                  }`}>
                    {totalLucro >= 0 ? "+" : ""}{formatMoeda(totalLucro)}
                  </td>
                  <td className={`px-5 py-3 text-right tabular-nums font-semibold whitespace-nowrap ${
                    margemMedia >= 0 ? "text-status-success-text" : "text-red-600"
                  }`}>
                    {formatPct(margemMedia)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="sm:hidden divide-y divide-brand-gray-mid/20">
            {registros.map((r) => (
              <div key={r.id} className="px-5 py-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/veiculos/${r.id}`} className="group min-w-0">
                    <p className="font-mono font-semibold text-brand-black group-hover:underline">
                      {r.placa}
                    </p>
                    <p className="text-xs text-brand-gray-text truncate">
                      {r.marca} {r.modelo} · {formatData(r.dataVenda)}
                    </p>
                  </Link>
                  <div className="text-right shrink-0">
                    <p className={`text-base font-bold tabular-nums ${
                      r.lucro >= 0 ? "text-status-success-text" : "text-red-600"
                    }`}>
                      {r.lucro >= 0 ? "+" : ""}{formatMoeda(r.lucro)}
                    </p>
                    <p className={`text-xs tabular-nums ${
                      r.margem >= 0 ? "text-status-success-text" : "text-red-600"
                    }`}>
                      {formatPct(r.margem)} margem
                    </p>
                  </div>
                </div>

                {/* Linha de detalhes financeiros */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Compra",     value: formatMoeda(r.precoCompra)   },
                    { label: "Manutenções", value: r.custoMans > 0 ? formatMoeda(r.custoMans) : "—" },
                    { label: "Vendido",    value: formatMoeda(r.precoVenda)    },
                  ].map((item) => (
                    <div key={item.label} className="bg-brand-gray-soft rounded-xl px-2 py-2">
                      <p className="text-xs text-brand-gray-text">{item.label}</p>
                      <p className="text-xs font-medium text-brand-black tabular-nums mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Totais mobile */}
            <div className="px-5 py-3 bg-brand-gray-soft/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-gray-text uppercase tracking-wide">
                {registros.length} venda{registros.length !== 1 ? "s" : ""}
              </span>
              <div className="text-right">
                <p className={`text-sm font-bold tabular-nums ${
                  totalLucro >= 0 ? "text-status-success-text" : "text-red-600"
                }`}>
                  {totalLucro >= 0 ? "+" : ""}{formatMoeda(totalLucro)}
                </p>
                <p className="text-xs text-brand-gray-text">{formatPct(margemMedia)} média</p>
              </div>
            </div>
          </div>

        </section>
      )}
    </>
  );
}
