-- =============================================================================
-- 06_integridade_referencial.sql
-- Testa o comportamento em tempo de execução do banco de dados:
--   • Bloco A: FK violations (INSERT com FK inválida deve falhar com 23503)
--   • Bloco B: UNIQUE violations (INSERT duplicado deve falhar com 23505)
--   • Bloco C: NOT NULL violations (INSERT com NULL deve falhar com 23502)
--
-- Todos os dados inseridos são desfeitos pelo ROLLBACK ao final.
-- Para testes de UNIQUE que precisam de registros pré-existentes, são criados
-- fixtures mínimos em uma tabela temporária (_test_fx).
--
-- Códigos de erro PostgreSQL:
--   23502 → not_null_violation
--   23503 → foreign_key_violation
--   23505 → unique_violation
--
-- Total de asserções: 20
-- Execução: supabase test db
-- =============================================================================

BEGIN;
SELECT plan(20);

-- =============================================================================
-- FIXTURES — dados mínimos para os testes de UNIQUE com FK obrigatória
-- Armazenados em tabela temporária; destruídos pelo ROLLBACK final.
-- =============================================================================
CREATE TEMP TABLE _test_fx (key TEXT PRIMARY KEY, val UUID NOT NULL);

-- 1. localizacao (nenhuma FK)
WITH r AS (
    INSERT INTO dealership.localizacao
        (cep, logradouro, numero_logradouro, bairro, cidade, estado)
    VALUES
        ('99999-999', 'Rua pgTAP Test', 1, 'Bairro Test', 'Cidade Test', 'SP')
    RETURNING id
)
INSERT INTO _test_fx VALUES ('loc_id', (SELECT id FROM r));

-- 2. dominio (nenhuma FK) — papel auxiliar
WITH r AS (
    INSERT INTO dealership.dominio (grupo_dominio, nome_dominio)
    VALUES ('papel_usuario', 'pgtap_fixture_role')
    RETURNING id
)
INSERT INTO _test_fx VALUES ('dom_id', (SELECT id FROM r));

-- 3. empresa (depende de localizacao)
WITH r AS (
    INSERT INTO dealership.empresa
        (cnpj, inscricao_municipal, inscricao_estadual, nome_legal_empresa,
         localizacao_id, nome_representante, cargo_representante)
    VALUES
        ('00000099000199', 'IM-FX', 'IE-FX', 'Empresa pgTAP Fixture',
         (SELECT val FROM _test_fx WHERE key = 'loc_id'),
         'Rep pgTAP', 'Dir Test')
    RETURNING id
)
INSERT INTO _test_fx VALUES ('emp_id', (SELECT id FROM r));

-- 4. usuario (depende de empresa + dominio)
WITH r AS (
    INSERT INTO dealership.usuario
        (empresa_id, auth_id, email_usuario, cpf, nome_usuario, papel_usuario_id)
    VALUES
        ((SELECT val FROM _test_fx WHERE key = 'emp_id'),
         'a0000000-0000-0000-0000-000000009999'::uuid,
         'pgtap_fixture@example.com',
         '00000009901',
         'Usuario pgTAP Fixture',
         (SELECT val FROM _test_fx WHERE key = 'dom_id'))
    RETURNING id
)
INSERT INTO _test_fx VALUES ('usr_id', (SELECT id FROM r));

-- =============================================================================
-- BLOCO A — VIOLAÇÕES DE FK (foreign_key_violation → 23503)
-- Usa gen_random_uuid() como FK, garantindo UUID inexistente na tabela pai.
-- Quando a tabela tem múltiplas FKs NOT NULL, todas recebem UUID aleatório:
-- o banco rejeita com 23503 assim que encontrar a primeira FK inválida.
-- =============================================================================

