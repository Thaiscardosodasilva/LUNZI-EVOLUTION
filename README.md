# Lunzi Evolution 2026 — Plataforma de Hábitos

Stack: **Next.js 14** + **Asaas** para pagamentos + **iron-session** para autenticação.

---

## 🚀 Deploy na Vercel (passo a passo)

### 1. Preparar o repositório

```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit"
```

Suba para um repositório no GitHub (pode ser privado).

---

### 2. Variáveis de ambiente na Vercel

No painel da Vercel → seu projeto → **Settings → Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `ASAAS_API_KEY` | Seu token do Asaas (começa com `$aact_...`) |
| `ASAAS_ENV` | `sandbox` para testes ou `production` para produção |
| `SESSION_SECRET` | String aleatória longa (mín. 32 chars) — [gere aqui](https://generate-secret.vercel.app/32) |
| `NEXT_PUBLIC_SITE_URL` | URL do seu site (ex: `https://lunzi.vercel.app`) |

> ⚠️ **Nunca** commite o `.env.local` com valores reais. O `.env.local` é só para desenvolvimento local.

---

### 3. Configurar webhook no Asaas

1. Acesse o painel Asaas → **Configurações → Notificações / Webhooks**
2. Adicione a URL:
   ```
   https://SEU-SITE.vercel.app/api/webhook/asaas
   ```
3. Selecione os eventos:
   - `PAYMENT_RECEIVED`
   - `PAYMENT_CONFIRMED`
   - `PAYMENT_OVERDUE`
   - `PAYMENT_DELETED`
   - `PAYMENT_REFUNDED`
   - `SUBSCRIPTION_DELETED`
   - `PAYMENT_CHARGEBACK_REQUESTED`

---

### 4. Banco de dados em produção

O projeto usa um arquivo JSON local (`.lunzi-db.json`) que funciona em **desenvolvimento local**.

Na **Vercel**, o sistema de arquivos é efêmero (reinicia a cada deploy). Para produção, substitua `lib/db.js` por um banco real:

#### Opção recomendada: Vercel KV (Redis)

```bash
# Instale o pacote
npm install @vercel/kv
```

Substitua as funções em `lib/db.js` usando `@vercel/kv`:
```js
import { kv } from '@vercel/kv'
// Em vez de readDB()/writeDB(), use:
// await kv.get('users') e await kv.set('users', data)
```

#### Outras opções
- **PlanetScale** (MySQL serverless)
- **Supabase** (Postgres)
- **MongoDB Atlas**

---

### 5. Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

Para testar pagamentos localmente, use o [ngrok](https://ngrok.com/) para expor seu localhost e configure o webhook do Asaas para apontar para o túnel ngrok.

---

## 📁 Estrutura do projeto

```
lunzi-app/
├── lib/
│   ├── asaas.js          # Cliente Asaas (BACKEND ONLY - nunca vai ao browser)
│   ├── db.js             # Banco de dados (JSON local / substituir em produção)
│   ├── session.js        # Configuração de sessão com iron-session
│   └── hash.js           # Hash de senhas
├── pages/
│   ├── index.js          # Landing Page com pricing
│   ├── login.js          # Tela de login e cadastro
│   ├── app.js            # Plataforma de hábitos (protegida)
│   ├── pagamento-pendente.js  # Polling pós-pagamento
│   └── api/
│       ├── auth/
│       │   ├── login.js      # POST /api/auth/login
│       │   ├── register.js   # POST /api/auth/register
│       │   ├── logout.js     # POST /api/auth/logout
│       │   └── me.js         # GET /api/auth/me
│       ├── payment/
│       │   ├── checkout.js   # POST /api/payment/checkout
│       │   └── status.js     # GET /api/payment/status
│       └── webhook/
│           └── asaas.js      # POST /api/webhook/asaas
```

---

## 💳 Fluxo de pagamento

```
Usuário clica "Assinar"
    ↓
POST /api/payment/checkout (backend cria cliente + assinatura/cobrança no Asaas)
    ↓
Retorna checkoutUrl (link do Asaas)
    ↓
Abre checkout em nova aba → usuário paga
Redireciona para /pagamento-pendente (polling a cada 3s)
    ↓
Asaas chama POST /api/webhook/asaas com PAYMENT_CONFIRMED
    ↓
Webhook atualiza user.accessStatus = 'active'
    ↓
Polling detecta acesso ativo → redireciona para /app
```

---

## 🔒 Segurança

- `ASAAS_API_KEY` está **somente** em `lib/asaas.js` que é server-side
- Senhas hasheadas antes de salvar
- Sessão criptografada via `iron-session` (cookie httpOnly)
- Área `/app` verifica sessão + `accessStatus === 'active'` a cada carregamento
- Webhook não requer token secreto adicional (o Asaas envia o `access_token` no header — pode adicionar validação extra se quiser)

---

## ⚙️ Planos configurados

| Plano | Valor | Tipo | Cobranças |
|---|---|---|---|
| Mensal | R$24,90 | Assinatura recorrente | 12x (mensal) |
| Anual | R$99,90 | Cobrança única | 1x |

Para alterar valores, edite `lib/asaas.js`:
- `createMonthlySubscription()` → campo `value`
- `createAnnualCharge()` → campo `value`
