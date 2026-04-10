import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

// ─── Tipos ──────────────────────────────────────────────────────────────────
type StatusBadgeColor = "green" | "yellow" | "gray";

const statusConfig: Record<string, { label: string; color: StatusBadgeColor }> = {
  "Disponível":    { label: "Disponível",    color: "green"  },
  "Em Negociação": { label: "Em Negociação", color: "yellow" },
  "Vendido":       { label: "Vendido",       color: "gray"   },
  "Reservado":     { label: "Reservado",     color: "yellow" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function tempoEmEstoque(dataCompra: string): string {
  const dias = Math.floor((Date.now() - new Date(dataCompra).getTime()) / 86_400_000);
  return dias === 0 ? "Hoje" : dias === 1 ? "1 dia" : `${dias} dias`;
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="grid grid-cols-2 gap-[3px] w-[18px] h-[18px] flex-shrink-0">
      <div className="rounded-[2px] bg-brand-black" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black/40" />
      <div className="rounded-[2px] bg-brand-black" />
    </div>
  );
}

// ─── Ícones ──────────────────────────────────────────────────────────────────
function IconCar({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l3-4h8l3 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function IconQr({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
    </svg>
  );
}

function IconEye({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCheck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconHandshake({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  );
}

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Badge de status ─────────────────────────────────────────────────────────
function StatusBadge({ label, color }: { label: string; color: StatusBadgeColor }) {
  const styles: Record<StatusBadgeColor, string> = {
    green:  "bg-status-success-bg text-status-success-text border-status-success-border",
    yellow: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    gray:   "bg-brand-gray-soft text-brand-gray-text border-brand-gray-mid/40",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color]}`}>
      {label}
    </span>
  );
}

// ─── Card de métrica ─────────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, icon, accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${
      accent
        ? "bg-brand-black border-brand-black"
        : "bg-white border-brand-gray-mid/30"
    }`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
        accent ? "bg-white/10 text-white" : "bg-brand-gray-soft text-brand-black"
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-medium mb-0.5 ${accent ? "text-white/60" : "text-brand-gray-text"}`}>
          {label}
        </p>
        <p className={`font-display text-3xl font-bold tracking-tight ${accent ? "text-white" : "text-brand-black"}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-xs mt-1 ${accent ? "text-white/50" : "text-brand-gray-text"}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("nome_usuario, empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  const displayName =
    usuario?.nome_usuario ||
    user.email?.split("@")[0] ||
    "Usuário";

  const firstName = displayName.split(" ")[0];

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  // ── Isolamento por empresa ───────────────────────────────────
  // empresa_id vem exclusivamente do registro do usuário autenticado no banco,
  // nunca de parâmetros externos — garante que dados de outras empresas
  // jamais sejam acessados.
  const empresaId = usuario?.empresa_id ?? null;
  if (!empresaId) redirect("/login");

  const papel = usuario?.papel as unknown as { nome_dominio: string } | null;
  const isAdmin = papel?.nome_dominio === "administrador";
  const temAcessoConfig = isAdmin || papel?.nome_dominio === "gerente";

  const { data: veiculos } = await supabase
      .schema("dealership")
      .from("veiculo")
      .select(`
          id,
          placa,
          ano_modelo,
          criado_em,
          atualizado_em,
          data_venda,
          data_compra,
          marca:veiculo_marca!marca_veiculo_id(nome_dominio:nome),
          modelo:veiculo_modelo!modelo_veiculo_id(nome_dominio:nome),
          situacao:dominio!situacao_veiculo_id(nome_dominio)
        `)
        .eq("empresa_id", empresaId)
        .order("atualizado_em", { ascending: false });

  const lista = veiculos ?? [];

  const total = lista.length;
  const disponiveis = lista.filter(
    (v) => (v.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio === "Disponível"
  ).length;
  const emNegociacao = lista.filter(
    (v) => (v.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio === "Em Negociação"
  ).length;

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const vendidos = lista.filter(
    (v) =>
      (v.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio === "Vendido" &&
      v.data_venda !== null &&
      new Date(v.data_venda as string) >= inicioMes
  ).length;

  const vehicleIds = lista.map((v) => v.id);
  let qrGerados = 0;
  let qrVisualizacoes = 0;
  if (vehicleIds.length > 0) {
    const { data: qrCodes } = await supabase
      .schema("dealership")
      .from("veiculo_qr_code")
      .select("total_visualizacoes")
      .in("veiculo_id", vehicleIds);
    qrGerados = qrCodes?.length ?? 0;
    qrVisualizacoes =
      qrCodes?.reduce((acc, q) => acc + (q.total_visualizacoes ?? 0), 0) ?? 0;
  }

  // UNIQUE (empresa_id) garante exatamente 1 registro por empresa
  const { data: assinaturaData } = await supabase
    .schema("dealership")
    .from("assinatura")
    .select(`
      data_fim,
      situacao:situacao_assinatura_id(nome_dominio),
      plano:plano_id(nome_plano, limite_veiculos)
    `)
    .eq("empresa_id", empresaId)
    .maybeSingle();

  const nomePlano =
    (assinaturaData?.plano as unknown as { nome_plano: string } | null)?.nome_plano ?? "—";
  const limiteVeiculos =
    (assinaturaData?.plano as unknown as { limite_veiculos: number } | null)?.limite_veiculos ?? 0;
  const situacaoAssinatura =
    (assinaturaData?.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "—";

  const atividadeRecente = [...lista]
    .sort((a, b) => new Date(a.data_compra as string).getTime() - new Date(b.data_compra as string).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-soft">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-brand-gray-mid/40 h-14 sm:h-16 sticky top-0 z-30">
        <div className="page-container h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display font-semibold text-base sm:text-lg tracking-tight text-brand-black">
              Uyemura Tech
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Dashboard",     href: "/dashboard",     active: true  },
              { label: "Veículos",      href: "/veiculos",      active: false },
              { label: "Clientes",      href: "/clientes",      active: false },
              ...(temAcessoConfig ? [{ label: "Configurações", href: "/configuracoes", active: false }] : []),
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  item.active ? "text-brand-black" : "text-brand-gray-text hover:text-brand-black"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-gray-mid flex items-center justify-center text-xs font-semibold text-brand-black select-none">
                {initials}
              </div>
              <span className="text-sm font-medium text-brand-black">{firstName}</span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* ── Conteúdo ────────────────────────────────────────────────────────── */}
      <main className="flex-1 page-container py-8 sm:py-12 space-y-8">

        {/* ── 1. Saudação + Acesso Rápido ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-sm text-brand-gray-text mb-0.5">Bem-vindo de volta,</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
              {displayName}
            </h1>
          </div>
          <Link
            href="/veiculos/novo"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            <IconPlus />
            Registrar Novo Veículo
          </Link>
        </div>

        {/* ── 2. Resumo do Estoque ─────────────────────────────────────────── */}
        <section>
          <h2 className="section-label">Resumo do Estoque</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total de Veículos"
              value={total}
              sub="no seu estoque"
              icon={<IconCar />}
              accent
            />
            <MetricCard
              label="Disponíveis"
              value={disponiveis}
              sub="prontos para venda"
              icon={<IconCheck />}
            />
            <MetricCard
              label="Em Negociação"
              value={emNegociacao}
              sub="aguardando fechamento"
              icon={<IconHandshake />}
            />
            <MetricCard
              label="Vendidos"
              value={vendidos}
              sub="este mês"
              icon={<IconCar />}
            />
          </div>
        </section>

        {/* ── 3. Métricas de QR Code + Status da Assinatura ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Métricas rápidas — QR Codes */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6">
            <h2 className="section-label">Métricas de QR Code</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl bg-brand-gray-soft p-4 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-black shadow-sm">
                  <IconQr size={16} />
                </div>
                <p className="text-xs text-brand-gray-text">QR Codes Gerados</p>
                <p className="font-display text-3xl font-bold text-brand-black tracking-tight">
                  {qrGerados}
                </p>
                <p className="text-xs text-brand-gray-text">1 por veículo cadastrado</p>
              </div>
              <div className="rounded-xl bg-brand-gray-soft p-4 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-black shadow-sm">
                  <IconEye size={16} />
                </div>
                <p className="text-xs text-brand-gray-text">Total de Visualizações</p>
                <p className="font-display text-3xl font-bold text-brand-black tracking-tight">
                  {qrVisualizacoes}
                </p>
                <p className="text-xs text-brand-gray-text">acumulado desde o início</p>
              </div>
            </div>
          </section>

          {/* Status da Assinatura */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="section-label">Assinatura</h2>
                <p className="font-display text-xl font-bold text-brand-black mt-1">
                  {nomePlano}
                </p>
                <p className="text-xs text-brand-gray-text mt-0.5">
                  Gerencie sua assinatura abaixo
                </p>
              </div>
              {situacaoAssinatura !== "—" && (
                <div className={`flex items-center gap-1.5 pt-1 ${
                  situacaoAssinatura === "ativa" || situacaoAssinatura === "trial"
                    ? "text-status-success-text"
                    : situacaoAssinatura === "inadimplente"
                    ? "text-status-warning-text"
                    : "text-brand-gray-text"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    situacaoAssinatura === "ativa" || situacaoAssinatura === "trial"
                      ? "bg-status-success-text"
                      : situacaoAssinatura === "inadimplente"
                      ? "bg-status-warning-text"
                      : "bg-brand-gray-text"
                  }`} />
                  <span className="text-xs font-medium capitalize">
                    {situacaoAssinatura}
                  </span>
                </div>
              )}
            </div>

            {/* Veículos cadastrados */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-brand-black">Veículos cadastrados</p>
                <p className="text-xs font-bold text-brand-black">
                  {limiteVeiculos === -1
                    ? `${total} / ilimitado`
                    : limiteVeiculos > 0
                    ? `${total} / ${limiteVeiculos}`
                    : total}
                </p>
              </div>
              <div className="w-full h-2 bg-brand-gray-soft rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    limiteVeiculos > 0 && total / limiteVeiculos >= 0.9
                      ? "bg-status-warning-text"
                      : "bg-brand-black"
                  }`}
                  style={{
                    width: limiteVeiculos === -1 || limiteVeiculos === 0
                      ? total > 0 ? "100%" : "0%"
                      : `${Math.min((total / limiteVeiculos) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-brand-gray-text mt-1.5">
                {limiteVeiculos === -1
                  ? `${total} veículo${total !== 1 ? "s" : ""} — sem limite de cadastro`
                  : limiteVeiculos > 0
                  ? `${limiteVeiculos - total > 0 ? limiteVeiculos - total : 0} vaga${limiteVeiculos - total !== 1 ? "s" : ""} restante${limiteVeiculos - total !== 1 ? "s" : ""}`
                  : `${total} veículo${total !== 1 ? "s" : ""} no estoque`}
              </p>
            </div>

            <div className="mt-auto pt-5">
              <Link
                href="/configuracoes/assinatura"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
              >
                Gerenciar assinatura <IconArrowRight />
              </Link>
            </div>
          </section>
        </div>

        {/* ── 4. Atividade Recente ─────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-mid/20">
            <h2 className="section-label mb-0">Maior Tempo em Estoque</h2>
            <Link
              href="/veiculos"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
            >
              Ver todos <IconArrowRight />
            </Link>
          </div>

          {/* Tabela — desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray-mid/20">
                  {["Placa", "Veículo", "Ano", "Tempo em Estoque", "Situação", ""].map((col) => (
                    <th key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-mid/20">
                {atividadeRecente.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-brand-gray-text">
                      Nenhum veículo cadastrado ainda.
                    </td>
                  </tr>
                )}
                {atividadeRecente.map((v) => {
                  const situacaoNome = (v.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
                  const marcaNome = (v.marca as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
                  const modeloNome = (v.modelo as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
                  const s = statusConfig[situacaoNome] ?? { label: situacaoNome, color: "gray" as StatusBadgeColor };
                  const diasEstoque = tempoEmEstoque(v.data_compra as string);
                  return (
                    <tr key={v.placa} className="hover:bg-brand-gray-soft/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs font-semibold text-brand-black tracking-wider">
                        {v.placa}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-brand-black whitespace-nowrap">
                        {marcaNome} {modeloNome}
                      </td>
                      <td className="px-6 py-3.5 text-brand-gray-text">{v.ano_modelo}</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-xs tabular-nums text-brand-gray-text">
                          {diasEstoque}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge label={s.label} color={s.color} />
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/veiculos/${v.placa}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity whitespace-nowrap"
                        >
                          Consultar <IconArrowRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Lista — mobile */}
          <div className="sm:hidden divide-y divide-brand-gray-mid/20">
            {atividadeRecente.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-brand-gray-text">
                Nenhum veículo cadastrado ainda.
              </p>
            )}
            {atividadeRecente.map((v) => {
              const situacaoNome = (v.situacao as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
              const marcaNome = (v.marca as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
              const modeloNome = (v.modelo as unknown as { nome_dominio: string } | null)?.nome_dominio ?? "";
              const s = statusConfig[situacaoNome] ?? { label: situacaoNome, color: "gray" as StatusBadgeColor };
              const diasEstoque = tempoEmEstoque(v.data_compra as string);
              return (
                <div key={v.placa} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-mono text-xs font-semibold text-brand-black tracking-wider">
                      {v.placa}
                    </span>
                    <span className="text-sm font-medium text-brand-black truncate">
                      {marcaNome} {modeloNome}
                    </span>
                    <span className="text-xs text-brand-gray-text">
                      {diasEstoque} em estoque
                    </span>
                  </div>
                  <StatusBadge label={s.label} color={s.color} />
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-brand-gray-mid/30 mt-4">
        <div className="page-container h-14 flex items-center justify-between">
          <p className="text-xs text-brand-gray-text">
            © 2025 Uyemura Tech. Todos os direitos reservados.
          </p>
          <nav className="hidden sm:flex items-center gap-5">
            {["Política de Privacidade", "Termos de Serviço", "Contate-Nos"].map((item) => (
              <Link key={item} href="#"
                className="text-xs text-brand-gray-text hover:text-brand-black transition-colors">
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
