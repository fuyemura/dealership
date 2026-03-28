-- =============================================================================
-- 01_schema.sql
-- Verifica a existência do schema dealership e de todas as suas tabelas.
--
-- Execução: supabase test db
-- Requisito: extensão pgTAP habilitada no banco local
-- =============================================================================

BEGIN;
SELECT plan(16);

-- Schema
SELECT has_schema('dealership', 'Schema dealership deve existir');

-- Tabelas
SELECT has_table('dealership', 'empresa',              'Tabela empresa deve existir');
SELECT has_table('dealership', 'usuario',              'Tabela usuario deve existir');
SELECT has_table('dealership', 'localizacao',          'Tabela localizacao deve existir');
SELECT has_table('dealership', 'dominio',              'Tabela dominio deve existir');
SELECT has_table('dealership', 'cliente',              'Tabela cliente deve existir');
SELECT has_table('dealership', 'veiculo',              'Tabela veiculo deve existir');
SELECT has_table('dealership', 'veiculo_arquivo',      'Tabela veiculo_arquivo deve existir');
SELECT has_table('dealership', 'qr_code',              'Tabela qr_code deve existir');
SELECT has_table('dealership', 'plano',                'Tabela plano deve existir');
SELECT has_table('dealership', 'assinatura',           'Tabela assinatura deve existir');
SELECT has_table('dealership', 'assinatura_historico', 'Tabela assinatura_historico deve existir');
SELECT has_table('dealership', 'fatura',               'Tabela fatura deve existir');
SELECT has_table('dealership', 'veiculo_custo',        'Tabela veiculo_custo deve existir');
SELECT has_table('dealership', 'veiculo_manutencao',   'Tabela veiculo_manutencao deve existir');
SELECT has_table('dealership', 'metodo_pagamento',     'Tabela metodo_pagamento deve existir');

SELECT * FROM finish();
ROLLBACK;
