CREATE TABLE "dealership"."empresa"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cnpj" VARCHAR(14) NOT NULL,
    "inscricao_municipal" VARCHAR(50) NOT NULL,
    "inscricao_estadual" VARCHAR(50) NOT NULL,
    "nome_legal_empresa" VARCHAR(255) NOT NULL,
    "nome_fantasia_empresa" VARCHAR(255) NULL,
    "localizacao_id" UUID NOT NULL,
    "telefone_principal" VARCHAR(20) NULL,
    "telefone_secundario" VARCHAR(20) NULL,
    "email_empresa" VARCHAR(255) NULL,
    "representante_id" UUID NOT NULL,
    "cargo_representante" VARCHAR(255) NOT NULL,
    "telefone_representante" VARCHAR(20) NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_empresa_representante_id_index" ON "dealership"."empresa"("representante_id");

COMMENT ON TABLE "dealership"."empresa" IS 'Cadastro da empresa que usa a aplicação.';

ALTER TABLE
    "dealership"."empresa"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."empresa"
ADD
    CONSTRAINT "dealership_empresa_cnpj_unique" UNIQUE("cnpj");

COMMENT ON COLUMN "dealership"."empresa"."id" IS 'Chave primária (PK) de identificação da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."cnpj" IS 'Código do cadastro nacional de pessoa jurídica';

COMMENT ON COLUMN "dealership"."empresa"."inscricao_municipal" IS 'Número da inscrição municipal.';

COMMENT ON COLUMN "dealership"."empresa"."inscricao_estadual" IS 'Número da inscrição estadual.';

COMMENT ON COLUMN "dealership"."empresa"."nome_legal_empresa" IS 'Nome legal da empresa (Razão Social).';

COMMENT ON COLUMN "dealership"."empresa"."nome_fantasia_empresa" IS 'Nome fantasia da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."localizacao_id" IS 'Chave estrangeira (FK) da localização.';

COMMENT ON COLUMN "dealership"."empresa"."telefone_principal" IS 'Número completo do telefone principal da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."telefone_secundario" IS 'Número completo do telefone secundário da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."email_empresa" IS 'Endereço eletrônico de correio da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."representante_id" IS 'Chave estrangeira (FK) de identificação do usuário representante legal da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."cargo_representante" IS 'Cargo do representante legal da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."telefone_representante" IS 'Telefone de contato do representante legal da empresa.';

COMMENT ON COLUMN "dealership"."empresa"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."empresa"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."usuario"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "auth_id" UUID NOT NULL,
    "email_usuario" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome_usuario" VARCHAR(255) NOT NULL,
    "papel_usuario_id" UUID NOT NULL,
    "ultimo_login_em" TIMESTAMP(0) WITH TIME zone NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_usuario_empresa_id_index" ON "dealership"."usuario"("empresa_id");

CREATE INDEX "dealership_usuario_papel_usuario_id_index" ON "dealership"."usuario"("papel_usuario_id");

COMMENT ON TABLE "dealership"."usuario" IS 'Cadastro de usuários da aplicação.';

ALTER TABLE
    "dealership"."usuario"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."usuario"
ADD
    CONSTRAINT "dealership_usuario_auth_id_unique" UNIQUE("auth_id");

ALTER TABLE
    "dealership"."usuario"
ADD
    CONSTRAINT "dealership_usuario_email_usuario_unique" UNIQUE("email_usuario");

ALTER TABLE
    "dealership"."usuario"
ADD
    CONSTRAINT "dealership_usuario_cpf_unique" UNIQUE("cpf");

COMMENT ON COLUMN "dealership"."usuario"."id" IS 'Chave primária (PK) de identificação do usuário.';

COMMENT ON COLUMN "dealership"."usuario"."empresa_id" IS 'Chave estrangeira (FK) de identificação da empresa.';

COMMENT ON COLUMN "dealership"."usuario"."email_usuario" IS 'Descrição do endereço de correio eletrônico do usuário.';

COMMENT ON COLUMN "dealership"."usuario"."cpf" IS 'Cadastro de pessoa física.';

COMMENT ON COLUMN "dealership"."usuario"."nome_usuario" IS 'Nome completo da pessoa.';

