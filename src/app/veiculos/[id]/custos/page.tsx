import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustosVeiculo } from "./_components/custos-veiculo";
import {
  criarManutencao,
  atualizarManutencao,
  excluirManutencao,
} from "./actions";

export default async function CustosVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const empresaId = usuario.empresa_id;

  // ── Carrega todos os dados em paralelo ────────────────────────────────────
  const [
    { data: veiculo },
    { data: manutencoes },
    { data: custosCatalogo },
    { data: situacoesDominio },
  ] = await Promise.all([
    // Dados básicos do veículo para o cabeçalho e resumo financeiro
    supabase
      .schema("dealership")
      .from("veiculo")
      .select(
        `id, placa, preco_compra,
         marca:veiculo_marca!marca_veiculo_id(nome_dominio:nome),
         modelo:veiculo_modelo!modelo_veiculo_id(nome_dominio:nome)`
      )
      .eq("id", id)
      .eq("empresa_id", empresaId)
      .single(),

    // Manutenções com nome do tipo de custo e nome da situação
    supabase
      .schema("dealership")
      .from("veiculo_manutencao")
      .select(
        `id, valor_manutencao, obs_manutencao, data_conclusao,
         custo_id, situacao_manutencao_id,
         custo:veiculo_custo!custo_id(nome_custo),
         situacao:dominio!situacao_manutencao_id(nome_dominio)`
      )
      .eq("veiculo_id", id)
      .eq("empresa_id", empresaId)
      .order("data_conclusao", { ascending: false }),

    // Catálogo de tipos de custo da empresa (para o select)
    supabase
      .schema("dealership")
      .from("veiculo_custo")
      .select("id, nome_custo")
      .eq("empresa_id", empresaId)
      .order("nome_custo"),

    // Domínios de situação de manutenção
    supabase
      .schema("dealership")
      .from("dominio")
      .select("id, nome_dominio")
      .eq("grupo_dominio", "situacao_manutencao")
      .order("nome_dominio"),
  ]);

  if (!veiculo) notFound();

  // ── Normaliza os dados para o componente ──────────────────────────────────

  type ManutencaoRow = {
    id: string;
    valor_manutencao: number;
    obs_manutencao: string | null;
    data_conclusao: string;
    custo_id: string;
    situacao_manutencao_id: string;
    custo: unknown;
    situacao: unknown;
  };

  const manutencoesList = (manutencoes ?? []).map((m: ManutencaoRow) => ({
    id: m.id,
    custo_id: m.custo_id,
    nome_custo:
      (m.custo as { nome_custo: string } | null)?.nome_custo ?? "—",
    situacao_manutencao_id: m.situacao_manutencao_id,
    nome_situacao:
      (m.situacao as { nome_dominio: string } | null)?.nome_dominio ?? "—",
    valor_manutencao: m.valor_manutencao,
    obs_manutencao: m.obs_manutencao,
    data_conclusao: m.data_conclusao,
  }));

  // Pré-fixa o veiculoId em cada action (padrão adotado no projeto)
  const criarAction = criarManutencao.bind(null, id);
  const atualizarAction = atualizarManutencao.bind(null, id);
  const excluirAction = excluirManutencao.bind(null, id);

  return (
    <CustosVeiculo
      veiculo={{
        id: veiculo.id,
        placa: veiculo.placa,
        preco_compra: veiculo.preco_compra,
        marca:
          (
            veiculo.marca as unknown as { nome_dominio: string } | null
          )?.nome_dominio ?? "",
        modelo:
          (
            veiculo.modelo as unknown as { nome_dominio: string } | null
          )?.nome_dominio ?? "",
      }}
      manutencoes={manutencoesList}
      custosCatalogo={custosCatalogo ?? []}
      situacoes={situacoesDominio ?? []}
      criarAction={criarAction}
      atualizarAction={atualizarAction}
      excluirAction={excluirAction}
    />
  );
}
