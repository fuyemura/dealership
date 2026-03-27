"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelarAssinatura } from "../actions";

// ─── Dados ────────────────────────────────────────────────────────────────────

const MOTIVOS = [
  { id: "preco", label: "Preço muito alto" },
  { id: "uso", label: "Não uso com frequência suficiente" },
  { id: "concorrente", label: "Encontrei outra solução" },
  { id: "funcionalidades", label: "Faltam funcionalidades que preciso" },
  { id: "tecnico", label: "Problemas técnicos" },
  { id: "outro", label: "Outro motivo" },
] as const;

type MotivoId = (typeof MOTIVOS)[number]["id"];

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CancelarPlanoModalProps {
  nomePlano: string;
  dataFimFormatada: string | null;
  precoFormatado: string;
}

interface RetencaoConfig {
  titulo: string;
  mensagem: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRetencao(motivoId: MotivoId, nomePlano: string): RetencaoConfig {
  switch (motivoId) {
    case "preco":
      return {
        titulo: "Existe um plano mais acessível para você",
        mensagem:
          "Nosso plano Básico oferece as funcionalidades essenciais por um custo menor. Considere fazer o downgrade em vez de cancelar.",
      };
    case "uso":
      return {
        titulo: "Sabemos que a rotina é corrida",
        mensagem:
          "Entre em contato com nosso suporte — podemos encontrar uma solução que se encaixe melhor na operação da sua revenda de veículos.",
      };
    case "funcionalidades":
      return {
        titulo: "Queremos saber o que você precisa",
        mensagem:
          "Muitas funcionalidades são desenvolvidas com base no feedback dos clientes. Entre em contato com o suporte e conte o que está faltando.",
      };
    case "tecnico":
      return {
        titulo: "Podemos resolver isso juntos",
        mensagem:
          "Nossa equipe de suporte está disponível para ajudar com qualquer problema técnico. Antes de cancelar, que tal abrirmos um chamado?",
      };
    default:
      return {
        titulo: "Sentiremos sua falta",
        mensagem: `O plano ${nomePlano} inclui todos os recursos que sua revenda de veículos precisa para operar com eficiência. Tem certeza que deseja cancelar?`,
      };
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function CancelarPlanoModal({
  nomePlano,
  dataFimFormatada,
  precoFormatado,
}: CancelarPlanoModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [motivoId, setMotivoId] = useState<MotivoId | "">("");
  const [motivoOutro, setMotivoOutro] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ── Fechar no Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
    setMotivoId("");
    setMotivoOutro("");
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
  }

  function handleProsseguirParaRetencao() {
    if (!motivoId) {
      setError("Selecione um motivo para continuar.");
      return;
    }
    setError(null);
    setStep(2);
  }

  function handleProsseguirParaConfirmacao() {
    setError(null);
    setStep(3);
  }

  function handleConfirmar() {
    const motivoLabel =
      motivoId === "outro"
        ? motivoOutro.trim() || "Outro"
        : MOTIVOS.find((m) => m.id === motivoId)?.label ?? String(motivoId);

    startTransition(async () => {
      const result = await cancelarAssinatura(motivoLabel);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.refresh();
        handleClose();
      }
    });
  }

  // ── Conteúdo de retenção baseado no motivo ──────────────────────────────────
  const retencao =
    motivoId !== ""
      ? getRetencao(motivoId as MotivoId, nomePlano)
      : null;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Botão gatilho */}
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2.5 hover:bg-red-50 transition-colors"
      >
        Cancelar Plano
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-cancelar-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
            onClick={!isPending ? handleClose : undefined}
            aria-hidden="true"
          />