COMMENT ON COLUMN "dealership"."usuario"."papel_usuario_id" IS 'Qual o papel do usuário. Podem ser administrador, gerente ou usuário.';

COMMENT ON COLUMN "dealership"."usuario"."ultimo_login_em" IS 'Data e hora do último login.';

COMMENT ON COLUMN "dealership"."usuario"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."usuario"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."localizacao"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_ibge" INTEGER NOT NULL,
    "logradouro" VARCHAR(100) NOT NULL,
    "numero_logradouro" INTEGER NOT NULL,
    "complemento_logradouro" VARCHAR(100) NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "cidade" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "dealership"."localizacao" IS 'Cadastro de localizações.';

ALTER TABLE
    "dealership"."localizacao"
ADD
    PRIMARY KEY("id");

COMMENT ON COLUMN "dealership"."localizacao"."id" IS 'Chave primária (PK) de identificação da localização.';

COMMENT ON COLUMN "dealership"."localizacao"."codigo_ibge" IS 'Código de identificação do IBGE.';

COMMENT ON COLUMN "dealership"."localizacao"."logradouro" IS 'Descrição do logradouro.';

COMMENT ON COLUMN "dealership"."localizacao"."numero_logradouro" IS 'Número do logradouro.';

COMMENT ON COLUMN "dealership"."localizacao"."complemento_logradouro" IS 'Complemento do logradouro.';

COMMENT ON COLUMN "dealership"."localizacao"."bairro" IS 'Nome do bairro.';

COMMENT ON COLUMN "dealership"."localizacao"."cidade" IS 'Nome da cidade.';

COMMENT ON COLUMN "dealership"."localizacao"."estado" IS 'Nome do estado da federação do Brasil.';

COMMENT ON COLUMN "dealership"."localizacao"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."localizacao"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."dominio"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "grupo_dominio" VARCHAR(255) NOT NULL,
    "nome_dominio" VARCHAR(255) NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

ALTER TABLE
    "dealership"."dominio"
ADD
    CONSTRAINT "dealership_dominio_grupo_dominio_nome_dominio_unique" UNIQUE("grupo_dominio", "nome_dominio");

COMMENT ON TABLE "dealership"."dominio" IS 'Cadastro de domínios.';

ALTER TABLE
    "dealership"."dominio"
ADD
    PRIMARY KEY("id");

COMMENT ON COLUMN "dealership"."dominio"."id" IS 'Chave primária (PK) de identificação do domínio.';

COMMENT ON COLUMN "dealership"."dominio"."grupo_dominio" IS 'Grupo de domínio.';

COMMENT ON COLUMN "dealership"."dominio"."nome_dominio" IS 'Nome do grupo de domínio.';

COMMENT ON COLUMN "dealership"."dominio"."criado_em" IS 'Data e hora de criação do registro na tabela.';

CREATE TABLE "dealership"."veiculo"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "placa" VARCHAR(10) NOT NULL,
    "renavam" VARCHAR(11) NOT NULL,
    "marca_veiculo_id" UUID NOT NULL,
    "modelo_veiculo_id" UUID NOT NULL,
    "combustivel_veiculo_id" UUID NOT NULL,
    "numero_chassi" VARCHAR(20) NOT NULL,
    "ano_modelo" INTEGER NOT NULL,
    "ano_fabricacao" INTEGER NOT NULL,
    "cor_veiculo" VARCHAR(20) NOT NULL,
    "quilometragem" INTEGER NOT NULL,
    "cambio_veiculo_id" UUID NOT NULL,
    "preco_venda_veiculo" DECIMAL(12, 2) NOT NULL,
    "descricao" VARCHAR(1000) NOT NULL,
    "situacao_veiculo_id" UUID NOT NULL,
    "data_venda" DATE NULL,
    "data_entrega" DATE NULL,
    "vendido_por" UUID NOT NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_empresa_id_placa_unique" UNIQUE("empresa_id", "placa");

CREATE INDEX "dealership_veiculo_empresa_id_index" ON "dealership"."veiculo"("empresa_id");

CREATE INDEX "dealership_veiculo_marca_veiculo_id_index" ON "dealership"."veiculo"("marca_veiculo_id");

CREATE INDEX "dealership_veiculo_modelo_veiculo_id_index" ON "dealership"."veiculo"("modelo_veiculo_id");

