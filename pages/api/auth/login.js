// pages/api/auth/login.js
import { getUserByUsername } from '../../../lib/db'
import { verifyPassword } from '../../../lib/hash'
import { getSession } from '../../../lib/session'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'Preencha usuário e senha.' })
  }

  const user = getUserByUsername(username)
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' })
  if (!verifyPassword(password, user.passHash)) {
    return res.status(401).json({ error: 'Senha incorreta.' })
  }

  const session = await getSession(req, res)
  session.userId = user.id
  session.username = user.username
  session.name = user.name
  await session.save()

  return res.status(200).json({
    ok: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      plan: user.plan,
      accessStatus: user.accessStatus,
    },
  })
}
