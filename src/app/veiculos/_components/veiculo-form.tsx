"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { veiculoBaseSchema, buildVeiculoSchema, PLACA_RE } from "@/lib/schemas/veiculo";
import type {
  ActionResult,
  VeiculoFormData,
  QrCodeResult,
} from "../actions";
import { QrCodeModal, type QrCodeInfo } from "./qr-code-modal";
export type { QrCodeInfo } from "./qr-code-modal";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Dominio {
  id: string;
  nome_dominio: string;
}

export interface ModeloVeiculo {
  id: string;
  marca_id: string | null;
  nome_dominio: string;
}

export interface Dominios {
  marcas: Dominio[];
  modelos: ModeloVeiculo[];
  combustiveis: Dominio[];
  cambios: Dominio[];
  direcoes: Dominio[];
  situacoes: Dominio[];
}

export interface VeiculoInicial {
  id: string;
  placa: string;
  renavam: string;
  numero_chassi: string;
  marca_veiculo_id: string;
  modelo_veiculo_id: string;
  combustivel_veiculo_id: string;
  cambio_veiculo_id: string;
  direcao_veiculo_id: string;
  situacao_veiculo_id: string;
  ano_fabricacao: number;
  ano_modelo: number;
  cor_veiculo: string;
  quantidade_portas: number;
  quilometragem: number;
  vidro_eletrico: boolean;
  trava_eletrica: boolean;
  laudo_aprovado: boolean;
  data_compra: string;
  preco_compra: number;
  preco_venda: number | null;
  data_venda: string | null;
  data_entrega: string | null;
  descricao: string | null;
  quantidade_dias_garantia: number | null;
}

export interface VeiculoFormProps {
  dominios: Dominios;
  salvarAction: (data: VeiculoFormData) => Promise<ActionResult>;
  gerarQrCodeAction?: () => Promise<QrCodeResult>;
  verificarPlacaAction?: (placa: string) => Promise<ActionResult>;
  initialData?: VeiculoInicial;
  qrCodeInicial?: QrCodeInfo | null;
}

// ─── Schema Zod ───────────────────────────────────────────────────────────────
// Schema importado de @/lib/schemas/veiculo — fonte única de verdade.
// buildVeiculoSchema adiciona validação condicional de campos de venda.

const baseSchema = veiculoBaseSchema;

type FormValues = z.infer<typeof baseSchema>;

// ─── Ícones inline ────────────────────────────────────────────────────────────

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconQrCode({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3z" /><path d="M17 17h4" /><path d="M17 14v7" />
    </svg>
  );
}