CREATE INDEX "dealership_veiculo_combustivel_veiculo_id_index" ON "dealership"."veiculo"("combustivel_veiculo_id");

CREATE INDEX "dealership_veiculo_cambio_veiculo_id_index" ON "dealership"."veiculo"("cambio_veiculo_id");

CREATE INDEX "dealership_veiculo_situacao_veiculo_id_index" ON "dealership"."veiculo"("situacao_veiculo_id");

COMMENT ON TABLE "dealership"."veiculo" IS 'Cadasto do veículo.';

ALTER TABLE
    "dealership"."veiculo"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_numero_chassi_unique" UNIQUE("numero_chassi");

COMMENT ON COLUMN "dealership"."veiculo"."id" IS 'Chave primária (PK) de identificação do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."empresa_id" IS 'Chave estrangeira (FK) de identificação da empresa.';

COMMENT ON COLUMN "dealership"."veiculo"."placa" IS 'Número da placa do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."renavam" IS 'Código do RENAVAM.';

COMMENT ON COLUMN "dealership"."veiculo"."marca_veiculo_id" IS 'Chave estrangeira de identificação da marca do veículo (FK).';

COMMENT ON COLUMN "dealership"."veiculo"."modelo_veiculo_id" IS 'Chave estrangeira de identificação do modelo do veículo (FK).';

COMMENT ON COLUMN "dealership"."veiculo"."combustivel_veiculo_id" IS 'Chave estrangeira de identificação do tipo de combustível do veículo (FK).';

COMMENT ON COLUMN "dealership"."veiculo"."numero_chassi" IS 'Número do chassi do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."ano_modelo" IS 'Ano modelo do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."ano_fabricacao" IS 'Ano fabricação do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."cor_veiculo" IS 'Nome da cor do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."quilometragem" IS 'Quilometragem do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."cambio_veiculo_id" IS 'Chave estrangeira de identificação do câmbio do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."preco_venda_veiculo" IS 'Preço de venda do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."descricao" IS 'Observações sobre o veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."situacao_veiculo_id" IS 'Chave estrangeira da identificação da situação do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."data_venda" IS 'Data da venda do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."data_entrega" IS 'Data da entrega do veículo.';

COMMENT ON COLUMN "dealership"."veiculo"."vendido_por" IS 'Chave estrangeira (FK) de identificação do usuário que efetuou a venda.';

COMMENT ON COLUMN "dealership"."veiculo"."criado_por" IS 'Chave estrangeira (FK) de identificação do usuário que criou o registro.';

COMMENT ON COLUMN "dealership"."veiculo"."atualizado_por" IS 'Chave estrangeira (FK) de identificação do usuário que alterou o registo.';

COMMENT ON COLUMN "dealership"."veiculo"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."veiculo"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."veiculo_foto"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "veiculo_id" UUID NOT NULL,
    "url_foto" TEXT NOT NULL,
    "caminho_storage" TEXT NOT NULL,
    "tamanho_arquivo" INTEGER NOT NULL,
    "foto_principal" BOOLEAN NOT NULL DEFAULT FALSE,
    "ordem_exibicao" BIGINT NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_veiculo_foto_veiculo_id_index" ON "dealership"."veiculo_foto"("veiculo_id");

COMMENT ON TABLE "dealership"."veiculo_foto" IS 'Cadastro da foto dos veículos.';

ALTER TABLE
    "dealership"."veiculo_foto"
ADD
    PRIMARY KEY("id");

COMMENT ON COLUMN "dealership"."veiculo_foto"."id" IS 'Chave primária (PK) de identificação da foto do veículo.';

COMMENT ON COLUMN "dealership"."veiculo_foto"."veiculo_id" IS 'Chave estrangeira de identificação do veículo (FK).';

COMMENT ON COLUMN "dealership"."veiculo_foto"."url_foto" IS 'Endereço único da foto.';

COMMENT ON COLUMN "dealership"."veiculo_foto"."caminho_storage" IS 'Caminho do storage da foto';

COMMENT ON COLUMN "dealership"."veiculo_foto"."tamanho_arquivo" IS 'Tamanho do arquivo em bytes.';

