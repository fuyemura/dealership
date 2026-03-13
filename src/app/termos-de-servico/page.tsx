import { LegalLayout } from "@/components/legal-layout";

const TOC = [
  { href: "#aceitacao",    label: "1. Aceitação" },
  { href: "#servico",      label: "2. O Serviço" },
  { href: "#cadastro",     label: "3. Cadastro e conta" },
  { href: "#planos",       label: "4. Planos e pagamento" },
  { href: "#uso-aceito",   label: "5. Uso aceitável" },
  { href: "#propriedade",  label: "6. Propriedade intelectual" },
  { href: "#dados",        label: "7. Seus dados" },
  { href: "#disponibilidade", label: "8. Disponibilidade" },
  { href: "#limitacao",    label: "9. Limitação de responsabilidade" },
  { href: "#rescisao",     label: "10. Rescisão" },
  { href: "#geral",        label: "11. Disposições gerais" },
];

export const metadata = {
  title: "Termos de Serviço — Uyemura Tech",
  description: "Leia os Termos de Serviço da plataforma Uyemura Tech.",
};

export default function TermosDeServicopage() {
  return (
    <LegalLayout
      title="Termos de Serviço"
      badgeColor="#60a5fa"
      tocItems={TOC}
    >

      <section id="aceitacao">
        <h2>1. Aceitação dos termos</h2>
        <p>
          Ao criar uma conta, acessar ou utilizar a plataforma Uyemura Tech, você concorda com
          estes Termos de Serviço e com nossa{" "}
          <a href="/politica-de-privacidade">Política de Privacidade</a>.
        </p>
        <p>
          Se você está aceitando estes termos em nome de uma empresa, você declara ter autoridade
          para vincular essa entidade a estes termos.
        </p>
        <div className="warning-box">
          <p>⚠ Se você não concordar com estes termos, não utilize a plataforma Uyemura Tech.</p>
        </div>
      </section>

      <section id="servico">
        <h2>2. Descrição do serviço</h2>
        <p>
          A Uyemura Tech oferece uma plataforma SaaS voltada à gestão digital de concessionárias
          e revendas de veículos, incluindo:
        </p>
        <ul>
          <li>Cadastro e gerenciamento de estoque de veículos com fotos.</li>
          <li>Geração de QR Codes exclusivos vinculados a cada veículo.</li>
          <li>Página pública com dados do veículo acessível via QR Code, sem necessidade de aplicativo.</li>
          <li>Controle de usuários com diferentes níveis de acesso (administrador, gerente e operador).</li>
          <li>Painel de métricas e visualizações de QR Codes.</li>
        </ul>
        <p>
          A Uyemura Tech reserva-se o direito de modificar ou descontinuar funcionalidades com
          aviso prévio razoável.
        </p>
      </section>

      <section id="cadastro">
        <h2>3. Cadastro e responsabilidades da conta</h2>
        <p>
          Para utilizar a plataforma, você deve criar uma conta com informações verídicas,
          completas e atualizadas.
        </p>
        <ul>
          <li>Você é responsável pela confidencialidade das suas credenciais de acesso.</li>
          <li>Você é responsável por todas as atividades realizadas sob sua conta.</li>
          <li>Você deve notificar imediatamente a Uyemura Tech sobre qualquer acesso não autorizado.</li>
          <li>Cada conta está vinculada a um CNPJ válido e ativo. É vedado compartilhar credenciais entre diferentes empresas.</li>
        </ul>
      </section>

      <section id="planos">
        <h2>4. Planos, pagamento e cancelamento</h2>
        <p>
          A plataforma é oferecida mediante assinatura recorrente, conforme os planos disponíveis
          na página de preços.
        </p>
        <ul>
          <li><strong>Renovação automática:</strong> as assinaturas renovam ao final de cada período, salvo cancelamento prévio.</li>
          <li><strong>Cancelamento:</strong> pode ser feito a qualquer momento; tem efeito ao final do período pago.</li>
          <li><strong>Reembolsos:</strong> não são oferecidos reembolsos proporcionais, exceto conforme o Código de Defesa do Consumidor.</li>
          <li><strong>Inadimplência:</strong> o acesso poderá ser suspenso após aviso prévio de 5 dias úteis.</li>
        </ul>
        <div className="highlight-box">
          <p>
            Os preços poderão ser reajustados anualmente mediante notificação com{" "}
            <strong>30 dias de antecedência</strong>.
          </p>
        </div>
      </section>

      <section id="uso-aceito">
        <h2>5. Uso aceitável</h2>
        <p>É expressamente proibido:</p>
        <ul>
          <li>Cadastrar veículos com documentação irregular, furtados ou com qualquer impedimento legal.</li>
          <li>Fornecer informações falsas sobre veículos, empresa ou representantes.</li>
          <li>Tentar acessar áreas restritas da plataforma ou contas de outros usuários.</li>
          <li>Realizar engenharia reversa ou decompilação de qualquer parte da plataforma.</li>
          <li>Utilizar bots ou scrapers para extração de dados.</li>
          <li>Praticar qualquer ato que viole a legislação brasileira ou direitos de terceiros.</li>
        </ul>
        <p>
          O descumprimento poderá resultar em suspensão imediata da conta sem direito a
          reembolso.
        </p>
      </section>

      <section id="propriedade">
        <h2>6. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo, código-fonte, design, marca e funcionalidades da plataforma são de
          propriedade exclusiva da <strong>Uyemura Tech Ltda.</strong>, protegidos pela
          legislação brasileira de propriedade intelectual.
        </p>
        <p>
          Você recebe uma licença limitada, não exclusiva, intransferível e revogável para
          acessar a plataforma durante a vigência da assinatura. Os dados e conteúdos inseridos
          por você permanecem de sua propriedade.
        </p>
      </section>

      <section id="dados">
        <h2>7. Seus dados na plataforma</h2>
        <p>
          Você mantém a propriedade de todos os dados inseridos. A Uyemura Tech os processa
          apenas para prestar o serviço, conforme nossa Política de Privacidade.
        </p>
        <p>
          Em caso de encerramento, você pode solicitar exportação dos dados em até 30 dias antes
          do encerramento. Após esse prazo, os dados serão excluídos conforme nossa política de
          retenção.
        </p>
      </section>

      <section id="disponibilidade">
        <h2>8. Disponibilidade e SLA</h2>
        <p>
          A Uyemura Tech tem meta de disponibilidade de <strong>99,5% ao mês</strong>.
          Manutenções programadas serão comunicadas com no mínimo 24 horas de antecedência.
          Interrupções por força maior não configuram descumprimento de SLA.
        </p>
      </section>

      <section id="limitacao">
        <h2>9. Limitação de responsabilidade</h2>
        <p>
          Na máxima extensão permitida pela lei, a Uyemura Tech não será responsável por danos
          indiretos, incidentais ou consequentes. A responsabilidade total não excederá o valor
          pago nos últimos 3 meses.
        </p>
        <div className="warning-box">
          <p>
            ⚠ A Uyemura Tech não verifica a legalidade dos veículos cadastrados. Toda
            responsabilidade sobre a veracidade das informações inseridas é exclusiva do usuário.
          </p>
        </div>
      </section>

      <section id="rescisao">
        <h2>10. Rescisão</h2>
        <ul>
          <li><strong>Pelo usuário:</strong> cancelamento da assinatura via painel da conta.</li>
          <li><strong>Pela Uyemura Tech:</strong> em caso de violação dos termos, com 10 dias de antecedência — exceto em casos graves (fraude, uso ilegal), que podem resultar em suspensão imediata.</li>
        </ul>
      </section>

      <section id="geral">
        <h2>11. Disposições gerais</h2>
        <ul>
          <li><strong>Lei aplicável:</strong> leis da República Federativa do Brasil.</li>
          <li><strong>Foro:</strong> comarca de domicílio da Uyemura Tech, renunciando as partes a qualquer outro.</li>
          <li><strong>Invalidade parcial:</strong> caso alguma cláusula seja inválida, as demais permanecem em vigor.</li>
          <li><strong>Cessão:</strong> você não pode ceder seus direitos sem consentimento prévio por escrito da Uyemura Tech.</li>
        </ul>
        <p>
          Dúvidas? Entre em contato: <strong>legal@uyemura.tech</strong>
        </p>
      </section>

    </LegalLayout>
  );
}
