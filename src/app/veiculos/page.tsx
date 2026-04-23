import Link from "next/link";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { gerarQrCode } from "./actions";
import { VeiculoLinhaAcoes } from "./_components/veiculo-linha-acoes";

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconCar({ size = 20 }: { size?: number }) {
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
      aria-hidden="true"
    >
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <rect x="5" y="15" width="14" height="4" rx="1" />
      <path d="M5 7l1.5-4h11L19 7" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  );
}


// ─── Badge de situação ────────────────────────────────────────────────────────

function BadgeSituacao({ situacao }: { situacao: string }) {
  const lower = situacao.toLowerCase();

  let cls = "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40";
  if (lower.includes("disponível") || lower === "disponivel") {
    cls = "bg-status-success-bg text-status-success-text border-status-success-border";
  } else if (lower.includes("negociação") || lower.includes("negociacao") || lower.includes("reservado")) {
    cls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cls}`}
    >
      {situacao}
    </span>
  );
}

function BadgeGarantia({ dataFim }: { dataFim: string | null }) {
  if (!dataFim) return null;
  const [ano, mes, dia] = dataFim.split("-").map(Number);
  const fim = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dias = Math.round((fim.getTime() - hoje.getTime()) / 86_400_000);

  let cls: string;
  let texto: string;
  if (dias < 0) {
    cls = "bg-red-50 text-red-700 border-red-200";
    const abs = Math.abs(dias);
    texto = abs === 1 ? "Expirada há 1 dia" : `Expirada há ${abs} dias`;
  } else if (dias === 0) {
    cls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
    texto = "Expira hoje";
  } else if (dias <= 30) {
    cls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
    texto = dias === 1 ? "Expira em 1 dia" : `Expira em ${dias} dias`;
  } else {
    cls = "bg-status-success-bg text-status-success-text border-status-success-border";
    texto = `Garantia: ${dias} dias`;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${cls}`}
    >
      {texto}
    </span>
  );
}

// ─── Tipos locais ────────────────────────────────────────────────────────────────

type VeiculoRow = {
  id: string;
  placa: string;
  cor_veiculo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  preco_venda: number | null;
  criado_em: string;
  atualizado_em: string;
  data_compra: string;
  data_fim_garantia: string | null;
  marca: { nome_dominio: string } | null;
  modelo: { nome_dominio: string } | null;
  situacao: { nome_dominio: string } | null;
  veiculo_qr_code: { url_publica: string; token_publica: string; total_visualizacoes: number }[] | null;
};

// ─── Página ───────────────────────────────────────────────────────────────────────