COMMENT ON COLUMN "dealership"."veiculo_foto"."foto_principal" IS 'Indica se a foto é a principal para a capa.';

COMMENT ON COLUMN "dealership"."veiculo_foto"."ordem_exibicao" IS 'Ordem de exibição da foto.';

COMMENT ON COLUMN "dealership"."veiculo_foto"."criado_em" IS 'Data e hora da crição do registro na tabela.';

CREATE TABLE "dealership"."qr_code"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "veiculo_id" UUID NOT NULL,
    "url_publica" VARCHAR(255) NOT NULL,
    "token_publica" VARCHAR(255) NOT NULL,
    "total_visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_qr_code_veiculo_id_index" ON "dealership"."qr_code"("veiculo_id");

COMMENT ON TABLE "dealership"."qr_code" IS 'Cadastro do Qr_code';

ALTER TABLE
    "dealership"."qr_code"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."qr_code"
ADD
    CONSTRAINT "dealership_qr_code_token_publica_unique" UNIQUE("token_publica");

COMMENT ON COLUMN "dealership"."qr_code"."id" IS 'Chave primária (PK) de identificação do QR code.';

COMMENT ON COLUMN "dealership"."qr_code"."veiculo_id" IS 'Chave estrangeira (FK) de identificação do veículo.';

COMMENT ON COLUMN "dealership"."qr_code"."url_publica" IS 'Url publica.';

COMMENT ON COLUMN "dealership"."qr_code"."token_publica" IS 'Endereço único e específico do QRcode.';

COMMENT ON COLUMN "dealership"."qr_code"."total_visualizacoes" IS 'Quantidade total de vizualizações do QR Code.';

COMMENT ON COLUMN "dealership"."qr_code"."criado_em" IS 'Data e hora de criação do registro na tabela.';

CREATE TABLE "dealership"."plano"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome_plano" VARCHAR(100) NOT NULL,
    "descricao_plano" VARCHAR(500) NULL,
    "preco_mensal" DECIMAL(10, 2) NOT NULL,
    "preco_anual" DECIMAL(10, 2) NULL,
    "limite_veiculos" INTEGER NOT NULL,
    "limite_usuarios" INTEGER NOT NULL,
    "limite_fotos_veiculo" INTEGER NOT NULL,
    "tem_qr_code" BOOLEAN NOT NULL DEFAULT TRUE,
    "tem_relatorios" BOOLEAN NOT NULL DEFAULT FALSE,
    "tem_suporte_prioritario" BOOLEAN NOT NULL DEFAULT FALSE,
    "plano_ativo" BOOLEAN NOT NULL DEFAULT TRUE,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE "dealership"."plano" IS 'Catálogo de planos de assinatura disponíveis na plataforma.';

ALTER TABLE
    "dealership"."plano"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."plano"
ADD
    CONSTRAINT "dealership_plano_nome_plano_unique" UNIQUE("nome_plano");

COMMENT ON COLUMN "dealership"."plano"."id" IS 'Chave primária (PK) de identificação do plano.';

COMMENT ON COLUMN "dealership"."plano"."nome_plano" IS 'Nome comercial do plano (ex: Starter, Pro, Enterprise).';

COMMENT ON COLUMN "dealership"."plano"."descricao_plano" IS 'Descrição resumida das funcionalidades e benefícios do plano.';

COMMENT ON COLUMN "dealership"."plano"."preco_mensal" IS 'Valor de cobrança mensal do plano em reais (BRL).';

COMMENT ON COLUMN "dealership"."plano"."preco_anual" IS 'Valor de cobrança anual do plano em reais (BRL). NULL indica que o plano não oferece ciclo anual.';

COMMENT ON COLUMN "dealership"."plano"."limite_veiculos" IS 'Quantidade máxima de veículos cadastrados permitida no plano. Use -1 para ilimitado.';

COMMENT ON COLUMN "dealership"."plano"."limite_usuarios" IS 'Quantidade máxima de usuários por empresa permitida no plano. Use -1 para ilimitado.';

COMMENT ON COLUMN "dealership"."plano"."limite_fotos_veiculo" IS 'Quantidade máxima de fotos por veículo permitida no plano.';

COMMENT ON COLUMN "dealership"."plano"."tem_qr_code" IS 'Indica se o plano inclui geração e gestão de QR Codes para os veículos.';

