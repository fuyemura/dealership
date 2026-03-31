-- ---------------------------------------------------------------------------
-- HELPER: resolve empresa_id do usuário autenticado
-- Centraliza a subquery para todas as policies
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION dealership.get_empresa_id_do_usuario()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = dealership
AS $$
  SELECT empresa_id
  FROM dealership.usuario
  WHERE auth_id = auth.uid()
  LIMIT 1;
$$;

COMMENT ON FUNCTION dealership.get_empresa_id_do_usuario() IS
  'Retorna o empresa_id do usuário autenticado via auth.uid(). Usado nas policies de RLS.';


-- =============================================================================
-- [A] TABELAS GLOBAIS — leitura autenticada, escrita só via service role
-- =============================================================================

ALTER TABLE dealership.localizacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY localizacao_leitura_autenticada
ON dealership.localizacao FOR SELECT
USING (auth.role() = 'authenticated');

ALTER TABLE dealership.dominio ENABLE ROW LEVEL SECURITY;
CREATE POLICY dominio_leitura_autenticada
ON dealership.dominio FOR SELECT
USING (auth.role() = 'authenticated');

ALTER TABLE dealership.plano ENABLE ROW LEVEL SECURITY;
CREATE POLICY plano_leitura_autenticada
ON dealership.plano FOR SELECT
USING (auth.role() = 'authenticated' AND plano_ativo = TRUE);


-- =============================================================================
-- [B] EMPRESA — cada empresa vê/edita apenas seu próprio registro
-- =============================================================================

ALTER TABLE dealership.empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY empresa_isolada_select
ON dealership.empresa FOR SELECT
USING (id = dealership.get_empresa_id_do_usuario());

CREATE POLICY empresa_isolada_update
ON dealership.empresa FOR UPDATE
USING (id = dealership.get_empresa_id_do_usuario())
WITH CHECK (id = dealership.get_empresa_id_do_usuario());


-- =============================================================================
-- [C] TABELAS TENANTED — isoladas por empresa_id
-- =============================================================================

-- usuario
ALTER TABLE dealership.usuario ENABLE ROW LEVEL SECURITY;
CREATE POLICY usuario_empresa_isolada
ON dealership.usuario FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- cliente
ALTER TABLE dealership.cliente ENABLE ROW LEVEL SECURITY;
CREATE POLICY cliente_empresa_isolada
ON dealership.cliente FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- veiculo
ALTER TABLE dealership.veiculo ENABLE ROW LEVEL SECURITY;
CREATE POLICY veiculo_empresa_isolada
ON dealership.veiculo FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- veiculo_arquivo
ALTER TABLE dealership.veiculo_arquivo ENABLE ROW LEVEL SECURITY;
CREATE POLICY veiculo_arquivo_empresa_isolada
ON dealership.veiculo_arquivo FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- qr_code (sem empresa_id próprio — isolamento via veiculo)
ALTER TABLE dealership.qr_code ENABLE ROW LEVEL SECURITY;
CREATE POLICY qr_code_empresa_isolada
ON dealership.qr_code FOR ALL
USING (
  veiculo_id IN (
    SELECT id FROM dealership.veiculo
    WHERE empresa_id = dealership.get_empresa_id_do_usuario()
  )
)
WITH CHECK (
  veiculo_id IN (
    SELECT id FROM dealership.veiculo
    WHERE empresa_id = dealership.get_empresa_id_do_usuario()
  )
);

-- assinatura (INSERT/DELETE apenas via service role — operações de billing)
ALTER TABLE dealership.assinatura ENABLE ROW LEVEL SECURITY;
CREATE POLICY assinatura_empresa_isolada_select
ON dealership.assinatura FOR SELECT
USING (empresa_id = dealership.get_empresa_id_do_usuario());

CREATE POLICY assinatura_empresa_isolada_update
ON dealership.assinatura FOR UPDATE
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- fatura (somente leitura via client — escrita via service role)
ALTER TABLE dealership.fatura ENABLE ROW LEVEL SECURITY;
CREATE POLICY fatura_empresa_isolada_select
ON dealership.fatura FOR SELECT
USING (empresa_id = dealership.get_empresa_id_do_usuario());

-- veiculo_custo
ALTER TABLE dealership.veiculo_custo ENABLE ROW LEVEL SECURITY;
CREATE POLICY veiculo_custo_empresa_isolada
ON dealership.veiculo_custo FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());

-- veiculo_manutencao
ALTER TABLE dealership.veiculo_manutencao ENABLE ROW LEVEL SECURITY;
CREATE POLICY veiculo_manutencao_empresa_isolada
ON dealership.veiculo_manutencao FOR ALL
USING (empresa_id = dealership.get_empresa_id_do_usuario())
WITH CHECK (empresa_id = dealership.get_empresa_id_do_usuario());