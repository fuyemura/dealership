"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface QrCodeInfo {
  url_publica: string;
  token_publica: string;
  total_visualizacoes: number;
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconX({ size = 16 }: { size?: number }) {
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

// ─── Componente ───────────────────────────────────────────────────────────────

interface QrCodeModalProps {
  qrCode: QrCodeInfo;
  placa: string;
  onClose: () => void;
}

export function QrCodeModal({ qrCode, placa, onClose }: QrCodeModalProps) {
  const [copiado, setCopiado] = useState(false);
  const [qrErro, setQrErro] = useState(false);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrCode.url_publica
  )}`;

  // Trava o scroll do body e escuta Escape
  useEffect(() => {
    fecharRef.current?.focus();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Limpa timer de "Copiado!" ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(qrCode.url_publica);
      setCopiado(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* navegador sem permissão */
    }
  };

  const imprimir = () => {
    const janela = window.open("", "_blank", "width=350,height=420");
    if (!janela) return;

    // Usa criação via DOM em vez de document.write para evitar XSS por interpolação
    const doc = janela.document;
    doc.documentElement.lang = "pt-BR";

    const meta = doc.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    doc.head.appendChild(meta);

    const title = doc.createElement("title");
    title.textContent = `QR Code — ${placa}`;
    doc.head.appendChild(title);

    const style = doc.createElement("style");
    style.textContent = [
      "* { box-sizing: border-box; margin: 0; padding: 0; }",
      "body { display: flex; flex-direction: column; align-items: center;",
      "       justify-content: center; min-height: 100vh;",
      "       font-family: sans-serif; background: #fff; }",
      "img { width: 200px; height: 200px; border-radius: 8px; display: block; }",
      "p { margin-top: 12px; font-weight: bold; font-size: 18px; letter-spacing: 0.05em; }",
      "@media print { body { min-height: unset; } }",
    ].join(" ");
    doc.head.appendChild(style);

    const img = doc.createElement("img");
    img.src = qrUrl;
    img.alt = `QR Code — ${placa}`;
    doc.body.appendChild(img);

    const p = doc.createElement("p");
    p.textContent = placa; // textContent nunca interpreta HTML
    doc.body.appendChild(p);

    janela.addEventListener("load", () => {
      janela.print();
      janela.close();
    });
    doc.close();
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR Code do veículo"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 p-8 w-full max-w-sm shadow-lg flex flex-col items-center gap-6">
          {/* Título + fechar */}
          <div className="flex items-center justify-between w-full">
            <h3 className="font-display text-lg font-bold text-brand-black">
              QR Code — {placa}
            </h3>
            <button
              type="button"
              onClick={onClose}
              ref={fecharRef}
              className="text-brand-gray-text hover:text-brand-black transition-colors p-1"
              aria-label="Fechar"
            >
              <IconX size={16} />
            </button>
          </div>

          {/* QR Code */}
          {qrErro ? (
            <div className="w-[200px] h-[200px] rounded-xl border border-brand-gray-mid/30 bg-brand-gray-soft flex flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="text-xs text-brand-gray-text">
                Não foi possível carregar o QR Code.
              </p>
              <a
                href={qrCode.url_publica}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-brand-black underline"
              >
                Abrir link
              </a>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrUrl}
              alt={`QR Code do veículo ${placa}`}
              width={200}
              height={200}
              onError={() => setQrErro(true)}
              className="rounded-xl border border-brand-gray-mid/30"
            />
          )}

          {/* URL */}
          <div className="w-full">
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
          <p className="text-xs text-brand-gray-text">
            {qrCode.total_visualizacoes === 0
              ? "Nenhuma visualização ainda."
              : `${qrCode.total_visualizacoes} visualização${
                  qrCode.total_visualizacoes !== 1 ? "ões" : ""
                } até agora.`}
          </p>

          {/* Ações */}
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={imprimir}
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
    </>,
    document.body
  );
}
