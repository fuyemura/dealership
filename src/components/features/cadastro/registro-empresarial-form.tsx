"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ESTADOS_UF = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

const TIPOS_PJ = [
  "Sociedade Limitada (LTDA)",
  "Empresa Individual (EI)",
  "Empresário Individual de Responsabilidade Limitada (EIRELI)",
  "Sociedade Anônima (S/A)",
  "Microempreendedor Individual (MEI)",
  "Outro",
];

export function RegistroEmpresarialForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // TODO: wire up to API
    await new Promise((r) => setTimeout(r, 600));
    router.push("/cadastro/plano");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Informações da Empresa ───────────────────── */}
      <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-5">
          Informações da Empresa
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="CNPJ" id="cnpj" placeholder="00.000.000/0000-00" required />
          <Field label="Inscrição Municipal" id="inscricao_municipal" placeholder="000.000-0" />
          <Field label="Nome Legal (Razão Social)" id="razao_social" placeholder="Empresa Ltda." required />
          <Field label="Inscrição Estadual" id="inscricao_estadual" placeholder="000.000.000.000" />
          <Field label="Nome Fantasia" id="nome_fantasia" placeholder="Minha Empresa" />
          <SelectField label="Tipo de Pessoa Jurídica" id="tipo_pj" options={TIPOS_PJ} required />
        </div>
      </section>

      {/* ── Endereço Comercial ───────────────────────── */}
      <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-5">
          Endereço Comercial
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="sm:col-span-2">
            <Field label="CEP" id="cep" placeholder="00000-000" required />
          </div>
          <div className="sm:col-span-4">
            <Field label="Logradouro" id="logradouro" placeholder="Rua, Avenida…" required />
          </div>
          <div className="sm:col-span-2">
            <Field label="Número" id="numero" placeholder="123" required />
          </div>
          <div className="sm:col-span-2">
            <Field label="Complemento" id="complemento" placeholder="Sala, Andar…" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Bairro" id="bairro" placeholder="Centro" required />
          </div>
          <div className="sm:col-span-4">
            <Field label="Cidade" id="cidade" placeholder="São Paulo" required />
          </div>
          <div className="sm:col-span-2">
            <SelectField label="Estado (UF)" id="estado" options={ESTADOS_UF} required />
          </div>
        </div>
      </section>

      {/* ── Representante Legal ──────────────────────── */}
      <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-5">
          Representante Legal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome Completo" id="rep_nome" placeholder="João Silva" required />
          <Field label="CPF" id="rep_cpf" placeholder="000.000.000-00" required />
          <Field label="Cargo" id="rep_cargo" placeholder="Diretor, Sócio…" required />
          <Field label="Telefone ou WhatsApp" id="rep_telefone" placeholder="+55 11 99999-9999" required />
        </div>
      </section>

      {/* ── Detalhes de Contato ──────────────────────── */}
      <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-5">
          Detalhes de Contato
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefone Principal" id="tel_principal" placeholder="+55 11 3000-0000" required />
          <Field label="Telefone Secundário" id="tel_secundario" placeholder="+55 11 3000-0001" />
          <div className="sm:col-span-2">
            <Field label="Email da Empresa" id="email_empresa" type="email" placeholder="contato@empresa.com" required />
          </div>
        </div>
      </section>

      {/* ── Acesso à Plataforma ──────────────────────── */}
      <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
        <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-5">
          Acesso à Plataforma
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="E-mail do usuário" id="email_usuario" type="email" placeholder="voce@empresa.com" required />
          </div>
          <Field label="Senha" id="senha" type="password" placeholder="Mín. 8 caracteres" required />
          <Field label="Confirmar Senha" id="confirmar_senha" type="password" placeholder="Repita a senha" required />
        </div>
      </section>

      {/* ── Ações ────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          className="text-brand-gray-text hover:text-brand-black"
          onClick={() => router.push("/")}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-full px-6 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:scale-100"
        >
          {isLoading ? "Salvando…" : "Próximo →"}
        </Button>
      </div>
    </form>
  );
}

/* ── Field helpers ──────────────────────────────────────────────────────── */

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

function Field({ label, id, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-brand-gray-text uppercase tracking-wide"
      >
        {label}
        {props.required && <span className="ml-1 text-brand-accent">*</span>}
      </label>
      <input
        id={id}
        name={id}
        className="h-10 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors"
        {...props}
      />
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: string[];
}

function SelectField({ label, id, options, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-brand-gray-text uppercase tracking-wide"
      >
        {label}
        {props.required && <span className="ml-1 text-brand-accent">*</span>}
      </label>
      <select
        id={id}
        name={id}
        defaultValue=""
        className="h-10 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors appearance-none"
        {...props}
      >
        <option value="" disabled>
          Selecione…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
