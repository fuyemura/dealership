-- =============================================================================
-- 04_foreign_keys.sql
-- Verifica que todas as FK declaradas existem e apontam para as tabelas e
-- colunas corretas. Total: 44 FKs.
--
-- Nomenclatura das constraints: fk_<tabela>_<coluna>
-- Execução: supabase test db
-- =============================================================================

BEGIN;
SELECT plan(44);

-- =============================================================================
-- empresa (1 FK)
-- =============================================================================

-- fk_empresa_localizacao_id → localizacao.id
SELECT fk_ok(
    'dealership', 'empresa',      ARRAY['localizacao_id'],
    'dealership', 'localizacao',  ARRAY['id'],
    'fk_empresa_localizacao_id: empresa.localizacao_id → localizacao.id'
);

-- =============================================================================
-- usuario (2 FKs)
-- =============================================================================

-- fk_usuario_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'usuario',  ARRAY['empresa_id'],
    'dealership', 'empresa',  ARRAY['id'],
    'fk_usuario_empresa_id: usuario.empresa_id → empresa.id'
);

-- fk_usuario_papel_usuario_id → dominio.id
SELECT fk_ok(
    'dealership', 'usuario',  ARRAY['papel_usuario_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_usuario_papel_usuario_id: usuario.papel_usuario_id → dominio.id'
);

-- =============================================================================
-- cliente (2 FKs)
-- =============================================================================

-- fk_cliente_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'cliente',  ARRAY['empresa_id'],
    'dealership', 'empresa',  ARRAY['id'],
    'fk_cliente_empresa_id: cliente.empresa_id → empresa.id'
);

-- fk_cliente_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'cliente',  ARRAY['criado_por'],
    'dealership', 'usuario',  ARRAY['id'],
    'fk_cliente_criado_por: cliente.criado_por → usuario.id'
);

-- =============================================================================
-- veiculo_modelo (1 FK)
-- =============================================================================

-- fk_veiculo_modelo_marca_id → veiculo_marca.id
SELECT fk_ok(
    'dealership', 'veiculo_modelo',  ARRAY['marca_id'],
    'dealership', 'veiculo_marca',   ARRAY['id'],
    'fk_veiculo_modelo_marca_id: veiculo_modelo.marca_id → veiculo_marca.id'
);

-- =============================================================================
-- veiculo (11 FKs)
-- =============================================================================

-- fk_veiculo_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['empresa_id'],
    'dealership', 'empresa',  ARRAY['id'],
    'fk_veiculo_empresa_id: veiculo.empresa_id → empresa.id'
);

-- fk_veiculo_marca_veiculo_id → veiculo_marca.id
SELECT fk_ok(
    'dealership', 'veiculo',       ARRAY['marca_veiculo_id'],
    'dealership', 'veiculo_marca', ARRAY['id'],
    'fk_veiculo_marca_veiculo_id: veiculo.marca_veiculo_id → veiculo_marca.id'
);

-- fk_veiculo_modelo_veiculo_id → veiculo_modelo.id
SELECT fk_ok(
    'dealership', 'veiculo',        ARRAY['modelo_veiculo_id'],
    'dealership', 'veiculo_modelo', ARRAY['id'],
    'fk_veiculo_modelo_veiculo_id: veiculo.modelo_veiculo_id → veiculo_modelo.id'
);

-- fk_veiculo_combustivel_veiculo_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['combustivel_veiculo_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_veiculo_combustivel_veiculo_id: veiculo.combustivel_veiculo_id → dominio.id'
);

-- fk_veiculo_direcao_veiculo_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['direcao_veiculo_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_veiculo_direcao_veiculo_id: veiculo.direcao_veiculo_id → dominio.id'
);

-- fk_veiculo_cambio_veiculo_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['cambio_veiculo_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_veiculo_cambio_veiculo_id: veiculo.cambio_veiculo_id → dominio.id'
);

-- fk_veiculo_situacao_veiculo_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['situacao_veiculo_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_veiculo_situacao_veiculo_id: veiculo.situacao_veiculo_id → dominio.id'
);

-- fk_veiculo_vendido_para → cliente.id  (nullable)
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['vendido_para'],
    'dealership', 'cliente',  ARRAY['id'],
    'fk_veiculo_vendido_para: veiculo.vendido_para → cliente.id'
);

-- fk_veiculo_vendido_por → usuario.id  (nullable)
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['vendido_por'],
    'dealership', 'usuario',  ARRAY['id'],
    'fk_veiculo_vendido_por: veiculo.vendido_por → usuario.id'
);

-- fk_veiculo_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['criado_por'],
    'dealership', 'usuario',  ARRAY['id'],
    'fk_veiculo_criado_por: veiculo.criado_por → usuario.id'
);

