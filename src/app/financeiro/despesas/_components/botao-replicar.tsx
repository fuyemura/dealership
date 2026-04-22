"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { replicarDespesa } from "../actions";

function IconRepeat({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function BotaoReplicar({ id }: { id: string }) {
  const router = useRouter();
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleClick = async () => {
    setEstado("loading");
    setMensagem(null);
    const result = await replicarDespesa(id);
    if (result?.error) {
      setEstado("erro");
      setMensagem(result.error);
      setTimeout(() => { setEstado("idle"); setMensagem(null); }, 4000);
    } else {
      setEstado("ok");
      router.refresh();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={estado === "loading" || estado === "ok"}
        title="Replicar para este mês"
        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
          estado === "ok"
            ? "text-status-success-text"
            : estado === "erro"
            ? "text-red-500 hover:opacity-70"
            : "text-brand-gray-text hover:text-brand-black"
        }`}
      >
        <IconRepeat size={13} />
        {estado === "loading" ? "Replicando…" : estado === "ok" ? "Replicado" : "Replicar"}
      </button>

      {/* Tooltip de erro */}
      {estado === "erro" && mensagem && (
        <div className="absolute bottom-full left-0 mb-1.5 w-56 rounded-xl bg-brand-black text-brand-white text-xs px-3 py-2 shadow-lg z-10 leading-snug">
          {mensagem}
        </div>
      )}
    </div>
  );
}
