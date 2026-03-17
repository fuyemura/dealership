import { LegalLayout } from "@/components/legal-layout";

const TOC = [
  { href: "#intro",             label: "1. Introdução" },
  { href: "#coleta",            label: "2. Dados coletados" },
  { href: "#uso",               label: "3. Uso dos dados" },
  { href: "#compartilhamento",  label: "4. Compartilhamento" },
  { href: "#armazenamento",     label: "5. Armazenamento" },
  { href: "#direitos",          label: "6. Seus direitos (LGPD)" },
  { href: "#cookies",           label: "7. Cookies" },
  { href: "#menores",           label: "8. Menores de idade" },
  { href: "#alteracoes",        label: "9. Alterações" },
  { href: "#contato",           label: "10. Contato" },
];

export const metadata = {
  title: "Política de Privacidade — Uyemura Tech",
  description: "Saiba como a Uyemura Tech coleta, usa e protege seus dados pessoais.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      badgeColor="#4ade80"
      tocItems={TOC}
    >

      <section id="intro">
        <h2>1. Introdução</h2>
        <p>
          A <strong>Uyemura Tech Ltda.</strong> ("Uyemura Tech", "nós" ou "nosso") está
          comprometida com a proteção da privacidade e dos dados pessoais de nossos clientes,
          usuários e parceiros.
        </p>
        <p>
          Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e
          compartilhamos informações quando você utiliza nossa plataforma SaaS voltada à gestão
          de concessionárias e revendas de veículos, incluindo geração de QR Codes, cadastro de
          estoque e controle de inventário.
        </p>
        <div className="highlight-box">
          <p>
            Esta política está em conformidade com a{" "}
            <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong> e demais
            legislações brasileiras aplicáveis.
          </p>
        </div>
      </section>

      <section id="coleta">
        <h2>2. Dados coletados</h2>
        <p>Coletamos as seguintes categorias de dados:</p>
        <ul>
          <li><strong>Dados da empresa:</strong> CNPJ, razão social, nome fantasia, inscrição municipal e estadual, endereço completo, telefones e e-mail.</li>
          <li><strong>Dados do representante legal:</strong> nome completo, CPF, cargo e telefone de contato.</li>
          <li><strong>Dados dos usuários da plataforma:</strong> nome, e-mail, CPF e papel/função no sistema (administrador, gerente, usuário).</li>
          <li><strong>Dados dos veículos cadastrados:</strong> placa, RENAVAM, chassi, marca, modelo, ano, quilometragem, fotos e preço de venda.</li>
          <li><strong>Dados de acesso:</strong> data e hora de login, endereço IP, tipo de dispositivo e navegador.</li>
          <li><strong>Dados de uso:</strong> ações realizadas na plataforma, visualizações de QR Codes e interações com o sistema.</li>
        </ul>
      </section>

      <section id="uso">
        <h2>3. Uso dos dados</h2>
        <p>Utilizamos os dados coletados para:</p>
        <ul>
          <li>Prestar e melhorar os serviços da plataforma Uyemura Tech.</li>
          <li>Autenticar usuários e garantir a segurança dos acessos.</li>
          <li>Gerar QR Codes exclusivos vinculados aos veículos cadastrados.</li>
          <li>Enviar comunicações relacionadas ao serviço (atualizações, alertas, faturas).</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
          <li>Realizar análises agregadas e anônimas para melhoria do produto.</li>
        </ul>
        <p>
          Não utilizamos seus dados para fins de publicidade de terceiros ou para criação de
          perfis comportamentais não relacionados ao serviço contratado.
        </p>
      </section>

      <section id="compartilhamento">
        <h2>4. Compartilhamento de dados</h2>
        <p>Seus dados poderão ser compartilhados nas seguintes situações:</p>
        <ul>
          <li><strong>Provedores de infraestrutura:</strong> serviços de hospedagem, banco de dados e armazenamento de arquivos, sempre sob acordos de confidencialidade.</li>
          <li><strong>Serviços de autenticação:</strong> para validação de identidade dos usuários da plataforma.</li>
          <li><strong>Cumprimento legal:</strong> quando exigido por autoridade competente, ordem judicial ou obrigação legal.</li>
          <li><strong>Proteção de direitos:</strong> para investigar fraudes, violações de contrato ou ameaças à segurança.</li>
        </ul>
        <p>Não vendemos, alugamos nem comercializamos dados pessoais para terceiros.</p>
      </section>

      <section id="armazenamento">
        <h2>5. Armazenamento e segurança</h2>
        <p>
          Os dados são armazenados em servidores seguros localizados no Brasil ou em países que
          oferecem nível adequado de proteção, conforme exigido pela LGPD.
        </p>
        <p>Adotamos medidas técnicas e organizacionais adequadas, incluindo:</p>
        <ul>
          <li>Criptografia de dados em trânsito (TLS/HTTPS) e em repouso.</li>
          <li>Controle de acesso baseado em papéis (RBAC) dentro da plataforma.</li>
          <li>Monitoramento contínuo de acessos e atividades suspeitas.</li>
          <li>Backups regulares e planos de recuperação de desastres.</li>
        </ul>
        <p>
          Os dados são mantidos pelo período necessário à prestação do serviço. Após o
          encerramento do contrato, são excluídos ou anonimizados em até 90 dias, salvo
          obrigação legal em contrário.
        </p>
      </section>

      <section id="direitos">
        <h2>6. Seus direitos (LGPD)</h2>
        <p>Nos termos da LGPD, você possui os seguintes direitos:</p>
        <ul>
          <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e obter cópia deles.</li>
          <li><strong>Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade.</li>
          <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado e interoperável.</li>
          <li><strong>Revogação do consentimento:</strong> quando o tratamento se basear no consentimento.</li>
          <li><strong>Oposição:</strong> manifestar-se contra o tratamento em determinadas hipóteses.</li>
          <li><strong>Informação sobre terceiros:</strong> saber com quem compartilhamos seus dados.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <strong>privacidade@uyemura.tech</strong>.
        </p>
      </section>

      <section id="cookies">
        <h2>7. Cookies e tecnologias similares</h2>
        <p>
          Utilizamos cookies para manter sessões autenticadas, lembrar preferências e coletar
          métricas de uso da plataforma.
        </p>
        <ul>
          <li><strong>Cookies essenciais:</strong> necessários para o funcionamento da plataforma (autenticação, segurança).</li>
          <li><strong>Cookies analíticos:</strong> para entender como os usuários interagem com o sistema e melhorar a experiência.</li>
        </ul>
        <p>
          A desativação de cookies essenciais nas configurações do navegador pode comprometer o
          funcionamento da plataforma.
        </p>
      </section>

      <section id="menores">
        <h2>8. Menores de idade</h2>
        <p>
          A plataforma é destinada exclusivamente a pessoas jurídicas e usuários maiores de 18
          anos. Não coletamos intencionalmente dados de menores. Caso identifique uso indevido,
          entre em contato imediatamente.
        </p>
      </section>

      <section id="alteracoes">
        <h2>9. Alterações desta política</h2>
        <p>
          Podemos atualizar esta Política periodicamente. Notificaremos sobre alterações
          relevantes por e-mail ou aviso na plataforma com antecedência mínima de 15 dias.
        </p>
        <p>
          O uso continuado da plataforma após as alterações implica aceitação da nova versão.
        </p>
      </section>

      <section id="contato">
        <h2>10. Contato e encarregado de dados (DPO)</h2>
        <p>Para dúvidas ou exercício dos seus direitos, entre em contato:</p>
        <ul>
          <li><strong>E-mail:</strong> privacidade@uyemura.tech</li>
          <li><strong>Endereço:</strong> conforme cadastro da empresa na plataforma</li>
          <li><strong>Autoridade Nacional de Proteção de Dados (ANPD):</strong> www.gov.br/anpd</li>
        </ul>
        <div className="highlight-box">
          <p>
            Respondemos a todas as solicitações em até <strong>15 dias úteis</strong>, conforme
            prazo estabelecido pela LGPD.
          </p>
        </div>
      </section>

    </LegalLayout>
  );
}