          {/* Painel */}
          <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Barra de progresso por etapas */}
            <div className="flex h-1" aria-hidden="true">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 transition-colors duration-300 ${
                    s <= step ? "bg-red-500" : "bg-brand-gray-mid/40"
                  }`}
                />
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {/* ── Etapa 1: Pesquisa de saída ── */}
              {step === 1 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                    Etapa 1 de 3
                  </p>
                  <h2
                    id="modal-cancelar-title"
                    className="font-display text-xl font-bold text-brand-black mb-1"
                  >
                    Por que deseja cancelar?
                  </h2>
                  <p className="text-sm text-brand-gray-text mb-6">
                    Sua opinião nos ajuda a melhorar o produto.
                  </p>

                  <fieldset className="space-y-2.5">
                    <legend className="sr-only">Motivo do cancelamento</legend>
                    {MOTIVOS.map((m, i) => (
                      <label
                        key={m.id}
                        className={`flex items-center gap-3 w-full rounded-xl border p-3.5 cursor-pointer transition-colors ${
                          motivoId === m.id
                            ? "border-brand-black bg-brand-gray-soft"
                            : "border-brand-gray-mid/60 hover:bg-brand-gray-soft/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="motivo-cancelamento"
                          value={m.id}
                          checked={motivoId === m.id}
                          // autoFocus no primeiro item ao abrir o modal
                          autoFocus={i === 0}
                          onChange={() => {
                            setMotivoId(m.id);
                            setError(null);
                          }}
                          className="accent-brand-black shrink-0"
                        />
                        <span className="text-sm text-brand-black">
                          {m.label}
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  {/* Campo livre para "outro" */}
                  {motivoId === "outro" && (
                    <textarea
                      rows={3}
                      placeholder="Conte-nos mais…"
                      value={motivoOutro}
                      onChange={(e) => setMotivoOutro(e.target.value)}
                      maxLength={500}
                      className="mt-4 w-full rounded-xl border border-brand-gray-mid/60 px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white outline-none focus:ring-2 focus:ring-brand-black/10 focus:border-brand-black/40 resize-none"
                    />
                  )}

                  {error && (
                    <p role="alert" className="mt-4 text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleProsseguirParaRetencao}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
                    >
                      Continuar
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5"
                    >
                      Manter meu plano
                    </button>
                  </div>
                </>
              )}

              {/* ── Etapa 2: Oferta de retenção ── */}
              {step === 2 && retencao && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                    Etapa 2 de 3
                  </p>
                  <h2
                    id="modal-cancelar-title"
                    className="font-display text-xl font-bold text-brand-black mb-2"
                  >
                    {retencao.titulo}
                  </h2>
                  <p className="text-sm text-brand-gray-text leading-relaxed mb-6">
                    {retencao.mensagem}
                  </p>

                  {/* O que o usuário perderia */}
                  <div className="rounded-xl bg-brand-gray-soft border border-brand-gray-mid/40 p-4 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-3">
                      Você deixaria de ter acesso a
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Gestão completa de veículos e estoque",
                        "Histórico de manutenções e custos",
                        "Controle de usuários da sua equipe",
                        `Plano ${nomePlano} por apenas ${precoFormatado}/mês`,
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-brand-gray-text"
                        >
                          <IconXCircle />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
                    >
                      Manter meu plano
                    </button>
                    <button
                      type="button"
                      onClick={handleProsseguirParaConfirmacao}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-2 py-2.5"
                    >
                      Continuar com o cancelamento
                    </button>
                  </div>
                </>
              )}

              {/* ── Etapa 3: Confirmação final ── */}
              {step === 3 && (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                    Etapa 3 de 3
                  </p>
                  <h2
                    id="modal-cancelar-title"
                    className="font-display text-xl font-bold text-brand-black mb-2"
                  >
                    Confirmar cancelamento
                  </h2>
                  <p className="text-sm text-brand-gray-text mb-5">
                    Antes de confirmar, entenda o que acontecerá:
                  </p>

                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start gap-3 text-sm text-brand-gray-text">
                      <span className="mt-0.5 shrink-0">
                        <IconCalendar />
                      </span>
                      {dataFimFormatada ? (
                        <>
                          Seu acesso permanece ativo até{" "}
                          <span className="font-medium text-brand-black">
                            {dataFimFormatada}
                          </span>
                          .
                        </>
                      ) : (
                        "Seu acesso permanece ativo até o fim do período vigente."
                      )}
                    </li>
                    <li className="flex items-start gap-3 text-sm text-brand-gray-text">
                      <span className="mt-0.5 shrink-0">
                        <IconDatabase />
                      </span>
                      Após o encerramento, seus dados ficam armazenados por{" "}
                      <span className="font-medium text-brand-black">
                        90 dias
                      </span>
                      .
                    </li>
                    <li className="flex items-start gap-3 text-sm text-brand-gray-text">
                      <span className="mt-0.5 shrink-0">
                        <IconTrash />
                      </span>
                      Após 90 dias, todos os dados são excluídos
                      permanentemente.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-brand-gray-text">
                      <span className="mt-0.5 shrink-0">
                        <IconRefresh />
                      </span>
                      Você pode reativar sua assinatura a qualquer momento
                      antes da exclusão dos dados.
                    </li>
                  </ul>

                  {error && (
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmar}
                      disabled={isPending}
                      className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 text-red-700 text-sm font-medium px-5 py-2.5 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isPending ? (
                        <>
                          <IconSpinner />
                          Cancelando…
                        </>
                      ) : (
                        "Confirmar cancelamento"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={isPending}
                      className="text-sm font-medium text-brand-black hover:text-brand-black/70 transition-colors px-2 py-2.5 disabled:opacity-50"
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
      className="w-4 h-4 shrink-0 text-red-400"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function IconCalendar() {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconDatabase() {
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
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconTrash() {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconRefresh() {
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
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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
