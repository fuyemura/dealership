-- ============================================================
-- DADOS DE TESTE — Uyemura Tech SaaS Automotivo
-- Gerado para o schema: dealership
-- Ordem: localizacao → empresa → dominio → usuario → veiculo → veiculo_foto → qr_code
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. LOCALIZACAO
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.localizacao (id, codigo_ibge, logradouro, numero_logradouro, complemento_logradouro, bairro, cidade, estado)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 3550308, 'Avenida Paulista',        1578, 'Conjunto 42',  'Bela Vista',    'São Paulo',       'SP'),
  ('a1000000-0000-0000-0000-000000000002', 3304557, 'Rua da Assembleia',        10,  'Sala 201',     'Centro',        'Rio de Janeiro',  'RJ'),
  ('a1000000-0000-0000-0000-000000000003', 4106902, 'Rua XV de Novembro',       980, NULL,           'Centro',        'Curitiba',        'PR');


-- ─────────────────────────────────────────────────────────────
-- 2. EMPRESA
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.empresa (
  id, cnpj, inscricao_municipal, inscricao_estadual,
  nome_legal_empresa, nome_fantasia_empresa,
  localizacao_id, telefone_principal, telefone_secundario,
  email_empresa, nome_representante, cpf_representante,
  cargo_representante, telefone_representante
)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    '12345678000191', 'CCM-0012345', '111.222.333.004-57',
    'Auto Premium Ltda', 'Auto Premium',
    'a1000000-0000-0000-0000-000000000001',
    '11987650001', '1132540001',
    'contato@autopremium.com.br',
    'Douglas Cardoso Uyemura', '12345678901', 'Diretor Geral', '11987650001'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    '98765432000155', 'CCM-0098765', '222.333.444.005-12',
    'Garage Carioca Veículos S/A', 'Garage Carioca',
    'a1000000-0000-0000-0000-000000000002',
    '21987650002', '2132540002',
    'vendas@garagecarioca.com.br',
    'Yasmin Gazal', '98765432100', 'Sócia Administradora', '21987650002'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    '11223344000177', 'CCM-0011223', '333.444.555.006-89',
    'Sul Motors Comércio de Veículos Ltda', 'Sul Motors',
    'a1000000-0000-0000-0000-000000000003',
    '41987650003', NULL,
    'atendimento@sulmotors.com.br',
    'Flávio Cavalcante Uyemura', '11223344500', 'CEO', '41987650003'
  );


-- ─────────────────────────────────────────────────────────────
-- 3. DOMINIO (marca, modelo, combustivel, cambio, situacao, papel)
-- ─────────────────────────────────────────────────────────────

-- Papel (roles de usuário)
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0001-000000000001', 'papel', 'administrador'),
  ('d0000000-0000-0000-0001-000000000002', 'papel', 'gerente'),
  ('d0000000-0000-0000-0001-000000000003', 'papel', 'usuario');

-- Marca
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0002-000000000001', 'marca', 'Toyota'),
  ('d0000000-0000-0000-0002-000000000002', 'marca', 'Honda'),
  ('d0000000-0000-0000-0002-000000000003', 'marca', 'Volkswagen'),
  ('d0000000-0000-0000-0002-000000000004', 'marca', 'Chevrolet'),
  ('d0000000-0000-0000-0002-000000000005', 'marca', 'Ford'),
  ('d0000000-0000-0000-0002-000000000006', 'marca', 'Hyundai'),
  ('d0000000-0000-0000-0002-000000000007', 'marca', 'Jeep'),
  ('d0000000-0000-0000-0002-000000000008', 'marca', 'BMW'),
  ('d0000000-0000-0000-0002-000000000009', 'marca', 'Mercedes-Benz'),
  ('d0000000-0000-0000-0002-000000000010', 'marca', 'Fiat');

