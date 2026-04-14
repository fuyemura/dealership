"use client";

import { useState } from "react";
import Link from "next/link";
import type { QrCodeResult } from "../actions";
import { QrCodeModal, type QrCodeInfo } from "./qr-code-modal";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type { QrCodeInfo };

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
