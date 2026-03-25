-- =============================================================================
-- 03_unique_constraints.sql
-- Verifica constraints UNIQUE declaradas no schema dealership.
-- Cobre constraints simples e compostas (multi-coluna).
--
-- Execução: supabase test db
-- =============================================================================

BEGIN;
SELECT plan(13);

-- -----------------------------------------------------------------------------
-- empresa
-- uk_empresa_cnpj: CNPJ global único
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'empresa', 'cnpj',
    'uk_empresa_cnpj: empresa.cnpj deve ser único globalmente'
);

-- -----------------------------------------------------------------------------
-- usuario
-- uk_usuario_auth_id      : vínculo com Supabase Auth (1 auth_id por usuário)
-- uk_usuario_email_usuario: e-mail único entre todos os usuários
-- uk_usuario_cpf          : CPF único entre todos os usuários
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'usuario', 'auth_id',
    'uk_usuario_auth_id: usuario.auth_id deve ser único'
);
SELECT col_is_unique(
    'dealership', 'usuario', 'email_usuario',
    'uk_usuario_email_usuario: usuario.email_usuario deve ser único'
);
SELECT col_is_unique(
    'dealership', 'usuario', 'cpf',
    'uk_usuario_cpf: usuario.cpf deve ser único'
);

-- -----------------------------------------------------------------------------
-- dominio
-- uk_dominio_grupo_dominio_nome_dominio: sem duplicatas dentro do mesmo grupo
-- (constraint composta)
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'dominio', ARRAY['grupo_dominio', 'nome_dominio'],
    'uk_dominio: (grupo_dominio, nome_dominio) deve ser único'
);

-- -----------------------------------------------------------------------------
-- cliente
-- uk_cliente_empresa_id_cpf: CPF único por empresa (tenant isolation)
-- (constraint composta)
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'cliente', ARRAY['empresa_id', 'cpf'],
    'uk_cliente_empresa_id_cpf: (empresa_id, cpf) deve ser único por empresa'
);

-- -----------------------------------------------------------------------------
-- veiculo
-- uk_veiculo_empresa_id_placa: placa única por empresa (tenant isolation)
-- uk_veiculo_numero_chassi   : chassi único globalmente
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'veiculo', ARRAY['empresa_id', 'placa'],
    'uk_veiculo_empresa_id_placa: (empresa_id, placa) deve ser único por empresa'
);
SELECT col_is_unique(
    'dealership', 'veiculo', 'numero_chassi',
    'uk_veiculo_numero_chassi: veiculo.numero_chassi deve ser único globalmente'
);

-- -----------------------------------------------------------------------------
-- qr_code
-- uk_qr_code_token_publica: token de acesso único
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'qr_code', 'token_publica',
    'uk_qr_code_token_publica: qr_code.token_publica deve ser único'
);

-- -----------------------------------------------------------------------------
-- plano
-- uk_plano_nome_plano: nome do plano único no catálogo
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'plano', 'nome_plano',
    'uk_plano_nome_plano: plano.nome_plano deve ser único'
);

-- -----------------------------------------------------------------------------
-- assinatura
-- uk_assinatura_empresa_id: cada empresa pode ter no máximo 1 assinatura ativa
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'assinatura', 'empresa_id',
    'uk_assinatura_empresa_id: cada empresa pode ter somente 1 assinatura'
);

-- -----------------------------------------------------------------------------
-- fatura
-- uk_fatura_numero_fatura    : número legível único
-- uk_fatura_gateway_fatura_id: ID do gateway externo único
-- -----------------------------------------------------------------------------
SELECT col_is_unique(
    'dealership', 'fatura', 'numero_fatura',
    'uk_fatura_numero_fatura: fatura.numero_fatura deve ser único'
);
SELECT col_is_unique(
    'dealership', 'fatura', 'gateway_fatura_id',
    'uk_fatura_gateway_fatura_id: fatura.gateway_fatura_id deve ser único'
);

SELECT * FROM finish();
ROLLBACK;