COMMENT ON COLUMN "dealership"."plano"."tem_relatorios" IS 'Indica se o plano inclui acesso ao módulo de relatórios e analytics.';

COMMENT ON COLUMN "dealership"."plano"."tem_suporte_prioritario" IS 'Indica se o plano inclui suporte com atendimento prioritário.';

COMMENT ON COLUMN "dealership"."plano"."plano_ativo" IS 'Indica se o plano está disponível para novas contratações. FALSE oculta o plano mas preserva assinaturas existentes.';

COMMENT ON COLUMN "dealership"."plano"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."plano"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."assinatura"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "plano_id" UUID NOT NULL,
    "situacao_assinatura_id" UUID NOT NULL,
    "ciclo_cobranca_id" UUID NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE NULL,
    "data_cancelamento" DATE NULL,
    "motivo_cancelamento" VARCHAR(500) NULL,
    "trial_ativo" BOOLEAN NOT NULL DEFAULT FALSE,
    "data_fim_trial" DATE NULL,
    "gateway_cliente_id" VARCHAR(255) NULL,
    "gateway_assinatura_id" VARCHAR(255) NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_assinatura_empresa_id_index" ON "dealership"."assinatura"("empresa_id");

CREATE INDEX "dealership_assinatura_plano_id_index" ON "dealership"."assinatura"("plano_id");

CREATE INDEX "dealership_assinatura_situacao_assinatura_id_index" ON "dealership"."assinatura"("situacao_assinatura_id");

COMMENT ON TABLE "dealership"."assinatura" IS 'Registro da assinatura de um plano por uma empresa. Controla o ciclo de vida da contratação.';

ALTER TABLE
    "dealership"."assinatura"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."assinatura"
ADD
    CONSTRAINT "dealership_assinatura_empresa_id_unique" UNIQUE("empresa_id");

COMMENT ON COLUMN "dealership"."assinatura"."id" IS 'Chave primária (PK) de identificação da assinatura.';

COMMENT ON COLUMN "dealership"."assinatura"."empresa_id" IS 'Chave estrangeira (FK) da empresa que contratou o plano.';

COMMENT ON COLUMN "dealership"."assinatura"."plano_id" IS 'Chave estrangeira (FK) do plano contratado.';

COMMENT ON COLUMN "dealership"."assinatura"."situacao_assinatura_id" IS 'Chave estrangeira (FK) do domínio que representa a situação atual da assinatura (grupo: situacao_assinatura). Valores esperados: ativa, trial, inadimplente, cancelada, expirada.';

COMMENT ON COLUMN "dealership"."assinatura"."ciclo_cobranca_id" IS 'Chave estrangeira (FK) do domínio que representa o ciclo de cobrança (grupo: ciclo_cobranca). Valores esperados: mensal, anual.';

COMMENT ON COLUMN "dealership"."assinatura"."data_inicio" IS 'Data de início de vigência da assinatura.';

COMMENT ON COLUMN "dealership"."assinatura"."data_fim" IS 'Data de encerramento previsto ou efetivo da assinatura. NULL enquanto estiver ativa sem prazo definido.';

COMMENT ON COLUMN "dealership"."assinatura"."data_cancelamento" IS 'Data em que a assinatura foi cancelada, se aplicável.';

COMMENT ON COLUMN "dealership"."assinatura"."motivo_cancelamento" IS 'Descrição textual do motivo do cancelamento, preenchida pela empresa ou pelo sistema.';

COMMENT ON COLUMN "dealership"."assinatura"."trial_ativo" IS 'Indica se a assinatura está em período de avaliação gratuita (trial).';

COMMENT ON COLUMN "dealership"."assinatura"."data_fim_trial" IS 'Data de encerramento do período de trial. NULL quando trial_ativo = FALSE.';

COMMENT ON COLUMN "dealership"."assinatura"."gateway_cliente_id" IS 'Identificador do cliente no gateway de pagamento externo (ex: Stripe customer_id). Usado para reconciliação.';

COMMENT ON COLUMN "dealership"."assinatura"."gateway_assinatura_id" IS 'Identificador da assinatura no gateway de pagamento externo (ex: Stripe subscription_id). Usado para reconciliação.';

