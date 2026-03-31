"use client";

import { useState } from "react";
import Link from "next/link";
import type { QrCodeResult } from "../actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface QrCodeInfo {
  url_publica: string;
  token_publica: string;
  total_visualizacoes: number;
}

interface Props {
  veiculoId: string;
  placa: string;
  qrCodeInicial?: QrCodeInfo | null;
  gerarQrCodeAction: () => Promise<QrCodeResult>;
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconQrCode({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 448 512"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 224h192V32H0v192zM64 96h64v64H64V96zm192-64v192h192V32H256zm128 128h-64V96h64v64zM0 480h192V288H0v192zm64-128h64v64H64v-64zm352-64h32v128h-96v-32h-32v96h-64V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z" />
    </svg>
  );
}

function IconEdit({ size = 15 }: { size?: number }) {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCopy({ size = 13 }: { size?: number }) {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconPrint({ size = 15 }: { size?: number }) {
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
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

// ─── Modal QR Code ────────────────────────────────────────────────────────────

function QrCodeModal({
  qrCode,
  placa,
  onClose,
}: {
  qrCode: QrCodeInfo;
  placa: string;
  onClose: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrCode.url_publica
  )}`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.url_publica);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* navegador sem permissão */
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR Code do veículo"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:inset-auto print:z-auto print:p-0"
      >
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6 print:shadow-none print:border-none print:p-0">
          {/* Título + fechar */}
          <div className="flex items-center justify-between w-full print:hidden">
            <h3 className="font-display text-lg font-bold text-brand-black">
              QR Code — {placa}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-brand-gray-text hover:text-brand-black transition-colors p-1"
              aria-label="Fechar"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* QR Code */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt={`QR Code do veículo ${placa}`}
            width={200}
            height={200}
            className="rounded-xl border border-brand-gray-mid/30"
          />

          {/* Placa (visível na impressão) */}
          <p className="hidden print:block text-center font-bold text-lg">{placa}</p>

          {/* URL */}
          <div className="w-full print:hidden">
            <p className="text-xs text-brand-gray-text mb-1.5">Link público</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={qrCode.url_publica}
                className="flex-1 rounded-xl border border-brand-gray-mid/60 bg-brand-gray-soft px-3 py-2 text-xs text-brand-gray-text outline-none"
              />
              <button
                type="button"
                onClick={copiar}
                className="flex-shrink-0 rounded-xl border border-brand-gray-mid/60 px-3 py-2 text-xs font-medium text-brand-black hover:bg-brand-gray-soft transition-colors flex items-center gap-1.5"
              >
                <IconCopy size={13} />
                {copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Visualizações */}
          <p className="text-xs text-brand-gray-text print:hidden">
            {qrCode.total_visualizacoes === 0
              ? "Nenhuma visualização ainda."
              : `${qrCode.total_visualizacoes} visualização${
                  qrCode.total_visualizacoes !== 1 ? "ões" : ""
                } até agora.`}
          </p>

          {/* Ações */}
          <div className="flex items-center gap-3 w-full print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
            >
              <IconPrint size={15} />
              Imprimir
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VeiculoLinhaAcoes({
  veiculoId,
  placa,
  qrCodeInicial,
  gerarQrCodeAction,
}: Props) {
  const [qrCode, setQrCode] = useState<QrCodeInfo | null>(qrCodeInicial ?? null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const abrirQr = async () => {
    if (qrCode) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    setErro(null);

    const result = await gerarQrCodeAction();

    setLoading(false);

    if ("error" in result) {
      setErro(result.error);
      return;
    }

    setQrCode(result);
    setShowModal(true);
  };

  return (
    <>
      <div className="flex items-center gap-1.5 print:hidden">
        {/* Botão QR Code */}
        <button
          type="button"
          onClick={abrirQr}
          disabled={loading}
          title="Ver QR Code"
          aria-label={`QR Code do veículo ${placa}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gray-mid/60 bg-white px-2.5 py-1.5 text-xs font-medium text-brand-black hover:bg-brand-gray-soft transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? (
            <span className="inline-block w-3.5 h-3.5 border-2 border-brand-gray-mid border-t-brand-black rounded-full animate-spin" />
          ) : (
            <IconQrCode size={14} />
          )}
          <span className="hidden sm:inline">QR Code</span>
        </button>

        {/* Botão Editar */}
        <Link
          href={`/veiculos/${veiculoId}`}
          title="Editar veículo"
          aria-label={`Editar veículo ${placa}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-gray-mid/60 bg-white px-2.5 py-1.5 text-xs font-medium text-brand-black hover:bg-brand-gray-soft transition-colors"
        >
          <IconEdit size={14} />
          <span className="hidden sm:inline">Editar</span>
        </Link>

        {/* Feedback de erro inline */}
        {erro && (
          <span className="text-xs text-red-600 ml-1" role="alert">
            {erro}
          </span>
        )}
      </div>

      {/* Modal QR */}
      {showModal && qrCode && (
        <QrCodeModal
          qrCode={qrCode}
          placa={placa}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
