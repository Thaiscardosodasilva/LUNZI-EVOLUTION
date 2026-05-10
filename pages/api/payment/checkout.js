// pages/api/payment/checkout.js
// BACKEND ONLY — ASAAS_API_KEY nunca vai ao frontend

import { getSession } from '../../../lib/session'
import { getUserByUsername, saveUser } from '../../../lib/db'
import {
  findOrCreateCustomer,
  createMonthlySubscription,
  createAnnualCharge,
  getSubscriptionFirstPaymentUrl,
  getPaymentCheckoutUrl,
} from '../../../lib/asaas'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // 1. Autenticação obrigatória
  const session = await getSession(req, res)
  if (!session?.userId) {
    return res.status(401).json({ error: 'Faça login antes de assinar.' })
  }

  const { plan } = req.body // 'monthly' | 'annual'
  if (!['monthly', 'annual'].includes(plan)) {
    return res.status(400).json({ error: 'Plano inválido.' })
  }

  const user = getUserByUsername(session.username)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })

  try {
    // 2. Criar ou recuperar cliente no Asaas
    const customer = await findOrCreateCustomer({
      name: user.name,
      email: user.email,
    })
    const asaasCustomerId = customer.id

    let checkoutUrl = null
    let asaasSubscriptionId = null
    let asaasPaymentId = null

    // 3a. Plano mensal — assinatura recorrente 12x R$24,90
    if (plan === 'monthly') {
      const subscription = await createMonthlySubscription(asaasCustomerId)
      asaasSubscriptionId = subscription.id
      checkoutUrl = await getSubscriptionFirstPaymentUrl(subscription.id)
    }

    // 3b. Plano anual — cobrança única R$99,90
    if (plan === 'annual') {
      const charge = await createAnnualCharge(asaasCustomerId)
      asaasPaymentId = charge.id
      checkoutUrl = await getPaymentCheckoutUrl(charge.id)
    }

    // 4. Salva IDs do Asaas no usuário (acesso ainda PENDING)
    saveUser({
      ...user,
      asaasCustomerId,
      plan,
      accessStatus: 'pending',
      asaasSubscriptionId: asaasSubscriptionId || user.asaasSubscriptionId,
      asaasPaymentId: asaasPaymentId || user.asaasPaymentId,
    })

    return res.status(200).json({
      ok: true,
      checkoutUrl,
      // After payment, Asaas will call the webhook.
      // Frontend should redirect user to /pagamento-pendente after opening checkout.
      pendingUrl: '/pagamento-pendente',
    })
  } catch (err) {
    console.error('[checkout] Asaas error:', err.message)
    return res.status(500).json({ error: err.message || 'Erro ao criar pagamento.' })
  }
}
