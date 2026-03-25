"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult } from "../actions";

// ─── Schema de validação ──────────────────────────────────────────────────────

const schema = z.object({
  nome_custo: z
    .string()
    .min(1, "O nome do custo é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  descricao: z
    .string()
    .max(500, "Máximo de 500 caracteres.")
    .optional()
    .transform((v) => v ?? ""),
});

type FormValues = z.infer<typeof schema>;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type SaveFn = (
  nomeCusto: string,
  descricao: string | null
) => Promise<ActionResult>;

export type DeleteFn = () => Promise<ActionResult>;

interface CustoFormProps {
  saveAction: SaveFn;
  deleteAction?: DeleteFn;
  initialData?: { nome_custo: string; descricao: string | null };
  isAdmin?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function CustoForm({
  saveAction,
  deleteAction,
  initialData,
  isAdmin = false,
}: CustoFormProps) {
  const isEditing = !!initialData;

  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome_custo: initialData?.nome_custo ?? "",
      descricao: initialData?.descricao ?? "",
    },
  });

  const nomeCustoValue = watch("nome_custo") ?? "";
  const descricaoValue = watch("descricao") ?? "";

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSaving(true);
    const result = await saveAction(
      values.nome_custo,
      values.descricao || null
    );
    // Só chega aqui se a action não redirecionou (i.e., retornou um erro)
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
        href="/configuracoes/custos"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Tipos de Custo
      </Link>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
        {isEditing ? "Editar Tipo de Custo" : "Novo Tipo de Custo"}
      </h1>

      {/* Card do formulário */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

          {/* Erro do servidor */}
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Campo: Nome do custo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="nome_custo"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Nome do custo{" "}
                <span className="text-red-500 font-normal">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  nomeCustoValue.length > 240
                    ? nomeCustoValue.length > 255
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {nomeCustoValue.length}/255
              </span>
            </div>
            <input
              id="nome_custo"
              type="text"
              autoComplete="off"
              placeholder="Ex: Troca de pneu, Pintura, Revisão…"
              aria-invalid={!!errors.nome_custo}
              aria-describedby={errors.nome_custo ? "nome_custo-error" : undefined}
              {...register("nome_custo")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.nome_custo
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.nome_custo && (
              <p id="nome_custo-error" role="alert" className="text-xs text-red-500">
                {errors.nome_custo.message}
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="descricao"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Descrição{" "}
                <span className="text-xs font-normal normal-case tracking-normal text-brand-gray-text/50">
                  (opcional)
                </span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  descricaoValue.length > 470
                    ? descricaoValue.length > 500
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {descricaoValue.length}/500
              </span>
            </div>
            <textarea
              id="descricao"
              rows={4}
              placeholder="Descreva os detalhes deste tipo de custo ou serviço…"
              aria-invalid={!!errors.descricao}
              aria-describedby={errors.descricao ? "descricao-error" : undefined}
              {...register("descricao")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 resize-none ${
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

          {/* Botões de ação */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-6 py-2.5 hover:bg-brand-black/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <IconSpinner size={14} />
                  Salvando…
                </>
              ) : isEditing ? (
                "Salvar alterações"
              ) : (
                "Salvar"
              )}
            </button>
            <Link
              href="/configuracoes/custos"
              className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>

      {/* Zona de perigo — somente em modo de edição e somente para admins */}
      {isEditing && deleteAction && isAdmin && (
        <section className="mt-6 bg-white rounded-2xl border border-red-100 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-brand-black mb-1">
            Excluir tipo de custo
          </h2>
          <p className="text-xs text-brand-gray-text mb-5 leading-relaxed">
            Esta ação é permanente e não pode ser desfeita. O tipo de custo só
            pode ser excluído caso não haja manutenções de veículos vinculadas a
            ele.
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
              className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2 hover:bg-red-50 transition-colors"
            >
              <IconTrash size={14} />
              Excluir tipo de custo
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white text-sm font-medium px-5 py-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <>
                    <IconSpinner size={14} />
                    Excluindo…
                  </>
                ) : (
                  "Confirmar exclusão"
                )}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={isDeleting}
                className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2"
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

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="animate-spin"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}
