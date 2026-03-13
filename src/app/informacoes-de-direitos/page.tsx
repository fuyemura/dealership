import { LegalLayout } from "@/components/legal-layout";

const TOC = [
  { href: "#introducao",       label: "1. Introdução" },
  { href: "#seus-direitos",    label: "2. Seus direitos (LGPD)" },
  { href: "#como-exercer",     label: "3. Como exercer" },
  { href: "#prazos",           label: "4. Prazos" },
  { href: "#direitos-usuario", label: "5. Direitos do usuário" },
  { href: "#cancelamento",     label: "6. Cancelamento e reembolso" },
  { href: "#suporte",          label: "7. Canais de suporte" },
  { href: "#dpo",              label: "8. Encarregado de dados" },
  { href: "#anpd",             label: "9. ANPD" },
  { href: "#cdc",              label: "10. Código de Defesa do Consumidor" },
];

export const metadata = {
  title: "Informações de Direitos — Uyemura Tech",
  description: "Conheça seus direitos como usuário da plataforma Uyemura Tech.",
};

export default function InformacoesDeDireitosPage() {
  return (
    <LegalLayout
      title="Informações de Direitos"
      badgeColor="#a78bfa"
      tocItems={TOC}
    >

      <section id="introducao">
        <h2>1. Introdução</h2>
        <p>
          A Uyemura Tech está comprometida com a transparência e com o respeito aos direitos de
          todos os seus usuários, clientes e parceiros. Esta página reúne, de forma clara e
          acessível, os direitos que você possui ao utilizar nossa plataforma.
        </p>
        <p>
          Seus direitos são garantidos pela{" "}
          <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>, pelo{" "}
          <strong>Código de Defesa do Consumidor (CDC — Lei nº 8.078/1990)</strong> e demais
          legislações brasileiras aplicáveis.
        </p>
        <div className="highlight-box">
          <p>
            Você pode exercer qualquer um desses direitos a qualquer momento, sem custo
            adicional, pelo canal <strong>privacidade@uyemura.tech</strong>.
          </p>
        </div>
      </section>

      <section id="seus-direitos">
        <h2>2. Seus direitos sob a LGPD</h2>
        <p>
          Como titular dos dados pessoais tratados pela Uyemura Tech, você possui os seguintes
          direitos previstos no Art. 18 da LGPD:
        </p>
        <div className="rights-grid">
          <div className="right-card">
            <div className="right-icon">🔍</div>
            <h3>Confirmação e acesso</h3>
            <p>Confirmar se tratamos seus dados e obter uma cópia completa das informações que mantemos sobre você.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">✏️</div>
            <h3>Correção</h3>
            <p>Solicitar a correção de dados incompletos, inexatos ou desatualizados no mais breve prazo possível.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">🗑️</div>
            <h3>Eliminação</h3>
            <p>Solicitar a exclusão de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">📦</div>
            <h3>Portabilidade</h3>
            <p>Receber seus dados em formato estruturado e interoperável para transferência a outro fornecedor.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">🚫</div>
            <h3>Anonimização e bloqueio</h3>
            <p>Solicitar a anonimização ou bloqueio de dados desnecessários ou tratados indevidamente.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">ℹ️</div>
            <h3>Informação sobre terceiros</h3>
            <p>Saber com quais entidades públicas e privadas seus dados foram ou poderão ser compartilhados.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">↩️</div>
            <h3>Revogação do consentimento</h3>
            <p>Retirar o consentimento dado a qualquer momento, sem prejuízo dos tratamentos realizados antes.</p>
          </div>
          <div className="right-card">
            <div className="right-icon">✋</div>
            <h3>Oposição</h3>
            <p>Opor-se ao tratamento realizado com base em hipóteses legais diversas do consentimento, em caso de descumprimento.</p>
          </div>
        </div>
      </section>

      <section id="como-exercer">
        <h2>3. Como exercer seus direitos</h2>
        <p>O processo é simples e totalmente gratuito:</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div className="step-content">
              <h4>Envie sua solicitação</h4>
              <p>Entre em contato pelo e-mail <strong>privacidade@uyemura.tech</strong> informando o direito que deseja exercer e uma breve descrição da solicitação.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div className="step-content">
              <h4>Confirmação de identidade</h4>
              <p>Para proteger seus dados, podemos solicitar uma confirmação de identidade antes de processar sua solicitação.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div className="step-content">
              <h4>Análise e resposta</h4>
              <p>Nossa equipe analisará sua solicitação e responderá dentro do prazo legal, informando as medidas tomadas ou a justificativa para impossibilidade de atendimento.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div className="step-content">
              <h4>Recurso</h4>
              <p>Caso não esteja satisfeito com a resposta, você pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).</p>
            </div>
          </div>
        </div>
      </section>

      <section id="prazos">
        <h2>4. Prazos de resposta</h2>
        <ul>
          <li><strong>Confirmação de recebimento:</strong> até 2 dias úteis após o recebimento da solicitação.</li>
          <li><strong>Resposta completa:</strong> até 15 dias úteis, conforme previsto na LGPD.</li>
          <li><strong>Emergências e violações de segurança:</strong> notificação em até 72 horas, conforme regulamentação da ANPD.</li>
          <li><strong>Exportação de dados:</strong> disponibilizada em até 30 dias após a solicitação.</li>
        </ul>
        <p>
          Em casos de alta complexidade, podemos estender o prazo em até 15 dias adicionais,
          com comunicação prévia e justificativa.
        </p>
      </section>

      <section id="direitos-usuario">
        <h2>5. Direitos do usuário da plataforma</h2>
        <p>Além dos direitos previstos pela LGPD, como usuário você tem direito a:</p>
        <ul>
          <li>Acessar todos os dados cadastrados por você ou sua empresa na plataforma.</li>
          <li>Exportar o inventário de veículos em formatos abertos (CSV, JSON) mediante solicitação.</li>
          <li>Ser informado sobre alterações relevantes nos Termos de Serviço e Política de Privacidade com antecedência mínima de 15 dias.</li>
          <li>Receber suporte técnico adequado durante a vigência da assinatura.</li>
          <li>Ter seus dados mantidos em segurança e confidencialidade por nossos colaboradores e parceiros.</li>
          <li>Ser notificado em caso de incidente de segurança que possa afetar seus dados pessoais.</li>
        </ul>
      </section>

      <section id="cancelamento">
        <h2>6. Direitos de cancelamento e reembolso</h2>
        <ul>
          <li><strong>Direito de arrependimento (CDC, Art. 49):</strong> compras realizadas à distância podem ser canceladas em até 7 dias corridos, com reembolso integral.</li>
          <li><strong>Cancelamento a qualquer tempo:</strong> sem necessidade de justificativa, com efeito ao final do período já pago.</li>
          <li><strong>Falha na prestação do serviço:</strong> em caso de indisponibilidade superior ao SLA, você tem direito a crédito proporcional ou negociação de compensação.</li>
          <li><strong>Cobrança indevida:</strong> cobranças indevidas serão estornadas em até 10 dias úteis após confirmação.</li>
        </ul>
        <div className="highlight-box">
          <p>
            Para exercer esses direitos, entre em contato pelo e-mail{" "}
            <strong>suporte@uyemura.tech</strong> ou via painel da conta.
          </p>
        </div>
      </section>

      <section id="suporte">
        <h2>7. Canais de suporte e atendimento</h2>
        <ul>
          <li><strong>Privacidade e LGPD:</strong> privacidade@uyemura.tech</li>
          <li><strong>Suporte técnico e conta:</strong> suporte@uyemura.tech</li>
          <li><strong>Questões jurídicas e contratuais:</strong> legal@uyemura.tech</li>
          <li><strong>Contato geral:</strong> contato@uyemura.tech</li>
        </ul>
        <p>
          Todos os canais operam em dias úteis, das 9h às 18h (horário de Brasília). Para
          questões urgentes de segurança, o prazo de resposta inicial é de até 4 horas em dias
          úteis.
        </p>
      </section>

      <section id="dpo">
        <h2>8. Encarregado de dados (DPO)</h2>
        <p>
          Nos termos do Art. 41 da LGPD, a Uyemura Tech designou um Encarregado pelo
          Tratamento de Dados Pessoais (DPO), responsável por:
        </p>
        <ul>
          <li>Aceitar reclamações e comunicações dos titulares dos dados e da ANPD.</li>
          <li>Prestar esclarecimentos e adotar providências cabíveis.</li>
          <li>Orientar os colaboradores e contratados sobre as práticas de proteção de dados.</li>
          <li>Executar as demais atribuições determinadas pelo controlador ou estabelecidas em normas complementares.</li>
        </ul>
        <p>
          Para contato direto com o DPO: <strong>dpo@uyemura.tech</strong>
        </p>
      </section>

      <section id="anpd">
        <h2>9. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
        <p>
          Caso não esteja satisfeito com as respostas da Uyemura Tech, você pode contatar
          diretamente a ANPD:
        </p>
        <ul>
          <li><strong>Site oficial:</strong> www.gov.br/anpd</li>
          <li><strong>Peticionamento eletrônico:</strong> disponível no portal da ANPD</li>
          <li><strong>Endereço:</strong> Esplanada dos Ministérios, Bloco Z, Brasília-DF</li>
        </ul>
      </section>

      <section id="cdc">
        <h2>10. Código de Defesa do Consumidor</h2>
        <p>
          Como fornecedor de serviço digital, a Uyemura Tech está sujeita ao CDC (Lei nº
          8.078/1990). Seus direitos incluem:
        </p>
        <ul>
          <li>Proteção contra práticas comerciais abusivas.</li>
          <li>Informação adequada e clara sobre o serviço prestado.</li>
          <li>Proteção contra publicidade enganosa ou abusiva.</li>
          <li>Acesso aos órgãos de defesa do consumidor (PROCONs) para mediação de conflitos.</li>
        </ul>
        <p>
          Em caso de conflito não resolvido diretamente com a Uyemura Tech, você pode registrar
          reclamação no <strong>consumidor.gov.br</strong>, plataforma oficial de resolução de
          conflitos do Governo Federal.
        </p>
      </section>

    </LegalLayout>
  );
}
