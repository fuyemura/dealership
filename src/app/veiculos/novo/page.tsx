import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VeiculoForm } from "../_components/veiculo-form";
import type { Dominios } from "../_components/veiculo-form";
import { criarVeiculo } from "../actions";

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

  // Carrega todos os domínios necessários em uma única query
  const { data: todosDominios } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id, grupo_dominio, nome_dominio")
    .in("grupo_dominio", [
      "marca",
      "modelo",
      "combustivel",
      "cambio",
      "tipo_direcao",
      "situacao_veiculo",
    ])
    .order("nome_dominio");

  const agrupar = (grupo: string) =>
    (todosDominios ?? [])
      .filter((d) => d.grupo_dominio === grupo)
      .map((d) => ({ id: d.id, nome_dominio: d.nome_dominio }));

  const dominios: Dominios = {
    marcas: agrupar("marca"),
    modelos: agrupar("modelo"),
    combustiveis: agrupar("combustivel"),
    cambios: agrupar("cambio"),
    direcoes: agrupar("tipo_direcao"),
    situacoes: agrupar("situacao_veiculo"),
  };

  return (
    <VeiculoForm
      dominios={dominios}
      salvarAction={criarVeiculo}
    />
  );
}
