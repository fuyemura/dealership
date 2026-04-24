"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { detectarBandeiraCartao } from "@/lib/utils/cartao";
import type { FinalizarCadastroBody } from "@/lib/cadastro/finalizar-cadastro-schema";

export function PagamentoForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{
    cardholder?: string;
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");
  }

  function validateField(
    field: "cardholder" | "cardNumber" | "expiry" | "cvv",
    value: string
  ) {
    if (field === "cardholder") {
      if (value.trim().length < 3) return "Informe o nome completo do titular.";
      return "";
    }

    if (field === "cardNumber") {
      const digits = value.replace(/\D/g, "");
      if (digits.length < 13 || digits.length > 16) {
        return "Número de cartão inválido.";
      }
      return "";
    }

    if (field === "expiry") {
      if (!/^\d{2}\/\d{2}$/.test(value)) return "Use o formato MM/AA.";
      const [monthStr, yearStr] = value.split("/");
      const month = Number(monthStr);
      if (month < 1 || month > 12) return "Mês de validade inválido.";

      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      const year = Number(yearStr);
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return "Cartão com validade expirada.";
      }
      return "";
    }

    const cvvDigits = value.replace(/\D/g, "");
    if (cvvDigits.length < 3 || cvvDigits.length > 4) return "CVV inválido.";
    return "";
  }

  function setFieldError(field: "cardholder" | "cardNumber" | "expiry" | "cvv", value: string) {
    const nextError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: nextError || undefined }));
    return !nextError;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isCardholderValid = setFieldError("cardholder", cardholder);
    const isCardNumberValid = setFieldError("cardNumber", cardNumber);
    const isExpiryValid = setFieldError("expiry", expiry);
    const isCvvValid = setFieldError("cvv", cvv);

    if (!isCardholderValid || !isCardNumberValid || !isExpiryValid || !isCvvValid) {
      return;
    }

    setIsLoading(true);
    const digits = cardNumber.replace(/\D/g, "");
    const [mm, yy] = expiry.split("/");
    const mesExpiracao = Number(mm);
    const yShort = Number(yy);
    const anoExpiracao = 2000 + yShort;
    const bandeiraNome = detectarBandeiraCartao(digits) as FinalizarCadastroBody["metodo_pagamento"]["bandeira_nome"];
    const gatewayPaymentMethodId = `signup_local_${crypto.randomUUID()}`;

    sessionStorage.setItem(
      "signup:payment",
      JSON.stringify({
        cardholder: cardholder.trim(),
        cardLast4: digits.slice(-4),
        expiry,
        bandeiraNome,
        mesExpiracao,
        anoExpiracao,
        gatewayPaymentMethodId,
      })
    );
    await new Promise((r) => setTimeout(r, 800));
    router.push("/cadastro/empresa");
  }

  return (
    <div className="bg-brand-white rounded-xl border border-brand-gray-mid/50 p-6 sm:p-8">
      {/* Lock badge */}
      <div className="flex items-center gap-2 mb-6 text-xs text-brand-gray-text">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Pagamento seguro e criptografado
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cardholder name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="titular" className="text-xs font-medium text-brand-gray-text uppercase tracking-wide">
            Nome do Titular do Cartão <span className="text-brand-accent">*</span>
          </label>
          <input
            id="titular"
            name="titular"
            required
            placeholder="João Silva"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
            onBlur={(e) => setFieldError("cardholder", e.target.value)}
            aria-invalid={!!errors.cardholder}
            aria-describedby={errors.cardholder ? "titular-error" : undefined}
            className={`h-11 w-full rounded-lg border bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors ${
              errors.cardholder ? "border-red-400" : "border-brand-gray-mid"
            }`}
          />
          {errors.cardholder && (
            <p id="titular-error" className="text-xs text-red-500" role="alert">
              {errors.cardholder}
            </p>
          )}
        </div>

        {/* Card number */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="numero_cartao" className="text-xs font-medium text-brand-gray-text uppercase tracking-wide">
            Número do Cartão <span className="text-brand-accent">*</span>
          </label>
          <input
            id="numero_cartao"
            name="numero_cartao"
            required
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            onBlur={(e) => setFieldError("cardNumber", e.target.value)}
            aria-invalid={!!errors.cardNumber}
            aria-describedby={errors.cardNumber ? "numero_cartao-error" : undefined}
            className={`h-11 w-full rounded-lg border bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors font-mono tracking-widest ${
              errors.cardNumber ? "border-red-400" : "border-brand-gray-mid"
            }`}
          />
          {errors.cardNumber && (
            <p id="numero_cartao-error" className="text-xs text-red-500" role="alert">
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="validade" className="text-xs font-medium text-brand-gray-text uppercase tracking-wide">
              Validade <span className="text-brand-accent">*</span>
            </label>
            <input
              id="validade"
              name="validade"
              required
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onBlur={(e) => setFieldError("expiry", e.target.value)}
              aria-invalid={!!errors.expiry}
              aria-describedby={errors.expiry ? "validade-error" : undefined}
              className={`h-11 w-full rounded-lg border bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors ${
                errors.expiry ? "border-red-400" : "border-brand-gray-mid"
              }`}
            />
            {errors.expiry && (
              <p id="validade-error" className="text-xs text-red-500" role="alert">
                {errors.expiry}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cvv" className="text-xs font-medium text-brand-gray-text uppercase tracking-wide">
              CVV <span className="text-brand-accent">*</span>
            </label>
            <input
              id="cvv"
              name="cvv"
              required
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onBlur={(e) => setFieldError("cvv", e.target.value)}
              aria-invalid={!!errors.cvv}
              aria-describedby={errors.cvv ? "cvv-error" : undefined}
              className={`h-11 w-full rounded-lg border bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors ${
                errors.cvv ? "border-red-400" : "border-brand-gray-mid"
              }`}
            />
            {errors.cvv && (
              <p id="cvv-error" className="text-xs text-red-500" role="alert">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-brand-gray-text leading-relaxed">
          {"Ao clicar em \"Continuar\" você concorda com nossos"}{" "}
          <a href="/termos-de-servico" className="underline underline-offset-2 hover:text-brand-black transition-colors">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-brand-black transition-colors">
            Política de Privacidade
          </a>
          .
        </p>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full text-base font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:scale-100"
        >
          {isLoading ? "Processando…" : "Continuar"}
        </Button>
      </form>
    </div>
  );
}
