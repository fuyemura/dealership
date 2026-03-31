"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult, ManutencaoFormData } from "../actions";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface VeiculoInfo {
  id: string;
  placa: string;
  preco_compra: number;
  marca: string;
  modelo: string;
}

export interface Manutencao {
  id: string;
  custo_id: string;
  nome_custo: string;
  situacao_manutencao_id: string;
  nome_situacao: string;
  valor_manutencao: number;
  obs_manutencao: string | null;
  data_conclusao: string;
}

export interface CustoCatalogo {
  id: string;
  nome_custo: string;
}

export interface SituacaoDominio {
  id: string;
  nome_dominio: string;
}

interface CustosVeiculoProps {
  veiculo: VeiculoInfo;
  manutencoes: Manutencao[];
  custosCatalogo: CustoCatalogo[];
  situacoes: SituacaoDominio[];
  criarAction: (data: ManutencaoFormData) => Promise<ActionResult>;
  atualizarAction: (id: string, data: ManutencaoFormData) => Promise<ActionResult>;
  excluirAction: (id: string) => Promise<ActionResult>;
}

// ─── Schema Zod ───────────────────────────────────────────────────────────────

const schema = z.object({
  custo_id: z.string().min(1, "Selecione o tipo de custo."),
  valor_manutencao: z.coerce
    .number({ invalid_type_error: "Informe um valor válido." })
    .positive("Informe um valor maior que zero."),
  data_conclusao: z.string().min(1, "Informe a data."),
  situacao_manutencao_id: z.string().min(1, "Selecione a situação."),
  obs_manutencao: z
    .string()
    .max(500, "Máximo 500 caracteres.")
    .optional()
    .nullable()
    .transform((v) => v ?? ""),
});