-- Modelo
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0003-000000000001', 'modelo', 'Corolla'),
  ('d0000000-0000-0000-0003-000000000002', 'modelo', 'Civic'),
  ('d0000000-0000-0000-0003-000000000003', 'modelo', 'Jetta'),
  ('d0000000-0000-0000-0003-000000000004', 'modelo', 'Onix'),
  ('d0000000-0000-0000-0003-000000000005', 'modelo', 'Ka'),
  ('d0000000-0000-0000-0003-000000000006', 'modelo', 'HB20'),
  ('d0000000-0000-0000-0003-000000000007', 'modelo', 'Compass'),
  ('d0000000-0000-0000-0003-000000000008', 'modelo', 'Serie 3'),
  ('d0000000-0000-0000-0003-000000000009', 'modelo', 'Classe C'),
  ('d0000000-0000-0000-0003-000000000010', 'modelo', 'Argo'),
  ('d0000000-0000-0000-0003-000000000011', 'modelo', 'Hilux'),
  ('d0000000-0000-0000-0003-000000000012', 'modelo', 'HR-V'),
  ('d0000000-0000-0000-0003-000000000013', 'modelo', 'Polo'),
  ('d0000000-0000-0000-0003-000000000014', 'modelo', 'Tracker'),
  ('d0000000-0000-0000-0003-000000000015', 'modelo', 'Bronco Sport');

-- Combustível
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0004-000000000001', 'combustivel', 'Gasolina'),
  ('d0000000-0000-0000-0004-000000000002', 'combustivel', 'Etanol'),
  ('d0000000-0000-0000-0004-000000000003', 'combustivel', 'Flex'),
  ('d0000000-0000-0000-0004-000000000004', 'combustivel', 'Diesel'),
  ('d0000000-0000-0000-0004-000000000005', 'combustivel', 'Elétrico'),
  ('d0000000-0000-0000-0004-000000000006', 'combustivel', 'Híbrido');

-- Câmbio
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0005-000000000001', 'cambio', 'Manual'),
  ('d0000000-0000-0000-0005-000000000002', 'cambio', 'Automático'),
  ('d0000000-0000-0000-0005-000000000003', 'cambio', 'CVT'),
  ('d0000000-0000-0000-0005-000000000004', 'cambio', 'Automatizado');

-- Situação
INSERT INTO dealership.dominio (id, grupo_dominio, nome_dominio) VALUES
  ('d0000000-0000-0000-0006-000000000001', 'situacao', 'Disponível'),
  ('d0000000-0000-0000-0006-000000000002', 'situacao', 'Em Negociação'),
  ('d0000000-0000-0000-0006-000000000003', 'situacao', 'Vendido'),
  ('d0000000-0000-0000-0006-000000000004', 'situacao', 'Reservado');


-- ─────────────────────────────────────────────────────────────
-- 4. USUARIO
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.usuario (id, empresa_id, auth_id, email_usuario, cpf, nome_usuario, papel_id)
VALUES
  -- Auto Premium (empresa 1)
  (
    'c1000000-0000-0000-0000-000000000001',
    '745dab3b-405d-4b6a-bf3e-cb9a375a5a73',
    'f1000000-aaaa-bbbb-cccc-000000000001',
    'doduyemura@gmail.com', '12345678901',
    'Douglas Cardoso Uyemura',
    'd0000000-0000-0000-0001-000000000001'   -- administrador
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'f1000000-aaaa-bbbb-cccc-000000000002',
    'ana@autopremium.com.br', '23456789012',
    'Ana Paula Mendes',
    'd0000000-0000-0000-0001-000000000002'   -- gerente
  ),
  -- Garage Carioca (empresa 2)
  (
    'c1000000-0000-0000-0000-000000000003',
    '81fe3553-d170-42e1-b07a-c298fc5feba3',
    'f1000000-aaaa-bbbb-cccc-000000000003',
    'Yasmin Gazal@ggmail.com', '98765432100',
    'Yasmin Gazal',
    'd0000000-0000-0000-0001-000000000001'   -- administrador
  ),
  -- Sul Motors (empresa 3)
  (
    'c1000000-0000-0000-0000-000000000004',
    '666fcae2-6ac1-4cf9-8c5c-5589fd04b831',
    'f1000000-aaaa-bbbb-cccc-000000000004',
    'fuyemura@gmail.com', '11223344500',
    'flávio Cavalcante Uyemura',
    'd0000000-0000-0000-0001-000000000001'   -- administrador
  ),
  (
    'c1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000003',
    'f1000000-aaaa-bbbb-cccc-000000000005',
    'julia@sulmotors.com.br', '33445566700',
    'Júlia Martins Rocha',
    'd0000000-0000-0000-0001-000000000003'   -- usuario
  );


