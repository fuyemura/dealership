"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult } from "../actions";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  nome: z
    .string()
    .min(1, "O nome da categoria é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  descricao: z
    .string()
    .max(500, "Máximo de 500 caracteres.")
    .optional()
    .transform((v) => v ?? ""),
});

type FormValues = z.infer<typeof schema>;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type SaveFn = (nome: string, descricao: string | null) => Promise<ActionResult>;
export type DeleteFn = () => Promise<ActionResult>;

interface CategoriaFormProps {
  saveAction: SaveFn;
  deleteAction?: DeleteFn;
  initialData?: { nome: string; descricao: string | null };
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

// ─── Componente ───────────────────────────────────────────────────────────────

export function CategoriaForm({
  saveAction,
  deleteAction,
  initialData,
  isAdmin = false,
}: CategoriaFormProps) {
  const isEditing = !!initialData;

  const [serverError, setServerError]         = useState<string | null>(null);
  const [deleteError, setDeleteError]         = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [isDeleting, setIsDeleting]           = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome:      initialData?.nome      ?? "",
      descricao: initialData?.descricao ?? "",
    },
  });

  const nomeValue      = watch("nome")      ?? "";
  const descricaoValue = watch("descricao") ?? "";

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSaving(true);
    const result = await saveAction(values.nome, values.descricao || null);
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
        href="/financeiro/categorias"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Categorias de Despesa
      </Link>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
        {isEditing ? "Editar Categoria" : "Nova Categoria"}
      </h1>

      {/* Card do formulário */}
      <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Erro servidor */}
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {/* Nome */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="nome"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Nome da categoria <span className="text-red-500 font-normal">*</span>
              </label>
              <span
                className={`text-xs tabular-nums ${
                  nomeValue.length > 240
                    ? nomeValue.length > 255
                      ? "text-red-500"
                      : "text-status-warning-text"
                    : "text-brand-gray-text/50"
                }`}
              >
                {nomeValue.length}/255
              </span>
            </div>
            <input
              id="nome"
              type="text"
              autoComplete="off"
              placeholder="Ex: Energia Elétrica, Aluguel, Pessoal…"
              aria-invalid={!!errors.nome}
              aria-describedby={errors.nome ? "nome-error" : undefined}
              {...register("nome")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.nome
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.nome && (
              <p id="nome-error" role="alert" className="text-xs text-red-500">
                {errors.nome.message}
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
              rows={3}
              placeholder="Descreva o tipo de despesa que esta categoria representa…"
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

          {/* Botões */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/financeiro/categorias"
              className="rounded-full border border-brand-gray-mid text-brand-black text-sm font-medium px-5 py-2.5 hover:bg-brand-gray-soft transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar categoria"}
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
            Excluir esta categoria é uma ação permanente e não pode ser desfeita.
            Categorias vinculadas a despesas não podem ser excluídas.
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
              Excluir categoria
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
