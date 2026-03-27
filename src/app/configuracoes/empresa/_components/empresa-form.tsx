"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ActionResult, EmpresaPayload } from "../actions";

// ─── Estados brasileiros ─────────────────────────────────────────────────────

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

// ─── Schema de validação ──────────────────────────────────────────────────────

const schema = z.object({
  // Empresa
  nome_legal_empresa: z
    .string()
    .min(1, "A razão social é obrigatória.")
    .max(255, "Máximo de 255 caracteres."),
  nome_fantasia_empresa: z
    .string()
    .max(255, "Máximo de 255 caracteres.")
    .optional()
    .transform((v) => v ?? ""),
  inscricao_municipal: z
    .string()
    .min(1, "A inscrição municipal é obrigatória.")
    .max(50, "Máximo de 50 caracteres."),
  inscricao_estadual: z
    .string()
    .min(1, "A inscrição estadual é obrigatória.")
    .max(50, "Máximo de 50 caracteres."),
  telefone_principal: z
    .string()
    .max(20, "Telefone inválido.")
    .optional()
    .transform((v) => v ?? ""),
  telefone_secundario: z
    .string()
    .max(20, "Telefone inválido.")
    .optional()
    .transform((v) => v ?? ""),
  email_empresa: z
    .string()
    .max(255, "Máximo de 255 caracteres.")
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal(""))
    .transform((v) => v ?? ""),
  nome_representante: z
    .string()
    .min(1, "O nome do representante é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  cargo_representante: z
    .string()
    .min(1, "O cargo do representante é obrigatório.")
    .max(255, "Máximo de 255 caracteres."),
  telefone_representante: z
    .string()
    .max(20, "Telefone inválido.")
    .optional()
    .transform((v) => v ?? ""),
  // Localização
  cep: z
    .string()
    .min(1, "O CEP é obrigatório.")
    .refine((v) => /^\d{5}-\d{3}$/.test(v), "CEP inválido (use o formato 00000-000)."),
  logradouro: z
    .string()
    .min(1, "O logradouro é obrigatório.")
    .max(100, "Máximo de 100 caracteres."),
  numero_logradouro: z
    .string()
    .min(1, "O número é obrigatório.")
    .refine((v) => /^\d+$/.test(v) && parseInt(v, 10) > 0, "Número inválido."),
  complemento_logradouro: z
    .string()
    .max(100, "Máximo de 100 caracteres.")
    .optional()
    .transform((v) => v ?? ""),
  bairro: z
    .string()
    .min(1, "O bairro é obrigatório.")
    .max(100, "Máximo de 100 caracteres."),
  cidade: z
    .string()
    .min(1, "A cidade é obrigatória.")
    .max(50, "Máximo de 50 caracteres."),
  estado: z
    .string()
    .length(2, "Informe a UF com 2 letras.")
    .transform((v) => v.toUpperCase()),
});

// FormValues representa os valores do formulário (campos string, sem transforms)
type FormValues = z.infer<typeof schema>;
// Alias para deixar explícito que todos os campos são strings neste contexto
type FormInput = { [K in keyof FormValues]: string };

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type SaveFn = (payload: EmpresaPayload) => Promise<ActionResult>;

export interface EmpresaInitialData {
  // Empresa
  cnpj: string;
  nome_legal_empresa: string;
  nome_fantasia_empresa: string | null;
  inscricao_municipal: string;
  inscricao_estadual: string;
  telefone_principal: string | null;
  telefone_secundario: string | null;
  email_empresa: string | null;
  nome_representante: string;
  cargo_representante: string;
  telefone_representante: string | null;
  // Localização
  cep: string;
  logradouro: string;
  numero_logradouro: number;
  complemento_logradouro: string | null;
  bairro: string;
  cidade: string;
  estado: string;
}

