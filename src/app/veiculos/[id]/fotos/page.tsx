import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { VeiculoArquivos } from "../../_components/veiculo-arquivos";
import type { ArquivoVeiculo } from "../../_components/veiculo-arquivos";
import {
  uploadArquivoVeiculo,
  excluirArquivoVeiculo,
  definirFotoPrincipal,
} from "../../actions";

// ─── Ícones ──────────────────────────────────────────────────────────────────

function IconCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();
  const { data } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select("placa")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();
  return {
    title: data?.placa
      ? `Fotos — ${data.placa} — Uyemura Tech`
      : "Fotos do Veículo — Uyemura Tech",
  };
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default async function FotosVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const [{ data: veiculo }, { data: arquivosData }] = await Promise.all([
    supabase
      .schema("dealership")
      .from("veiculo")
      .select("placa")
      .eq("id", id)
      .eq("empresa_id", usuarioAtual.empresa_id)
      .single(),
    supabase
      .schema("dealership")
      .from("veiculo_arquivo")
      .select(
        "id, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo, tipo_arquivo:dominio!tipo_arquivo_id(nome_dominio)"
      )
      .eq("veiculo_id", id)
      .eq("empresa_id", usuarioAtual.empresa_id)
      .order("ordem_exibicao", { ascending: true }),
  ]);

  if (!veiculo) notFound();

  type ArquivoRaw = {
    id: string;
    url_arquivo: string;
    arquivo_principal: boolean;
    ordem_exibicao: number;
    tamanho_arquivo: number;
    tipo_arquivo: { nome_dominio: string } | null;
  };

  const todosArquivos = (arquivosData ?? []) as unknown as ArquivoRaw[];

  const fotos: ArquivoVeiculo[] = todosArquivos
    .filter((a) => a.tipo_arquivo?.nome_dominio?.toLowerCase() === "foto")
    .map(({ id: aid, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo }) => ({
      id: aid, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo,
    }));

  const laudoRaw =
    todosArquivos.find((a) => a.tipo_arquivo?.nome_dominio?.toLowerCase() === "laudo") ?? null;
  const laudo: ArquivoVeiculo | null = laudoRaw
    ? {
        id: laudoRaw.id,
        url_arquivo: laudoRaw.url_arquivo,
        arquivo_principal: laudoRaw.arquivo_principal,
        ordem_exibicao: laudoRaw.ordem_exibicao,
        tamanho_arquivo: laudoRaw.tamanho_arquivo,
      }
    : null;

  const placaFormatada =
    veiculo.placa.length > 3
      ? `${veiculo.placa.slice(0, 3)}-${veiculo.placa.slice(3)}`
      : veiculo.placa;

  const uploadFotoAction = uploadArquivoVeiculo.bind(null, id, "foto");
  const uploadLaudoAction = uploadArquivoVeiculo.bind(null, id, "laudo");
  const excluirArquivoAction = excluirArquivoVeiculo.bind(null, id);
  const principalAction = definirFotoPrincipal.bind(null, id);

  return (
    <div className="w-full max-w-5xl pb-8">
      {/* ── Indicador de etapas ─────────────────────────────────────────── */}
      <nav aria-label="Etapas do cadastro" className="flex items-center gap-2 mb-8">
        <span className="inline-flex items-center gap-2 text-sm text-brand-gray-text">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-black text-brand-white flex-shrink-0"
            aria-label="Etapa 1 concluída"
          >
            <IconCheck size={11} />
          </span>
          Dados do veículo
        </span>
        <span className="text-brand-gray-mid flex-shrink-0">
          <IconChevronRight size={14} />
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-brand-black text-brand-black text-xs font-bold flex-shrink-0"
            aria-current="step"
          >
            2
          </span>
          Fotos e laudo
        </span>
      </nav>

      {/* ── Cabeçalho ───────────────────────────────────────────────────── */}
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-1">
          Veículo {placaFormatada}
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
          Fotos e Laudo
        </h1>
      </div>

      {/* ── Banner de sucesso ────────────────────────────────────────────── */}
      <div
        role="status"
        className="flex items-start gap-3 rounded-xl bg-status-success-bg border border-status-success-border px-4 py-3.5 mt-4"
      >
        <span className="mt-0.5 flex-shrink-0 text-status-success-text">
          <IconCheck size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-status-success-text">
            Veículo {placaFormatada} cadastrado com sucesso!
          </p>
          <p className="text-xs text-status-success-text/80 mt-0.5">
            Adicione as fotos e o laudo técnico abaixo. Você pode pular e fazer isso mais tarde.
          </p>
        </div>
      </div>

      {/* ── Upload ──────────────────────────────────────────────────────── */}
      <VeiculoArquivos
        fotos={fotos}
        laudo={laudo}
        uploadFotoAction={uploadFotoAction}
        uploadLaudoAction={uploadLaudoAction}
        excluirArquivoAction={excluirArquivoAction}
        principalAction={principalAction}
      />

      {/* ── Botões de conclusão ─────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <Link
          href="/veiculos"
          className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
        >
          Pular por agora
        </Link>
        <Link
          href="/veiculos"
          className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-6 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          Concluir
        </Link>
      </div>
    </div>
  );
}