-- A1. empresa.localizacao_id aponta para localizacao inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.empresa
        (cnpj, inscricao_municipal, inscricao_estadual, nome_legal_empresa,
         localizacao_id, nome_representante, cargo_representante)
      VALUES ('11111100000001','IM','IE','Empresa FK Test',
              gen_random_uuid(),'Rep','Dir')$$,
    '23503', NULL,
    'FK A1: empresa.localizacao_id deve rejeitar localizacao inexistente'
);

-- A2. usuario.empresa_id aponta para empresa inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.usuario
        (empresa_id, auth_id, email_usuario, cpf, nome_usuario, papel_usuario_id)
      VALUES (gen_random_uuid(), gen_random_uuid(),
              'fk_a2@test.com','10000000001','User FK A2',gen_random_uuid())$$,
    '23503', NULL,
    'FK A2: usuario.empresa_id deve rejeitar empresa inexistente'
);

-- A3. cliente.empresa_id aponta para empresa inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.cliente
        (empresa_id, cpf, nome_cliente, criado_por)
      VALUES (gen_random_uuid(),'20000000002','Cliente FK A3',gen_random_uuid())$$,
    '23503', NULL,
    'FK A3: cliente.empresa_id deve rejeitar empresa inexistente'
);

-- A4. veiculo_arquivo.veiculo_id aponta para veiculo inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.veiculo_arquivo
        (veiculo_id, empresa_id, tipo_arquivo_id, url_arquivo,
         caminho_storage, tamanho_arquivo, criado_por)
      VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
              'https://example.com/foto.jpg', '/bucket/foto.jpg', 204800,
              gen_random_uuid())$$,
    '23503', NULL,
    'FK A4: veiculo_arquivo.veiculo_id deve rejeitar veiculo inexistente'
);

-- A5. qr_code.veiculo_id aponta para veiculo inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.qr_code
        (veiculo_id, url_publica, token_publica)
      VALUES (gen_random_uuid(),
              'https://qr.example.com/abc123', 'token_fk_a5_test')$$,
    '23503', NULL,
    'FK A5: qr_code.veiculo_id deve rejeitar veiculo inexistente'
);

-- A6. assinatura.empresa_id aponta para empresa inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.assinatura
        (empresa_id, plano_id, situacao_assinatura_id, ciclo_cobranca_id, data_inicio)
      VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
              gen_random_uuid(), CURRENT_DATE)$$,
    '23503', NULL,
    'FK A6: assinatura.empresa_id deve rejeitar empresa inexistente'
);

-- A7. assinatura.plano_id aponta para plano inexistente
--     empresa_id válida (fixture), plano_id inválido → FK no plano deve falhar
SELECT throws_ok(
    format(
        $$INSERT INTO dealership.assinatura
            (empresa_id, plano_id, situacao_assinatura_id, ciclo_cobranca_id, data_inicio)
          VALUES ('%s'::uuid, gen_random_uuid(), gen_random_uuid(),
                  gen_random_uuid(), CURRENT_DATE)$$,
        (SELECT val FROM _test_fx WHERE key = 'emp_id')
    ),
    '23503', NULL,
    'FK A7: assinatura.plano_id deve rejeitar plano inexistente'
);

-- A8. fatura.assinatura_id aponta para assinatura inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.fatura
        (assinatura_id, empresa_id, numero_fatura, situacao_fatura_id,
         valor_bruto, valor_desconto, valor_liquido,
         data_competencia, data_vencimento, metodo_pagamento_id)
      VALUES (gen_random_uuid(), gen_random_uuid(), 'FAT-FK-A8-TEST',
              gen_random_uuid(), 100.00, 0.00, 100.00,
              CURRENT_DATE, CURRENT_DATE + 30, gen_random_uuid())$$,
    '23503', NULL,
    'FK A8: fatura.assinatura_id deve rejeitar assinatura inexistente'
);

-- A9. veiculo_custo.empresa_id aponta para empresa inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.veiculo_custo
        (empresa_id, nome_custo, criado_por)
      VALUES (gen_random_uuid(), 'Custo FK A9', gen_random_uuid())$$,
    '23503', NULL,
    'FK A9: veiculo_custo.empresa_id deve rejeitar empresa inexistente'
);