function IconPrint({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function IconSearch({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconWrench({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = (hasError: boolean) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-brand-gray-mid/60 focus:border-brand-black/40"
  }`;

const labelCls =
  "block text-xs font-semibold uppercase tracking-wide text-brand-gray-text";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="text-xs text-red-500 mt-1">
      {msg}
    </p>
  );
}

// ─── Campo monetário ─────────────────────────────────────────────────────────

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function parsearMoeda(str: string): number | null {
  // "1.234,56" → 1234.56 | "1234,56" → 1234.56 | "1234.56" → 1234.56
  const semMilhar = str.replace(/\./g, "");
  const comPonto = semMilhar.replace(",", ".");
  const num = parseFloat(comPonto);
  return isNaN(num) ? null : Math.round(num * 100) / 100;
}

interface CurrencyInputProps {
  id: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  hasError?: boolean;
}

function CurrencyInput({ id, value, onChange, onBlur, disabled, hasError }: CurrencyInputProps) {
  const [display, setDisplay] = useState(() =>
    value != null && value > 0 ? formatarMoeda(value) : ""
  );

  // Sincroniza display quando o valor externo muda (ex: reset do formulário).
  useEffect(() => {
    setDisplay(value != null && value > 0 ? formatarMoeda(value) : "");
  }, [value]);

  const borderCls = hasError
    ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
    : "border-brand-gray-mid/60 focus-within:border-brand-black/40 focus-within:ring-brand-black/10";

  return (
    <div
      className={`flex items-center w-full rounded-xl border px-4 py-2.5 bg-white transition-colors focus-within:ring-2 ${borderCls}`}
    >
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={display}
        onChange={(e) => setDisplay(e.target.value)}
        onBlur={() => {
          const parsed = parsearMoeda(display);
          onChange(parsed);
          setDisplay(parsed != null ? formatarMoeda(parsed) : "");
          onBlur?.();
        }}
        disabled={disabled}
        placeholder="0,00"
        className="flex-1 outline-none bg-transparent text-sm text-brand-black placeholder:text-brand-gray-text/40 min-w-0 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pb-3 mb-6 border-b border-brand-gray-mid/30">
      <h2 className="text-sm font-semibold text-brand-black">{title}</h2>
    </div>
  );
}

/** Tenta encontrar o UUID de um domínio pelo texto (case-insensitive) */
function matchId(value: string | null | undefined, list: Dominio[]): string {
  if (!value) return "";
  const lower = value.toLowerCase().trim();
  const exact = list.find((d) => d.nome_dominio.toLowerCase() === lower);
  if (exact) return exact.id;
  const partial = list.find(
    (d) =>
      d.nome_dominio.toLowerCase().includes(lower) ||
      lower.includes(d.nome_dominio.toLowerCase())
  );
  return partial?.id ?? "";
}

// ─── Etapa 1: Entrada de placa ────────────────────────────────────────────────

interface PlacaStepProps {
  onNext: (placa: string, dadosApi: ApiDadosVeiculo | null) => void;
  verificarPlacaAction?: (placa: string) => Promise<ActionResult>;
}

interface ApiDadosVeiculo {
  configurado: boolean;
  marca?: string | null;
  modelo?: string | null;
  ano_fabricacao?: number | null;
  ano_modelo?: number | null;
  cor?: string | null;
  combustivel?: string | null;
  renavam?: string | null;
  chassi?: string | null;
  valor_fipe?: string | null;
}

function PlacaStep({ onNext, verificarPlacaAction }: PlacaStepProps) {
  const [placa, setPlaca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 7);
    setPlaca(val);
    setErro(null);
  };

  const handleNext = async () => {
    const normalizada = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (!PLACA_RE.test(normalizada)) {
      setErro("Placa inválida. Use o formato ABC1234 ou ABC1D23 (Mercosul).");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      // Verifica se a placa já existe no estoque da empresa
      if (verificarPlacaAction) {
        const duplicada = await verificarPlacaAction(normalizada);
        if (duplicada?.error) {
          setErro(duplicada.error);
          return;
        }
      }

      // TODO: reativar consulta automática por placa quando o provedor estiver configurado
      // const res = await fetch("/api/consulta-placa", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ placa: normalizada }),
      // });
      // const json = await res.json();
      // if (!res.ok) {
      //   if (res.status === 404) { onNext(normalizada, null); return; }
      //   setErro(json?.error ?? "Erro ao consultar a placa.");
      //   return;
      // }
      // onNext(normalizada, json as ApiDadosVeiculo);

      onNext(normalizada, null);
    } catch {
      setErro("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNext();
  };

  const placaExibida =
    placa.length > 3
      ? `${placa.slice(0, 3)}-${placa.slice(3)}`
      : placa;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Breadcrumb */}
        <Link
          href="/veiculos"
          className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
        >
          <IconChevronLeft size={16} />
          Veículos
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden shadow-sm">
          {/* Header azul */}
          <div className="bg-brand-black px-8 py-5">
            <h1 className="font-display text-xl font-semibold text-brand-white">
              Preencha a placa do veículo
            </h1>
            <p className="text-sm text-brand-white/60 mt-1">
              O sistema tentará preencher os dados automaticamente.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 flex flex-col gap-6">
            {/* Input grande da placa */}
            <div>
              <label htmlFor="placa-input" className="sr-only">
                Placa do veículo
              </label>
              <input
                id="placa-input"
                type="text"
                value={placaExibida}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="ABC1234"
                maxLength={8}
                autoFocus
                autoComplete="off"
                className={`w-full rounded-xl border px-6 py-5 text-center text-4xl font-bold font-mono tracking-[0.3em] text-brand-black uppercase placeholder:text-brand-gray-text/30 bg-brand-gray-soft outline-none focus:ring-2 focus:ring-brand-black/10 transition-colors ${
                  erro
                    ? "border-red-300 focus:border-red-400"
                    : "border-brand-gray-mid/60 focus:border-brand-black/40"
                }`}
              />
              {erro && (
                <p role="alert" className="text-xs text-red-500 mt-2 text-center">
                  {erro}
                </p>
              )}
            </div>

            {/* Info */}
            <p className="text-xs text-brand-gray-text text-center">
              Formatos aceitos: <strong>ABC1234</strong> (antigo) ou{" "}
              <strong>ABC1D23</strong> (Mercosul)
            </p>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3">
              <Link
                href="/veiculos"
                className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || placa.length < 7}
                className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <IconSearch size={15} />
                    Próximo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function VeiculoForm({
  dominios,
  salvarAction,
  gerarQrCodeAction,
  verificarPlacaAction,
  initialData,
  qrCodeInicial,
}: VeiculoFormProps) {
  const isEditing = !!initialData;

  // ID da situação "Vendido" derivado dos domínios (estável durante o ciclo de vida)
  const vendidoId = useMemo(
    () => dominios.situacoes.find((s) => s.nome_dominio.toLowerCase() === "vendido")?.id ?? "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const schema = useMemo(() => buildVeiculoSchema(vendidoId), [vendidoId]);

  // Etapa do fluxo de criação
  const [step, setStep] = useState<"placa" | "form">(isEditing ? "form" : "placa");

  // Estado do formulário
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [valorFipe, setValorFipe] = useState<string | null>(null);

  // QR Code
  const [qrCode, setQrCode] = useState<QrCodeInfo | null>(qrCodeInicial ?? null);
  const [showQr, setShowQr] = useState(false);
  const [gerandoQr, setGerandoQr] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      placa: initialData?.placa ?? "",
      renavam: initialData?.renavam ?? "",
      numero_chassi: initialData?.numero_chassi ?? "",
      marca_veiculo_id: initialData?.marca_veiculo_id ?? "",
      modelo_veiculo_id: initialData?.modelo_veiculo_id ?? "",
      combustivel_veiculo_id: initialData?.combustivel_veiculo_id ?? "",
      cambio_veiculo_id: initialData?.cambio_veiculo_id ?? "",
      direcao_veiculo_id: initialData?.direcao_veiculo_id ?? "",
      situacao_veiculo_id: initialData?.situacao_veiculo_id ??
        (dominios.situacoes.find(
          (s) => s.nome_dominio.toLowerCase() === "disponível"
        )?.id ?? ""),
      ano_fabricacao: initialData?.ano_fabricacao,
      ano_modelo: initialData?.ano_modelo,
      cor_veiculo: initialData?.cor_veiculo ?? "",
      quantidade_portas: initialData?.quantidade_portas,
      quilometragem: initialData?.quilometragem,
      vidro_eletrico: initialData?.vidro_eletrico ?? false,
      trava_eletrica: initialData?.trava_eletrica ?? false,
      laudo_aprovado: initialData?.laudo_aprovado ?? false,
      data_compra: initialData?.data_compra ?? "",
      preco_compra: initialData?.preco_compra,
      preco_venda: initialData?.preco_venda ?? undefined,
      data_venda: initialData?.data_venda ?? "",
      data_entrega: initialData?.data_entrega ?? "",
      descricao: initialData?.descricao ?? "",
      quantidade_dias_garantia: initialData?.quantidade_dias_garantia ?? undefined,
    },
  });

  const descricaoValue = watch("descricao") ?? "";
  const placaValue = watch("placa") ?? initialData?.placa ?? "";
  const marcaIdSelecionada = watch("marca_veiculo_id");
  const situacaoSelecionadaId = watch("situacao_veiculo_id");
  const isVendido = !!vendidoId && situacaoSelecionadaId === vendidoId;

  const dataVendaValue = watch("data_venda");
  const diasGarantiaValue = watch("quantidade_dias_garantia");

  const garantiaInfo = useMemo(() => {
    const dias = Number(diasGarantiaValue);
    if (!dataVendaValue || !dias || isNaN(dias) || dias <= 0) return null;
    const [ano, mes, dia] = dataVendaValue.split("-").map(Number);
    const fim = new Date(ano, mes - 1, dia);
    fim.setDate(fim.getDate() + dias);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const diasRestantes = Math.round((fim.getTime() - hoje.getTime()) / 86_400_000);
    const estado: "ativa" | "expirando" | "expirada" =
      diasRestantes < 0 ? "expirada" : diasRestantes <= 30 ? "expirando" : "ativa";
    return { dataFimFormatada: fim.toLocaleDateString("pt-BR"), diasRestantes, estado };
  }, [dataVendaValue, diasGarantiaValue]);

  const modelosFiltrados =
    marcaIdSelecionada
      ? dominios.modelos.filter(
          (m) => m.marca_id === marcaIdSelecionada || m.marca_id === null
        )
      : dominios.modelos;

  // ── Callback da etapa de placa ──────────────────────────────────────────────

  const handlePlacaNext = (
    placa: string,
    dados: {
      configurado?: boolean;
      marca?: string | null;
      modelo?: string | null;
      ano_fabricacao?: number | null;
      ano_modelo?: number | null;
      cor?: string | null;
      combustivel?: string | null;
      renavam?: string | null;
      chassi?: string | null;
      valor_fipe?: string | null;
    } | null
  ) => {
    setValue("placa", placa);

    if (dados?.configurado) {
      if (dados.renavam) setValue("renavam", dados.renavam.replace(/\D/g, ""));
      if (dados.chassi) setValue("numero_chassi", dados.chassi);
      if (dados.ano_fabricacao) setValue("ano_fabricacao", dados.ano_fabricacao);
      if (dados.ano_modelo) setValue("ano_modelo", dados.ano_modelo);
      if (dados.cor) setValue("cor_veiculo", dados.cor);

      // Tenta fazer match dos domínios pelo texto
      if (dados.marca) {
        const id = matchId(dados.marca, dominios.marcas);
        if (id) setValue("marca_veiculo_id", id);
      }
      if (dados.modelo) {
        const id = matchId(dados.modelo, dominios.modelos);
        if (id) setValue("modelo_veiculo_id", id);
      }
      if (dados.combustivel) {
        const id = matchId(dados.combustivel, dominios.combustiveis);
        if (id) setValue("combustivel_veiculo_id", id);
      }
      if (dados.valor_fipe) setValorFipe(dados.valor_fipe);
    }

    setStep("form");
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSaving(true);

    const data: VeiculoFormData = {
      placa: values.placa,
      renavam: values.renavam,
      numero_chassi: values.numero_chassi,
      marca_veiculo_id: values.marca_veiculo_id,
      modelo_veiculo_id: values.modelo_veiculo_id,
      combustivel_veiculo_id: values.combustivel_veiculo_id,
      cambio_veiculo_id: values.cambio_veiculo_id,
      direcao_veiculo_id: values.direcao_veiculo_id,
      situacao_veiculo_id: values.situacao_veiculo_id,
      ano_fabricacao: values.ano_fabricacao,
      ano_modelo: values.ano_modelo,
      cor_veiculo: values.cor_veiculo,
      quantidade_portas: values.quantidade_portas,
      quilometragem: values.quilometragem,
      vidro_eletrico: values.vidro_eletrico,
      trava_eletrica: values.trava_eletrica,
      laudo_aprovado: values.laudo_aprovado,
      data_compra: values.data_compra,
      preco_compra: values.preco_compra,
      preco_venda: values.preco_venda ?? null,
      data_venda: values.data_venda || null,
      data_entrega: values.data_entrega || null,
      descricao: values.descricao?.trim() || null,
      quantidade_dias_garantia: Number.isFinite(values.quantidade_dias_garantia)
        ? (values.quantidade_dias_garantia as number)
        : null,
    };

    const result = await salvarAction(data);
    if (result?.error) {
      setServerError(result.error);
      setIsSaving(false);
    }
  };

  // ── QR Code ─────────────────────────────────────────────────────────────────

  const handleQrCode = async () => {
    if (qrCode) {
      setShowQr(true);
      return;
    }
    if (!gerarQrCodeAction) return;
    setGerandoQr(true);
    setQrError(null);
    const result = await gerarQrCodeAction();
    setGerandoQr(false);
    if ("error" in result) {
      setQrError(result.error);
    } else {
      setQrCode(result);
      setShowQr(true);
    }
  };

  // ── Etapa de placa ──────────────────────────────────────────────────────────

  if (step === "placa") {
    return <PlacaStep onNext={handlePlacaNext} verificarPlacaAction={verificarPlacaAction} />;
  }

  // ── Formulário completo ─────────────────────────────────────────────────────

  const placaFormatada =
    placaValue.length > 3
      ? `${placaValue.slice(0, 3)}-${placaValue.slice(3)}`
      : placaValue;

  return (
    <div className="w-full max-w-5xl" ref={printRef}>
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/veiculos"
          className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors"
        >
          <IconChevronLeft size={16} />
          Veículos
        </Link>
        {/* Ações rápidas (edição) */}
        {isEditing && (
          <div className="flex items-center gap-2 print:hidden">
            {qrError && (
              <p className="text-xs text-red-500">{qrError}</p>
            )}
            <Link
              href={`/veiculos/${initialData!.id}/custos`}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-4 py-2 hover:bg-brand-gray-soft transition-colors"
            >
              <IconWrench size={15} />
              Custos
            </Link>
            <button
              type="button"
              onClick={handleQrCode}
              disabled={gerandoQr}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-4 py-2 hover:bg-brand-gray-soft transition-colors disabled:opacity-50"
            >
              <IconQrCode size={15} />
              {gerandoQr ? "Gerando..." : "QR Code"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-4 py-2 hover:bg-brand-gray-soft transition-colors"
            >
              <IconPrint size={15} />
              Imprimir
            </button>
          </div>
        )}
      </div>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-2">
        {isEditing ? `Editar Veículo — ${placaFormatada}` : "Novo Veículo"}
      </h1>
      {!isEditing && (
        <p className="text-sm text-brand-gray-text mb-8">
          Placa: <span className="font-mono font-semibold text-brand-black">{placaFormatada}</span>
          {valorFipe && (
            <> · Tabela FIPE: <span className="font-semibold text-brand-black">{valorFipe}</span></>
          )}
        </p>
      )}
      {isEditing && valorFipe && (
        <p className="text-sm text-brand-gray-text mb-8">
          Tabela FIPE: <span className="font-semibold text-brand-black">{valorFipe}</span>
        </p>
      )}
      {isEditing && !valorFipe && <div className="mb-8" />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* ── Erro global ──────────────────────────────────────────────────── */}
        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* ── Seção 1: Identificação ───────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
          <SectionHeader title="Identificação" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Placa */}
            <div className="space-y-1.5">
              <label htmlFor="placa" className={labelCls}>
                Placa <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="placa"
                type="text"
                autoComplete="off"
                placeholder="ABC1234"
                maxLength={8}
                {...register("placa")}
                onChange={(e) => {
                  const v = e.target.value
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .toUpperCase()
                    .slice(0, 7);
                  setValue("placa", v, { shouldValidate: true });
                }}
                disabled={isSaving}
                className={`${inputCls(!!errors.placa)} font-mono tracking-widest`}
              />
              <FieldError msg={errors.placa?.message} />
            </div>

            {/* RENAVAM */}
            <div className="space-y-1.5">
              <label htmlFor="renavam" className={labelCls}>
                RENAVAM <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="renavam"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="00000000000"
                maxLength={11}
                {...register("renavam")}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setValue("renavam", v, { shouldValidate: true });
                }}
                disabled={isSaving}
                className={`${inputCls(!!errors.renavam)} font-mono`}
              />
              <FieldError msg={errors.renavam?.message} />
            </div>

            {/* Chassi */}
            <div className="space-y-1.5">
              <label htmlFor="numero_chassi" className={labelCls}>
                Número do Chassi <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="numero_chassi"
                type="text"
                autoComplete="off"
                placeholder="9BWZZZ377VT004251"
                maxLength={20}
                {...register("numero_chassi")}
                onChange={(e) => {
                  setValue("numero_chassi", e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  });
                }}
                disabled={isSaving}
                className={`${inputCls(!!errors.numero_chassi)} font-mono`}
              />
              <FieldError msg={errors.numero_chassi?.message} />
            </div>
          </div>
        </section>

        {/* ── Seção 2: Especificações Técnicas ────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
          <SectionHeader title="Especificações Técnicas" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Marca */}
            <div className="space-y-1.5">
              <label htmlFor="marca_veiculo_id" className={labelCls}>
                Marca <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="marca_veiculo_id"
                {...register("marca_veiculo_id")}
                onChange={(e) => {
                  setValue("marca_veiculo_id", e.target.value, { shouldValidate: true });
                  setValue("modelo_veiculo_id", "");
                }}
                disabled={isSaving}
                className={`${inputCls(!!errors.marca_veiculo_id)} cursor-pointer`}
              >
                <option value="">Selecione a marca</option>
                {dominios.marcas.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.marca_veiculo_id?.message} />
            </div>

            {/* Modelo */}
            <div className="space-y-1.5">
              <label htmlFor="modelo_veiculo_id" className={labelCls}>
                Modelo <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="modelo_veiculo_id"
                {...register("modelo_veiculo_id")}
                disabled={isSaving || !marcaIdSelecionada}
                className={`${inputCls(!!errors.modelo_veiculo_id)} cursor-pointer`}
              >
                <option value="">
                  {marcaIdSelecionada ? "Selecione o modelo" : "Selecione a marca primeiro"}
                </option>
                {modelosFiltrados.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.modelo_veiculo_id?.message} />
            </div>

            {/* Combustível */}
            <div className="space-y-1.5">
              <label htmlFor="combustivel_veiculo_id" className={labelCls}>
                Combustível <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="combustivel_veiculo_id"
                {...register("combustivel_veiculo_id")}
                disabled={isSaving}
                className={`${inputCls(!!errors.combustivel_veiculo_id)} cursor-pointer`}
              >
                <option value="">Selecione o combustível</option>
                {dominios.combustiveis.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.combustivel_veiculo_id?.message} />
            </div>

            {/* Câmbio */}
            <div className="space-y-1.5">
              <label htmlFor="cambio_veiculo_id" className={labelCls}>
                Transmissão <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="cambio_veiculo_id"
                {...register("cambio_veiculo_id")}
                disabled={isSaving}
                className={`${inputCls(!!errors.cambio_veiculo_id)} cursor-pointer`}
              >
                <option value="">Selecione a transmissão</option>
                {dominios.cambios.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.cambio_veiculo_id?.message} />
            </div>

            {/* Direção */}
            <div className="space-y-1.5">
              <label htmlFor="direcao_veiculo_id" className={labelCls}>
                Direção <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="direcao_veiculo_id"
                {...register("direcao_veiculo_id")}
                disabled={isSaving}
                className={`${inputCls(!!errors.direcao_veiculo_id)} cursor-pointer`}
              >
                <option value="">Selecione a direção</option>
                {dominios.direcoes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.direcao_veiculo_id?.message} />
            </div>

            {/* Ano Fabricação */}
            <div className="space-y-1.5">
              <label htmlFor="ano_fabricacao" className={labelCls}>
                Ano de Fabricação <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="ano_fabricacao"
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                placeholder={String(new Date().getFullYear())}
                {...register("ano_fabricacao")}
                disabled={isSaving}
                className={inputCls(!!errors.ano_fabricacao)}
              />
              <FieldError msg={errors.ano_fabricacao?.message} />
            </div>

            {/* Ano Modelo */}
            <div className="space-y-1.5">
              <label htmlFor="ano_modelo" className={labelCls}>
                Ano do Modelo <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="ano_modelo"
                type="number"
                min={1900}
                max={new Date().getFullYear() + 2}
                placeholder={String(new Date().getFullYear())}
                {...register("ano_modelo")}
                disabled={isSaving}
                className={inputCls(!!errors.ano_modelo)}
              />
              <FieldError msg={errors.ano_modelo?.message} />
            </div>

            {/* Cor */}
            <div className="space-y-1.5">
              <label htmlFor="cor_veiculo" className={labelCls}>
                Cor <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="cor_veiculo"
                type="text"
                placeholder="Ex: Preto"
                maxLength={20}
                {...register("cor_veiculo")}
                disabled={isSaving}
                className={inputCls(!!errors.cor_veiculo)}
              />
              <FieldError msg={errors.cor_veiculo?.message} />
            </div>

            {/* Quantidade de portas */}
            <div className="space-y-1.5">
              <label htmlFor="quantidade_portas" className={labelCls}>
                N° de Portas <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="quantidade_portas"
                type="number"
                min={1}
                max={10}
                placeholder="4"
                {...register("quantidade_portas")}
                disabled={isSaving}
                className={inputCls(!!errors.quantidade_portas)}
              />
              <FieldError msg={errors.quantidade_portas?.message} />
            </div>

            {/* Quilometragem */}
            <div className="space-y-1.5">
              <label htmlFor="quilometragem" className={labelCls}>
                Quilometragem <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="quilometragem"
                type="number"
                min={0}
                placeholder="0"
                {...register("quilometragem")}
                disabled={isSaving}
                className={inputCls(!!errors.quilometragem)}
              />
              <FieldError msg={errors.quilometragem?.message} />
            </div>
          </div>

          {/* Opcionais booleanos */}
          <div className="mt-6 flex flex-wrap gap-6">
            {(
              [
                { name: "vidro_eletrico" as const, label: "Vidro Elétrico" },
                { name: "trava_eletrica" as const, label: "Trava Elétrica" },
                { name: "laudo_aprovado" as const, label: "Laudo Aprovado" },
              ] as { name: keyof FormValues; label: string }[]
            ).map(({ name, label }) => (
              <label
                key={name}
                className="inline-flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  {...register(name as "vidro_eletrico" | "trava_eletrica" | "laudo_aprovado")}
                  disabled={isSaving}
                  className="w-4 h-4 rounded border-brand-gray-mid/60 text-brand-black focus:ring-brand-black/10 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-brand-black">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* ── Seção 3: Dados Comerciais ────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
          <SectionHeader title="Dados Comerciais" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Situação */}
            <div className="space-y-1.5">
              <label htmlFor="situacao_veiculo_id" className={labelCls}>
                Situação <span className="text-red-500 font-normal">*</span>
              </label>
              <select
                id="situacao_veiculo_id"
                {...register("situacao_veiculo_id")}
                disabled={isSaving || !isEditing}
                className={`${inputCls(!!errors.situacao_veiculo_id)} ${!isEditing ? "bg-brand-gray-soft text-brand-gray-text cursor-not-allowed" : "cursor-pointer"}`}
              >
                <option value="">Selecione a situação</option>
                {dominios.situacoes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nome_dominio}
                  </option>
                ))}
              </select>
              {!isEditing && (
                <p className="text-xs text-brand-gray-text/70">
                  Todo veículo entra no estoque como <strong>Disponível</strong>.
                </p>
              )}
              <FieldError msg={errors.situacao_veiculo_id?.message} />
            </div>

            {/* Data de Compra */}
            <div className="space-y-1.5">
              <label htmlFor="data_compra" className={labelCls}>
                Data de Compra <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="data_compra"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("data_compra")}
                disabled={isSaving}
                className={inputCls(!!errors.data_compra)}
              />
              <FieldError msg={errors.data_compra?.message} />
            </div>

            {/* Preço de Compra */}
            <div className="space-y-1.5">
              <label htmlFor="preco_compra" className={labelCls}>
                Preço de Compra (R$) <span className="text-red-500 font-normal">*</span>
              </label>
              <Controller
                control={control}
                name="preco_compra"
                render={({ field }) => (
                  <CurrencyInput
                    id="preco_compra"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isSaving}
                    hasError={!!errors.preco_compra}
                  />
                )}
              />
              <FieldError msg={errors.preco_compra?.message} />
            </div>

            {/* Preço de Venda — apenas quando situação = Vendido */}
            {isEditing && isVendido && (
              <div className="space-y-1.5">
                <label htmlFor="preco_venda" className={labelCls}>
                  Preço de Venda (R$) <span className="text-red-500 font-normal">*</span>
                </label>
                <Controller
                  control={control}
                  name="preco_venda"
                  render={({ field }) => (
                    <CurrencyInput
                      id="preco_venda"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isSaving}
                      hasError={!!errors.preco_venda}
                    />
                  )}
                />
                <FieldError msg={errors.preco_venda?.message} />
              </div>
            )}

            {/* Data de Venda — apenas quando situação = Vendido */}
            {isEditing && isVendido && (
              <div className="space-y-1.5">
                <label htmlFor="data_venda" className={labelCls}>
                  Data de Venda <span className="text-red-500 font-normal">*</span>
                </label>
                <input
                  id="data_venda"
                  type="date"
                  {...register("data_venda", {
                    onChange(e) {
                      const novaData: string = e.target.value;
                      const dataEntregaAtual = watch("data_entrega") ?? "";
                      if (!dataEntregaAtual || dataEntregaAtual < novaData) {
                        setValue("data_entrega", novaData, { shouldValidate: true });
                      }
                    },
                  })}
                  disabled={isSaving}
                  className={inputCls(!!errors.data_venda)}
                />
                <FieldError msg={errors.data_venda?.message} />
              </div>
            )}

            {/* Data de Entrega — apenas quando situação = Vendido */}
            {isEditing && isVendido && (
              <div className="space-y-1.5">
                <label htmlFor="data_entrega" className={labelCls}>
                  Data de Entrega
                </label>
                <input
                  id="data_entrega"
                  type="date"
                  min={dataVendaValue || undefined}
                  {...register("data_entrega")}
                  disabled={isSaving}
                  className={inputCls(!!errors.data_entrega)}
                />
                <FieldError msg={errors.data_entrega?.message} />
              </div>
            )}

            {/* Dias de Garantia — apenas quando situação = Vendido */}
            {isEditing && isVendido && (
              <div className="space-y-1.5">
                <label htmlFor="quantidade_dias_garantia" className={labelCls}>
                  Dias de Garantia
                </label>
                <input
                  id="quantidade_dias_garantia"
                  type="number"
                  min={0}
                  max={3650}
                  placeholder="90"
                  {...register("quantidade_dias_garantia", {
                    setValueAs: (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
                  })}
                  disabled={isSaving}
                  className={inputCls(!!errors.quantidade_dias_garantia)}
                />
                <FieldError msg={errors.quantidade_dias_garantia?.message} />
              </div>
            )}

            {/* Data Fim da Garantia — calculada, somente leitura */}
            {isEditing && isVendido && (
              <div className="space-y-1.5">
                <label className={labelCls}>Data Fim da Garantia</label>
                <div
                  className={`${inputCls(false)} bg-brand-gray-soft text-brand-gray-text cursor-default select-none`}
                >
                  {garantiaInfo?.dataFimFormatada ?? "—"}
                </div>
                <p className="text-xs text-brand-gray-text/70">Calculado automaticamente.</p>
              </div>
            )}
          </div>

          {/* Banner de status da garantia */}
          {isEditing && isVendido && garantiaInfo && (
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                garantiaInfo.estado === "expirada"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : garantiaInfo.estado === "expirando"
                  ? "bg-status-warning-bg border-status-warning-border text-status-warning-text"
                  : "bg-status-success-bg border-status-success-border text-status-success-text"
              }`}
            >
              {garantiaInfo.estado === "expirada"
                ? `Garantia expirada há ${Math.abs(garantiaInfo.diasRestantes)} dia${
                    Math.abs(garantiaInfo.diasRestantes) !== 1 ? "s" : ""
                  } — venceu em ${garantiaInfo.dataFimFormatada}`
                : garantiaInfo.estado === "expirando"
                ? garantiaInfo.diasRestantes === 0
                  ? `Garantia expira hoje (${garantiaInfo.dataFimFormatada})`
                  : `Garantia expira em ${garantiaInfo.diasRestantes} dia${
                      garantiaInfo.diasRestantes !== 1 ? "s" : ""
                    } — ${garantiaInfo.dataFimFormatada}`
                : `Garantia ativa — vence em ${garantiaInfo.diasRestantes} dias (${garantiaInfo.dataFimFormatada})`}
            </div>
          )}
        </section>

        {/* ── Seção 4: Observações ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
          <SectionHeader title="Observações" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="descricao" className={labelCls}>
                Comentários
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descricaoValue.length > 900
                    ? descricaoValue.length > 1000
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {descricaoValue.length}/1000
              </span>
            </div>
            <textarea
              id="descricao"
              rows={4}
              placeholder="Digite qualquer nota adicional sobre o veículo..."
              {...register("descricao")}
              disabled={isSaving}
              className={`${inputCls(!!errors.descricao)} resize-y`}
            />
            <FieldError msg={errors.descricao?.message} />
          </div>
        </section>

        {/* ── Barra de ações ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <Link
            href="/veiculos"
            className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-6 py-2.5 hover:bg-brand-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>

      {/* ── Modal QR Code ─────────────────────────────────────────────────── */}
      {showQr && qrCode && (
        <QrCodeModal
          qrCode={qrCode}
          placa={placaFormatada}
          onClose={() => setShowQr(false)}
        />
      )}
    </div>
  );
}
