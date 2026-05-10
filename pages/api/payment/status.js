// pages/api/payment/status.js
// Permite ao frontend verificar se o acesso foi liberado após pagamento
import { getSession } from '../../../lib/session'
import { getUserByUsername, isAccessActive } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getSession(req, res)
  if (!session?.userId) return res.status(401).json({ error: 'Não autenticado.' })

  const user = getUserByUsername(session.username)
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' })

  return res.status(200).json({
    plan: user.plan,
    accessStatus: user.accessStatus,
    accessActive: isAccessActive(user),
    accessUntil: user.accessUntil || null,
  })
}
