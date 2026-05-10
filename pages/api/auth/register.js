// pages/api/auth/register.js
import { createUser } from '../../../lib/db'
import { hashPassword } from '../../../lib/hash'
import { getSession } from '../../../lib/session'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, name, email, password } = req.body || {}

  if (!username || !name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' })
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Usuário deve ter ao menos 3 caracteres.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres.' })
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'E-mail inválido.' })
  }

  try {
    const passHash = hashPassword(password)
    const user = createUser({ username, name, email, passHash })

    // inicia sessão automaticamente após cadastro
    const session = await getSession(req, res)
    session.userId = user.id
    session.username = user.username
    session.name = user.name
    await session.save()

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        plan: user.plan,
        accessStatus: user.accessStatus,
      },
    })
  } catch (err) {
    return res.status(409).json({ error: err.message || 'Erro ao criar conta.' })
  }
}
