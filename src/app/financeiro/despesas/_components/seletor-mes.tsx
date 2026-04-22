"use client";

import { useRouter } from "next/navigation";

type Opcao = { value: string; label: string };

type Props = {
  opcoes: Opcao[];
  mesSelecionado: string;
  basePath: string;
};

export function SeletorMes({ opcoes, mesSelecionado, basePath }: Props) {
  const router = useRouter();
  const isSelected = opcoes.some((op) => op.value === mesSelecionado);

  return (
    <select
      value={isSelected ? mesSelecionado : ""}
      onChange={(e) => {
        if (e.target.value) router.push(`${basePath}?mes=${e.target.value}`);
      }}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border bg-white outline-none cursor-pointer ${
        isSelected
          ? "border-brand-black text-brand-black font-semibold"
          : "border-brand-gray-mid text-brand-gray-text hover:text-brand-black hover:border-brand-black/30"
      }`}
    >
      <option value="" disabled>
        Outro mês…
      </option>
      {opcoes.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}