-- A10. veiculo_manutencao.veiculo_id aponta para veiculo inexistente
SELECT throws_ok(
    $$INSERT INTO dealership.veiculo_manutencao
        (veiculo_id, custo_id, empresa_id, valor_manutencao,
         situacao_manutencao_id, data_conclusao, criado_por)
      VALUES (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
              500.00, gen_random_uuid(), CURRENT_DATE, gen_random_uuid())$$,
    '23503', NULL,
    'FK A10: veiculo_manutencao.veiculo_id deve rejeitar veiculo inexistente'
);

-- =============================================================================
-- BLOCO B — VIOLAÇÕES DE UNIQUE (unique_violation → 23505)
-- B1-B2: tabelas sem FK, inserção direta.
-- B3-B5: usa fixtures criados acima para gerar duplicata.
-- =============================================================================

-- B1. dominio: (grupo_dominio, nome_dominio) único — sem FK, inserção direta
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio)
VALUES ('uk_test_grupo', 'uk_test_nome');

SELECT throws_ok(
    $$INSERT INTO dealership.dominio (grupo_dominio, nome_dominio)
      VALUES ('uk_test_grupo', 'uk_test_nome')$$,
    '23505', NULL,
    'UNIQUE B1: dominio.(grupo_dominio, nome_dominio) não pode ser duplicado'
);

-- B2. plano: nome_plano único — sem FK, inserção direta
INSERT INTO dealership.plano
    (nome_plano, preco_mensal, limite_veiculos, limite_usuarios, limite_fotos_veiculo)
VALUES ('Plano pgTAP UK Test', 49.99, 10, 5, 20);

SELECT throws_ok(
    $$INSERT INTO dealership.plano
        (nome_plano, preco_mensal, limite_veiculos, limite_usuarios, limite_fotos_veiculo)
      VALUES ('Plano pgTAP UK Test', 99.99, 50, 10, 50)$$,
    '23505', NULL,
    'UNIQUE B2: plano.nome_plano não pode ser duplicado'
);

-- B3. empresa: cnpj único — usa localizacao do fixture
SELECT throws_ok(
    format(
        $$INSERT INTO dealership.empresa
            (cnpj, inscricao_municipal, inscricao_estadual, nome_legal_empresa,
             localizacao_id, nome_representante, cargo_representante)
          VALUES ('00000099000199', 'IM-DUP', 'IE-DUP', 'Empresa Dup CNPJ',
                  '%s'::uuid, 'Rep Dup', 'Dir Dup')$$,
        (SELECT val FROM _test_fx WHERE key = 'loc_id')
    ),
    '23505', NULL,
    'UNIQUE B3: empresa.cnpj (uk_empresa_cnpj) não pode ser duplicado'
);

-- B4. usuario: auth_id único — usa empresa e dominio do fixture
SELECT throws_ok(
    format(
        $$INSERT INTO dealership.usuario
            (empresa_id, auth_id, email_usuario, cpf, nome_usuario, papel_usuario_id)
          VALUES ('%s'::uuid,
                  'a0000000-0000-0000-0000-000000009999'::uuid,
                  'outro_email@example.com', '00000009902',
                  'User Dup auth_id',
                  '%s'::uuid)$$,
        (SELECT val FROM _test_fx WHERE key = 'emp_id'),
        (SELECT val FROM _test_fx WHERE key = 'dom_id')
    ),
    '23505', NULL,
    'UNIQUE B4: usuario.auth_id (uk_usuario_auth_id) não pode ser duplicado'
);