COMMENT ON COLUMN "dealership"."assinatura"."criado_em" IS 'Data e hora de criação do registro.';

COMMENT ON COLUMN "dealership"."assinatura"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."fatura"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assinatura_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "numero_fatura" VARCHAR(50) NOT NULL,
    "situacao_fatura_id" UUID NOT NULL,
    "valor_bruto" DECIMAL(10, 2) NOT NULL,
    "valor_desconto" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "valor_liquido" DECIMAL(10, 2) NOT NULL,
    "data_competencia" DATE NOT NULL,
    "data_vencimento" DATE NOT NULL,
    "data_pagamento" DATE NULL,
    "metodo_pagamento_id" UUID NOT NULL,
    "gateway_fatura_id" VARCHAR(255) NULL,
    "gateway_url_boleto" VARCHAR(255) NULL,
    "gateway_url_pix" VARCHAR(255) NULL,
    "tentativas_cobranca" BIGINT NOT NULL DEFAULT 0,
    "proxima_tentativa_em" TIMESTAMP(0) WITH TIME zone NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_fatura_assinatura_id_index" ON "dealership"."fatura"("assinatura_id");

CREATE INDEX "dealership_fatura_empresa_id_index" ON "dealership"."fatura"("empresa_id");

CREATE INDEX "dealership_fatura_situacao_fatura_id_index" ON "dealership"."fatura"("situacao_fatura_id");

CREATE INDEX "dealership_fatura_metodo_pagamento_id_index" ON "dealership"."fatura"("metodo_pagamento_id");

COMMENT ON TABLE "dealership"."fatura" IS 'Registro de cada cobrança gerada para uma assinatura. Controla o ciclo financeiro de cada ciclo de pagamento.';

ALTER TABLE
    "dealership"."fatura"
ADD
    PRIMARY KEY("id");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_numero_fatura_unique" UNIQUE("numero_fatura");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_gateway_fatura_id_unique" UNIQUE("gateway_fatura_id");

COMMENT ON COLUMN "dealership"."fatura"."id" IS 'Chave primária (PK) de identificação da fatura.';

COMMENT ON COLUMN "dealership"."fatura"."assinatura_id" IS 'Chave estrangeira (FK) da assinatura à qual esta fatura pertence.';

COMMENT ON COLUMN "dealership"."fatura"."empresa_id" IS 'Chave estrangeira (FK) da empresa devedora. Redundante com assinatura_id para facilitar queries diretas por empresa.';

COMMENT ON COLUMN "dealership"."fatura"."numero_fatura" IS 'Número sequencial legível da fatura (ex: FAT-2025-00001). Gerado pela aplicação.';

COMMENT ON COLUMN "dealership"."fatura"."situacao_fatura_id" IS 'Chave estrangeira (FK) do domínio que representa a situação da fatura (grupo: situacao_fatura). Valores esperados: pendente, paga, atrasada, cancelada, estornada.';

COMMENT ON COLUMN "dealership"."fatura"."valor_bruto" IS 'Valor original da fatura antes de descontos, em reais (BRL).';

COMMENT ON COLUMN "dealership"."fatura"."valor_desconto" IS 'Valor total de descontos aplicados (cupons, promoções), em reais (BRL).';

COMMENT ON COLUMN "dealership"."fatura"."valor_liquido" IS 'Valor final a ser cobrado após descontos (valor_bruto - valor_desconto), em reais (BRL).';

COMMENT ON COLUMN "dealership"."fatura"."data_competencia" IS 'Data de referência do período de serviço cobrado nesta fatura.';

COMMENT ON COLUMN "dealership"."fatura"."data_vencimento" IS 'Data limite para pagamento sem mora ou multa.';

COMMENT ON COLUMN "dealership"."fatura"."data_pagamento" IS 'Data em que o pagamento foi confirmado. NULL enquanto a fatura estiver pendente.';

COMMENT ON COLUMN "dealership"."fatura"."metodo_pagamento_id" IS 'Chave estrangeira (FK) do domínio que representa o método de pagamento utilizado (grupo: metodo_pagamento). Valores esperados: cartao_credito, boleto, pix. NULL enquanto não houver pagamento.';

COMMENT ON COLUMN "dealership"."fatura"."gateway_fatura_id" IS 'Identificador da fatura/invoice no gateway de pagamento externo (ex: Stripe invoice_id).';