-- ─────────────────────────────────────────────────────────────
-- 5. VEICULO
-- empresa 1 = Auto Premium (SP) — 6 veículos
-- empresa 2 = Garage Carioca (RJ) — 5 veículos
-- empresa 3 = Sul Motors (PR)    — 4 veículos
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo (
  id, empresa_id, placa, renavam,
  marca_veiculo_id, modelo_veiculo_id, combustivel_veiculo_id,
  numero_chassi, ano_modelo, ano_fabricacao, cor_veiculo,
  quilometragem, cambio_veiculo_id,
  preco_venda_veiculo, descricao,
  situacao_veiculo_id, vendido_em,
  criado_por, atualizado_por
)
VALUES

-- ── Auto Premium ──────────────────────────────────────────────

(
  'e1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'ABC1D23', '12345678901',
  'd0000000-0000-0000-0002-000000000001', -- Toyota
  'd0000000-0000-0000-0003-000000000001', -- Corolla
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BWZZZ377VT004251', 2022, 2021, 'Prata',
  28000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  119900.00,
  'Toyota Corolla XEi 2.0 Flex. Único dono, revisões em dia na concessionária. IPVA 2025 pago. Couro, multimídia Toyota Connect, câmera de ré.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001'
),

(
  'e1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000001',
  'BCD2E34', '23456789012',
  'd0000000-0000-0000-0002-000000000008', -- BMW
  'd0000000-0000-0000-0003-000000000008', -- Serie 3
  'd0000000-0000-0000-0004-000000000001', -- Gasolina
  'WBA5A5C55GG123456', 2023, 2023, 'Preto',
  12500,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  289900.00,
  'BMW 320i Sport 2.0 Turbo. Teto solar panorâmico, bancos em couro Dakota, head-up display, sensor de estacionamento 360°. Garantia de fábrica até 2026.',
  'd0000000-0000-0000-0006-000000000002', -- Em Negociação
  NULL,
  'c1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002'
),

(
  'e1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000001',
  'CDE3F45', '34567890123',
  'd0000000-0000-0000-0002-000000000007', -- Jeep
  'd0000000-0000-0000-0003-000000000007', -- Compass
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9CF3B53E9KG456789', 2024, 2023, 'Branco',
  8700,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  199900.00,
  'Jeep Compass Limited 1.3 Turbo Flex. Configuração topo de linha, AWD, couro, multimídia 10", 4x4 select terrain. Único dono, sem dívidas.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002'
),

(
  'e1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000001',
  'DEF4G56', '45678901234',
  'd0000000-0000-0000-0002-000000000003', -- Volkswagen
  'd0000000-0000-0000-0003-000000000003', -- Jetta
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BWZZZ1JZ3T123001', 2020, 2020, 'Cinza',
  54000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  98500.00,
  'VW Jetta Comfortline 250 TSI. Bancos em couro, multimídia com CarPlay/Android Auto, freio a disco nas quatro rodas, alarme de fábrica. Revisões feitas na VW.',
  'd0000000-0000-0000-0006-000000000003', -- Vendido
  '2025-01-15 14:30:00+00',
  'c1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001'
),

(
  'e1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000001',
  'EFG5H67', '56789012345',
  'd0000000-0000-0000-0002-000000000009', -- Mercedes-Benz
  'd0000000-0000-0000-0003-000000000009', -- Classe C
  'd0000000-0000-0000-0004-000000000006', -- Híbrido
  'WDD2050022R987654', 2024, 2024, 'Azul Metálico',
  3200,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  419900.00,
  'Mercedes-Benz C 300e Híbrido Plug-in. Bancos em couro Nappa, MBUX, teto panorâmico, Night Package. Veículo novo de showroom com 3.200 km.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001'
),

(
  'e1000000-0000-0000-0000-000000000006',
  'b1000000-0000-0000-0000-000000000001',
  'FGH6I78', '67890123456',
  'd0000000-0000-0000-0002-000000000001', -- Toyota
  'd0000000-0000-0000-0003-000000000011', -- Hilux
  'd0000000-0000-0000-0004-000000000004', -- Diesel
  '8AFAAAHM9HJ654321', 2023, 2022, 'Branco',
  41000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  269900.00,
  'Toyota Hilux SRX 2.8 Diesel 4x4 AT. Couro, multimídia JBL, câmera 360°, controle de descida, suspensão reforçada. Revisões feitas na Toyota. Excelente estado.',
  'd0000000-0000-0000-0006-000000000004', -- Reservado
  NULL,
  'c1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002'
),

-- ── Garage Carioca ────────────────────────────────────────────

