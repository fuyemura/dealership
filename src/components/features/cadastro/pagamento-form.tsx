"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PagamentoForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // TODO: wire up to payment processor
    await new Promise((r) => setTimeout(r, 800));
    router.push("/minha-conta");
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
            className="h-11 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors"
          />
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
            className="h-11 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors font-mono tracking-widest"
          />
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
              className="h-11 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors"
            />
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
              className="h-11 w-full rounded-lg border border-brand-gray-mid bg-brand-gray-soft px-3 text-sm text-brand-black placeholder:text-brand-gray-mid focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black transition-colors"
            />
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-brand-gray-text leading-relaxed">
          {"Ao clicar em \"Pagar Agora\" você concorda com nossos"}{" "}
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
          {isLoading ? "Processando…" : "Pagar Agora"}
        </Button>
      </form>
    </div>
  );
}
