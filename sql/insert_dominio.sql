-- =============================================================================
-- Domínios globais (enum store) — dealership
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Papel do usuário
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('papel_usuario', 'administrador'),
    ('papel_usuario', 'gerente'),
    ('papel_usuario', 'usuario');

-- -----------------------------------------------------------------------------
-- Situação da assinatura
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_assinatura', 'ativa'),
    ('situacao_assinatura', 'trial'),
    ('situacao_assinatura', 'inadimplente'),
    ('situacao_assinatura', 'cancelada'),
    ('situacao_assinatura', 'expirada');

-- -----------------------------------------------------------------------------
-- Ciclo de cobrança
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('ciclo_cobranca', 'mensal'),
    ('ciclo_cobranca', 'anual');

-- -----------------------------------------------------------------------------
-- Situação da fatura
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_fatura', 'pendente'),
    ('situacao_fatura', 'paga'),
    ('situacao_fatura', 'atrasada'),
    ('situacao_fatura', 'cancelada'),
    ('situacao_fatura', 'estornada');

-- -----------------------------------------------------------------------------
-- Método de pagamento (usado em fatura.metodo_pagamento_id)
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('metodo_pagamento', 'cartao_credito'),
    ('metodo_pagamento', 'boleto'),
    ('metodo_pagamento', 'pix');

-- -----------------------------------------------------------------------------
-- Situação da manutenção
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_manutencao', 'pendente'),
    ('situacao_manutencao', 'em_andamento'),
    ('situacao_manutencao', 'concluida'),
    ('situacao_manutencao', 'cancelada');

-- -----------------------------------------------------------------------------
-- Bandeira do cartão de crédito
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('bandeira_cartao', 'visa'),
    ('bandeira_cartao', 'mastercard'),
    ('bandeira_cartao', 'elo'),
    ('bandeira_cartao', 'amex'),
    ('bandeira_cartao', 'hipercard');

-- -----------------------------------------------------------------------------
-- Tipo de arquivo do veículo
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('tipo_arquivo_veiculo', 'foto'),
    ('tipo_arquivo_veiculo', 'laudo');

-- -----------------------------------------------------------------------------
-- Situação do veículo
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_veiculo', 'Disponível'),
    ('situacao_veiculo', 'Reservado'),
    ('situacao_veiculo', 'Em Negociação'),
    ('situacao_veiculo', 'Em Manutenção'),
    ('situacao_veiculo', 'Vendido');

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
    ('combustivel', 'GNV');

-- -----------------------------------------------------------------------------
-- Câmbio
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('cambio', 'Manual'),
    ('cambio', 'Automático'),
    ('cambio', 'Automatizado'),
    ('cambio', 'CVT');

-- -----------------------------------------------------------------------------
-- Tipo de direção
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('tipo_direcao', 'Hidráulica'),
    ('tipo_direcao', 'Elétrica'),
    ('tipo_direcao', 'Eletro-hidráulica'),
    ('tipo_direcao', 'Manual');

-- -----------------------------------------------------------------------------
-- Marca do veículo
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('marca', 'Chevrolet'),
    ('marca', 'Fiat'),
    ('marca', 'Volkswagen'),
    ('marca', 'Toyota'),
    ('marca', 'Hyundai'),
    ('marca', 'Honda'),
    ('marca', 'Renault'),
    ('marca', 'Jeep'),
    ('marca', 'Ford'),
    ('marca', 'Nissan'),
    ('marca', 'Peugeot'),
    ('marca', 'Citroën'),
    ('marca', 'Kia'),
    ('marca', 'Mitsubishi'),
    ('marca', 'Mercedes-Benz'),
    ('marca', 'BMW'),
    ('marca', 'Audi'),
    ('marca', 'Caoa Chery'),
    ('marca', 'BYD'),
    ('marca', 'GWM'),
    ('marca', 'Subaru'),
    ('marca', 'Land Rover'),
    ('marca', 'Volvo'),
    ('marca', 'Ram'),
    ('marca', 'Dodge'),
    ('marca', 'Porsche'),
    ('marca', 'Suzuki'),
    ('marca', 'Yamaha'),
    ('marca', 'Outro');