(
  'e1000000-0000-0000-0000-000000000007',
  'b1000000-0000-0000-0000-000000000002',
  'GHI7J89', '78901234567',
  'd0000000-0000-0000-0002-000000000002', -- Honda
  'd0000000-0000-0000-0003-000000000002', -- Civic
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '2HGFC2F66MH567890', 2022, 2022, 'Vermelho',
  31000,
  'd0000000-0000-0000-0005-000000000003', -- CVT
  129900.00,
  'Honda Civic EXL 1.5 Turbo CVT. Teto solar, bancos em couro, Honda Sensing completo, CarPlay/Android Auto. Impecável, sem leilão.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003'
),

(
  'e1000000-0000-0000-0000-000000000008',
  'b1000000-0000-0000-0000-000000000002',
  'HIJ8K90', '89012345678',
  'd0000000-0000-0000-0002-000000000002', -- Honda
  'd0000000-0000-0000-0003-000000000012', -- HR-V
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '3CZRU6H50NM234567', 2023, 2022, 'Champagne',
  22000,
  'd0000000-0000-0000-0005-000000000003', -- CVT
  149900.00,
  'Honda HR-V EXL 1.5 Turbo CVT. Teto solar elétrico, couro, Honda Sensing, 7 airbags, câmera de ré. Perfeito estado, IPVA 2025 quitado.',
  'd0000000-0000-0000-0006-000000000002', -- Em Negociação
  NULL,
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003'
),

(
  'e1000000-0000-0000-0000-000000000009',
  'b1000000-0000-0000-0000-000000000002',
  'IJK9L01', '90123456789',
  'd0000000-0000-0000-0002-000000000004', -- Chevrolet
  'd0000000-0000-0000-0003-000000000004', -- Onix
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BGTT69B0RG345678', 2021, 2021, 'Preto',
  67000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  72900.00,
  'Chevrolet Onix Plus LTZ 1.0 Turbo AT. Multimídia MyLink 8", câmera de ré, sensores de estacionamento, couro, ar digital. Revisões feitas na concessionária.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003'
),

(
  'e1000000-0000-0000-0000-000000000010',
  'b1000000-0000-0000-0000-000000000002',
  'JKL0M12', '01234567890',
  'd0000000-0000-0000-0002-000000000006', -- Hyundai
  'd0000000-0000-0000-0003-000000000006', -- HB20
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BFHA5BB4RB456789', 2020, 2019, 'Azul',
  89000,
  'd0000000-0000-0000-0005-000000000001', -- Manual
  48500.00,
  'Hyundai HB20 1.0 Comfort Plus Manual. Direção elétrica, ar-condicionado, multimídia, vidros e travas elétricas. Econômico e bem conservado.',
  'd0000000-0000-0000-0006-000000000003', -- Vendido
  '2025-02-20 10:00:00+00',
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003'
),

(
  'e1000000-0000-0000-0000-000000000011',
  'b1000000-0000-0000-0000-000000000002',
  'KLM1N23', '11234567891',
  'd0000000-0000-0000-0002-000000000003', -- Volkswagen
  'd0000000-0000-0000-0003-000000000013', -- Polo
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BWCA45U0NT567890', 2024, 2023, 'Branco',
  14000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  109900.00,
  'VW Polo Highline 200 TSI AT. Teto solar, couro, CarPlay, sensores e câmera 360°, frenagem autônoma. Seminovo com garantia Volkswagen até 2026.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003'
),

-- ── Sul Motors ────────────────────────────────────────────────

(
  'e1000000-0000-0000-0000-000000000012',
  'b1000000-0000-0000-0000-000000000003',
  'LMN2O34', '22345678902',
  'd0000000-0000-0000-0002-000000000004', -- Chevrolet
  'd0000000-0000-0000-0003-000000000014', -- Tracker
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BGRS9EC0NG234567', 2023, 2022, 'Cinza',
  35000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  139900.00,
  'Chevrolet Tracker Premier 1.2 Turbo AT. Teto solar panorâmico, couro, Wi-Fi embarcado, câmera e sensores. Revisado, sem dívidas, IPVA pago.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000004'
),

