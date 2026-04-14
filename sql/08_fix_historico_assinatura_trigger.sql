-- =============================================================================
-- Fix: registrar_historico_assinatura — adiciona SECURITY DEFINER
--
-- Problema: a função do trigger executava como SECURITY INVOKER (padrão), ou
-- seja, rodava como o usuário `authenticated`. A tabela assinatura_historico
-- tem RLS habilitado com policy apenas de SELECT para `authenticated` — sem
-- policy de INSERT. Isso fazia o trigger falhar silenciosamente com violação de
-- RLS, causando rollback do UPDATE em assinatura e o erro
-- "Não foi possível trocar de plano. Tente novamente."
--
-- Fix: SECURITY DEFINER garante que o INSERT no histórico rode como o owner
-- do schema (postgres / service role), que tem acesso pleno e bypassa RLS.
-- SET search_path = dealership previne search_path injection.
-- =============================================================================

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
