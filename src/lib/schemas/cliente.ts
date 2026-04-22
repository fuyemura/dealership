import { z } from "zod";

export const clienteSchema = z
  .object({
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
    // Endereço (opcional)
    cep: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
    logradouro: z
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .optional()
      .transform((v) => v ?? ""),
    numero_logradouro: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
    complemento_logradouro: z
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .optional()
      .transform((v) => v ?? ""),
    bairro: z
      .string()
      .max(100, "Máximo de 100 caracteres.")
      .optional()
      .transform((v) => v ?? ""),
    cidade: z
      .string()
      .max(50, "Máximo de 50 caracteres.")
      .optional()
      .transform((v) => v ?? ""),
    estado: z
      .string()
      .optional()
      .transform((v) => v ?? ""),
  })
  .superRefine((data, ctx) => {
    const temEndereco =
      data.cep || data.logradouro || data.numero_logradouro || data.bairro || data.cidade || data.estado;

    if (!temEndereco) return;

    if (!data.cep || !/^\d{5}-\d{3}$/.test(data.cep)) {
      ctx.addIssue({ code: "custom", path: ["cep"], message: "CEP inválido (use o formato 00000-000)." });
    }
    if (!data.logradouro) {
      ctx.addIssue({ code: "custom", path: ["logradouro"], message: "O logradouro é obrigatório." });
    }
    if (!data.numero_logradouro || !/^\d+$/.test(data.numero_logradouro) || parseInt(data.numero_logradouro, 10) <= 0) {
      ctx.addIssue({ code: "custom", path: ["numero_logradouro"], message: "Número inválido." });
    }
    if (!data.bairro) {
      ctx.addIssue({ code: "custom", path: ["bairro"], message: "O bairro é obrigatório." });
    }
    if (!data.cidade) {
      ctx.addIssue({ code: "custom", path: ["cidade"], message: "A cidade é obrigatória." });
    }
    if (!data.estado || data.estado.length !== 2) {
      ctx.addIssue({ code: "custom", path: ["estado"], message: "Informe a UF." });
    }
  });

export type ClienteFormValues = z.infer<typeof clienteSchema>;
