# UYEMURA TECH
## Plano de Negócios — SaaS Automotivo para Revendas de Veículos
**Versão 2.0 | Março 2026 | Confidencial**

---

## 0. Plano de 1 Página — Guia de Ação

> **Este é o resumo operacional do plano.** Consulte as seções completas apenas quando precisar de detalhes. No dia a dia, opere por aqui.

**O que vendemos:** SaaS que digitaliza revendas de veículos com QR Code — cliente escaneia, vê a ficha técnica no celular, sem app.

**Para quem:** Revendas pequenas/médias (5–150 veículos), sem sistema de gestão ou usando planilha.

**Quanto custa:** Essencial R\$ 97/mês | Profissional R\$ 197/mês | Premium R\$ 397/mês — trial de 30 dias com cartão.

**Quanto gastamos:** ~R$ 481/mês de infra fixa. Breakeven: 5 clientes no Essencial.

**As 3 métricas que importam agora:**

| Métrica | O que medir | Meta |
|---|---|---|
| **Trials ativos** | Quantas revendas estão testando o produto | ≥ 3/mês |
| **Conversão trial → pago** | Quantos trials viraram clientes pagantes | > 25% |
| **Cancelamentos** | Alguém cancelou? Por quê? | < 5%/mês |

**Os 5 passos para o primeiro cliente:**

1. Entregar o P0 (página pública + geração de QR Code)
2. Testar com 2 revendas conhecidas (sem cobrar)
3. Configurar Stripe + planos de assinatura
4. Fazer a primeira demo real com um prospect desconhecido
5. Converter o primeiro trial em cliente pagante

**Critério de parar:** Se após 3 meses de prospecção ativa (15+ abordagens/semana), menos de 3 revendas iniciaram trial → pivot ou encerrar. Perda máxima estimada: ~R$ 2.026.

---

## 1. Sumário Executivo

| | |
|---|---|
| **Empresa** | Uyemura Tech |
| **Produto** | SaaS Automotivo — gestão de estoque com QR Code por veículo |
| **Problema** | Informação dispersa → cliente mal atendido → venda perdida |
| **Solução** | Ficha técnica digital acessível via QR Code, sem app, mobile-first |
| **Mercado** | ~40.000 revendas pequenas e médias no Brasil |
| **Modelo** | Assinatura mensal: R$ 97 / R$ 197 / R$ 397 |
| **Fase atual** | MVP em desenvolvimento — P0 (página pública + QR Code) pendente. Funcionalidades de gestão prontas |
| **Meta 12 meses** | MRR > R$ 5.500 / 40+ clientes ativos |
| **Vantagem** | Simplicidade extrema + acesso sem app + multi-tenant com RLS |
| **Equipe fundadora** | 3 pessoas em regime part-time (˜20h/semana cada) — 1 comercial/operacional, 2 desenvolvimento/infraestrutura |

---

## 2. O Problema

### 2.1 Como as revendas operam hoje

A maioria das revendas pequenas e médias ainda opera de forma analógica ou semi-digital. O resultado é uma tríplice falha: informação dispersa, cliente mal atendido e vendedor sobrecarregado.

| Onde ficam as informações | Problema gerado |
|---|---|
| Planilhas Excel / Google Sheets | Desatualização constante, difícil acesso fora do escritório, sem padronização entre vendedores |
| Papéis colados no vidro | Ilegíveis com o tempo, caem com chuva ou vento, sem formatação, sem preço atualizado em tempo real |
| Na cabeça do vendedor | Informação se perde com troca de funcionário, inconsistências entre vendedores, risco de passar dado errado |

### 2.2 Impacto no cliente final

- Fica esperando atendimento enquanto o vendedor está ocupado com outro cliente
- Não tem acesso rápido à ficha técnica do veículo — especificações, histórico, preço
- Não consegue comparar dois ou mais carros sem ajuda presencial
- Experiência de compra abaixo das expectativas do mercado atual

### 2.3 Impacto no vendedor

- Perde tempo repetindo as mesmas informações para cada cliente que entra
- Não consegue atender múltiplos clientes ao mesmo tempo no pátio
- Informações desencontradas com outros vendedores da mesma loja
- Dificuldade para manter o estoque atualizado e com dados confiáveis

---

## 3. A Solução

### 3.1 O produto

O **SaaS Automotivo da Uyemura Tech** é uma plataforma web que permite à revenda digitalizar todo o processo de exposição e venda dos veículos em menos de 1 hora, sem treinamento técnico e sem instalação de nenhum aplicativo no celular do cliente.

| # | Funcionalidade | Benefício direto |
|---|---|---|
| 1 | Cadastro de veículos | Ficha técnica completa: modelo, ano, km, preço, opcionais, fotos, histórico de custos |
| 2 | Upload de laudo veicular (PDF) | Laudo de vistoria acessível via ficha do veículo — transparência e confiança para o comprador |
| 3 | QR Code exclusivo por veículo | Etiqueta impressa e colada no vidro — cliente escaneia sem app, sem login |
| 3 | Ficha pública mobile-first | Cliente acessa tudo no celular no pátio, às 21h, sem precisar de vendedor |
| 4 | Comparação de veículos | Cliente compara lado a lado, chega ao showroom com decisão mais madura |
| 5 | Gestão de custos por veículo | Vendedor conhece a margem real antes de entrar em negociação |
| 6 | Gestão de equipe com papéis | Vendedor não acessa dados financeiros; admin tem visão completa |

### 3.2 Diferenciais competitivos

| Diferencial | Por que importa |
|---|---|
| QR Code sem app | Zero atrito para o comprador — funciona no celular de qualquer pessoa |
| Sem wi-fi da loja | Funciona pelo 4G/dados móveis do celular do comprador — sem depender da rede da revenda |
| QR Code vivo | Preço ou status alterado → QR reflete na hora, sem reimprimir a etiqueta |
| Multi-tenant com RLS | Dados de cada revenda 100% isolados por arquitetura — LGPD-ready |
| Simplicidade extrema | Onboarding em menos de 1 hora, sem treinamento, sem implantação |

> **Posicionamento:** *"O sistema mais simples do mercado para digitalizar sua revenda em menos de 1 hora — sem treinamento, sem implantação, só escanear."*

---

## 4. Mercado-Alvo

### 4.1 Segmento primário

**Revendas de veículos pequenas e médias** caracterizadas por:

