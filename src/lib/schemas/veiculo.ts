/**
 * Schema Zod compartilhado para o formulário de veículo.
 *
 * Centraliza a definição de validação client-side (veiculo-form.tsx)
 * e o tipo que o servidor recebe (VeiculoFormData em veiculos/actions.ts).
 * Qualquer campo novo deve ser adicionado aqui — o compilador TypeScript
 * garantirá consistência nos dois pontos de uso.
 */

import { z } from "zod";

const PLACA_RE = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
export { PLACA_RE };

export const veiculoBaseSchema = z.object({
  placa: z
    .string()
    .transform((v) => v.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())
    .pipe(z.string().regex(PLACA_RE, "Placa inválida. Formato: ABC1234 ou ABC1D23.")),
  renavam: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "RENAVAM deve ter 11 dígitos.")),
  numero_chassi: z
    .string()
    .min(1, "Chassi é obrigatório.")
    .max(20, "Máximo 20 caracteres."),
  marca_veiculo_id: z.string().min(1, "Selecione a marca."),
  modelo_veiculo_id: z.string().min(1, "Selecione o modelo."),
  combustivel_veiculo_id: z.string().min(1, "Selecione o combustível."),
  cambio_veiculo_id: z.string().min(1, "Selecione a transmissão."),
  direcao_veiculo_id: z.string().min(1, "Selecione a direção."),
  situacao_veiculo_id: z.string().min(1, "Selecione a situação."),
  ano_fabricacao: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido.")
    .max(new Date().getFullYear() + 1, "Ano inválido."),
  ano_modelo: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido.")
    .max(new Date().getFullYear() + 2, "Ano inválido."),
  cor_veiculo: z
    .string()
    .min(1, "Cor é obrigatória.")
    .max(20, "Máximo 20 caracteres."),
  quantidade_portas: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 porta.")
    .max(10, "Máximo 10 portas."),
  quilometragem: z.coerce.number().int().min(0, "Quilometragem inválida."),
  vidro_eletrico: z.boolean(),
  trava_eletrica: z.boolean(),
  laudo_aprovado: z.boolean(),
  data_compra: z.string()
    .min(1, "Data de compra é obrigatória.")
    .refine((v) => new Date(v) <= new Date(), "Data de compra não pode ser futura."),
  preco_compra: z.coerce.number().positive("Informe um preço de compra válido."),
  preco_venda: z.coerce.number().min(0).optional().nullable(),
  data_venda: z.string().optional().nullable(),
  data_entrega: z.string().optional().nullable(),
  descricao: z.string().max(1000, "Máximo 1000 caracteres.").optional().nullable(),
  quantidade_dias_garantia: z.coerce
    .number()
    .int()
    .min(0, "Valor inválido.")
    .max(3650, "Máximo 3650 dias.")
    .optional()
    .nullable(),
});

// Adiciona validação condicional: preço e data de venda obrigatórios quando situação = Vendido
export function buildVeiculoSchema(vendidoId: string) {
  return veiculoBaseSchema.superRefine((data, ctx) => {
    if (!vendidoId || data.situacao_veiculo_id !== vendidoId) return;
    if (!data.preco_venda || data.preco_venda <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o preço de venda.",
        path: ["preco_venda"],
      });
    }
    if (!data.data_venda) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe a data de venda.",
        path: ["data_venda"],
      });
    }
    if (data.data_entrega && data.data_venda && data.data_entrega < data.data_venda) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de entrega não pode ser anterior à data de venda.",
        path: ["data_entrega"],
      });
    }
  });
}

/**
 * Normaliza campos optional().nullable() (undefined | T | null) para T | null.
 * Usado para derivar o tipo que o servidor espera receber, onde undefined
 * não é um valor válido para campos que podem ser nulos.
 */
type NullifyUndefined<T> = {
  [K in keyof T]-?: undefined extends T[K] ? Exclude<T[K], undefined> : T[K];
};

/**
 * Tipo derivado do schema — fonte única de verdade para os campos do formulário.
 * Importado em veiculos/actions.ts em vez de uma interface manual.
 */
export type VeiculoFormData = NullifyUndefined<z.infer<typeof veiculoBaseSchema>>;
