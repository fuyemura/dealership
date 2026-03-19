INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    -- Situação da assinatura
    ('situacao_assinatura', 'ativa'),
    ('situacao_assinatura', 'trial'),
    ('situacao_assinatura', 'inadimplente'),
    ('situacao_assinatura', 'cancelada'),
    ('situacao_assinatura', 'expirada'),
 
    -- Ciclo de cobrança
    ('ciclo_cobranca', 'mensal'),
    ('ciclo_cobranca', 'anual'),
 
    -- Situação da fatura
    ('situacao_fatura', 'pendente'),
    ('situacao_fatura', 'paga'),
    ('situacao_fatura', 'atrasada'),
    ('situacao_fatura', 'cancelada'),
    ('situacao_fatura', 'estornada'),
 
    -- Método de pagamento
    ('metodo_pagamento', 'cartao_credito'),
    ('metodo_pagamento', 'boleto'),
    ('metodo_pagamento', 'pix');

    -- Situação da manutenção
INSERT INTO dealership.dominio (grupo_dominio, nome_dominio) VALUES
    ('situacao_manutencao', 'pendente'),
    ('situacao_manutencao', 'em_andamento'),
    ('situacao_manutencao', 'concluida'),
    ('situacao_manutencao', 'cancelada');

