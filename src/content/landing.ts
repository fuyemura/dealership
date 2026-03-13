// Dados de conteúdo da landing page separados dos componentes de UI.
// Altere textos e imagens aqui sem tocar nos componentes.

export interface Feature {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reversed?: boolean;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: "git-branch" | "lightbulb" | "qr-code";
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export const FEATURES: Feature[] = [
  {
    id: "digitalizacao",
    tag: "Cadastro inteligente",
    title: "Digitalização rápida e inteligente",
    description:
      "Cadastre veículos em segundos usando a nossa tecnologia, gere QR Codes exclusivos e monitore todas as informações do seu estoque em tempo real.",
    image: "/images/veiculo-amarelo.webp",
    imageAlt: "Carro esportivo amarelo em showroom premium",
  },
  {
    id: "inventario",
    tag: "Gestão de estoque",
    title: "Controle total do seu inventário",
    description:
      "Transforme seu estoque em uma plataforma digital acessível, com QR Codes personalizados e métricas detalhadas para decisões mais ágeis.",
    image: "/images/frota-veiculos.webp",
    imageAlt: "Frota de veículos coloridos em uma concessionária moderna",
    reversed: true,
  },
];

export const BENEFITS: Benefit[] = [
  {
    id: "eficiencia",
    iconName: "git-branch",
    title: "Eficiência Encontra Inovação",
    description:
      "Automatize a apresentação dos seus produtos, economize tempo com cadastros e ofereça uma experiência moderna, rápida e intuitiva que destaca sua empresa da concorrência.",
  },
  {
    id: "vendas",
    iconName: "lightbulb",
    title: "Venda mais com menos esforço",
    description:
      "Inove sua operação com um sistema inteligente que conecta seus produtos ao público, 24 horas por dia, mesmo quando você estiver offline.",
  },
  {
    id: "solucoes",
    iconName: "qr-code",
    title: "Soluções Modernas",
    description:
      "A Uyemura Tech oferece um sistema completo de digitalização para veículos em estoque. Nosso principal serviço é a geração de QR Codes inteligentes, que levam o cliente direto para uma página com todos os dados do carro ou moto — sem precisar baixar apps.",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 49,99",
    period: "/mês",
    description: "Perfeito para pequenas revendas de veículos.",
    features: [
      "Até 50 veículos",
      "QR Codes básicos",
      "Dashboard simples",
      "Suporte por WhatsApp",
    ],
    cta: "Começar grátis",
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 99,99",
    period: "/mês",
    description: "Para revendas em crescimento que precisam de mais recursos.",
    features: [
      "Até 100 veículos",
      "QR Codes personalizados",
      "Dashboard avançado",
      "Suporte prioritário por WhatsApp",
    ],
    popular: true,
    cta: "Começar grátis",
  },
  {
    id: "empresarial",
    name: "Empresarial",
    price: "R$ 199,99",
    period: "/mês",
    description: "Para grandes operações sem limite de escala.",
    features: [
      "Veículos ilimitados",
      "QR Codes premium",
      "Dashboard completo com métricas",
      "Suporte dedicado",
    ],
    cta: "Começar grátis",
  },
];
