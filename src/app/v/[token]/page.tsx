import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconCheck({ size = 18 }: { size?: number }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconPhone({ size = 16 }: { size?: number }) {
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
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail({ size = 16 }: { size?: number }) {
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
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatQuilometragem(km: number): string {
  return km.toLocaleString("pt-BR") + " km";
}

type Dominio = { id: string; nome_dominio: string };

function getDominio(dominios: Dominio[], id: string): string {
  return dominios.find((d) => d.id === id)?.nome_dominio ?? "—";
}

// ─── Página pública ───────────────────────────────────────────────────────────

type Props = { params: Promise<{ token: string }> };

export default async function VeiculoPublicoPage({ params }: Props) {
  const { token } = await params;
  const admin = createAdminClient();

  // 1. Resolve o QR Code pelo token
  const { data: qrCode } = await admin
    .schema("dealership")
    .from("veiculo_qr_code")
    .select("id, veiculo_id, total_visualizacoes")
    .eq("token_publica", token)
    .single();

  if (!qrCode) notFound();

  // 2. Busca dados do veículo, domínios e fotos em paralelo
  const [{ data: veiculo }, { data: dominios }, { data: arquivos }] =
    await Promise.all([
      admin
        .schema("dealership")
        .from("veiculo")
        .select(
          `placa, cor_veiculo, ano_fabricacao, ano_modelo, quilometragem,
           preco_venda, vidro_eletrico, trava_eletrica, quantidade_portas,
           laudo_aprovado, descricao,
           situacao_veiculo_id, combustivel_veiculo_id,
           cambio_veiculo_id, direcao_veiculo_id,
           marca:veiculo_marca!marca_veiculo_id(nome),
           modelo:veiculo_modelo!modelo_veiculo_id(nome),
           empresa:empresa!empresa_id(
             nome_fantasia_empresa, nome_legal_empresa,
             telefone_principal, email_empresa
           )`
        )
        .eq("id", qrCode.veiculo_id)
        .single(),

      admin
        .schema("dealership")
        .from("dominio")
        .select("id, nome_dominio")
        .in("grupo_dominio", ["combustivel", "cambio", "tipo_direcao", "situacao_veiculo"]),

      admin
        .schema("dealership")
        .from("veiculo_arquivo")
        .select(
          "id, url_arquivo, arquivo_principal, ordem_exibicao, tipo:dominio!tipo_arquivo_id(nome_dominio)"
        )
        .eq("veiculo_id", qrCode.veiculo_id)
        .order("arquivo_principal", { ascending: false })
        .order("ordem_exibicao", { ascending: true }),
    ]);

  if (!veiculo) notFound();

  // 3. Incrementa contador de visualizações — atômico via RPC (fire-and-forget)
  admin
    .schema("dealership")
    .rpc("incrementar_visualizacao", { p_qr_id: qrCode.id })
    .then(() => {});

  // ─── Resolução de dados ───────────────────────────────────────────────────

  const dominiosList: Dominio[] = dominios ?? [];

  const situacao = getDominio(dominiosList, veiculo.situacao_veiculo_id);
  const combustivel = getDominio(dominiosList, veiculo.combustivel_veiculo_id);
  const cambio = getDominio(dominiosList, veiculo.cambio_veiculo_id);
  const direcao = getDominio(dominiosList, veiculo.direcao_veiculo_id);

  const marca =
    (veiculo.marca as unknown as { nome: string } | null)?.nome ?? "";
  const modelo =
    (veiculo.modelo as unknown as { nome: string } | null)?.nome ?? "";

  const empresa = veiculo.empresa as unknown as {
    nome_fantasia_empresa: string | null;
    nome_legal_empresa: string;
    telefone_principal: string | null;
    email_empresa: string | null;
  } | null;

  const nomeDealership =
    empresa?.nome_fantasia_empresa ?? empresa?.nome_legal_empresa ?? "";

  const fotos = (arquivos ?? []).filter(
    (a) =>
      (a.tipo as unknown as { nome_dominio: string } | null)?.nome_dominio?.toLowerCase() ===
      "foto"
  );

  const fotoPrincipal = fotos.find((f) => f.arquivo_principal) ?? fotos[0];

  // Badge de situação
  const lower = situacao.toLowerCase();
  let badgeCls =
    "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40";
  if (lower.includes("disponív") || lower === "disponivel") {
    badgeCls = "bg-status-success-bg text-status-success-text border-status-success-border";
  } else if (
    lower.includes("negociaç") ||
    lower.includes("negociacao") ||
    lower.includes("reservado")
  ) {
    badgeCls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
  } else if (lower.includes("vendido")) {
    badgeCls = "bg-red-50 text-red-600 border-red-200";
  }

  const specs: [string, string][] = [
    ["Cor", veiculo.cor_veiculo],
    ["Quilometragem", formatQuilometragem(veiculo.quilometragem)],
    ["Combustível", combustivel],
    ["Câmbio", cambio],
    ["Direção", direcao],
    ["Portas", String(veiculo.quantidade_portas)],
    ["Vidro elétrico", veiculo.vidro_eletrico ? "Sim" : "Não"],
    ["Trava elétrica", veiculo.trava_eletrica ? "Sim" : "Não"],
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brand-gray-soft">
      {/* Cabeçalho */}
      <header className="bg-white border-b border-brand-gray-mid/40 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <p className="font-display text-sm font-bold text-brand-black truncate">
            {nomeDealership}
          </p>
          {empresa?.telefone_principal && (
            <a
              href={`tel:${empresa.telefone_principal.replace(/\D/g, "")}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-brand-black rounded-full border border-brand-gray-mid px-3 py-1.5 hover:bg-brand-gray-soft transition-colors"
            >
              <IconPhone size={13} />
              Ligar
            </a>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Foto principal */}
        {fotoPrincipal && (
          <div className="overflow-hidden rounded-2xl border border-brand-gray-mid/30 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fotoPrincipal.url_arquivo}
              alt={`${marca} ${modelo}`}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Identificação + preço */}
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-black leading-tight">
                {marca} {modelo}
              </h1>
              <p className="text-sm text-brand-gray-text mt-1">
                {veiculo.ano_fabricacao}/{veiculo.ano_modelo} · Placa{" "}
                <span className="font-medium text-brand-black">
                  {veiculo.placa}
                </span>
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${badgeCls}`}
            >
              {situacao}
            </span>
          </div>

          {veiculo.preco_venda != null && (
            <div className="mt-5 pt-5 border-t border-brand-gray-mid/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-1">
                Preço
              </p>
              <p className="text-3xl font-bold text-brand-black">
                {formatPreco(Number(veiculo.preco_venda))}
              </p>
            </div>
          )}
        </div>

        {/* Laudo aprovado */}
        {veiculo.laudo_aprovado && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-green-600 flex-shrink-0">
              <IconCheck size={18} />
            </span>
            <p className="text-sm font-medium text-green-700">
              Laudo de vistoria aprovado
            </p>
          </div>
        )}

        {/* Especificações */}
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
          <h2 className="font-display text-base font-bold text-brand-black mb-5">
            Especificações
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
                  {label}
                </dt>
                <dd className="text-sm font-medium text-brand-black mt-0.5">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Descrição / Observações */}
        {veiculo.descricao && (
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
            <h2 className="font-display text-base font-bold text-brand-black mb-3">
              Observações
            </h2>
            <p className="text-sm text-brand-gray-text leading-relaxed whitespace-pre-line">
              {veiculo.descricao}
            </p>
          </div>
        )}

        {/* Galeria de fotos (quando há mais de uma) */}
        {fotos.length > 1 && (
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
            <h2 className="font-display text-base font-bold text-brand-black mb-4">
              Fotos ({fotos.length})
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {fotos.map((foto, index) => (
                <div
                  key={foto.id}
                  className="overflow-hidden rounded-xl aspect-video bg-brand-gray-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url_arquivo}
                    alt={`${marca} ${modelo} — foto ${index + 1} de ${fotos.length}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contato */}
        {(empresa?.telefone_principal || empresa?.email_empresa) && (
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
            <h2 className="font-display text-base font-bold text-brand-black mb-4">
              Entre em contato
            </h2>
            <div className="space-y-3">
              {empresa.telefone_principal && (
                <a
                  href={`tel:${empresa.telefone_principal.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 text-sm font-medium text-brand-black hover:text-brand-gray-text transition-colors"
                >
                  <IconPhone />
                  {empresa.telefone_principal}
                </a>
              )}
              {empresa.email_empresa && (
                <a
                  href={`mailto:${empresa.email_empresa}`}
                  className="flex items-center gap-3 text-sm font-medium text-brand-black hover:text-brand-gray-text transition-colors"
                >
                  <IconMail />
                  {empresa.email_empresa}
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="text-center py-10 text-xs text-brand-gray-text/50">
        Powered by{" "}
        <span className="font-semibold text-brand-gray-text/70">
          Uyemura Tech
        </span>
      </footer>
    </div>
  );
}
