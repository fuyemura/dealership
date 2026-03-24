"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { trocarPlano } from "../actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Plano = {
  id: string;
  nome_plano: string;
  preco_mensal: number;
  limite_veiculos: number;
  limite_usuarios: number;
  limite_fotos_veiculo: number;
  tem_qr_code: boolean;
  tem_relatorios: boolean;
  tem_suporte_prioritario: boolean;
};

interface TrocarPlanoModalProps {
  planoAtual: Plano | null;
  planoNovo: Plano;
}

type Classificacao =
  | { kind: "atual" }
  | { kind: "upgrade"; ganhos: string[] }
  | { kind: "downgrade"; perdas: string[] }
  | { kind: "novo" };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularDiferencas(
  de: Plano,
  para: Plano
): { ganhos: string[]; perdas: string[] } {
  const ganhos: string[] = [];
  const perdas: string[] = [];

  // Veículos
  if (de.limite_veiculos !== para.limite_veiculos) {
    if (para.limite_veiculos === -1) {
      ganhos.push("Veículos ilimitados");
    } else if (de.limite_veiculos === -1) {
      perdas.push(`Veículos: ilimitados → até ${para.limite_veiculos}`);
    } else if (para.limite_veiculos > de.limite_veiculos) {
      ganhos.push(`Veículos: até ${de.limite_veiculos} → até ${para.limite_veiculos}`);
    } else {
      perdas.push(`Veículos: até ${de.limite_veiculos} → até ${para.limite_veiculos}`);
    }
  }

  // Usuários
  if (de.limite_usuarios !== para.limite_usuarios) {
    if (para.limite_usuarios === -1) {
      ganhos.push("Usuários ilimitados");
    } else if (de.limite_usuarios === -1) {
      perdas.push(`Usuários: ilimitados → até ${para.limite_usuarios}`);
    } else if (para.limite_usuarios > de.limite_usuarios) {
      ganhos.push(`Usuários: até ${de.limite_usuarios} → até ${para.limite_usuarios}`);
    } else {
      perdas.push(`Usuários: até ${de.limite_usuarios} → até ${para.limite_usuarios}`);
    }
  }

  // Fotos por veículo
  if (de.limite_fotos_veiculo !== para.limite_fotos_veiculo) {
    if (para.limite_fotos_veiculo === -1) {
      ganhos.push("Fotos ilimitadas por veículo");
    } else if (de.limite_fotos_veiculo === -1) {
      perdas.push(`Fotos por veículo: ilimitadas → até ${para.limite_fotos_veiculo}`);
    } else if (para.limite_fotos_veiculo > de.limite_fotos_veiculo) {
      ganhos.push(`Fotos por veículo: ${de.limite_fotos_veiculo} → ${para.limite_fotos_veiculo}`);
    } else {
      perdas.push(`Fotos por veículo: ${de.limite_fotos_veiculo} → ${para.limite_fotos_veiculo}`);
    }
  }

  // Features booleanas
  if (!de.tem_qr_code && para.tem_qr_code) ganhos.push("Geração de QR Codes");
  if (de.tem_qr_code && !para.tem_qr_code) perdas.push("Geração de QR Codes");

  if (!de.tem_relatorios && para.tem_relatorios) ganhos.push("Relatórios e analytics");
  if (de.tem_relatorios && !para.tem_relatorios) perdas.push("Relatórios e analytics");

  if (!de.tem_suporte_prioritario && para.tem_suporte_prioritario)
    ganhos.push("Suporte prioritário");
  if (de.tem_suporte_prioritario && !para.tem_suporte_prioritario)
    perdas.push("Suporte prioritário");

  return { ganhos, perdas };
}

