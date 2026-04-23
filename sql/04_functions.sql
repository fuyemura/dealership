-- =============================================================================
-- Funções transacionais — schema dealership
-- =============================================================================

-- -----------------------------------------------------------------------------
-- atualizar_empresa_completa
--
-- Atualiza empresa e localizacao em uma única transação, evitando estado
-- parcialmente persistido caso uma das operações falhe.
--
-- SECURITY INVOKER: executa como o usuário que chama a função, mantendo o RLS
-- ativo. SET search_path = '' força qualificação completa de todos os objetos,
-- prevenindo ataques de search_path injection.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION dealership.atualizar_empresa_completa(
  p_empresa_id             UUID,
  -- empresa
  p_nome_legal_empresa     TEXT,
  p_nome_fantasia_empresa  TEXT,
  p_inscricao_municipal    TEXT,
  p_inscricao_estadual     TEXT,
  p_telefone_principal     TEXT,
  p_telefone_secundario    TEXT,
  p_email_empresa          TEXT,
  p_nome_representante     TEXT,
  p_cargo_representante    TEXT,
  p_telefone_representante TEXT,
  -- localizacao
  p_cep                    TEXT,
  p_logradouro             TEXT,
  p_numero_logradouro      INTEGER,
  p_complemento_logradouro TEXT,
  p_bairro                 TEXT,
  p_cidade                 TEXT,
  p_estado                 TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_localizacao_id UUID;
BEGIN
  -- Resolve localizacao_id dentro da mesma transação (evita SELECT extra no app)
  SELECT localizacao_id INTO v_localizacao_id
  FROM dealership.empresa
  WHERE id = p_empresa_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'empresa não encontrada: %', p_empresa_id
      USING ERRCODE = 'P0002';
  END IF;

  -- Atualiza localização
  UPDATE dealership.localizacao SET
    cep                    = p_cep,
    logradouro             = p_logradouro,
    numero_logradouro      = p_numero_logradouro,
    complemento_logradouro = p_complemento_logradouro,
    bairro                 = p_bairro,
    cidade                 = p_cidade,
    estado                 = p_estado,
    atualizado_em          = NOW()
  WHERE id = v_localizacao_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'localizacao não encontrada: %', v_localizacao_id
      USING ERRCODE = 'P0002';
  END IF;

  -- Atualiza empresa
  UPDATE dealership.empresa SET
    nome_legal_empresa     = p_nome_legal_empresa,
    nome_fantasia_empresa  = p_nome_fantasia_empresa,
    inscricao_municipal    = p_inscricao_municipal,
    inscricao_estadual     = p_inscricao_estadual,
    telefone_principal     = p_telefone_principal,
    telefone_secundario    = p_telefone_secundario,
    email_empresa          = p_email_empresa,
    nome_representante     = p_nome_representante,
    cargo_representante    = p_cargo_representante,
    telefone_representante = p_telefone_representante,
    atualizado_em          = NOW()
  WHERE id = p_empresa_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'empresa não encontrada ou acesso negado: %', p_empresa_id
      USING ERRCODE = 'P0002';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION dealership.atualizar_empresa_completa TO authenticated;


-- -----------------------------------------------------------------------------
-- incrementar_visualizacao
--
-- Incremento atômico do contador de visualizações do QR Code.
-- Evita race condition da sequência read → write feita no app.
--
-- SECURITY DEFINER: executada como o owner do schema, necessário pois a tabela
-- veiculo_qr_code não tem policy de UPDATE para usuários anônimos (acesso público).
-- SET search_path = '' previne search_path injection.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION dealership.incrementar_visualizacao(p_qr_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE dealership.veiculo_qr_code
  SET total_visualizacoes = total_visualizacoes + 1
  WHERE id = p_qr_id;
$$;

GRANT EXECUTE ON FUNCTION dealership.incrementar_visualizacao TO anon, authenticated;

-- =============================================================================
-- RPC: excluir_veiculo
-- Exclui atomicamente todos os registros do banco relacionados a um veículo
-- dentro de uma única transação, eliminando o risco de estado inconsistente
-- da abordagem sequencial anterior (ex.: veiculo_arquivo deletado mas veiculo
-- ainda existente em caso de falha parcial).
--
-- Retorno: SETOF TEXT com os caminho_storage de cada veiculo_arquivo excluído.
-- O chamador (server action) utiliza esses caminhos para remover os arquivos do
-- Storage APÓS a transação — se o Storage falhar, o DB já está limpo (arquivos
-- ficam órfãos, não o contrário).
--
-- Segurança: p_empresa_id é validado explicitamente para garantir ownership;
-- SECURITY DEFINER com search_path fixo previne privilege escalation.
-- =============================================================================

CREATE OR REPLACE FUNCTION dealership.excluir_veiculo(
  p_veiculo_id  UUID,
  p_empresa_id  UUID
)
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = dealership
AS $$
BEGIN
  -- Valida ownership antes de qualquer operação destrutiva
  IF NOT EXISTS (
    SELECT 1 FROM dealership.veiculo
    WHERE id = p_veiculo_id
      AND empresa_id = p_empresa_id
  ) THEN
    RAISE EXCEPTION 'veiculo_nao_encontrado'
      USING ERRCODE = 'P0001';
  END IF;

  -- Exclui arquivos e retorna caminhos de Storage para o caller
  RETURN QUERY
    DELETE FROM dealership.veiculo_arquivo
    WHERE veiculo_id = p_veiculo_id
    RETURNING caminho_storage;

  -- Exclui registros relacionados
  DELETE FROM dealership.veiculo_manutencao
  WHERE veiculo_id = p_veiculo_id;

  DELETE FROM dealership.veiculo_qr_code
  WHERE veiculo_id = p_veiculo_id;

  -- Exclui o veículo (valida empresa_id novamente por segurança)
  DELETE FROM dealership.veiculo
  WHERE id = p_veiculo_id
    AND empresa_id = p_empresa_id;
END;
$$;

COMMENT ON FUNCTION dealership.excluir_veiculo(UUID, UUID) IS
  'Exclui atomicamente veiculo e todos os seus registros filhos. '
  'Retorna os caminho_storage dos arquivos para exclusão no Storage pelo chamador.';


-- =============================================================================
-- RPC: buscar_veiculo_publico
--
-- Centraliza o acesso de leitura público (anon) aos dados de um veículo
-- identificado por token de QR Code. Substitui o uso de createAdminClient()
-- (service role key) na página /v/[token], eliminando o bypass irrestrito de RLS.
--
-- A função é SECURITY DEFINER (executa como owner do schema) e exposta
-- apenas ao necessário via GRANT TO anon/authenticated. Isso garante que:
--   1. Nenhuma chave de service role fica exposta em código de página pública.
--   2. O acesso é restrito ao subconjunto de campos públicos do veículo.
--   3. O contador de visualizações é incrementado atomicamente na mesma transação.
--
-- SET search_path = '' previne search_path injection.
-- =============================================================================

CREATE OR REPLACE FUNCTION dealership.buscar_veiculo_publico(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_qr    RECORD;
  v_veic  RECORD;
  v_emp   RECORD;
  v_doms  JSONB;
  v_arqs  JSONB;
BEGIN
  -- 1. Resolve o QR Code pelo token
  SELECT id, veiculo_id, total_visualizacoes
    INTO v_qr
    FROM dealership.veiculo_qr_code
   WHERE token_publica = p_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- 2. Incrementa o contador atomicamente
  UPDATE dealership.veiculo_qr_code
     SET total_visualizacoes = total_visualizacoes + 1
   WHERE id = v_qr.id;

  -- 3. Busca os dados públicos do veículo + marca + modelo
  SELECT
    v.placa,
    v.cor_veiculo,
    v.ano_fabricacao,
    v.ano_modelo,
    v.quilometragem,
    v.preco_venda,
    v.preco_venda_sugerido,
    v.vidro_eletrico,
    v.trava_eletrica,
    v.quantidade_portas,
    v.laudo_aprovado,
    v.descricao,
    v.situacao_veiculo_id,
    v.combustivel_veiculo_id,
    v.cambio_veiculo_id,
    v.direcao_veiculo_id,
    v.empresa_id,
    m.nome  AS marca_nome,
    mo.nome AS modelo_nome
  INTO v_veic
  FROM  dealership.veiculo v
  LEFT JOIN dealership.veiculo_marca  m  ON m.id  = v.marca_veiculo_id
  LEFT JOIN dealership.veiculo_modelo mo ON mo.id = v.modelo_veiculo_id
  WHERE v.id = v_qr.veiculo_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- 4. Busca dados públicos da empresa
  SELECT
    nome_fantasia_empresa,
    nome_legal_empresa,
    telefone_principal,
    email_empresa
  INTO v_emp
  FROM dealership.empresa
  WHERE id = v_veic.empresa_id;

  -- 5. Agrega domínios necessários para resolução de labels
  SELECT jsonb_agg(jsonb_build_object('id', d.id, 'nome_dominio', d.nome_dominio))
    INTO v_doms
    FROM dealership.dominio d
   WHERE d.grupo_dominio IN ('combustivel', 'cambio', 'tipo_direcao', 'situacao_veiculo');

  -- 6. Agrega arquivos (fotos e laudo), ordenando principal + ordem
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',               a.id,
      'url_arquivo',      a.url_arquivo,
      'arquivo_principal', a.arquivo_principal,
      'ordem_exibicao',   a.ordem_exibicao,
      'tipo_nome',        d.nome_dominio
    )
    ORDER BY a.arquivo_principal DESC, a.ordem_exibicao ASC
  )
  INTO v_arqs
  FROM dealership.veiculo_arquivo a
  LEFT JOIN dealership.dominio d ON d.id = a.tipo_arquivo_id
  WHERE a.veiculo_id = v_qr.veiculo_id;

  RETURN jsonb_build_object(
    'qr_id',                v_qr.id,
    'total_visualizacoes',  v_qr.total_visualizacoes + 1,
    'veiculo', jsonb_build_object(
      'placa',                  v_veic.placa,
      'cor_veiculo',            v_veic.cor_veiculo,
      'ano_fabricacao',         v_veic.ano_fabricacao,
      'ano_modelo',             v_veic.ano_modelo,
      'quilometragem',          v_veic.quilometragem,
      'preco_venda',            v_veic.preco_venda,
      'preco_venda_sugerido',   v_veic.preco_venda_sugerido,
      'vidro_eletrico',         v_veic.vidro_eletrico,
      'trava_eletrica',         v_veic.trava_eletrica,
      'quantidade_portas',      v_veic.quantidade_portas,
      'laudo_aprovado',         v_veic.laudo_aprovado,
      'descricao',              v_veic.descricao,
      'situacao_veiculo_id',    v_veic.situacao_veiculo_id,
      'combustivel_veiculo_id', v_veic.combustivel_veiculo_id,
      'cambio_veiculo_id',      v_veic.cambio_veiculo_id,
      'direcao_veiculo_id',     v_veic.direcao_veiculo_id,
      'marca_nome',             v_veic.marca_nome,
      'modelo_nome',            v_veic.modelo_nome
    ),
    'empresa', jsonb_build_object(
      'nome_fantasia_empresa',  v_emp.nome_fantasia_empresa,
      'nome_legal_empresa',     v_emp.nome_legal_empresa,
      'telefone_principal',     v_emp.telefone_principal,
      'email_empresa',          v_emp.email_empresa
    ),
    'dominios', COALESCE(v_doms, '[]'::jsonb),
    'arquivos', COALESCE(v_arqs, '[]'::jsonb)
  );
END;
$$;

-- Concede execução para anon (página pública) e authenticated (prevenção de erro)
GRANT EXECUTE ON FUNCTION dealership.buscar_veiculo_publico(TEXT) TO anon, authenticated;