- 5 a 150 veículos em estoque
- 1 a 20 funcionários
- Sem sistema de gestão próprio ou com uso de planilhas
- Localizadas em cidades de médio e grande porte no Brasil
- Proprietário próximo à operação e tomada de decisão rápida

### 4.2 Estimativa de mercado (TAM / SAM / SOM)

| Nível | Descrição | Estimativa |
|---|---|---|
| **TAM** — Mercado Total | Todas as revendas de veículos no Brasil | ~150.000 estabelecimentos |
| **SAM** — Mercado Endereçável | Revendas pequenas e médias com acesso à internet e predisposição a SaaS | ~40.000 revendas |
| **SOM** — Mercado Alcançável | Revendas em SP, PR, SC, RS e RJ — esforço comercial direto nos primeiros 3 anos | ~800 revendas |

> *Fontes de referência para validação: FENABRAVE (Federação Nacional da Distribuição de Veículos Automotores), DETRAN-SP, IBGE (CNAE 4511-1 Comércio a varejo de automóveis). Números representam estimativa — validar com pesquisa primária antes de apresentar a investidores.*

### 4.3 Perfil do decisor

| Atributo | Detalhe |
|---|---|
| Cargo | Dono / Sócio / Gerente Comercial |
| Dor principal | Perder venda por indisponibilidade de informação sobre o veículo |
| Motivador de compra | Solução simples, acessível e que funciona no celular sem configuração |
| Objeção principal | "Já uso planilha, não preciso pagar por isso" |
| Resposta à objeção | "Sua planilha não funciona no celular do cliente às 21h no pátio" |

---

## 5. Modelo de Negócio

### 5.1 Precificação

| Plano | Preço/mês | Para quem | Limite de veículos | Usuários | Fotos/veículo |
|---|---|---|---|---|---|
| **Essencial** | R$ 97 | Revendas com até 30 veículos | 30 veículos | 1–3 | 5 |
| **Profissional** | R$ 197 | Revendas com até 100 veículos, relatórios | 100 veículos | 1–10 | 15 |
| **Premium** | R$ 397 | Redes multiunidade, suporte prioritário, customizações | Ilimitado | Ilimitado | 30 |

- Trial gratuito de 30 dias — **cartão de crédito obrigatório no cadastro**, sem cobrança durante o período de trial.
- **Meio de pagamento aceito na fase inicial: cartão de crédito, cobrança mensal.** Pix recorrente e plano anual serão avaliados em fases posteriores.

### 5.2 Receita Recorrente Mensal (MRR) projetada

| Mês | Clientes ativos | Ess. | Prof. | Prem. | MRR | Premissa de aquisição |
|---|---|---|---|---|---|---|
| 3 | 7 | 5 | 2 | 0 | ~R$ 880 | 2–3 novos/mês — demos presenciais (comercial part-time) |
| 6 | 16 | 11 | 4 | 1 | ~R$ 2.200 | 3–4 novos/mês — indicações + redes |
| 12 | 40 | 28 | 10 | 2 | ~R$ 5.500 | 5–6 novos/mês — outbound + conteúdo |
| 24 | 75 | 53 | 18 | 4 | ~R$ 10.100 | 7–9 novos/mês — SDR + parceiros |

**Premissas explícitas:**

- Novos clientes/mês: 2–3 (meses 1–3) → 3–4 (meses 4–6) → 5–6 (meses 7–12) → 7–9 (meses 13–24) — regime part-time do comercial (~20h/semana)
- Churn mensal: 5% — conservador para B2B PME no Brasil
- Taxa de conversão trial → pago: 25% (revisada de 40% para premissa mais realista)
- Ciclo médio de venda: 14 dias do primeiro contato ao pagamento
- Mix de planos: 70% Essencial / 24% Profissional / 6% Premium
- **Todos os 3 fundadores em regime part-time (~20h/semana)** — o responsável comercial dedica ~20h semanais a vendas; os 2 desenvolvedores focam o restante de suas horas no produto

> ⚠️ **Projeções dos meses 12 e 24 são ilustrativas.** Servem para dimensionar infra e custos, não como promessa de resultado. O plano será revisado a cada 3 meses com dados reais. As únicas projeções que importam agora são as do mês 3 e mês 6.

> ⚠️ **Cenário pessimista (mix 85/14/1%):** MRR mês 12 cai para ~R$5.600 (−24%). Monitorar o mix real mensalmente a partir do mês 3 e ajustar projeções se necessário.

> ⚠️ **Funil real tem 3 etapas:** (1) abordagem → aceita demo; (2) demo → inicia trial com cartão — colocar o cartão já é decisão de compra, tem atrito real; (3) trial → converte para pago. A meta de 25% aplica-se apenas à etapa 3. Monitorar etapas 1 e 2 separadamente desde o mês 1.

### 5.3 Métricas-chave

**Para os primeiros 6 meses, foque apenas nestas 3 métricas:**

| Métrica | O que acompanhar | Meta | Quando agir |
|---|---|---|---|
| **Trials ativos** | Quantas revendas estão testando | ≥ 3 novos/mês | Se < 2/mês por 2 meses seguidos → revisar abordagem comercial |
| **Conversão trial → pago** | % de trials que viram clientes | > 25% | Se < 15% → revisar onboarding e proposta de valor |
| **Cancelamentos** | Quem cancelou e por quê | < 5%/mês | Cada cancelamento no primeiro ano merece uma ligação para entender o motivo |

**Métricas avançadas (acompanhar a partir do mês 6, quando houver volume):**

| Métrica | Meta | Por que esperar |
|---|---|---|
| MRR | R$ 5.500+ (mês 12) | Acompanhar mensalmente, mas não otimizar antes de ter 15+ clientes |
| CAC real | < R$ 400 (custos diretos) | Só faz sentido calcular com precisão quando houver pipeline previsível |
| LTV/CAC | > 5x | Depende de churn estável — precisa de 6+ meses de dados |

> **Nota sobre CAC real:** com o comercial dedicando ~20h/semana, o CAC real (incluindo tempo) é ~R$1.200–1.600 nos primeiros meses. Isso é normal para early-stage. Registrar horas e pipeline desde o mês 1 para ter dados quando precisar.

---

## 6. Estratégia de Go-to-Market

### 6.1 Fase 1 — Validação (meses 1–3)

**Canal principal:** visita presencial + WhatsApp

