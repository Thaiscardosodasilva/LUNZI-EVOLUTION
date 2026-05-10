// lib/asaas.js — cliente Asaas SOMENTE para uso no backend (API Routes)
// A ASAAS_API_KEY NUNCA chega ao browser

const BASE_URL =
  process.env.ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3'

async function asaasRequest(method, path, body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      access_token: process.env.ASAAS_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()

  if (!res.ok) {
    const msg = data?.errors?.[0]?.description || `Asaas error ${res.status}`
    throw new Error(msg)
  }

  return data
}

// ── CLIENTES ──────────────────────────────────────

/** Busca cliente pelo CPF/email ou cria um novo */
export async function findOrCreateCustomer({ name, email, cpfCnpj, phone }) {
  // tenta buscar pelo email
  const search = await asaasRequest('GET', `/customers?email=${encodeURIComponent(email)}&limit=1`)
  if (search.data?.length > 0) return search.data[0]

  // cria novo
  return asaasRequest('POST', '/customers', {
    name,
    email,
    cpfCnpj: cpfCnpj || undefined,
    mobilePhone: phone || undefined,
    notificationDisabled: false,
  })
}

// ── ASSINATURAS (plano mensal recorrente) ─────────

/**
 * Cria assinatura mensal de R$24,90
 * cycle: MONTHLY, maxInstallmentCount: 12
 */
export async function createMonthlySubscription(customerId) {
  const today = new Date()
  const nextBillingDate = today.toISOString().split('T')[0] // hoje mesmo

  return asaasRequest('POST', '/subscriptions', {
    customer: customerId,
    billingType: 'CREDIT_CARD', // será override pelo checkout
    cycle: 'MONTHLY',
    value: 24.9,
    nextDueDate: nextBillingDate,
    maxPayments: 12,
    description: 'Lunzi Evolution — Plano Mensal 12x R$24,90',
    externalReference: `lunzi_monthly_${customerId}`,
  })
}

// ── COBRANÇA ÚNICA (plano anual) ──────────────────

/** Cria cobrança única de R$99,90 */
export async function createAnnualCharge(customerId) {
  const today = new Date()
  const dueDate = today.toISOString().split('T')[0]

  return asaasRequest('POST', '/payments', {
    customer: customerId,
    billingType: 'UNDEFINED', // cliente escolhe no checkout
    value: 99.9,
    dueDate,
    description: 'Lunzi Evolution — Plano Anual R$99,90',
    externalReference: `lunzi_annual_${customerId}`,
  })
}

// ── LINKS DE CHECKOUT ─────────────────────────────

/** Retorna o link de checkout do Asaas para um pagamento */
export async function getPaymentCheckoutUrl(paymentId) {
  const data = await asaasRequest('GET', `/payments/${paymentId}/identificationField`)
  // O Asaas retorna invoiceUrl no objeto do pagamento
  const payment = await asaasRequest('GET', `/payments/${paymentId}`)
  return payment.invoiceUrl || payment.bankSlipUrl || null
}

/** Retorna o link de checkout da assinatura (primeira cobrança) */
export async function getSubscriptionFirstPaymentUrl(subscriptionId) {
  const payments = await asaasRequest('GET', `/subscriptions/${subscriptionId}/payments?limit=1`)
  const first = payments.data?.[0]
  if (!first) return null
  const payment = await asaasRequest('GET', `/payments/${first.id}`)
  return payment.invoiceUrl || null
}

// ── STATUS ────────────────────────────────────────

export async function getSubscriptionStatus(subscriptionId) {
  const sub = await asaasRequest('GET', `/subscriptions/${subscriptionId}`)
  return sub.status // ACTIVE | INACTIVE | EXPIRED
}

export async function getPaymentStatus(paymentId) {
  const p = await asaasRequest('GET', `/payments/${paymentId}`)
  return p.status // PENDING | RECEIVED | CONFIRMED | OVERDUE | REFUNDED | CANCELLED
}