interface EmpresaFormProps {
  saveAction: SaveFn;
  initialData: EmpresaInitialData;
  savedOk?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarTelefone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatarCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function formatarCep(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

// ─── Sub-componente: Campo de texto ───────────────────────────────────────────

function Field({
  id,
  label,
  required,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
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
      {hint && !error && (
        <p className="text-xs text-brand-gray-text/60">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function EmpresaForm({ saveAction, initialData, savedOk = false }: EmpresaFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Telefones com máscara (estado local para exibição)
  const [tel1, setTel1] = useState(
    initialData.telefone_principal
      ? formatarTelefone(initialData.telefone_principal)
      : ""
  );
  const [tel2, setTel2] = useState(
    initialData.telefone_secundario
      ? formatarTelefone(initialData.telefone_secundario)
      : ""
  );
  const [telRep, setTelRep] = useState(
    initialData.telefone_representante
      ? formatarTelefone(initialData.telefone_representante)
      : ""
  );
  const [cepDisplay, setCepDisplay] = useState(
    initialData.cep ? formatarCep(initialData.cep) : ""
  );

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 bg-white transition-colors outline-none focus:ring-2 focus:ring-brand-black/10 ${
      hasError
        ? "border-red-300 focus:border-red-400"
        : "border-brand-gray-mid/60 focus:border-brand-black/40"
    }`;

  const readonlyClass =
    "w-full rounded-xl border border-brand-gray-mid/30 bg-brand-gray-soft/60 px-4 py-2.5 text-sm text-brand-gray-text select-all";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormInput>({ resolver: zodResolver(schema) as any, mode: "onBlur",
    defaultValues: {
      nome_legal_empresa: initialData.nome_legal_empresa,
      nome_fantasia_empresa: initialData.nome_fantasia_empresa ?? "",
      inscricao_municipal: initialData.inscricao_municipal,
      inscricao_estadual: initialData.inscricao_estadual,
      telefone_principal: initialData.telefone_principal
        ? formatarTelefone(initialData.telefone_principal)
        : "",
      telefone_secundario: initialData.telefone_secundario
        ? formatarTelefone(initialData.telefone_secundario)
        : "",
      email_empresa: initialData.email_empresa ?? "",
      nome_representante: initialData.nome_representante,
      cargo_representante: initialData.cargo_representante,
      telefone_representante: initialData.telefone_representante
        ? formatarTelefone(initialData.telefone_representante)
        : "",
      cep: initialData.cep,
      logradouro: initialData.logradouro,
      numero_logradouro: String(initialData.numero_logradouro),
      complemento_logradouro: initialData.complemento_logradouro ?? "",
      bairro: initialData.bairro,
      cidade: initialData.cidade,
      estado: initialData.estado,
    },
  });

  // ── Handlers de máscara de telefone ────────────────────────────────────────

  const handleTel =
    (
      setter: (v: string) => void,
      field: "telefone_principal" | "telefone_secundario" | "telefone_representante"
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = formatarTelefone(e.target.value);
      setter(masked);
      setValue(field, masked, { shouldValidate: false });
    };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatarCep(e.target.value);
    setCepDisplay(masked);
    setValue("cep", masked, { shouldValidate: false });
  };

  // ── Descartar ──────────────────────────────────────────────────────────────

  const handleReset = () => {
    reset();
    setTel1(initialData.telefone_principal ? formatarTelefone(initialData.telefone_principal) : "");
    setTel2(initialData.telefone_secundario ? formatarTelefone(initialData.telefone_secundario) : "");
    setTelRep(initialData.telefone_representante ? formatarTelefone(initialData.telefone_representante) : "");
    setCepDisplay(initialData.cep ? formatarCep(initialData.cep) : "");
  };

  // ── Proteção de mudanças não salvas ─────────────────────────────────────────

  useEffect(() => {
    if (savedOk) window.history.replaceState({}, "", "/configuracoes/empresa");
  }, [savedOk]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: FormInput) => {
    setServerError(null);
    setIsSaving(true);

    const payload: EmpresaPayload = {
      nome_legal_empresa: values.nome_legal_empresa,
      nome_fantasia_empresa: values.nome_fantasia_empresa || null,
      inscricao_municipal: values.inscricao_municipal,
      inscricao_estadual: values.inscricao_estadual,
      telefone_principal: values.telefone_principal || null,
      telefone_secundario: values.telefone_secundario || null,
      email_empresa: values.email_empresa || null,
      nome_representante: values.nome_representante,
      cargo_representante: values.cargo_representante,
      telefone_representante: values.telefone_representante || null,
      cep: values.cep,
      logradouro: values.logradouro,
      numero_logradouro: parseInt(values.numero_logradouro, 10),
      complemento_logradouro: values.complemento_logradouro || null,
      bairro: values.bairro,
      cidade: values.cidade,
      estado: values.estado,
    };

    const result = await saveAction(payload);

    if (result?.error) {
      setServerError(result.error);
      setIsSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* Banner de sucesso após salvar */}
      {savedOk && (
        <div className="rounded-2xl bg-status-success-bg border border-status-success-border px-4 py-3 text-sm text-status-success-text flex items-center gap-2 mb-5">
          <IconCheck size={14} />
          Dados da empresa atualizados com sucesso.
        </div>
      )}

      {/* Erro do servidor */}
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-5">
          {serverError}
        </div>
      )}

      {/* ── Grade 2 colunas ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* ── Coluna esquerda ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Informações da Empresa */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-brand-black">
              <IconBuilding />
              <h2 className="font-display text-base font-semibold text-brand-black">Informações da Empresa</h2>
            </div>

            {/* Razão Social — campo mais importante, em destaque no topo */}
            <Field
              id="nome_legal_empresa"
              label="Razão Social"
              required
              error={errors.nome_legal_empresa?.message}
            >
              <input
                id="nome_legal_empresa"
                type="text"
                autoComplete="organization"
                placeholder="Ex: Empresa LTDA"
                aria-invalid={!!errors.nome_legal_empresa}
                aria-describedby={errors.nome_legal_empresa ? "nome_legal_empresa-error" : undefined}
                {...register("nome_legal_empresa")}
                className={inputClass(!!errors.nome_legal_empresa)}
              />
            </Field>

            {/* CNPJ (imutável) | Nome Fantasia */}
            <div className="grid grid-cols-2 gap-4">
              <Field id="cnpj" label="CNPJ" hint="Imutável após o cadastro.">
                <div className={`${readonlyClass} flex items-center gap-1.5`}>
                  <IconLock size={12} />
                  <span>{formatarCnpj(initialData.cnpj)}</span>
                </div>
              </Field>

              <Field
                id="nome_fantasia_empresa"
                label="Nome Fantasia"
                error={errors.nome_fantasia_empresa?.message}
              >
                <input
                  id="nome_fantasia_empresa"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex: Minha Revenda"
                  aria-invalid={!!errors.nome_fantasia_empresa}
                  aria-describedby={errors.nome_fantasia_empresa ? "nome_fantasia_empresa-error" : undefined}
                  {...register("nome_fantasia_empresa")}
                  className={inputClass(!!errors.nome_fantasia_empresa)}
                />
              </Field>
            </div>

            {/* Inscrição Municipal | Inscrição Estadual */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="inscricao_municipal"
                label="Inscrição Municipal"
                required
                error={errors.inscricao_municipal?.message}
              >
                <input
                  id="inscricao_municipal"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex: 123456"
                  aria-invalid={!!errors.inscricao_municipal}
                  aria-describedby={errors.inscricao_municipal ? "inscricao_municipal-error" : undefined}
                  {...register("inscricao_municipal")}
                  className={inputClass(!!errors.inscricao_municipal)}
                />
              </Field>

              <Field
                id="inscricao_estadual"
                label="Inscrição Estadual"
                required
                error={errors.inscricao_estadual?.message}
              >
                <input
                  id="inscricao_estadual"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex: 123456789"
                  aria-invalid={!!errors.inscricao_estadual}
                  aria-describedby={errors.inscricao_estadual ? "inscricao_estadual-error" : undefined}
                  {...register("inscricao_estadual")}
                  className={inputClass(!!errors.inscricao_estadual)}
                />
              </Field>
            </div>
          </section>

          {/* Endereço Comercial */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-brand-black">
              <IconMapPin />
              <h2 className="font-display text-base font-semibold text-brand-black">Endereço Comercial</h2>
            </div>

            {/* Logradouro | Número */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field
                  id="logradouro"
                  label="Logradouro"
                  required
                  error={errors.logradouro?.message}
                >
                  <input
                    id="logradouro"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Ex: Rua das Flores"
                    aria-invalid={!!errors.logradouro}
                    aria-describedby={errors.logradouro ? "logradouro-error" : undefined}
                    {...register("logradouro")}
                    className={inputClass(!!errors.logradouro)}
                  />
                </Field>
              </div>
              <Field
                id="numero_logradouro"
                label="Número"
                required
                error={errors.numero_logradouro?.message}
              >
                <input
                  id="numero_logradouro"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Ex: 123"
                  aria-invalid={!!errors.numero_logradouro}
                  aria-describedby={errors.numero_logradouro ? "numero_logradouro-error" : undefined}
                  {...register("numero_logradouro")}
                  className={inputClass(!!errors.numero_logradouro)}
                />
              </Field>
            </div>

            {/* Bairro | Complemento */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="bairro"
                label="Bairro"
                required
                error={errors.bairro?.message}
              >
                <input
                  id="bairro"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex: Centro"
                  aria-invalid={!!errors.bairro}
                  aria-describedby={errors.bairro ? "bairro-error" : undefined}
                  {...register("bairro")}
                  className={inputClass(!!errors.bairro)}
                />
              </Field>

              <Field
                id="complemento_logradouro"
                label="Complemento"
                error={errors.complemento_logradouro?.message}
              >
                <input
                  id="complemento_logradouro"
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Ex: Sala 5"
                  aria-invalid={!!errors.complemento_logradouro}
                  aria-describedby={errors.complemento_logradouro ? "complemento-error" : undefined}
                  {...register("complemento_logradouro")}
                  className={inputClass(!!errors.complemento_logradouro)}
                />
              </Field>
            </div>

            {/* Cidade | UF (select com 27 estados) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field
                  id="cidade"
                  label="Cidade"
                  required
                  error={errors.cidade?.message}
                >
                  <input
                    id="cidade"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Ex: São Paulo"
                    aria-invalid={!!errors.cidade}
                    aria-describedby={errors.cidade ? "cidade-error" : undefined}
                    {...register("cidade")}
                    className={inputClass(!!errors.cidade)}
                  />
                </Field>
              </div>
              <Field
                id="estado"
                label="UF"
                required
                error={errors.estado?.message}
              >
                <select
                  id="estado"
                  aria-invalid={!!errors.estado}
                  aria-describedby={errors.estado ? "estado-error" : undefined}
                  {...register("estado")}
                  className={`${inputClass(!!errors.estado)} cursor-pointer`}
                >
                  <option value="">UF</option>
                  {UF_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* CEP */}
            <Field
              id="cep"
              label="CEP"
              required
              error={errors.cep?.message}
            >
              <input
                id="cep"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="Ex: 01310-100"
                maxLength={9}
                value={cepDisplay}
                aria-invalid={!!errors.cep}
                aria-describedby={errors.cep ? "cep-error" : undefined}
                {...register("cep")}
                onChange={handleCepChange}
                className={inputClass(!!errors.cep)}
              />
            </Field>
          </section>
        </div>

        {/* ── Coluna direita ───────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Representante Legal */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-brand-black">
              <IconUser />
              <h2 className="font-display text-base font-semibold text-brand-black">Representante Legal</h2>
            </div>

            <Field
              id="nome_representante"
              label="Nome Completo"
              required
              error={errors.nome_representante?.message}
            >
              <input
                id="nome_representante"
                type="text"
                autoComplete="name"
                placeholder="Ex: Carlos Pereira"
                aria-invalid={!!errors.nome_representante}
                aria-describedby={errors.nome_representante ? "nome_representante-error" : undefined}
                {...register("nome_representante")}
                className={inputClass(!!errors.nome_representante)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="cargo_representante"
                label="Cargo"
                required
                error={errors.cargo_representante?.message}
              >
                <input
                  id="cargo_representante"
                  type="text"
                  autoComplete="organization-title"
                  placeholder="Ex: Sócio-Diretor"
                  aria-invalid={!!errors.cargo_representante}
                  aria-describedby={errors.cargo_representante ? "cargo_representante-error" : undefined}
                  {...register("cargo_representante")}
                  className={inputClass(!!errors.cargo_representante)}
                />
              </Field>

              <Field
                id="telefone_representante"
                label="Telefone ou WhatsApp"
                error={errors.telefone_representante?.message}
              >
                <input
                  id="telefone_representante"
                  type="text"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  maxLength={16}
                  value={telRep}
                  aria-invalid={!!errors.telefone_representante}
                  aria-describedby={errors.telefone_representante ? "telefone_representante-error" : undefined}
                  {...register("telefone_representante")}
                  onChange={handleTel(setTelRep, "telefone_representante")}
                  className={inputClass(!!errors.telefone_representante)}
                />
              </Field>
            </div>
          </section>

          {/* Detalhes de Contato */}
          <section className="bg-white rounded-2xl border border-brand-gray-mid/30 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-brand-black">
              <IconPhone />
              <h2 className="font-display text-base font-semibold text-brand-black">Detalhes de Contato</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="telefone_principal"
                label="Telefone Principal"
                error={errors.telefone_principal?.message}
              >
                <input
                  id="telefone_principal"
                  type="text"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  maxLength={16}
                  value={tel1}
                  aria-invalid={!!errors.telefone_principal}
                  aria-describedby={errors.telefone_principal ? "telefone_principal-error" : undefined}
                  {...register("telefone_principal")}
                  onChange={handleTel(setTel1, "telefone_principal")}
                  className={inputClass(!!errors.telefone_principal)}
                />
              </Field>

              <Field
                id="telefone_secundario"
                label="Telefone Secundário"
                error={errors.telefone_secundario?.message}
              >
                <input
                  id="telefone_secundario"
                  type="text"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  maxLength={16}
                  value={tel2}
                  aria-invalid={!!errors.telefone_secundario}
                  aria-describedby={errors.telefone_secundario ? "telefone_secundario-error" : undefined}
                  {...register("telefone_secundario")}
                  onChange={handleTel(setTel2, "telefone_secundario")}
                  className={inputClass(!!errors.telefone_secundario)}
                />
              </Field>
            </div>

            <Field
              id="email_empresa"
              label="E-mail da Empresa"
              error={errors.email_empresa?.message}
            >
              <input
                id="email_empresa"
                type="email"
                autoComplete="email"
                placeholder="contato@empresa.com.br"
                aria-invalid={!!errors.email_empresa}
                aria-describedby={errors.email_empresa ? "email_empresa-error" : undefined}
                {...register("email_empresa")}
                className={inputClass(!!errors.email_empresa)}
              />
            </Field>
          </section>
        </div>
      </div>

      {/* ── Barra de ações ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mt-5 bg-white rounded-2xl border border-brand-gray-mid/30 p-4">
        <p className="text-xs text-brand-gray-text">
          {isDirty
            ? "Você tem alterações não salvas."
            : "Todos os dados estão atualizados."}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="text-sm font-medium text-brand-gray-text hover:text-brand-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-3 py-2"
          >
            Descartar
          </button>
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-6 py-2.5 hover:bg-brand-black/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <IconSpinner size={14} />
                Salvando…
              </>
            ) : (
              "Salvar alterações"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconSpinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.45 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.86 5.86l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconLock({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}


