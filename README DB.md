# 📘 Padrão Oficial de Banco de Dados

## SaaS Automotivo -- Arquitetura Supabase (PostgreSQL)

------------------------------------------------------------------------

## 📌 Objetivo

Este documento define o padrão oficial de nomenclatura, modelagem e
segurança do banco de dados do SaaS Automotivo.

Objetivos:

-   Consistência
-   Escalabilidade
-   Segurança multi-tenant
-   Compatibilidade com ORM
-   Facilidade de manutenção

------------------------------------------------------------------------

# 1️⃣ Princípios Gerais

-   Utilizar `snake_case`
-   Utilizar apenas letras minúsculas
-   Não utilizar acentos
-   Não utilizar abreviações
-   Não utilizar prefixos como `tb_`, `tbl_`
-   Utilizar nomes descritivos
-   Utilizar tabelas no singular
-   Todas as tabelas devem possuir `criado_em`
-   Sistema multi-tenant obrigatório

------------------------------------------------------------------------

# 2️⃣ Padrão de Chave Primária

Todas as tabelas devem utilizar UUID como chave primária:

``` sql
id uuid primary key default gen_random_uuid()
```

Motivos:

-   Melhor escalabilidade
-   Mais seguro para APIs públicas
-   Evita conflitos entre ambientes
-   Ideal para arquitetura SaaS

------------------------------------------------------------------------

# 3️⃣ Modelo Multi-Tenant

Todas as tabelas de negócio devem possuir:

``` sql
empresa_id uuid not null references empresa(id)
```

Regras:

-   Nenhuma tabela transacional pode existir sem `empresa_id`
-   Toda consulta deve filtrar por `empresa_id`
-   RLS (Row Level Security) é obrigatório

------------------------------------------------------------------------

# 4️⃣ Estrutura Principal do Sistema

Tabelas principais:

-   empresa
-   usuario
-   cliente
-   veiculo
-   venda
-   pagamento
-   comissao
-   log_operacao

------------------------------------------------------------------------

# 5️⃣ Padrão de Colunas

## 🔹 Chave Primária

-   `id`

## 🔹 Chave Estrangeira

Formato obrigatório:

    <tabela>_id

Exemplos:

-   empresa_id
-   cliente_id
-   veiculo_id
-   usuario_id
-   venda_id

------------------------------------------------------------------------

## 🔹 Datas Padrão

Todas as tabelas devem conter:

``` sql
criado_em timestamp with time zone default now()
atualizado_em timestamp with time zone
```

Se houver soft delete:

``` sql
excluido_em timestamp with time zone
```

------------------------------------------------------------------------

## 🔹 Booleanos

Utilizar nomes claros e descritivos:

-   ativo
-   eh_principal
-   possui_garantia

Evitar:

-   flg_ativo
-   ind_ativo

------------------------------------------------------------------------

# 6️⃣ Exemplo de Modelagem

## 🏢 empresa

``` sql
create table empresa (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    cnpj text,
    plano text,
    ativo boolean default true,
    criado_em timestamptz default now()
);
```

------------------------------------------------------------------------

## 👤 usuario

``` sql
create table usuario (
    id uuid primary key references auth.users(id),
    empresa_id uuid not null references empresa(id),
    nome text not null,
    perfil text not null,
    criado_em timestamptz default now()
);
```

------------------------------------------------------------------------

## 🚗 veiculo

``` sql
create table veiculo (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references empresa(id),
    placa text not null,
    chassi text,
    marca text not null,
    modelo text not null,
    ano_fabricacao integer,
    ano_modelo integer,
    quilometragem integer,
    valor_compra numeric(12,2),
    valor_venda numeric(12,2),
    status text not null,
    criado_em timestamptz default now(),
    atualizado_em timestamptz,
    constraint uk_veiculo_placa unique (empresa_id, placa)
);
```

------------------------------------------------------------------------

## 🤝 cliente

``` sql
create table cliente (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references empresa(id),
    nome text not null,
    cpf text,
    telefone text,
    email text,
    ativo boolean default true,
    criado_em timestamptz default now()
);
```

------------------------------------------------------------------------

## 💰 venda

``` sql
create table venda (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references empresa(id),
    cliente_id uuid not null references cliente(id),
    veiculo_id uuid not null references veiculo(id),
    usuario_id uuid not null references usuario(id),
    valor_total numeric(12,2) not null,
    valor_entrada numeric(12,2),
    valor_financiado numeric(12,2),
    data_venda date not null,
    status text not null,
    criado_em timestamptz default now()
);
```

------------------------------------------------------------------------

# 7️⃣ Row Level Security (Obrigatório)

Habilitar RLS em todas as tabelas:

``` sql
alter table cliente enable row level security;
```

Policy padrão:

``` sql
create policy empresa_isolada
on cliente
for all
using (
    empresa_id = (
        select empresa_id
        from usuario
        where id = auth.uid()
    )
);
```

Objetivo:

-   Isolar dados entre empresas
-   Garantir segurança automática na API
-   Evitar vazamento de dados

------------------------------------------------------------------------

# 8️⃣ Índices Obrigatórios

Sempre criar índice em:

-   empresa_id
-   cliente_id
-   veiculo_id
-   data_venda
-   placa

Exemplo:

``` sql
create index idx_cliente_empresa_id on cliente(empresa_id);
```

------------------------------------------------------------------------

# 9️⃣ Convenção de Constraints

Padrão obrigatório:

-   pk\_`<tabela>`{=html}
-   fk\_`<tabela>`{=html}\_`<tabela_referenciada>`{=html}
-   uk\_`<tabela>`{=html}\_`<coluna>`{=html}
-   idx\_`<tabela>`{=html}\_`<coluna>`{=html}

Exemplos:

-   pk_cliente
-   fk_venda_cliente
-   uk_veiculo_placa
-   idx_venda_data_venda

------------------------------------------------------------------------

# 🔟 Regras que NÃO Devem Ser Violadas

-   Não usar plural
-   Não usar camelCase
-   Não usar abreviações
-   Não usar prefixo de tipo
-   Não usar acentos
-   Não criar tabela sem empresa_id
-   Não criar tabela sem criado_em

------------------------------------------------------------------------

# 🎯 Diretriz Arquitetural

Este sistema deve estar preparado para:

-   Centenas de empresas
-   Milhares de usuários
-   Crescimento horizontal
-   APIs públicas
-   Integração futura com BI

Decisões estruturais como UUID + RLS são obrigatórias desde o início.
