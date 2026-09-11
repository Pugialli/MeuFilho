# MeuFilho App

App para acompanhamento de **gestação e desenvolvimento do bebê**, compartilhado entre dois responsáveis.

---

## Equipe

| Papel | Nome |
|---|---|
| Desenvolvimento | João Paulo Pugialli da Silva Souza |

---

## Sobre o projeto

Aplicação web Next.js para o MeuFilho, permitindo que dois responsáveis (pai, mãe ou qualquer combinação) acompanhem juntos a gestação e o crescimento do bebê.

- **Autenticação** com JWT (access token + refresh token) — renovação automática via interceptor Axios
- **Filhos compartilhados** via código de convite — o segundo responsável entra com o código e passa a ter acesso completo
- **Medições independentes** — peso, altura e BPM são registros separados, cada um com data própria

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 + App Router (TypeScript) |
| Estilização | Tailwind CSS v4 |
| Estado e cache | TanStack Query v5 |
| Formulários | React Hook Form v7 + Zod v3 + @hookform/resolvers |
| HTTP | Axios (interceptor de refresh token automático) |
| Armazenamento | Cookies (`access_token` regular + `refresh_token` httpOnly) + localStorage (user) |
| Ícones | lucide-react |
| Deploy | Vercel |
| Package manager | pnpm |
| Runtime | Node.js 22+ |

---

## Requisitos

- Node.js 20+
- pnpm

---

## Variáveis de ambiente

Crie um arquivo `.env.local` dentro de `web/` com:

```env
NEXT_PUBLIC_API_URL=https://meu-filho-api.vercel.app
```

---

## Instalação e uso

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000`.

> **Nota:** Turbopack requer bindings nativos (`@next/swc-*`). O script `dev` já inclui `--webpack` como fallback para ambientes sem esses bindings.

---

## Páginas

| Rota | Descrição |
|---|---|
| `/login` | Autenticação com email e senha |
| `/signup` | Criação de conta com nome, email, senha e papel (Pai / Mãe) |
| `/` | Lista todos os filhos; edição inline de nome, sexo e data prevista; adicionar novo bebê ou entrar com código |
| `/registrar` | Formulário de medição — peso (g), altura (cm) e BPM com seletor de data |
| `/historico` | Lista de medições agrupadas por data, filtros por tipo e botão de recarregar |

---

## Estrutura de pastas

```
web/
├── app/
│   ├── layout.tsx              # Root layout + Inter + Providers
│   ├── page.tsx                # / (home, protegida)
│   ├── registrar/page.tsx
│   ├── historico/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── actions/
│   │   └── auth.ts             # Server actions: getSession, requireAuth, logUserOut
│   └── api/auth/
│       ├── set-tokens/route.ts     # POST — persiste tokens em cookies
│       ├── clear-tokens/route.ts   # POST — invalida refresh token e apaga cookies
│       └── refresh-token/route.ts  # GET — renova access token server-side
├── middleware.ts               # Protege rotas; redireciona para /login sem cookie
├── components/
│   ├── AppShell.tsx            # Header + bottom nav
│   ├── Providers.tsx           # QueryClient + AuthProvider
│   └── pages/                  # Lógica das páginas
│       ├── HomePage.tsx
│       ├── RecordPage.tsx
│       └── HistoryPage.tsx
├── context/
│   └── AuthContext.tsx         # login / signup / logout
├── hooks/
│   ├── useChild.ts             # useChildren, useCreateChild, useUpdateChild, useJoinChild
│   └── useMeasurements.ts      # useMeasurements, useAddMeasurement, useDeleteMeasurement
├── lib/
│   ├── api.ts                  # Axios + interceptor de refresh token
│   ├── storage.ts              # Cookie helpers + user em localStorage
│   └── utils.ts                # formatDate, toLocalDateString, extractApiError
└── types/
    └── index.ts                # User, Child, Measurement, Role, Sex, MeasurementType
```

---

## Versionamento

Este projeto segue o padrão **Semantic Versioning (semver)**: `MAJOR.MINOR.PATCH`

- **MAJOR** — mudanças que quebram compatibilidade (breaking changes, grandes migrações)
- **MINOR** — novas funcionalidades sem quebrar o que existe
- **PATCH** — correções de bugs e ajustes menores

---

> Para o histórico completo de alterações, consulte o [CHANGELOG.md](./CHANGELOG.md).
