# Changelog

## [2.1.3] - 2026-09-11

### Fixed
- `useMeasurements.ts`: rota de DELETE corrigida de `/children/:id/measurements/:id` para `/measurements/:id` — a rota aninhada não existe na API, causando 404
- `lib/utils.ts`: `extractApiError` agora mapeia status HTTP para mensagens amigáveis em português (401, 403, 404, 409, 500) em vez de expor mensagens internas do servidor; validações 422 continuam mostrando o detalhe retornado pela API

---

## [2.1.2] - 2026-09-11

### Fixed
- `login/page.tsx` e `signup/page.tsx`: `method="post"` adicionado ao `<form>` — impede que o browser envie credenciais como query string na URL em submissões nativas (antes da hidratação React ou via autocomplete do browser)
- `AppShell.tsx`: layout migrado de `min-h-screen` + nav `fixed` para `h-dvh` + nav como filho do flex — corrige o nav que sumia no iOS Safari (onde `100vh` inclui a barra do browser); `pb-20` removido do `<main>`
- `AppShell.tsx`: padding do header aumentado de `px-4` para `px-6` — botão "Sair" não aparece mais colado na borda em telas estreitas
- `HistoryPage.tsx`: padding das tabs, botão "Atualizar" e lista aumentado de `px-4` para `px-6` — alinha com o header

---

## [2.1.1] - 2026-09-11

### Fixed
- `globals.css`: `cursor: pointer` adicionado globalmente para todos os elementos `button` — cursors de texto/seta não apareciam mais nos botões

---

## [2.1.0] - 2026-09-11

### Added
- `middleware.ts` — protege todas as rotas; redireciona para `/login` se não houver nenhum cookie de autenticação
- Route Handlers de auth:
  - `POST /api/auth/set-tokens` — recebe `accessToken` + `refreshToken` e os persiste como cookies
  - `POST /api/auth/clear-tokens` — invalida o refresh token na API e apaga ambos os cookies
  - `GET /api/auth/refresh-token` — lê o cookie httpOnly, renova com a API Fastify, atualiza cookies e devolve o novo access token
- Server actions (`app/actions/auth.ts`): `getSession`, `requireAuth`, `logUserOut` para uso em Server Components

### Changed
- `refresh_token` agora armazenado em cookie **httpOnly** (inacessível ao JS do browser — proteção contra XSS)
- `access_token` agora em cookie regular com `SameSite=Lax` — lido pelo Axios via `document.cookie` e pelo middleware server-side
- `lib/storage.ts` simplificado: removidos `saveTokens`, `getRefreshToken`; `getAccessToken` lê de `document.cookie`
- `lib/api.ts`: interceptor de refresh agora chama `/api/auth/refresh-token` em vez de chamar a API Fastify diretamente
- `AuthContext.tsx`: login e signup chamam `/api/auth/set-tokens` após autenticar; logout chama `/api/auth/clear-tokens`
- `package.json`: script `build` agora inclui `--webpack` — necessário no ambiente Windows sem bindings nativos do SWC

### Removed
- `storage.saveTokens` e `storage.getRefreshToken` — tokens não são mais armazenados em localStorage

---

## [2.0.0] - 2026-09-11

**Reescrita completa como aplicação web e deploy**
- Substituição do app React Native / Expo por Next.js 16 com App Router
- Tailwind CSS v4 com design system via `@theme` (variáveis CSS: primary, background, surface, text, error…)
- Fonte Inter via `next/font/google`

**Autenticação**
- `AuthContext` com login, signup e logout usando a mesma API existente
- Tokens armazenados em `localStorage`; interceptor Axios faz refresh automático em 401
- Auth guard client-side no `AppShell` — redireciona para `/login` se não autenticado

**Páginas**
- `/login` e `/signup`: formulários com React Hook Form + Zod, toggle de senha, chips de papel (Pai / Mãe), autocomplete adequado
- `/` (Home): cards de filhos com edição inline (nome, sexo, data prevista), badge de sexo, lista de responsáveis, modal de convite com Web Share API + fallback de copiar
- Estado vazio com fluxo de criar perfil ou entrar com código de convite
- `/registrar`: seletor de tipo (chips Peso / Altura / BPM), campo numérico, date picker nativo, feedback de sucesso inline
- `/historico`: abas de filtro, medições agrupadas por data (mais recente primeiro), delete com confirmação inline, botão de recarregar

