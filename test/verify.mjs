import { encode, decode, createSecret } from '../dist/index.mjs'

const SECRET_KEY = '1234567890654321'
const plainText = '18669285188'
const expectedCipher = 'YqPcO7nHh3EmotCw6dzdqw=='

console.log('=== do-web-secret 验证测试 ===\n')

// 测试 1: 加密
const encrypted = encode(plainText, { key: SECRET_KEY })
console.log(`原文:       ${plainText}`)
console.log(`加密结果:   ${encrypted}`)
console.log(`期望结果:   ${expectedCipher}`)
console.log(`加密验证:   ${encrypted === expectedCipher ? '✅ 通过' : '❌ 失败'}\n`)

// 测试 2: 解密
const decrypted = decode(expectedCipher, { key: SECRET_KEY })
console.log(`密文:       ${expectedCipher}`)
console.log(`解密结果:   ${decrypted}`)
console.log(`解密验证:   ${decrypted === plainText ? '✅ 通过' : '❌ 失败'}\n`)

// 测试 3: 加密再解密
const reDecrypted = decode(encrypted, { key: SECRET_KEY })
console.log(`加密→解密:  ${reDecrypted}`)
console.log(`往返验证:   ${reDecrypted === plainText ? '✅ 通过' : '❌ 失败'}\n`)

// 测试 4: createSecret 工厂函数
const secret = createSecret(SECRET_KEY)
const e2 = secret.encode(plainText)
const d2 = secret.decode(e2)
console.log(`工厂加密:   ${e2}`)
console.log(`工厂解密:   ${d2}`)
console.log(`工厂验证:   ${e2 === expectedCipher && d2 === plainText ? '✅ 通过' : '❌ 失败'}\n`)

// 测试 5: 使用默认密钥
const e3 = encode(plainText)
const d3 = decode(e3)
console.log(`默认密钥加密: ${e3}`)
console.log(`默认密钥解密: ${d3}`)
console.log(`默认密钥验证: ${d3 === plainText ? '✅ 通过' : '❌ 失败'}\n`)

const allPassed =
  encrypted === expectedCipher &&
  decrypted === plainText &&
  reDecrypted === plainText &&
  e2 === expectedCipher &&
  d2 === plainText &&
  d3 === plainText

console.log(allPassed ? '🎉 全部测试通过！' : '💥 存在失败的测试')
process.exit(allPassed ? 0 : 1)
