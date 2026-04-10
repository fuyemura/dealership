"use client";

import { useState } from "react";
import type { ActionResult } from "../actions";

interface VeiculoZonaPerigoProps {
  excluirAction: () => Promise<ActionResult>;
}

export function VeiculoZonaPerigo({ excluirAction }: VeiculoZonaPerigoProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
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
            onClick={() => setConfirmingDelete(true)}
            className="rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2.5 hover:bg-red-50 transition-colors"
          >
            Excluir
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-brand-black">
            Tem certeza? Esta ação é <strong>irreversível</strong>.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-4 py-2 hover:bg-brand-gray-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