(
  'e1000000-0000-0000-0000-000000000013',
  'b1000000-0000-0000-0000-000000000003',
  'MNO3P45', '33456789013',
  'd0000000-0000-0000-0002-000000000005', -- Ford
  'd0000000-0000-0000-0003-000000000015', -- Bronco Sport
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '1FMEE5DH2NLA12345', 2023, 2022, 'Verde Cacto',
  28000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  189900.00,
  'Ford Bronco Sport Wildtrack 2.0 EcoBoost 4x4 AT. G.O.A.T. modes, teto panorâmico, Bang & Olufsen, bancos em couro. Raro na cor Verde Cacto.',
  'd0000000-0000-0000-0006-000000000002', -- Em Negociação
  NULL,
  'c1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000005'
),

(
  'e1000000-0000-0000-0000-000000000014',
  'b1000000-0000-0000-0000-000000000003',
  'NOP4Q56', '44567890124',
  'd0000000-0000-0000-0002-000000000010', -- Fiat
  'd0000000-0000-0000-0003-000000000010', -- Argo
  'd0000000-0000-0000-0004-000000000003', -- Flex
  '9BF1BAFNE8R678901', 2021, 2020, 'Vermelho',
  72000,
  'd0000000-0000-0000-0005-000000000001', -- Manual
  59900.00,
  'Fiat Argo Drive 1.3 GSR Manual. Ar-condicionado digital, central multimídia, direção elétrica. Ideal para cidade, baixo custo de manutenção.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000005'
),

(
  'e1000000-0000-0000-0000-000000000015',
  'b1000000-0000-0000-0000-000000000003',
  'OPQ5R67', '55678901235',
  'd0000000-0000-0000-0002-000000000006', -- Hyundai
  'd0000000-0000-0000-0003-000000000006', -- HB20
  'd0000000-0000-0000-0004-000000000005', -- Elétrico
  '9BFHA5BBXRB789012', 2024, 2024, 'Azul Safira',
  5000,
  'd0000000-0000-0000-0005-000000000002', -- Automático
  179900.00,
  'Hyundai HB20 Elétrico 100% bateria. Autonomia de 350 km, carregamento rápido DC, assistente de faixas, frenagem regenerativa. Novo com 5.000 km rodados.',
  'd0000000-0000-0000-0006-000000000001', -- Disponível
  NULL,
  'c1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000004'
);


