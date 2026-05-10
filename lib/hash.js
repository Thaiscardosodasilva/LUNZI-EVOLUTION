// lib/hash.js — hash simples sem dependência nativa
// Para produção com mais segurança, use bcryptjs

export function hashPassword(password) {
  let hash = 5381
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) + hash) ^ password.charCodeAt(i)
    hash = hash & hash // força 32bit
  }
  // Combina com um salt fixo derivado da senha para dificultar rainbow tables
  const salt = password.split('').reverse().join('')
  let hash2 = 0
  for (let i = 0; i < salt.length; i++) {
    hash2 = ((hash2 << 5) - hash2) + salt.charCodeAt(i)
    hash2 = hash2 & hash2
  }
  return `lz_${Math.abs(hash).toString(36)}_${Math.abs(hash2).toString(36)}`
}

export function verifyPassword(password, storedHash) {
  return hashPassword(password) === storedHash
}
