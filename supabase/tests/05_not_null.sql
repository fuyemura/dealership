-- =============================================================================
-- 05_not_null.sql
-- Verifica estruturalmente, via catálogo do PostgreSQL, que todas as colunas
-- obrigatórias (NOT NULL) estão corretamente definidas em cada tabela.
--
-- Colunas excluídas deliberadamente (cobertas em outros arquivos):
--   • id          → coberto em 02_primary_keys.sql
--   • criado_em, atualizado_em, registrado_em → colunas de auditoria com DEFAULT
--
-- Total de asserções: 112
-- Execução: supabase test db
-- =============================================================================

BEGIN;
SELECT plan(112);

-- =============================================================================
-- empresa (7 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'empresa', 'cnpj',                  'empresa.cnpj NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'inscricao_municipal',    'empresa.inscricao_municipal NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'inscricao_estadual',     'empresa.inscricao_estadual NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'nome_legal_empresa',     'empresa.nome_legal_empresa NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'localizacao_id',         'empresa.localizacao_id NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'nome_representante',     'empresa.nome_representante NOT NULL');
SELECT col_not_null('dealership', 'empresa', 'cargo_representante',    'empresa.cargo_representante NOT NULL');

-- =============================================================================
-- usuario (6 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'usuario', 'empresa_id',       'usuario.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'usuario', 'auth_id',          'usuario.auth_id NOT NULL');
SELECT col_not_null('dealership', 'usuario', 'email_usuario',    'usuario.email_usuario NOT NULL');
SELECT col_not_null('dealership', 'usuario', 'cpf',              'usuario.cpf NOT NULL');
SELECT col_not_null('dealership', 'usuario', 'nome_usuario',     'usuario.nome_usuario NOT NULL');
SELECT col_not_null('dealership', 'usuario', 'papel_usuario_id', 'usuario.papel_usuario_id NOT NULL');

-- =============================================================================
-- localizacao (6 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'localizacao', 'cep',                  'localizacao.cep NOT NULL');
SELECT col_not_null('dealership', 'localizacao', 'logradouro',           'localizacao.logradouro NOT NULL');
SELECT col_not_null('dealership', 'localizacao', 'numero_logradouro',    'localizacao.numero_logradouro NOT NULL');
SELECT col_not_null('dealership', 'localizacao', 'bairro',               'localizacao.bairro NOT NULL');
SELECT col_not_null('dealership', 'localizacao', 'cidade',               'localizacao.cidade NOT NULL');
SELECT col_not_null('dealership', 'localizacao', 'estado',               'localizacao.estado NOT NULL');

-- =============================================================================
-- dominio (2 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'dominio', 'grupo_dominio', 'dominio.grupo_dominio NOT NULL');
SELECT col_not_null('dealership', 'dominio', 'nome_dominio',  'dominio.nome_dominio NOT NULL');

-- =============================================================================
-- cliente (4 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'cliente', 'empresa_id',   'cliente.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'cliente', 'cpf',          'cliente.cpf NOT NULL');
SELECT col_not_null('dealership', 'cliente', 'nome_cliente', 'cliente.nome_cliente NOT NULL');
SELECT col_not_null('dealership', 'cliente', 'criado_por',   'cliente.criado_por NOT NULL');

-- =============================================================================
-- veiculo (22 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'veiculo', 'empresa_id',             'veiculo.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'placa',                  'veiculo.placa NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'renavam',                'veiculo.renavam NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'marca_veiculo_id',       'veiculo.marca_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'modelo_veiculo_id',      'veiculo.modelo_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'combustivel_veiculo_id', 'veiculo.combustivel_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'numero_chassi',          'veiculo.numero_chassi NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'ano_modelo',             'veiculo.ano_modelo NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'ano_fabricacao',         'veiculo.ano_fabricacao NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'cor_veiculo',            'veiculo.cor_veiculo NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'direcao_veiculo_id',     'veiculo.direcao_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'vidro_eletrico',         'veiculo.vidro_eletrico NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'cambio_veiculo_id',      'veiculo.cambio_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'trava_eletrica',         'veiculo.trava_eletrica NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'quantidade_portas',      'veiculo.quantidade_portas NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'quilometragem',          'veiculo.quilometragem NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'data_compra',            'veiculo.data_compra NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'preco_compra',           'veiculo.preco_compra NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'situacao_veiculo_id',    'veiculo.situacao_veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'laudo_aprovado',         'veiculo.laudo_aprovado NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'criado_por',             'veiculo.criado_por NOT NULL');
SELECT col_not_null('dealership', 'veiculo', 'atualizado_por',         'veiculo.atualizado_por NOT NULL');

-- =============================================================================
-- veiculo_arquivo (9 colunas NOT NULL)
-- arquivo_principal e ordem_exibicao são NOT NULL com DEFAULT
-- =============================================================================
SELECT col_not_null('dealership', 'veiculo_arquivo', 'veiculo_id',        'veiculo_arquivo.veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'empresa_id',        'veiculo_arquivo.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'tipo_arquivo_id',   'veiculo_arquivo.tipo_arquivo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'url_arquivo',       'veiculo_arquivo.url_arquivo NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'caminho_storage',   'veiculo_arquivo.caminho_storage NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'tamanho_arquivo',   'veiculo_arquivo.tamanho_arquivo NOT NULL');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'arquivo_principal', 'veiculo_arquivo.arquivo_principal NOT NULL (DEFAULT FALSE)');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'ordem_exibicao',    'veiculo_arquivo.ordem_exibicao NOT NULL (DEFAULT 0)');
SELECT col_not_null('dealership', 'veiculo_arquivo', 'criado_por',        'veiculo_arquivo.criado_por NOT NULL');

-- =============================================================================
-- qr_code (4 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'qr_code', 'veiculo_id',          'qr_code.veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'qr_code', 'url_publica',         'qr_code.url_publica NOT NULL');
SELECT col_not_null('dealership', 'qr_code', 'token_publica',       'qr_code.token_publica NOT NULL');
SELECT col_not_null('dealership', 'qr_code', 'total_visualizacoes', 'qr_code.total_visualizacoes NOT NULL (DEFAULT 0)');

-- =============================================================================
-- plano (9 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'plano', 'nome_plano',              'plano.nome_plano NOT NULL');
SELECT col_not_null('dealership', 'plano', 'preco_mensal',            'plano.preco_mensal NOT NULL');
SELECT col_not_null('dealership', 'plano', 'limite_veiculos',         'plano.limite_veiculos NOT NULL');
SELECT col_not_null('dealership', 'plano', 'limite_usuarios',         'plano.limite_usuarios NOT NULL');
SELECT col_not_null('dealership', 'plano', 'limite_fotos_veiculo',    'plano.limite_fotos_veiculo NOT NULL');
SELECT col_not_null('dealership', 'plano', 'tem_qr_code',             'plano.tem_qr_code NOT NULL (DEFAULT TRUE)');
SELECT col_not_null('dealership', 'plano', 'tem_relatorios',          'plano.tem_relatorios NOT NULL (DEFAULT FALSE)');
SELECT col_not_null('dealership', 'plano', 'tem_suporte_prioritario', 'plano.tem_suporte_prioritario NOT NULL (DEFAULT FALSE)');
SELECT col_not_null('dealership', 'plano', 'plano_ativo',             'plano.plano_ativo NOT NULL (DEFAULT TRUE)');

-- =============================================================================
-- assinatura (6 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'assinatura', 'empresa_id',             'assinatura.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura', 'plano_id',               'assinatura.plano_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura', 'situacao_assinatura_id', 'assinatura.situacao_assinatura_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura', 'ciclo_cobranca_id',      'assinatura.ciclo_cobranca_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura', 'data_inicio',            'assinatura.data_inicio NOT NULL');
SELECT col_not_null('dealership', 'assinatura', 'trial_ativo',            'assinatura.trial_ativo NOT NULL (DEFAULT FALSE)');

-- =============================================================================
-- assinatura_historico (7 colunas NOT NULL de negócio)
-- Tabela de histórico: sem FKs declaradas, preserva snapshot do estado anterior
-- =============================================================================
SELECT col_not_null('dealership', 'assinatura_historico', 'assinatura_id',            'assinatura_historico.assinatura_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'empresa_id',               'assinatura_historico.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'plano_id',                 'assinatura_historico.plano_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'situacao_assinatura_id',   'assinatura_historico.situacao_assinatura_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'ciclo_cobranca_id',        'assinatura_historico.ciclo_cobranca_id NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'data_inicio',              'assinatura_historico.data_inicio NOT NULL');
SELECT col_not_null('dealership', 'assinatura_historico', 'trial_ativo',              'assinatura_historico.trial_ativo NOT NULL');

-- =============================================================================
-- fatura (11 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'fatura', 'assinatura_id',        'fatura.assinatura_id NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'empresa_id',           'fatura.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'numero_fatura',        'fatura.numero_fatura NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'situacao_fatura_id',   'fatura.situacao_fatura_id NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'valor_bruto',          'fatura.valor_bruto NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'valor_desconto',       'fatura.valor_desconto NOT NULL (DEFAULT 0)');
SELECT col_not_null('dealership', 'fatura', 'valor_liquido',        'fatura.valor_liquido NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'data_competencia',     'fatura.data_competencia NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'data_vencimento',      'fatura.data_vencimento NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'metodo_pagamento_id',  'fatura.metodo_pagamento_id NOT NULL');
SELECT col_not_null('dealership', 'fatura', 'tentativas_cobranca',  'fatura.tentativas_cobranca NOT NULL (DEFAULT 0)');

-- =============================================================================
-- veiculo_custo (3 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'veiculo_custo', 'empresa_id', 'veiculo_custo.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_custo', 'nome_custo', 'veiculo_custo.nome_custo NOT NULL');
SELECT col_not_null('dealership', 'veiculo_custo', 'criado_por', 'veiculo_custo.criado_por NOT NULL');

-- =============================================================================
-- veiculo_manutencao (7 colunas NOT NULL)
-- =============================================================================
SELECT col_not_null('dealership', 'veiculo_manutencao', 'veiculo_id',             'veiculo_manutencao.veiculo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'custo_id',               'veiculo_manutencao.custo_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'empresa_id',             'veiculo_manutencao.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'valor_manutencao',       'veiculo_manutencao.valor_manutencao NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'situacao_manutencao_id', 'veiculo_manutencao.situacao_manutencao_id NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'data_conclusao',         'veiculo_manutencao.data_conclusao NOT NULL');
SELECT col_not_null('dealership', 'veiculo_manutencao', 'criado_por',             'veiculo_manutencao.criado_por NOT NULL');

-- =============================================================================
-- metodo_pagamento (9 colunas NOT NULL)
-- metodo_principal e metodo_ativo são NOT NULL com DEFAULT
-- =============================================================================
SELECT col_not_null('dealership', 'metodo_pagamento', 'empresa_id',                'metodo_pagamento.empresa_id NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'gateway_payment_method_id', 'metodo_pagamento.gateway_payment_method_id NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'bandeira_id',               'metodo_pagamento.bandeira_id NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'ultimos_quatro_digitos',    'metodo_pagamento.ultimos_quatro_digitos NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'mes_expiracao',             'metodo_pagamento.mes_expiracao NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'ano_expiracao',             'metodo_pagamento.ano_expiracao NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'nome_titular',              'metodo_pagamento.nome_titular NOT NULL');
SELECT col_not_null('dealership', 'metodo_pagamento', 'metodo_principal',          'metodo_pagamento.metodo_principal NOT NULL (DEFAULT FALSE)');
SELECT col_not_null('dealership', 'metodo_pagamento', 'metodo_ativo',              'metodo_pagamento.metodo_ativo NOT NULL (DEFAULT TRUE)');

SELECT * FROM finish();
ROLLBACK;
