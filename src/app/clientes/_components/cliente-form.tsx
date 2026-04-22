"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionResult, ClientePayload } from "../actions";
import { clienteSchema, type ClienteFormValues } from "@/lib/schemas/cliente";
import {
  formatCpf as formatarCpf,
  formatTelefone as formatarTelefone,
  formatCep as formatarCep,
} from "@/lib/utils/formatters";
import { consultarCep } from "@/lib/utils/cep";

// ─── Estados brasileiros ──────────────────────────────────────────────────────

const UF_OPTIONS = [
  { value: "AC", label: "AC – Acre" },
  { value: "AL", label: "AL – Alagoas" },
  { value: "AP", label: "AP – Amapá" },
  { value: "AM", label: "AM – Amazonas" },
  { value: "BA", label: "BA – Bahia" },
  { value: "CE", label: "CE – Ceará" },
  { value: "DF", label: "DF – Distrito Federal" },
  { value: "ES", label: "ES – Espírito Santo" },
  { value: "GO", label: "GO – Goiás" },
  { value: "MA", label: "MA – Maranhão" },
  { value: "MT", label: "MT – Mato Grosso" },
  { value: "MS", label: "MS – Mato Grosso do Sul" },
  { value: "MG", label: "MG – Minas Gerais" },
  { value: "PA", label: "PA – Pará" },
  { value: "PB", label: "PB – Paraíba" },
  { value: "PR", label: "PR – Paraná" },
  { value: "PE", label: "PE – Pernambuco" },
  { value: "PI", label: "PI – Piauí" },
  { value: "RJ", label: "RJ – Rio de Janeiro" },
  { value: "RN", label: "RN – Rio Grande do Norte" },
  { value: "RS", label: "RS – Rio Grande do Sul" },
  { value: "RO", label: "RO – Rondônia" },
  { value: "RR", label: "RR – Roraima" },
  { value: "SC", label: "SC – Santa Catarina" },
  { value: "SP", label: "SP – São Paulo" },
  { value: "SE", label: "SE – Sergipe" },
  { value: "TO", label: "TO – Tocantins" },
] as const;

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type SaveFnCreate = (payload: ClientePayload) => Promise<ActionResult>;
export type SaveFnEdit = (payload: ClientePayload) => Promise<ActionResult>;
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
    localizacao: {
      id: string;
      cep: string;
      logradouro: string;
      numero_logradouro: number;
      complemento_logradouro: string | null;
      bairro: string;
      cidade: string;
      estado: string;
    } | null;
  };
}