**Onde prospectar:**
- Google Maps buscando "revenda de veículos" em raio de 20 km
- Instagram nas hashtags `#revendadecarros` e `#carrosnacionais` com DM direto
- Grupos de WhatsApp e Facebook de revendedores da região

**Cadência semanal do responsável comercial (part-time, ~20h/semana):**
- 15–20 abordagens/semana (mensagem + ligação de qualificação)
- 2–4 demonstrações presenciais/semana — demo no celular do próprio cliente, no pátio (~2,5h por demo incluindo deslocamento e follow-up)
- Meta: 1–2 trials ativos/semana → 25% conversão → ~5–7 clientes pagantes no mês 3

> Os dois desenvolvedores não participam do processo comercial na Fase 1 — foco total na entrega do P0 e P1 nas horas disponíveis.

**Script da demo — 3 minutos:**
1. Cadastrar um carro ao vivo no celular do cliente
2. Gerar e mostrar o QR Code gerado
3. Cliente escaneia e vê a ficha no próprio celular — no pátio, sem wi-fi
4. Fechar com trial de 30 dias grátis — cliente cadastra o cartão no ato, sem cobrança imediata

**Playbook de objeções — respostas prontas para as 4 mais comuns:**

| Objeção do cliente | Resposta sugerida |
|---|---|
| *"Vou pensar"* | "Entendo. O trial é de 30 dias sem cobrança — você testa sem risco. Posso te ajudar a cadastrar os 3 primeiros carros agora em 5 minutos?" |
| *"Não quero colocar cartão"* | "O cartão é só para garantir a continuidade se você gostar. Nos 30 dias não cobra nada, e cancelar é com 2 cliques no painel, sem ligar para ninguém." |
| *"Já uso OLX / Instagram"* | "Ótimo — continue usando. Isso aqui não substitui anúncio, complementa. O QR Code funciona para quem já está no seu pátio olhando o carro e quer mais informação agora." |
| *"É caro / não tenho orçamento"* | "São R$97/mês — menos que 1 tanque de gasolina. Se o sistema ajudar a vender 1 carro a mais por mês, já se pagou várias vezes." |

### 6.1.1 Cronograma das primeiras 8 semanas

| Semana | Responsável | Entrega |
|---|---|---|
| **1–2** | Devs | Entregar P0: página pública + geração de QR Code |
| **3** | Todos | Testar com 2 revendas conhecidas (sem cobrar). Coletar feedback |
| **4** | Devs + Comercial | Ajustar produto com feedback. Configurar Stripe + planos |
| **5–6** | Comercial | Iniciar prospecção real: 15–20 abordagens/semana, 2–4 demos |
| **7–8** | Comercial + Devs | Primeiros trials ativos. Meta: 2–3 trials com cartão cadastrado |

> **Marco de validação (semana 8):** se houver pelo menos 2 trials ativos com cartão, o modelo está funcionando. Se houver 0 trials após 20+ abordagens, parar e reavaliar (ver critério go/no-go na seção 11).

### 6.2 Fase 2 — Tração (meses 4–9)

- **Canal:** Instagram e TikTok com conteúdo educativo ("como digitalizar sua revenda em 1 hora")
- **Canal:** grupos de Facebook e WhatsApp de revendedores
- **Canal:** parceria com despachantes e vistoriadores — indicação mútua
- **Programa de indicação:** 1 mês grátis para quem indicar um cliente que converte
- **Meta:** 25–30 clientes ativos ao final da fase

### 6.3 Fase 3 — Escala (meses 10–24)

- **Canal:** Google Ads com busca por "sistema para revenda de carros" e "gestão de estoque veículos"
- **Canal:** SDR outbound para listas de revendas do DETRAN-SP / PR
- **Canal:** representantes regionais comissionados por cliente ativo
- Certificação de parceiros e programa de revenda da solução
- **Meta:** 70–80 clientes ativos ao final do mês 24

---

## 7. Posicionamento Competitivo

### 7.1 Concorrentes identificados

| Concorrente | Tipo | Fraqueza explorada |
|---|---|---|
| AutoManager / NG Informática / Revenda Mais | Sistema de gestão | Interface desktop, implantação cara, sem QR Code, contratos anuais longos |
| iCarros / OLX / Mobiauto | Portal de anúncios | Não é sistema de gestão — não digitaliza o pátio nem controla estoque interno |
| Planilha + papel no vidro | Solução caseira | Não funciona no celular do cliente, sem atualização em tempo real, sem histórico |
| WhatsApp + catálogo | Solução gratuita | Sem ficha padronizada, sem QR Code, sem gestão de estoque, sem controle de equipe |
| Linktree + QR Code gratuito | Solução gratuita | Sem integração com estoque, sem multi-tenant, sem atualização automática do QR |

### 7.2 Insight estratégico

O verdadeiro concorrente a vencer não é o sistema legado caro — é a **solução gratuita imperfeita** que o cliente já usa e considera "suficiente". A proposta de valor precisa tornar explícito o que o WhatsApp e o Linktree não resolvem: atualização em tempo real, histórico de custos, controle de equipe e ficha padronizada por veículo. Qualquer demo que não demonstrar esses pontos está perdendo a batalha errada.

---

## 8. Plano Operacional — Tecnologia

### 8.1 Stack atual (produção-ready)

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui |
| Backend / BaaS | Supabase (PostgreSQL + Auth + RLS) — schema dealership |
| Infraestrutura | Vercel (frontend) + Supabase Cloud (banco + auth) |
| Arquitetura | Multi-tenant com isolamento por `empresa_id` via Row Level Security (RLS) |

### 8.2 Funcionalidades já desenvolvidas

- [x] Autenticação completa (login, reset de senha, callback OAuth)
- [x] Gestão de empresa (cadastro, dados fiscais, localização)
- [x] Gestão de usuários e papéis (admin, gerente, usuário)
- [x] Cadastro e listagem de veículos
- [x] Cadastro e listagem de clientes
- [x] Gestão de custos por veículo
- [x] Consulta de placa via API externa
- [x] Página de assinatura

### 8.3 Roadmap com gatilhos por fase

