import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export type PlanoDB = {
  id: string;
  nome_plano: string;
  descricao_plano: string | null;
  preco_mensal: number;
  limite_veiculos: number;
  limite_usuarios: number;
  limite_fotos_veiculo: number;
  tem_qr_code: boolean;
  tem_relatorios: boolean;
  tem_suporte_prioritario: boolean;
};

const PLANOS_FALLBACK_DB: PlanoDB[] = [
  {
    id: "basico",
    nome_plano: "Básico",
    descricao_plano: "Para revendas que estão começando a digitalizar o estoque.",
    preco_mensal: 49.99,
    limite_veiculos: 30,
    limite_usuarios: 2,
    limite_fotos_veiculo: 10,
    tem_qr_code: true,
    tem_relatorios: false,
    tem_suporte_prioritario: false,
  },
  {
    id: "premium",
    nome_plano: "Premium",
    descricao_plano: "Para revendas em crescimento que precisam de mais recursos.",
    preco_mensal: 99.99,
    limite_veiculos: 100,
    limite_usuarios: 5,
    limite_fotos_veiculo: 20,
    tem_qr_code: true,
    tem_relatorios: true,
    tem_suporte_prioritario: true,
  },
  {
    id: "empresarial",
    nome_plano: "Empresarial",
    descricao_plano: "Para grandes operações sem limite de escala.",
    preco_mensal: 199.99,
    limite_veiculos: -1,
    limite_usuarios: -1,
    limite_fotos_veiculo: -1,
    tem_qr_code: true,
    tem_relatorios: true,
    tem_suporte_prioritario: true,
  },
];

export const getPlanosAtivos = unstable_cache(
  async (): Promise<PlanoDB[]> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return PLANOS_FALLBACK_DB;

    try {
      const supabase = createClient(url, anonKey);
      const { data, error } = await supabase
        .schema("dealership")
        .from("plano")
        .select(
          `id, nome_plano, descricao_plano, preco_mensal,
           limite_veiculos, limite_usuarios, limite_fotos_veiculo,
           tem_qr_code, tem_relatorios, tem_suporte_prioritario`
        )
        .eq("plano_ativo", true)
        .order("preco_mensal", { ascending: true });

      if (error) return PLANOS_FALLBACK_DB;
      return (data ?? []) as PlanoDB[];
    } catch {
      return PLANOS_FALLBACK_DB;
    }
  },
  ["planos-ativos"],
  { revalidate: 3600, tags: ["planos-ativos", "pricing-plans"] }
);
