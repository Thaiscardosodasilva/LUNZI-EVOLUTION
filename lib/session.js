// lib/session.js
import { getIronSession } from 'iron-session'

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'lunzi_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  },
}

export async function getSession(req, res) {
  return getIronSession(req, res, sessionOptions)
}

// Helper: retorna sessão ou responde 401
export async function requireAuth(req, res) {
  const session = await getSession(req, res)
  if (!session?.userId) {
    res.status(401).json({ error: 'Não autenticado.' })
    return null
  }
  return session
}
