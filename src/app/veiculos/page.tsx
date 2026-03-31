import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function VeiculosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  const { data: veiculos } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select(
      `id, placa, cor_veiculo, ano_fabricacao, ano_modelo, quilometragem, preco_venda,
       criado_em,
       marca:dominio!marca_veiculo_id(nome_dominio),
       modelo:dominio!modelo_veiculo_id(nome_dominio),
       situacao:dominio!situacao_veiculo_id(nome_dominio),
       qr_code(url_publica, token_publica, total_visualizacoes)`
    )
    .eq("empresa_id", usuario.empresa_id)
    .order("criado_em", { ascending: false });

  const total = veiculos?.length ?? 0;

  return (
    <div className="w-full">
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
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-gray-soft flex items-center justify-center text-brand-gray-text">
            <IconCar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand-black">
              Nenhum veículo cadastrado ainda
            </p>
            <p className="text-sm text-brand-gray-text mt-1">
              Clique em &quot;Novo Veículo&quot; para começar.
            </p>
          </div>
          <Link
            href="/veiculos/novo"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors mt-2"
          >
            <IconPlus size={16} />
            Novo Veículo
          </Link>
        </div>
      )}

      {/* ── Tabela de veículos ────────────────────────────────────────────── */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
          {/* Header da tabela — visível apenas em desktop */}
          <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_1fr_188px] gap-4 px-6 py-3 border-b border-brand-gray-mid/20 bg-brand-gray-soft/50">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Placa / Veículo
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Marca / Modelo
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
              Ano · Km
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
              const marca = (
                v.marca as unknown as { nome_dominio: string } | null
              )?.nome_dominio ?? "—";
              const modelo = (
                v.modelo as unknown as { nome_dominio: string } | null
              )?.nome_dominio ?? "—";
              const situacao = (
                v.situacao as unknown as { nome_dominio: string } | null
              )?.nome_dominio ?? "—";
              const qrExistente = (
                v.qr_code as unknown as {
                  url_publica: string;
                  token_publica: string;
                  total_visualizacoes: number;
                } | null
              ) ?? null;

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

                  {/* Desktop: mesma grade de 5 colunas do cabeçalho */}
                  <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_1fr_188px] gap-4 items-center px-6 py-4">
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

                    {/* Situação */}
                    <div className="relative z-10">
                      <BadgeSituacao situacao={situacao} />
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
                      <BadgeSituacao situacao={situacao} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-brand-black">
                          {marca} {modelo}
                        </span>
                        <span className="text-xs text-brand-gray-text">
                          {v.ano_fabricacao}/{v.ano_modelo} · {kmFormatado} km
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
        </div>
      )}
    </div>
  );
}