-- B5. usuario: email_usuario único — usa empresa e dominio do fixture
SELECT throws_ok(
    format(
        $$INSERT INTO dealership.usuario
            (empresa_id, auth_id, email_usuario, cpf, nome_usuario, papel_usuario_id)
          VALUES ('%s'::uuid,
                  gen_random_uuid(),
                  'pgtap_fixture@example.com',
                  '00000009903',
                  'User Dup email',
                  '%s'::uuid)$$,
        (SELECT val FROM _test_fx WHERE key = 'emp_id'),
        (SELECT val FROM _test_fx WHERE key = 'dom_id')
    ),
    '23505', NULL,
    'UNIQUE B5: usuario.email_usuario (uk_usuario_email_usuario) não pode ser duplicado'
);

-- =============================================================================
-- BLOCO C — VIOLAÇÕES DE NOT NULL (not_null_violation → 23502)
-- NOT NULL é verificado antes das FK constraints pelo PostgreSQL,
-- portanto passar gen_random_uuid() para colunas FK não interfere.
-- =============================================================================

-- C1. localizacao.logradouro não pode ser NULL
SELECT throws_ok(
    $$INSERT INTO dealership.localizacao
        (cep, logradouro, numero_logradouro, bairro, cidade, estado)
      VALUES ('12345-678', NULL, 1, 'Bairro', 'Cidade', 'SP')$$,
    '23502', NULL,
    'NOT NULL C1: localizacao.logradouro não pode ser NULL'
);

-- C2. dominio.grupo_dominio não pode ser NULL
SELECT throws_ok(
    $$INSERT INTO dealership.dominio (grupo_dominio, nome_dominio)
      VALUES (NULL, 'nome_valido')$$,
    '23502', NULL,
    'NOT NULL C2: dominio.grupo_dominio não pode ser NULL'
);

-- C3. plano.nome_plano não pode ser NULL
SELECT throws_ok(
    $$INSERT INTO dealership.plano
        (nome_plano, preco_mensal, limite_veiculos, limite_usuarios, limite_fotos_veiculo)
      VALUES (NULL, 99.99, 10, 5, 20)$$,
    '23502', NULL,
    'NOT NULL C3: plano.nome_plano não pode ser NULL'
);

-- C4. empresa.cnpj não pode ser NULL
--    (localizacao_id = gen_random_uuid() → NOT NULL no cnpj dispara antes da FK)
SELECT throws_ok(
    $$INSERT INTO dealership.empresa
        (cnpj, inscricao_municipal, inscricao_estadual, nome_legal_empresa,
         localizacao_id, nome_representante, cargo_representante)
      VALUES (NULL, 'IM', 'IE', 'Empresa NULL cnpj',
              gen_random_uuid(), 'Rep', 'Dir')$$,
    '23502', NULL,
    'NOT NULL C4: empresa.cnpj não pode ser NULL'
);

-- C5. veiculo.placa não pode ser NULL
--    (FKs recebem gen_random_uuid() → NOT NULL no placa dispara antes das FKs)
SELECT throws_ok(
    $$INSERT INTO dealership.veiculo
        (empresa_id, placa, renavam,
         marca_veiculo_id, modelo_veiculo_id, combustivel_veiculo_id,
         numero_chassi, ano_modelo, ano_fabricacao, cor_veiculo,
         direcao_veiculo_id, vidro_eletrico, cambio_veiculo_id, trava_eletrica,
         quantidade_portas, quilometragem, data_compra, preco_compra,
         situacao_veiculo_id, laudo_aprovado, criado_por, atualizado_por)
      VALUES (gen_random_uuid(), NULL, '12345678901',
              gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
              'CHASSI-NULL-TEST', 2024, 2024, 'Branco',
              gen_random_uuid(), TRUE, gen_random_uuid(), TRUE,
              4, 10000, CURRENT_DATE, 50000.00,
              gen_random_uuid(), TRUE, gen_random_uuid(), gen_random_uuid())$$,
    '23502', NULL,
    'NOT NULL C5: veiculo.placa não pode ser NULL'
);

SELECT * FROM finish();
ROLLBACK;
