# do-web-secret

- AES/ECB/PKCS5Padding 前端加密解密库，与 Java 后端完全兼容。
- /loading/u.html 用于novelsafa支付中间跳转页，对接孙嘉辉，秦文浩。找op部署 
- https://p.novelsf.com/u.html?rp=Kx64j7TAzRrHQOJ6MhQsRTYIVQmySbsK3P7mwsknIa%2B%2BAT9hiyo8%2FHFVLk7J4CZ4y9SuWM9ALJZW0xRN9KbhoCsvaNJpl%2Fp41ttLd7ePL4iEKQjH6%2Bc%2FaYasIMMipIOY9924L8ClDa%2BNAgvOa9tqTRonrMFh9BBbw%2BkiYrEDw1k%3D

## 打包 Loading 跳转页

将 AES 解密库内联到单个 HTML 文件中，用于客户端 WebView 中间跳转页，零外部依赖。

```bash
# 默认输出 loading/u.html
npm run build:loading

# 自定义文件名，输出 loading/future.html
npm run build:loading -- future

# 输出 loading/pay.html
npm run build:loading -- pay
```

产物在 `loading/` 目录下，每次打包会自动清空该目录再重新生成。

打包流程：`tsup` 构建库 → 读取 `src/loading/u.html` 模板 → 内联 IIFE 产物 → 输出到 `loading/{name}.html`

## 安装

```bash
npm install do-web-secret
```

## 使用方式

### ES Module

```js
import { encode, decode, createSecret } from 'do-web-secret'

// 加密
const encrypted = encode('18669285188', { key: '1234567890654321' })
// => "YqPcO7nHh3EmotCw6dzdqw=="

// 解密
const decrypted = decode('YqPcO7nHh3EmotCw6dzdqw==', { key: '1234567890654321' })
// => "18669285188"
```

### CommonJS

```js
const { encode, decode, createSecret } = require('do-web-secret')

const encrypted = encode('hello', { key: '1234567890654321' })
const decrypted = decode(encrypted, { key: '1234567890654321' })
```

### 浏览器 (IIFE)

```html
<script src="dist/index.global.js"></script>
<script>
  const encrypted = DoWebSecret.encode('hello', { key: '1234567890654321' })
  const decrypted = DoWebSecret.decode(encrypted, { key: '1234567890654321' })
</script>
```

### 工厂模式（推荐）

如果项目中密钥固定，推荐使用 `createSecret` 创建实例，避免每次传 key：

```js
import { createSecret } from 'do-web-secret'

const secret = createSecret('1234567890654321')

const encrypted = secret.encode('18669285188')
// => "YqPcO7nHh3EmotCw6dzdqw=="

const decrypted = secret.decode(encrypted)
// => "18669285188"
```

## API

### `encode(plainText: string, options?: { key?: string }): string | null`

AES/ECB/PKCS7 加密，返回 Base64 编码的密文。

- `plainText` - 待加密的明文
- `options.key` - 密钥（默认 `1234567890654321`），必须为 16 位

### `decode(cipherText: string, options?: { key?: string }): string | null`

AES/ECB/PKCS7 解密，返回明文字符串。

- `cipherText` - Base64 编码的密文
- `options.key` - 密钥（默认 `1234567890654321`），必须为 16 位

### `createSecret(key: string): { encode, decode }`

创建一个绑定固定密钥的加密器实例。

## 后端兼容性

本库与以下 Java 后端代码完全兼容：

```java
Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "AES");
```

验证用例：

| 明文 | 密钥 | 密文 |
|------|------|------|
| `18669285188` | `1234567890654321` | `YqPcO7nHh3EmotCw6dzdqw==` |

## 运行 Demo

```bash
npm run demo
# 打开浏览器访问 http://localhost:3000
```

## 构建

```bash
npm run build
```

## 测试

```bash
npm test
```

## License

MIT