| Prior. | Feature | Impacto | Gatilho para avançar |
|---|---|---|---|
| **P0** | Página pública da ficha técnica (QR → browser) | Core do produto — sem isso não há demo possível | Antes de qualquer ação comercial |
| **P0** | Geração e impressão do QR Code por veículo | Core do produto — completa o loop de valor | Antes de qualquer ação comercial |
| **P1** | Comparação de veículos lado a lado (mobile-first) | Diferencial de mercado — cliente decide sem vendedor | Após 10 clientes pagantes |
| **P1** | Integração com WhatsApp (envio de ficha por link) | Reduz fricção de atendimento e melhora retenção | Após 10 clientes pagantes |
| **P2** | Dashboard com métricas de escaneamento por veículo | Aumenta percepção de valor e reduz churn | Após 30 clientes ativos **+ atualizar Política de Privacidade e avisos LGPD na ficha pública** |
| **P2** | App PWA para adicionar na tela inicial | Melhora experiência do vendedor no pátio | Após 30 clientes ativos |
| **P3** | Módulo de financiamento (simulação integrada) | Abre nova fonte de receita e diferencia do concorrente | Após MRR de R$ 10.000 e 80+ clientes |
| **P3** | IA de precificação (FIPE + análise regional) | Feature premium — justifica upgrade de plano | Após MRR de R$ 10.000 e 80+ clientes |

---

## 9. Estrutura de Custos

### 9.0 Investimento pré-operacional (custos já incorridos)

Gastos realizados antes do início da operação comercial, durante a fase de desenvolvimento e design do MVP.

| Item | Detalhe | Valor |
|---|---|---|
| Uizard Pro — design do MVP | US$ 12/mês × 9 meses = US$ 108 | ~R$ 583 |
| **Total pré-operacional** | | **~R$ 583** |

> Cotação de referência: US$ 1 = R$ 5,40 (março 2026). Este valor representa o custo total de design do MVP e não se repete após o encerramento da assinatura.

### 9.1 Custos fixos mensais (fase inicial)

| Item | Tipo | Valor/mês | Obs. |
|---|---|---|---|
| Supabase (Pro plan) | Fixo | R$ 135 (US$ 25) | 8 GB storage, 10 GB bandwidth, 100k MAU, backups diários, suporte e-mail |
| Vercel (Pro plan) | Fixo | R$ 108 (US$ 20) | Deploys ilimitados, 1 TB bandwidth, domínio customizado, preview envs, analytics básico |
| GitHub Copilot (2 licenças) | Fixo (P&D) | R$ 108 | Uma licença por desenvolvedor — overhead de dev, não escala com clientes; cortável sem impacto no serviço |
| Domínio + e-mail profissional | Fixo | R$ 50 | Registro.br (~R$ 3/mês) + Google Workspace Starter 1 usuário (US$ 6/mês ≈ R$ 32) |
| Ferramentas (Figma, Uizard etc.) | Fixo | R$ 80 | Reduzível |
| **Subtotal fixo** | | **~R$ 481/mês** | |
| Stripe (3,49% + R$ 0,49/transação) | Variável | ~R$ 34–389 | Taxa real Stripe Brasil — escala com o MRR, ver tabela abaixo |
| **Total real (mês 3)** | | **~R$ 515** | R$ 481 fixo + R$ 34 Stripe |
| **Total real (mês 6)** | | **~R$ 566** | R$ 481 fixo + R$ 85 Stripe |
| **Total real (mês 12)** | | **~R$ 693** | |
| **Total real (mês 24)** | | **~R$ 870** | |

**Custo variável do Stripe por fase (taxa real Brasil: 3,49% + R$ 0,49/transação):**

| Mês | MRR | Clientes | Stripe (3,49% + R$0,49 × clientes) | Margem bruta |
|---|---|---|---|---|
| 3 | R$ 880 | 7 | ~R$ 34 | ~41% |
| 6 | R$ 2.200 | 16 | ~R$ 85 | ~74% |
| 12 | R$ 5.500 | 40 | ~R$ 212 | ~87% |
| 24 | R$ 10.100 | 75 | ~R$ 389 | ~91% |

> A margem bruta melhora com a escala — a infra fixa (R$ 481) se dilui enquanto o Stripe mantém-se em ~3,5% da receita.

> Breakeven operacional (infra): **~5 clientes no plano Essencial** já cobrem toda a infraestrutura fixa (R$ 481 ÷ R$ 97 ≈ 5).

**Armazenamento de fotos e laudos PDF (Supabase Storage):**

O Supabase Pro inclui **8 GB de storage**. Acima disso, cobra **US$ 0,021/GB adicional** (~R$ 0,11/GB). Essa é a solução mais simples: sem migração, sem código extra, sem segundo serviço.

**Consumo estimado por plano (fotos + 1 laudo PDF de ~2 MB por veículo):**

| Plano | Veículos | Fotos (× 300 KB) | Laudo PDF (~2 MB) | Storage/cliente (100% uso) |
|---|---|---|---|---|
| Essencial | 30 | 5 × 300 KB → 45 MB | 2 MB × 30 → 60 MB | **~105 MB** |
| Profissional | 100 | 15 × 300 KB → 450 MB | 2 MB × 100 → 200 MB | **~650 MB** |
| Premium | ~200 (est.) | 30 × 300 KB → 1,8 GB | 2 MB × 200 → 400 MB | **~2,2 GB** |

**Projeção de consumo e custo de excedente (60% de uso médio):**

| Mês | Clientes (Ess/Prof/Prem) | Storage estimado | Excedente | Custo adicional/mês |
|---|---|---|---|---|
| 3 | 7 (5/2/0) | ~0,8 GB | — | R$ 0 |
| 6 | 16 (11/4/1) | ~3,5 GB | — | R$ 0 |
| 12 | 40 (28/10/2) | ~8,5 GB | ~0,5 GB | ~R$ 0,06 |
| 18 | ~55 | ~12 GB | ~4 GB | ~R$ 0,46 |
| 24 | 75 (53/18/4) | ~16 GB | ~8 GB | ~R$ 0,92 |

> **Conclusão:** o custo de excedente do Supabase Storage é **desprezível** até 75+ clientes (~R$ 1/mês no mês 24). Não há necessidade de migrar para armazenamento externo neste horizonte de planejamento.

> **Quando migrar faz sentido:** acima de **200+ clientes** (~40 GB de storage), o custo excedente atinge ~R$ 3,50/mês — ainda baixo. A migração para Cloudflare R2 ou Cloudinary só se justifica por questões de **performance (CDN)** ou **otimização automática de imagem**, não por custo.

> **Ação de monitoramento:** acompanhar o consumo de storage no painel do Supabase mensalmente a partir do mês 6. Definir alerta quando atingir 80% do limite (6,4 GB).

