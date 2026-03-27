-- =============================================================================
-- Migration: localizacao.codigo_ibge → cep
-- Renomeia a coluna e altera o tipo de INTEGER para VARCHAR(9).
-- Executar no Supabase SQL Editor (ou psql) com permissão de administrador.
-- =============================================================================

ALTER TABLE dealership.localizacao
    RENAME COLUMN codigo_ibge TO cep;

-- Converte os valores inteiros existentes para texto (ex: 3550308 → '3550308').
-- Após a migration, atualize os registros existentes com os CEPs corretos.
ALTER TABLE dealership.localizacao
    ALTER COLUMN cep TYPE VARCHAR(9) USING cep::text;

COMMENT ON COLUMN dealership.localizacao.cep IS 'CEP (Código de Endereçamento Postal).';
