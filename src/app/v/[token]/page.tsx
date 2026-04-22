import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

function IconWhatsApp({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
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

function getWhatsAppLink(telefone: string, mensagem: string): string {
  const numero = telefone.replace(/\D/g, "");
  const numeroCompleto = numero.startsWith("55") ? numero : `55${numero}`;
  return `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(mensagem)}`;
}

// ─── Tipos locais ────────────────────────────────────────────────────────────

type VeiculoPublico = {
  placa: string;
  cor_veiculo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  preco_venda: number | null;
  preco_venda_sugerido: number | null;
  vidro_eletrico: boolean;
  trava_eletrica: boolean;
  quantidade_portas: number;
  laudo_aprovado: boolean;
  descricao: string | null;
  situacao_veiculo_id: string;
  combustivel_veiculo_id: string;
  cambio_veiculo_id: string;
  direcao_veiculo_id: string;
  marca_nome: string;
  modelo_nome: string;
};

type EmpresaPublica = {
  nome_fantasia_empresa: string | null;
  nome_legal_empresa: string;
  telefone_principal: string | null;
  email_empresa: string | null;
} | null;

type ArquivoPublico = {
  id: string;
  url_arquivo: string;
  arquivo_principal: boolean;
  ordem_exibicao: number;
  tipo_nome: string;
};

type ResultadoPublico = {
  qr_id: string;
  total_visualizacoes: number;
  veiculo: VeiculoPublico;
  empresa: EmpresaPublica;
  dominios: Dominio[];
  arquivos: ArquivoPublico[];
};

// ─── Página pública ───────────────────────────────────────────────────────────

type Props = { params: Promise<{ token: string }> };

export default async function VeiculoPublicoPage({ params }: Props) {
  const { token } = await params;

  // Usa anon client + função SECURITY DEFINER (sql/08_funcao_veiculo_publico.sql).
  // A função valida o token, incrementa o contador atomicamente e retorna apenas
  // os campos públicos do veículo — sem necessidade de service role key.
  const supabase = await createClient();
  const { data: resultado } = await supabase
    .schema("dealership")
    .rpc("buscar_veiculo_publico", { p_token: token });

  if (!resultado) notFound();

  const {
    veiculo,
    empresa,
    dominios: dominiosRaw,
    arquivos: arquivosRaw,
  } = resultado as ResultadoPublico;

  // ─── Resolução de dados ───────────────────────────────────────────────────

  const dominiosList: Dominio[] = dominiosRaw ?? [];

  const situacao = getDominio(dominiosList, veiculo.situacao_veiculo_id);
  const combustivel = getDominio(dominiosList, veiculo.combustivel_veiculo_id);
  const cambio = getDominio(dominiosList, veiculo.cambio_veiculo_id);
  const direcao = getDominio(dominiosList, veiculo.direcao_veiculo_id);

  const marca = veiculo.marca_nome ?? "";
  const modelo = veiculo.modelo_nome ?? "";

  const nomeDealership =
    empresa?.nome_fantasia_empresa ?? empresa?.nome_legal_empresa ?? "";

  const fotos = (arquivosRaw ?? []).filter(
    (a) => a.tipo_nome?.toLowerCase() === "foto"
  );

  const fotoPrincipal = fotos.find((f) => f.arquivo_principal) ?? fotos[0];

  const mensagemWhatsApp = `Olá! Vi o anúncio do ${marca} ${modelo} (Placa: ${veiculo.placa}) e gostaria de mais informações.`;
  const temContato = !!(empresa?.telefone_principal || empresa?.email_empresa);

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
          {empresa?.telefone_principal ? (
            <a
              href={getWhatsAppLink(empresa.telefone_principal, mensagemWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-white rounded-full bg-[#25D366] px-3 py-1.5 hover:bg-[#22c05e] transition-colors"
            >
              <IconWhatsApp size={13} />
              WhatsApp
            </a>
          ) : empresa?.email_empresa ? (
            <a
              href={`mailto:${empresa.email_empresa}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-brand-black rounded-full border border-brand-gray-mid px-3 py-1.5 hover:bg-brand-gray-soft transition-colors"
            >
              <IconMail size={13} />
              E-mail
            </a>
          ) : null}
        </div>
      </header>

      <main className={`max-w-2xl mx-auto px-4 py-6 space-y-5${temContato ? " pb-28" : ""}`}>
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

          {veiculo.preco_venda_sugerido != null && (
            <div className="mt-5 pt-5 border-t border-brand-gray-mid/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-1">
                Preço
              </p>
              <p className="text-3xl font-bold text-brand-black">
                {formatPreco(Number(veiculo.preco_venda_sugerido))}
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
        {temContato && (
          <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
            <h2 className="font-display text-base font-bold text-brand-black mb-4">
              Entre em contato
            </h2>
            <div className="flex flex-col gap-3">
              {empresa?.telefone_principal && (
                <a
                  href={getWhatsAppLink(empresa.telefone_principal, mensagemWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold px-5 py-3 hover:bg-[#22c05e] active:scale-[.98] transition-all"
                >
                  <IconWhatsApp size={18} />
                  Conversar no WhatsApp
                </a>
              )}
              {empresa?.email_empresa && (
                <a
                  href={`mailto:${empresa.email_empresa}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-3 hover:bg-brand-gray-soft active:scale-[.98] transition-all"
                >
                  <IconMail size={16} />
                  Enviar e-mail
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Barra CTA fixa — mobile */}
      {temContato && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-brand-gray-mid/40 px-4 pt-3 pb-7">
          <div className="max-w-2xl mx-auto flex gap-3">
            {empresa?.telefone_principal && (
              <a
                href={getWhatsAppLink(empresa.telefone_principal, mensagemWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white text-sm font-semibold py-3.5 hover:bg-[#22c05e] active:scale-[.98] transition-all"
              >
                <IconWhatsApp size={18} />
                WhatsApp
              </a>
            )}
            {empresa?.email_empresa && (
              <a
                href={`mailto:${empresa.email_empresa}`}
                className={
                  empresa?.telefone_principal
                    ? "flex-shrink-0 flex items-center justify-center rounded-full border border-brand-gray-mid text-brand-black w-12 h-12 hover:bg-brand-gray-soft active:scale-[.98] transition-all"
                    : "flex-1 flex items-center justify-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium py-3.5 hover:bg-brand-gray-soft active:scale-[.98] transition-all"
                }
              >
                <IconMail size={18} />
                {!empresa?.telefone_principal && <span className="ml-1">E-mail</span>}
              </a>
            )}
          </div>
        </div>
      )}

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
