"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { reativarAssinatura } from "../actions";
import type { ActionResult } from "../actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Plano {
  id: string;
  nome_plano: string;
  preco_mensal: number;
  limite_veiculos: number;
  limite_usuarios: number;
  limite_fotos_veiculo: number;
  tem_qr_code: boolean;
  tem_relatorios: boolean;
  tem_suporte_prioritario: boolean;
}

interface ReativarPlanoModalProps {
  plano: Plano;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function gerarBeneficios(plano: Plano): string[] {
  const b: string[] = [];
  b.push(plano.limite_veiculos === -1 ? "Veículos ilimitados" : `Até ${plano.limite_veiculos} veículos`);
  b.push(plano.limite_usuarios === -1 ? "Usuários ilimitados" : `Até ${plano.limite_usuarios} usuários`);
  b.push(plano.limite_fotos_veiculo === -1 ? "Fotos ilimitadas por veículo" : `Até ${plano.limite_fotos_veiculo} fotos por veículo`);
  if (plano.tem_qr_code) b.push("Geração de QR Codes");
  if (plano.tem_relatorios) b.push("Relatórios e analytics");
  if (plano.tem_suporte_prioritario) b.push("Suporte prioritário");
  return b;
}

// ─── Ícones ──────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className="w-5 h-5 shrink-0">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ReativarPlanoModal({ plano }: ReativarPlanoModalProps) {
  const [aberto, setAberto] = useState(false);
  const [resultado, setResultado] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const beneficios = gerarBeneficios(plano);

  const fechar = useCallback(() => {
    if (isPending) return;
    setAberto(false);
    setResultado(null);
  }, [isPending]);

  // Fecha com Escape
  useEffect(() => {
    if (!aberto) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [aberto, fechar]);

  // Trava o scroll do body enquanto aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aberto]);

  function abrir() {
    setResultado(null);
    setAberto(true);
  }

  function confirmar() {
    startTransition(async () => {
      const res = await reativarAssinatura(plano.id);
      setResultado(res);
      if ("success" in res) {
        setTimeout(() => {
          fechar();
          router.refresh();
        }, 2000);
      }
    });
  }

  const sucesso = resultado && "success" in resultado;
  const erro = resultado && "error" in resultado ? resultado.error : null;

  return (
    <>
      {/* Botão de abertura */}
      <button
        type="button"
        onClick={abrir}
        className="w-full rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
      >
        Reativar com este plano
      </button>

      {/* Overlay */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) fechar(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-reativar-titulo"
        >
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Cabeçalho */}
            <div className="flex items-start justify-between p-6 pb-5 border-b border-brand-gray-mid/20">
              <div>
                <h2 id="modal-reativar-titulo" className="font-display text-lg font-bold text-brand-black">
                  Reativar Assinatura
                </h2>
                <p className="text-sm text-brand-gray-text mt-0.5">
                  Confirme o plano que deseja contratar.
                </p>
              </div>
              <button
                type="button"
                onClick={fechar}
                disabled={isPending}
                aria-label="Fechar"
                className="p-1.5 rounded-lg text-brand-gray-text hover:text-brand-black hover:bg-brand-gray-soft transition-colors disabled:opacity-40"
              >
                <IconX />
              </button>
            </div>

            {/* Corpo */}
            <div className="p-6 space-y-5">

              {sucesso ? (
                /* Estado de sucesso */
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-status-success-bg flex items-center justify-center text-status-success-text">
                    <IconCheck />
                  </div>
                  <p className="font-display text-base font-bold text-brand-black">
                    Assinatura reativada!
                  </p>
                  <p className="text-sm text-brand-gray-text">
                    Seu plano <span className="font-medium text-brand-black">{plano.nome_plano}</span> está ativo novamente.
                  </p>
                </div>
              ) : (
                <>
                  {/* Card do plano */}
                  <div className="rounded-xl border border-brand-gray-mid/30 bg-brand-gray-soft p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-0.5">
                          Plano selecionado
                        </p>
                        <p className="font-display text-lg font-bold text-brand-black">
                          {plano.nome_plano}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-xl font-bold text-brand-black">
                          {formatarPreco(plano.preco_mensal)}
                        </p>
                        <p className="text-xs text-brand-gray-text">/mês</p>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {beneficios.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-brand-gray-text">
                          <span className="text-status-success-text"><IconCheck /></span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Aviso */}
                  <div className="flex items-start gap-3 rounded-xl bg-status-success-bg border border-status-success-border p-4">
                    <span className="text-status-success-text mt-0.5"><IconSpark /></span>
                    <p className="text-sm text-status-success-text">
                      Ao reativar, você recupera imediatamente o acesso a todos os recursos do plano escolhido.
                    </p>
                  </div>

                  {/* Erro */}
                  {erro && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {erro}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Rodapé */}
            {!sucesso && (
              <div className="flex items-center justify-end gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={fechar}
                  disabled={isPending}
                  className="rounded-full border border-brand-gray-mid/40 text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmar}
                  disabled={isPending}
                  className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Reativando…" : "Confirmar Reativação"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