### 9.2 Runway da equipe fundadora

Com 3 pessoas, o runway é a principal variável crítica do negócio. A infra custa R$481/mês — mas o custo real de operação inclui a sustentabilidade financeira pessoal de cada um dos 3 fundadores.

> ⚠️ **AÇÃO IMEDIATA:** preencher esta tabela ANTES de qualquer outro passo. Se algum dos 3 não tem renda paralela cobrindo suas despesas por pelo menos 12 meses, é melhor saber agora do que descobrir no mês 4. Esse é o risco #1 do negócio.

| Pergunta | Fundador | Parceiro Técnico | Parceiro Comercial |
|---|---|---|---|
| Custo de vida mensal | R$ ___ | R$ ___ | R$ ___ |
| Tem renda paralela cobrindo isso? | Sim / Não | Sim / Não | Sim / Não |
| Reserva disponível (meses) | ___ meses | ___ meses | ___ meses |
| MRR mínimo para receber pró-labore | R$ ___ | R$ ___ | R$ ___ |

> **Risco específico de equipes de 3 em part-time:** além da divergência de expectativas sobre equity e remuneração, o principal risco é a **incompatibilidade de disponibilidade** — cada fundador tem outras obrigações, e a ausência de um pode travar entregas críticas. Estabelecer cadencía semanal de alinhamento (ex: 30 min toda segunda) e definir quem é o “desempate” em decisões antes de qualquer desentendimento.

> **Regra prática:** se o negócio não cobrir as despesas dos 3 fundadores em 18 meses, revisar o modelo de aquisição — não o produto. Com o responsável comercial dedicado, a taxa de aquisição deve ser ~2–3x superior ao modelo solo — o que torna essa meta mais alcançável.

### 9.3 Infraestrutura de cobrança recorrente

A receita recorrente só é de fato recorrente se o processo de cobrança for automatizado. Definir a plataforma de pagamento é pré-condição para aceitar o primeiro cliente pago.

| Decisão | Definição |
|---|---|
| **Meio de pagamento (fase inicial)** | Cartão de crédito apenas — simplifica integração e agiliza o setup inicial |
| **Gateway de pagamento** | Stripe — integração direta com cartão, API de assinaturas completa, suporte a trials com cartão obrigatório e sem cobrança imediata (`trial_period_days: 30`); taxa real no Brasil ~3,49% + R$ 0,49 por transação. Alternativa nacional: Pagar.me (taxas similares, suporte local) |
| **Bloqueio automático ao fim do trial** | Sistema deve suspender acesso automaticamente no dia 31 — sem intervenção manual |
| **Dunning (falha de cobrança)** | Retentar cobrança por 3 dias consecutivos → notificar cliente por e-mail e WhatsApp → suspender no 5º dia sem pagamento |
| **Cancelamento** | Self-service via painel — reduz atrito e evita chargeback por "não consegui cancelar" |
| **Upgrade automático** | Quando o cliente ultrapassa o limite de veículos do plano, exibir aviso in-app com CTA para upgrade |
| **Plano anual** | Evolução futura (Fase 2, mês 6–9, com 20+ clientes e churn real medido). Desconto de 2 meses grátis; cobrado à vista no cartão; no MRR, contabilizar como valor anual ÷ 12. Não implementar na Fase 1 — priorizar feedback mensal e medir churn real antes |
| **Evolução futura** | Avaliar plano anual e Pix recorrente a partir da Fase 2 (20+ clientes), se houver demanda documentada |

> **Ação imediata:** criar conta no Stripe ou Pagar.me e configurar os planos de assinatura antes de encerrar o primeiro trial.

### 9.4 Constituição jurídica — empresa existente

A Uyemura Tech utilizará uma empresa já constituída no nome do fundador, ativa desde 2016.

**Dados da empresa atual:**

| Item | Dado |
|---|---|
| **Razão social** | Flavio Cavalcante Uyemura Tecnologia da Informação |
| **CNPJ** | 26.180.003/0001-48 |
| **Natureza jurídica** | 213-5 — Empresário Individual (EI) |
| **Data de abertura** | 16/09/2016 |
| **Situação** | Ativa |
| **CNAE principal** | 62.09-1-00 — Suporte técnico, manutenção e outros serviços em TI |
| **CNAEs secundários** | 63.11-9-00 — Provedores de serviços de aplicação e hospedagem na internet |
| | 63.99-2-00 — Outras atividades de prestação de serviços de informação |
| | 85.99-6-03 — Treinamento em informática |

**Ajustes necessários antes de operar o SaaS:**

| Ajuste | Detalhe | Custo estimado | Prazo |
|---|---|---|---|
| **Alterar CNAE principal** | Promover 63.11-9-00 (Provedores de serviços de aplicação) a CNAE principal — já é secundário e cobre SaaS | R$0–200 (via contador) | 3–10 dias úteis |
| **Adicionar CNAE 62.01-5/01** | Desenvolvimento de programas de computador sob encomenda — mais específico para desenvolvimento de software | Incluso na mesma alteração | — |
| **Cadastrar nome fantasia** | Registrar "Uyemura Tech" como nome fantasia — hoje consta vazio. Pode ser feito no mesmo ato da alteração de CNAE | Incluso na mesma alteração | — |
| **Confirmar regime Simples Nacional** | Empresa já enquadrada no Simples Nacional — nenhuma ação necessária | R$0 | — |
| **Emissão de NF-e de serviço** | Habilitar emissão de NFS-e na prefeitura de São Paulo (se ainda não habilitada) | R$0 | 1–5 dias úteis |

> **Vantagem:** empresa com 10 anos de histórico ativo — isso transmite credibilidade para clientes PJ e facilita integração com gateways de pagamento (Stripe, Pagar.me). Não há custo de abertura.

**Estrutura societária — fase inicial (parceiros operacionais):**

Os dois parceiros atuam como colaboradores operacionais, **não como sócios**. A empresa permanece como EI (Empresário Individual) com titularidade exclusiva do fundador. Isso é coerente com o modelo de incentivos definido na seção 10.

| Papel | Vínculo jurídico | Tipo |
|---|---|---|
| Fundador (Flavio) | Titular da EI | Proprietário |
| Parceiro técnico | Contrato de prestação de serviço PJ ou termo de colaboração | Parceiro operacional |
| Parceiro comercial | Contrato de prestação de serviço PJ ou termo de colaboração | Parceiro operacional |

