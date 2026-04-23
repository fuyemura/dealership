"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult } from "../actions";
import { formatCpf as formatarCpf } from "@/lib/utils/formatters";

// ─── Schema de validação ──────────────────────────────────────────────────────

const schemaBase = z.object({
  nome_usuario: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(
      z.string().length(11, "CPF deve ter 11 dígitos.")
    ),
  papel_usuario_id: z
    .string()
    .min(1, "Selecione um papel para o usuário."),
});

const schemaCreate = schemaBase.extend({
  email_usuario: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .max(255, "Máximo de 255 caracteres.")
    .email("Informe um e-mail válido."),
});

type FormValuesCreate = z.infer<typeof schemaCreate>;

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type SaveFnCreate = (
  nome: string,
  email: string,
  cpf: string,
  papelId: string
) => Promise<ActionResult>;

export type SaveFnEdit = (
  nome: string,
  cpf: string,
  papelId: string
) => Promise<ActionResult>;

export type DeleteFn = () => Promise<ActionResult>;

export interface Papel {
  id: string;
  nome_dominio: string;
}

interface UsuarioFormProps {
  saveAction: SaveFnCreate | SaveFnEdit;
  deleteAction?: DeleteFn;
  papeis: Papel[];
  initialData?: {
    nome_usuario: string;
    email_usuario: string;
    cpf: string;
    papel_usuario_id: string;
  };
  isSelf?: boolean;
  isAdmin?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function labelPapel(nome: string): string {
  const map: Record<string, string> = {
    administrador: "Administrador",
    gerente: "Gerente",
    usuario: "Usuário",
  };
  return map[nome] ?? nome;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function UsuarioForm({
  saveAction,
  deleteAction,
  papeis,
  initialData,
  isSelf = false,
  isAdmin = false,
}: UsuarioFormProps) {
  const isEditing = !!initialData;

  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // CPF exibido com máscara (estado local apenas para display)
  const [cpfDisplay, setCpfDisplay] = useState(
    initialData ? formatarCpf(initialData.cpf) : ""
  );

  // Selecionamos o schema adequado ao contexto
  const schema = isEditing ? schemaBase : schemaCreate;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValuesCreate>({
    resolver: zodResolver(schema as unknown as z.ZodSchema<FormValuesCreate>),
    defaultValues: {
      nome_usuario: initialData?.nome_usuario ?? "",
      email_usuario: initialData?.email_usuario ?? "",
      cpf: initialData ? formatarCpf(initialData.cpf) : "",
      papel_usuario_id: initialData?.papel_usuario_id ?? "",
    },
  });

  const nomeValue = watch("nome_usuario") ?? "";

  // ── Máscara de CPF ──────────────────────────────────────────────────────────

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatarCpf(e.target.value);
    setCpfDisplay(masked);
    setValue("cpf", masked, { shouldValidate: false });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormValuesCreate) => {
    setServerError(null);
    setIsSaving(true);

    let result: ActionResult;
    if (isEditing) {
      result = await (saveAction as SaveFnEdit)(
        values.nome_usuario,
        values.cpf, // já transformado pelo Zod (11 dígitos)
        values.papel_usuario_id
      );
    } else {
      result = await (saveAction as SaveFnCreate)(
        values.nome_usuario,
        values.email_usuario,
        values.cpf,
        values.papel_usuario_id
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
        href="/configuracoes/usuarios"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
      >
        <IconChevronLeft size={16} />
        Usuários
      </Link>

      {/* Título */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
        {isEditing ? "Editar Usuário" : "Convidar Usuário"}
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

          {/* Campo: Nome */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="nome_usuario"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                Nome completo <span className="text-red-500 font-normal">*</span>
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
              id="nome_usuario"
              type="text"
              autoComplete="name"
              placeholder="Ex: João da Silva"
              aria-invalid={!!errors.nome_usuario}
              aria-describedby={errors.nome_usuario ? "nome_usuario-error" : undefined}
              {...register("nome_usuario")}
              disabled={isSaving}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.nome_usuario
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            />
            {errors.nome_usuario && (
              <p id="nome_usuario-error" role="alert" className="text-xs text-red-500">
                {errors.nome_usuario.message}
              </p>
            )}
          </div>

          {/* Campo: E-mail (somente na criação) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label
                htmlFor="email_usuario"
                className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
              >
                E-mail <span className="text-red-500 font-normal">*</span>
              </label>
              <input
                id="email_usuario"
                type="email"
                autoComplete="email"
                placeholder="joao@empresa.com.br"
                aria-invalid={!!errors.email_usuario}
                aria-describedby={errors.email_usuario ? "email-error" : undefined}
                {...register("email_usuario")}
                disabled={isSaving}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                  errors.email_usuario
                    ? "border-red-300 focus:border-red-400"
                    : "border-brand-gray-mid/60 focus:border-brand-black/40"
                }`}
              />
              {errors.email_usuario && (
                <p id="email-error" role="alert" className="text-xs text-red-500">
                  {errors.email_usuario.message}
                </p>
              )}
              <p className="text-xs text-brand-gray-text/60">
                O usuário receberá um e-mail de convite para definir sua senha.
              </p>
            </div>
          )}

          {/* E-mail em leitura (modo edição) */}
          {isEditing && initialData && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text">
                E-mail
              </label>
              <p className="w-full rounded-xl border border-brand-gray-mid/30 bg-brand-gray-soft px-4 py-2.5 text-sm text-brand-gray-text">
                {initialData.email_usuario}
              </p>
              <p className="text-xs text-brand-gray-text/50">
                O e-mail não pode ser alterado após o cadastro.
              </p>
            </div>
          )}

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

          {/* Campo: Papel */}
          <div className="space-y-1.5">
            <label
              htmlFor="papel_usuario_id"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
            >
              Papel <span className="text-red-500 font-normal">*</span>
            </label>
            <select
              id="papel_usuario_id"
              aria-invalid={!!errors.papel_usuario_id}
              aria-describedby={errors.papel_usuario_id ? "papel-error" : undefined}
              {...register("papel_usuario_id")}
              disabled={isSaving}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
                errors.papel_usuario_id
                  ? "border-red-300 focus:border-red-400"
                  : "border-brand-gray-mid/60 focus:border-brand-black/40"
              }`}
            >
              <option value="">Selecione um papel…</option>
              {papeis.map((p) => (
                <option key={p.id} value={p.id}>
                  {labelPapel(p.nome_dominio)}
                </option>
              ))}
            </select>
            {errors.papel_usuario_id && (
              <p id="papel-error" role="alert" className="text-xs text-red-500">
                {errors.papel_usuario_id.message}
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
                  {isEditing ? "Salvando…" : "Enviando convite…"}
                </>
              ) : isEditing ? (
                "Salvar alterações"
              ) : (
                "Enviar convite"
              )}
            </button>
            <Link
              href="/configuracoes/usuarios"
              className="text-sm font-medium text-brand-gray-text hover:text-brand-black transition-colors px-2 py-2.5"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>

      {/* Zona de perigo — somente em modo de edição, administradores, sem auto-exclusão */}
      {isEditing && deleteAction && isAdmin && (
        <section className="mt-6 bg-white rounded-2xl border border-red-100 p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-brand-black mb-1">
            Excluir usuário
          </h2>
          <p className="text-xs text-brand-gray-text mb-5 leading-relaxed">
            {isSelf
              ? "Você não pode excluir sua própria conta."
              : "Esta ação é permanente. O usuário perderá todo o acesso ao sistema imediatamente."}
          </p>

          {deleteError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}

          {!confirmingDelete ? (
            <button
              type="button"
              disabled={isSelf}
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <IconTrash size={14} />
              Excluir usuário
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

function IconTrash({ size = 16 }: { size?: number }) {
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
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
