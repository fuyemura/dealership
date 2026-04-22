-- =============================================================================
-- Trigger: set_atualizado_em
-- Mantém o campo atualizado_em atualizado automaticamente em qualquer UPDATE,
-- eliminando a dependência do código da aplicação para setar esse valor e
-- garantindo que atualizações feitas diretamente no banco (migrations, jobs,
-- seeds) também reflitam a timestamp correta.
--
-- Após aplicar esta migration, o campo atualizado_em: new Date().toISOString()
-- nas server actions se torna redundante (o trigger sobrescreve com NOW()),
-- mas pode ser mantido como fallback sem efeito colateral.
-- =============================================================================

-- ─── Função compartilhada entre todos os triggers ────────────────────────────

CREATE OR REPLACE FUNCTION dealership.set_atualizado_em()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION dealership.set_atualizado_em() IS
  'Trigger function: seta atualizado_em = NOW() em qualquer UPDATE.';

-- ─── veiculo ─────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_veiculo ON dealership.veiculo;
CREATE TRIGGER trg_set_atualizado_em_veiculo
BEFORE UPDATE ON dealership.veiculo
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── cliente ─────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_cliente ON dealership.cliente;
CREATE TRIGGER trg_set_atualizado_em_cliente
BEFORE UPDATE ON dealership.cliente
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── assinatura ──────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_assinatura ON dealership.assinatura;
CREATE TRIGGER trg_set_atualizado_em_assinatura
BEFORE UPDATE ON dealership.assinatura
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── usuario ─────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_usuario ON dealership.usuario;
CREATE TRIGGER trg_set_atualizado_em_usuario
BEFORE UPDATE ON dealership.usuario
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── empresa ─────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_empresa ON dealership.empresa;
CREATE TRIGGER trg_set_atualizado_em_empresa
BEFORE UPDATE ON dealership.empresa
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── veiculo_custo ───────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_veiculo_custo ON dealership.veiculo_custo;
CREATE TRIGGER trg_set_atualizado_em_veiculo_custo
BEFORE UPDATE ON dealership.veiculo_custo
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── veiculo_manutencao ───────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_veiculo_manutencao ON dealership.veiculo_manutencao;
CREATE TRIGGER trg_set_atualizado_em_veiculo_manutencao
BEFORE UPDATE ON dealership.veiculo_manutencao
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── despesa_categoria ───────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_despesa_categoria ON dealership.despesa_categoria;
CREATE TRIGGER trg_set_atualizado_em_despesa_categoria
BEFORE UPDATE ON dealership.despesa_categoria
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();

-- ─── empresa_despesa ─────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_set_atualizado_em_empresa_despesa ON dealership.empresa_despesa;
CREATE TRIGGER trg_set_atualizado_em_empresa_despesa
BEFORE UPDATE ON dealership.empresa_despesa
FOR EACH ROW
EXECUTE FUNCTION dealership.set_atualizado_em();


-- Função e trigger: grava o estado anterior de assinatura antes de cada UPDATE
-- SECURITY DEFINER: necessário porque assinatura_historico não possui policy de
-- INSERT para authenticated — o histórico é gravado exclusivamente pelo trigger,
-- jamais pelo app diretamente.
CREATE OR REPLACE FUNCTION dealership.registrar_historico_assinatura()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = dealership
AS $$
BEGIN
    INSERT INTO dealership.assinatura_historico (
        assinatura_id,
        empresa_id,
        plano_id,
        situacao_assinatura_id,
        ciclo_cobranca_id,
        data_inicio,
        data_fim,
        data_cancelamento,
        motivo_cancelamento,
        trial_ativo,
        data_fim_trial,
        gateway_cliente_id,
        gateway_assinatura_id,
        criado_em,
        atualizado_em
    ) VALUES (
        OLD.id,
        OLD.empresa_id,
        OLD.plano_id,
        OLD.situacao_assinatura_id,
        OLD.ciclo_cobranca_id,
        OLD.data_inicio,
        OLD.data_fim,
        OLD.data_cancelamento,
        OLD.motivo_cancelamento,
        OLD.trial_ativo,
        OLD.data_fim_trial,
        OLD.gateway_cliente_id,
        OLD.gateway_assinatura_id,
        OLD.criado_em,
        OLD.atualizado_em
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assinatura_historico
    BEFORE UPDATE ON dealership.assinatura
    FOR EACH ROW EXECUTE FUNCTION dealership.registrar_historico_assinatura();
