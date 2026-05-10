// pages/api/webhook/asaas.js
// Recebe eventos do Asaas e atualiza o status de acesso do usuário
// URL para configurar no painel Asaas:
//   https://seu-site.vercel.app/api/webhook/asaas

import {
  getUserByAsaasCustomerId,
  getUserByAsaasSubscriptionId,
  getUserByAsaasPaymentId,
  saveUser,
} from '../../../lib/db'

// Desativa o bodyParser padrão do Next.js para ler o raw body
export const config = { api: { bodyParser: true } }

// Eventos que ATIVAM o acesso
const ACTIVATE_EVENTS = new Set([
  'PAYMENT_RECEIVED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', // ignorar – não ativa
])

// Eventos que BLOQUEIAM o acesso
const BLOCK_EVENTS = new Set([
  'PAYMENT_OVERDUE',
  'PAYMENT_DELETED',
  'PAYMENT_REFUNDED',
  'PAYMENT_REFUND_IN_PROGRESS',
  'SUBSCRIPTION_DELETED',
  'PAYMENT_CHARGEBACK_REQUESTED',
  'PAYMENT_CHARGEBACK_DISPUTE',
])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const event = req.body
  const { event: eventType, payment, subscription } = event || {}

  console.log(`[webhook] Received: ${eventType}`)

  if (!eventType) return res.status(400).json({ error: 'Evento inválido.' })

  try {
    // ── 1. Encontra o usuário pelo customer ID ──────────────────────
    const customerId = payment?.customer || subscription?.customer
    let user = customerId ? getUserByAsaasCustomerId(customerId) : null

    // fallback: busca pelo subscriptionId ou paymentId
    if (!user && subscription?.id) {
      user = getUserByAsaasSubscriptionId(subscription.id)
    }
    if (!user && payment?.id) {
      user = getUserByAsaasPaymentId(payment.id)
    }

    if (!user) {
      console.warn(`[webhook] Usuário não encontrado para customerId=${customerId}`)
      return res.status(200).json({ ok: true, note: 'user_not_found' })
    }

    // ── 2. Processa o evento ────────────────────────────────────────
    const updates = { ...user }

    // PAGAMENTO APROVADO → ativa acesso
    if (
      eventType === 'PAYMENT_RECEIVED' ||
      eventType === 'PAYMENT_CONFIRMED'
    ) {
      updates.accessStatus = 'active'

      // Para plano anual: define accessUntil = hoje + 1 ano
      if (user.plan === 'annual' && payment?.id) {
        const until = new Date()
        until.setFullYear(until.getFullYear() + 1)
        updates.accessUntil = until.toISOString()
        updates.asaasPaymentId = payment.id
      }

      // Para plano mensal: registra subscriptionId se ainda não tiver
      if (user.plan === 'monthly' && subscription?.id) {
        updates.asaasSubscriptionId = subscription.id
      }
    }

    // PAGAMENTO VENCIDO → bloqueia
    else if (eventType === 'PAYMENT_OVERDUE') {
      updates.accessStatus = 'blocked'
    }

    // ASSINATURA CANCELADA → bloqueia
    else if (eventType === 'SUBSCRIPTION_DELETED') {
      updates.accessStatus = 'blocked'
      updates.asaasSubscriptionId = null
    }

    // PAGAMENTO FALHOU / ESTORNADO → bloqueia
    else if (
      eventType === 'PAYMENT_DELETED' ||
      eventType === 'PAYMENT_REFUNDED' ||
      eventType === 'PAYMENT_CHARGEBACK_REQUESTED'
    ) {
      updates.accessStatus = 'blocked'
    }

    // ── 3. Salva atualização ────────────────────────────────────────
    saveUser(updates)
    console.log(`[webhook] User ${user.username} → accessStatus: ${updates.accessStatus}`)

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[webhook] Error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
