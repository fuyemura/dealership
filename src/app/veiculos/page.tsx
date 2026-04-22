import Link from "next/link";
import type { Metadata } from "next";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { gerarQrCode } from "./actions";
import { VeiculosListaFiltravel } from "./_components/veiculos-lista-filtravel";

export const metadata: Metadata = {
  title: "Veículos — Uyemura Tech",
};

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

// ─── Tipos locais ────────────────────────────────────────────────────────────────

// VeiculoRow omite gerarQrCodeAction (adicionado abaixo antes de passar ao Client Component)
type VeiculoRow = Omit<import("./_components/veiculos-lista-filtravel").VeiculoItem, "gerarQrCodeAction">;

// ─── Página ───────────────────────────────────────────────────────────────────────

export default async function VeiculosPage() {
  const { supabase, usuarioAtual } = await getUsuarioAutorizado();

  const { data: veiculosRaw } = await supabase
    .schema("dealership")
    .from("veiculo")
    .select(
      `id, placa, cor_veiculo, ano_fabricacao, ano_modelo, quilometragem, preco_venda,
       data_compra, data_fim_garantia, atualizado_em,
       marca:veiculo_marca!marca_veiculo_id(nome_dominio:nome),
       modelo:veiculo_modelo!modelo_veiculo_id(nome_dominio:nome),
       situacao:dominio!situacao_veiculo_id(nome_dominio),
       veiculo_qr_code(url_publica, token_publica, total_visualizacoes)`
    )
    .eq("empresa_id", usuarioAtual.empresa_id)
    .order("atualizado_em", { ascending: false });

  const veiculosBase = (veiculosRaw as unknown as VeiculoRow[] | null) ?? [];
  const total = veiculosBase.length;

  // Pré-vincula a server action de cada veículo para passar ao Client Component
  const veiculos = veiculosBase.map((v) => ({
    ...v,
    gerarQrCodeAction: gerarQrCode.bind(null, v.id),
  }));

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

      {/* ── Tabela de veículos com filtro ────────────────────────────────── */}
      {total > 0 && <VeiculosListaFiltravel veiculos={veiculos} />}
    </>
  );
}