// ─── Helper: Field ────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
      >
        {label}
        {required && <span className="text-red-500 font-normal ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function ClienteForm({
  saveAction,
  deleteAction,
  initialData,
}: ClienteFormProps) {
  const isEditing = !!initialData;
  const loc = initialData?.localizacao ?? null;

  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Máscaras de exibição
  const [cpfDisplay, setCpfDisplay] = useState(
    initialData ? formatarCpf(initialData.cpf) : ""
  );
  const [telefoneDisplay, setTelefoneDisplay] = useState(
    initialData?.telefone_cliente
      ? formatarTelefone(initialData.telefone_cliente)
      : ""
  );
  const [cepDisplay, setCepDisplay] = useState(
    loc ? formatarCep(loc.cep) : ""
  );

  // Estados de CEP
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepNotFound, setCepNotFound] = useState(false);
  const [cepNetworkError, setCepNetworkError] = useState(false);
  const cepAbortRef = useRef<AbortController | null>(null);

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
      hasError
        ? "border-red-300 focus:border-red-400"
        : "border-brand-gray-mid/60 focus:border-brand-black/40"
    }`;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome_cliente: initialData?.nome_cliente ?? "",
      cpf: initialData ? formatarCpf(initialData.cpf) : "",
      telefone_cliente: initialData?.telefone_cliente
        ? formatarTelefone(initialData.telefone_cliente)
        : "",
      email_cliente: initialData?.email_cliente ?? "",
      cep: loc ? formatarCep(loc.cep) : "",
      logradouro: loc?.logradouro ?? "",
      numero_logradouro: loc ? String(loc.numero_logradouro) : "",
      complemento_logradouro: loc?.complemento_logradouro ?? "",
      bairro: loc?.bairro ?? "",
      cidade: loc?.cidade ?? "",
      estado: loc?.estado ?? "",
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

  // ── CEP ────────────────────────────────────────────────────────────────────

  const buscarCep = async (digits: string) => {
    cepAbortRef.current?.abort();
    const controller = new AbortController();
    cepAbortRef.current = controller;

    setIsCepLoading(true);
    setCepNotFound(false);
    setCepNetworkError(false);
    try {
      const result = await consultarCep(digits, controller.signal);
      if (!result) {
        setCepNotFound(true);
        return;
      }
      if (result.logradouro) setValue("logradouro", result.logradouro);
      if (result.bairro)     setValue("bairro",     result.bairro);
      if (result.cidade)     setValue("cidade",     result.cidade);
      if (result.estado)     setValue("estado",     result.estado);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setCepNetworkError(true);
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatarCep(e.target.value);
    setCepDisplay(masked);
    setCepNotFound(false);
    setCepNetworkError(false);
    setValue("cep", masked, { shouldValidate: false });
    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) buscarCep(digits);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: ClienteFormValues) => {
    setServerError(null);
    setIsSaving(true);

    const temEndereco =
      values.cep && values.logradouro && values.bairro && values.cidade && values.estado;

    const payload: ClientePayload = {
      nome_cliente: values.nome_cliente,
      cpf: values.cpf,
      telefone_cliente: values.telefone_cliente?.replace(/\D/g, "") || null,
      email_cliente: values.email_cliente?.trim() || null,
      ...(temEndereco
        ? {
            cep: values.cep,
            logradouro: values.logradouro,
            numero_logradouro: parseInt(values.numero_logradouro, 10),
            complemento_logradouro: values.complemento_logradouro || null,
            bairro: values.bairro,
            cidade: values.cidade,
            estado: values.estado,
          }
        : {}),
    };

    const result = await saveAction(payload);

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

      {/* Erro do servidor */}
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-5">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

        {/* ── Dados Pessoais ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 text-brand-black">
            <IconUser size={18} />
            <h2 className="font-display text-base font-semibold">Dados Pessoais</h2>
          </div>

          {/* Nome completo */}
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
              className={inputClass(!!errors.nome_cliente)}
            />
            {errors.nome_cliente && (
              <p id="nome-error" role="alert" className="text-xs text-red-500">
                {errors.nome_cliente.message}
              </p>
            )}
          </div>

          {/* CPF */}
          <Field id="cpf" label="CPF" required error={errors.cpf?.message}>
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
              className={inputClass(!!errors.cpf)}
            />
          </Field>

          {/* Grade: Telefone + E-mail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="telefone_cliente" label="Telefone" error={errors.telefone_cliente?.message}>
              <input
                id="telefone_cliente"
                type="text"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                maxLength={16}
                value={telefoneDisplay}
                aria-invalid={!!errors.telefone_cliente}
                aria-describedby={errors.telefone_cliente ? "telefone_cliente-error" : undefined}
                {...register("telefone_cliente")}
                onChange={handleTelefoneChange}
                disabled={isSaving}
                className={inputClass(!!errors.telefone_cliente)}
              />
            </Field>

            <Field id="email_cliente" label="E-mail" error={errors.email_cliente?.message}>
              <input
                id="email_cliente"
                type="email"
                autoComplete="email"
                placeholder="cliente@exemplo.com"
                aria-invalid={!!errors.email_cliente}
                aria-describedby={errors.email_cliente ? "email_cliente-error" : undefined}
                {...register("email_cliente")}
                disabled={isSaving}
                className={inputClass(!!errors.email_cliente)}
              />
            </Field>
          </div>
        </section>

        {/* ── Endereço ───────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-brand-black">
            <IconMapPin size={18} />
            <h2 className="font-display text-base font-semibold">Endereço</h2>
          </div>
          <p className="text-xs text-brand-gray-text/70 -mt-1">
            Opcional. Preencha o CEP para autocompletar os campos.
          </p>

          {/* CEP */}
          <div className="space-y-1.5">
            <label
              htmlFor="cep"
              className="block text-xs font-semibold uppercase tracking-wide text-brand-gray-text"
            >
              CEP
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-40 shrink-0">
                <input
                  id="cep"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  maxLength={9}
                  value={cepDisplay}
                  aria-invalid={!!errors.cep || cepNotFound || cepNetworkError}
                  aria-describedby="cep-error"
                  {...register("cep")}
                  onChange={handleCepChange}
                  disabled={isSaving}
                  className={`${inputClass(!!errors.cep || cepNotFound)} pr-9`}
                />
                {isCepLoading && (
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-text">
                    <IconSpinner size={14} />
                  </div>
                )}
              </div>
              <p className="text-xs text-brand-gray-text/60 leading-relaxed">
                Digite o CEP para preencher<br />o endereço automaticamente.
              </p>
            </div>
            {(errors.cep || cepNotFound || cepNetworkError) && (
              <p id="cep-error" role="alert" className="text-xs text-red-500">
                {errors.cep?.message ??
                  (cepNetworkError
                    ? "Não foi possível consultar o CEP. Preencha o endereço manualmente."
                    : "CEP não encontrado.")}
              </p>
            )}
          </div>

          {/* Logradouro | Número */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field id="logradouro" label="Logradouro" error={errors.logradouro?.message}>
                <input
                  id="logradouro"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Ex: Rua das Flores"
                  aria-invalid={!!errors.logradouro}
                  aria-describedby={errors.logradouro ? "logradouro-error" : undefined}
                  {...register("logradouro")}
                  disabled={isSaving}
                  className={inputClass(!!errors.logradouro)}
                />
              </Field>
            </div>
            <Field id="numero_logradouro" label="Número" error={errors.numero_logradouro?.message}>
              <input
                id="numero_logradouro"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ex: 123"
                aria-invalid={!!errors.numero_logradouro}
                aria-describedby={errors.numero_logradouro ? "numero_logradouro-error" : undefined}
                {...register("numero_logradouro")}
                disabled={isSaving}
                className={inputClass(!!errors.numero_logradouro)}
              />
            </Field>
          </div>

          {/* Bairro | Complemento */}
          <div className="grid grid-cols-2 gap-4">
            <Field id="bairro" label="Bairro" error={errors.bairro?.message}>
              <input
                id="bairro"
                type="text"
                autoComplete="off"
                placeholder="Ex: Centro"
                aria-invalid={!!errors.bairro}
                aria-describedby={errors.bairro ? "bairro-error" : undefined}
                {...register("bairro")}
                disabled={isSaving}
                className={inputClass(!!errors.bairro)}
              />
            </Field>

            <Field id="complemento_logradouro" label="Complemento" error={errors.complemento_logradouro?.message}>
              <input
                id="complemento_logradouro"
                type="text"
                autoComplete="address-line2"
                placeholder="Ex: Apto 12"
                aria-invalid={!!errors.complemento_logradouro}
                aria-describedby={errors.complemento_logradouro ? "complemento_logradouro-error" : undefined}
                {...register("complemento_logradouro")}
                disabled={isSaving}
                className={inputClass(!!errors.complemento_logradouro)}
              />
            </Field>
          </div>

          {/* Cidade | UF */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Field id="cidade" label="Cidade" error={errors.cidade?.message}>
                <input
                  id="cidade"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Ex: São Paulo"
                  aria-invalid={!!errors.cidade}
                  aria-describedby={errors.cidade ? "cidade-error" : undefined}
                  {...register("cidade")}
                  disabled={isSaving}
                  className={inputClass(!!errors.cidade)}
                />
              </Field>
            </div>
            <Field id="estado" label="UF" error={errors.estado?.message}>
              <select
                id="estado"
                aria-invalid={!!errors.estado}
                aria-describedby={errors.estado ? "estado-error" : undefined}
                {...register("estado")}
                disabled={isSaving}
                className={`${inputClass(!!errors.estado)} cursor-pointer`}
              >
                <option value="">UF</option>
                {UF_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* ── Botões de ação ─────────────────────────────────────────────── */}
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

function IconUser({ size = 18 }: { size?: number }) {
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
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconMapPin({ size = 18 }: { size?: number }) {
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
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

