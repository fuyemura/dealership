import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VeiculoForm } from "../_components/veiculo-form";
import type { Dominios, QrCodeInfo } from "../_components/veiculo-form";
import { atualizarVeiculo, excluirVeiculo, gerarQrCode } from "../actions";

export default async function EditarVeiculoPage({
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
    .select("empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  const isAdmin =
    (usuario.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio === "administrador";

  // Carrega veículo e domínios em paralelo
  const [{ data: veiculo }, { data: todosDominios }, { data: qrCodeData }] =
    await Promise.all([
      supabase
        .schema("dealership")
        .from("veiculo")
        .select(
          `id, placa, renavam, numero_chassi,
           marca_veiculo_id, modelo_veiculo_id, combustivel_veiculo_id,
           cambio_veiculo_id, direcao_veiculo_id, situacao_veiculo_id,
           ano_fabricacao, ano_modelo, cor_veiculo,
           quantidade_portas, quilometragem,
           vidro_eletrico, trava_eletrica, laudo_aprovado,
           data_compra, preco_compra, preco_venda,
           data_venda, data_entrega, descricao`
        )
        .eq("id", id)
        .eq("empresa_id", usuario.empresa_id)
        .single(),

      supabase
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
        .order("nome_dominio"),

      supabase
        .schema("dealership")
        .from("qr_code")
        .select("url_publica, token_publica, total_visualizacoes")
        .eq("veiculo_id", id)
        .maybeSingle(),
    ]);

  if (!veiculo) notFound();

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

  const qrCodeInicial: QrCodeInfo | null = qrCodeData
    ? {
        url_publica: qrCodeData.url_publica,
        token_publica: qrCodeData.token_publica,
        total_visualizacoes: qrCodeData.total_visualizacoes,
      }
    : null;

  const salvarAction = atualizarVeiculo.bind(null, id);
  const excluirAction = isAdmin ? excluirVeiculo.bind(null, id) : undefined;
  const gerarQrCodeAction = gerarQrCode.bind(null, id);

  return (
    <VeiculoForm
      dominios={dominios}
      salvarAction={salvarAction}
      excluirAction={excluirAction}
      gerarQrCodeAction={gerarQrCodeAction}
      initialData={{
        id: veiculo.id,
        placa: veiculo.placa,
        renavam: veiculo.renavam,
        numero_chassi: veiculo.numero_chassi,
        marca_veiculo_id: veiculo.marca_veiculo_id,
        modelo_veiculo_id: veiculo.modelo_veiculo_id,
        combustivel_veiculo_id: veiculo.combustivel_veiculo_id,
        cambio_veiculo_id: veiculo.cambio_veiculo_id,
        direcao_veiculo_id: veiculo.direcao_veiculo_id,
        situacao_veiculo_id: veiculo.situacao_veiculo_id,
        ano_fabricacao: veiculo.ano_fabricacao,
        ano_modelo: veiculo.ano_modelo,
        cor_veiculo: veiculo.cor_veiculo,
        quantidade_portas: veiculo.quantidade_portas,
        quilometragem: veiculo.quilometragem,
        vidro_eletrico: veiculo.vidro_eletrico,
        trava_eletrica: veiculo.trava_eletrica,
        laudo_aprovado: veiculo.laudo_aprovado,
        data_compra: veiculo.data_compra,
        preco_compra: veiculo.preco_compra,
        preco_venda: veiculo.preco_venda ?? null,
        data_venda: veiculo.data_venda ?? null,
        data_entrega: veiculo.data_entrega ?? null,
        descricao: veiculo.descricao ?? null,
      }}
      qrCodeInicial={qrCodeInicial}
    />
  );
}
