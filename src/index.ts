import { ecb } from '@noble/ciphers/aes.js'
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils.js'

const DEFAULT_KEY = '1234567890654321'

export interface DoWebSecretOptions {
  key?: string
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function fromBase64(str: string): Uint8Array {
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * AES/ECB/PKCS7 加密（PKCS7 等同于 Java 的 PKCS5Padding）
 * 与 Java 后端 AES/ECB/PKCS5Padding 完全兼容
 */
export function encode(plainText: string, options?: DoWebSecretOptions): string | null {
  try {
    const keyBytes = utf8ToBytes(options?.key ?? DEFAULT_KEY)
    const dataBytes = utf8ToBytes(plainText)
    const cipher = ecb(keyBytes)
    const encrypted = cipher.encrypt(dataBytes)
    return toBase64(encrypted)
  } catch (e) {
    console.error('Error encode:', e)
    return null
  }
}

/**
 * AES/ECB/PKCS7 解密
 * 与 Java 后端 AES/ECB/PKCS5Padding 完全兼容
 */
export function decode(cipherText: string, options?: DoWebSecretOptions): string | null {
  try {
    const keyBytes = utf8ToBytes(options?.key ?? DEFAULT_KEY)
    const encrypted = fromBase64(cipherText)
    const cipher = ecb(keyBytes)
    const decrypted = cipher.decrypt(encrypted)
    return bytesToUtf8(decrypted)
  } catch (e) {
    console.error('Error decode:', e)
    return null
  }
}

/**
 * 创建一个带固定密钥的加密器实例，避免每次调用都传 key
 */
export function createSecret(key: string) {
  return {
    encode: (plainText: string) => encode(plainText, { key }),
    decode: (cipherText: string) => decode(cipherText, { key }),
  }
}

export default {
  encode,
  decode,
  createSecret,
}
