# Uyemura Tech — Landing Page

## Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Shadcn/ui
- Fontes: Syne (display/títulos) + DM Sans (corpo)

---

## Setup Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Instalar componentes Shadcn usados

```bash
npx shadcn@latest init
npx shadcn@latest add button
```

### 3. Adicionar as imagens

Coloque as seguintes imagens em `public/images/`:

| Arquivo | Uso | Recomendação |
|---|---|---|
| `hero-dealership.jpg` | Background do Hero | 1920×1080px, concessionária com carros |
| `feature-fleet.jpg` | Seção "Digitalização" | 800×600px, frota colorida |
| `feature-sports-car.jpg` | Seção "Inventário" | 800×600px, carro esportivo em showroom |
| `cta-supercar.jpg` | Background CTA | 1920×1080px, supercarros |

> **Dica:** Use imagens do [Unsplash](https://unsplash.com/s/photos/car-dealership) — busque "car dealership showroom".

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

---

## Estrutura de Arquivos da Landing Page

```
src/
├── app/
│   ├── page.tsx                    # Página raiz (home)
│   ├── layout.tsx                  # Root layout com fontes
│   └── globals.css                 # Tailwind + CSS variables + animações
│
└── components/
    └── features/
        └── landing/
            ├── navbar.tsx           # Navbar fixa (Server Component)
            ├── navbar-mobile.tsx    # Menu mobile (Client Component)
            ├── hero-section.tsx     # Seção hero com imagem de fundo
            ├── features-section.tsx # Seções alternadas de features
            ├── why-choose-section.tsx # 3 cards de diferenciais
            ├── cta-section.tsx      # Call-to-action com imagem de fundo
            └── footer.tsx           # Rodapé com links e redes sociais
```

---

## Decisões de Arquitetura

- **Server Components por padrão**: todos os componentes da landing são Server Components, exceto `navbar-mobile.tsx` que usa `useState` para o menu toggle.
- **Fontes via `next/font/google`**: carregadas no layout raiz, sem FOUT (flash de texto sem fonte).
- **`next/image`**: todas as imagens usam o componente `Image` do Next.js para otimização automática (WebP, lazy loading, sizes).
- **Sem estado global**: a landing page não requer gerenciamento de estado — tudo é estático.
- **Acessibilidade**: `aria-label` nos botões de ícone, `alt` em todas as imagens, semântica HTML correta.

---

## Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `brand-black` | `#0a0a0a` | Navbar, footer, textos |
| `brand-accent` | `#e8f015` | Detalhes de destaque (amarelo elétrico) |
| `brand-gray-soft` | `#f5f5f3` | Background de seções alternadas |
| `brand-gray-text` | `#6b6b66` | Textos secundários |

---

## Próximos Passos

Depois da landing, os próximos módulos a desenvolver conforme o guia:

1. `(auth)/login` — tela de login com Supabase Auth
2. `(auth)/cadastro` — onboarding de nova empresa
3. `(dashboard)/veiculos` — listagem e cadastro de veículos
4. `(dashboard)/usuarios` — gestão de usuários
