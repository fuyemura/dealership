import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VeiculoForm } from "../_components/veiculo-form";
import type { Dominios } from "../_components/veiculo-form";
import { criarVeiculo, verificarPlacaExistente } from "../actions";

export default async function NovoVeiculoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

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
      marca_id: (m as unknown as { marca_id?: string | null }).marca_id ?? null,
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
      salvarAction={criarVeiculo}
      verificarPlacaAction={verificarPlacaExistente}
    />
  );
}