function classificar(planoAtual: Plano | null, planoNovo: Plano): Classificacao {
  if (!planoAtual) return { kind: "novo" };
  if (planoAtual.id === planoNovo.id) return { kind: "atual" };

  const { ganhos, perdas } = calcularDiferencas(planoAtual, planoNovo);

  if (planoNovo.preco_mensal > planoAtual.preco_mensal) {
    return { kind: "upgrade", ganhos };
  }
  return { kind: "downgrade", perdas };
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function PlanoComparacao({
  de,
  para,
  delta,
  isUpgrade,
}: {
  de: Plano;
  para: Plano;
  delta: number;
  isUpgrade: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-gray-soft border border-brand-gray-mid/40 p-4">
      {/* De */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-brand-gray-text mb-0.5">Plano atual</p>
        <p className="text-sm font-semibold text-brand-black truncate">{de.nome_plano}</p>
        <p className="text-xs text-brand-gray-text">{formatarPreco(de.preco_mensal)}/mês</p>
      </div>

      {/* Seta */}
      <div className="shrink-0 text-brand-gray-text">
        <IconArrowRight />
      </div>

      {/* Para */}
      <div className="flex-1 min-w-0 text-right">
        <p className="text-xs text-brand-gray-text mb-0.5">Novo plano</p>
        <p className="text-sm font-semibold text-brand-black truncate">{para.nome_plano}</p>
        <p className="text-xs text-brand-gray-text">{formatarPreco(para.preco_mensal)}/mês</p>
      </div>

      {/* Delta */}
      <div className="shrink-0">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
            isUpgrade
              ? "bg-status-success-bg text-status-success-text border-status-success-border"
              : "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/60"
          }`}
        >
          {isUpgrade ? "+" : "−"}{formatarPreco(Math.abs(delta))}/mês
        </span>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export function TrocarPlanoModal({ planoAtual, planoNovo }: TrocarPlanoModalProps) {
  const router = useRouter();
  const classificacao = classificar(planoAtual, planoNovo);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Fechar no Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isPending]);

  // ── Travar scroll do body ───────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleOpen() {
    setStep(1);
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
  }

  function handleConfirmar() {
    startTransition(async () => {
      const result = await trocarPlano(planoNovo.id);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.refresh();
        handleClose();
      }
    });
  }

  // ── Plano atual: botão disabled ─────────────────────────────────────────────
  if (classificacao.kind === "atual") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-brand-gray-soft text-brand-gray-text text-sm font-medium px-5 py-2.5 cursor-default"
      >
        Plano atual
      </button>
    );
  }

  // ── Sem assinatura: botão que leva ao contato ───────────────────────────────
  if (classificacao.kind === "novo") {
    return (
      <a
        href="/contato"
        className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
      >
        Contratar <IconArrowRight />
      </a>
    );
  }

  const isUpgrade = classificacao.kind === "upgrade";
  const delta = planoNovo.preco_mensal - (planoAtual?.preco_mensal ?? 0);
  // Downgrade tem 2 passos; upgrade vai direto para confirmação

  return (
    <>
      {/* Botão gatilho */}
      {isUpgrade ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconArrowUp />
          Fazer Upgrade
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2 w-full rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
        >
          <IconArrowDown />
          Fazer Downgrade
        </button>
      )}

      {/* Modal */}
      {open && planoAtual && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-trocar-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
            onClick={!isPending ? handleClose : undefined}
            aria-hidden="true"
          />

          {/* Painel */}
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Barra de progresso — só exibida no downgrade (2 etapas) */}
            {!isUpgrade && (
              <div className="flex h-1" aria-hidden="true">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 transition-colors duration-300 ${
                      s <= step ? "bg-brand-black" : "bg-brand-gray-mid/40"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* ── Upgrade: confirmação direta (1 passo) ── */}
              {isUpgrade && (
                <>
                  <h2
                    id="modal-trocar-title"
                    className="font-display text-xl font-bold text-brand-black mb-1"
                  >
                    Upgrade para {planoNovo.nome_plano}
                  </h2>
                  <p className="text-sm text-brand-gray-text mb-5">
                    Você está evoluindo seu plano e ganhará acesso a mais recursos.
                  </p>

                  <PlanoComparacao
                    de={planoAtual}
                    para={planoNovo}
                    delta={delta}
                    isUpgrade={true}
                  />

                  {/* Ganhos */}
                  {classificacao.ganhos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-2">
                        Você passará a ter
                      </p>
                      <ul className="space-y-1.5">
                        {classificacao.ganhos.map((g) => (
                          <li
                            key={g}
                            className="flex items-center gap-2 text-sm text-brand-gray-text"
                          >
                            <span className="text-status-success-text shrink-0">
                              <IconCheck />
                            </span>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Aviso de vigência */}
                  <div className="mt-5 flex items-start gap-2 rounded-xl bg-status-success-bg border border-status-success-border px-4 py-3">
                    <span className="text-status-success-text shrink-0 mt-0.5">
                      <IconInfo />
                    </span>
                    <p className="text-xs text-status-success-text leading-relaxed">
                      A mudança é aplicada imediatamente. O valor proporcional
                      será considerado na sua próxima fatura.
                    </p>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmar}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isPending ? (
                        <>
                          <IconSpinner />
                          Aplicando…
                        </>
                      ) : (
                        "Confirmar upgrade"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isPending}
                      className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}

              {/* ── Downgrade: etapa 1 — o que será perdido ── */}
              {!isUpgrade && step === 1 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                    Etapa 1 de 2
                  </p>
                  <h2
                    id="modal-trocar-title"
                    className="font-display text-xl font-bold text-brand-black mb-1"
                  >
                    Você deixará de ter acesso a
                  </h2>
                  <p className="text-sm text-brand-gray-text mb-5">
                    Ao mudar para o plano{" "}
                    <span className="font-medium text-brand-black">
                      {planoNovo.nome_plano}
                    </span>
                    , os seguintes recursos serão afetados:
                  </p>

                  {classificacao.perdas.length > 0 ? (
                    <ul className="space-y-2 mb-5">
                      {classificacao.perdas.map((p) => (
                        <li
                          key={p}
                          className="flex items-center gap-2 text-sm text-brand-gray-text"
                        >
                          <span className="text-red-400 shrink-0">
                            <IconXCircle />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-brand-gray-text mb-5">
                      Nenhuma funcionalidade será removida, apenas o preço muda.
                    </p>
                  )}

                  {/* Aviso de vigência */}
                  <div className="flex items-start gap-2 rounded-xl bg-status-warning-bg border border-status-warning-border px-4 py-3 mb-1">
                    <span className="text-status-warning-text shrink-0 mt-0.5">
                      <IconInfo />
                    </span>
                    <p className="text-xs text-status-warning-text leading-relaxed">
                      O downgrade é aplicado imediatamente. Se você já passou
                      dos limites do novo plano, o acesso pode ser restrito.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5"
                    >
                      Manter plano {planoAtual.nome_plano}
                    </button>
                  </div>
                </>
              )}

              {/* ── Downgrade: etapa 2 — confirmação ── */}
              {!isUpgrade && step === 2 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                    Etapa 2 de 2
                  </p>
                  <h2
                    id="modal-trocar-title"
                    className="font-display text-xl font-bold text-brand-black mb-1"
                  >
                    Confirmar downgrade
                  </h2>
                  <p className="text-sm text-brand-gray-text mb-5">
                    Revise o resumo antes de confirmar.
                  </p>

                  <PlanoComparacao
                    de={planoAtual}
                    para={planoNovo}
                    delta={delta}
                    isUpgrade={false}
                  />

                  {error && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmar}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isPending ? (
                        <>
                          <IconSpinner />
                          Aplicando…
                        </>
                      ) : (
                        "Confirmar downgrade"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isPending}
                      className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5 disabled:opacity-50"
                    >
                      Voltar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function IconArrowDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconXCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="w-4 h-4 animate-spin"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}
