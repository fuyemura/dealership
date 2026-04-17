import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VeiculoForm } from "../_components/veiculo-form";
import type { Dominios, QrCodeInfo } from "../_components/veiculo-form";
import { VeiculoArquivos } from "../_components/veiculo-arquivos";
import type { ArquivoVeiculo } from "../_components/veiculo-arquivos";
import { VeiculoZonaPerigo } from "../_components/veiculo-zona-perigo";
import {
  atualizarVeiculo,
  excluirVeiculo,
  gerarQrCode,
  uploadArquivoVeiculo,
  excluirArquivoVeiculo,
  definirFotoPrincipal,
} from "../actions";

export default async function EditarVeiculoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
}) {
  const [{ id }, { novo }] = await Promise.all([params, searchParams]);

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
      ?.nome_dominio?.toLowerCase() === "administrador";

  // Carrega veículo, marcas, modelos, domínios, QR code e arquivos em paralelo
  const [
    { data: veiculo },
    { data: marcas },
    { data: modelos },
    { data: dominiosVeiculo },
    { data: qrCodeData },
    { data: arquivosData },
  ] = await Promise.all([
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
           data_venda, data_entrega, quantidade_dias_garantia, descricao`
        )
        .eq("id", id)
        .eq("empresa_id", usuario.empresa_id)
        .single(),

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

      supabase
        .schema("dealership")
        .from("veiculo_qr_code")
        .select("url_publica, token_publica, total_visualizacoes")
        .eq("veiculo_id", id)
        .maybeSingle(),

      supabase
        .schema("dealership")
        .from("veiculo_arquivo")
        .select("id, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo, tipo_arquivo:dominio!tipo_arquivo_id(nome_dominio)")
        .eq("veiculo_id", id)
        .eq("empresa_id", usuario.empresa_id)
        .order("ordem_exibicao", { ascending: true }),
    ]);

  if (!veiculo) notFound();

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

  // Separa os arquivos por tipo
  type ArquivoRaw = {
    id: string;
    url_arquivo: string;
    arquivo_principal: boolean;
    ordem_exibicao: number;
    tamanho_arquivo: number;
    tipo_arquivo: { nome_dominio: string } | null;
  };
  // tipo_arquivo é objeto único (FK many-to-one). Se arquivos ficarem vazios em dev,
  // inspecione o shape real de arquivosData para confirmar que o join retorna objeto e não array.
  const todosArquivos = (arquivosData ?? []) as unknown as ArquivoRaw[];

  const fotos: ArquivoVeiculo[] = todosArquivos
    .filter((a) => a.tipo_arquivo?.nome_dominio?.toLowerCase() === "foto")
    .map(({ id: aid, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo }) => ({
      id: aid, url_arquivo, arquivo_principal, ordem_exibicao, tamanho_arquivo,
    }));

  const laudoRaw = todosArquivos.find((a) => a.tipo_arquivo?.nome_dominio?.toLowerCase() === "laudo") ?? null;
  const laudo: ArquivoVeiculo | null = laudoRaw
    ? { id: laudoRaw.id, url_arquivo: laudoRaw.url_arquivo, arquivo_principal: laudoRaw.arquivo_principal, ordem_exibicao: laudoRaw.ordem_exibicao, tamanho_arquivo: laudoRaw.tamanho_arquivo }
    : null;

  const uploadFotoAction = uploadArquivoVeiculo.bind(null, id, "foto");
  const uploadLaudoAction = uploadArquivoVeiculo.bind(null, id, "laudo");
  const excluirArquivoAction = excluirArquivoVeiculo.bind(null, id);
  const principalAction = definirFotoPrincipal.bind(null, id);

  return (
    <>
      <VeiculoForm
        dominios={dominios}
        salvarAction={salvarAction}
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
          quantidade_dias_garantia: (veiculo as unknown as { quantidade_dias_garantia: number | null }).quantidade_dias_garantia ?? null,
        }}
        qrCodeInicial={qrCodeInicial}
      />
      <VeiculoArquivos
        fotos={fotos}
        laudo={laudo}
        novoCadastro={novo === "1"}
        uploadFotoAction={uploadFotoAction}
        uploadLaudoAction={uploadLaudoAction}
        excluirArquivoAction={excluirArquivoAction}
        principalAction={principalAction}
      />
      {excluirAction && <VeiculoZonaPerigo excluirAction={excluirAction} />}
    </>
  );
}
