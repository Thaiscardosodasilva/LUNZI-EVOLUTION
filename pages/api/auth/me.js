// pages/api/auth/me.js
import { getSession } from '../../../lib/session'
import { getUserByUsername, isAccessActive } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const session = await getSession(req, res)
  if (!session?.userId) return res.status(200).json({ user: null })

  const user = getUserByUsername(session.username)
  if (!user) return res.status(200).json({ user: null })

  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      plan: user.plan,
      accessStatus: user.accessStatus,
      accessActive: isAccessActive(user),
      accessUntil: user.accessUntil,
    },
  })
}