**Infraestrutura**
- Layout responsivo centralizado (max-width 480px em auth, 680px nas telas do app)
- Bottom navigation fixo com `AppShell`
- Deploy na Vercel com detecção automática de Next.js
- `pnpm-lock.yaml` como lockfile oficial

---

## Versões anteriores (React Native / Expo)

As versões abaixo descrevem o histórico do app original em React Native antes da migração para Next.js.

---

### [1.3.0] - 2026-09-11

**Código de convite em modal**
- Removido do card principal; substituído por botão discreto "Convidar parceiro(a)"
- Modal centralizado com código em destaque e botão de compartilhar

**Largura máxima responsiva**
- Auth screens (Login/Signup): conteúdo limitado a 480px e centralizado
- Telas do app (Bebê, Registrar, Histórico): conteúdo limitado a 560–680px

**Date picker multiplataforma**
- Componente `DateField` criado em `src/components/DateField.tsx`
- Web: `TouchableOpacity` chama `el.showPicker()` (ou `el.click()` como fallback) via ref — abre o seletor nativo do browser

**Formulário de edição do bebê**
- Chips de sexo agora se expandem corretamente (`childCardEdit: { alignItems: stretch }`)

**Safe area no Safari (iOS web)**
- `SafeAreaProvider` adicionado em App.tsx — corrige sobreposição da barra do browser

---

### [1.2.0] - 2026-09-11

**Múltiplos filhos**
- Home exibe todos os filhos cadastrados em cards individuais
- Botão "Adicionar outro bebê" para criar ou entrar com código

**Edição de perfil do bebê**
- Botão de lápis em cada card abre edição inline (nome, sexo, data prevista)
- Novo hook `useUpdateChild` — chama `PATCH /children/:id`

**Campo de sexo**
- Tipo `Sex` adicionado (`MALE` / `FEMALE` / `UNKNOWN`)
- Componente `SexSelector` — chips Menino / Menina / Não definido

---

### [1.1.0] - 2026-09-11

**Ícones**
- Todos os emojis substituídos por ícones vetoriais `lucide-react-native`

**Tela Registrar**
- Redesenhada com seletor de tipo (Peso / Altura / BPM)
- Seletor de data em estilo calendário

**Correções**
- `dueDate` agora envia ISO datetime completo
- Histórico: cabeçalho de data corrigido para lidar com ISO datetime completo
- DateTimePicker: `onChange` substituído por `onValueChange` + `onDismiss`

---

### [1.0.8] - 2026-09-11

- `@expo/vector-icons` adicionado explicitamente às dependências

---

### [1.0.7] - 2026-09-11

- `@expo/ngrok` removido das devDependencies

---

### [1.0.6] - 2026-09-11

- Scripts `start`, `android` e `ios` voltaram para `expo start` puro

---

### [1.0.5] - 2026-09-11

- `@expo/ngrok@4.1.0` descontinuado; migração para ngrok v3 standalone com `--lan`

---

### [1.0.4] - 2026-09-11

- `.env.example` removido

---

### [1.0.3] - 2026-09-11

- `EXPO_PUBLIC_API_URL` atualizado para `https://meu-filho-api.vercel.app`
- Toggle de visibilidade nos campos de senha

---

### [1.0.2] - 2026-09-11

- `@expo/ngrok@4.1.0` adicionado para modo tunnel com pnpm

---

### [1.0.1] - 2026-09-11

- Migração do package manager de npm para pnpm

---

### [1.0.0] - 2026-09-11

- Setup inicial com Expo 57, React Native 0.86 e TypeScript
- Autenticação completa: signup, login, logout e refresh token automático via interceptor Axios
- Fluxo de filhos: criar perfil, gerar código de convite e entrar com código
- Registro de medições independentes (peso, altura, BPM) com seletor de data
- Histórico agrupado por data com filtros por tipo
- Design em tons pastéis verdes; navegação com React Navigation 7
