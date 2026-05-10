// lib/db.js
// Banco de dados simples em memória + arquivo JSON (para dev/demo).
// ⚠️  Em produção na Vercel, substitua por Vercel KV, PlanetScale, Supabase, etc.
// A interface (getUser / saveUser) permanece a mesma — só troque a implementação.

import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), '.lunzi-db.json')

function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
    }
  } catch (e) {}
  return { users: [] }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('DB write error:', e)
  }
}

// ── User schema ───────────────────────────────────
// {
//   id: string,
//   username: string,
//   name: string,
//   email: string,
//   passHash: string,
//   asaasCustomerId: string | null,
//   plan: 'none' | 'monthly' | 'annual',
//   accessStatus: 'active' | 'blocked' | 'pending',
//   accessUntil: string | null,       // ISO date para plano anual
//   asaasSubscriptionId: string | null,
//   asaasPaymentId: string | null,
//   createdAt: string,
// }

export function getAllUsers() {
  return readDB().users
}

export function getUserByUsername(username) {
  const db = readDB()
  return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

export function getUserByEmail(email) {
  const db = readDB()
  return db.users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null
}

export function getUserByAsaasCustomerId(asaasCustomerId) {
  const db = readDB()
  return db.users.find(u => u.asaasCustomerId === asaasCustomerId) || null
}

export function getUserByAsaasSubscriptionId(subId) {
  const db = readDB()
  return db.users.find(u => u.asaasSubscriptionId === subId) || null
}

export function getUserByAsaasPaymentId(paymentId) {
  const db = readDB()
  return db.users.find(u => u.asaasPaymentId === paymentId) || null
}

export function saveUser(user) {
  const db = readDB()
  const idx = db.users.findIndex(u => u.id === user.id)
  if (idx >= 0) {
    db.users[idx] = { ...db.users[idx], ...user }
  } else {
    db.users.push(user)
  }
  writeDB(db)
  return db.users.find(u => u.id === user.id)
}

export function createUser({ username, name, email, passHash }) {
  const db = readDB()
  if (db.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Usuário já cadastrado.')
  }
  const user = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    username,
    name,
    email: email || '',
    passHash,
    asaasCustomerId: null,
    plan: 'none',
    accessStatus: 'blocked',
    accessUntil: null,
    asaasSubscriptionId: null,
    asaasPaymentId: null,
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  writeDB(db)
  return user
}

// Utilitário: verifica se acesso está ativo
export function isAccessActive(user) {
  if (!user) return false
  if (user.accessStatus !== 'active') return false
  if (user.plan === 'annual' && user.accessUntil) {
    return new Date(user.accessUntil) > new Date()
  }
  return true
}
