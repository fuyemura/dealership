// ─── Utilitários compartilhados do módulo Financeiro ─────────────────────────

export type ManutencaoRaw = {
  valor_manutencao: number;
  situacao: { nome_dominio: string } | null;
};

export function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPct(valor: number): string {
  return (
    valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
}

export function gerarOpcoesMes(): { value: string; label: string }[] {
  const opcoes: { value: string; label: string }[] = [];
  const agora = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    opcoes.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return opcoes;
}