-- ─────────────────────────────────────────────────────────────
-- 6. VEICULO_FOTO (foto principal para cada veículo)
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.veiculo_foto (id, veiculo_id, url_foto, caminho_storage, tamanho_arquivo, foto_principal, ordem_exibicao)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'https://storage.uyemuratech.com/fotos/abc1d23-01.jpg', 'fotos/empresa-1/abc1d23-01.jpg', 2048000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'https://storage.uyemuratech.com/fotos/abc1d23-02.jpg', 'fotos/empresa-1/abc1d23-02.jpg', 1920000, FALSE, 2),
  ('f1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002', 'https://storage.uyemuratech.com/fotos/bcd2e34-01.jpg', 'fotos/empresa-1/bcd2e34-01.jpg', 3100000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000003', 'https://storage.uyemuratech.com/fotos/cde3f45-01.jpg', 'fotos/empresa-1/cde3f45-01.jpg', 2560000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000004', 'https://storage.uyemuratech.com/fotos/def4g56-01.jpg', 'fotos/empresa-1/def4g56-01.jpg', 1800000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000005', 'https://storage.uyemuratech.com/fotos/efg5h67-01.jpg', 'fotos/empresa-1/efg5h67-01.jpg', 3400000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000006', 'https://storage.uyemuratech.com/fotos/fgh6i78-01.jpg', 'fotos/empresa-1/fgh6i78-01.jpg', 2900000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000007', 'https://storage.uyemuratech.com/fotos/ghi7j89-01.jpg', 'fotos/empresa-2/ghi7j89-01.jpg', 2100000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000008', 'https://storage.uyemuratech.com/fotos/hij8k90-01.jpg', 'fotos/empresa-2/hij8k90-01.jpg', 2300000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000010', 'e1000000-0000-0000-0000-000000000009', 'https://storage.uyemuratech.com/fotos/ijk9l01-01.jpg', 'fotos/empresa-2/ijk9l01-01.jpg', 1650000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000010', 'https://storage.uyemuratech.com/fotos/jkl0m12-01.jpg', 'fotos/empresa-2/jkl0m12-01.jpg', 1500000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000011', 'https://storage.uyemuratech.com/fotos/klm1n23-01.jpg', 'fotos/empresa-2/klm1n23-01.jpg', 2750000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000012', 'https://storage.uyemuratech.com/fotos/lmn2o34-01.jpg', 'fotos/empresa-3/lmn2o34-01.jpg', 2200000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000013', 'https://storage.uyemuratech.com/fotos/mno3p45-01.jpg', 'fotos/empresa-3/mno3p45-01.jpg', 3050000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000014', 'https://storage.uyemuratech.com/fotos/nop4q56-01.jpg', 'fotos/empresa-3/nop4q56-01.jpg', 1400000, TRUE,  1),
  ('f1000000-0000-0000-0000-000000000016', 'e1000000-0000-0000-0000-000000000015', 'https://storage.uyemuratech.com/fotos/opq5r67-01.jpg', 'fotos/empresa-3/opq5r67-01.jpg', 2650000, TRUE,  1);


-- ─────────────────────────────────────────────────────────────
-- 7. QR_CODE (um por veículo, exceto os vendidos)
-- ─────────────────────────────────────────────────────────────
INSERT INTO dealership.qr_code (id, veiculo_id, url_publica, token_publica, total_visualizacoes)
VALUES
  ('q1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'https://uyemuratech.com/v/tk-a1b2c3d4e5f6', 'tk-a1b2c3d4e5f6', 142),
  ('q1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000002', 'https://uyemuratech.com/v/tk-b2c3d4e5f6a1', 'tk-b2c3d4e5f6a1',  87),
  ('q1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000003', 'https://uyemuratech.com/v/tk-c3d4e5f6a1b2', 'tk-c3d4e5f6a1b2',  63),
  ('q1000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000005', 'https://uyemuratech.com/v/tk-e5f6a1b2c3d4', 'tk-e5f6a1b2c3d4',  29),
  ('q1000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000006', 'https://uyemuratech.com/v/tk-f6a1b2c3d4e5', 'tk-f6a1b2c3d4e5', 211),
  ('q1000000-0000-0000-0000-000000000007', 'e1000000-0000-0000-0000-000000000007', 'https://uyemuratech.com/v/tk-g7h8i9j0k1l2', 'tk-g7h8i9j0k1l2',  95),
  ('q1000000-0000-0000-0000-000000000008', 'e1000000-0000-0000-0000-000000000008', 'https://uyemuratech.com/v/tk-h8i9j0k1l2m3', 'tk-h8i9j0k1l2m3',  78),
  ('q1000000-0000-0000-0000-000000000009', 'e1000000-0000-0000-0000-000000000009', 'https://uyemuratech.com/v/tk-i9j0k1l2m3n4', 'tk-i9j0k1l2m3n4', 154),
  ('q1000000-0000-0000-0000-000000000011', 'e1000000-0000-0000-0000-000000000011', 'https://uyemuratech.com/v/tk-k1l2m3n4o5p6', 'tk-k1l2m3n4o5p6',  43),
  ('q1000000-0000-0000-0000-000000000012', 'e1000000-0000-0000-0000-000000000012', 'https://uyemuratech.com/v/tk-l2m3n4o5p6q7', 'tk-l2m3n4o5p6q7', 189),
  ('q1000000-0000-0000-0000-000000000013', 'e1000000-0000-0000-0000-000000000013', 'https://uyemuratech.com/v/tk-m3n4o5p6q7r8', 'tk-m3n4o5p6q7r8',  67),
  ('q1000000-0000-0000-0000-000000000014', 'e1000000-0000-0000-0000-000000000014', 'https://uyemuratech.com/v/tk-n4o5p6q7r8s9', 'tk-n4o5p6q7r8s9',  31),
  ('q1000000-0000-0000-0000-000000000015', 'e1000000-0000-0000-0000-000000000015', 'https://uyemuratech.com/v/tk-o5p6q7r8s9t0', 'tk-o5p6q7r8s9t0', 112);


COMMIT;

-- ─────────────────────────────────────────────────────────────
-- RESUMO
-- ─────────────────────────────────────────────────────────────
-- localizacao : 3 registros
-- empresa     : 3 registros
-- dominio     : 36 registros (papel:3, marca:10, modelo:15, combustivel:6, cambio:4, situacao:4)
-- usuario     : 5 registros
-- veiculo     : 15 registros (6 + 5 + 4, cobrindo Disponível / Em Negociação / Vendido / Reservado)
-- veiculo_foto: 16 registros
-- qr_code     : 13 registros (sem QR para os veículos vendidos)
-- ─────────────────────────────────────────────────────────────