type FormValues = z.infer<typeof schema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatData(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

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

// ─── Badge de situação ────────────────────────────────────────────────────────

function BadgeSituacao({ situacao }: { situacao: string }) {
  const slug = situacao.toLowerCase().replace(/\s/g, "_");

  let cls =
    "bg-brand-gray-soft text-brand-gray-text border border-brand-gray-mid/40";
  if (slug === "concluida" || slug === "concluída") {
    cls =
      "bg-status-success-bg text-status-success-text border border-status-success-border";
  } else if (slug === "em_andamento") {
    cls =
      "bg-status-warning-bg text-status-warning-text border border-status-warning-border";
  } else if (slug === "cancelada") {
    cls = "bg-red-50 text-red-600 border border-red-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {situacao}
    </span>
  );
}

// ─── Ícones inline ────────────────────────────────────────────────────────────

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconPlus({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconPencil({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function IconAlertCircle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── Formulário de manutenção (add / edit) ────────────────────────────────────

interface ManutencaoFormPanelProps {
  initialData?: Manutencao;
  custosCatalogo: CustoCatalogo[];
  situacoes: SituacaoDominio[];
  onSave: (data: ManutencaoFormData) => Promise<ActionResult>;
  onClose: () => void;
}

function ManutencaoFormPanel({
  initialData,
  custosCatalogo,
  situacoes,
  onSave,
  onClose,
}: ManutencaoFormPanelProps) {
  const isEditing = !!initialData;
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      custo_id: initialData?.custo_id ?? "",
      valor_manutencao: initialData?.valor_manutencao ?? (undefined as unknown as number),
      data_conclusao: initialData?.data_conclusao ?? "",
      situacao_manutencao_id: initialData?.situacao_manutencao_id ?? "",
      obs_manutencao: initialData?.obs_manutencao ?? "",
    },
  });

  const obsValue = watch("obs_manutencao") ?? "";

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await onSave({
        custo_id: values.custo_id,
        valor_manutencao: values.valor_manutencao,
        data_conclusao: values.data_conclusao,
        situacao_manutencao_id: values.situacao_manutencao_id,
        obs_manutencao: values.obs_manutencao?.trim() || null,
      });
      if (result?.error) {
        setServerError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="bg-brand-gray-soft/60 rounded-xl border border-brand-gray-mid/40 p-5">
      {/* Cabeçalho do painel */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-brand-black">
          {isEditing ? "Editar custo" : "Novo custo de manutenção"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="text-brand-gray-text hover:text-brand-black transition-colors p-1 rounded-lg hover:bg-brand-gray-mid/20"
          aria-label="Fechar formulário"
        >
          <IconX size={14} />
        </button>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          <IconAlertCircle size={14} />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tipo de custo */}
          <div className="space-y-1.5 lg:col-span-1">
            <label className={labelCls}>
              Tipo de Custo <span className="text-red-500 font-normal">*</span>
            </label>
            {custosCatalogo.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                Nenhum tipo cadastrado.{" "}
                <Link
                  href="/configuracoes/custos/novo"
                  className="underline font-medium"
                >
                  Cadastrar agora
                </Link>
              </div>
            ) : (
              <>
                <select
                  {...register("custo_id")}
                  disabled={isPending}
                  className={`${inputCls(!!errors.custo_id)} cursor-pointer`}
                >
                  <option value="">Selecione...</option>
                  {custosCatalogo.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome_custo}
                    </option>
                  ))}
                </select>
                <FieldError msg={errors.custo_id?.message} />
              </>
            )}
          </div>

          {/* Valor */}
          <div className="space-y-1.5">
            <label className={labelCls}>
              Valor (R$) <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="0,00"
              {...register("valor_manutencao")}
              disabled={isPending}
              className={inputCls(!!errors.valor_manutencao)}
            />
            <FieldError msg={errors.valor_manutencao?.message} />
          </div>

          {/* Data */}
          <div className="space-y-1.5">
            <label className={labelCls}>
              Data <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              type="date"
              {...register("data_conclusao")}
              disabled={isPending}
              className={inputCls(!!errors.data_conclusao)}
            />
            <FieldError msg={errors.data_conclusao?.message} />
          </div>

          {/* Situação */}
          <div className="space-y-1.5">
            <label className={labelCls}>
              Situação <span className="text-red-500 font-normal">*</span>
            </label>
            <select
              {...register("situacao_manutencao_id")}
              disabled={isPending}
              className={`${inputCls(!!errors.situacao_manutencao_id)} cursor-pointer`}
            >
              <option value="">Selecione...</option>
              {situacoes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome_dominio}
                </option>
              ))}
            </select>
            <FieldError msg={errors.situacao_manutencao_id?.message} />
          </div>

          {/* Observações — full width */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-4">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Observações</label>
              <span
                className={`text-xs tabular-nums ${
                  (obsValue?.length ?? 0) > 450
                    ? (obsValue?.length ?? 0) > 500
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {obsValue?.length ?? 0}/500
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="Detalhes sobre o serviço realizado..."
              {...register("obs_manutencao")}
              disabled={isPending}
              className={`${inputCls(!!errors.obs_manutencao)} resize-none`}
            />
            <FieldError msg={errors.obs_manutencao?.message} />
          </div>
        </div>

        {/* Ações do formulário */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2 hover:bg-brand-gray-soft transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || custosCatalogo.length === 0}
            className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2 hover:bg-brand-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Linha de manutenção ──────────────────────────────────────────────────────

interface ManutencaoRowProps {
  item: Manutencao;
  custosCatalogo: CustoCatalogo[];
  situacoes: SituacaoDominio[];
  editingId: string | null;
  deletingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, data: ManutencaoFormData) => Promise<ActionResult>;
  onDeleteRequest: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
  isDeleting: boolean;
}

function ManutencaoRow({
  item,
  custosCatalogo,
  situacoes,
  editingId,
  deletingId,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  isDeleting,
}: ManutencaoRowProps) {
  const isBeingEdited = editingId === item.id;
  const isBeingDeleted = deletingId === item.id;

  if (isBeingEdited) {
    return (
      <li className="p-4">
        <ManutencaoFormPanel
          initialData={item}
          custosCatalogo={custosCatalogo}
          situacoes={situacoes}
          onSave={(data) => onSaveEdit(item.id, data)}
          onClose={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li className="group">
      {/* Linha principal */}
      <div className="flex items-start gap-3 px-5 py-4 hover:bg-brand-gray-soft/50 transition-colors">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-brand-black truncate">
              {item.nome_custo}
            </span>
            <BadgeSituacao situacao={item.nome_situacao} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
            <span className="text-sm font-mono font-semibold text-brand-black">
              {formatBRL(item.valor_manutencao)}
            </span>
            <span className="text-xs text-brand-gray-text">
              {formatData(item.data_conclusao)}
            </span>
            {item.obs_manutencao && (
              <span className="text-xs text-brand-gray-text italic truncate max-w-xs">
                {item.obs_manutencao}
              </span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(item.id)}
            className="p-2 rounded-lg text-brand-gray-text hover:text-brand-black hover:bg-brand-gray-mid/20 transition-colors"
            aria-label={`Editar ${item.nome_custo}`}
          >
            <IconPencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(item.id)}
            className="p-2 rounded-lg text-brand-gray-text hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label={`Excluir ${item.nome_custo}`}
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      {isBeingDeleted && (
        <div className="flex items-center justify-between gap-4 px-5 py-3 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-700 font-medium">
            Confirma a exclusão de <strong>{item.nome_custo}</strong>?
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onDeleteCancel}
              disabled={isDeleting}
              className="rounded-full border border-brand-gray-mid text-brand-black text-xs font-medium px-4 py-1.5 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onDeleteConfirm(item.id)}
              disabled={isDeleting}
              className="rounded-full bg-red-600 text-white text-xs font-medium px-4 py-1.5 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// ─── Resumo financeiro ────────────────────────────────────────────────────────

interface ResumoFinanceiroProps {
  precoCompra: number;
  totalConcluido: number;
  totalPendente: number;
}

function ResumoFinanceiro({
  precoCompra,
  totalConcluido,
  totalPendente,
}: ResumoFinanceiroProps) {
  const totalInvestido = precoCompra + totalConcluido;

  return (
    <div className="mb-6">
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Preço de Compra */}
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-2">
            Custo de Aquisição
          </p>
          <p className="text-2xl font-bold font-mono text-brand-black">
            {formatBRL(precoCompra)}
          </p>
          <p className="text-xs text-brand-gray-text mt-1">Preço de compra do veículo</p>
        </div>

        {/* Manutenções concluídas */}
        <div className="bg-white rounded-2xl border border-brand-gray-mid/30 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-text mb-2">
            Manutenções Concluídas
          </p>
          <p className="text-2xl font-bold font-mono text-status-success-text">
            {formatBRL(totalConcluido)}
          </p>
          <p className="text-xs text-brand-gray-text mt-1">
            Valor total dos serviços confirmados
          </p>
        </div>

        {/* Total investido — destaque */}
        <div className="bg-brand-black rounded-2xl px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-white/60 mb-2">
            Total Investido
          </p>
          <p className="text-2xl font-bold font-mono text-brand-white">
            {formatBRL(totalInvestido)}
          </p>
          <p className="text-xs text-brand-white/50 mt-1">
            Aquisição + manutenções concluídas
          </p>
        </div>
      </div>

      {/* Pendências */ }
      {totalPendente > 0 && (
        <div className="flex items-center gap-2 mt-3 px-4 py-2.5 bg-status-warning-bg border border-status-warning-border rounded-xl">
          <IconAlertCircle size={14} />
          <p className="text-xs text-status-warning-text">
            <span className="font-semibold">{formatBRL(totalPendente)}</span> em
            manutenções pendentes ou em andamento ainda não estão incluídos no
            total investido.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function CustosVeiculo({
  veiculo,
  manutencoes,
  custosCatalogo,
  situacoes,
  criarAction,
  atualizarAction,
  excluirAction,
}: CustosVeiculoProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const placaFormatada =
    veiculo.placa.length > 3
      ? `${veiculo.placa.slice(0, 3)}-${veiculo.placa.slice(3)}`
      : veiculo.placa;

  // ── Cálculo do resumo financeiro ──────────────────────────────────────────
  const totalConcluido = manutencoes
    .filter((m) => {
      const s = m.nome_situacao.toLowerCase().replace(/\s/g, "_");
      return s === "concluida" || s === "concluída";
    })
    .reduce((acc, m) => acc + m.valor_manutencao, 0);

  const totalPendente = manutencoes
    .filter((m) => {
      const s = m.nome_situacao.toLowerCase().replace(/\s/g, "_");
      return s === "pendente" || s === "em_andamento";
    })
    .reduce((acc, m) => acc + m.valor_manutencao, 0);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleShowAdd = () => {
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleCloseAdd = () => {
    setShowAddForm(false);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    router.refresh();
  };

  const handleEdit = (id: string) => {
    setShowAddForm(false);
    setDeletingId(null);
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (
    id: string,
    data: ManutencaoFormData
  ): Promise<ActionResult> => {
    const result = await atualizarAction(id, data);
    if (!result?.error) {
      setEditingId(null);
      router.refresh();
    }
    return result;
  };

  const handleDeleteRequest = (id: string) => {
    setEditingId(null);
    setShowAddForm(false);
    setDeleteError(null);
    setDeletingId(id);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await excluirAction(id);
      if (result?.error) {
        setDeleteError(result.error);
        setDeletingId(null);
      } else {
        setDeletingId(null);
        router.refresh();
      }
    });
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
  };

  const handleAddSave = async (
    data: ManutencaoFormData
  ): Promise<ActionResult> => {
    const result = await criarAction(data);
    if (!result?.error) {
      handleAddSuccess();
    }
    return result;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-5xl">
      {/* Breadcrumb */}
      <nav aria-label="Navegação" className="flex items-center gap-1 text-sm mb-6">
        <Link
          href="/veiculos"
          className="text-brand-gray-text hover:text-brand-black transition-colors"
        >
          Veículos
        </Link>
        <span className="text-brand-gray-text/40 mx-1">/</span>
        <Link
          href={`/veiculos/${veiculo.id}`}
          className="text-brand-gray-text hover:text-brand-black transition-colors flex items-center gap-1"
        >
          <span className="font-mono font-medium">{placaFormatada}</span>
        </Link>
        <span className="text-brand-gray-text/40 mx-1">/</span>
        <span className="text-brand-black font-medium">Custos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Custos de Manutenção
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            <span className="font-mono font-semibold text-brand-black">
              {placaFormatada}
            </span>
            {(veiculo.marca || veiculo.modelo) && (
              <>
                {" "}
                ·{" "}
                <span>
                  {veiculo.marca} {veiculo.modelo}
                </span>
              </>
            )}
          </p>
        </div>
        <Link
          href={`/veiculos/${veiculo.id}`}
          className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors"
        >
          <IconChevronLeft size={15} />
          Voltar ao veículo
        </Link>
      </div>

      {/* Resumo financeiro */}
      <ResumoFinanceiro
        precoCompra={veiculo.preco_compra}
        totalConcluido={totalConcluido}
        totalPendente={totalPendente}
      />

      {/* Erro de exclusão global */}
      {deleteError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          <IconAlertCircle size={14} />
          {deleteError}
        </div>
      )}

      {/* Painel de manutenções */}
      <div className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">
        {/* Cabeçalho do painel */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-mid/20">
          <div>
            <h2 className="text-sm font-semibold text-brand-black">
              Histórico de Manutenções
            </h2>
            {manutencoes.length > 0 && (
              <p className="text-xs text-brand-gray-text mt-0.5">
                {manutencoes.length}{" "}
                {manutencoes.length === 1
                  ? "registro"
                  : "registros"}{" "}
                · total{" "}
                <span className="font-mono font-semibold text-brand-black">
                  {formatBRL(
                    manutencoes.reduce((a, m) => a + m.valor_manutencao, 0)
                  )}
                </span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleShowAdd}
            disabled={showAddForm || editingId !== null}
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-4 py-2 hover:bg-brand-black/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <IconPlus size={14} />
            Adicionar Custo
          </button>
        </div>

        {/* Formulário de adição */}
        {showAddForm && (
          <div className="p-5 border-b border-brand-gray-mid/20">
            <ManutencaoFormPanel
              custosCatalogo={custosCatalogo}
              situacoes={situacoes}
              onSave={handleAddSave}
              onClose={handleCloseAdd}
            />
          </div>
        )}

        {/* Lista de manutenções */}
        {manutencoes.length === 0 && !showAddForm ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft border border-brand-gray-mid/30 flex items-center justify-center text-brand-gray-text">
              <IconWrench size={22} />
            </div>
            <p className="text-sm font-medium text-brand-black">
              Nenhum custo registrado
            </p>
            <p className="text-xs text-brand-gray-text max-w-xs">
              Registre os custos de manutenção para calcular o preço mínimo de
              venda deste veículo.
            </p>
            {custosCatalogo.length === 0 ? (
              <Link
                href="/configuracoes/custos/novo"
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2 hover:bg-brand-gray-soft transition-colors"
              >
                <IconPlus size={13} />
                Cadastrar tipos de custo
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleShowAdd}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2 hover:bg-brand-black/85 transition-colors"
              >
                <IconPlus size={13} />
                Adicionar primeiro custo
              </button>
            )}
          </div>
        ) : (
          <ul
            role="list"
            className="divide-y divide-brand-gray-mid/20"
          >
            {manutencoes.map((item) => (
              <ManutencaoRow
                key={item.id}
                item={item}
                custosCatalogo={custosCatalogo}
                situacoes={situacoes}
                editingId={editingId}
                deletingId={deletingId}
                onEdit={handleEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onDeleteRequest={handleDeleteRequest}
                onDeleteConfirm={handleDeleteConfirm}
                onDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Rodapé informativo */}
      {manutencoes.length > 0 && (
        <p className="text-xs text-brand-gray-text mt-4 text-center">
          Apenas manutenções com situação{" "}
          <strong>Concluída</strong> são somadas ao Total Investido.
        </p>
      )}
    </div>
  );
}
