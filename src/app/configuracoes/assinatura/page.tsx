import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanosAtivos } from "@/lib/plans/get-planos";
import { CancelarPlanoModal } from "./_components/cancelar-plano-modal";
import { TrocarPlanoModal } from "./_components/trocar-plano-modal";
import { ReativarPlanoModal } from "./_components/reativar-plano-modal";

// ─── Ícones ──────────────────────────────────────────────────────────────────

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
      className="w-4 h-4 shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
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
      className="w-4 h-4 shrink-0"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconReceipt() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 shrink-0"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2V9h20v7a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="2" />
    </svg>
  );
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Plano = {
  id: string;
  nome_plano: string;
  descricao_plano: string | null;
  preco_mensal: number;
  limite_veiculos: number;
  limite_usuarios: number;
  limite_fotos_veiculo: number;
  tem_qr_code: boolean;
  tem_relatorios: boolean;
  tem_suporte_prioritario: boolean;
};

type AssinaturaRaw = {
  data_fim: string | null;
  situacao: { nome_dominio: string } | null;
  plano: Plano | null;
};

type AssinaturaAtual = {
  data_fim: string | null;
  situacao: string;
  plano: Plano;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarData(isoDate: string | null): string {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function gerarBeneficios(plano: Plano): string[] {
  const beneficios: string[] = [];

  if (plano.limite_veiculos === -1) {
    beneficios.push("Veículos ilimitados");
  } else {
    beneficios.push(`Até ${plano.limite_veiculos} veículos`);
  }

  if (plano.limite_usuarios === -1) {
    beneficios.push("Usuários ilimitados");
  } else {
    beneficios.push(`Até ${plano.limite_usuarios} usuários`);
  }

  if (plano.limite_fotos_veiculo === -1) {
    beneficios.push("Fotos ilimitadas por veículo");
  } else {
    beneficios.push(`Até ${plano.limite_fotos_veiculo} fotos por veículo`);
  }

  if (plano.tem_qr_code) beneficios.push("Geração de QR Codes");
  if (plano.tem_relatorios) beneficios.push("Relatórios e analytics");
  if (plano.tem_suporte_prioritario) beneficios.push("Suporte prioritário");

  return beneficios;
}

function StatusBadge({ situacao }: { situacao: string }) {
  const labelMap: Record<string, string> = {
    ativa: "Ativa",
    trial: "Trial",
    inadimplente: "Inadimplente",
    cancelada: "Cancelada",
    expirada: "Expirada",
  };

  const styleMap: Record<string, string> = {
    ativa:
      "bg-status-success-bg text-status-success-text border-status-success-border",
    trial:
      "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    inadimplente: "bg-red-50 text-red-600 border-red-200",
    cancelada: "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40",
    expirada: "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40",
  };

  const dotMap: Record<string, string> = {
    ativa: "bg-status-success-text",
    trial: "bg-status-warning-text",
    inadimplente: "bg-red-500",
    cancelada: "bg-brand-gray-text",
    expirada: "bg-brand-gray-text",
  };

  const key = situacao.toLowerCase();
  const label = labelMap[key] ?? situacao;
  const style =
    styleMap[key] ?? "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40";
  const dot = dotMap[key] ?? "bg-brand-gray-text";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  // Busca assinatura da empresa + lista de planos ativos em paralelo
  const [{ data: assinaturaRaw }, planos] = await Promise.all([
    supabase
      .schema("dealership")
      .from("assinatura")
      .select(
        `data_fim,
         situacao:situacao_assinatura_id ( nome_dominio ),
         plano:plano_id (
           id, nome_plano, descricao_plano, preco_mensal,
           limite_veiculos, limite_usuarios, limite_fotos_veiculo,
           tem_qr_code, tem_relatorios, tem_suporte_prioritario
         )`
      )
      .eq("empresa_id", usuario.empresa_id)
      .order("criado_em", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getPlanosAtivos(),
  ]);

  const raw = assinaturaRaw as AssinaturaRaw | null;
  const assinatura: AssinaturaAtual | null =
    raw?.plano
      ? {
          data_fim: raw.data_fim ?? null,
          situacao: raw.situacao?.nome_dominio ?? "—",
          plano: raw.plano,
        }
      : null;

  const isCancelada =
    assinatura?.situacao === "cancelada" || assinatura?.situacao === "expirada";

  return (
    <>
      {/* ── Cabeçalho da página ── */}
      <div className="mb-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
          Minha Assinatura
        </h1>
        <p className="mt-1 text-sm text-brand-gray-text">
          Gerencie seu plano e visualize seus benefícios.
        </p>
      </div>

      {/* ── Plano atual ── */}
      {assinatura ? (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-5 sm:p-6 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray-text mb-1">
                Plano Atual
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-black">
                {assinatura.plano.nome_plano}
              </h2>
              {assinatura.plano.descricao_plano && (
                <p className="mt-1 text-xs text-brand-gray-text">
                  {assinatura.plano.descricao_plano}
                </p>
              )}
            </div>
            <StatusBadge situacao={assinatura.situacao} />
          </div>

          <ul className="mt-3 space-y-1.5">
            {gerarBeneficios(assinatura.plano).map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-brand-gray-text">
                <span className="text-status-success-text">
                  <IconCheck />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            {assinatura.data_fim && (
              <div className="flex items-center gap-1.5 text-sm text-brand-gray-text">
                <IconCalendar />
                <span>
                  Válido até{" "}
                  <span className="font-medium text-brand-black">
                    {formatarData(assinatura.data_fim)}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="font-display text-2xl font-bold text-brand-black">
                {formatarPreco(assinatura.plano.preco_mensal)}
              </span>
              <span className="text-sm text-brand-gray-text">/mês</span>
            </div>
          </div>

          {isCancelada ? (
            /* Banner de reativação quando cancelada/expirada */
            <div className="mt-4 rounded-xl border border-brand-gray-mid/30 bg-brand-gray-soft p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-brand-gray-text">
                Sua assinatura está <span className="font-medium text-brand-black">{assinatura.situacao}</span>.
                Escolha um plano abaixo para reativar.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
              >
                <IconReceipt />
                Ver Faturas
              </button>
              <CancelarPlanoModal
                nomePlano={assinatura.plano.nome_plano}
                dataFimFormatada={assinatura.data_fim ? formatarData(assinatura.data_fim) : null}
                precoFormatado={formatarPreco(assinatura.plano.preco_mensal)}
              />
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 px-6 sm:px-8 py-8 mb-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-brand-black mb-1">Sem assinatura ativa</p>
          <p className="text-sm text-brand-gray-text">
            Escolha um dos planos abaixo para começar.
          </p>
        </section>
      )}

      {/* ── Planos disponíveis ── */}
      {planos.length > 0 && (
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-brand-black mb-3">
            Planos Disponíveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {planos.map((plano) => {
              const isCurrent = assinatura?.plano.id === plano.id;
              const beneficios = gerarBeneficios(plano);

              return (
                <div
                  key={plano.id}
                  className={`relative flex flex-col bg-white rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                    isCurrent
                      ? "border-brand-black shadow-sm"
                      : "border-brand-gray-mid/30"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-5 inline-flex items-center rounded-full bg-brand-black text-brand-white text-xs font-semibold px-3 py-1">
                      Plano atual
                    </span>
                  )}

                  <div className="mb-3">
                    <h3 className="font-display text-base font-bold text-brand-black">
                      {plano.nome_plano}
                    </h3>
                    {plano.descricao_plano && (
                      <p className="mt-1 text-xs text-brand-gray-text">
                        {plano.descricao_plano}
                      </p>
                    )}
                  </div>

                  <div className="flex items-baseline gap-0.5 mb-3">
                    <span className="font-display text-2xl font-bold text-brand-black">
                      {formatarPreco(plano.preco_mensal)}
                    </span>
                    <span className="text-sm text-brand-gray-text">/mês</span>
                  </div>

                  <ul className="space-y-1.5 mb-4 flex-1">
                    {beneficios.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-sm text-brand-gray-text"
                      >
                        <span className="text-status-success-text">
                          <IconCheck />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {isCancelada ? (
                    <ReativarPlanoModal plano={plano} />
                  ) : (
                    <TrocarPlanoModal
                      planoAtual={assinatura?.plano ?? null}
                      planoNovo={plano}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