**Conversão futura para LTDA (quando houver entrada de sócios):**

A natureza jurídica EI **não admite sócios**. Quando os parceiros atingirem o cliff de 12 meses (seção 10.3) e for formalizada a participação societária, será necessário converter:

| Etapa | Ação | Custo | Prazo |
|---|---|---|---|
| 1 | Converter EI → LTDA (Sociedade Limitada) | R$500–1.500 (honorários contábeis + taxas) | 10–20 dias úteis |
| 2 | Definir contrato social com quotas conforme vesting | R$1.000–3.000 (advogado especializado em startups) | 5–10 dias úteis |
| 3 | Atualizar cadastro no Stripe/gateway de pagamento | R$0 | 1–3 dias úteis |

> **Por que LTDA e não SLU?** A SLU (Sociedade Limitada Unipessoal) é para um único sócio. Como o objetivo é trazer até 2 sócios, a LTDA é o caminho natural. A conversão preserva o CNPJ, o histórico e os contratos existentes.

> **Responsabilidade patrimonial:** a EI tem responsabilidade patrimonial ilimitada (patrimônio pessoal do fundador responde por dívidas da empresa). A LTDA limita essa responsabilidade ao capital social — mais um motivo para converter quando houver receita recorrente significativa.

> **Regime tributário:** Simples Nacional — Anexo III para serviços de TI (alíquota inicial ~6% sobre receita bruta). Faturamento de R$5.500/mês → imposto ~R$330/mês.

### 9.5 Estratégia de suporte pós-lançamento

O suporte é o principal driver de retenção nos primeiros 6 meses — um cliente que não ativa o produto cancela. O modelo abaixo escala conforme a base cresce, sem sobrecarregar o fundador.

**Gatilho de ativação:** cliente que cadastrou ≥3 veículos + gerou ≥1 QR Code nos primeiros 7 dias → considerado "ativado". Clientes ativados têm churn significativamente menor.

#### Tier 0 — Self-service *(desde o lançamento)*

| Canal | Conteúdo | Onde |
|---|---|---|
| Vídeo de onboarding | Tutorial em ~5 min: cadastrar veículo, gerar QR, imprimir | YouTube (não listado) ou Loom |
| FAQ escrito | Top 10 dúvidas com prints e GIFs | Página `/ajuda` ou Notion público |
| In-app checklist | 5 passos de ativação dentro do produto | Roadmap P1 — entregar junto com comparação de veículos |

#### Tier 1 — WhatsApp direto com o fundador *(0–30 clientes)*

- Número dedicado ao suporte — separado do WhatsApp pessoal
- SLA informal: resposta em até 4h em dias úteis
- Check-in proativo no **dia 3** (instalou?) e **dia 7** (está usando e ativando?) de cada trial
- Registrar todas as dúvidas recebidas → alimentar o FAQ e o roadmap de produto

> **Sinal de alerta:** com 20+ clientes ativos, o suporte por WhatsApp já consome 2–3h/dia do fundador. Esse é o gatilho para avançar para o Tier 2.

#### Tier 2 — Assistente de suporte part-time *(30–80 clientes — gatilho: mês 6)*

- Contratar assistente remoto (20h/semana) treinado com FAQ e scripts de resposta
- Custo estimado: R$800–1.200/mês (PJ ou CLT parcial)
- Fundador atende apenas casos escalados — não processa a fila completa
- Ferramenta: **Crisp** (gratuito até 2 operadores) ou **WhatsApp Business API** para organizar fila

#### Tier 3 — CS dedicado + ticketing *(80+ clientes — gatilho: MRR > R$10.000)*

| Decisão | Detalhe |
|---|---|
| Ferramenta de suporte | **Chatwoot** (open-source, self-hosted) ou **Intercom** (US$39/mês — inclui onboarding automatizado) |
| Primeiro CS | Freela ou CLT parcial — foco em onboarding e renovação, perfil comercial não técnico |
| NPS automatizado | Pesquisa automática no dia 30 (fim do trial) e dia 90 (3 meses pagos) |
| Alerta de churn | Cliente sem login por 14 dias → notificação automática → contato proativo |

**Evolução do custo de suporte:**

| Fase | Clientes | Modelo | Custo/mês |
|---|---|---|---|
| Lançamento | 0–30 | Fundador direto + FAQ | Incluso no overhead do fundador |
| Tração | 30–80 | Assistente part-time | R$800–1.200 |
| Escala | 80+ | CS dedicado + ferramenta | R$1.500–3.000 |

---

## 10. Equipe, Incentivos e Governança

### 10.1 Estrutura da equipe

| Papel | Dedicação | Responsabilidades principais |
|---|---|---|
| **Fundador (Líder de Produto e Visão)** | Part-time (~20h/semana) | Decisões estratégicas, definição de roadmap, arquitetura técnica, desenvolvimento do produto |
| **Parceiro Técnico (Desenvolvedor)** | Part-time (~20h/semana) | Desenvolvimento frontend/backend, testes, deploy, manutenção de infraestrutura |
| **Parceiro Comercial (Operações e Vendas)** | Part-time (~20h/semana) | Prospecção, demos presenciais, onboarding de clientes, suporte WhatsApp, feedback de mercado |

> **Esclarecimento jurídico:** os dois parceiros **não são sócios** da empresa na fase inicial. Atuam como colaboradores com possibilidade de participação societária futura condicionada a desempenho e permanência.

> **Propriedade intelectual:** todo código, design, marca e conteúdo produzido para o projeto pertence à Uyemura Tech. Formalizar por escrito com cada parceiro **antes** de iniciar qualquer desenvolvimento conjunto — um termo de cessão de PI simples (1 página) já é suficiente nesta fase.

### 10.2 Modelo de incentivos (fase inicial)

Na Fase 1, os parceiros não recebem equity nem pró-labore. O modelo de incentivo deve ser claro, documentado e percebido como justo — caso contrário, a desmotivação aparece antes do primeiro cliente.

**Opções de incentivo (escolher uma ou combinar):**

