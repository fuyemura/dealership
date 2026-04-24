import { z } from "zod";
import { validarCpf } from "@/lib/utils/validators";

const bandeiras = ["Visa", "Mastercard", "Elo", "Amex", "Hipercard"] as const;

export const finalizarCadastroBodySchema = z.object({
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres."),
  planoId: z.string().uuid("Plano inválido."),
  admin: z.object({
    nome_usuario: z.string().min(1).max(255),
    email_usuario: z.string().email(),
    cpf: z
      .string()
      .transform((s) => s.replace(/\D/g, ""))
      .refine((d) => d.length === 11 && validarCpf(d), "CPF inválido."),
  }),
  empresa: z.object({
    cnpj: z
      .string()
      .transform((s) => s.replace(/\D/g, ""))
      .refine((d) => d.length === 14, "CNPJ inválido."),
    inscricao_municipal: z.string().min(1).max(50),
    inscricao_estadual: z.string().min(1).max(50),
    nome_legal_empresa: z.string().min(1).max(255),
    nome_fantasia_empresa: z
      .string()
      .max(255)
      .nullable()
      .optional()
      .transform((s) => (s == null || !String(s).trim() ? null : String(s).trim())),
    telefone_principal: z.string().max(20).nullish(),
    telefone_secundario: z.string().max(20).nullish(),
    email_empresa: z
      .string()
      .max(255)
      .optional()
      .transform((s) => {
        const t = s?.trim();
        if (!t) return null;
        return t.toLowerCase();
      })
      .superRefine((val, ctx) => {
        if (val !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "E-mail da empresa inválido." });
        }
      }),
    nome_representante: z.string().min(1).max(255),
    cargo_representante: z.string().min(1).max(255),
    telefone_representante: z.string().max(20).nullish(),
  }),
  localizacao: z.object({
    cep: z
      .string()
      .transform((s) => s.replace(/\D/g, ""))
      .refine((d) => d.length === 8, "CEP inválido."),
    logradouro: z.string().min(1).max(100),
    numero_logradouro: z.number().int().positive(),
    complemento_logradouro: z
      .string()
      .max(100)
      .nullable()
      .optional()
      .transform((s) => (s == null || !String(s).trim() ? null : String(s).trim())),
    bairro: z.string().min(1).max(100),
    cidade: z.string().min(1).max(50),
    estado: z.string().length(2).transform((s) => s.toUpperCase()),
  }),
  metodo_pagamento: z.object({
    gateway_payment_method_id: z.string().min(1).max(255),
    bandeira_nome: z.enum(bandeiras),
    ultimos_quatro_digitos: z.string().length(4),
    mes_expiracao: z.number().int().min(1).max(12),
    ano_expiracao: z.number().int().min(2000).max(2100),
    nome_titular: z.string().min(1).max(255),
  }),
});

export type FinalizarCadastroBody = z.infer<typeof finalizarCadastroBodySchema>;