-- fk_veiculo_atualizado_por → usuario.id
SELECT fk_ok(
    'dealership', 'veiculo',  ARRAY['atualizado_por'],
    'dealership', 'usuario',  ARRAY['id'],
    'fk_veiculo_atualizado_por: veiculo.atualizado_por → usuario.id'
);

-- =============================================================================
-- veiculo_arquivo (4 FKs)
-- =============================================================================

-- fk_veiculo_arquivo_veiculo_id → veiculo.id
SELECT fk_ok(
    'dealership', 'veiculo_arquivo',  ARRAY['veiculo_id'],
    'dealership', 'veiculo',          ARRAY['id'],
    'fk_veiculo_arquivo_veiculo_id: veiculo_arquivo.veiculo_id → veiculo.id'
);

-- fk_veiculo_arquivo_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'veiculo_arquivo',  ARRAY['empresa_id'],
    'dealership', 'empresa',          ARRAY['id'],
    'fk_veiculo_arquivo_empresa_id: veiculo_arquivo.empresa_id → empresa.id'
);

-- fk_veiculo_arquivo_tipo_arquivo_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo_arquivo',  ARRAY['tipo_arquivo_id'],
    'dealership', 'dominio',          ARRAY['id'],
    'fk_veiculo_arquivo_tipo_arquivo_id: veiculo_arquivo.tipo_arquivo_id → dominio.id'
);

-- fk_veiculo_arquivo_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'veiculo_arquivo',  ARRAY['criado_por'],
    'dealership', 'usuario',          ARRAY['id'],
    'fk_veiculo_arquivo_criado_por: veiculo_arquivo.criado_por → usuario.id'
);

-- =============================================================================
-- veiculo_qr_code (1 FK)
-- =============================================================================

-- fk_veiculo_qr_code_veiculo_id → veiculo.id
SELECT fk_ok(
    'dealership', 'veiculo_qr_code',  ARRAY['veiculo_id'],
    'dealership', 'veiculo',  ARRAY['id'],
    'fk_veiculo_qr_code_veiculo_id: veiculo_qr_code.veiculo_id → veiculo.id'
);

-- =============================================================================
-- assinatura (4 FKs)
-- =============================================================================

-- fk_assinatura_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'assinatura',  ARRAY['empresa_id'],
    'dealership', 'empresa',     ARRAY['id'],
    'fk_assinatura_empresa_id: assinatura.empresa_id → empresa.id'
);

-- fk_assinatura_plano_id → plano.id
SELECT fk_ok(
    'dealership', 'assinatura',  ARRAY['plano_id'],
    'dealership', 'plano',       ARRAY['id'],
    'fk_assinatura_plano_id: assinatura.plano_id → plano.id'
);

-- fk_assinatura_situacao_assinatura_id → dominio.id
SELECT fk_ok(
    'dealership', 'assinatura',  ARRAY['situacao_assinatura_id'],
    'dealership', 'dominio',     ARRAY['id'],
    'fk_assinatura_situacao_assinatura_id: assinatura.situacao_assinatura_id → dominio.id'
);

-- fk_assinatura_ciclo_cobranca_id → dominio.id
SELECT fk_ok(
    'dealership', 'assinatura',  ARRAY['ciclo_cobranca_id'],
    'dealership', 'dominio',     ARRAY['id'],
    'fk_assinatura_ciclo_cobranca_id: assinatura.ciclo_cobranca_id → dominio.id'
);

-- =============================================================================
-- fatura (4 FKs)
-- =============================================================================

-- fk_fatura_assinatura_id → assinatura.id
SELECT fk_ok(
    'dealership', 'fatura',      ARRAY['assinatura_id'],
    'dealership', 'assinatura',  ARRAY['id'],
    'fk_fatura_assinatura_id: fatura.assinatura_id → assinatura.id'
);

-- fk_fatura_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'fatura',   ARRAY['empresa_id'],
    'dealership', 'empresa',  ARRAY['id'],
    'fk_fatura_empresa_id: fatura.empresa_id → empresa.id'
);

-- fk_fatura_situacao_fatura_id → dominio.id
SELECT fk_ok(
    'dealership', 'fatura',   ARRAY['situacao_fatura_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_fatura_situacao_fatura_id: fatura.situacao_fatura_id → dominio.id'
);

-- fk_fatura_metodo_pagamento_id → dominio.id
SELECT fk_ok(
    'dealership', 'fatura',   ARRAY['metodo_pagamento_id'],
    'dealership', 'dominio',  ARRAY['id'],
    'fk_fatura_metodo_pagamento_id: fatura.metodo_pagamento_id → dominio.id'
);

-- =============================================================================
-- veiculo_custo (2 FKs)
-- =============================================================================

-- fk_veiculo_custo_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'veiculo_custo',  ARRAY['empresa_id'],
    'dealership', 'empresa',        ARRAY['id'],
    'fk_veiculo_custo_empresa_id: veiculo_custo.empresa_id → empresa.id'
);