| Modelo | Como funciona | Vantagem | Risco |
|---|---|---|---|
| **Comissão por cliente (comercial)** | X% do MRR gerado por cliente que o parceiro trouxe, enquanto o cliente estiver ativo | Alinhamento direto com receita; custo só existe quando há receita | Pode gerar disputa sobre "quem trouxe" o cliente |
| **Bônus por entrega (técnico)** | Valor fixo por milestone entregue (ex: R$500 por entrega do P0, R$300 por feature P1) | Previsível; incentiva entrega, não horas | Se mal calibrado, pode incentivar velocidade em detrimento de qualidade |
| **Pool de receita futura** | A cada mês com MRR positivo, X% da receita líquida é dividida entre os 3 | Simples; todos ganham quando o negócio ganha | Diluído demais se o MRR for baixo |
| **Direito preferencial a equity** | Parceiro que permanecer por 12+ meses ganha direito de converter participação (ver 10.3) | Retenção de longo prazo | Não dá retorno imediato |

**Sugestão recomendada para a fase inicial:**

- **Parceiro comercial:** comissão de 10% do MRR dos clientes que prospectar diretamente, paga mensalmente enquanto o cliente estiver ativo. Com 16 clientes no mês 6 (MRR R$2.200), isso representa ~R$220/mês — modesto, mas alinhado com receita real.
- **Parceiro técnico:** bônus por milestone (ex: R$500 por P0 entregue, R$300 por cada feature P1) + direito preferencial a equity após 12 meses.
- **Ambos:** direito preferencial a equity conforme seção 10.3.

> **Ação imediata:** formalizar o modelo de incentivo por escrito antes de iniciar o trabalho conjunto. Um documento simples de 1–2 páginas assinado por todos é suficiente.

### 10.3 Plano de sociedade futura

A participação societária é a ferramenta mais poderosa de retenção de longo prazo — mas concedê-la prematuramente é um dos erros mais comuns de fundadores de primeira viagem.

**Acordo simples para a fase inicial (1 página, assinado pelos 3):**

1. **Nenhum equity é concedido antes de 12 meses** de contribuição ativa e comprovada.
2. **Se ficar 12+ meses contribuindo ativamente**, o parceiro ganha direito a negociar até 15% da empresa (pool total de 30% — 15% por parceiro).
3. **Se sair antes de 12 meses**, não leva equity — apenas comissões já pagas.
4. **O fundador mantém 70%+ e controle majoritário.**
5. **Detalhes de vesting (prazos, boa/má saída, aceleração)** serão formalizados com advogado quando o MRR atingir R$ 5.000 ou o cliff de 12 meses for atingido — o que acontecer primeiro.

**Gatilhos para formalização:**

| Gatilho | Ação |
|---|---|
| Parceiro completa 12 meses (cliff) | Formalizar contrato de vesting com advogado (R$1.000–3.000) |
| MRR ≥ R$ 5.000 | Avaliar se a estrutura EI deve ser convertida em LTDA |
| MRR ≥ R$ 10.000 | Revisar percentuais com base na contribuição real de cada um |

> **Por que não formalizar o vesting agora?** Porque vocês ainda não venderam nada. Gastar R$1.000–3.000 com advogado antes de ter 1 cliente é desperdício de runway. O acordo simples de 1 página protege o essencial e é juridicamente válido.

### 10.4 Governança

Na fase inicial, governança leve e decisão rápida > processo formal.

**Fase 1 — Centralizada no fundador (0–30 clientes)**

| Tipo de decisão | Quem decide | Exemplo |
|---|---|---|
| **Estratégica** | Fundador (decisão final) | Precificação, roadmap, parcerias, admissão/desligamento de parceiros |
| **Tática de produto** | Fundador + parceiro técnico (consenso, desempate: fundador) | Prioridade de features, stack, arquitetura |
| **Tática comercial** | Parceiro comercial (autonomia dentro das diretrizes) | Script de demo, canais de prospecção, agenda de visitas |
| **Financeira** | Fundador exclusivamente | Despesas, distribuição de receita, contratações |

**Cadência de alinhamento:**

| Reunião | Frequência | Duração | Pauta |
|---|---|---|---|
| **Standup assíncrono** | Diária (WhatsApp/Slack) | 5 min | O que fez, o que vai fazer, bloqueios |
| **Alinhamento semanal** | Toda segunda-feira | 30 min | Pipeline de vendas, progresso do dev, métricas (MRR, trials, churn), decisões pendentes |
| **Retrospectiva mensal** | 1× por mês | 60 min | O que funcionou, o que não funcionou, ajustes de rota |

**Evolução da governança:**

| Gatilho | Mudança |
|---|---|
| Cliff de 12 meses completado por parceiro | Parceiro com equity vestido passa a ter voz consultiva em decisões estratégicas |
| MRR ≥ R$ 10.000 (Fase B) | Criar reunião trimestral de "board" com os 3 — revisão de metas, equity, e roadmap |
| Contratação do primeiro funcionário | Definir organograma formal e políticas mínimas de RH |
| MRR ≥ R$ 30.000 (Fase C) | Avaliar conselho consultivo externo (1–2 mentores do setor automotivo ou SaaS) |

> **Regra de ouro para a fase inicial:** o fundador ouve todos, mas decide sozinho nas questões estratégicas. Consenso em equipes de 3 pessoas leva à paralisia. Quando houver equity vestido, o poder de voto acompanha a participação.

> **Risco principal:** o parceiro mais engajado se sentir sub-reconhecido enquanto o menos engajado "surfa" no trabalho dos outros. A cadência semanal de 30 min é o principal mecanismo de prevenção — torna contribuição (ou falta dela) visível para todos.

---

## 11. Análise de Riscos

### 11.1 Critério go/no-go — quando parar

> **Esta é a seção mais importante para iniciantes.** Defina antecipadamente quando é hora de parar — caso contrário, vão insistir por orgulho ou desistir por medo, sem base racional.

| Sinal | Critério | Ação |
|---|---|---|
| **Parar** | 3 meses de prospecção ativa (15+ abordagens/semana) com menos de 3 trials iniciados | O problema ou o produto não conecta. Pivot ou encerrar |
| **Parar** | 6 meses de operação com menos de 5 clientes pagantes | Modelo de aquisição não funciona. Reavaliar canal e proposta |
| **Continuar com ajuste** | Conversão trial < 15% por 2 meses seguidos | Revisar onboarding, proposta de valor e qualificação de leads |
| **Continuar com ajuste** | Churn > 10%/mês por 3 meses | Problema no produto, não na venda. Focar em retenção antes de prospectar mais |

