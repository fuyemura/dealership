import { notFound, redirect } from "next/navigation";
import { getUsuarioAutorizado } from "@/lib/auth/guards";
import { PAPEIS } from "@/lib/auth/roles";
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

// ─── Tipo local para o registro de veículo selecionado ──────────────────────

type VeiculoEditRow = {
  id: string;
  placa: string;
  renavam: string;
  numero_chassi: string;
  marca_veiculo_id: string;
  modelo_veiculo_id: string;
  combustivel_veiculo_id: string;
  cambio_veiculo_id: string;
  direcao_veiculo_id: string;
  situacao_veiculo_id: string;
  ano_fabricacao: number;
  ano_modelo: number;
  cor_veiculo: string;
  quantidade_portas: number;
  quilometragem: number;
  vidro_eletrico: boolean;
  trava_eletrica: boolean;
  laudo_aprovado: boolean;
  data_compra: string;
  preco_compra: number;
  preco_venda: number | null;
  data_venda: string | null;
  data_entrega: string | null;
  quantidade_dias_garantia: number | null;
  descricao: string | null;
};

export default async function EditarVeiculoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ novo?: string }>;
}) {
  const [{ id }, { novo }] = await Promise.all([params, searchParams]);

  const { supabase, usuarioAtual, papel } = await getUsuarioAutorizado();
  const isAdmin = papel === PAPEIS.ADMINISTRADOR;

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
        .eq("empresa_id", usuarioAtual.empresa_id)
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
        .eq("empresa_id", usuarioAtual.empresa_id)
        .order("ordem_exibicao", { ascending: true }),
    ]);

  if (!veiculo) notFound();

  const v = veiculo as unknown as VeiculoEditRow;

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
          id: v.id,
          placa: v.placa,
          renavam: v.renavam,
          numero_chassi: v.numero_chassi,
          marca_veiculo_id: v.marca_veiculo_id,
          modelo_veiculo_id: v.modelo_veiculo_id,
          combustivel_veiculo_id: v.combustivel_veiculo_id,
          cambio_veiculo_id: v.cambio_veiculo_id,
          direcao_veiculo_id: v.direcao_veiculo_id,
          situacao_veiculo_id: v.situacao_veiculo_id,
          ano_fabricacao: v.ano_fabricacao,
          ano_modelo: v.ano_modelo,
          cor_veiculo: v.cor_veiculo,
          quantidade_portas: v.quantidade_portas,
          quilometragem: v.quilometragem,
          vidro_eletrico: v.vidro_eletrico,
          trava_eletrica: v.trava_eletrica,
          laudo_aprovado: v.laudo_aprovado,
          data_compra: v.data_compra,
          preco_compra: v.preco_compra,
          preco_venda: v.preco_venda ?? null,
          data_venda: v.data_venda ?? null,
          data_entrega: v.data_entrega ?? null,
          descricao: v.descricao ?? null,
          quantidade_dias_garantia: v.quantidade_dias_garantia ?? null,
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
