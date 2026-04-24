/** AES-256 encryption for API keys stored in SQLite */
import CryptoJS from 'crypto-js'

const SECRET =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as Record<string, unknown>).env
    ? (import.meta as unknown as { env: Record<string, string> }).env.VITE_ENCRYPTION_SECRET
    : undefined) ?? 'orkestrix-local-secret'

/** Encrypt an API key with AES-256-CBC */
export function encryptKey(apiKey: string): string {
  return CryptoJS.AES.encrypt(apiKey, SECRET).toString()
}

/** Decrypt a ciphertext back to the plaintext API key */
export function decryptKey(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET)
  return bytes.toString(CryptoJS.enc.Utf8)
}

/** Return a safe visual hint for a key — last 4 chars only */
export function getKeyHint(apiKey: string): string {
  return '...' + apiKey.slice(-4)
}
