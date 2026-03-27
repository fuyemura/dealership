-- =============================================================================
-- Uyemura Tech — Schema dealership — v8 final
-- Nomenclatura conforme README-DB.md § 9
--   UK  → uk_<tabela>_<coluna>
--   FK  → fk_<tabela>_<coluna>
--   IDX → idx_<tabela>_<coluna>
-- =============================================================================

CREATE TABLE dealership.empresa (
    id                     UUID         NOT NULL DEFAULT gen_random_uuid(),
    cnpj                   VARCHAR(14)  NOT NULL,
    inscricao_municipal    VARCHAR(50)  NOT NULL,
    inscricao_estadual     VARCHAR(50)  NOT NULL,
    nome_legal_empresa     VARCHAR(255) NOT NULL,
    nome_fantasia_empresa  VARCHAR(255) NULL,
    localizacao_id         UUID         NOT NULL,
    telefone_principal     VARCHAR(20)  NULL,
    telefone_secundario    VARCHAR(20)  NULL,
    email_empresa          VARCHAR(255) NULL,
    nome_representante     VARCHAR(255) NOT NULL,
    cargo_representante    VARCHAR(255) NOT NULL,
    telefone_representante VARCHAR(20)  NULL,
    criado_em              TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_empresa_nome_representante ON dealership.empresa (nome_representante);

COMMENT ON TABLE  dealership.empresa                          IS 'Cadastro da empresa que usa a aplicação.';
COMMENT ON COLUMN dealership.empresa.id                       IS 'Chave primária (PK) de identificação da empresa.';
COMMENT ON COLUMN dealership.empresa.cnpj                     IS 'Código do cadastro nacional de pessoa jurídica.';
COMMENT ON COLUMN dealership.empresa.inscricao_municipal      IS 'Número da inscrição municipal.';
COMMENT ON COLUMN dealership.empresa.inscricao_estadual       IS 'Número da inscrição estadual.';
COMMENT ON COLUMN dealership.empresa.nome_legal_empresa       IS 'Nome legal da empresa (Razão Social).';
COMMENT ON COLUMN dealership.empresa.nome_fantasia_empresa    IS 'Nome fantasia da empresa.';
COMMENT ON COLUMN dealership.empresa.localizacao_id           IS 'Chave estrangeira (FK) da localização.';
COMMENT ON COLUMN dealership.empresa.telefone_principal       IS 'Número completo do telefone principal da empresa.';
COMMENT ON COLUMN dealership.empresa.telefone_secundario      IS 'Número completo do telefone secundário da empresa.';
COMMENT ON COLUMN dealership.empresa.email_empresa            IS 'Endereço eletrônico de correio da empresa.';
COMMENT ON COLUMN dealership.empresa.nome_representante       IS 'Nome do representante legal da empresa.';
COMMENT ON COLUMN dealership.empresa.cargo_representante      IS 'Cargo do representante legal da empresa.';
COMMENT ON COLUMN dealership.empresa.telefone_representante   IS 'Telefone de contato do representante legal da empresa.';
COMMENT ON COLUMN dealership.empresa.criado_em                IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.empresa.atualizado_em            IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.empresa ADD PRIMARY KEY (id);
ALTER TABLE dealership.empresa ADD CONSTRAINT uk_empresa_cnpj UNIQUE (cnpj);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.usuario (
    id               UUID         NOT NULL DEFAULT gen_random_uuid(),
    empresa_id       UUID         NOT NULL,
    auth_id          UUID         NOT NULL,
    email_usuario    VARCHAR(255) NOT NULL,
    cpf              VARCHAR(11)  NOT NULL,
    nome_usuario     VARCHAR(255) NOT NULL,
    papel_usuario_id UUID         NOT NULL,
    ultimo_login_em  TIMESTAMP(0) WITH TIME ZONE NULL,
    criado_em        TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuario_empresa_id       ON dealership.usuario (empresa_id);
CREATE INDEX idx_usuario_papel_usuario_id ON dealership.usuario (papel_usuario_id);

COMMENT ON TABLE  dealership.usuario                    IS 'Cadastro de usuários da aplicação.';
COMMENT ON COLUMN dealership.usuario.id                 IS 'Chave primária (PK) de identificação do usuário.';
COMMENT ON COLUMN dealership.usuario.empresa_id         IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.usuario.auth_id            IS 'Identificador do usuário no provedor de autenticação (ex: Supabase Auth).';
COMMENT ON COLUMN dealership.usuario.email_usuario      IS 'Endereço de correio eletrônico do usuário.';
COMMENT ON COLUMN dealership.usuario.cpf                IS 'Cadastro de pessoa física.';
COMMENT ON COLUMN dealership.usuario.nome_usuario       IS 'Nome completo da pessoa.';
COMMENT ON COLUMN dealership.usuario.papel_usuario_id   IS 'Chave estrangeira (FK) para dominio — grupo: papel_usuario. Valores: administrador, gerente, usuario.';
COMMENT ON COLUMN dealership.usuario.ultimo_login_em    IS 'Data e hora do último login.';
COMMENT ON COLUMN dealership.usuario.criado_em          IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.usuario.atualizado_em      IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.usuario ADD PRIMARY KEY (id);
ALTER TABLE dealership.usuario ADD CONSTRAINT uk_usuario_auth_id       UNIQUE (auth_id);
ALTER TABLE dealership.usuario ADD CONSTRAINT uk_usuario_email_usuario UNIQUE (email_usuario);
ALTER TABLE dealership.usuario ADD CONSTRAINT uk_usuario_cpf           UNIQUE (cpf);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.localizacao (
    id                     UUID         NOT NULL DEFAULT gen_random_uuid(),
    cep                    VARCHAR(9)   NOT NULL,
    logradouro             VARCHAR(100) NOT NULL,
    numero_logradouro      INTEGER      NOT NULL,
    complemento_logradouro VARCHAR(100) NULL,
    bairro                 VARCHAR(100) NOT NULL,
    cidade                 VARCHAR(50)  NOT NULL,
    estado                 VARCHAR(2)   NOT NULL,
    criado_em              TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  dealership.localizacao                          IS 'Cadastro de localizações.';
COMMENT ON COLUMN dealership.localizacao.id                       IS 'Chave primária (PK) de identificação da localização.';
COMMENT ON COLUMN dealership.localizacao.cep                      IS 'CEP (Código de Endereçamento Postal)';
COMMENT ON COLUMN dealership.localizacao.logradouro               IS 'Descrição do logradouro.';
COMMENT ON COLUMN dealership.localizacao.numero_logradouro        IS 'Número do logradouro.';
COMMENT ON COLUMN dealership.localizacao.complemento_logradouro   IS 'Complemento do logradouro.';
COMMENT ON COLUMN dealership.localizacao.bairro                   IS 'Nome do bairro.';
COMMENT ON COLUMN dealership.localizacao.cidade                   IS 'Nome da cidade.';
COMMENT ON COLUMN dealership.localizacao.estado                   IS 'UF do estado da federação do Brasil.';
COMMENT ON COLUMN dealership.localizacao.criado_em                IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.localizacao.atualizado_em            IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.localizacao ADD PRIMARY KEY (id);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.dominio (
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    grupo_dominio VARCHAR(255) NOT NULL,
    nome_dominio  VARCHAR(255) NOT NULL,
    criado_em     TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  dealership.dominio               IS 'Cadastro de domínios (enum store).';
COMMENT ON COLUMN dealership.dominio.id            IS 'Chave primária (PK) de identificação do domínio.';
COMMENT ON COLUMN dealership.dominio.grupo_dominio IS 'Grupo de domínio (ex: marca, modelo, combustivel, situacao_veiculo).';
COMMENT ON COLUMN dealership.dominio.nome_dominio  IS 'Nome do valor dentro do grupo de domínio.';
COMMENT ON COLUMN dealership.dominio.criado_em     IS 'Data e hora de criação do registro na tabela.';

ALTER TABLE dealership.dominio ADD PRIMARY KEY (id);
ALTER TABLE dealership.dominio ADD CONSTRAINT uk_dominio_grupo_dominio_nome_dominio UNIQUE (grupo_dominio, nome_dominio);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.cliente (
    id               UUID         NOT NULL DEFAULT gen_random_uuid(),
    empresa_id       UUID         NOT NULL,
    cpf              VARCHAR(11)  NOT NULL,
    nome_cliente     VARCHAR(255) NOT NULL,
    telefone_cliente VARCHAR(20)  NULL,
    email_cliente    VARCHAR(255) NULL,
    criado_por       UUID         NOT NULL,
    criado_em        TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cliente_empresa_id ON dealership.cliente (empresa_id);
CREATE INDEX idx_cliente_criado_por  ON dealership.cliente (criado_por);

COMMENT ON TABLE  dealership.cliente                  IS 'Cadastro de clientes que compraram veículos.';
COMMENT ON COLUMN dealership.cliente.id               IS 'Chave primária (PK) de identificação do cliente.';
COMMENT ON COLUMN dealership.cliente.empresa_id       IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.cliente.cpf              IS 'CPF do cliente.';
COMMENT ON COLUMN dealership.cliente.nome_cliente     IS 'Nome completo do cliente.';
COMMENT ON COLUMN dealership.cliente.telefone_cliente IS 'Número de telefone do cliente.';
COMMENT ON COLUMN dealership.cliente.email_cliente    IS 'Endereço de correio eletrônico do cliente.';
COMMENT ON COLUMN dealership.cliente.criado_por       IS 'Chave estrangeira (FK) do usuário que realizou o cadastro.';
COMMENT ON COLUMN dealership.cliente.criado_em        IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.cliente.atualizado_em    IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.cliente ADD PRIMARY KEY (id);
ALTER TABLE dealership.cliente ADD CONSTRAINT uk_cliente_empresa_id_cpf UNIQUE (empresa_id, cpf);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.veiculo (
    id                     UUID          NOT NULL DEFAULT gen_random_uuid(),
    empresa_id             UUID          NOT NULL,
    placa                  VARCHAR(10)   NOT NULL,
    renavam                VARCHAR(11)   NOT NULL,
    marca_veiculo_id       UUID          NOT NULL,
    modelo_veiculo_id      UUID          NOT NULL,
    combustivel_veiculo_id UUID          NOT NULL,
    numero_chassi          VARCHAR(20)   NOT NULL,
    ano_modelo             INTEGER       NOT NULL,
    ano_fabricacao         INTEGER       NOT NULL,
    cor_veiculo            VARCHAR(20)   NOT NULL,
    direcao_veiculo_id     UUID          NOT NULL,
    vidro_eletrico         BOOLEAN       NOT NULL,
    cambio_veiculo_id      UUID          NOT NULL,
    trava_eletrica         BOOLEAN       NOT NULL,
    quantidade_portas      SMALLINT      NOT NULL,
    quilometragem          INTEGER       NOT NULL,
    data_compra            DATE          NOT NULL,
    preco_compra           DECIMAL(10,2) NOT NULL,
    descricao              VARCHAR(1000) NULL,
    situacao_veiculo_id    UUID          NOT NULL,
    data_venda             DATE          NULL,
    preco_venda            DECIMAL(10,2) NULL,
    data_entrega           DATE          NULL,
    laudo_aprovado         BOOLEAN       NOT NULL,
    vendido_para           UUID          NULL,
    vendido_por            UUID          NULL,
    criado_por             UUID          NOT NULL,
    atualizado_por         UUID          NOT NULL,
    criado_em              TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_veiculo_empresa_id             ON dealership.veiculo (empresa_id);
CREATE INDEX idx_veiculo_marca_veiculo_id        ON dealership.veiculo (marca_veiculo_id);
CREATE INDEX idx_veiculo_modelo_veiculo_id       ON dealership.veiculo (modelo_veiculo_id);
CREATE INDEX idx_veiculo_combustivel_veiculo_id  ON dealership.veiculo (combustivel_veiculo_id);
CREATE INDEX idx_veiculo_cambio_veiculo_id       ON dealership.veiculo (cambio_veiculo_id);
CREATE INDEX idx_veiculo_situacao_veiculo_id     ON dealership.veiculo (situacao_veiculo_id);
CREATE INDEX idx_veiculo_direcao_veiculo_id      ON dealership.veiculo (direcao_veiculo_id);

COMMENT ON TABLE  dealership.veiculo                          IS 'Cadastro do veículo.';
COMMENT ON COLUMN dealership.veiculo.id                       IS 'Chave primária (PK) de identificação do veículo.';
COMMENT ON COLUMN dealership.veiculo.empresa_id               IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.veiculo.placa                    IS 'Número da placa do veículo.';
COMMENT ON COLUMN dealership.veiculo.renavam                  IS 'Código do RENAVAM.';
COMMENT ON COLUMN dealership.veiculo.marca_veiculo_id         IS 'Chave estrangeira (FK) para dominio — grupo: marca.';
COMMENT ON COLUMN dealership.veiculo.modelo_veiculo_id        IS 'Chave estrangeira (FK) para dominio — grupo: modelo.';
COMMENT ON COLUMN dealership.veiculo.combustivel_veiculo_id   IS 'Chave estrangeira (FK) para dominio — grupo: combustivel.';
COMMENT ON COLUMN dealership.veiculo.numero_chassi            IS 'Número do chassi do veículo.';
COMMENT ON COLUMN dealership.veiculo.ano_modelo               IS 'Ano modelo do veículo.';
COMMENT ON COLUMN dealership.veiculo.ano_fabricacao           IS 'Ano de fabricação do veículo.';
COMMENT ON COLUMN dealership.veiculo.cor_veiculo              IS 'Nome da cor do veículo.';
COMMENT ON COLUMN dealership.veiculo.direcao_veiculo_id       IS 'Chave estrangeira (FK) para dominio — grupo: tipo_direcao. Valores: hidraulica, eletrica, manual.';
COMMENT ON COLUMN dealership.veiculo.vidro_eletrico           IS 'Indica se o veículo possui vidro elétrico.';
COMMENT ON COLUMN dealership.veiculo.cambio_veiculo_id        IS 'Chave estrangeira (FK) para dominio — grupo: cambio.';
COMMENT ON COLUMN dealership.veiculo.trava_eletrica           IS 'Indica se o veículo possui trava elétrica.';
COMMENT ON COLUMN dealership.veiculo.quantidade_portas        IS 'Quantidade de portas do veículo.';
COMMENT ON COLUMN dealership.veiculo.quilometragem            IS 'Quilometragem atual do veículo.';
COMMENT ON COLUMN dealership.veiculo.data_compra              IS 'Data da compra do veículo.';
COMMENT ON COLUMN dealership.veiculo.preco_compra             IS 'Preço de compra do veículo.';
COMMENT ON COLUMN dealership.veiculo.descricao                IS 'Observações sobre o veículo.';
COMMENT ON COLUMN dealership.veiculo.situacao_veiculo_id      IS 'Chave estrangeira (FK) para dominio — grupo: situacao_veiculo.';
COMMENT ON COLUMN dealership.veiculo.data_venda               IS 'Data da venda do veículo.';
COMMENT ON COLUMN dealership.veiculo.preco_venda              IS 'Preço de venda do veículo.';
COMMENT ON COLUMN dealership.veiculo.data_entrega             IS 'Data da entrega do veículo ao comprador.';
COMMENT ON COLUMN dealership.veiculo.laudo_aprovado           IS 'Indica se o laudo de vistoria do veículo foi aprovado.';
COMMENT ON COLUMN dealership.veiculo.vendido_para             IS 'Chave estrangeira (FK) do cliente para quem o veículo foi vendido.';
COMMENT ON COLUMN dealership.veiculo.vendido_por              IS 'Chave estrangeira (FK) do usuário que efetuou a venda.';
COMMENT ON COLUMN dealership.veiculo.criado_por               IS 'Chave estrangeira (FK) do usuário que criou o registro.';
COMMENT ON COLUMN dealership.veiculo.atualizado_por           IS 'Chave estrangeira (FK) do usuário que atualizou o registro.';
COMMENT ON COLUMN dealership.veiculo.criado_em                IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.veiculo.atualizado_em            IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.veiculo ADD PRIMARY KEY (id);
ALTER TABLE dealership.veiculo ADD CONSTRAINT uk_veiculo_empresa_id_placa UNIQUE (empresa_id, placa);
ALTER TABLE dealership.veiculo ADD CONSTRAINT uk_veiculo_numero_chassi    UNIQUE (numero_chassi);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.veiculo_arquivo (
    id                UUID     NOT NULL DEFAULT gen_random_uuid(),
    veiculo_id        UUID     NOT NULL,
    empresa_id        UUID     NOT NULL,
    tipo_arquivo_id   UUID     NOT NULL,
    url_arquivo       TEXT     NOT NULL,
    caminho_storage   TEXT     NOT NULL,
    tamanho_arquivo   INTEGER  NOT NULL,
    arquivo_principal BOOLEAN  NOT NULL DEFAULT FALSE,
    ordem_exibicao    SMALLINT NOT NULL DEFAULT 0,
    criado_por        UUID     NOT NULL,
    criado_em         TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_veiculo_arquivo_veiculo_id      ON dealership.veiculo_arquivo (veiculo_id);
CREATE INDEX idx_veiculo_arquivo_empresa_id      ON dealership.veiculo_arquivo (empresa_id);
CREATE INDEX idx_veiculo_arquivo_tipo_arquivo_id ON dealership.veiculo_arquivo (tipo_arquivo_id);

COMMENT ON TABLE  dealership.veiculo_arquivo                     IS 'Arquivos associados ao veículo: fotos, laudos de vistoria e demais documentos.';
COMMENT ON COLUMN dealership.veiculo_arquivo.id                  IS 'Chave primária (PK) de identificação do arquivo.';
COMMENT ON COLUMN dealership.veiculo_arquivo.veiculo_id          IS 'Chave estrangeira (FK) de identificação do veículo.';
COMMENT ON COLUMN dealership.veiculo_arquivo.empresa_id          IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.veiculo_arquivo.tipo_arquivo_id     IS 'Chave estrangeira (FK) para dominio — grupo: tipo_arquivo_veiculo. Valores: foto, laudo.';
COMMENT ON COLUMN dealership.veiculo_arquivo.url_arquivo         IS 'URL pública do arquivo no storage.';
COMMENT ON COLUMN dealership.veiculo_arquivo.caminho_storage     IS 'Caminho interno do arquivo no storage.';
COMMENT ON COLUMN dealership.veiculo_arquivo.tamanho_arquivo     IS 'Tamanho do arquivo em bytes.';
COMMENT ON COLUMN dealership.veiculo_arquivo.arquivo_principal   IS 'Indica se o arquivo é a foto principal de capa. Aplicável apenas quando tipo_arquivo_id = foto.';
COMMENT ON COLUMN dealership.veiculo_arquivo.ordem_exibicao      IS 'Ordem de exibição do arquivo na galeria. Aplicável apenas quando tipo_arquivo_id = foto.';
COMMENT ON COLUMN dealership.veiculo_arquivo.criado_por          IS 'Chave estrangeira (FK) do usuário que realizou o upload.';
COMMENT ON COLUMN dealership.veiculo_arquivo.criado_em           IS 'Data e hora de criação do registro na tabela.';

ALTER TABLE dealership.veiculo_arquivo ADD PRIMARY KEY (id);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.qr_code (
    id                  UUID         NOT NULL DEFAULT gen_random_uuid(),
    veiculo_id          UUID         NOT NULL,
    url_publica         VARCHAR(255) NOT NULL,
    token_publica       VARCHAR(255) NOT NULL,
    total_visualizacoes INTEGER      NOT NULL DEFAULT 0,
    criado_em           TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_qr_code_veiculo_id ON dealership.qr_code (veiculo_id);

COMMENT ON TABLE  dealership.qr_code                       IS 'Cadastro dos QR Codes gerados para os veículos.';
COMMENT ON COLUMN dealership.qr_code.id                    IS 'Chave primária (PK) de identificação do QR Code.';
COMMENT ON COLUMN dealership.qr_code.veiculo_id            IS 'Chave estrangeira (FK) de identificação do veículo.';
COMMENT ON COLUMN dealership.qr_code.url_publica           IS 'URL pública associada ao QR Code.';
COMMENT ON COLUMN dealership.qr_code.token_publica         IS 'Token único e específico do QR Code.';
COMMENT ON COLUMN dealership.qr_code.total_visualizacoes   IS 'Quantidade total de visualizações do QR Code.';
COMMENT ON COLUMN dealership.qr_code.criado_em             IS 'Data e hora de criação do registro na tabela.';

ALTER TABLE dealership.qr_code ADD PRIMARY KEY (id);
ALTER TABLE dealership.qr_code ADD CONSTRAINT uk_qr_code_token_publica UNIQUE (token_publica);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.plano (
    id                      UUID          NOT NULL DEFAULT gen_random_uuid(),
    nome_plano              VARCHAR(100)  NOT NULL,
    descricao_plano         VARCHAR(500)  NULL,
    preco_mensal            DECIMAL(10,2) NOT NULL,
    preco_anual             DECIMAL(10,2) NULL,
    limite_veiculos         INTEGER       NOT NULL,
    limite_usuarios         INTEGER       NOT NULL,
    limite_fotos_veiculo    INTEGER       NOT NULL,
    tem_qr_code             BOOLEAN       NOT NULL DEFAULT TRUE,
    tem_relatorios          BOOLEAN       NOT NULL DEFAULT FALSE,
    tem_suporte_prioritario BOOLEAN       NOT NULL DEFAULT FALSE,
    plano_ativo             BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em               TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em           TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plano_plano_ativo ON dealership.plano (plano_ativo);

COMMENT ON TABLE  dealership.plano                           IS 'Catálogo de planos de assinatura disponíveis na plataforma.';
COMMENT ON COLUMN dealership.plano.id                        IS 'Chave primária (PK) de identificação do plano.';
COMMENT ON COLUMN dealership.plano.nome_plano                IS 'Nome comercial do plano (ex: Starter, Pro, Enterprise).';
COMMENT ON COLUMN dealership.plano.descricao_plano           IS 'Descrição resumida das funcionalidades e benefícios do plano.';
COMMENT ON COLUMN dealership.plano.preco_mensal              IS 'Valor de cobrança mensal do plano em reais (BRL).';
COMMENT ON COLUMN dealership.plano.preco_anual               IS 'Valor de cobrança anual do plano em reais (BRL). NULL indica que o plano não oferece ciclo anual.';
COMMENT ON COLUMN dealership.plano.limite_veiculos           IS 'Quantidade máxima de veículos cadastrados permitida no plano. Use -1 para ilimitado.';
COMMENT ON COLUMN dealership.plano.limite_usuarios           IS 'Quantidade máxima de usuários por empresa permitida no plano. Use -1 para ilimitado.';
COMMENT ON COLUMN dealership.plano.limite_fotos_veiculo      IS 'Quantidade máxima de fotos por veículo permitida no plano.';
COMMENT ON COLUMN dealership.plano.tem_qr_code               IS 'Indica se o plano inclui geração e gestão de QR Codes para os veículos.';
COMMENT ON COLUMN dealership.plano.tem_relatorios            IS 'Indica se o plano inclui acesso ao módulo de relatórios e analytics.';
COMMENT ON COLUMN dealership.plano.tem_suporte_prioritario   IS 'Indica se o plano inclui suporte com atendimento prioritário.';
COMMENT ON COLUMN dealership.plano.plano_ativo               IS 'Indica se o plano está disponível para novas contratações. FALSE oculta o plano mas preserva assinaturas existentes.';
COMMENT ON COLUMN dealership.plano.criado_em                 IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.plano.atualizado_em             IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.plano ADD PRIMARY KEY (id);
ALTER TABLE dealership.plano ADD CONSTRAINT uk_plano_nome_plano UNIQUE (nome_plano);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.assinatura (
    id                     UUID         NOT NULL DEFAULT gen_random_uuid(),
    empresa_id             UUID         NOT NULL,
    plano_id               UUID         NOT NULL,
    situacao_assinatura_id UUID         NOT NULL,
    ciclo_cobranca_id      UUID         NOT NULL,
    data_inicio            DATE         NOT NULL,
    data_fim               DATE         NULL,
    data_cancelamento      DATE         NULL,
    motivo_cancelamento    VARCHAR(500) NULL,
    trial_ativo            BOOLEAN      NOT NULL DEFAULT FALSE,
    data_fim_trial         DATE         NULL,
    gateway_cliente_id     VARCHAR(255) NULL,
    gateway_assinatura_id  VARCHAR(255) NULL,
    criado_em              TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assinatura_empresa_id             ON dealership.assinatura (empresa_id);
CREATE INDEX idx_assinatura_plano_id               ON dealership.assinatura (plano_id);
CREATE INDEX idx_assinatura_situacao_assinatura_id ON dealership.assinatura (situacao_assinatura_id);

COMMENT ON TABLE  dealership.assinatura                          IS 'Registro da assinatura de um plano por uma empresa. Controla o ciclo de vida da contratação.';
COMMENT ON COLUMN dealership.assinatura.id                       IS 'Chave primária (PK) de identificação da assinatura.';
COMMENT ON COLUMN dealership.assinatura.empresa_id               IS 'Chave estrangeira (FK) da empresa que contratou o plano.';
COMMENT ON COLUMN dealership.assinatura.plano_id                 IS 'Chave estrangeira (FK) do plano contratado.';
COMMENT ON COLUMN dealership.assinatura.situacao_assinatura_id   IS 'Chave estrangeira (FK) para dominio — grupo: situacao_assinatura. Valores: ativa, trial, inadimplente, cancelada, expirada.';
COMMENT ON COLUMN dealership.assinatura.ciclo_cobranca_id        IS 'Chave estrangeira (FK) para dominio — grupo: ciclo_cobranca. Valores: mensal, anual.';
COMMENT ON COLUMN dealership.assinatura.data_inicio              IS 'Data de início de vigência da assinatura.';
COMMENT ON COLUMN dealership.assinatura.data_fim                 IS 'Data de encerramento previsto ou efetivo da assinatura. NULL enquanto ativa sem prazo definido.';
COMMENT ON COLUMN dealership.assinatura.data_cancelamento        IS 'Data em que a assinatura foi cancelada, se aplicável.';
COMMENT ON COLUMN dealership.assinatura.motivo_cancelamento      IS 'Descrição do motivo do cancelamento.';
COMMENT ON COLUMN dealership.assinatura.trial_ativo              IS 'Indica se a assinatura está em período de avaliação gratuita (trial).';
COMMENT ON COLUMN dealership.assinatura.data_fim_trial           IS 'Data de encerramento do período de trial. NULL quando trial_ativo = FALSE.';
COMMENT ON COLUMN dealership.assinatura.gateway_cliente_id       IS 'Identificador do cliente no gateway de pagamento externo (ex: Stripe customer_id).';
COMMENT ON COLUMN dealership.assinatura.gateway_assinatura_id    IS 'Identificador da assinatura no gateway de pagamento externo (ex: Stripe subscription_id).';
COMMENT ON COLUMN dealership.assinatura.criado_em                IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.assinatura.atualizado_em            IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.assinatura ADD PRIMARY KEY (id);
ALTER TABLE dealership.assinatura ADD CONSTRAINT uk_assinatura_empresa_id UNIQUE (empresa_id);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.fatura (
    id                   UUID          NOT NULL DEFAULT gen_random_uuid(),
    assinatura_id        UUID          NOT NULL,
    empresa_id           UUID          NOT NULL,
    numero_fatura        VARCHAR(50)   NOT NULL,
    situacao_fatura_id   UUID          NOT NULL,
    valor_bruto          DECIMAL(10,2) NOT NULL,
    valor_desconto       DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor_liquido        DECIMAL(10,2) NOT NULL,
    data_competencia     DATE          NOT NULL,
    data_vencimento      DATE          NOT NULL,
    data_pagamento       DATE          NULL,
    metodo_pagamento_id  UUID          NOT NULL,
    gateway_fatura_id    VARCHAR(255)  NULL,
    gateway_url_boleto   VARCHAR(255)  NULL,
    gateway_url_pix      VARCHAR(255)  NULL,
    tentativas_cobranca  BIGINT        NOT NULL DEFAULT 0,
    proxima_tentativa_em TIMESTAMP(0) WITH TIME ZONE NULL,
    criado_em            TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em        TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fatura_assinatura_id       ON dealership.fatura (assinatura_id);
CREATE INDEX idx_fatura_empresa_id          ON dealership.fatura (empresa_id);
CREATE INDEX idx_fatura_situacao_fatura_id  ON dealership.fatura (situacao_fatura_id);
CREATE INDEX idx_fatura_metodo_pagamento_id ON dealership.fatura (metodo_pagamento_id);

COMMENT ON TABLE  dealership.fatura                        IS 'Registro de cada cobrança gerada para uma assinatura. Controla o ciclo financeiro de cada ciclo de pagamento.';
COMMENT ON COLUMN dealership.fatura.id                     IS 'Chave primária (PK) de identificação da fatura.';
COMMENT ON COLUMN dealership.fatura.assinatura_id          IS 'Chave estrangeira (FK) da assinatura à qual esta fatura pertence.';
COMMENT ON COLUMN dealership.fatura.empresa_id             IS 'Chave estrangeira (FK) da empresa devedora. Redundante com assinatura_id para facilitar queries diretas por empresa.';
COMMENT ON COLUMN dealership.fatura.numero_fatura          IS 'Número sequencial legível da fatura (ex: FAT-2025-00001). Gerado pela aplicação.';
COMMENT ON COLUMN dealership.fatura.situacao_fatura_id     IS 'Chave estrangeira (FK) para dominio — grupo: situacao_fatura. Valores: pendente, paga, atrasada, cancelada, estornada.';
COMMENT ON COLUMN dealership.fatura.valor_bruto            IS 'Valor original da fatura antes de descontos, em reais (BRL).';
COMMENT ON COLUMN dealership.fatura.valor_desconto         IS 'Valor total de descontos aplicados (cupons, promoções), em reais (BRL).';
COMMENT ON COLUMN dealership.fatura.valor_liquido          IS 'Valor final a ser cobrado após descontos (valor_bruto - valor_desconto), em reais (BRL).';
COMMENT ON COLUMN dealership.fatura.data_competencia       IS 'Data de referência do período de serviço cobrado nesta fatura.';
COMMENT ON COLUMN dealership.fatura.data_vencimento        IS 'Data limite para pagamento sem mora ou multa.';
COMMENT ON COLUMN dealership.fatura.data_pagamento         IS 'Data em que o pagamento foi confirmado. NULL enquanto a fatura estiver pendente.';
COMMENT ON COLUMN dealership.fatura.metodo_pagamento_id    IS 'Chave estrangeira (FK) para dominio — grupo: metodo_pagamento. Valores: cartao_credito, boleto, pix.';
COMMENT ON COLUMN dealership.fatura.gateway_fatura_id      IS 'Identificador da fatura no gateway de pagamento externo (ex: Stripe invoice_id).';
COMMENT ON COLUMN dealership.fatura.gateway_url_boleto     IS 'URL do boleto bancário gerado pelo gateway de pagamento.';
COMMENT ON COLUMN dealership.fatura.gateway_url_pix        IS 'URL ou payload do QR Code Pix gerado pelo gateway de pagamento.';
COMMENT ON COLUMN dealership.fatura.tentativas_cobranca    IS 'Contador de tentativas de cobrança automática realizadas pelo gateway.';
COMMENT ON COLUMN dealership.fatura.proxima_tentativa_em   IS 'Data e hora agendada para a próxima tentativa de cobrança automática. NULL quando não há tentativa pendente.';
COMMENT ON COLUMN dealership.fatura.criado_em              IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.fatura.atualizado_em          IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.fatura ADD PRIMARY KEY (id);
ALTER TABLE dealership.fatura ADD CONSTRAINT uk_fatura_numero_fatura     UNIQUE (numero_fatura);
ALTER TABLE dealership.fatura ADD CONSTRAINT uk_fatura_gateway_fatura_id UNIQUE (gateway_fatura_id);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.veiculo_custo (
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    empresa_id    UUID         NOT NULL,
    nome_custo    VARCHAR(255) NOT NULL,
    descricao     VARCHAR(500) NULL,
    criado_por    UUID         NOT NULL,
    criado_em     TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_veiculo_custo_empresa_id ON dealership.veiculo_custo (empresa_id);

COMMENT ON TABLE  dealership.veiculo_custo              IS 'Catálogo de tipos de custo/serviço de manutenção, scoped por empresa.';
COMMENT ON COLUMN dealership.veiculo_custo.id           IS 'Chave primária (PK) de identificação do tipo de custo.';
COMMENT ON COLUMN dealership.veiculo_custo.empresa_id   IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.veiculo_custo.nome_custo   IS 'Nome do tipo de custo (ex: Troca de pneu, Pintura).';
COMMENT ON COLUMN dealership.veiculo_custo.descricao    IS 'Descrição detalhada do serviço.';
COMMENT ON COLUMN dealership.veiculo_custo.criado_por   IS 'Chave estrangeira (FK) do usuário que criou o registro.';
COMMENT ON COLUMN dealership.veiculo_custo.criado_em    IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.veiculo_custo.atualizado_em IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.veiculo_custo ADD PRIMARY KEY (id);


-- -----------------------------------------------------------------------------

CREATE TABLE dealership.veiculo_manutencao (
    id                     UUID          NOT NULL DEFAULT gen_random_uuid(),
    veiculo_id             UUID          NOT NULL,
    custo_id               UUID          NOT NULL,
    empresa_id             UUID          NOT NULL,
    valor_manutencao       DECIMAL(10,2) NOT NULL,
    obs_manutencao         VARCHAR(500)  NULL,
    situacao_manutencao_id UUID          NOT NULL,
    data_conclusao         DATE          NOT NULL,
    criado_por             UUID          NOT NULL,
    criado_em              TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW(),
    atualizado_em          TIMESTAMP(0) WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_veiculo_manutencao_veiculo_id             ON dealership.veiculo_manutencao (veiculo_id);
CREATE INDEX idx_veiculo_manutencao_custo_id               ON dealership.veiculo_manutencao (custo_id);
CREATE INDEX idx_veiculo_manutencao_empresa_id             ON dealership.veiculo_manutencao (empresa_id);
CREATE INDEX idx_veiculo_manutencao_situacao_manutencao_id ON dealership.veiculo_manutencao (situacao_manutencao_id);

COMMENT ON TABLE  dealership.veiculo_manutencao                          IS 'Itens de manutenção realizados no veículo.';
COMMENT ON COLUMN dealership.veiculo_manutencao.id                       IS 'Chave primária (PK) de identificação da manutenção.';
COMMENT ON COLUMN dealership.veiculo_manutencao.veiculo_id               IS 'Chave estrangeira (FK) de identificação do veículo.';
COMMENT ON COLUMN dealership.veiculo_manutencao.custo_id                 IS 'Chave estrangeira (FK) para o catálogo de custos (veiculo_custo).';
COMMENT ON COLUMN dealership.veiculo_manutencao.empresa_id               IS 'Chave estrangeira (FK) de identificação da empresa.';
COMMENT ON COLUMN dealership.veiculo_manutencao.valor_manutencao         IS 'Valor real cobrado por este serviço neste veículo.';
COMMENT ON COLUMN dealership.veiculo_manutencao.obs_manutencao           IS 'Observações adicionais sobre a manutenção realizada.';
COMMENT ON COLUMN dealership.veiculo_manutencao.situacao_manutencao_id   IS 'Chave estrangeira (FK) para dominio — grupo: situacao_manutencao.';
COMMENT ON COLUMN dealership.veiculo_manutencao.data_conclusao           IS 'Data em que a manutenção foi concluída.';
COMMENT ON COLUMN dealership.veiculo_manutencao.criado_por               IS 'Chave estrangeira (FK) do usuário que criou o registro.';
COMMENT ON COLUMN dealership.veiculo_manutencao.criado_em                IS 'Data e hora de criação do registro na tabela.';
COMMENT ON COLUMN dealership.veiculo_manutencao.atualizado_em            IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE dealership.veiculo_manutencao ADD PRIMARY KEY (id);


-- =============================================================================
-- FOREIGN KEYS — fk_<tabela>_<coluna>
-- =============================================================================

-- empresa
ALTER TABLE dealership.empresa
    ADD CONSTRAINT fk_empresa_localizacao_id
    FOREIGN KEY (localizacao_id) REFERENCES dealership.localizacao (id);

-- usuario
ALTER TABLE dealership.usuario
    ADD CONSTRAINT fk_usuario_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.usuario
    ADD CONSTRAINT fk_usuario_papel_usuario_id
    FOREIGN KEY (papel_usuario_id) REFERENCES dealership.dominio (id);

-- cliente
ALTER TABLE dealership.cliente
    ADD CONSTRAINT fk_cliente_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.cliente
    ADD CONSTRAINT fk_cliente_criado_por
    FOREIGN KEY (criado_por) REFERENCES dealership.usuario (id);

-- veiculo
ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_marca_veiculo_id
    FOREIGN KEY (marca_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_modelo_veiculo_id
    FOREIGN KEY (modelo_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_combustivel_veiculo_id
    FOREIGN KEY (combustivel_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_direcao_veiculo_id
    FOREIGN KEY (direcao_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_cambio_veiculo_id
    FOREIGN KEY (cambio_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_situacao_veiculo_id
    FOREIGN KEY (situacao_veiculo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_vendido_para
    FOREIGN KEY (vendido_para) REFERENCES dealership.cliente (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_vendido_por
    FOREIGN KEY (vendido_por) REFERENCES dealership.usuario (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_criado_por
    FOREIGN KEY (criado_por) REFERENCES dealership.usuario (id);

ALTER TABLE dealership.veiculo
    ADD CONSTRAINT fk_veiculo_atualizado_por
    FOREIGN KEY (atualizado_por) REFERENCES dealership.usuario (id);

-- veiculo_arquivo
ALTER TABLE dealership.veiculo_arquivo
    ADD CONSTRAINT fk_veiculo_arquivo_veiculo_id
    FOREIGN KEY (veiculo_id) REFERENCES dealership.veiculo (id);

ALTER TABLE dealership.veiculo_arquivo
    ADD CONSTRAINT fk_veiculo_arquivo_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.veiculo_arquivo
    ADD CONSTRAINT fk_veiculo_arquivo_tipo_arquivo_id
    FOREIGN KEY (tipo_arquivo_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo_arquivo
    ADD CONSTRAINT fk_veiculo_arquivo_criado_por
    FOREIGN KEY (criado_por) REFERENCES dealership.usuario (id);

-- qr_code
ALTER TABLE dealership.qr_code
    ADD CONSTRAINT fk_qr_code_veiculo_id
    FOREIGN KEY (veiculo_id) REFERENCES dealership.veiculo (id);

-- assinatura
ALTER TABLE dealership.assinatura
    ADD CONSTRAINT fk_assinatura_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.assinatura
    ADD CONSTRAINT fk_assinatura_plano_id
    FOREIGN KEY (plano_id) REFERENCES dealership.plano (id);

ALTER TABLE dealership.assinatura
    ADD CONSTRAINT fk_assinatura_situacao_assinatura_id
    FOREIGN KEY (situacao_assinatura_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.assinatura
    ADD CONSTRAINT fk_assinatura_ciclo_cobranca_id
    FOREIGN KEY (ciclo_cobranca_id) REFERENCES dealership.dominio (id);

-- fatura
ALTER TABLE dealership.fatura
    ADD CONSTRAINT fk_fatura_assinatura_id
    FOREIGN KEY (assinatura_id) REFERENCES dealership.assinatura (id);

ALTER TABLE dealership.fatura
    ADD CONSTRAINT fk_fatura_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.fatura
    ADD CONSTRAINT fk_fatura_situacao_fatura_id
    FOREIGN KEY (situacao_fatura_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.fatura
    ADD CONSTRAINT fk_fatura_metodo_pagamento_id
    FOREIGN KEY (metodo_pagamento_id) REFERENCES dealership.dominio (id);

-- veiculo_custo
ALTER TABLE dealership.veiculo_custo
    ADD CONSTRAINT fk_veiculo_custo_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.veiculo_custo
    ADD CONSTRAINT fk_veiculo_custo_criado_por
    FOREIGN KEY (criado_por) REFERENCES dealership.usuario (id);

-- veiculo_manutencao
ALTER TABLE dealership.veiculo_manutencao
    ADD CONSTRAINT fk_veiculo_manutencao_veiculo_id
    FOREIGN KEY (veiculo_id) REFERENCES dealership.veiculo (id);

ALTER TABLE dealership.veiculo_manutencao
    ADD CONSTRAINT fk_veiculo_manutencao_custo_id
    FOREIGN KEY (custo_id) REFERENCES dealership.veiculo_custo (id);

ALTER TABLE dealership.veiculo_manutencao
    ADD CONSTRAINT fk_veiculo_manutencao_empresa_id
    FOREIGN KEY (empresa_id) REFERENCES dealership.empresa (id);

ALTER TABLE dealership.veiculo_manutencao
    ADD CONSTRAINT fk_veiculo_manutencao_situacao_manutencao_id
    FOREIGN KEY (situacao_manutencao_id) REFERENCES dealership.dominio (id);

ALTER TABLE dealership.veiculo_manutencao
    ADD CONSTRAINT fk_veiculo_manutencao_criado_por
    FOREIGN KEY (criado_por) REFERENCES dealership.usuario (id);
