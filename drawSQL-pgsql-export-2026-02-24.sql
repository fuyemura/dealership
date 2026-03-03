CREATE TABLE "dealership"."empresa"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"cnpj" VARCHAR(14) NOT NULL,
	"inscricao_municipal" BIGINT NOT NULL,
	"inscricao_estadual" BIGINT NOT NULL,
	"nome_legal_empresa" BIGINT NOT NULL,
	"nome_fantasia_empresa" VARCHAR(255) NULL,
	"localizacao_id" UUID NOT NULL,
	"telefone_principal" VARCHAR(20) NULL,
	"telefone_secundario" VARCHAR(20) NULL,
	"email_empresa" VARCHAR(255) NULL,
	"nome_representante" VARCHAR(255) NOT NULL,
	"cpf_representante" VARCHAR(11) NOT NULL,
	"cargo_representante" VARCHAR(255) NOT NULL,
	"telefone_representante" VARCHAR(20) NULL,
	"criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
	"atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);
COMMENT
ON TABLE
    "dealership"."empresa" IS 'Cadastro da empresa que usa a aplicação.';
ALTER TABLE
    "dealership"."empresa" ADD PRIMARY KEY("id");
ALTER TABLE
    "dealership"."empresa" ADD CONSTRAINT "uk_empresa_cnpj" UNIQUE("cnpj");
COMMENT
ON COLUMN
    "dealership"."empresa"."id" IS 'Chave primária de identificação da empresa (PK).';
COMMENT
ON COLUMN
    "dealership"."empresa"."cnpj" IS 'Código do cadastro nacional de pessoa jurídica';
COMMENT
ON COLUMN
    "dealership"."empresa"."inscricao_municipal" IS 'Número da inscrição municipal.';
COMMENT
ON COLUMN
    "dealership"."empresa"."inscricao_estadual" IS 'Número da inscrição estadual.';
COMMENT
ON COLUMN
    "dealership"."empresa"."nome_legal_empresa" IS 'Nome legal da empresa (Razão Social).';
COMMENT
ON COLUMN
    "dealership"."empresa"."nome_fantasia_empresa" IS 'Nome fantasia da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."telefone_principal" IS 'Número completo do telefone principal da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."telefone_secundario" IS 'Número completo do telefone secundário da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."email_empresa" IS 'Endereço eletrônico de correio da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."nome_representante" IS 'Nome do representante legal da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."cpf_representante" IS 'Código cadastro pessoa física (CPF) do representante legal da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."cargo_representante" IS 'Cargo do representante legal da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."telefone_representante" IS 'Telefone de contato do representante legal da empresa.';
COMMENT
ON COLUMN
    "dealership"."empresa"."criado_em" IS 'Data e hora de criação do registro na tabela.';
COMMENT
ON COLUMN
    "dealership"."empresa"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';


CREATE TABLE "dealership"."usuario"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"empresa_id" UUID NOT NULL,
	"auth_id" UUID NOT NULL,
	"email_usuario" VARCHAR(255) NOT NULL,
	"senha_usuario" VARCHAR(20) NOT NULL,
	"cpf" VARCHAR(11) NOT NULL,
	"nome_usuario" VARCHAR(255) NOT NULL,
	"papel_id" UUID NOT NULL,
	"ultimo_login_em" TIMESTAMP(0) WITH TIME zone NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
	"atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);
COMMENT
ON TABLE
    "dealership"."usuario" IS 'Cadastro de usuários da aplicação.';
ALTER TABLE
    "dealership"."usuario" ADD PRIMARY KEY("id");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "uk_usuario_empresa_id" UNIQUE("empresa_id");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "uk_usuario_auth_id" UNIQUE("auth_id");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "uk_usuario_email_usuario" UNIQUE("email_usuario");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "uk_usuario_cpf" UNIQUE("cpf");
COMMENT
ON COLUMN
    "dealership"."usuario"."id" IS 'Chave primária de identificação do usuário (PK).';
COMMENT
ON COLUMN
    "dealership"."usuario"."empresa_id" IS 'Código do cadastro nacional de pessoa jurídica.';
COMMENT
ON COLUMN
    "dealership"."usuario"."email_usuario" IS 'Descrição do endereço de correio eletrônico do usuário.';
COMMENT
ON COLUMN
    "dealership"."usuario"."senha_usuario" IS 'Descrição da senha criptografada do usuário.';
COMMENT
ON COLUMN
    "dealership"."usuario"."nome_usuario" IS 'Nome completo da pessoa.';
