const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const SECRET = import.meta.env.VITE_APP_SIGNATURE_SECRET || ''

const enc = new TextEncoder()

async function hmacHex(message, key) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function signedHeaders() {
  const ts = String(Math.floor(Date.now() / 1000))
  const sig = SECRET ? await hmacHex(ts, SECRET) : ''
  return {
    'Content-Type': 'application/json',
    'X-Client-Timestamp': ts,
    'X-App-Signature': sig,
  }
}

async function signedFetch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: await signedHeaders(),
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function getMenu() {
  const res = await fetch(`${API_BASE}/api/orders/menu/`)
  if (!res.ok) throw new Error(`Menu failed (${res.status})`)
  const data = await res.json()
  return data.items || []
}

export function sendOtp(payload) {
  return signedFetch('/api/orders/send-otp/', payload)
}

export function verifyOtp(payload) {
  return signedFetch('/api/orders/verify-otp/', payload)
}

export const API_BASE_URL = API_BASE