-- fk_veiculo_custo_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'veiculo_custo',  ARRAY['criado_por'],
    'dealership', 'usuario',        ARRAY['id'],
    'fk_veiculo_custo_criado_por: veiculo_custo.criado_por → usuario.id'
);

-- =============================================================================
-- veiculo_manutencao (5 FKs)
-- =============================================================================

-- fk_veiculo_manutencao_veiculo_id → veiculo.id
SELECT fk_ok(
    'dealership', 'veiculo_manutencao',  ARRAY['veiculo_id'],
    'dealership', 'veiculo',             ARRAY['id'],
    'fk_veiculo_manutencao_veiculo_id: veiculo_manutencao.veiculo_id → veiculo.id'
);

-- fk_veiculo_manutencao_custo_id → veiculo_custo.id
SELECT fk_ok(
    'dealership', 'veiculo_manutencao',  ARRAY['custo_id'],
    'dealership', 'veiculo_custo',       ARRAY['id'],
    'fk_veiculo_manutencao_custo_id: veiculo_manutencao.custo_id → veiculo_custo.id'
);

-- fk_veiculo_manutencao_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'veiculo_manutencao',  ARRAY['empresa_id'],
    'dealership', 'empresa',             ARRAY['id'],
    'fk_veiculo_manutencao_empresa_id: veiculo_manutencao.empresa_id → empresa.id'
);

-- fk_veiculo_manutencao_situacao_manutencao_id → dominio.id
SELECT fk_ok(
    'dealership', 'veiculo_manutencao',  ARRAY['situacao_manutencao_id'],
    'dealership', 'dominio',             ARRAY['id'],
    'fk_veiculo_manutencao_situacao_manutencao_id: veiculo_manutencao.situacao_manutencao_id → dominio.id'
);

-- fk_veiculo_manutencao_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'veiculo_manutencao',  ARRAY['criado_por'],
    'dealership', 'usuario',             ARRAY['id'],
    'fk_veiculo_manutencao_criado_por: veiculo_manutencao.criado_por → usuario.id'
);

-- =============================================================================
-- metodo_pagamento (2 FKs)
-- =============================================================================

-- fk_metodo_pagamento_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'metodo_pagamento',  ARRAY['empresa_id'],
    'dealership', 'empresa',           ARRAY['id'],
    'fk_metodo_pagamento_empresa_id: metodo_pagamento.empresa_id → empresa.id'
);

-- fk_metodo_pagamento_bandeira_id → dominio.id
SELECT fk_ok(
    'dealership', 'metodo_pagamento',  ARRAY['bandeira_id'],
    'dealership', 'dominio',           ARRAY['id'],
    'fk_metodo_pagamento_bandeira_id: metodo_pagamento.bandeira_id → dominio.id'
);

-- =============================================================================
-- despesa_categoria (2 FKs)
-- =============================================================================

-- fk_despesa_categoria_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'despesa_categoria',  ARRAY['empresa_id'],
    'dealership', 'empresa',            ARRAY['id'],
    'fk_despesa_categoria_empresa_id: despesa_categoria.empresa_id → empresa.id'
);

-- fk_despesa_categoria_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'despesa_categoria',  ARRAY['criado_por'],
    'dealership', 'usuario',            ARRAY['id'],
    'fk_despesa_categoria_criado_por: despesa_categoria.criado_por → usuario.id'
);

-- =============================================================================
-- empresa_despesa (3 FKs)
-- =============================================================================

-- fk_empresa_despesa_empresa_id → empresa.id
SELECT fk_ok(
    'dealership', 'empresa_despesa',  ARRAY['empresa_id'],
    'dealership', 'empresa',          ARRAY['id'],
    'fk_empresa_despesa_empresa_id: empresa_despesa.empresa_id → empresa.id'
);

-- fk_empresa_despesa_categoria_id → despesa_categoria.id
SELECT fk_ok(
    'dealership', 'empresa_despesa',    ARRAY['categoria_id'],
    'dealership', 'despesa_categoria',  ARRAY['id'],
    'fk_empresa_despesa_categoria_id: empresa_despesa.categoria_id → despesa_categoria.id'
);

-- fk_empresa_despesa_criado_por → usuario.id
SELECT fk_ok(
    'dealership', 'empresa_despesa',  ARRAY['criado_por'],
    'dealership', 'usuario',          ARRAY['id'],
    'fk_empresa_despesa_criado_por: empresa_despesa.criado_por → usuario.id'
);

SELECT * FROM finish();
ROLLBACK;
