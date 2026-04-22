"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { VeiculoLinhaAcoes } from "./veiculo-linha-acoes";
import type { QrCodeResult } from "../actions";

// ─── Formatadores (instanciados uma vez por módulo) ──────────────────────────

const fmtKm = new Intl.NumberFormat("pt-BR");
const fmtData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtBrl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type VeiculoItem = {
  id: string;
  placa: string;
  cor_veiculo: string;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  preco_venda: number | null;
  data_compra: string;
  atualizado_em: string;
  data_fim_garantia: string | null;
  marca: { nome_dominio: string } | null;
  modelo: { nome_dominio: string } | null;
  situacao: { nome_dominio: string } | null;
  veiculo_qr_code: { url_publica: string; token_publica: string; total_visualizacoes: number }[] | null;
  gerarQrCodeAction: () => Promise<QrCodeResult>;
};

interface Props {
  veiculos: VeiculoItem[];
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cls}`}>
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
  // dias = hoje - fim: positivo = expirada há X dias; negativo = expira em X dias
  const dias = Math.round((hoje.getTime() - fim.getTime()) / 86_400_000);

  let cls: string;
  let texto: string;
  if (dias > 0) {
    cls = "bg-red-50 text-red-700 border-red-200";
    texto = dias === 1 ? "Expirada há 1 dia" : `Expirada há ${dias} dias`;
  } else if (dias === 0) {
    cls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
    texto = "Expira hoje";
  } else {
    const restantes = Math.abs(dias);
    if (restantes <= 30) {
      cls = "bg-status-warning-bg text-status-warning-text border-status-warning-border";
    } else {
      cls = "bg-status-success-bg text-status-success-text border-status-success-border";
    }
    texto = restantes === 1 ? "Expira em 1 dia" : `Expira em ${restantes} dias`;
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${cls}`}>
      {texto}
    </span>
  );
}

// ─── Ícone de busca ───────────────────────────────────────────────────────────

function IconSearch({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VeiculosListaFiltravel({ veiculos }: Props) {
  const [busca, setBusca] = useState("");

  const veiculosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return veiculos;
    return veiculos.filter((v) => {
      const marca = v.marca?.nome_dominio?.toLowerCase() ?? "";
      const modelo = v.modelo?.nome_dominio?.toLowerCase() ?? "";
      const situacao = v.situacao?.nome_dominio?.toLowerCase() ?? "";
      return (
        v.placa.toLowerCase().includes(termo) ||
        marca.includes(termo) ||
        modelo.includes(termo) ||
        v.cor_veiculo.toLowerCase().includes(termo) ||
        situacao.includes(termo)
      );
    });
  }, [veiculos, busca]);

  const semResultado = busca.trim() !== "" && veiculosFiltrados.length === 0;

  return (
    <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
      {/* Barra de busca */}
      <div className="px-6 py-4 border-b border-brand-gray-mid/20 bg-brand-gray-soft/30">
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-text pointer-events-none">
            <IconSearch size={15} />
          </span>
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por placa, marca, modelo, cor…"
            aria-label="Filtrar veículos"
            className="w-full rounded-xl border border-brand-gray-mid/60 bg-white pl-9 pr-4 py-2 text-sm text-brand-black placeholder:text-brand-gray-text/50 outline-none focus:ring-2 focus:ring-brand-black/10 focus:border-brand-black/40 transition"
          />
        </div>
      </div>

      {/* Header da tabela — visível apenas em desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_168px_120px_188px] gap-4 px-6 py-3 border-b border-brand-gray-mid/20 bg-brand-gray-soft/50">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">Placa / Veículo</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">Marca / Modelo</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">Ano · Km</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text whitespace-nowrap">Atualizado em</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">Situação</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text">Ações</span>
      </div>

      {/* Sem resultados para o filtro */}
      {semResultado && (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <p className="text-sm text-brand-gray-text">
            Nenhum veículo encontrado para{" "}
            <span className="font-medium text-brand-black">&ldquo;{busca}&rdquo;</span>.
          </p>
          <button
            type="button"
            onClick={() => setBusca("")}
            className="mt-3 text-xs text-brand-gray-text underline underline-offset-2 hover:text-brand-black transition-colors"
          >
            Limpar busca
          </button>
        </div>
      )}

      {/* Lista */}
      {!semResultado && (
        <ul role="list" className="divide-y divide-brand-gray-mid/20">
          {veiculosFiltrados.map((v) => {
            const marca = v.marca?.nome_dominio ?? "—";
            const modelo = v.modelo?.nome_dominio ?? "—";
            const situacao = v.situacao?.nome_dominio ?? "—";
            const qrExistente = Array.isArray(v.veiculo_qr_code) ? (v.veiculo_qr_code[0] ?? null) : null;
            const kmFormatado = fmtKm.format(v.quilometragem);
            const precoFormatado = v.preco_venda ? fmtBrl.format(v.preco_venda) : null;

            return (
              <li key={v.id} className="group relative hover:bg-brand-gray-soft/50 transition-colors">
                {/* Overlay — clicável via mouse/toque; oculto de leitores de tela */}
                <Link
                  href={`/veiculos/${v.id}`}
                  className="absolute inset-0 z-0"
                  tabIndex={-1}
                  aria-hidden="true"
                />

                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_168px_120px_188px] gap-4 items-center px-6 py-4">
                  <div className="relative z-10 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-brand-black font-mono tracking-widest">{v.placa}</span>
                    <span className="text-xs text-brand-gray-text">{v.cor_veiculo}</span>
                  </div>
                  <div className="relative z-10 flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-brand-black">{marca}</span>
                    <span className="text-xs text-brand-gray-text">{modelo}</span>
                  </div>
                  <div className="relative z-10 flex flex-col gap-0.5">
                    <span className="text-sm text-brand-black">{v.ano_fabricacao}/{v.ano_modelo}</span>
                    <span className="text-xs text-brand-gray-text">{kmFormatado} km</span>
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs tabular-nums text-brand-gray-text">
                      {fmtData.format(new Date(v.atualizado_em))}
                    </span>
                  </div>
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <BadgeSituacao situacao={situacao} />
                    {situacao.toLowerCase() === "vendido" && (
                      <BadgeGarantia dataFim={v.data_fim_garantia} />
                    )}
                  </div>
                  <div className="relative z-10 flex items-center w-[188px]">
                    <VeiculoLinhaAcoes
                      veiculoId={v.id}
                      placa={v.placa}
                      qrCodeInicial={qrExistente}
                      gerarQrCodeAction={v.gerarQrCodeAction}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex md:hidden flex-col px-6 py-4 gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-brand-black font-mono tracking-widest">{v.placa}</span>
                      <span className="text-xs text-brand-gray-text">{v.cor_veiculo}</span>
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
                      <span className="text-sm font-medium text-brand-black">{marca} {modelo}</span>
                      <span className="text-xs text-brand-gray-text">
                        {v.ano_fabricacao}/{v.ano_modelo} · {kmFormatado} km
                      </span>
                      <span className="text-xs text-brand-gray-text">
                        Atualizado: {fmtData.format(new Date(v.atualizado_em))}
                      </span>
                      {precoFormatado && (
                        <span className="text-xs font-medium text-brand-black">{precoFormatado}</span>
                      )}
                    </div>
                    <div className="relative z-10 flex-shrink-0">
                      <VeiculoLinhaAcoes
                        veiculoId={v.id}
                        placa={v.placa}
                        qrCodeInicial={qrExistente}
                        gerarQrCodeAction={v.gerarQrCodeAction}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
