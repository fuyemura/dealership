import type { Metadata } from "next";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { VeiculoForm } from "../_components/veiculo-form";
import type { Dominios } from "../_components/veiculo-form";
import { criarVeiculo, verificarPlacaExistente } from "../actions";

export const metadata: Metadata = {
  title: "Novo Veículo — Uyemura Tech",
};

export default async function NovoVeiculoPage() {
  const { supabase } = await getUsuarioAutorizado();

  // Carrega marcas, modelos e demais domínios em paralelo
  const [
    { data: marcas },
    { data: modelos },
    { data: dominiosVeiculo },
  ] = await Promise.all([
    supabase
      .schema("dealership")
      .from("veiculo_marca")
      .select("id, nome_dominio:nome")
      .order("nome"),
    supabase
      .schema("dealership")
      .from("veiculo_modelo")
      .select("id, marca_id, nome_dominio:nome")
      .order("nome"),
    supabase
      .schema("dealership")
      .from("dominio")
      .select("id, grupo_dominio, nome_dominio")
      .in("grupo_dominio", ["combustivel", "cambio", "tipo_direcao", "situacao_veiculo"])
      .order("nome_dominio"),
  ]);

  const agrupar = (grupo: string) =>
    (dominiosVeiculo ?? [])
      .filter((d) => d.grupo_dominio === grupo)
      .map((d) => ({ id: d.id, nome_dominio: d.nome_dominio }));

  const dominios: Dominios = {
    marcas: (marcas ?? []) as Dominios["marcas"],
    modelos: (modelos ?? []).map((m) => ({
      id: m.id,
      marca_id: (m as { marca_id?: string | null }).marca_id ?? null,
      nome_dominio: m.nome_dominio,
    })),
    combustiveis: agrupar("combustivel"),
    cambios: agrupar("cambio"),
    direcoes: agrupar("tipo_direcao"),
    situacoes: agrupar("situacao_veiculo"),
  };

  return (
    <VeiculoForm
      dominios={dominios}
      clientes={[]}
      salvarAction={criarVeiculo}
      verificarPlacaAction={verificarPlacaExistente}
    />
  );
}
