-- =============================================================================
-- 02_primary_keys.sql
-- Verifica Primary Keys: existência da constraint e que a coluna 'id' é a PK
-- em todas as 15 tabelas do schema dealership.
--
-- Execução: supabase test db
-- =============================================================================

BEGIN;
SELECT plan(30);

-- empresa
SELECT has_pk  ('dealership', 'empresa',              'empresa deve ter PK');
SELECT col_is_pk('dealership', 'empresa',  'id',      'empresa.id é a PK');

-- usuario
SELECT has_pk  ('dealership', 'usuario',              'usuario deve ter PK');
SELECT col_is_pk('dealership', 'usuario',  'id',      'usuario.id é a PK');

-- localizacao
SELECT has_pk  ('dealership', 'localizacao',          'localizacao deve ter PK');
SELECT col_is_pk('dealership', 'localizacao', 'id',   'localizacao.id é a PK');

-- dominio
SELECT has_pk  ('dealership', 'dominio',              'dominio deve ter PK');
SELECT col_is_pk('dealership', 'dominio', 'id',       'dominio.id é a PK');

-- cliente
SELECT has_pk  ('dealership', 'cliente',              'cliente deve ter PK');
SELECT col_is_pk('dealership', 'cliente', 'id',       'cliente.id é a PK');

-- veiculo
SELECT has_pk  ('dealership', 'veiculo',              'veiculo deve ter PK');
SELECT col_is_pk('dealership', 'veiculo', 'id',       'veiculo.id é a PK');

-- veiculo_arquivo
SELECT has_pk  ('dealership', 'veiculo_arquivo',       'veiculo_arquivo deve ter PK');
SELECT col_is_pk('dealership', 'veiculo_arquivo', 'id', 'veiculo_arquivo.id é a PK');

-- qr_code
SELECT has_pk  ('dealership', 'qr_code',              'qr_code deve ter PK');
SELECT col_is_pk('dealership', 'qr_code', 'id',       'qr_code.id é a PK');

-- plano
SELECT has_pk  ('dealership', 'plano',                'plano deve ter PK');
SELECT col_is_pk('dealership', 'plano', 'id',         'plano.id é a PK');

-- assinatura
SELECT has_pk  ('dealership', 'assinatura',           'assinatura deve ter PK');
SELECT col_is_pk('dealership', 'assinatura', 'id',    'assinatura.id é a PK');

-- assinatura_historico
SELECT has_pk  ('dealership', 'assinatura_historico',      'assinatura_historico deve ter PK');
SELECT col_is_pk('dealership', 'assinatura_historico', 'id', 'assinatura_historico.id é a PK');

-- fatura
SELECT has_pk  ('dealership', 'fatura',               'fatura deve ter PK');
SELECT col_is_pk('dealership', 'fatura', 'id',        'fatura.id é a PK');

-- veiculo_custo
SELECT has_pk  ('dealership', 'veiculo_custo',        'veiculo_custo deve ter PK');
SELECT col_is_pk('dealership', 'veiculo_custo', 'id', 'veiculo_custo.id é a PK');

-- veiculo_manutencao
SELECT has_pk  ('dealership', 'veiculo_manutencao',        'veiculo_manutencao deve ter PK');
SELECT col_is_pk('dealership', 'veiculo_manutencao', 'id', 'veiculo_manutencao.id é a PK');

-- metodo_pagamento
SELECT has_pk  ('dealership', 'metodo_pagamento',        'metodo_pagamento deve ter PK');
SELECT col_is_pk('dealership', 'metodo_pagamento', 'id', 'metodo_pagamento.id é a PK');

SELECT * FROM finish();
ROLLBACK;