**Perda máxima estimada:** R$ 583 (pré-op) + R$ 481 × 3 meses (infra) = **~R$ 2.026**. Esse é o custo do experimento se tudo der errado nos primeiros 3 meses.

### 11.2 Tabela de riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| **P0 não entregue (página pública QR Code + geração de QR)** | Alta | **Crítico** | Entregar P0 completo antes de qualquer contato comercial — sem isso nenhuma demo é possível |
| Conversão trial abaixo de 25% | Alta | Crítico | Revisar script de demo e qualificação do lead antes do trial |
| Churn alto por falta de onboarding | Alta | Alto | Check-in no 7º dia + CS por WhatsApp no 1º mês pago + definir métrica de ativação |
| Solução gratuita ser suficiente para o cliente | Alta | Alto | Demo ao vivo mostrando o que o WhatsApp/Linktree não resolve |
| Resistência à adoção digital | Média | Alto | Onboarding < 1h presencial + trial 30 dias + suporte WhatsApp |
| Equipe fundadora sem runway suficiente | Média | Crítico | Validar sustentabilidade financeira pessoal de cada fundador + documentar equity e critérios de saída antes do primeiro cliente (ver seção 10.3) |
| Vazamento de dados / LGPD | Baixa | Alto | RLS no Supabase + política de privacidade + aviso em features com dado do comprador |
| Concorrente grande copiar o QR Code | Baixa | Médio | Velocidade de execução + base instalada fiel + relacionamento próximo com PMEs |
| Conflito entre fundador e parceiros | Média | Crítico | Formalizar incentivos, vesting e governança por escrito antes do primeiro cliente (seção 10) |

---

## 12. Visão de Futuro (12–36 meses)

### Fase A — Consolidação do core

- **Gatilho de saída:** avançar para a Fase B quando o MRR atingir R$ 10.000 ou a base alcançar 75 clientes ativos — o que acontecer primeiro. Com o ritmo part-time atual, a projeção indica que isso ocorre por volta do mês 24.

- Foco exclusivo em revendas automotivas — nenhuma expansão de vertical
- Lançar módulo de comparação de veículos e integração com WhatsApp
- Construir base instalada fiel com NPS > 50
- Documentar playbook de onboarding e escalar suporte por WhatsApp

### Fase B — Expansão de produto

- **Gatilho de entrada:** MRR ≥ R$ 10.000 ou 75+ clientes ativos.
- **Gatilho de saída:** avançar para a Fase C quando o MRR atingir R$ 30.000 ou a base alcançar 200 clientes ativos.

- **Módulo de financiamento:** simulação integrada com financiadoras direto na ficha do veículo
- **IA de precificação:** sugestão de preço baseada em FIPE + análise de mercado regional
- **Dashboard avançado** com métricas de escaneamento, interesse por modelo e conversão por veículo

### Fase C — Escala e novos mercados

- **Gatilho de entrada:** MRR ≥ R$ 30.000 ou 200+ clientes ativos.

- **White-label:** revendedoras de software oferecem a solução com sua marca
- **Expansão para verticais adjacentes:** máquinas agrícolas e equipamentos industriais
- **Marketplace interno:** comprador marca interesse → vendedor recebe notificação qualificada
- **Expansão geográfica:** Norte e Nordeste com parceiros regionais

---

## 13. Glossário de Métricas

> **Para os primeiros 6 meses, foque apenas em: Trials ativos, Conversão trial e Churn.** As demais métricas são referência para quando houver volume (15+ clientes).

| Métrica | Nome completo | Definição | Como calcular | Referência do plano |
|---|---|---|---|---|
| **MRR** | Monthly Recurring Revenue | Receita recorrente mensal total de todas as assinaturas ativas | Soma dos tickets mensais de todos os clientes ativos | Meta mês 12: R$ 5.500+ |
| **ARR** | Annual Recurring Revenue | Receita recorrente anualizada | MRR × 12 | Meta mês 12: ~R$ 66.000 |
| **Churn** | Taxa de cancelamento mensal | Percentual de clientes que cancelam a assinatura em um mês | (clientes cancelados no mês ÷ clientes ativos no início do mês) × 100 | Meta: < 5%/mês |
| **LTV** | Lifetime Value | Receita total esperada de um cliente durante toda a sua permanência | Ticket médio ÷ churn mensal | Essencial: R$ 97 ÷ 5% = R$ 1.940 |
| **CAC** | Customer Acquisition Cost | Custo total para adquirir um novo cliente pagante | (custo de vendas + marketing do período) ÷ novos clientes convertidos | Meta: < R$ 400 |
| **LTV/CAC** | Relação LTV / CAC | Eficiência do modelo de aquisição — quanto cada R$ investido em aquisição retorna em receita ao longo do tempo | LTV ÷ CAC | Meta: > 5x (saudável); > 3x (mínimo aceitável) |
| **Conversão trial** | Taxa de conversão trial → pago | Percentual de trials que se tornam clientes pagantes | (clientes que converteram ÷ trials iniciados) × 100 | Meta: > 25% |
| **NPS** | Net Promoter Score | Índice de satisfação e lealdade do cliente | % promotores (nota 9–10) − % detratores (nota 0–6); resultado varia de −100 a +100 | Meta: NPS > 50 |
| **Dunning** | Recuperação de cobranças falhas | Processo automatizado de recobrança quando o pagamento falha (cartão recusado, saldo insuficiente) | — | Definido na seção 9.3 |
| **Runway** | Tempo de sobrevivência operacional | Quantos meses o negócio consegue operar sem receita, com base na reserva atual | Reserva disponível ÷ custo mensal total (infra + vida do fundador) | Mínimo recomendado: 12 meses |
| **Breakeven** | Ponto de equilíbrio | Quantidade de clientes ou receita necessária para cobrir todos os custos fixos | Custo fixo mensal ÷ ticket médio | Infra: ~5 clientes Essencial (R$ 481 ÷ R$ 97 ≈ 5) |
| **MRR Expansion** | Expansão de receita | Receita adicional gerada por upgrades de plano de clientes existentes | Soma dos aumentos de ticket de clientes que fizeram upgrade no mês | Acompanhar a partir do mês 6 |
| **Churn de receita** | Revenue Churn | Percentual da receita perdida por cancelamentos e downgrades | (MRR perdido no mês ÷ MRR início do mês) × 100 | Complementar ao churn de clientes |

---

*Documento elaborado em março de 2026 — Uyemura Tech. Confidencial.*
