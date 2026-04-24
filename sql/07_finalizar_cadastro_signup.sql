-- =============================================================================
-- Cadastro público: grava localização, empresa, usuário admin, assinatura e
-- método de pagamento em uma única transação (falhou uma etapa = nada grava).
-- Chamada apenas via service_role (Route Handler), nunca pelo cliente anônimo.
-- =============================================================================

CREATE OR REPLACE FUNCTION dealership.finalizar_cadastro_signup(
  p_auth_id UUID,
  p_plano_id UUID,
  p_admin JSONB,
  p_empresa JSONB,
  p_localizacao JSONB,
  p_metodo_pagamento JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = dealership, pg_temp
AS $$
DECLARE
  v_loc_id         UUID;
  v_emp_id         UUID;
  v_user_id        UUID;
  v_sub_id         UUID;
  v_mp_id          UUID;
  v_papel          UUID;
  v_situacao       UUID;
  v_ciclo          UUID;
  v_bandeira       UUID;
  v_nf             VARCHAR(255);
  v_comp           VARCHAR(100);
BEGIN
  IF p_auth_id IS NULL THEN
    RAISE EXCEPTION 'auth_id é obrigatório';
  END IF;
  IF p_plano_id IS NULL THEN
    RAISE EXCEPTION 'plano_id é obrigatório';
  END IF;

  SELECT id INTO v_papel
  FROM dealership.dominio
  WHERE grupo_dominio = 'papel_usuario' AND nome_dominio = 'Administrador'
  LIMIT 1;
  IF v_papel IS NULL THEN
    RAISE EXCEPTION 'Domínio papel_usuario Administrador não encontrado';
  END IF;

  SELECT id INTO v_situacao
  FROM dealership.dominio
  WHERE grupo_dominio = 'situacao_assinatura' AND nome_dominio = 'Ativa'
  LIMIT 1;
  IF v_situacao IS NULL THEN
    RAISE EXCEPTION 'Domínio situacao_assinatura Ativa não encontrado';
  END IF;

  SELECT id INTO v_ciclo
  FROM dealership.dominio
  WHERE grupo_dominio = 'ciclo_cobranca' AND nome_dominio = 'Mensal'
  LIMIT 1;
  IF v_ciclo IS NULL THEN
    RAISE EXCEPTION 'Domínio ciclo_cobranca Mensal não encontrado';
  END IF;

  SELECT id INTO v_bandeira
  FROM dealership.dominio
  WHERE grupo_dominio = 'bandeira_cartao' AND nome_dominio = trim(p_metodo_pagamento->>'bandeira_nome')
  LIMIT 1;
  IF v_bandeira IS NULL THEN
    SELECT id INTO v_bandeira
    FROM dealership.dominio
    WHERE grupo_dominio = 'bandeira_cartao' AND nome_dominio = 'Visa'
    LIMIT 1;
  END IF;
  IF v_bandeira IS NULL THEN
    RAISE EXCEPTION 'Domínio bandeira_cartao não encontrado';
  END IF;

  v_nf := NULLIF(trim(p_empresa->>'nome_fantasia_empresa'), '');
  v_comp := NULLIF(trim(p_localizacao->>'complemento_logradouro'), '');

  INSERT INTO dealership.localizacao (
    cep,
    logradouro,
    numero_logradouro,
    complemento_logradouro,
    bairro,
    cidade,
    estado
  )
  VALUES (
    trim(p_localizacao->>'cep'),
    trim(p_localizacao->>'logradouro'),
    (p_localizacao->>'numero_logradouro')::integer,
    v_comp,
    trim(p_localizacao->>'bairro'),
    trim(p_localizacao->>'cidade'),
    upper(trim(p_localizacao->>'estado'))
  )
  RETURNING id INTO v_loc_id;

  INSERT INTO dealership.empresa (
    cnpj,
    inscricao_municipal,
    inscricao_estadual,
    nome_legal_empresa,
    nome_fantasia_empresa,
    localizacao_id,
    telefone_principal,
    telefone_secundario,
    email_empresa,
    nome_representante,
    cargo_representante,
    telefone_representante
  )
  VALUES (
    trim(p_empresa->>'cnpj'),
    trim(p_empresa->>'inscricao_municipal'),
    trim(p_empresa->>'inscricao_estadual'),
    trim(p_empresa->>'nome_legal_empresa'),
    v_nf,
    v_loc_id,
    NULLIF(trim(p_empresa->>'telefone_principal'), ''),
    NULLIF(trim(p_empresa->>'telefone_secundario'), ''),
    NULLIF(lower(trim(p_empresa->>'email_empresa')), ''),
    trim(p_empresa->>'nome_representante'),
    trim(p_empresa->>'cargo_representante'),
    NULLIF(trim(p_empresa->>'telefone_representante'), '')
  )
  RETURNING id INTO v_emp_id;

  INSERT INTO dealership.usuario (
    empresa_id,
    auth_id,
    email_usuario,
    cpf,
    nome_usuario,
    papel_usuario_id
  )
  VALUES (
    v_emp_id,
    p_auth_id,
    lower(trim(p_admin->>'email_usuario')),
    trim(p_admin->>'cpf'),
    trim(p_admin->>'nome_usuario'),
    v_papel
  )
  RETURNING id INTO v_user_id;

  INSERT INTO dealership.assinatura (
    empresa_id,
    plano_id,
    situacao_assinatura_id,
    ciclo_cobranca_id,
    data_inicio,
    trial_ativo
  )
  VALUES (
    v_emp_id,
    p_plano_id,
    v_situacao,
    v_ciclo,
    (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date,
    FALSE
  )
  RETURNING id INTO v_sub_id;

  INSERT INTO dealership.metodo_pagamento (
    empresa_id,
    gateway_payment_method_id,
    bandeira_id,
    ultimos_quatro_digitos,
    mes_expiracao,
    ano_expiracao,
    nome_titular,
    metodo_principal,
    metodo_ativo
  )
  VALUES (
    v_emp_id,
    trim(p_metodo_pagamento->>'gateway_payment_method_id'),
    v_bandeira,
    trim(p_metodo_pagamento->>'ultimos_quatro_digitos'),
    (p_metodo_pagamento->>'mes_expiracao')::smallint,
    (p_metodo_pagamento->>'ano_expiracao')::smallint,
    trim(p_metodo_pagamento->>'nome_titular'),
    TRUE,
    TRUE
  )
  RETURNING id INTO v_mp_id;

  RETURN jsonb_build_object(
    'empresa_id', v_emp_id,
    'usuario_id', v_user_id,
    'assinatura_id', v_sub_id,
    'metodo_pagamento_id', v_mp_id,
    'localizacao_id', v_loc_id
  );
END;
$$;

COMMENT ON FUNCTION dealership.finalizar_cadastro_signup IS
  'Transação atômica de cadastro público: localização, empresa, usuário admin, assinatura e método de pagamento.';

REVOKE ALL ON FUNCTION dealership.finalizar_cadastro_signup(UUID, UUID, JSONB, JSONB, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION dealership.finalizar_cadastro_signup(UUID, UUID, JSONB, JSONB, JSONB, JSONB) TO service_role;