export default async function VeiculosPage() {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { data: veiculosRaw } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select(
      `id, placa, cor_veiculo, ano_fabricacao, ano_modelo, quilometragem, preco_venda,
       criado_em, atualizado_em, data_compra, data_fim_garantia,
       marca:veiculo_marca!marca_veiculo_id(nome_dominio:nome),
       modelo:veiculo_modelo!modelo_veiculo_id(nome_dominio:nome),
       situacao:dominio!situacao_veiculo_id(nome_dominio),
       veiculo_qr_code(url_publica, token_publica, total_visualizacoes)`
    )
    .eq("empresa_id", usuarioAtual.empresa_id)
    .order("atualizado_em", { ascending: false })
    .limit(200);

  const veiculos = veiculosRaw as unknown as VeiculoRow[] | null;

  const total = veiculos?.length ?? 0;

  return (
    <>
      {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Veículos
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            {total === 0
              ? "Nenhum veículo cadastrado."
              : `${total} veículo${total !== 1 ? "s" : ""} cadastrado${total !== 1 ? "s" : ""}.`}
          </p>
        </div>
        <Link
          href="/veiculos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors self-start sm:self-auto"
        >
          <IconPlus size={16} />
          Novo Veículo
        </Link>
      </div>

      {/* ── Lista vazia ───────────────────────────────────────────────────── */}
      {total === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconCar size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhum veículo cadastrado
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            Cadastre o primeiro veículo da empresa para começar.
          </p>
          <Link
            href="/veiculos/novo"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            <IconPlus size={16} />
            Novo Veículo
          </Link>
        </section>
      )}

      {/* ── Tabela de veículos ────────────────────────────────────────────── */}
      {total > 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
          {/* Header da tabela — visível apenas em desktop */}
          <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_168px_120px_188px] gap-4 px-6 py-3 border-b border-brand-gray-mid/20 bg-brand-gray-soft/50">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Placa / Veículo
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Marca / Modelo
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Ano · Km
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text whitespace-nowrap">
              Atualizado em
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Situação
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Ações
            </span>
          </div>

          <ul role="list" className="divide-y divide-brand-gray-mid/20">
            {veiculos?.map((v) => {
              const marca = v.marca?.nome_dominio ?? "—";
              const modelo = v.modelo?.nome_dominio ?? "—";
              const situacao = v.situacao?.nome_dominio ?? "—";
              const qrExistente = Array.isArray(v.veiculo_qr_code) ? (v.veiculo_qr_code[0] ?? null) : null;

              const kmFormatado = new Intl.NumberFormat("pt-BR").format(
                v.quilometragem
              );
              const precoFormatado = v.preco_venda
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(v.preco_venda)
                : null;

              const gerarQrCodeAction = gerarQrCode.bind(null, v.id);

              return (
                <li key={v.id} className="group relative hover:bg-brand-gray-soft/50 transition-colors">
                  {/* Overlay invisível — torna a linha inteira clicável */}
                  <Link
                    href={`/veiculos/${v.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`Editar veículo ${v.placa}`}
                  />

                  {/* Desktop: mesma grade de 6 colunas do cabeçalho */}
                  <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_168px_120px_188px] gap-4 items-center px-6 py-4">
                    {/* Placa */}
                    <div className="relative z-10 flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-brand-black font-mono tracking-widest">
                        {v.placa}
                      </span>
                      <span className="text-xs text-brand-gray-text">
                        {v.cor_veiculo}
                      </span>
                    </div>

                    {/* Marca / Modelo */}
                    <div className="relative z-10 flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-brand-black">
                        {marca}
                      </span>
                      <span className="text-xs text-brand-gray-text">
                        {modelo}
                      </span>
                    </div>

                    {/* Ano · Km */}
                    <div className="relative z-10 flex flex-col gap-0.5">
                      <span className="text-sm text-brand-black">
                        {v.ano_fabricacao}/{v.ano_modelo}
                      </span>
                      <span className="text-xs text-brand-gray-text">
                        {kmFormatado} km
                      </span>
                    </div>

                    {/* Atualizado em */}
                    <div className="relative z-10">
                      <span className="text-xs tabular-nums text-brand-gray-text">
                        {new Date(v.atualizado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    {/* Situação */}
                    <div className="relative z-10 flex flex-col gap-1.5">
                      <BadgeSituacao situacao={situacao} />
                      {situacao.toLowerCase() === "vendido" && (
                        <BadgeGarantia dataFim={v.data_fim_garantia} />
                      )}
                    </div>

                    {/* Ações */}
                    <div className="relative z-10 flex items-center w-[188px]">
                      <VeiculoLinhaAcoes
                        veiculoId={v.id}
                        placa={v.placa}
                        qrCodeInicial={qrExistente}
                        gerarQrCodeAction={gerarQrCodeAction}
                      />
                    </div>
                  </div>

                  {/* Mobile: layout empilhado */}
                  <div className="flex md:hidden flex-col px-6 py-4 gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-brand-black font-mono tracking-widest">
                          {v.placa}
                        </span>
                        <span className="text-xs text-brand-gray-text">
                          {v.cor_veiculo}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <BadgeSituacao situacao={situacao} />
                        {situacao.toLowerCase() === "vendido" && (
                          <BadgeGarantia dataFim={v.data_fim_garantia} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-brand-black">
                          {marca} {modelo}
                        </span>
                        <span className="text-xs text-brand-gray-text">
                          {v.ano_fabricacao}/{v.ano_modelo} · {kmFormatado} km
                        </span>
                        <span className="text-xs text-brand-gray-text">
                          Atualizado em {new Date(v.atualizado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        {precoFormatado && (
                          <span className="text-xs font-medium text-brand-black">
                            {precoFormatado}
                          </span>
                        )}
                      </div>
                      <div className="relative z-10 flex-shrink-0">
                        <VeiculoLinhaAcoes
                          veiculoId={v.id}
                          placa={v.placa}
                          qrCodeInicial={qrExistente}
                          gerarQrCodeAction={gerarQrCodeAction}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
