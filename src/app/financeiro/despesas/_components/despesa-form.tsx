"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult, DespesaFormData } from "../actions";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  categoria_id: z.string().min(1, "Selecione a categoria."),
  descricao: z
    .string()
    .min(1, "A descrição é obrigatória.")
    .max(255, "Máximo de 255 caracteres."),
  valor: z
    .string()
    .min(1, "O valor é obrigatório.")
    .refine((v) => {
      const n = parseFloat(v.replace(",", "."));
      return !isNaN(n) && n > 0;
    }, "Informe um valor maior que zero."),
  data_despesa: z.string().min(1, "A data é obrigatória."),
  recorrente: z.boolean(),
  observacao: z.string().max(500, "Máximo de 500 caracteres.").optional().transform((v) => v ?? ""),
});

type FormValues = z.infer<typeof schema>;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Categoria {
  id: string;
  nome: string;
}

export type SaveFn   = (data: DespesaFormData) => Promise<ActionResult>;
export type DeleteFn = () => Promise<ActionResult>;

interface DespesaFormProps {
  categorias:    Categoria[];
  saveAction:    SaveFn;
  deleteAction?: DeleteFn;
  initialData?:  {
    categoria_id: string;
    descricao:    string;
    valor:        number;
    data_despesa: string;
    recorrente:   boolean;
    observacao:   string | null;
  };
  isAdmin?: boolean;
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValorInput(raw: string): string {
  // Permite apenas dígitos e vírgula (separador decimal BR)
  let clean = raw.replace(/[^\d,]/g, "");
  // Permite apenas uma vírgula
  const firstComma = clean.indexOf(",");
  if (firstComma !== -1) {
    clean =
      clean.slice(0, firstComma + 1) +
      clean.slice(firstComma + 1).replace(/,/g, "");
    // Limita a 2 casas decimais
    const dec = clean.slice(firstComma + 1);
    if (dec.length > 2) clean = clean.slice(0, firstComma + 3);
  }
  return clean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function DespesaForm({
  categorias,
  saveAction,
  deleteAction,
  initialData,
  isAdmin = false,
}: DespesaFormProps) {
  const isEditing = !!initialData;

  const [serverError, setServerError]           = useState<string | null>(null);
  const [deleteError, setDeleteError]           = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving]                 = useState(false);
  const [isDeleting, setIsDeleting]             = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoria_id: initialData?.categoria_id ?? "",
      descricao:    initialData?.descricao    ?? "",
      valor:        initialData?.valor        != null
                      ? String(initialData.valor.toFixed(2)).replace(".", ",")
                      : "",
      data_despesa: initialData?.data_despesa ?? "",
      recorrente:   initialData?.recorrente   ?? false,
      observacao:   initialData?.observacao   ?? "",
    },
  });

  const descricaoValue  = watch("descricao")  ?? "";
  const observacaoValue = watch("observacao") ?? "";

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSaving(true);

    const valorNumerico = parseFloat(values.valor.replace(",", "."));

    const result = await saveAction({
      categoria_id: values.categoria_id,
      descricao:    values.descricao,
      valor:        valorNumerico,
      data_despesa: values.data_despesa,
      recorrente:   values.recorrente,
      observacao:   values.observacao || null,
    });

    if (result?.error) {
      setServerError(result.error);
      setIsSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteAction) return;
    setDeleteError(null);
    setIsDeleting(true);
    const result = await deleteAction();
    if (result?.error) {
      setDeleteError(result.error);
      setConfirmingDelete(false);
      setIsDeleting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl">
      {/* Breadcrumb */}
      <Link
        href="/financeiro/despesas"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Despesas
      </Link>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
        {isEditing ? "Editar Despesa" : "Nova Despesa"}
      </h1>

      {/* Card */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Categoria */}
          <div className="space-y-1.5">
            <label
              htmlFor="categoria_id"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
            >
              Categoria <span className="text-red-500 font-normal">*</span>
            </label>
            <select
              id="categoria_id"
              aria-invalid={!!errors.categoria_id}
              aria-describedby={errors.categoria_id ? "categoria_id-error" : undefined}
              {...register("categoria_id")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black bg-white outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.categoria_id
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            >
              <option value="">Selecione…</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            {errors.categoria_id && (
              <p id="categoria_id-error" role="alert" className="text-xs text-red-500">
                {errors.categoria_id.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="descricao"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Descrição <span className="text-red-500 font-normal">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descricaoValue.length > 240
                    ? descricaoValue.length > 255
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {descricaoValue.length}/255
              </span>
            </div>
            <input
              id="descricao"
              type="text"
              autoComplete="off"
              placeholder="Ex: Conta de luz — Abril/2026"
              aria-invalid={!!errors.descricao}
              aria-describedby={errors.descricao ? "descricao-error" : undefined}
              {...register("descricao")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.descricao
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.descricao && (
              <p id="descricao-error" role="alert" className="text-xs text-red-500">
                {errors.descricao.message}
              </p>
            )}
          </div>

          {/* Valor + Data — grid 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Valor */}
            <div className="space-y-1.5">
              <label
                htmlFor="valor"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Valor (R$) <span className="text-red-500 font-normal">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-brand-gray-text pointer-events-none select-none">
                  R$
                </span>
                <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="valor"
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      aria-invalid={!!errors.valor}
                      aria-describedby={errors.valor ? "valor-error" : undefined}
                      value={field.value}
                      onChange={(e) => field.onChange(formatValorInput(e.target.value))}
                      className={`w-full rounded-xl border pl-9 pr-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                        errors.valor
                          ? "border-red-300 focus:border-red-400"
                          : "border-brand-gray-mid/60 focus:border-brand-black/40"
                      }`}
                    />
                  )}
                />
              </div>
              {errors.valor && (
                <p id="valor-error" role="alert" className="text-xs text-red-500">
                  {errors.valor.message}
                </p>
              )}
            </div>

            {/* Data */}
            <div className="space-y-1.5">
              <label
                htmlFor="data_despesa"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Data da Despesa <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="data_despesa"
                type="date"
                aria-invalid={!!errors.data_despesa}
                aria-describedby={errors.data_despesa ? "data_despesa-error" : undefined}
                {...register("data_despesa")}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                  errors.data_despesa
                    ? "border-red-300 focus:border-red-400"
                    : "border-brand-gray-mid/60 focus:border-brand-black/40"
                }`}
              />
              {errors.data_despesa && (
                <p id="data_despesa-error" role="alert" className="text-xs text-red-500">
                  {errors.data_despesa.message}
                </p>
              )}
            </div>
          </div>

          {/* Recorrente */}
          <div className="flex items-start gap-3">
            <Controller
              name="recorrente"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative mt-0.5 w-10 h-5 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black/30 ${
                    field.value ? "bg-brand-black" : "bg-brand-gray-mid"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      field.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              )}
            />
            <div>
              <p className="text-sm font-medium text-brand-black leading-none">
                Despesa recorrente
              </p>
              <p className="text-xs text-brand-gray-text mt-1">
                Marque para poder replicar esta despesa facilmente nos meses seguintes.
              </p>
            </div>
          </div>

          {/* Observação */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="observacao"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Observação{" "}
                <span className="text-xs font-normal normal-case tracking-normal text-brand-gray-text/50">
                  (opcional)
                </span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  observacaoValue.length > 470
                    ? observacaoValue.length > 500
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {observacaoValue.length}/500
              </span>
            </div>
            <textarea
              id="observacao"
              rows={3}
              placeholder="Observações adicionais sobre este lançamento…"
              {...register("observacao")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 resize-none ${
                errors.observacao
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.observacao && (
              <p role="alert" className="text-xs text-red-500">
                {errors.observacao.message}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/financeiro/despesas"
              className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Salvando…"
                : isEditing
                ? "Salvar alterações"
                : "Registrar despesa"}
            </button>
          </div>
        </form>
      </section>

      {/* Zona de perigo */}
      {isEditing && isAdmin && deleteAction && (
        <section className="mt-6 bg-white rounded-2xl border border-red-100 p-6 sm:p-8">
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Zona de perigo
          </h2>
          <p className="text-sm text-brand-gray-text mb-5">
            Excluir este lançamento é uma ação permanente e não pode ser desfeita.
          </p>

          {deleteError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}

          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2.5 hover:bg-red-50 transition-colors"
            >
              Excluir despesa
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full bg-red-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Excluindo…" : "Confirmar exclusão"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
