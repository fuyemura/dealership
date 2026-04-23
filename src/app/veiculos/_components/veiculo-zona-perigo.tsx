"use client";

import { useState, useRef } from "react";
import type { ActionResult } from "../actions";

interface VeiculoZonaPerigoProps {
  excluirAction: () => Promise<ActionResult>;
  placa: string;
}

export function VeiculoZonaPerigo({ excluirAction, placa }: VeiculoZonaPerigoProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const confirmacaoCorreta = confirmInput.trim().toUpperCase() === placa.toUpperCase();

  const abrirConfirmacao = () => {
    setConfirmingDelete(true);
    setConfirmInput("");
    setDeleteError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDelete = async () => {
    if (!confirmacaoCorreta) return;
    setDeleteError(null);
    setIsDeleting(true);
    const result = await excluirAction();
    if (result?.error) {
      setDeleteError(result.error);
      setConfirmingDelete(false);
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full max-w-5xl bg-white rounded-2xl border border-red-100 p-6 sm:p-8 print:hidden">
      <div className="pb-3 mb-6 border-b border-red-100">
        <h2 className="text-sm font-semibold text-red-600">Zona de Perigo</h2>
      </div>

      {deleteError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {deleteError}
        </div>
      )}

      {!confirmingDelete ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-black">Excluir veículo</p>
            <p className="text-xs text-brand-gray-text mt-0.5">
              Esta ação não pode ser desfeita. Todos os dados serão removidos.
            </p>
          </div>
          <button
            type="button"
            onClick={abrirConfirmacao}
            className="rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2.5 hover:bg-red-50 transition-colors"
          >
            Excluir
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-brand-black">
            Digite a placa{" "}
            <span className="font-mono font-semibold tracking-widest text-brand-black">{placa}</span>{" "}
            para confirmar a exclusão:
          </p>
          <input
            ref={inputRef}
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
            placeholder={placa}
            maxLength={8}
            aria-label="Confirmar placa para exclusão"
            className="w-full max-w-xs rounded-xl border border-brand-gray-mid/60 px-4 py-2.5 text-sm font-mono tracking-widest text-brand-black placeholder:text-brand-gray-text/40 bg-white outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setConfirmingDelete(false); setConfirmInput(""); }}
              disabled={isDeleting}
              className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-4 py-2 hover:bg-brand-gray-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || !confirmacaoCorreta}
              className="rounded-full bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