COMMENT
ON COLUMN
    "dealership"."usuario"."papel_id" IS 'Qual o papel do usuário. Podem ser administrador, gerente ou usuário.';
COMMENT
ON COLUMN
    "dealership"."usuario"."criado_em" IS 'Data e hora de criação do registro na tabela.';
COMMENT
ON COLUMN
    "dealership"."usuario"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';
	

CREATE TABLE "dealership"."localizacao"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"codigo_ibge" INTEGER NOT NULL,
	"logradouro" VARCHAR(100) NOT NULL,
	"numero_logradouro" INTEGER NOT NULL,
	"complemento_logradouro" VARCHAR(50) NOT NULL,
	"bairro" VARCHAR(50) NOT NULL,
	"cidade" VARCHAR(50) NOT NULL,
	"estado" VARCHAR(50) NOT NULL,
	"criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
	"atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);
COMMENT
ON TABLE
    "dealership"."localizacao" IS 'Cadastro de localizações.';
ALTER TABLE
    "dealership"."localizacao" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "dealership"."localizacao"."id" IS 'Chave primária de identificação da localização (PK).';
COMMENT
ON COLUMN
    "dealership"."localizacao"."codigo_ibge" IS 'Código de identificação do IBGE.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."logradouro" IS 'Descrição do logradouro.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."numero_logradouro" IS 'Número do logradouro.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."complemento_logradouro" IS 'Complemento do logradouro.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."bairro" IS 'Nome do bairro.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."cidade" IS 'Nome da cidade.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."estado" IS 'Nome do estado da federação do Brasil.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."criado_em" IS 'Data e hora de criação do registro na tabela.';
COMMENT
ON COLUMN
    "dealership"."localizacao"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';
	

CREATE TABLE "dealership"."dominio"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"grupo_dominio" VARCHAR(255) NOT NULL,
	"nome_dominio" VARCHAR(255) NOT NULL,
	"criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);
<<<<<<< HEAD
=======
COMMENT
ON TABLE
    "dealership"."dominio" IS 'Cadastro de domínios.';
>>>>>>> dce767c (Script de criação do modelo de dados)
ALTER TABLE
    "dealership"."dominio" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "dealership"."dominio"."id" IS 'Chave primária de identificação do domínio (PK).';
COMMENT
ON COLUMN
    "dealership"."dominio"."criado_em" IS 'Data e hora de criação do registro na tabela.';
	

CREATE TABLE "dealership"."veiculo"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"empresa_id" UUID NOT NULL,
	"placa" VARCHAR(10) NOT NULL,
	"renavam" BIGINT NOT NULL,
	"marca_veiculo_id" UUID NOT NULL,
	"modelo_veiculo_id" UUID NOT NULL,
	"combustivel_veiculo_id" UUID NOT NULL,
	"numero_chassi" VARCHAR(20) NOT NULL,
	"ano_modelo" INTEGER NOT NULL,
	"ano_fabricacao" INTEGER NOT NULL,
	"cor_veiculo" VARCHAR(20) NOT NULL,
	"quilometragem" INTEGER NOT NULL,
	"cambio_veiculo_id" UUID NOT NULL,
	"preco_veiculo" DECIMAL(12, 2) NOT NULL,
	"descricao" VARCHAR(1000) NOT NULL,
	"url_qrcode" TEXT NOT NULL,
	"situacao_veiculo_id" UUID NOT NULL,
	"url_publica" TEXT NOT NULL,
	"vendido_em" TIMESTAMP(0) WITH TIME zone NULL,
    "criado_por" UUID NOT NULL,
    "atualizado_por" UUID NOT NULL,
    "criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
	"atualizado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW(),
	"excluido_em" TIMESTAMP(0) WITH TIME zone NULL
);
COMMENT
ON TABLE
    "dealership"."veiculo" IS 'Cadasto do veículo.';
