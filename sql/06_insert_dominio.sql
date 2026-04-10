-- =============================================================================
-- Domínios globais (enum store) — dealership
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Papel do usuário
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('papel_usuario', 'Administrador'),
    ('papel_usuario', 'Gerente'),
    ('papel_usuario', 'Usuario')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Situação da assinatura
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_assinatura', 'Ativa'),
    ('situacao_assinatura', 'Trial'),
    ('situacao_assinatura', 'Inadimplente'),
    ('situacao_assinatura', 'Cancelada'),
    ('situacao_assinatura', 'Expirada')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Ciclo de cobrança
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('ciclo_cobranca', 'Mensal'),
    ('ciclo_cobranca', 'Anual')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Situação da fatura
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_fatura', 'Pendente'),
    ('situacao_fatura', 'Paga'),
    ('situacao_fatura', 'Atrasada'),
    ('situacao_fatura', 'Cancelada'),
    ('situacao_fatura', 'Estornada')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Método de pagamento (usado em fatura.metodo_pagamento_id)
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('metodo_pagamento', 'Cartão de crédito'),
    ('metodo_pagamento', 'Boleto'),
    ('metodo_pagamento', 'Pix')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Situação da manutenção
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_manutencao', 'Pendente'),
    ('situacao_manutencao', 'Em andamento'),
    ('situacao_manutencao', 'Concluída'),
    ('situacao_manutencao', 'Cancelada')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Bandeira do cartão de crédito
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('bandeira_cartao', 'Visa'),
    ('bandeira_cartao', 'Mastercard'),
    ('bandeira_cartao', 'Elo'),
    ('bandeira_cartao', 'Amex'),
    ('bandeira_cartao', 'Hipercard')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Tipo de arquivo do veículo
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('tipo_arquivo_veiculo', 'Foto'),
    ('tipo_arquivo_veiculo', 'Laudo')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Situação do veículo
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_veiculo', 'Disponível'),
    ('situacao_veiculo', 'Reservado'),
    ('situacao_veiculo', 'Em Negociação'),
    ('situacao_veiculo', 'Em Manutenção'),
    ('situacao_veiculo', 'Vendido')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Combustível
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('combustivel', 'Gasolina'),
    ('combustivel', 'Etanol'),
    ('combustivel', 'Flex'),
    ('combustivel', 'Diesel'),
    ('combustivel', 'Elétrico'),
    ('combustivel', 'Híbrido'),
    ('combustivel', 'GNV')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Câmbio
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('cambio', 'Manual'),
    ('cambio', 'Automático'),
    ('cambio', 'Automatizado'),
    ('cambio', 'CVT')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Tipo de direção
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('tipo_direcao', 'Hidráulica'),
    ('tipo_direcao', 'Elétrica'),
    ('tipo_direcao', 'Eletro-hidráulica'),
    ('tipo_direcao', 'Manual')
ON CONFLICT (grupo_dominio, nome_dominio) DO NOTHING;
