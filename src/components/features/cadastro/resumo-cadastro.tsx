"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatCnpj, formatCpf } from "@/lib/utils/formatters";

type SelectedPlan = { id?: string; name?: string; price?: string; period?: string };
type SignupPayment = {
  cardholder?: string;
  cardLast4?: string;
  expiry?: string;
  bandeiraNome?: string;
  mesExpiracao?: number;
  anoExpiracao?: number;
  gatewayPaymentMethodId?: string;
};
type SignupEmpresaBlock = {
  empresa: {
    cnpj: string;
    inscricao_municipal: string;
    inscricao_estadual: string;
    nome_legal_empresa: string;
    nome_fantasia_empresa: string | null;
    telefone_principal: string | null;
    telefone_secundario: string | null;
    email_empresa: string | null;
    nome_representante: string;
    cargo_representante: string;
    telefone_representante: string | null;
  };
  localizacao: {
    cep: string;
    logradouro: string;
    numero_logradouro: number;
    complemento_logradouro: string | null;
    bairro: string;
    cidade: string;
    estado: string;
  };
  admin: {
    nome_usuario: string;
    email_usuario: string;
    cpf: string;
  };
};

function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatCnpjFromDigits(d: string): string {
  return formatCnpj(d);
}

export function ResumoCadastro() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = useMemo(
    () => ({
      block: readStorage<SignupEmpresaBlock>("signup:empresaBlock"),
      plan: readStorage<SelectedPlan>("signup:selectedPlan"),
      payment: readStorage<SignupPayment>("signup:payment"),
      credentials: readStorage<{ senha: string }>("signup:credentials"),
    }),
    []
  );

  const incomplete =
    !data.block?.empresa?.cnpj ||
    !data.block?.localizacao?.cep ||
    !data.block?.admin?.cpf ||
    !data.plan?.id ||
    !data.payment?.gatewayPaymentMethodId ||
    !data.credentials?.senha;

  async function handleFinalizar() {
    setError(null);
    if (incomplete || !data.block || !data.plan?.id || !data.payment || !data.credentials) {
      setError(
        "Dados incompletos. Percorra o cadastro (plano, pagamento e empresa) e tente novamente."
      );
      return;
    }

    const { empresa, localizacao, admin } = data.block;

    if (
      !data.payment.mesExpiracao ||
      !data.payment.anoExpiracao ||
      !data.payment.bandeiraNome ||
      !data.payment.cardLast4
    ) {
      setError("Dados de pagamento incompletos. Volte à etapa de pagamento.");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = {
        senha: data.credentials.senha,
        planoId: data.plan.id,
        admin,
        empresa,
        localizacao,
        metodo_pagamento: {
          gateway_payment_method_id: data.payment.gatewayPaymentMethodId,
          bandeira_nome: data.payment.bandeiraNome,
          ultimos_quatro_digitos: data.payment.cardLast4,
          mes_expiracao: data.payment.mesExpiracao,
          ano_expiracao: data.payment.anoExpiracao,
          nome_titular: data.payment.cardholder ?? "",
        },
      };

      const res = await fetch("/api/cadastro/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(json.error ?? "Não foi possível concluir o cadastro.");
        setIsSubmitting(false);
        return;
      }

      sessionStorage.removeItem("signup:empresaBlock");
      sessionStorage.removeItem("signup:credentials");
      sessionStorage.removeItem("signup:selectedPlan");
      sessionStorage.removeItem("signup:payment");

      const supabase = createClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: admin.email_usuario,
        password: data.credentials.senha,
      });

      if (signErr) {
        router.replace("/login?novaConta=1");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erro de rede. Verifique sua conexão e tente novamente.");
      setIsSubmitting(false);
    }
  }

  const e = data.block?.empresa;
  const a = data.block?.admin;

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {incomplete && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          Alguns dados da jornada não foram encontrados (sessão expirou ou etapa pulada). Use Voltar e
          conclua cada etapa em sequência.
        </div>
      )}

      <SummaryCard title="Plano Escolhido">
        <SummaryRow label="Plano" value={data.plan?.name} />
        <SummaryRow
          label="Preço"
          value={data.plan?.price ? `${data.plan.price} ${data.plan.period ?? ""}` : ""}
        />
      </SummaryCard>

      <SummaryCard title="Pagamento">
        <SummaryRow label="Titular" value={data.payment?.cardholder} />
        <SummaryRow
          label="Cartão"
          value={data.payment?.cardLast4 ? `**** **** **** ${data.payment.cardLast4}` : ""}
        />
        <SummaryRow label="Validade" value={data.payment?.expiry} />
        <SummaryRow label="Bandeira" value={data.payment?.bandeiraNome} />
      </SummaryCard>

      <SummaryCard title="Empresa">
        <SummaryRow label="Razão Social" value={e?.nome_legal_empresa} />
        <SummaryRow label="CNPJ" value={e?.cnpj ? formatCnpjFromDigits(e.cnpj) : ""} />
        <SummaryRow label="Nome Fantasia" value={e?.nome_fantasia_empresa ?? ""} />
        <SummaryRow label="E-mail da Empresa" value={e?.email_empresa ?? ""} />
      </SummaryCard>

      <SummaryCard title="Usuário Administrador">
        <SummaryRow label="Nome" value={a?.nome_usuario} />
        <SummaryRow label="E-mail" value={a?.email_usuario} />
        <SummaryRow label="CPF" value={a?.cpf ? formatCpf(a.cpf) : ""} />
      </SummaryCard>

      <div className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-brand-gray-text">
          Revise os dados antes de concluir a criação da conta.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => router.push("/cadastro/empresa")}
          >
            ← Voltar
          </Button>
          <Button
            type="button"
            className="rounded-full px-6"
            disabled={isSubmitting || !!incomplete}
            onClick={handleFinalizar}
          >
            {isSubmitting ? "Concluindo…" : "Finalizar criação da conta"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6">
      <h2 className="font-display text-base sm:text-lg font-semibold text-brand-black mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-brand-gray-text uppercase tracking-wide">{label}</p>
      <p className="text-sm text-brand-black mt-1">{value || "Não informado"}</p>
    </div>
  );
}