COMMENT ON COLUMN "dealership"."fatura"."gateway_url_boleto" IS 'URL do boleto bancário gerado pelo gateway de pagamento, se aplicável.';

COMMENT ON COLUMN "dealership"."fatura"."gateway_url_pix" IS 'URL ou payload do QR Code Pix gerado pelo gateway de pagamento, se aplicável.';

COMMENT ON COLUMN "dealership"."fatura"."tentativas_cobranca" IS 'Contador de tentativas de cobrança automática realizadas pelo gateway.';

COMMENT ON COLUMN "dealership"."fatura"."proxima_tentativa_em" IS 'Data e hora agendada para a próxima tentativa de cobrança automática. NULL quando não há tentativa pendente.';

COMMENT ON COLUMN "dealership"."fatura"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."fatura"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."veiculo_custo"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "empresa_id" UUID NOT NULL,
    "nome_custo" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(500) NULL,
    "criado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_veiculo_custo_empresa_id_index" ON "dealership"."veiculo_custo"("empresa_id");

COMMENT ON TABLE "dealership"."veiculo_custo" IS 'Catálogo de tipos de custo/serviço de manutenção, scoped por empresa.';

ALTER TABLE
    "dealership"."veiculo_custo"
ADD
    PRIMARY KEY("id");

COMMENT ON COLUMN "dealership"."veiculo_custo"."id" IS 'Chave primária (PK) de identificação do custo.';

COMMENT ON COLUMN "dealership"."veiculo_custo"."empresa_id" IS 'Chave estrangeira (FK) de identificação da empresa.';

COMMENT ON COLUMN "dealership"."veiculo_custo"."nome_custo" IS 'Nome do tipo de custo (ex: Troca de pneu, Pintura).';

COMMENT ON COLUMN "dealership"."veiculo_custo"."descricao" IS 'Descrição detalhada do serviço.';

COMMENT ON COLUMN "dealership"."veiculo_custo"."criado_por" IS 'Chave estrangeira (FK) do usuário que criou o registro.';

COMMENT ON COLUMN "dealership"."veiculo_custo"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."veiculo_custo"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

