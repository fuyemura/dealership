# Guia de Boas Práticas: Frontend Web com Next.js, TypeScript, Tailwind CSS e Shadcn/ui

> Stack: **TypeScript · Next.js 14+ (App Router) · React · Tailwind CSS · Shadcn/ui · Supabase · Vercel**

---

## Sumário

1. [Estrutura de Pastas](#1-estrutura-de-pastas)
2. [Configuração Inicial do Projeto](#2-configuração-inicial-do-projeto)
3. [Configuração do Supabase](#3-configuração-do-supabase)
4. [Tipagem com TypeScript](#4-tipagem-com-typescript)
5. [Arquitetura de Componentes](#5-arquitetura-de-componentes)
6. [Server Components vs Client Components](#6-server-components-vs-client-components)
7. [Camada de Dados (Data Layer)](#7-camada-de-dados-data-layer)
8. [Autenticação e Autorização](#8-autenticação-e-autorização)
9. [Formulários e Validação](#9-formulários-e-validação)
10. [Estilização com Tailwind CSS e Shadcn/ui](#10-estilização-com-tailwind-css-e-shadcnui)
11. [Gerenciamento de Estado](#11-gerenciamento-de-estado)
12. [Tratamento de Erros](#12-tratamento-de-erros)
13. [Variáveis de Ambiente](#13-variáveis-de-ambiente)
14. [Deploy na Vercel](#14-deploy-na-vercel)
15. [Checklist de Início de Projeto](#15-checklist-de-início-de-projeto)

---

## 1. Estrutura de Pastas

Adote uma estrutura orientada a **domínio/feature**, não por tipo de arquivo. Isso escala melhor conforme o projeto cresce.

```
src/
├── app/                          # App Router do Next.js
│   ├── (auth)/                   # Route Group: rotas de autenticação
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route Group: rotas protegidas
│   │   ├── layout.tsx
│   │   ├── veiculos/
│   │   │   ├── page.tsx          # Listagem
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Detalhe
│   │   │   └── novo/
│   │   │       └── page.tsx      # Criação
│   │   ├── usuarios/
│   │   └── empresa/
│   ├── api/                      # Route Handlers (API Routes)
│   │   └── webhooks/
│   ├── globals.css
│   ├── layout.tsx                # Root Layout
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # Componentes Shadcn/ui (gerados automaticamente)
│   ├── shared/                   # Componentes genéricos reutilizáveis
│   │   ├── data-table/
│   │   ├── page-header/
│   │   └── loading-spinner/
│   └── features/                 # Componentes por domínio de negócio
│       ├── veiculos/
│       │   ├── veiculo-card.tsx
│       │   ├── veiculo-form.tsx
│       │   └── veiculo-foto-upload.tsx
│       ├── usuarios/
│       └── empresa/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase Browser Client
│   │   ├── server.ts             # Supabase Server Client
│   │   └── middleware.ts         # Supabase Middleware Client
│   ├── validations/              # Schemas Zod
│   │   ├── veiculo.ts
│   │   └── usuario.ts
│   └── utils.ts                  # Utilitários gerais (cn, formatters, etc.)
│
├── hooks/                        # Custom React Hooks
│   ├── use-veiculos.ts
│   └── use-auth.ts
│
├── actions/                      # Server Actions do Next.js
│   ├── veiculo.actions.ts
│   ├── usuario.actions.ts
│   └── empresa.actions.ts
│
├── types/
│   ├── database.types.ts         # Tipos gerados pelo Supabase CLI
│   ├── domain.types.ts           # Tipos de domínio da aplicação
│   └── index.ts
│
└── middleware.ts                 # Middleware do Next.js (auth guard)
```

**Regras:**
- Nunca importe componentes de `features/` dentro de outro módulo `features/` diferente — crie um componente `shared/` se necessário.
- Arquivos de teste ficam junto ao arquivo testado: `veiculo-card.test.tsx`.

---

## 2. Configuração Inicial do Projeto

### Criando o projeto

```bash
npx create-next-app@latest dealership-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

### Instalando dependências essenciais

```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Shadcn/ui (inicialização)
npx shadcn@latest init

# Validação
npm install zod

# Formulários
npm install react-hook-form @hookform/resolvers

# Utilitários de data
npm install date-fns

# Ícones (já incluído com Shadcn, mas confirme)
npm install lucide-react

# Variáveis de ambiente com tipagem
npm install -D @t3-oss/env-nextjs
```

### `tsconfig.json` — configurações recomendadas

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

> **`noUncheckedIndexedAccess: true`** força você a tratar `undefined` ao acessar arrays e objetos indexados — evita muitos bugs em runtime.

---

## 3. Configuração do Supabase

### Gerando os tipos TypeScript a partir do banco

Instale o Supabase CLI e execute:

```bash
npx supabase gen types typescript \
  --project-id SEU_PROJECT_ID \
  --schema dealership \
  > src/types/database.types.ts
```

Adicione isso como script no `package.json`:

```json
{
  "scripts": {
    "db:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema dealership > src/types/database.types.ts"
  }
}
```

> **Execute este comando sempre que alterar o schema do banco.** Os tipos gerados refletem exatamente as tabelas do Supabase, incluindo o schema `dealership`.

### Clientes Supabase (padrão SSR)

**`src/lib/supabase/server.ts`** — usado em Server Components, Server Actions e Route Handlers:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**`src/lib/supabase/client.ts`** — usado em Client Components:

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 4. Tipagem com TypeScript

### Tipos de domínio baseados no banco

Com os tipos gerados pelo Supabase CLI, crie aliases de domínio mais ergonômicos:

**`src/types/domain.types.ts`**

```typescript
import type { Database } from './database.types'

// Aliases de tabelas
type Tables = Database['dealership']['Tables']

export type Empresa    = Tables['empresa']['Row']
export type Usuario    = Tables['usuario']['Row']
export type Veiculo    = Tables['veiculo']['Row']
export type VeiculoFoto = Tables['veiculo_foto']['Row']
export type Localizacao = Tables['localizacao']['Row']
export type Dominio    = Tables['dominio']['Row']
export type QrCode     = Tables['qr_code']['Row']

// Tipos para Insert e Update
export type VeiculoInsert = Tables['veiculo']['Insert']
export type VeiculoUpdate = Tables['veiculo']['Update']
export type UsuarioInsert = Tables['usuario']['Insert']

// Tipos compostos para queries com joins
export type VeiculoComDetalhes = Veiculo & {
  marca: Pick<Dominio, 'id' | 'nome_dominio'>
  modelo: Pick<Dominio, 'id' | 'nome_dominio'>
  combustivel: Pick<Dominio, 'id' | 'nome_dominio'>
  cambio: Pick<Dominio, 'id' | 'nome_dominio'>
  situacao: Pick<Dominio, 'id' | 'nome_dominio'>
  fotos: VeiculoFoto[]
}
```

### Grupos de domínios (tabela `dominio`)

A tabela `dominio` centraliza enumerações do sistema. Defina constantes TypeScript para os grupos:

```typescript
// src/types/domain.types.ts
export const GRUPO_DOMINIO = {
  MARCA_VEICULO:      'MARCA_VEICULO',
  MODELO_VEICULO:     'MODELO_VEICULO',
  COMBUSTIVEL:        'COMBUSTIVEL',
  CAMBIO:             'CAMBIO',
  SITUACAO_VEICULO:   'SITUACAO_VEICULO',
  PAPEL_USUARIO:      'PAPEL_USUARIO',
} as const

export type GrupoDominio = typeof GRUPO_DOMINIO[keyof typeof GRUPO_DOMINIO]
```

---

## 5. Arquitetura de Componentes

### Princípio de responsabilidade única

Separe **lógica de dados** de **lógica de apresentação**:

```
VeiculoListPage (Server Component)   → busca dados no servidor
  └── VeiculoListClient (Client Component) → gerencia estado de UI (filtros, paginação)
        └── VeiculoCard (shared)            → apenas renderiza
```

### Convenções de nomenclatura

| Tipo | Exemplo |
|---|---|
| Server Component (padrão) | `veiculo-list.tsx` |
| Client Component | `veiculo-list-client.tsx` ou adicione `"use client"` no topo |
| Server Action | `veiculo.actions.ts` |
| Hook customizado | `use-veiculos.ts` |
| Schema Zod | `veiculo.schema.ts` |

---

## 6. Server Components vs Client Components

Esta é a decisão mais importante do App Router. Siga esta regra:

> **Tudo é Server Component por padrão. Adicione `"use client"` somente quando necessário.**

### Use Server Component quando:
- Buscar dados do banco/API
- Acessar variáveis de ambiente secretas
- Renderizar conteúdo sem interatividade

### Use Client Component quando:
- Precisar de `useState`, `useEffect`, `useReducer`
- Usar event handlers (`onClick`, `onChange`)
- Usar APIs do browser (`localStorage`, `window`)
- Usar componentes que exigem `"use client"` (Shadcn Dialog, etc.)

### Padrão recomendado: "Push client down"

```tsx
// app/(dashboard)/veiculos/page.tsx — SERVER COMPONENT
import { createClient } from '@/lib/supabase/server'
import { VeiculoListClient } from '@/components/features/veiculos/veiculo-list-client'
import type { VeiculoComDetalhes } from '@/types/domain.types'

export default async function VeiculosPage() {
  const supabase = createClient()
  const { data: veiculos } = await supabase
    .from('veiculo')
    .select(`
      *,
      marca:marca_veiculo_id(id, nome_dominio),
      modelo:modelo_veiculo_id(id, nome_dominio),
      fotos:veiculo_foto(*)
    `)

  return <VeiculoListClient veiculos={veiculos ?? []} />
}
```

```tsx
// components/features/veiculos/veiculo-list-client.tsx — CLIENT COMPONENT
"use client"

import { useState } from 'react'
import type { VeiculoComDetalhes } from '@/types/domain.types'

interface Props {
  veiculos: VeiculoComDetalhes[]
}

export function VeiculoListClient({ veiculos }: Props) {
  const [filtro, setFiltro] = useState('')
  // lógica de filtro, ordenação, etc.
}
```

---

## 7. Camada de Dados (Data Layer)

### Use Server Actions para mutações

Server Actions eliminam a necessidade de criar Route Handlers para operações CRUD:

**`src/actions/veiculo.actions.ts`**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { veiculoSchema } from '@/lib/validations/veiculo'
import type { VeiculoInsert } from '@/types/domain.types'

export async function criarVeiculo(formData: FormData) {
  const supabase = createClient()

  // 1. Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Validar dados com Zod
  const rawData = Object.fromEntries(formData)
  const parsed = veiculoSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // 3. Inserir no banco
  const { error } = await supabase
    .from('veiculo')
    .insert(parsed.data as VeiculoInsert)

  if (error) return { error: error.message }

  // 4. Revalidar cache e redirecionar
  revalidatePath('/veiculos')
  redirect('/veiculos')
}
```

### Queries com tipagem segura

Sempre desestruture o resultado e trate o erro:

```typescript
const { data, error } = await supabase
  .from('veiculo')
  .select('*')
  .eq('empresa_id', empresaId)

if (error) throw new Error(`Erro ao buscar veículos: ${error.message}`)
```

---

## 8. Autenticação e Autorização

### Middleware de proteção de rotas

**`src/middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redireciona para login se não autenticado em rota protegida
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)'],
}
```

### Controle de acesso por papel (`papel_id`)

Crie um hook/utility para verificar permissões, baseado nos grupos de domínio:

```typescript
// src/lib/auth/permissions.ts
import type { Usuario } from '@/types/domain.types'

// IDs devem ser buscados do banco na inicialização ou via constante
export function podeGerenciarUsuarios(usuario: Usuario, papeis: Record<string, string>): boolean {
  return usuario.papel_id === papeis['ADMINISTRADOR']
}
```

---

## 9. Formulários e Validação

### Schema Zod espelhando o banco

**`src/lib/validations/veiculo.ts`**

```typescript
import { z } from 'zod'

export const veiculoSchema = z.object({
  placa: z.string().min(7).max(10),
  renavam: z.string().length(11, 'RENAVAM deve ter 11 caracteres'),
  numero_chassi: z.string().min(17).max(20),
  ano_modelo: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  ano_fabricacao: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  cor_veiculo: z.string().min(2).max(20),
  quilometragem: z.coerce.number().min(0),
  preco_venda_veiculo: z.coerce.number().positive('Preço deve ser positivo'),
  descricao: z.string().max(1000),
  marca_veiculo_id: z.string().uuid(),
  modelo_veiculo_id: z.string().uuid(),
  combustivel_veiculo_id: z.string().uuid(),
  cambio_veiculo_id: z.string().uuid(),
})

export type VeiculoFormData = z.infer<typeof veiculoSchema>
```

### Formulário com React Hook Form + Shadcn

```tsx
"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { veiculoSchema, type VeiculoFormData } from '@/lib/validations/veiculo'
import { criarVeiculo } from '@/actions/veiculo.actions'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function VeiculoForm() {
  const form = useForm<VeiculoFormData>({
    resolver: zodResolver(veiculoSchema),
  })

  async function onSubmit(data: VeiculoFormData) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, String(value))
    )
    const result = await criarVeiculo(formData)
    if (result?.error) {
      // tratar erros de servidor
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="placa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="ABC1D23" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar Veículo</Button>
      </form>
    </Form>
  )
}
```

---

## 10. Estilização com Tailwind CSS e Shadcn/ui

### Função `cn` para classes condicionais

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Instalando componentes Shadcn sob demanda

```bash
# Instale apenas o que usar
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add card
```

### Customização de tema

Configure as CSS variables no `globals.css` para o tema da aplicação antes de começar o desenvolvimento — mudar o tema depois gera retrabalho de UI.

### Evite inline styles e classes Tailwind longas nos templates

Extraia variantes de componente usando `cva` (Class Variance Authority):

```typescript
import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      situacao: {
        disponivel: 'bg-green-100 text-green-800',
        vendido:    'bg-gray-100 text-gray-800',
        reservado:  'bg-yellow-100 text-yellow-800',
      },
    },
  }
)
```

---

## 11. Gerenciamento de Estado

Para este tipo de aplicação (CRUD + autenticação), **evite bibliotecas de estado global** como Redux ou Zustand salvo necessidade comprovada.

### Hierarquia de estado recomendada

| Necessidade | Solução |
|---|---|
| Dados do servidor | Server Components + `revalidatePath` |
| Estado local de UI | `useState` / `useReducer` |
| Estado compartilhado entre rotas | URL Search Params (`useSearchParams`) |
| Cache de dados no cliente | React Query / SWR (se necessário) |
| Estado global simples | React Context |

### URL como estado — paginação e filtros

```tsx
// Filtros e paginação na URL permitem bookmark e compartilhamento
// /veiculos?marca=Toyota&situacao=disponivel&page=2

import { useRouter, useSearchParams } from 'next/navigation'

function FiltroVeiculos() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function atualizarFiltro(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/veiculos?${params.toString()}`)
  }
}
```

---

## 12. Tratamento de Erros

### Error Boundaries com `error.tsx`

```tsx
// app/(dashboard)/veiculos/error.tsx
"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function VeiculoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Algo deu errado</h2>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
```

### Loading States com `loading.tsx`

```tsx
// app/(dashboard)/veiculos/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function VeiculosLoading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  )
}
```

---

## 13. Variáveis de Ambiente

### Tipagem e validação com `@t3-oss/env-nextjs`

**`src/env.ts`**

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
})
```

> A build falhará se alguma variável obrigatória estiver ausente — evita surpresas em produção.

### `.env.local` (nunca versionar)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...   # apenas server-side
```

---

## 14. Deploy na Vercel

### Configuração do `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["gru1"]
}
```

> `gru1` = South America (São Paulo) — menor latência para usuários no Brasil.

### Checklist de deploy

- [ ] Todas as variáveis de ambiente configuradas no painel da Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada como variável de ambiente **não exposta ao cliente**
- [ ] Preview deployments conectados ao ambiente de staging do Supabase (use um projeto separado)
- [ ] Production deployment conectado ao projeto Supabase de produção
- [ ] Configurar domínio customizado se necessário

### Configuração de ambientes no Supabase

| Ambiente | Projeto Supabase | Branch Vercel |
|---|---|---|
| Development | `dealership-dev` | local |
| Preview | `dealership-staging` | PRs / branches |
| Production | `dealership-prod` | `main` |

---

## 15. Checklist de Início de Projeto

Execute esta lista antes de escrever qualquer funcionalidade de negócio:

### Infraestrutura
- [ ] Projeto criado com `create-next-app` (TypeScript + Tailwind + App Router + src/)
- [ ] Alias `@/*` configurado
- [ ] `strict: true` e `noUncheckedIndexedAccess: true` no `tsconfig.json`
- [ ] ESLint configurado com regras do Next.js

### Supabase
- [ ] Pacotes `@supabase/supabase-js` e `@supabase/ssr` instalados
- [ ] Clientes server e browser criados em `src/lib/supabase/`
- [ ] Tipos gerados com `supabase gen types` e salvos em `src/types/database.types.ts`
- [ ] Script `db:types` adicionado ao `package.json`
- [ ] Variáveis de ambiente configuradas e validadas

### Autenticação
- [ ] Middleware de proteção de rotas criado em `src/middleware.ts`
- [ ] Route Groups `(auth)` e `(dashboard)` criados
- [ ] Fluxo de login/logout testado

### UI
- [ ] `shadcn init` executado e tema configurado
- [ ] Função `cn` criada em `src/lib/utils.ts`
- [ ] Componentes base instalados: `button`, `input`, `form`, `card`, `table`, `dialog`

### Qualidade
- [ ] Prettier configurado
- [ ] Husky + lint-staged configurados (opcional mas recomendado)
- [ ] `.env.example` criado com todas as chaves necessárias (sem valores)
- [ ] `.env.local` adicionado ao `.gitignore`

---

## Referências

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase + Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Zod Documentation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)

---

*Guia gerado para o projeto Dealership — Schema: `dealership` no Supabase.*
