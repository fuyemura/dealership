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
