"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult } from "../actions";
import { formatCpf as formatarCpf, formatTelefone as formatarTelefone } from "@/lib/utils/formatters";

// ─── Schema de validação ──────────────────────────────────────────────────────

const schema = z.object({
  nome_cliente: z
    .string()
    .min(1, "O nome do cliente é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF deve ter 11 dígitos.")),
  telefone_cliente: z
    .string()
    .max(20, "Telefone inválido.")
    .optional()
    .transform((v) => v ?? ""),
  email_cliente: z
    .string()
    .max(255, "Máximo de 255 caracteres.")
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
});

type FormValues = z.infer<typeof schema>;

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type SaveFnCreate = (
  nome: string,
  cpf: string,
  telefone: string | null,
  email: string | null
) => Promise<ActionResult>;

export type SaveFnEdit = (
  nome: string,
  cpf: string,
  telefone: string | null,
  email: string | null
) => Promise<ActionResult>;

export type DeleteFn = () => Promise<ActionResult>;

interface ClienteFormProps {
  saveAction: SaveFnCreate | SaveFnEdit;
  deleteAction?: DeleteFn;
  initialData?: {
    id: string;
    nome_cliente: string;
    cpf: string;
    telefone_cliente: string | null;
    email_cliente: string | null;
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ClienteForm({
  saveAction,
  deleteAction,
  initialData,
}: ClienteFormProps) {
  const isEditing = !!initialData;

  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [cpfDisplay, setCpfDisplay] = useState(
    initialData ? formatarCpf(initialData.cpf) : ""
  );
  const [telefoneDisplay, setTelefoneDisplay] = useState(
    initialData?.telefone_cliente
      ? formatarTelefone(initialData.telefone_cliente)
      : ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome_cliente: initialData?.nome_cliente ?? "",
      cpf: initialData ? formatarCpf(initialData.cpf) : "",
      telefone_cliente: initialData?.telefone_cliente
        ? formatarTelefone(initialData.telefone_cliente)
        : "",
      email_cliente: initialData?.email_cliente ?? "",
    },
  });

  const nomeValue = watch("nome_cliente") ?? "";

  // ── Máscara CPF ─────────────────────────────────────────────────────────────

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatarCpf(e.target.value);
    setCpfDisplay(masked);
    setValue("cpf", masked, { shouldValidate: false });
  };

  // ── Máscara Telefone ────────────────────────────────────────────────────────

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatarTelefone(e.target.value);
    setTelefoneDisplay(masked);
    setValue("telefone_cliente", masked, { shouldValidate: false });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    setIsSaving(true);

    const telefone = values.telefone_cliente?.replace(/\D/g, "") || null;
    const email = values.email_cliente?.trim() || null;

    let result: ActionResult;
    if (isEditing) {
      result = await (saveAction as SaveFnEdit)(
        values.nome_cliente,
        values.cpf,
        telefone,
        email
      );
    } else {
      result = await (saveAction as SaveFnCreate)(
        values.nome_cliente,
        values.cpf,
        telefone,
        email
      );
    }

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
        href="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Clientes
      </Link>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
        {isEditing ? "Editar Cliente" : "Novo Cliente"}
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

          {/* Campo: Nome completo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="nome_cliente"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Nome completo{" "}
                <span className="text-red-500 font-normal">*</span>
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
              id="nome_cliente"
              type="text"
              autoComplete="name"
              placeholder="Ex: Maria Souza"
              aria-invalid={!!errors.nome_cliente}
              aria-describedby={errors.nome_cliente ? "nome-error" : undefined}
              {...register("nome_cliente")}
              disabled={isSaving}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.nome_cliente
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.nome_cliente && (
              <p id="nome-error" role="alert" className="text-xs text-red-500">
                {errors.nome_cliente.message}
              </p>
            )}
          </div>

          {/* Campo: CPF */}
          <div className="space-y-1.5">
            <label
              htmlFor="cpf"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
            >
              CPF <span className="text-red-500 font-normal">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              maxLength={14}
              value={cpfDisplay}
              aria-invalid={!!errors.cpf}
              aria-describedby={errors.cpf ? "cpf-error" : undefined}
              {...register("cpf")}
              onChange={handleCpfChange}
              disabled={isSaving}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.cpf
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.cpf && (
              <p id="cpf-error" role="alert" className="text-xs text-red-500">
                {errors.cpf.message}
              </p>
            )}
          </div>

          {/* Grade: Telefone + E-mail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Telefone */}
            <div className="space-y-1.5">
              <label
                htmlFor="telefone_cliente"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Telefone
              </label>
              <input
                id="telefone_cliente"
                type="text"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                maxLength={16}
                value={telefoneDisplay}
                aria-invalid={!!errors.telefone_cliente}
                aria-describedby={
                  errors.telefone_cliente ? "telefone-error" : undefined
                }
                {...register("telefone_cliente")}
                onChange={handleTelefoneChange}
                disabled={isSaving}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                  errors.telefone_cliente
                    ? "border-red-300 focus:border-red-400"
                    : "border-brand-gray-mid/60 focus:border-brand-black/40"
                }`}
              />
              {errors.telefone_cliente && (
                <p
                  id="telefone-error"
                  role="alert"
                  className="text-xs text-red-500"
                >
                  {errors.telefone_cliente.message}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label
                htmlFor="email_cliente"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                E-mail
              </label>
              <input
                id="email_cliente"
                type="email"
                autoComplete="email"
                placeholder="cliente@exemplo.com"
                aria-invalid={!!errors.email_cliente}
                aria-describedby={
                  errors.email_cliente ? "email-error" : undefined
                }
                {...register("email_cliente")}
                disabled={isSaving}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                  errors.email_cliente
                    ? "border-red-300 focus:border-red-400"
                    : "border-brand-gray-mid/60 focus:border-brand-black/40"
                }`}
              />
              {errors.email_cliente && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-xs text-red-500"
                >
                  {errors.email_cliente.message}
                </p>
              )}
            </div>
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
                "Cadastrar cliente"
              )}
            </button>
            <Link
              href="/clientes"
              className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>

      {/* Zona de perigo — somente em modo de edição */}
      {isEditing && deleteAction && (
        <section className="mt-6 bg-white rounded-2xl border border-red-100 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-brand-black mb-1">
            Excluir cliente
          </h2>
          <p className="text-xs text-brand-gray-text mb-5 leading-relaxed">
            Esta ação é permanente e não poderá ser desfeita. Antes de excluir,
            certifique-se de que o cliente não possui vínculos com vendas.
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
              Excluir cliente
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
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
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
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconSpinner({ size = 14 }: { size?: number }) {
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
      className="animate-spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