CREATE TABLE "dealership"."veiculo_manutencao"(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "veiculo_id" UUID NOT NULL,
    "custo_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "valor_manutencao" DECIMAL(10, 2) NOT NULL,
    "obs_manutencao" VARCHAR(500) NULL,
    "situacao_manutencao_id" UUID NOT NULL,
    "data_conclusao" DATE NOT NULL,
    "criado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
    "atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);

CREATE INDEX "dealership_veiculo_manutencao_veiculo_id_index" ON "dealership"."veiculo_manutencao"("veiculo_id");

CREATE INDEX "dealership_veiculo_manutencao_custo_id_index" ON "dealership"."veiculo_manutencao"("custo_id");

CREATE INDEX "dealership_veiculo_manutencao_empresa_id_index" ON "dealership"."veiculo_manutencao"("empresa_id");

CREATE INDEX "dealership_veiculo_manutencao_situacao_manutencao_id_index" ON "dealership"."veiculo_manutencao"("situacao_manutencao_id");

COMMENT ON TABLE "dealership"."veiculo_manutencao" IS 'Itens de manutenção realizados no veículo.';

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    PRIMARY KEY("id");

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."id" IS 'Chave primária (PK) de identificação da manutenção.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."veiculo_id" IS 'Chave estrangeira (FK) de identificação do veículo.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."custo_id" IS 'Chave estrangeira (FK) para o catálogo de custos (veiculo_custo).';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."empresa_id" IS 'Chave estrangeira (FK) de identificação da empresa.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."valor_manutencao" IS 'Valor real cobrado por este serviço neste veículo.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."obs_manutencao" IS 'Observações adicionais sobre a manutenção realizada.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."situacao_manutencao_id" IS 'Chave estrangeira (FK) para dominio — grupo status_manutencao.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."data_conclusao" IS 'Data em que a manutenção foi concluída.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."criado_por" IS 'Chave estrangeira (FK) do usuário que criou o registro.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."criado_em" IS 'Data e hora de criação do registro na tabela.';

COMMENT ON COLUMN "dealership"."veiculo_manutencao"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_situacao_veiculo_id_foreign" FOREIGN KEY("situacao_veiculo_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_cambio_veiculo_id_foreign" FOREIGN KEY("cambio_veiculo_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    CONSTRAINT "dealership_veiculo_manutencao_veiculo_id_foreign" FOREIGN KEY("veiculo_id") REFERENCES "dealership"."veiculo"("id");

ALTER TABLE
    "dealership"."veiculo_custo"
ADD
    CONSTRAINT "dealership_veiculo_custo_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."usuario"
ADD
    CONSTRAINT "dealership_usuario_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."veiculo_foto"
ADD
    CONSTRAINT "dealership_veiculo_foto_veiculo_id_foreign" FOREIGN KEY("veiculo_id") REFERENCES "dealership"."veiculo"("id");

ALTER TABLE
    "dealership"."veiculo_custo"
ADD
    CONSTRAINT "dealership_veiculo_custo_criado_por_foreign" FOREIGN KEY("criado_por") REFERENCES "dealership"."usuario"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_combustivel_veiculo_id_foreign" FOREIGN KEY("combustivel_veiculo_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."assinatura"
ADD
    CONSTRAINT "dealership_assinatura_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."assinatura"
ADD
    CONSTRAINT "dealership_assinatura_situacao_assinatura_id_foreign" FOREIGN KEY("situacao_assinatura_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    CONSTRAINT "dealership_veiculo_manutencao_situacao_manutencao_id_foreign" FOREIGN KEY("situacao_manutencao_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."empresa"
ADD
    CONSTRAINT "dealership_empresa_localizacao_id_foreign" FOREIGN KEY("localizacao_id") REFERENCES "dealership"."localizacao"("id");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_situacao_fatura_id_foreign" FOREIGN KEY("situacao_fatura_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    CONSTRAINT "dealership_veiculo_manutencao_criado_por_foreign" FOREIGN KEY("criado_por") REFERENCES "dealership"."usuario"("id");

ALTER TABLE
    "dealership"."qr_code"
ADD
    CONSTRAINT "dealership_qr_code_veiculo_id_foreign" FOREIGN KEY("veiculo_id") REFERENCES "dealership"."veiculo"("id");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_assinatura_id_foreign" FOREIGN KEY("assinatura_id") REFERENCES "dealership"."assinatura"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_atualizado_por_foreign" FOREIGN KEY("atualizado_por") REFERENCES "dealership"."usuario"("id");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_modelo_veiculo_id_foreign" FOREIGN KEY("modelo_veiculo_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_marca_veiculo_id_foreign" FOREIGN KEY("marca_veiculo_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."fatura"
ADD
    CONSTRAINT "dealership_fatura_metodo_pagamento_id_foreign" FOREIGN KEY("metodo_pagamento_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."usuario"
ADD
    CONSTRAINT "dealership_usuario_papel_usuario_id_foreign" FOREIGN KEY("papel_usuario_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    CONSTRAINT "dealership_veiculo_manutencao_custo_id_foreign" FOREIGN KEY("custo_id") REFERENCES "dealership"."veiculo_custo"("id");

ALTER TABLE
    "dealership"."assinatura"
ADD
    CONSTRAINT "dealership_assinatura_ciclo_cobranca_id_foreign" FOREIGN KEY("ciclo_cobranca_id") REFERENCES "dealership"."dominio"("id");

ALTER TABLE
    "dealership"."veiculo_manutencao"
ADD
    CONSTRAINT "dealership_veiculo_manutencao_empresa_id_foreign" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");

ALTER TABLE
    "dealership"."veiculo"
ADD
    CONSTRAINT "dealership_veiculo_criado_por_foreign" FOREIGN KEY("criado_por") REFERENCES "dealership"."usuario"("id");

ALTER TABLE
    "dealership"."empresa"
ADD
    CONSTRAINT "dealership_empresa_representante_id_foreign" FOREIGN KEY("representante_id") REFERENCES "dealership"."usuario"("id");

ALTER TABLE
    "dealership"."assinatura"
ADD
    CONSTRAINT "dealership_assinatura_plano_id_foreign" FOREIGN KEY("plano_id") REFERENCES "dealership"."plano"("id");