ALTER TABLE
    "dealership"."veiculo" ADD PRIMARY KEY("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "uk_veiculo_placa" UNIQUE("placa");
COMMENT
ON COLUMN
    "dealership"."veiculo"."id" IS 'Chave primária de identificação do veículo (PK).';
COMMENT
ON COLUMN
    "dealership"."veiculo"."empresa_id" IS 'Chave estrangeira de identificação da empresa (FK).';
COMMENT
ON COLUMN
    "dealership"."veiculo"."placa" IS 'Número da placa do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."renavam" IS 'Código do RENAVAM.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."marca_veiculo_id" IS 'Chave estrangeira de identificação da marca do veículo (FK).';
COMMENT
ON COLUMN
    "dealership"."veiculo"."modelo_veiculo_id" IS 'Chave estrangeira de identificação do modelo do veículo (FK).';
COMMENT
ON COLUMN
    "dealership"."veiculo"."combustivel_veiculo_id" IS 'Chave estrangeira de identificação do tipo de combustível do veículo (FK).';
COMMENT
ON COLUMN
    "dealership"."veiculo"."numero_chassi" IS 'Número do chassi do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."ano_modelo" IS 'Ano modelo do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."ano_fabricacao" IS 'Ano fabricação do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."cor_veiculo" IS 'Nome da cor do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."quilometragem" IS 'Quilometragem do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."cambio_veiculo_id" IS 'Chave estrangeira de identificação do câmbio do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."descricao" IS 'Observações sobre o veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."url_qrcode" IS 'Endereço único do QRcode.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."situacao_veiculo_id" IS 'Chave estrangeira da identificação da situação do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."url_publica" IS 'Endereço único e específico do QRcode amigável.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."vendido_em" IS 'Data e hora da venda do veículo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."criado_por" IS 'Chave estrangeira de identificação do usuário que criou o registro.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."atualizado_por" IS 'Chave estrangeira de identificação do usuário que alterou o registo.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."criado_em" IS 'Data e hora de criação do registro na tabela.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."atualizado_em" IS 'Data e hora de atualização do registro na tabela.';
COMMENT
ON COLUMN
    "dealership"."veiculo"."excluido_em" IS 'Data e hora de excluisão lógica do registro na tabela.';
	

CREATE TABLE "dealership"."veiculo_foto"
(
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"veiculo_id" UUID NOT NULL,
	"url_foto" TEXT NOT NULL,
	"caminho_storage" TEXT NOT NULL,
	"tamanho_arquivo" INTEGER NOT NULL,
	"foto_principal" BOOLEAN NOT NULL DEFAULT FALSE,
	"ordem_exibicao" BIGINT NOT NULL DEFAULT 0,
	"criado_em" TIMESTAMP(0) WITH TIME zone NOT NULL DEFAULT NOW()
);
COMMENT
ON TABLE
    "dealership"."veiculo_foto" IS 'Cadastro da foto dos veículos.';
ALTER TABLE
    "dealership"."veiculo_foto" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."id" IS 'Chave primária de identificação da foto do veículo (PK).';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."veiculo_id" IS 'Chave estrangeira de identificação do veículo (FK).';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."url_foto" IS 'Endereço único da foto.';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."caminho_storage" IS 'Caminho do storage da foto';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."tamanho_arquivo" IS 'Tamanho do arquivo em bytes.';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."foto_principal" IS 'Indica se a foto é a principal para a capa.';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."ordem_exibicao" IS 'Ordem de exibição da foto.';
COMMENT
ON COLUMN
    "dealership"."veiculo_foto"."criado_em" IS 'Data e hora da crição do registro na tabela.';
	

ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_situacao_veiculo_id_dominio" FOREIGN KEY("situacao_veiculo_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_empresa_id_empresa" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_cambio_veiculo_id_dominio" FOREIGN KEY("cambio_veiculo_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "fk_usuario_empresa_id_empresa" FOREIGN KEY("empresa_id") REFERENCES "dealership"."empresa"("id");
ALTER TABLE
    "dealership"."veiculo_foto" ADD CONSTRAINT "fk_veiculo_foto_veiculo_id_veiculo" FOREIGN KEY("veiculo_id") REFERENCES "dealership"."veiculo"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_combustivel_veiculo_id_dominio" FOREIGN KEY("combustivel_veiculo_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."empresa" ADD CONSTRAINT "fk_empresa_localizacao_id_localizacao" FOREIGN KEY("localizacao_id") REFERENCES "dealership"."localizacao"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_atualizado_por_usuario" FOREIGN KEY("atualizado_por") REFERENCES "dealership"."usuario"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_modelo_veiculo_id_dominio" FOREIGN KEY("modelo_veiculo_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_marca_veiculo_id_dominio" FOREIGN KEY("marca_veiculo_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."usuario" ADD CONSTRAINT "fk_usuario_papel_id_dominio" FOREIGN KEY("papel_id") REFERENCES "dealership"."dominio"("id");
ALTER TABLE
    "dealership"."veiculo" ADD CONSTRAINT "fk_veiculo_criado_por_usuario" FOREIGN KEY("criado_por") REFERENCES "dealership"."usuario"("id");