-- -----------------------------------------------------------------------------
-- Modelo do veículo
-- Nota: o vínculo entre marca e modelo é validado pela aplicação.
-- -----------------------------------------------------------------------------
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    -- Chevrolet
    ('modelo', 'Onix'),
    ('modelo', 'Onix Plus'),
    ('modelo', 'Tracker'),
    ('modelo', 'Equinox'),
    ('modelo', 'Montana'),
    ('modelo', 'S10'),
    ('modelo', 'Spin'),
    ('modelo', 'Cruze'),
    ('modelo', 'Trailblazer'),
    ('modelo', 'Blazer'),
    -- Fiat
    ('modelo', 'Argo'),
    ('modelo', 'Cronos'),
    ('modelo', 'Pulse'),
    ('modelo', 'Fastback'),
    ('modelo', 'Toro'),
    ('modelo', 'Strada'),
    ('modelo', 'Ducato'),
    ('modelo', 'Mobi'),
    ('modelo', 'Fiorino'),
    -- Volkswagen
    ('modelo', 'Gol'),
    ('modelo', 'Polo'),
    ('modelo', 'Virtus'),
    ('modelo', 'T-Cross'),
    ('modelo', 'Taos'),
    ('modelo', 'Amarok'),
    ('modelo', 'Saveiro'),
    ('modelo', 'Jetta'),
    ('modelo', 'Tiguan'),
    ('modelo', 'ID.4'),
    -- Toyota
    ('modelo', 'Corolla'),
    ('modelo', 'Corolla Cross'),
    ('modelo', 'Hilux'),
    ('modelo', 'SW4'),
    ('modelo', 'Yaris'),
    ('modelo', 'RAV4'),
    ('modelo', 'Land Cruiser'),
    ('modelo', 'Prius'),
    -- Hyundai
    ('modelo', 'HB20'),
    ('modelo', 'HB20S'),
    ('modelo', 'Creta'),
    ('modelo', 'Tucson'),
    ('modelo', 'Santa Fe'),
    ('modelo', 'Ioniq 6'),
    -- Honda
    ('modelo', 'Civic'),
    ('modelo', 'HR-V'),
    ('modelo', 'CR-V'),
    ('modelo', 'City'),
    ('modelo', 'City Hatch'),
    ('modelo', 'WR-V'),
    ('modelo', 'Accord'),
    -- Renault
    ('modelo', 'Kwid'),
    ('modelo', 'Logan'),
    ('modelo', 'Sandero'),
    ('modelo', 'Stepway'),
    ('modelo', 'Duster'),
    ('modelo', 'Captur'),
    ('modelo', 'Oroch'),
    -- Jeep
    ('modelo', 'Renegade'),
    ('modelo', 'Compass'),
    ('modelo', 'Commander'),
    ('modelo', 'Wrangler'),
    -- Ford
    ('modelo', 'Ka'),
    ('modelo', 'EcoSport'),
    ('modelo', 'Territory'),
    ('modelo', 'Ranger'),
    ('modelo', 'Bronco Sport'),
    ('modelo', 'Maverick'),
    -- Nissan
    ('modelo', 'Kicks'),
    ('modelo', 'Versa'),
    ('modelo', 'Frontier'),
    ('modelo', 'Sentra'),
    ('modelo', 'March'),
    -- Peugeot
    ('modelo', '208'),
    ('modelo', '2008'),
    ('modelo', '3008'),
    ('modelo', '5008'),
    -- Citroën
    ('modelo', 'C3'),
    ('modelo', 'C4'),
    ('modelo', 'C4 Cactus'),
    ('modelo', 'Aircross'),
    -- Kia
    ('modelo', 'Sportage'),
    ('modelo', 'Sorento'),
    ('modelo', 'Stinger'),
    ('modelo', 'Carnival'),
    ('modelo', 'EV6'),
    -- Mitsubishi
    ('modelo', 'ASX'),
    ('modelo', 'Eclipse Cross'),
    ('modelo', 'Outlander'),
    ('modelo', 'L200 Triton'),
    ('modelo', 'Pajero'),
    -- Mercedes-Benz
    ('modelo', 'Classe A'),
    ('modelo', 'Classe C'),
    ('modelo', 'Classe E'),
    ('modelo', 'GLA'),
    ('modelo', 'GLC'),
    ('modelo', 'GLE'),
    -- BMW
    ('modelo', 'Série 1'),
    ('modelo', 'Série 3'),
    ('modelo', 'Série 5'),
    ('modelo', 'X1'),
    ('modelo', 'X3'),
    ('modelo', 'X5'),
    -- Audi
    ('modelo', 'A3'),
    ('modelo', 'A4'),
    ('modelo', 'A5'),
    ('modelo', 'Q3'),
    ('modelo', 'Q5'),
    ('modelo', 'Q8'),
    -- BYD
    ('modelo', 'Dolphin'),
    ('modelo', 'Seal'),
    ('modelo', 'Tan'),
    ('modelo', 'Han'),
    ('modelo', 'Yuan Plus'),
    -- Caoa Chery
    ('modelo', 'Tiggo 2'),
    ('modelo', 'Tiggo 5x'),
    ('modelo', 'Tiggo 7'),
    ('modelo', 'Tiggo 8'),
    -- GWM
    ('modelo', 'Haval H6'),
    ('modelo', 'Haval H2'),
    ('modelo', 'ORA 03'),
    -- Outros
    ('modelo', 'Outro');

